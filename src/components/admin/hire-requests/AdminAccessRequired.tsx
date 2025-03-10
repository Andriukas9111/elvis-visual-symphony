
import React from 'react';
import { AlertCircle } from 'lucide-react';

const AdminAccessRequired: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <AlertCircle className="h-10 w-10 text-yellow-500 mb-2" />
      <div className="text-lg font-medium mb-2">Admin access required</div>
      <div className="text-sm text-white/60">
        You need admin privileges to manage hire requests.
        Please use the "Make My Account Admin" button if you're the site owner.
      </div>
    </div>
  );
};

export default AdminAccessRequired;
