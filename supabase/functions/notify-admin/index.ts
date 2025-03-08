
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://lxlaikphdjcjjtyxfvpz.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationData {
  type: "new_order" | "new_hire_request" | "low_stock" | "custom";
  title: string;
  message: string;
  data?: any;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get request body
    const notificationData: NotificationData = await req.json();
    
    // Validate required fields
    if (!notificationData.type || !notificationData.title || !notificationData.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get admin users
    const { data: admins, error: adminsError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("role", "admin");

    if (adminsError) {
      console.error("Error fetching admins:", adminsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch admin users" }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Store notification in a hypothetical notifications table
    // This would be implemented if you had a notifications table
    // For now, we'll just log the notification
    console.log("Notification for admins:", notificationData);
    console.log("Admin users:", admins);

    // Here you would also implement any external notification service
    // like sending emails, SMS, or push notifications

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent" }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error processing notification:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
