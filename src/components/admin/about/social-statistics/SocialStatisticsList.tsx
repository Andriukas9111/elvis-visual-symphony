
import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { StatItem } from '@/hooks/api/useStats';
import SocialStatisticsItem from './SocialStatisticsItem';

interface SocialStatisticsListProps {
  stats: StatItem[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onEdit: (stat: StatItem) => void;
  onDelete: (id: string) => void;
}

const SocialStatisticsList: React.FC<SocialStatisticsListProps> = ({ 
  stats, 
  onMoveUp, 
  onMoveDown, 
  onEdit, 
  onDelete 
}) => {
  if (stats.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center py-12">
          <p className="text-muted-foreground">No social statistics found. Add your first statistic.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <SocialStatisticsItem 
          key={stat.id} 
          stat={stat} 
          index={index}
          totalItems={stats.length}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SocialStatisticsList;
