import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Download, AlertCircle, X, Mail, Calendar } from 'lucide-react';
import { useSubscribers, useDeleteSubscriber } from '@/hooks/api/useSubscribers';

const SubscribersManagement = () => {
  const { toast } = useToast();
  
  const { 
    data: subscribers = [], 
    isLoading, 
    error, 
    refetch 
  } = useSubscribers({
    queryKey: ['subscribers'], 
    refetchOnWindowFocus: true
  });
  
  const deleteSubscriber = useDeleteSubscriber({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting subscriber:", error);
    }
  });
  
  const handleDeleteSubscriber = async (id) => {
    try {
      await deleteSubscriber.mutateAsync(id);
    } catch (error) {
      console.error("Error in handleDeleteSubscriber:", error);
    }
  };

  const exportSubscribers = () => {
    try {
      const headers = ['Email', 'Subscribed Date'];
      const csvContent = [
        headers.join(','),
        ...subscribers.map(sub => [
          sub.email,
          new Date(sub.created_at).toLocaleDateString()
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful',
        description: 'Subscribers have been exported to CSV',
      });
    } catch (error) {
      console.error("Error exporting subscribers:", error);
      toast({
        title: 'Export failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
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
        <div className="text-red-500 mb-2">Failed to load subscribers</div>
        <div className="text-sm text-white/60">{error.message}</div>
        <Button 
          onClick={() => refetch()}
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
        <h3 className="text-lg font-medium">Subscribers ({subscribers.length})</h3>
        {subscribers.length > 0 && (
          <Button 
            onClick={exportSubscribers}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export to CSV
          </Button>
        )}
      </div>
      
      {subscribers.length === 0 ? (
        <div className="text-center py-10 text-white/60">
          <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No subscribers yet. When people subscribe to your newsletter, they'll appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>Email</TableHead>
                <TableHead>Subscribed Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber.id} className="border-white/10 hover:bg-elvis-light/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-elvis-pink" />
                      <span>{subscriber.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="h-4 w-4" />
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteSubscriber(subscriber.id)}
                      disabled={deleteSubscriber.isPending}
                      className="text-white/50 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
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

export default SubscribersManagement;
