
// This file now re-exports all hooks from the api directory
// This maintains backward compatibility while we transition to the new structure

export * from './api/queryClient';
export * from './api/useProfile';
export * from './api/useMedia';
export * from './api/useProducts';
export * from './api/useOrders';
export * from './api/useContent';
export * from './api/useHireRequests';
export * from './api/useFileUpload';
export * from './api/useSearch';
export * from './api/useSubscribers';

// Export About section hooks
export * from './api/useAboutContent';
export * from './api/useStats';
export * from './api/useAccomplishments';
export * from './api/useSectionSettings';
export * from './api/useTestimonials';
