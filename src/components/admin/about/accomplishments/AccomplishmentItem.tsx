
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { StatItem, useUpdateStat, useDeleteStat } from '@/hooks/api/useStats';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getIconByName } from '../stats/IconSelector';
import { useStatReordering } from '@/hooks/useStatReordering';

interface AccomplishmentItemProps {
  stat: StatItem;
  index: number;
  totalItems: number;
}

const AccomplishmentItem: React.FC<AccomplishmentItemProps> = ({ 
  stat,
  index,
  totalItems
}) => {
  const { toast } = useToast();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();
  const { handleMoveUp, handleMoveDown, isReordering } = useStatReordering();
  
  const handleEdit = () => {
    // Implement edit functionality
    toast({
      title: "Edit feature",
      description: "Edit functionality will be implemented here"
    });
  };
  
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this accomplishment?")) {
      try {
        await deleteStat.mutateAsync(stat.id);
        toast({
          title: "Success",
          description: "Accomplishment deleted successfully"
        });
      } catch (error) {
        console.error("Error deleting accomplishment:", error);
        toast({
          title: "Error",
          description: "Failed to delete accomplishment",
          variant: "destructive"
        });
      }
    }
  };

  const moveUp = (item: StatItem) => {
    handleMoveUp(item, Array(totalItems).fill(null).map((_, i) => i === index ? item : { id: `temp-${i}`, sort_order: i } as StatItem));
  };

  const moveDown = (item: StatItem) => {
    handleMoveDown(item, Array(totalItems).fill(null).map((_, i) => i === index ? item : { id: `temp-${i}`, sort_order: i } as StatItem));
  };

  return (
    <Card className="border border-border">
      <CardHeader className="py-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-secondary/20 p-2 rounded">
            {getIconByName(stat.icon_name, "h-5 w-5")}
          </div>
          <CardTitle className="text-lg">{stat.label}</CardTitle>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold mr-4">
            {stat.value}{stat.suffix || ''}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => moveUp(stat)}
            disabled={index === 0 || isReordering}
          >
            <span className="sr-only">Move up</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m18 15-6-6-6 6"/></svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => moveDown(stat)}
            disabled={index === totalItems - 1 || isReordering}
          >
            <span className="sr-only">Move down</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default AccomplishmentItem;
