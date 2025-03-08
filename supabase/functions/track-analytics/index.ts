
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://lxlaikphdjcjjtyxfvpz.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyticsEvent {
  event_name: string;
  event_data: any;
  user_id?: string | null;
  session_id: string;
  page_url: string;
  referrer?: string;
  user_agent?: string;
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
    const eventData: AnalyticsEvent = await req.json();
    
    // Validate required fields
    if (!eventData.event_name || !eventData.session_id || !eventData.page_url) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Add timestamp
    const event = {
      ...eventData,
      timestamp: new Date().toISOString(),
    };

    // Log the analytics event for now
    // In a real implementation, you would store this in a database table
    console.log("Analytics event:", event);

    // Create Supabase admin client
    // This would be used if we had an analytics_events table
    /*
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Store the event
    const { data, error } = await supabaseAdmin
      .from("analytics_events")
      .insert([event]);

    if (error) {
      console.error("Error storing analytics event:", error);
      return new Response(
        JSON.stringify({ error: "Failed to store analytics event" }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    */

    return new Response(
      JSON.stringify({ success: true, message: "Event tracked" }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error processing analytics event:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
