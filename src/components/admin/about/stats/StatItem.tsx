
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { StatData } from '@/components/home/about/types';
import { Edit, Trash2 } from 'lucide-react';
import { getIconByName } from './IconSelector';
import StatForm from './StatForm';

interface StatItemProps {
  item: StatData;
  isEditing: boolean;
  editedItem: Partial<StatData>;
  onEdit: (item: StatData) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: (id: string) => void;
  onEditItemChange: (field: string, value: string | number) => void;
}

const StatItem: React.FC<StatItemProps> = ({
  item,
  isEditing,
  editedItem,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onEditItemChange
}) => {
  return (
    <Card key={item.id}>
      <CardContent className="pt-6">
        {isEditing ? (
          <StatForm
            item={editedItem}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
            onChange={onEditItemChange}
            isNew={false}
            title="Edit Statistic"
          />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-secondary p-3 rounded-full">
                {React.createElement(getIconByName(item.icon_name || 'Activity'), { className: "h-5 w-5" })}
              </div>
              <div>
                <h3 className="text-lg font-medium">{item.label}</h3>
                <p className="text-sm text-muted-foreground">
                  Value: {item.value}
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
        )}
      </CardContent>
    </Card>
  );
};

export default StatItem;
