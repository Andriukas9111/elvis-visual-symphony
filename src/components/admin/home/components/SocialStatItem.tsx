
import React from 'react';
import { StatItem } from '@/hooks/api/useStats';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { getIconByName } from '../../about/stats/IconSelector';

interface SocialStatItemProps {
  stat: StatItem;
  onEdit: () => void;
  onDelete: () => void;
}

const SocialStatItem: React.FC<SocialStatItemProps> = ({ stat, onEdit, onDelete }) => {
  const IconComponent = getIconByName(stat.icon_name);

  return (
    <Card className="transition-all hover:border-elvis-pink/30">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 flex items-center justify-center bg-elvis-pink/20 rounded-md">
              {IconComponent && <IconComponent className="h-5 w-5 text-elvis-pink" />}
            </div>
            
            <div>
              <p className="font-medium text-lg">{stat.value}{stat.suffix}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialStatItem;
