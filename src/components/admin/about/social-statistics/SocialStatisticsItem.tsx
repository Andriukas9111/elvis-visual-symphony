
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { StatItem } from '@/hooks/api/useStats';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { getIconByName } from '../stats/IconSelector';

interface SocialStatisticsItemProps {
  stat: StatItem;
  index: number;
  totalItems: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onEdit: (stat: StatItem) => void;
  onDelete: (id: string) => void;
}

const SocialStatisticsItem: React.FC<SocialStatisticsItemProps> = ({ 
  stat, 
  index, 
  totalItems,
  onMoveUp, 
  onMoveDown, 
  onEdit, 
  onDelete 
}) => {
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
            {stat.value}{stat.suffix}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMoveDown(index)}
            disabled={index === totalItems - 1}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(stat)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(stat.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default SocialStatisticsItem;
