
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and either no user or not admin, redirect
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else if (profile && profile.role !== 'admin') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-elvis-dark">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }

  // Additional check for admin role
  if (!profile || profile.role !== 'admin') {
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
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
