
import React from 'react';
import MediaUploaderUI from './upload/MediaUploaderUI';

interface MediaUploaderProps {
  onUploadComplete: (mediaData: any) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onUploadComplete }) => {
  return <MediaUploaderUI onUploadComplete={onUploadComplete} />;
};

export default MediaUploader;
