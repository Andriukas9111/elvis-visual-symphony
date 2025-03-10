
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

// File upload hooks
export const useUploadFile = (options?: UseMutationOptions<string, Error, { bucket: string; path: string; file: File }>) => {
  return useMutation({
    mutationFn: ({ bucket, path, file }) => api.uploadFile(bucket, path, file),
    onSuccess: () => {
      toast({ title: 'File uploaded', description: 'Your file has been successfully uploaded.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Upload failed', 
        description: error.message || 'Failed to upload file. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

export const useDeleteFile = (options?: UseMutationOptions<boolean, Error, { bucket: string; path: string }>) => {
  return useMutation({
    mutationFn: ({ bucket, path }) => api.deleteFile(bucket, path),
    onSuccess: () => {
      toast({ title: 'File deleted', description: 'The file has been successfully deleted.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Deletion failed', 
        description: error.message || 'Failed to delete file. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};
