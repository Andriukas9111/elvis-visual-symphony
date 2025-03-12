
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Loader2, Youtube } from 'lucide-react';
import { getYoutubeId, isYoutubeUrl } from '@/components/portfolio/video-player/utils';
import { useYoutubeUploader } from '@/hooks/admin/useYoutubeUploader';

interface YoutubeUploadTabProps {
  onUploadComplete: (mediaData: any) => void;
}

const YoutubeUploadTab: React.FC<YoutubeUploadTabProps> = ({ onUploadComplete }) => {
  const [youtubeData, setYoutubeData] = useState({
    url: '',
    title: '',
    description: '',
  });

  const {
    uploadProgress,
    uploadStatus,
    isUploading,
    submitYoutubeVideo
  } = useYoutubeUploader({ onUploadComplete });

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnailFromYoutubeId = (id: string) => {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  };

  const handleYoutubeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setYoutubeData(prev => ({ ...prev, [name]: value }));
    
    // If URL field changed and it's a YouTube URL, attempt to extract video ID for preview
    if (name === 'url' && isYoutubeUrl(value)) {
      const videoId = getYoutubeId(value);
      console.log('Detected YouTube URL, extracted ID:', videoId);
    }
  };

  const handleSubmit = () => {
    submitYoutubeVideo(youtubeData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          name="url"
          value={youtubeData.url}
          onChange={handleYoutubeInputChange}
          placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
          className="bg-elvis-medium border-white/10"
          disabled={isUploading}
        />
      </div>
      
      <div className="space-y-2">
        <Input
          name="title"
          value={youtubeData.title}
          onChange={handleYoutubeInputChange}
          placeholder="Title (optional)"
          className="bg-elvis-medium border-white/10"
          disabled={isUploading}
        />
      </div>
      
      <div className="space-y-2">
        <Textarea
          name="description"
          value={youtubeData.description}
          onChange={handleYoutubeInputChange}
          placeholder="Description (optional)"
          className="bg-elvis-medium border-white/10 min-h-[80px]"
          disabled={isUploading}
        />
      </div>
      
      {youtubeData.url && extractYoutubeId(youtubeData.url) && (
        <div className="mt-2">
          <p className="text-sm text-white/60 mb-2">Preview:</p>
          <img 
            src={getThumbnailFromYoutubeId(extractYoutubeId(youtubeData.url)!)}
            alt="YouTube Thumbnail"
            className="w-full h-48 object-cover rounded-md"
          />
        </div>
      )}
      
      {uploadStatus === 'uploading' && (
        <div className="space-y-2">
          <Progress 
            value={uploadProgress} 
            className="h-2 bg-elvis-medium" 
          />
          <div className="text-sm text-white/60 text-right">
            {uploadProgress}%
          </div>
        </div>
      )}
      
      {uploadStatus === 'success' && (
        <div className="flex items-center text-green-500 space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>YouTube video added</span>
        </div>
      )}
      
      {uploadStatus === 'error' && (
        <div className="flex items-center text-red-500 space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to add YouTube video</span>
        </div>
      )}
      
      {uploadStatus !== 'success' && (
        <Button 
          className="w-full bg-elvis-pink hover:bg-elvis-pink/80 shadow-pink-glow/30 hover:shadow-pink-glow/50 transition-all duration-300"
          onClick={handleSubmit}
          disabled={!youtubeData.url || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Youtube className="mr-2 h-4 w-4" />
              Add YouTube Video
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default YoutubeUploadTab;
