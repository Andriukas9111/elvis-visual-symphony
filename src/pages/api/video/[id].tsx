
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, AlertTriangle } from 'lucide-react';

interface ChunkedVideo {
  id: string;
  original_filename: string;
  mime_type: string;
  total_chunks: number;
  chunk_files: string[];
  storage_bucket: string;
  base_path: string;
}

const VideoPlayer = () => {
  const { id } = useParams();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [videoData, setVideoData] = useState<ChunkedVideo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [videoSources, setVideoSources] = useState<string[]>([]);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        if (!id) {
          throw new Error('Missing video ID');
        }

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

        setVideoData(data as ChunkedVideo);

        // Generate signed URLs for each chunk
        const chunkUrls = await Promise.all(
          data.chunk_files.map(async (chunkPath) => {
            const { data: signedUrlData } = await supabase.storage
              .from(data.storage_bucket)
              .createSignedUrl(chunkPath, 3600); // 1 hour expiry
            
            return signedUrlData.signedUrl;
          })
        );

        setVideoSources(chunkUrls);
        setStatus('ready');
      } catch (error) {
        console.error('Error loading video:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to load video');
      }
    };

    fetchVideoData();
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading video...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Video Playback Error</h3>
        <p className="text-gray-600">{errorMessage || 'An error occurred while loading the video'}</p>
      </div>
    );
  }

  // For now, we're just using the first chunk to demonstrate the player works
  // In a production app, you would implement HLS or similar streaming protocol
  const firstChunkUrl = videoSources[0];

  return (
    <div className="video-player-container">
      <h2 className="text-lg font-semibold mb-2">{videoData?.original_filename}</h2>
      <video 
        controls
        className="w-full rounded-lg"
        preload="metadata"
      >
        <source src={firstChunkUrl} type={videoData?.mime_type} />
        Your browser does not support the video tag.
      </video>
      <p className="text-sm text-gray-500 mt-2">
        Note: This is a chunked video. Currently showing preview from first chunk.
      </p>
    </div>
  );
};

export default VideoPlayer;
