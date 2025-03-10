
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tables } from '@/types/supabase';

interface ExportRequestsButtonProps {
  hireRequests: Tables<'hire_requests'>[];
}

const ExportRequestsButton: React.FC<ExportRequestsButtonProps> = ({ hireRequests }) => {
  const { toast } = useToast();

  const exportHireRequests = () => {
    try {
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

  return (
    <Button 
      onClick={exportHireRequests}
      variant="outline" 
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Export to CSV
    </Button>
  );
};

export default ExportRequestsButton;
