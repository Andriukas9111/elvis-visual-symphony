
import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { StatItem } from '@/hooks/api/useStats';
import AccomplishmentItem from './AccomplishmentItem';

interface AccomplishmentsListProps {
  stats: StatItem[];
}

const AccomplishmentsList: React.FC<AccomplishmentsListProps> = ({ stats }) => {
  if (stats.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center py-12">
          <p className="text-muted-foreground">No accomplishments found. Add your first accomplishment.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <AccomplishmentItem key={stat.id} stat={stat} />
      ))}
    </div>
  );
};

export default AccomplishmentsList;
