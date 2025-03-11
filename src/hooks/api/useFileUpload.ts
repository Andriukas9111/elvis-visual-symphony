
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { toast } from 'sonner';

// File upload hooks
export const useFileUpload = (options?: UseMutationOptions<string, Error, { bucket: string; path: string; file: File }>) => {
  return useMutation({
    mutationFn: ({ bucket, path, file }) => api.uploadFile(bucket, path, file),
    onSuccess: () => {
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message || 'Failed to upload file. Please try again.'}`);
    },
    ...options,
  });
};

export const useDeleteFile = (options?: UseMutationOptions<boolean, Error, { bucket: string; path: string }>) => {
  return useMutation({
    mutationFn: ({ bucket, path }) => api.deleteFile(bucket, path),
    onSuccess: () => {
      toast.success('File deleted successfully');
    },
    onError: (error) => {
      toast.error(`Deletion failed: ${error.message || 'Failed to delete file. Please try again.'}`);
    },
    ...options,
  });
};
