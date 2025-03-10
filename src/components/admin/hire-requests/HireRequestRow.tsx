
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { MoreHorizontal, FileText, X } from 'lucide-react';
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

  const handleOpenDetails = () => {
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
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
                onClick={handleOpenDetails}
                className="cursor-pointer hover:bg-elvis-pink/20"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Full Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Simplified details sidebar with only one close button */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent 
          className="bg-elvis-medium border-elvis-dark text-white overflow-y-auto max-w-md w-full" 
          side="right"
        >
          <Button 
            className="absolute right-4 top-4 p-2 h-auto rounded-full bg-transparent hover:bg-white/10 text-white/70 hover:text-white"
            size="icon"
            variant="ghost"
            onClick={handleCloseDetails}
          >
            <X size={16} />
            <span className="sr-only">Close</span>
          </Button>
          
          <SheetHeader className="mb-4 pr-8">
            <SheetTitle className="text-xl font-bold text-white">Hire Request Details</SheetTitle>
            <SheetDescription className="text-white/70">
              Complete information about the hire request
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 mt-6">
            {/* Client Info */}
            <div className="space-y-1">
              <h3 className="text-xs uppercase tracking-wider text-white/50 font-medium">Client Information</h3>
              <div className="bg-elvis-dark/40 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-white/60">Name</h4>
                    <p className="text-lg font-medium">{request.name}</p>
                  </div>
                  <Badge className={`${getStatusBadgeColor(request.status)} mt-1`}>
                    {formatStatus(request.status)}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-white/60">Contact</h4>
                  <p className="text-white/90">{request.email}</p>
                  {request.phone && <p className="text-white/90">{request.phone}</p>}
                </div>
                
                {request.company && (
                  <div>
                    <h4 className="text-sm font-medium text-white/60">Company</h4>
                    <p className="text-white/90">{request.company}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Project Info */}
            <div className="space-y-1">
              <h3 className="text-xs uppercase tracking-wider text-white/50 font-medium">Project Details</h3>
              <div className="bg-elvis-dark/40 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-white/60">Project Type</h4>
                    <p className="text-white/90">{formatProjectType(request.project_type)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/60">Budget</h4>
                    <p className="text-white/90">${request.budget.toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-white/60">Timeline</h4>
                  <p className="text-white/90">{formatStatus(request.timeline)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-white/60">Project Description</h4>
                  <div className="mt-2 p-3 bg-elvis-dark/80 rounded-md">
                    <p className="whitespace-pre-wrap text-white/90 text-sm">
                      {request.project_description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Meta Info */}
            <div className="space-y-1">
              <h3 className="text-xs uppercase tracking-wider text-white/50 font-medium">Request Information</h3>
              <div className="bg-elvis-dark/40 rounded-lg p-4">
                <div>
                  <h4 className="text-sm font-medium text-white/60">Submitted On</h4>
                  <p className="text-white/90">{new Date(request.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default HireRequestRow;
