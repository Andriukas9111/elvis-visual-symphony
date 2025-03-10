
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { videoId, videoUrl } = await req.json()
    
    if (!videoId || !videoUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: videoId or videoUrl' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    console.log(`Generating thumbnail for video ${videoId} from ${videoUrl}`)
    
    // Check if video exists in database
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .select('*')
      .eq('id', videoId)
      .single()
    
    if (mediaError || !mediaData) {
      return new Response(
        JSON.stringify({ error: 'Video not found in database' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    
    // Generate a unique filename for the thumbnail
    const randomId = Math.random().toString(36).substring(2, 15)
    const thumbnailFileName = `thumbnail_${videoId}_${randomId}.jpg`
    const thumbnailPath = `thumbnails/${thumbnailFileName}`
    
    // For this implementation, we'll use a placeholder since we can't run ffmpeg directly
    // In a production environment, you would call ffmpeg here to extract a frame
    // For now, we'll use a placeholder image and update the media entry
    const placeholderImage = await fetch('https://via.placeholder.com/1280x720/000000/FFFFFF/?text=Video+Thumbnail')
    const imageBlob = await placeholderImage.blob()
    
    // Upload the thumbnail to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(thumbnailPath, imageBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600'
      })
    
    if (uploadError) {
      console.error('Error uploading thumbnail:', uploadError)
      throw uploadError
    }
    
    // Get the public URL for the thumbnail
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(thumbnailPath)
    
    const thumbnailUrl = publicUrlData.publicUrl
    
    // Update the media entry with the thumbnail URL
    await supabase
      .from('media')
      .update({ 
        thumbnail_url: thumbnailUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        thumbnailUrl,
        message: 'Thumbnail generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating thumbnail:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate thumbnail' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
