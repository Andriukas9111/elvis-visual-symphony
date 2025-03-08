
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

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
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing download token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate the download token using the database function
    const { data, error } = await supabase.rpc("validate_download_token", {
      token: token,
    });

    if (error || !data || data.length === 0) {
      console.error("Download validation error:", error);
      return new Response(JSON.stringify({ 
        error: "Invalid or expired download link",
        details: error?.message
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fileInfo = data[0];
    if (!fileInfo.file_url) {
      return new Response(JSON.stringify({ error: "Product file not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If we've reached download limit, return an error
    if (fileInfo.download_count > fileInfo.max_downloads) {
      return new Response(JSON.stringify({ 
        error: "Download limit exceeded",
        count: fileInfo.download_count,
        limit: fileInfo.max_downloads
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a signed URL for the file
    const fileUrl = fileInfo.file_url;
    let fileResponse;

    // If it's a Supabase storage URL, create a signed URL
    if (fileUrl.includes("storage.googleapis.com") || fileUrl.includes("supabase.co/storage")) {
      // Extract bucket and path from Supabase URL
      const urlParts = fileUrl.split("/storage/v1/object/public/");
      if (urlParts.length < 2) {
        return new Response(JSON.stringify({ error: "Invalid file URL format" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const [bucket, objectPath] = urlParts[1].split("/", 1);
      const path = urlParts[1].substring(bucket.length + 1);
      
      const { data: signedURL, error: signedURLError } = await supabase
        .storage
        .from(bucket)
        .createSignedUrl(path, 60); // 60 seconds expiry
      
      if (signedURLError || !signedURL) {
        console.error("Signed URL error:", signedURLError);
        return new Response(JSON.stringify({ error: "Failed to generate download link" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Redirect to the signed URL
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          "Location": signedURL.signedUrl,
        },
      });
    } else {
      // For external URLs, simply redirect
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          "Location": fileUrl,
        },
      });
    }
  } catch (error) {
    console.error(`Error processing download: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
