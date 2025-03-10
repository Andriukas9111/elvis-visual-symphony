
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { getYoutubeId, isYoutubeUrl } from '@/components/portfolio/video-player/utils';

// Import the new subcomponents
import MediaMetadataForm from './media-editor/MediaMetadataForm';
import ThumbnailUploader from './media-editor/ThumbnailUploader';
import TagManager from './media-editor/TagManager';
import PublishingOptions from './media-editor/PublishingOptions';

interface MediaEditorProps {
  media: any;
  onUpdate: (updatedMedia: any) => void;
  onClose?: () => void;
}

const MediaEditor: React.FC<MediaEditorProps> = ({ media, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    title: media.title || '',
    slug: media.slug || '',
    description: media.description || '',
    category: media.category || '',
    is_published: media.is_published || false,
    is_featured: media.is_featured || false,
    tags: media.tags || [],
    video_url: media.video_url || '',
    orientation: media.orientation || 'horizontal',
  });
  
  const [available_categories, setAvailableCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(media.thumbnail_url || null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get unique categories from the media table
        const { data, error } = await supabase
          .from('media')
          .select('category')
          .not('category', 'is', null);
          
        if (error) throw error;
        
        const uniqueCategories = Array.from(
          new Set((data || []).map(item => item.category))
        ).filter(Boolean) as string[];
        
        setAvailableCategories(uniqueCategories);
      } catch (error: any) {
        console.error('Error fetching categories:', error.message);
      }
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for video_url to detect orientation for YouTube Shorts
    if (name === 'video_url' && isYoutubeUrl(value)) {
      const isShort = value.includes('/shorts/');
      
      // If it's a short, update orientation to vertical
      if (isShort) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          orientation: 'vertical',
          category: prev.category === 'youtube' ? 'youtube-shorts' : prev.category
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleThumbnailChange = (file: File | null) => {
    if (file) {
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
      setThumbnailFile(null);
    }
  };

  const uploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnailFile) return null;
    
    setIsUploadingThumbnail(true);
    try {
      // Generate a unique filename
      const fileExt = thumbnailFile.name.split('.').pop();
      const filePath = `thumbnails/${uuidv4()}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, thumbnailFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
        
      setIsUploadingThumbnail(false);
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading thumbnail:', error.message);
      toast({
        title: 'Thumbnail upload failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsUploadingThumbnail(false);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Generate slug if empty
      let slug = formData.slug.trim();
      if (!slug) {
        slug = formData.title.toLowerCase().replace(/\s+/g, '-');
      }
      
      // If video_url is a YouTube URL, ensure proper formatting
      let videoUrl = formData.video_url;
      if (isYoutubeUrl(videoUrl)) {
        const youtubeId = getYoutubeId(videoUrl);
        if (youtubeId) {
          videoUrl = `https://www.youtube.com/embed/${youtubeId}`;
          
          // Check if it's a short and update category and orientation if needed
          const isShort = formData.video_url.includes('/shorts/');
          if (isShort && formData.orientation !== 'vertical') {
            formData.orientation = 'vertical';
          }
          
          // Add YouTube-related tags if not already present
          if (!formData.tags.includes('youtube')) {
            formData.tags = [...formData.tags, 'youtube'];
          }
          
          if (isShort && !formData.tags.includes('shorts')) {
            formData.tags = [...formData.tags, 'shorts'];
          }
        }
      }
      
      // If a new thumbnail was selected, upload it
      let thumbnailUrl = null;
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
        if (!thumbnailUrl) {
          throw new Error('Failed to upload thumbnail');
        }
      }
      
      const { data, error } = await supabase
        .from('media')
        .update({
          ...formData,
          slug: slug,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl || media.thumbnail_url,
        })
        .eq('id', media.id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: 'Media updated',
        description: 'Media details have been successfully updated.',
      });
      
      onUpdate(data);
    } catch (error: any) {
      console.error('Error updating media:', error.message);
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-elvis-light border-none">
      <CardHeader>
        <CardTitle className="text-xl">Edit Media</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <MediaMetadataForm 
            formData={formData}
            availableCategories={available_categories}
            mediaType={media.type}
            onChange={handleChange}
          />
          
          <TagManager 
            tags={formData.tags}
            onTagsChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
          />
          
          <ThumbnailUploader 
            thumbnailPreview={thumbnailPreview}
            isUploadingThumbnail={isUploadingThumbnail}
            onThumbnailChange={handleThumbnailChange}
          />
          
          <PublishingOptions 
            isPublished={formData.is_published}
            isFeatured={formData.is_featured}
            onPublishedChange={(checked) => handleSwitchChange('is_published', checked)}
            onFeaturedChange={(checked) => handleSwitchChange('is_featured', checked)}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/10"
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit"
              className="bg-elvis-pink hover:bg-elvis-pink/80"
              disabled={isLoading || isUploadingThumbnail}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MediaEditor;
