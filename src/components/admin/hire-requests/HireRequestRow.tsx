
import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, FileText } from 'lucide-react';
import { Tables } from '@/types/supabase';

interface HireRequestRowProps {
  request: Tables<'hire_requests'>;
  updateHireRequestStatus: (requestId: string, newStatus: string) => void;
}

const formatStatus = (status: string): string => {
  // Convert from snake_case to Title Case
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatProjectType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const HireRequestRow: React.FC<HireRequestRowProps> = ({ request, updateHireRequestStatus }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
    <>
      <TableRow key={request.id} className="border-white/10 hover:bg-elvis-light/50 transition-colors">
        <TableCell>
          <div>
            <div className="font-medium">{request.name}</div>
            <div className="text-sm text-white/60">{request.email}</div>
          </div>
        </TableCell>
        <TableCell>{formatProjectType(request.project_type)}</TableCell>
        <TableCell>
          <Badge className={getStatusBadgeColor(request.status)}>
            {formatStatus(request.status)}
          </Badge>
        </TableCell>
        <TableCell>
          {new Date(request.created_at).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
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
                onClick={() => setIsDetailsOpen(true)}
                className="cursor-pointer hover:bg-elvis-pink/20"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Full Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-elvis-medium border-elvis-dark text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Hire Request Details</DialogTitle>
            <DialogDescription className="text-white/70">
              Complete information about the hire request
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-white/60">Client</h4>
                <p className="text-lg font-medium">{request.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white/60">Status</h4>
                <Badge className={`${getStatusBadgeColor(request.status)} mt-1`}>
                  {formatStatus(request.status)}
                </Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-white/60">Contact</h4>
              <p>{request.email}</p>
              <p>{request.phone}</p>
            </div>
            
            {request.company && (
              <div>
                <h4 className="text-sm font-medium text-white/60">Company</h4>
                <p>{request.company}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-white/60">Project Type</h4>
              <p>{formatProjectType(request.project_type)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-white/60">Budget</h4>
              <p>${request.budget.toLocaleString()}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-white/60">Timeline</h4>
              <p>{formatStatus(request.timeline)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-white/60">Project Description</h4>
              <p className="whitespace-pre-wrap p-3 bg-elvis-dark/50 rounded-md mt-1">
                {request.project_description}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-white/60">Date Submitted</h4>
              <p>{new Date(request.created_at).toLocaleString()}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HireRequestRow;
