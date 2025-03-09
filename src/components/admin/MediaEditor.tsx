
import React, { useState, useEffect } from 'react';
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
import { Loader2, Save, Check, X, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

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
  });
  
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [available_categories, setAvailableCategories] = useState<string[]>([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Generate slug if empty
      let slug = formData.slug.trim();
      if (!slug) {
        slug = formData.title.toLowerCase().replace(/\s+/g, '-');
      }
      
      const { data, error } = await supabase
        .from('media')
        .update({
          ...formData,
          slug: slug
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
              disabled={isLoading}
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
