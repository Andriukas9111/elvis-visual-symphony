
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { makeUserAdmin } from '@/utils/makeAdmin';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AdminGranter: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGranting, setIsGranting] = useState(false);
  
  const handleMakeAdmin = async () => {
    if (!user?.email) return;
    
    setIsGranting(true);
    try {
      const result = await makeUserAdmin(user.email);
      
      if (result.success) {
        toast({
          title: 'Success!',
          description: `Your account (${user.email}) has been made an admin. You may need to refresh the page.`,
        });
        // Force a page reload to update the user's role
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast({
          title: 'Error making your account admin',
          description: result.error.message || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGranting(false);
    }
  };
  
  return (
    <Card className="bg-elvis-medium border-none mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Need Admin Access?</CardTitle>
        <CardDescription>Make your account an admin with one click</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p className="text-white/70">
            If you're the application owner or developer, you can grant your account admin privileges to access all admin features.
          </p>
          <Button 
            onClick={handleMakeAdmin} 
            disabled={isGranting}
            className="bg-elvis-pink hover:bg-elvis-pink/80"
          >
            {isGranting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Granting admin access...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Make My Account Admin
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminGranter;
