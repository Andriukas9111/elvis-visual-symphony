
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { getIconByName } from '../stats/IconSelector';
import { TechnicalSkillData } from '@/components/home/about/types';

interface SkillCardProps {
  item: TechnicalSkillData;
  isEditing: boolean;
  onEdit: (item: TechnicalSkillData) => void;
  onDelete: (id: string) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ item, isEditing, onEdit, onDelete }) => {
  if (isEditing) return null;
  
  return (
    <Card key={item.id}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-secondary p-3 rounded-full">
              {React.createElement(getIconByName(item.icon_name || 'Code'), { className: "h-5 w-5" })}
            </div>
            <div>
              <h3 className="text-lg font-medium">{item.category}</h3>
              <p className="text-sm text-muted-foreground">
                {item.skills && item.skills.length} skills
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillCard;
