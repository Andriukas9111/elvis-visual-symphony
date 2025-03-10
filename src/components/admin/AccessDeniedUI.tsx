
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AccessDeniedUI: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-elvis-dark text-white text-center px-4">
      <Shield className="h-16 w-16 text-elvis-pink mb-4" />
      <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
      <p className="text-white/70 mb-4">You don't have permission to access this page.</p>
      <button
        onClick={() => navigate('/dashboard')}
        className="text-elvis-pink hover:underline"
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default AccessDeniedUI;
