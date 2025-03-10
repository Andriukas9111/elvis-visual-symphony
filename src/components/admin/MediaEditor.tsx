import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Check, X, Tag, ImagePlus, Youtube } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { v4 as uuidv4 } from 'uuid';
import VideoPlayer from '@/components/shared/VideoPlayer';

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
  
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [available_categories, setAvailableCategories] = useState<string[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(media.thumbnail_url || null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="bg-elvis-medium border-white/10"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="bg-elvis-medium border-white/10"
                placeholder="auto-generated-if-empty"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-elvis-medium border-white/10 min-h-[100px]"
            />
          </div>

          {media.type === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="bg-elvis-medium border-white/10"
                placeholder="Enter video URL"
              />
              
              {formData.video_url && (
                <div className="mt-2 bg-elvis-medium rounded-lg overflow-hidden">
                  <VideoPlayer
                    videoUrl={formData.video_url}
                    thumbnailUrl={thumbnailPreview || undefined}
                    title={formData.title}
                    isVertical={formData.orientation === 'vertical'}
                  />
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="flex gap-2">
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-elvis-medium border-white/10"
                  list="categories"
                  required
                />
                <datalist id="categories">
                  {available_categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orientation">Orientation</Label>
              <select
                id="orientation"
                name="orientation"
                value={formData.orientation}
                onChange={handleChange}
                className="w-full bg-elvis-medium border border-white/10 rounded-md px-3 py-2 text-white"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
                <option value="square">Square</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newTag">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="newTag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-elvis-medium border-white/10"
                placeholder="Add tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button 
                type="button"
                variant="outline"
                onClick={handleAddTag}
                className="border-white/10 hover:bg-elvis-pink/20"
              >
                <Tag className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="flex items-center gap-1 px-3 py-1 bg-elvis-medium/50"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-full hover:bg-white/10 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="space-y-3 pt-2">
            <Label>Thumbnail</Label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                {thumbnailPreview ? (
                  <div className="relative group">
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail" 
                      className="w-full aspect-video object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailPreview(null);
                        setThumbnailFile(null);
                      }}
                      className="absolute top-2 right-2 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-8 cursor-pointer hover:border-elvis-pink/50 transition-all duration-300 aspect-video"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    <ImagePlus className="h-10 w-10 text-white/40 mb-2" />
                    <p className="text-sm text-white/60">Click to upload thumbnail</p>
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col space-y-4">
                <input
                  type="file"
                  ref={thumbnailInputRef}
                  className="hidden"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                />
                
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="border-white/10 hover:bg-elvis-pink/20"
                  disabled={isUploadingThumbnail}
                >
                  {isUploadingThumbnail ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="mr-2 h-4 w-4" />
                      {thumbnailPreview ? 'Change Thumbnail' : 'Upload Thumbnail'}
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-white/60">
                  Recommended: 16:9 ratio image for best display across the site
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="published">Published</Label>
                <div className="text-white/60 text-sm">
                  Make this media visible on the website
                </div>
              </div>
              <Switch
                id="published"
                checked={formData.is_published}
                onCheckedChange={(checked) => handleSwitchChange('is_published', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Featured</Label>
                <div className="text-white/60 text-sm">
                  Show this media in featured sections
                </div>
              </div>
              <Switch
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
              />
            </div>
          </div>
          
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
