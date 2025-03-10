import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MoreHorizontal, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const HireRequestsManagement = () => {
  const { toast } = useToast();
  const { user, profile, isAdmin } = useAuth();
  const [hireRequests, setHireRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Directly fetch hire requests to bypass potential issues with hooks
  useEffect(() => {
    const fetchHireRequests = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching hire requests...');
        
        // Use direct RPC call instead of querying the users table
        const { data, error } = await supabase
          .from('hire_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching hire requests:", error);
          throw error;
        }
        
        console.log('Hire requests loaded:', data?.length || 0, 'items');
        setHireRequests(data || []);
      } catch (err) {
        console.error("Error fetching hire requests:", err);
        setError(err);
        toast({
          title: 'Error loading hire requests',
          description: err.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchHireRequests();
    } else {
      setIsLoading(false);
    }
  }, [isAdmin, toast]);
  
  const updateHireRequestStatus = async (requestId, newStatus) => {
    try {
      console.log(`Updating request ${requestId} to status: ${newStatus}`);
      
      const { data, error } = await supabase
        .from('hire_requests')
        .update({ status: newStatus })
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the request in the local state
      setHireRequests(prev => 
        prev.map(req => req.id === requestId ? data : req)
      );
      
      toast({
        title: 'Status updated',
        description: `Request status has been updated successfully`,
      });
    } catch (error) {
      console.error("Error updating hire request:", error);
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/10 text-blue-500';
      case 'contacted':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'in_progress':
        return 'bg-purple-500/10 text-purple-500';
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };
  
  if (!isAdmin) {
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
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="text-red-500 mb-2">Failed to load requests</div>
        <div className="text-sm text-white/60">{error.message}</div>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-elvis-pink hover:bg-elvis-pink/80"
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      {hireRequests.length === 0 ? (
        <div className="text-center py-10 text-white/60">
          No hire requests found. When clients submit the contact form, they'll appear here.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead>Client</TableHead>
              <TableHead>Project Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hireRequests.map((request) => (
              <TableRow key={request.id} className="border-white/10 hover:bg-elvis-light/50 transition-colors">
                <TableCell>
                  <div>
                    <div className="font-medium">{request.name}</div>
                    <div className="text-sm text-white/60">{request.email}</div>
                  </div>
                </TableCell>
                <TableCell>{request.project_type}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(request.status)}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(request.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-elvis-medium border-white/10">
                      <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem 
                        onClick={() => updateHireRequestStatus(request.id, 'new')}
                        className="cursor-pointer hover:bg-elvis-pink/20"
                      >
                        Mark as New
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateHireRequestStatus(request.id, 'contacted')}
                        className="cursor-pointer hover:bg-elvis-pink/20"
                      >
                        Mark as Contacted
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateHireRequestStatus(request.id, 'in_progress')}
                        className="cursor-pointer hover:bg-elvis-pink/20"
                      >
                        Mark as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateHireRequestStatus(request.id, 'completed')}
                        className="cursor-pointer hover:bg-elvis-pink/20"
                      >
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateHireRequestStatus(request.id, 'cancelled')}
                        className="cursor-pointer hover:bg-elvis-pink/20"
                      >
                        Mark as Cancelled
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default HireRequestsManagement;
