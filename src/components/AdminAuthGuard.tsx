
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { user, profile, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only perform redirects after we're sure the auth state is loaded
    if (!loading) {
      if (!user) {
        console.log("No user detected, redirecting to login");
        toast({
          title: "Authentication required",
          description: "Please log in to access this page",
          variant: "destructive"
        });
        navigate('/login', { replace: true });
      } else if (!isAdmin) {
        // Debug info to help diagnose issues
        console.log("User is not admin, redirecting to dashboard", { 
          userId: user.id,
          email: user.email,
          profile: profile,
          isAdmin: isAdmin,
          role: profile?.role
        });
        
        // Check if profile exists but role isn't admin (different from no profile)
        if (profile && profile.role !== 'admin') {
          toast({
            title: "Access denied",
            description: `You don't have admin privileges (current role: ${profile.role || 'none'})`,
            variant: "destructive"
          });
        } else if (!profile) {
          toast({
            title: "Profile error",
            description: "Your user profile couldn't be loaded. Please try again or contact support.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Access denied",
            description: "You don't have permission to access the admin panel",
            variant: "destructive"
          });
        }
        
        navigate('/dashboard', { replace: true });
      } else {
        console.log("Admin access granted", {
          userId: user.id,
          email: user.email,
          isAdmin: isAdmin,
          role: profile?.role
        });
      }
    }
  }, [user, isAdmin, loading, navigate, profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-elvis-dark">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }

  // Additional check for admin role
  if (!isAdmin) {
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
