
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Upload, Film, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VideoPlayerConfig } from '@/types/video';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import { testVideoPlayback } from '@/components/portfolio/video-player/utils';
import { useToast } from '@/hooks/use-toast';

interface VideoBatchProcessorProps {
  onComplete: () => void;
}

const VideoBatchProcessor: React.FC<VideoBatchProcessorProps> = ({ onComplete }) => {
  const [videoUrls, setVideoUrls] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [results, setResults] = useState<Array<{url: string; status: 'success' | 'error'; message?: string}>>([]);
  const [progress, setProgress] = useState<number>(0);
  const [generateThumbnails, setGenerateThumbnails] = useState<boolean>(true);
  const [autoPublish, setAutoPublish] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isTestingVideo, setIsTestingVideo] = useState<boolean>(false);
  const [playerConfig, setPlayerConfig] = useState<VideoPlayerConfig>({
    autoPlay: false,
    loop: false,
    defaultVolume: 0.7,
    preloadStrategy: 'metadata'
  });

  const { toast } = useToast();

  const processVideoUrls = async () => {
    // Basic validation
    if (!videoUrls.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter at least one video URL to process",
        variant: "destructive"
      });
      return;
    }

    const urls = videoUrls.split('\n').filter(url => url.trim());
    if (urls.length === 0) {
      toast({
        title: "No valid URLs",
        description: "Please enter valid video URLs, one per line",
        variant: "destructive"
      });
      return;
    }

    setProcessingStatus('processing');
    setTotalItems(urls.length);
    setCurrentIndex(0);
    setResults([]);
    setProgress(0);

    // Process each URL
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].trim();
      try {
        setCurrentIndex(i);
        setProgress(Math.floor((i / urls.length) * 100));

        // Test if video is playable
        const testResult = await testVideoPlayback(url);
        if (!testResult.canPlay) {
          throw new Error(`Video cannot be played: ${testResult.error || 'Unknown error'}`);
        }

        // Simulate processing (in a real scenario, you would call your API to add the video)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Add success result
        setResults(prev => [...prev, {
          url,
          status: 'success',
          message: 'Video processed successfully'
        }]);
      } catch (error: any) {
        console.error(`Error processing ${url}:`, error);
        
        // Add error result
        setResults(prev => [...prev, {
          url,
          status: 'error',
          message: error.message || 'Failed to process video'
        }]);
      }
    }

    // All done
    setProgress(100);
    setProcessingStatus('completed');
  };

  const testVideo = async () => {
    if (!previewUrl) return;
    
    setIsTestingVideo(true);
    try {
      const testResult = await testVideoPlayback(previewUrl);
      if (testResult.canPlay) {
        toast({
          title: "Video test successful",
          description: "The video can be played successfully",
        });
      } else {
        toast({
          title: "Video test failed",
          description: `The video cannot be played: ${testResult.error || 'Unknown error'}`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Video test error",
        description: error.message || "An error occurred while testing the video",
        variant: "destructive"
      });
    } finally {
      setIsTestingVideo(false);
    }
  };

  return (
    <Card className="w-full bg-elvis-medium border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Video Batch Processor</CardTitle>
        <CardDescription className="text-white/60">
          Add multiple videos to your media library at once
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {processingStatus === 'idle' && (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="videoUrls">Video URLs (one per line)</Label>
                <textarea
                  id="videoUrls"
                  className="w-full min-h-[120px] p-3 mt-1 bg-elvis-dark border border-white/10 rounded-md text-white"
                  placeholder="https://example.com/video1.mp4&#10;https://example.com/video2.mp4&#10;https://example.com/video3.mp4"
                  value={videoUrls}
                  onChange={(e) => setVideoUrls(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Base Title</Label>
                  <Input
                    id="title"
                    className="bg-elvis-dark border-white/10"
                    placeholder="Video Series Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <p className="text-xs text-white/50 mt-1">Each video will be suffixed with its index</p>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    className="bg-elvis-dark border-white/10"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              <Separator className="my-4 bg-white/10" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Processing Options</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="generateThumbnails">Auto-generate thumbnails</Label>
                    <p className="text-sm text-white/50">
                      Automatically generate thumbnails from videos
                    </p>
                  </div>
                  <Switch
                    id="generateThumbnails"
                    checked={generateThumbnails}
                    onCheckedChange={setGenerateThumbnails}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoPublish">Auto-publish videos</Label>
                    <p className="text-sm text-white/50">
                      Automatically set videos to published state
                    </p>
                  </div>
                  <Switch
                    id="autoPublish"
                    checked={autoPublish}
                    onCheckedChange={setAutoPublish}
                  />
                </div>
              </div>

              <Separator className="my-4 bg-white/10" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Test Video</h3>
                <div>
                  <Label htmlFor="previewUrl">Video URL to test</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="previewUrl"
                      className="bg-elvis-dark border-white/10"
                      placeholder="https://example.com/video.mp4"
                      value={previewUrl || ''}
                      onChange={(e) => setPreviewUrl(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      className="shrink-0"
                      onClick={testVideo}
                      disabled={!previewUrl || isTestingVideo}
                    >
                      {isTestingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test"}
                    </Button>
                  </div>
                </div>

                {previewUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                    <VideoPlayer
                      videoUrl={previewUrl}
                      thumbnail=""
                      title="Video Preview"
                      autoPlay={playerConfig.autoPlay}
                      loop={playerConfig.loop}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {processingStatus === 'processing' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing video {currentIndex + 1} of {totalItems}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <Alert className="bg-elvis-dark/50 border-white/10">
              <Info className="h-4 w-4" />
              <AlertTitle>Processing in progress</AlertTitle>
              <AlertDescription>
                Please don't close this window until all videos have been processed.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {(processingStatus === 'completed' || processingStatus === 'error') && (
          <div className="space-y-6">
            <Alert className={`border-[${processingStatus === 'completed' ? 'green' : 'red'}-500/30] bg-[${processingStatus === 'completed' ? 'green' : 'red'}-900/10]`}>
              {processingStatus === 'completed' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertTitle>
                {processingStatus === 'completed' ? 'Processing completed' : 'Processing completed with errors'}
              </AlertTitle>
              <AlertDescription>
                {results.filter(r => r.status === 'success').length} of {totalItems} videos were processed successfully.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Results</h3>
              <ScrollArea className="h-[200px] rounded-md border border-white/10 p-4">
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded-md ${result.status === 'success' ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'} border`}
                    >
                      <div className="flex items-start gap-2">
                        {result.status === 'success' ? (
                          <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 mt-0.5 text-red-500" />
                        )}
                        <div className="flex-1 overflow-hidden">
                          <p className="font-medium truncate">{result.url}</p>
                          <p className="text-sm text-white/60">{result.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end space-x-2 border-t border-white/10 pt-4">
        {processingStatus === 'idle' && (
          <Button
            onClick={processVideoUrls}
            className="bg-elvis-pink hover:bg-elvis-pink/80"
          >
            <Film className="mr-2 h-4 w-4" />
            Process Videos
          </Button>
        )}
        
        {(processingStatus === 'completed' || processingStatus === 'error') && (
          <>
            <Button variant="ghost" onClick={() => {
              setProcessingStatus('idle');
              setResults([]);
              setProgress(0);
            }}>
              Process More
            </Button>
            <Button 
              onClick={onComplete}
              className="bg-elvis-pink hover:bg-elvis-pink/80"
            >
              Done
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default VideoBatchProcessor;
