
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Upload, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import FileUploadTab from './FileUploadTab';

interface MediaUploaderUIProps {
  onUploadComplete: (mediaData: any) => void;
}

const MediaUploaderUI: React.FC<MediaUploaderUIProps> = ({ onUploadComplete }) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'youtube'>('file');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  return (
    <div className="p-6 bg-elvis-light rounded-lg border border-white/10 shadow-pink-glow/10 hover:shadow-pink-glow/20 transition-all duration-500">
      <motion.div 
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Tabs defaultValue="file" onValueChange={(value) => setUploadMethod(value as 'file' | 'youtube')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload File</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              <span>YouTube URL</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="file">
            <FileUploadTab onUploadComplete={onUploadComplete} />
          </TabsContent>
          
          <TabsContent value="youtube">
            <div className="p-6 text-center text-white/60">
              YouTube import feature will be implemented soon.
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default MediaUploaderUI;
