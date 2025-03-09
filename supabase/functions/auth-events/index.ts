
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { action, email, adminAction, userId, newRole } = await req.json();

    console.log(`Processing auth event: ${action} for ${email}`);

    switch (action) {
      case "PASSWORD_RECOVERY":
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${req.headers.get("origin")}/reset-password`,
        });
        
        if (resetError) throw resetError;
        
        return new Response(
          JSON.stringify({ success: true, message: "Password reset email sent" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      
      case "USER_SIGNUP":
        const { user_id, user_metadata } = await req.json();
        
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user_id)
          .single();
          
        if (!existingProfile) {
          // Create profile if it doesn't exist
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([{
              id: user_id,
              full_name: user_metadata?.full_name || "",
              role: "user" // Default role
            }]);
            
          if (profileError) throw profileError;
        }
        
        return new Response(
          JSON.stringify({ success: true, message: "User profile created" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      
      case "ADMIN_ACTIONS":
        // For admin actions, we need to be more permissive since this might be called from authenticated edge function
        if (adminAction === "UPDATE_ROLE") {
          // If we're called from another edge function with service role, we don't need to check auth
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: newRole })
            .eq("id", userId);
            
          if (updateError) throw updateError;
          
          return new Response(
            JSON.stringify({ success: true, message: "User role updated" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
          );
        }
        
        if (adminAction === "MAKE_USER_ADMIN") {
          // Find the user by email
          const { data: users, error: userQueryError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', email.split('@')[0].toLowerCase());
          
          if (userQueryError || !users || users.length === 0) {
            throw new Error(`User with email ${email} not found`);
          }
          
          // Update the user's role
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', users[0].id);
            
          if (updateError) throw updateError;
          
          return new Response(
            JSON.stringify({ success: true, message: `User ${email} is now an admin` }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
          );
        }
        
        throw new Error("Unknown admin action");
      
      default:
        throw new Error("Unknown action");
    }
  } catch (error) {
    console.error("Error processing auth event:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
