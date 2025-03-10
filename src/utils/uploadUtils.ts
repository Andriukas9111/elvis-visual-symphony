
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Supabase storage
 */
export const uploadFileToStorage = async (
  file: File, 
  contentType: string, 
  onProgressUpdate: (progress: number) => void
): Promise<{ publicUrl: string; filePath: string; bucket: string }> => {
  // Generate unique filename
  const uniqueId = uuidv4();
  const extension = file.name.split('.').pop()?.toLowerCase();
  const filePath = `${uniqueId}.${extension}`;
  
  // Determine the appropriate bucket based on file type
  const isVideo = contentType.startsWith('video/');
  const bucket = isVideo ? 'videos' : 'media';

  console.log(`Uploading ${contentType} to ${bucket} bucket: ${filePath}`);
  
  // For larger files, use chunked upload
  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  
  if (file.size <= chunkSize) {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: contentType,
        duplex: 'half'
      });

    if (uploadError) throw uploadError;
    onProgressUpdate(50);
  } else {
    const totalChunks = Math.ceil(file.size / chunkSize);
    let uploadedBytes = 0;
    
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min((chunkIndex + 1) * chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      const { error: chunkError } = await supabase.storage
        .from(bucket)
        .upload(filePath, chunk, {
          cacheControl: '3600',
          upsert: true,
          contentType: contentType,
          duplex: 'half'
        });
        
      if (chunkError) throw chunkError;
      
      uploadedBytes += (end - start);
      onProgressUpdate(15 + Math.round((uploadedBytes / file.size) * 45));
    }
  }
  
  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  if (!urlData.publicUrl) {
    throw new Error('Failed to get public URL for uploaded file');
  }
  
  return { 
    publicUrl: urlData.publicUrl,
    filePath,
    bucket
  };
};

/**
 * Creates a media entry in the Supabase database
 */
export const createMediaEntry = async (
  mediaData: {
    title: string;
    url: string;
    type: 'image' | 'video';
    thumbnail_url?: string | null;
    video_url?: string;
    orientation: string;
    file_size: number;
    file_format: string;
    original_filename: string;
    duration?: number;
  }
): Promise<any> => {
  const mediaInsertData: any = {
    title: mediaData.title,
    slug: mediaData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: '',
    type: mediaData.type,
    category: 'uncategorized',
    url: mediaData.url,
    thumbnail_url: mediaData.type === 'image' ? mediaData.url : mediaData.thumbnail_url,
    is_published: false,
    orientation: mediaData.orientation,
    file_size: mediaData.file_size,
    file_format: mediaData.file_format,
    original_filename: mediaData.original_filename,
    processing_status: 'completed',
  };

  // If it's a video, set the video_url to the same URL
  if (mediaData.type === 'video') {
    mediaInsertData.video_url = mediaData.url;
    
    // Add duration if available
    if (mediaData.duration) {
      mediaInsertData.duration = mediaData.duration;
    }
  }
  
  const { data, error } = await supabase
    .from('media')
    .insert([mediaInsertData])
    .select()
    .single();

  if (error) throw error;
  
  return data;
};
