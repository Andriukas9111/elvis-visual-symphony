
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, MoveUp, MoveDown, Loader2 } from 'lucide-react';
import IconSelector from '../ui/IconSelector';
import SavedIndicator from '../ui/SavedIndicator';
import FormError from '../ui/FormError';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  background_color: string;
  text_color?: string;
  order_index: number;
}

const SocialLinksForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: socialLinks, isLoading } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .order('order_index');
          
        if (error) throw error;
        return data as SocialLink[];
      } catch (error: any) {
        setError(`Failed to load social links: ${error.message}`);
        throw error;
      }
    }
  });
  
  const createLinkMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        const nextIndex = socialLinks?.length ? Math.max(...socialLinks.map(s => s.order_index || 0)) + 1 : 0;
        
        const newLink = {
          platform: 'Instagram',
          url: 'https://instagram.com/',
          icon: 'lucide-instagram',
          background_color: '#E1306C',
          text_color: '#FFFFFF',
          order_index: nextIndex
        };
        
        const { data, error } = await supabase
          .from('social_links')
          .insert([newLink])
          .select();
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return data[0];
      } catch (error: any) {
        setError(`Failed to create new social link: ${error.message}`);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
    }
  });
  
  const updateLinkMutation = useMutation({
    mutationFn: async (link: SocialLink) => {
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('social_links')
          .update({
            platform: link.platform,
            url: link.url,
            icon: link.icon,
            background_color: link.background_color,
            text_color: link.text_color
          })
          .eq('id', link.id)
          .select();
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return data[0];
      } catch (error: any) {
        setError(`Failed to update social link: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
    }
  });
  
  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      setError(null);
      
      try {
        const { error } = await supabase
          .from('social_links')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return id;
      } catch (error: any) {
        setError(`Failed to delete social link: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
    }
  });
  
  const moveLinkMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        if (!socialLinks) return null;
        
        const currentIndex = socialLinks.findIndex(s => s.id === id);
        if (currentIndex === -1) return null;
        
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= socialLinks.length) return null;
        
        const currentLink = socialLinks[currentIndex];
        const targetLink = socialLinks[targetIndex];
        
        // Swap order_index values
        const updates = [
          { id: currentLink.id, order_index: targetLink.order_index },
          { id: targetLink.id, order_index: currentLink.order_index }
        ];
        
        // Update both items
        for (const update of updates) {
          const { error } = await supabase
            .from('social_links')
            .update({ order_index: update.order_index })
            .eq('id', update.id);
            
          if (error) throw error;
        }
        
        setLastSaved(new Date());
        return { success: true };
      } catch (error: any) {
        setError(`Failed to reorder social links: ${error.message}`);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-elvis-pink" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Social Links</CardTitle>
          <SavedIndicator lastSaved={lastSaved} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <FormError error={error} />
        
        <div className="flex justify-end">
          <Button
            onClick={() => createLinkMutation.mutate()}
            disabled={isSubmitting}
            className="bg-elvis-pink hover:bg-elvis-pink/90"
          >
            {createLinkMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Social Link
          </Button>
        </div>
        
        <div className="space-y-4">
          {socialLinks?.map((link, index) => (
            <SocialLinkCard
              key={link.id}
              link={link}
              onSave={(updatedLink) => updateLinkMutation.mutate(updatedLink)}
              onDelete={() => {
                if (window.confirm('Are you sure you want to delete this social link?')) {
                  deleteLinkMutation.mutate(link.id);
                }
              }}
              onMove={(direction) => moveLinkMutation.mutate({ id: link.id, direction })}
              isFirst={index === 0}
              isLast={index === socialLinks.length - 1}
              isSubmitting={isSubmitting}
            />
          ))}
          
          {socialLinks?.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No social links found. Click the "Add Social Link" button to create your first link.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface SocialLinkCardProps {
  link: SocialLink;
  onSave: (link: SocialLink) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  isSubmitting: boolean;
}

const SocialLinkCard: React.FC<SocialLinkCardProps> = ({
  link,
  onSave,
  onDelete,
  onMove,
  isFirst,
  isLast,
  isSubmitting
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localLink, setLocalLink] = useState<SocialLink>(link);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (field: keyof SocialLink, value: any) => {
    setLocalLink(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(localLink);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="bg-elvis-medium">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{link.platform}</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMove('up')}
              disabled={isFirst || isSubmitting}
              className="h-8 w-8 p-0"
            >
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMove('down')}
              disabled={isLast || isSubmitting}
              className="h-8 w-8 p-0"
            >
              <MoveDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8 p-0"
            >
              {isEditing ? "Done" : "Edit"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              disabled={isSubmitting}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-200/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor={`platform-${link.id}`}>Platform Name</Label>
              <Input
                id={`platform-${link.id}`}
                value={localLink.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="bg-elvis-dark"
              />
            </div>
            
            <div>
              <Label htmlFor={`url-${link.id}`}>URL</Label>
              <Input
                id={`url-${link.id}`}
                value={localLink.url}
                onChange={(e) => handleChange('url', e.target.value)}
                className="bg-elvis-dark"
              />
            </div>
            
            <div>
              <Label htmlFor={`icon-${link.id}`}>Icon</Label>
              <IconSelector
                value={localLink.icon}
                onChange={(value) => handleChange('icon', value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`bg-${link.id}`}>Background Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded border border-white/20" 
                    style={{ backgroundColor: localLink.background_color }}
                  />
                  <Input
                    id={`bg-${link.id}`}
                    type="text"
                    value={localLink.background_color}
                    onChange={(e) => handleChange('background_color', e.target.value)}
                    className="bg-elvis-dark"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`text-${link.id}`}>Text Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded border border-white/20" 
                    style={{ backgroundColor: localLink.text_color }}
                  />
                  <Input
                    id={`text-${link.id}`}
                    type="text"
                    value={localLink.text_color || '#FFFFFF'}
                    onChange={(e) => handleChange('text_color', e.target.value)}
                    className="bg-elvis-dark"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-3">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || isSubmitting}
                className="w-full bg-elvis-pink hover:bg-elvis-pink/90"
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: link.background_color, color: link.text_color || '#FFFFFF' }}
            >
              <i className={link.icon}></i>
            </div>
            
            <div className="flex-1">
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-elvis-pink hover:underline text-sm"
              >
                {link.url}
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialLinksForm;
