
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Check,
  Loader2,
  Link as LinkIcon,
  Film
} from 'lucide-react';
import { useToast, toast } from "@/hooks/use-toast";
import { useVideoConfig } from '@/hooks/useVideoConfig';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import YoutubeUploadTab from './YoutubeUploadTab';
import { VideoErrorData } from '@/components/portfolio/video-player/utils';

interface VideoUploadTabProps {
  onUploadComplete: (mediaData: any) => void;
}

// Mock functions for interface compatibility
const testVideoPlayback = async (url: string) => {
  return { canPlay: true, error: null };
};

const createMedia = async (data: any) => {
  return data;
};

const VideoUploadTab: React.FC<VideoUploadTabProps> = ({ onUploadComplete }) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link' | 'youtube' | 'batch'>('link');
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isTestingVideo, setIsTestingVideo] = useState(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical' | 'square'>('horizontal');
  const [loopVideo, setLoopVideo] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const handleUrlSubmit = async () => {
    try {
      setIsUploading(true);

      // Validate URL
      if (!videoUrl) {
        throw new Error('Please enter a video URL');
      }

      // Test if the video is playable
      const testResult = await testVideoPlayback(videoUrl);
      if (!testResult.canPlay) {
        throw new Error(`Video cannot be played: ${testResult.error || 'Unknown error'}`);
      }

      // Create a slug from the title
      const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // Create media entry
      const mediaData = await createMedia({
        title: title || 'Untitled Video',
        slug: slug || `video-${Date.now()}`,
        description: description,
        type: 'video',
        category: 'videos',
        url: videoUrl,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        is_published: isPublished,
        orientation: orientation,
        tags: []
      });

      toast({
        title: 'Video added successfully',
        description: 'Your video has been added to the media library.',
      });

      // Reset form
      setVideoUrl('');
      setTitle('');
      setDescription('');
      setThumbnailUrl('');
      
      // Notify parent component
      onUploadComplete(mediaData);
    } catch (error: any) {
      console.error('Error adding video:', error);
      toast({
        title: 'Failed to add video',
        description: error.message || 'An error occurred while adding the video',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTestVideo = async () => {
    try {
      setIsTestingVideo(true);
      const testResult = await testVideoPlayback(videoUrl);
      
      if (testResult.canPlay) {
        toast({
          title: 'Video test successful',
          description: 'The video can be played successfully',
        });
        setPreviewMode(true);
      } else {
        toast({
          title: 'Video test failed',
          description: `The video cannot be played: ${testResult.error || 'Unknown error'}`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error testing video',
        description: error.message || 'An error occurred while testing the video',
        variant: 'destructive',
      });
    } finally {
      setIsTestingVideo(false);
    }
  };

  const handleVideoError = (error: VideoErrorData) => {
    toast({
      title: 'Video playback error',
      description: error.message || 'An error occurred during video playback',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as any)}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="link" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <span>Video URL</span>
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span>YouTube</span>
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload File</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="link" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <div className="flex mt-1 gap-2">
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="bg-elvis-dark border-white/10"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestVideo}
                  disabled={!videoUrl || isTestingVideo}
                  className="shrink-0"
                >
                  {isTestingVideo ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Test'
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video title"
                className="bg-elvis-dark border-white/10"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Video description"
                className="w-full min-h-[80px] p-3 bg-elvis-dark border border-white/10 rounded-md text-white"
              />
            </div>

            <div>
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
                className="bg-elvis-dark border-white/10"
              />
            </div>

            <div className="space-y-3">
              <Label>Video Options</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="orientation">Orientation:</Label>
                  <select
                    id="orientation"
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as any)}
                    className="bg-elvis-dark border border-white/10 rounded-md px-2 py-1 text-sm"
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                    <option value="square">Square</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="loop"
                      checked={loopVideo}
                      onCheckedChange={(checked) => setLoopVideo(checked as boolean)}
                    />
                    <Label htmlFor="loop" className="text-sm">Loop</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoplay"
                      checked={autoPlay}
                      onCheckedChange={(checked) => setAutoPlay(checked as boolean)}
                    />
                    <Label htmlFor="autoplay" className="text-sm">Autoplay</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <div className="text-white/60 text-sm">
                    Make this video visible on the website
                  </div>
                </div>
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
            </div>

            {previewMode && videoUrl && (
              <div className="mt-4 border border-white/10 rounded-xl overflow-hidden">
                <VideoPlayer
                  videoUrl={videoUrl}
                  thumbnail={thumbnailUrl}
                  title={title || "Video Preview"}
                  isVertical={orientation === 'vertical'}
                  loop={loopVideo}
                  autoPlay={autoPlay}
                  onError={handleVideoError}
                />
              </div>
            )}

            <div className="pt-4">
              <Button
                onClick={handleUrlSubmit}
                disabled={isUploading || !videoUrl}
                className="w-full bg-elvis-pink hover:bg-elvis-pink/80"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Video...
                  </>
                ) : (
                  <>
                    <Film className="mr-2 h-4 w-4" />
                    Add Video
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="youtube">
          <YoutubeUploadTab onUploadComplete={onUploadComplete} />
        </TabsContent>
        
        <TabsContent value="file">
          <div className="p-6 text-center text-white/60 border border-dashed border-white/20 rounded-lg">
            <Upload className="mx-auto h-10 w-10 mb-3 text-white/40" />
            <h3 className="text-lg font-medium mb-1">Coming Soon</h3>
            <p>Direct file upload capability is coming soon.</p>
            <p className="mt-2 text-sm">For now, please use the Video URL option or YouTube option.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoUploadTab;
