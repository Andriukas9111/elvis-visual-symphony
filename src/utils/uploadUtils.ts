
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { determineContentType, validateFileType } from './fileUtils';

export const uploadFileToStorage = async (
  file: File, 
  contentType: string, 
  onProgressUpdate: (progress: number) => void
): Promise<{ publicUrl: string; filePath: string; bucket: string }> => {
  // Generate unique filename
  const uniqueId = uuidv4();
  const extension = file.name.split('.').pop()?.toLowerCase();
  const filePath = `${uniqueId}.${extension}`;
  
  // Determine the appropriate bucket and MIME type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'mkv'];
  const isVideo = contentType.startsWith('video/') || 
                  (contentType === 'application/octet-stream' && fileExtension && videoExtensions.includes(fileExtension));
  const bucket = isVideo ? 'videos' : 'media';

  // Determine final content type
  let finalContentType = contentType;
  if (contentType === 'application/octet-stream' && extension) {
    const mimeTypeMap: Record<string, string> = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'wmv': 'video/x-ms-wmv',
      'mkv': 'video/x-matroska'
    };
    
    if (mimeTypeMap[extension]) {
      finalContentType = mimeTypeMap[extension];
      console.log(`Overriding MIME type from ${contentType} to ${finalContentType} based on extension .${extension}`);
    }
  }

  console.log(`Uploading file to ${bucket} bucket: ${filePath} with content type: ${finalContentType}`);
  
  // Attempt direct upload first
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: finalContentType,
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) throw uploadError;
  onProgressUpdate(50);
  
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

// Add the missing createMediaEntry function
export const createMediaEntry = async (mediaData: {
  title: string;
  url: string;
  type: 'image' | 'video';
  thumbnail_url: string | null;
  video_url?: string;
  orientation: string;
  file_size: number;
  file_format: string;
  original_filename: string;
  duration?: number;
}): Promise<any> => {
  try {
    console.log('Creating media entry in database:', mediaData);
    
    // Generate a slug from the title
    const slug = mediaData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Prepare the data for insertion
    const newMedia = {
      title: mediaData.title,
      url: mediaData.url,
      type: mediaData.type,
      thumbnail_url: mediaData.thumbnail_url,
      video_url: mediaData.video_url,
      slug: `${slug}-${Date.now().toString().substring(9)}`, // Add timestamp suffix to ensure uniqueness
      orientation: mediaData.orientation,
      is_published: true,
      is_featured: false,
      file_size: mediaData.file_size,
      file_format: mediaData.file_format,
      original_filename: mediaData.original_filename,
      tags: mediaData.type === 'video' ? ['video'] : ['image'],
      duration: mediaData.duration,
      sort_order: 0, // Default sort order
      category: mediaData.type === 'video' ? 'videos' : 'images', // Default category based on type
    };
    
    // Insert the media entry into the database
    const { data, error } = await supabase
      .from('media')
      .insert(newMedia)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating media entry:', error);
      throw error;
    }
    
    console.log('Media entry created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create media entry:', error);
    throw error;
  }
};
