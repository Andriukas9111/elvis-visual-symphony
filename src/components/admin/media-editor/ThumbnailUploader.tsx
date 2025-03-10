
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, ImagePlus, X } from 'lucide-react';

interface ThumbnailUploaderProps {
  thumbnailPreview: string | null;
  isUploadingThumbnail: boolean;
  onThumbnailChange: (file: File | null) => void;
}

const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  thumbnailPreview,
  isUploadingThumbnail,
  onThumbnailChange,
}) => {
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  return (
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
                onClick={() => onThumbnailChange(null)}
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
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onThumbnailChange(e.target.files[0]);
              }
            }}
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
  );
};

export default ThumbnailUploader;
