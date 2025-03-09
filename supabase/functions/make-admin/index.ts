
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
    
    // Get email from request body or use default
    let email = "fearas2@gmail.com"; // Default email if none provided
    
    try {
      const body = await req.json();
      if (body && body.email) {
        email = body.email;
      }
    } catch (parseError) {
      console.log("No JSON body or error parsing it, using default email:", email);
    }

    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`Making user ${email} an admin`);

    // First check if user exists in auth.users
    let userId = null;
    let userExists = false;
    
    try {
      const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (userError) {
        console.error("Error finding user:", userError);
      } else if (user && user.user) {
        userExists = true;
        userId = user.user.id;
        console.log("Found existing user with ID:", userId);
      }
    } catch (error) {
      console.error("Error checking if user exists:", error);
      // Continue with the process even if this check fails
    }
    
    if (!userExists) {
      console.log("User not found, creating a new admin user");
      
      // Generate a secure random password
      const password = Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2);
      
      try {
        // Create the user with the generated password
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: email,
          password: password,
          email_confirm: true,
          user_metadata: { full_name: "Admin User" }
        });
        
        if (createError) {
          console.error("Error creating user:", createError);
          throw new Error(`Error creating user: ${createError.message}`);
        }
        
        userId = newUser.user.id;
        console.log("Created new user with ID:", userId);
        
        // Check if profile exists
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();
          
        if (profileCheckError && profileCheckError.code !== 'PGRST116') {
          console.error("Error checking profile:", profileCheckError);
        }
        
        if (!existingProfile) {
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: "Admin User",
              role: 'admin'
            });
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
            throw new Error(`Error creating profile: ${insertError.message}`);
          }
          
          console.log("Created new profile with admin role");
        } else {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
            
          if (updateError) {
            console.error("Error updating profile role:", updateError);
            throw new Error(`Error updating profile: ${updateError.message}`);
          }
          
          console.log("Updated existing profile to admin role");
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Admin user ${email} created successfully`,
            credentials: {
              email: email,
              password: password,
              note: "Please change this password after logging in"
            }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      } catch (error) {
        console.error("Error in user creation process:", error);
        throw error;
      }
    }
    
    // User exists, update their role in the profiles table
    // First check if the profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error finding profile:", profileError);
      throw new Error(`Error finding profile: ${profileError.message}`);
    }
    
    if (!profile) {
      // Create a new profile with admin role
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          role: 'admin'
        });
        
      if (insertError) {
        console.error("Error creating profile:", insertError);
        throw new Error(`Error creating profile: ${insertError.message}`);
      }
      
      console.log("Created new profile with admin role for existing user");
    } else {
      // Update the profile role
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);
        
      if (updateError) {
        console.error("Error updating role:", updateError);
        throw new Error(`Error updating role: ${updateError.message}`);
      }
      
      console.log("Updated existing profile to admin role");
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `User ${email} is now an admin`,
        note: "User already existed, their role has been updated to admin"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error making user admin:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
