
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
      
      case "ADMIN_ACTIONS":
        // Only allow authenticated admins to perform these actions
        const authHeader = req.headers.get("Authorization")?.split(" ")[1];
        if (!authHeader) throw new Error("Missing authorization header");
        
        const { data: { user } } = await supabase.auth.getUser(authHeader);
        if (!user) throw new Error("Unauthorized");
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
          
        if (profile?.role !== "admin") throw new Error("Unauthorized, admin role required");
        
        if (adminAction === "UPDATE_ROLE") {
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
