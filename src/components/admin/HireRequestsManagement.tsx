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
import { Loader2, MoreHorizontal, AlertCircle, Download, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const HireRequestsManagement = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [hireRequests, setHireRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch hire requests directly from Supabase
  useEffect(() => {
    const fetchHireRequests = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching hire requests...');
        
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

  const exportHireRequests = () => {
    try {
      // Convert hireRequests to CSV format
      const headers = ['Name', 'Email', 'Phone', 'Company', 'Project Type', 'Project Description', 'Budget', 'Timeline', 'Status', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...hireRequests.map(req => [
          req.name,
          req.email,
          req.phone || '',
          req.company || '',
          req.project_type,
          `"${(req.project_description || '').replace(/"/g, '""')}"`,
          req.budget || '',
          req.timeline || '',
          req.status,
          new Date(req.created_at).toLocaleDateString()
        ].join(','))
      ].join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `hire-requests-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful',
        description: 'Hire requests have been exported to CSV',
      });
    } catch (error) {
      console.error("Error exporting hire requests:", error);
      toast({
        title: 'Export failed',
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Hire Requests ({hireRequests.length})</h3>
        {hireRequests.length > 0 && (
          <Button 
            onClick={exportHireRequests}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export to CSV
          </Button>
        )}
      </div>
      
      {hireRequests.length === 0 ? (
        <div className="text-center py-10 text-white/60">
          No hire requests found. When clients submit the contact form, they'll appear here.
        </div>
      ) : (
        <div className="overflow-x-auto">
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
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                          onClick={() => {
                            // Open a modal or display details view
                            toast({
                              title: 'View Details',
                              description: 'Full request details view will be added in a future update',
                            });
                          }}
                          className="cursor-pointer hover:bg-elvis-pink/20"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Full Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default HireRequestsManagement;
