
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
    const { email } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`Making user ${email} an admin`);

    // Extract username from email (part before @)
    const username = email.split('@')[0].toLowerCase();
    
    // Look up user by username in profiles table
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username);
    
    if (profileError) {
      console.error("Error looking up profile:", profileError);
      throw new Error(`Error looking up profile: ${profileError.message}`);
    }
    
    if (!profiles || profiles.length === 0) {
      throw new Error(`User with email ${email} not found`);
    }
    
    console.log(`Found user profile with ID: ${profiles[0].id}`);
    
    // Update the user's role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', profiles[0].id);
    
    if (updateError) {
      console.error("Error updating role:", updateError);
      throw updateError;
    }
    
    return new Response(
      JSON.stringify({ success: true, message: `User ${email} is now an admin` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error making user admin:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
