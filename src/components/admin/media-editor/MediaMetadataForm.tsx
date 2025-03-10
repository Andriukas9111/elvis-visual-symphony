
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Youtube } from 'lucide-react';
import { isYoutubeUrl } from '@/components/portfolio/video-player/utils';

interface MediaFormFields {
  title: string;
  slug: string;
  description: string;
  category: string;
  orientation: string;
  video_url?: string;
}

interface MediaMetadataFormProps {
  formData: MediaFormFields;
  availableCategories: string[];
  mediaType: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const MediaMetadataForm: React.FC<MediaMetadataFormProps> = ({
  formData,
  availableCategories,
  mediaType,
  onChange,
}) => {
  const isYoutubeVideo = mediaType === 'video' && isYoutubeUrl(formData.video_url || '');
  const isYoutubeShort = isYoutubeVideo && (formData.video_url?.includes('/shorts/'));
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
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
            onChange={onChange}
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
          onChange={onChange}
          className="bg-elvis-medium border-white/10 min-h-[100px]"
        />
      </div>

      {mediaType === 'video' && (
        <div className="space-y-2">
          <Label htmlFor="video_url">
            {isYoutubeVideo ? (isYoutubeShort ? 'YouTube Shorts URL' : 'YouTube URL') : 'Video URL'}
          </Label>
          <Input
            id="video_url"
            name="video_url"
            value={formData.video_url || ''}
            onChange={onChange}
            className="bg-elvis-medium border-white/10"
            placeholder={isYoutubeVideo ? (isYoutubeShort ? "YouTube Shorts URL" : "YouTube URL") : "Video URL"}
          />
          {isYoutubeVideo && (
            <div className="text-xs text-white/60 flex items-center mt-1">
              <Youtube className="h-3 w-3 mr-1" /> 
              {isYoutubeShort ? 'YouTube Short' : 'YouTube video'}
              {isYoutubeShort && 
                <span className="ml-2 text-elvis-pink">(Vertical orientation set automatically)</span>
              }
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
              onChange={onChange}
              className="bg-elvis-medium border-white/10"
              list="categories"
              required
            />
            <datalist id="categories">
              {availableCategories.map(category => (
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
            onChange={onChange}
            className="w-full bg-elvis-medium border border-white/10 rounded-md px-3 py-2 text-white"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
            <option value="square">Square</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default MediaMetadataForm;
