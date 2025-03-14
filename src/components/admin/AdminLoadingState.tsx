
import React from 'react';
import { Loader2 } from 'lucide-react';

const AdminLoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin mb-2" />
      <p>Loading content...</p>
    </div>
  );
};

export default AdminLoadingState;
