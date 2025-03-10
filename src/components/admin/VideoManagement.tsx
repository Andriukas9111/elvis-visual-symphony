
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus, Settings, BarChart3 } from 'lucide-react';
import MediaManagement from './MediaManagement';
import VideoConfigManager from './VideoConfigManager';
import VideoAnalyticsTab from './upload/VideoAnalyticsTab';
import VideoBatchProcessor from './upload/VideoBatchProcessor';
import VideoUploadTab from './upload/VideoUploadTab';

const VideoManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('media');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBatchProcessorOpen, setIsBatchProcessorOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'single' | 'batch'>('single');

  const handleUploadComplete = (mediaData: any) => {
    setIsUploadOpen(false);
    setIsBatchProcessorOpen(false);
    // You would typically refresh the media list here
  };

  const openUploadModal = (type: 'single' | 'batch') => {
    setUploadType(type);
    if (type === 'single') {
      setIsUploadOpen(true);
    } else {
      setIsBatchProcessorOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Video Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => openUploadModal('batch')}
            variant="outline"
            className="border-white/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Batch Import
          </Button>
          <Button
            onClick={() => openUploadModal('single')}
            className="bg-elvis-pink hover:bg-elvis-pink/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="media" className="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-4 w-4"
            >
              <rect width="18" height="12" x="3" y="6" rx="2" />
              <path d="m10 12 5 3-5 3Z" />
            </svg>
            <span>Media Library</span>
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Configuration</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="media">
          <MediaManagement />
        </TabsContent>

        <TabsContent value="config">
          <VideoConfigManager />
        </TabsContent>

        <TabsContent value="analytics">
          <VideoAnalyticsTab />
        </TabsContent>
      </Tabs>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="bg-elvis-medium border-white/10 max-w-xl">
          <VideoUploadTab onUploadComplete={handleUploadComplete} />
        </DialogContent>
      </Dialog>

      <Dialog open={isBatchProcessorOpen} onOpenChange={setIsBatchProcessorOpen}>
        <DialogContent className="bg-elvis-medium border-white/10 max-w-xl">
          <VideoBatchProcessor onComplete={() => setIsBatchProcessorOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoManagement;
