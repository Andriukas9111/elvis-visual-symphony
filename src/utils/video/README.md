
# Video Upload System

This is a completely rebuilt video upload system designed to be reliable and support large files. The system uses Supabase Storage to store video files and handles both small and large videos.

## Features

- Reliable uploads for files of any size
- Automatic thumbnail generation
- Progress tracking
- Integration with the media system
- Clean database design

## How it works

1. Videos are uploaded to the `videos` bucket in Supabase Storage
2. For large files, the system breaks them into manageable chunks
3. A record is created in the `videos` table with metadata
4. A thumbnail is automatically generated and stored in the `thumbnails` bucket
5. The video is linked to a record in the `media` table for easy integration with the rest of the system

## Components

- `videoUploader.ts`: Core upload functionality
- `videoIntegration.ts`: Integration with the media system
- `useVideoUpload.ts`: React hook for easy use in components
- `VideoPlayer.tsx`: Simple, reliable video player component

## Database Structure

- `videos` table: Stores metadata about uploaded videos
- `media` table: Integrates videos with the rest of the media system via the `video_id` field

## Storage Buckets

- `videos`: Stores the actual video files
- `thumbnails`: Stores automatically generated thumbnails

## Usage Example

```tsx
import { useVideoUpload } from '@/hooks/useVideoUpload';

function UploadComponent() {
  const { 
    uploadVideo, 
    isUploading, 
    uploadProgress 
  } = useVideoUpload();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await uploadVideo(file, {
        title: 'My Video',
        is_published: true
      });
      
      if (result) {
        console.log('Upload successful!', result);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      {isUploading && <progress value={uploadProgress} max="100" />}
    </div>
  );
}
```
