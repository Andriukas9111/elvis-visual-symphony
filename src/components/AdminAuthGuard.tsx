
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import AccessDeniedUI from '@/components/admin/AccessDeniedUI';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { user, profile, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
  }, [user, isAdmin, loading, navigate, profile, toast]);

  if (loading) {
    return <AdminLoadingState />;
  }

  // Additional check for admin role
  if (!isAdmin) {
    return <AccessDeniedUI />;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
