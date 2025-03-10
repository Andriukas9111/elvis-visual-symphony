
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tables } from '@/types/supabase';
import HireRequestRow from './HireRequestRow';

interface HireRequestsTableProps {
  hireRequests: Tables<'hire_requests'>[];
  updateHireRequestStatus: (requestId: string, newStatus: string) => void;
}

const HireRequestsTable: React.FC<HireRequestsTableProps> = ({ 
  hireRequests, 
  updateHireRequestStatus 
}) => {
  return (
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
            <HireRequestRow
              key={request.id}
              request={request}
              updateHireRequestStatus={updateHireRequestStatus}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HireRequestsTable;
