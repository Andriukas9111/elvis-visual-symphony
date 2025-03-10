
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import AccessDeniedUI from '@/components/admin/AccessDeniedUI';
import { checkDatabaseConnection } from '@/utils/databaseCheck';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { user, profile, loading, isAdmin, error, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);

  // Run diagnostics and collect info
  useEffect(() => {
    const runDiagnostics = async () => {
      if (user && !isAdmin) {
        console.log("Running admin access diagnostics...");
        const info = {
          userId: user.id,
          email: user.email,
          profile: profile ? JSON.stringify(profile) : 'null',
          isAdmin: isAdmin,
          role: profile?.role || 'none',
          hasRefreshProfile: !!refreshProfile,
        };
        setDiagnosticInfo(info);
        console.error("Admin access diagnostics:", info);
        
        // Check database connectivity
        await checkDatabaseConnection();
      }
    };
    
    if (!loading) {
      runDiagnostics();
    }
  }, [user, isAdmin, profile, loading, refreshProfile]);

  // Handle refresh profile
  const handleRefreshProfile = async () => {
    if (refreshProfile) {
      setIsRefreshing(true);
      try {
        await refreshProfile();
        toast({
          title: "Profile refreshed",
          description: "Your profile information has been refreshed.",
        });
      } catch (error) {
        console.error("Error refreshing profile:", error);
        toast({
          title: "Refresh failed",
          description: "Failed to refresh your profile information.",
          variant: "destructive"
        });
      } finally {
        setIsRefreshing(false);
      }
    }
  };

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
        // Enhanced debug information to help diagnose issues
        console.error("User is not admin, redirecting to dashboard", diagnosticInfo);
        
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
          role: profile?.role || 'none'
        });
      }
    }
  }, [user, isAdmin, loading, navigate, profile, toast, diagnosticInfo]);

  if (loading) {
    return <AdminLoadingState />;
  }

  // Additional check for admin role
  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <AccessDeniedUI />
        <div className="flex justify-center">
          <Button 
            onClick={handleRefreshProfile} 
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Profile'}
          </Button>
        </div>
        
        {diagnosticInfo && (
          <div className="mt-8 p-4 bg-gray-800 rounded-md">
            <h3 className="text-lg font-medium mb-2">Diagnostic Information</h3>
            <pre className="text-xs overflow-auto p-2 bg-gray-900 rounded">
              {JSON.stringify(diagnosticInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
