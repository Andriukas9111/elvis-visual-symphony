
import React from 'react';
import { Loader2 } from 'lucide-react';

const AdminLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-elvis-dark">
      <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
    </div>
  );
};

export default AdminLoadingState;
