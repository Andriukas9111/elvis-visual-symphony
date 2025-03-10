
import { QueryClient } from '@tanstack/react-query';

// Create a global queryClient that can be used outside of React components
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
