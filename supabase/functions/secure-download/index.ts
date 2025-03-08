
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { corsHeaders } from '../_shared/cors.ts'

interface ValidateDownloadResponse {
  product_id: string
  file_url: string
  download_count: number
  max_downloads: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the download token from the request headers
    const token = req.headers.get('token')
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing download token' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate the download token
    const { data, error } = await supabaseClient.rpc(
      'validate_download_token',
      { token }
    )

    if (error) {
      console.error('Token validation error:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid or expired download token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const validationResult = data as ValidateDownloadResponse[]
    
    if (!validationResult || validationResult.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired download token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { file_url, download_count, max_downloads } = validationResult[0]

    if (!file_url) {
      return new Response(
        JSON.stringify({ error: 'Product file not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate a signed URL for the file (temporary URL that expires)
    // This assumes the file_url is a path in a storage bucket
    const { data: signedUrl, error: signedUrlError } = await supabaseClient
      .storage
      .from('products')
      .createSignedUrl(file_url, 60) // URL expires in 60 seconds

    if (signedUrlError) {
      console.error('Signed URL generation error:', signedUrlError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate download URL' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return the download URL and remaining download count information
    return new Response(
      JSON.stringify({ 
        url: signedUrl,
        remaining_downloads: max_downloads - download_count,
        max_downloads
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Secure download error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
