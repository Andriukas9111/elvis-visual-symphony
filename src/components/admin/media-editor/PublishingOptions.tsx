
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PublishingOptionsProps {
  isPublished: boolean;
  isFeatured: boolean;
  onPublishedChange: (checked: boolean) => void;
  onFeaturedChange: (checked: boolean) => void;
}

const PublishingOptions: React.FC<PublishingOptionsProps> = ({
  isPublished,
  isFeatured,
  onPublishedChange,
  onFeaturedChange,
}) => {
  return (
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
          checked={isPublished}
          onCheckedChange={onPublishedChange}
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
          checked={isFeatured}
          onCheckedChange={onFeaturedChange}
        />
      </div>
    </div>
  );
};

export default PublishingOptions;
