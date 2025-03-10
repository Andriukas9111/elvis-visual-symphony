
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import ChunkedVideoPlayer from '@/components/portfolio/video-player/ChunkedVideoPlayer';
import { toast } from '@/hooks/use-toast';

interface ChunkedVideoMetadata {
  id: string;
  original_filename: string;
  mime_type: string;
  total_chunks: number;
  chunk_files: string[];
  storage_bucket: string;
  base_path: string;
  file_size: number;
  thumbnail_url?: string;
}

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [videoData, setVideoData] = useState<ChunkedVideoMetadata | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadProgress, setLoadProgress] = useState(0);

  // Fetch video metadata
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        if (!id) {
          throw new Error('Missing video ID');
        }
        
        setStatus('loading');
        setLoadProgress(20);

        // Fetch the chunked video metadata
        const { data, error } = await supabase
          .from('chunked_uploads')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Video not found');
        }
        
        setLoadProgress(50);
        
        // Check if there's a thumbnail in media table
        const { data: mediaData } = await supabase
          .from('media')
          .select('thumbnail_url')
          .eq('metadata->chunked_upload_id', id)
          .maybeSingle();
          
        setLoadProgress(80);
          
        // Set video data with thumbnail if available
        setVideoData({
          ...data,
          thumbnail_url: mediaData?.thumbnail_url || undefined
        });
        
        setStatus('ready');
        setLoadProgress(100);
      } catch (error: any) {
        console.error('Error loading video:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to load video');
        
        toast({
          title: "Error loading video",
          description: error.message || "The video could not be loaded",
          variant: "destructive"
        });
      }
    };

    fetchVideoData();
  }, [id]);

  // Go back handler
  const handleGoBack = () => {
    navigate(-1);
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-elvis-darker flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-elvis-pink mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Loading Video</h2>
          <p className="text-white/70 mb-6">Please wait while we prepare your video...</p>
          <Progress value={loadProgress} className="mx-auto w-2/3" />
        </div>
      </div>
    );
  }

  // Show error state
  if (status === 'error' || !videoData) {
    return (
      <div className="min-h-screen bg-elvis-darker flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl text-center bg-elvis-medium rounded-lg p-8">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Video Unavailable</h2>
          <p className="text-white/70 mb-6">{errorMessage || 'The requested video could not be loaded.'}</p>
          <Button 
            onClick={handleGoBack}
            className="bg-elvis-pink hover:bg-elvis-pink/80 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elvis-darker p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="text-white border-white/20 hover:bg-elvis-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        {/* Video player */}
        <div className="mb-6">
          <ChunkedVideoPlayer
            videoId={videoData.id}
            thumbnail={videoData.thumbnail_url || '/placeholder.svg'}
            title={videoData.original_filename}
            controls={true}
          />
        </div>
        
        {/* Video details */}
        <div className="bg-elvis-medium rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-4">{videoData.original_filename}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
            <div>
              <p className="mb-2">
                <span className="font-medium">Format:</span> {videoData.mime_type}
              </p>
              <p className="mb-2">
                <span className="font-medium">Size:</span> {(videoData.file_size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-medium">Chunks:</span> {videoData.total_chunks}
              </p>
              <p className="mb-2">
                <span className="font-medium">Status:</span> Ready for playback
              </p>
            </div>
          </div>
          
          {/* Optional download button for admins */}
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="text-white border-white/20 hover:bg-elvis-medium"
              onClick={() => {
                toast({
                  title: "Download started",
                  description: "Your video will download shortly."
                });
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Original
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
