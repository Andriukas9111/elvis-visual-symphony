
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tables } from '@/types/supabase';

interface HireRequestRowProps {
  request: Tables<'hire_requests'>;
  updateHireRequestStatus: (requestId: string, newStatus: string) => void;
}

const HireRequestRow: React.FC<HireRequestRowProps> = ({ request, updateHireRequestStatus }) => {
  const { toast } = useToast();

  const getStatusBadgeColor = (status: string) => {
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

  return (
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
  );
};

export default HireRequestRow;
