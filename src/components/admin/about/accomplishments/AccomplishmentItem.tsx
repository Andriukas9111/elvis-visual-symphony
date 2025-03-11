
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Accomplishment } from '@/components/home/about/types';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { getIconByName } from '../../about/stats/IconSelector';
import AccomplishmentForm from './AccomplishmentForm';

interface AccomplishmentItemProps {
  item: Accomplishment;
  index: number;
  isEditing: boolean;
  editedItem: Partial<Accomplishment>;
  totalItems: number;
  onEdit: (item: Accomplishment) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: (id: string) => void;
  onEditItemChange: (field: string, value: string) => void;
  onMoveUp: (item: Accomplishment, index: number) => void;
  onMoveDown: (item: Accomplishment, index: number) => void;
}

const AccomplishmentItem: React.FC<AccomplishmentItemProps> = ({
  item,
  index,
  isEditing,
  editedItem,
  totalItems,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onEditItemChange,
  onMoveUp,
  onMoveDown
}) => {
  return (
    <Card key={item.id}>
      <CardContent className="pt-6">
        {isEditing ? (
          <AccomplishmentForm
            item={editedItem}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
            onChange={onEditItemChange}
            isNew={false}
            title="Edit Accomplishment"
          />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-secondary p-3 rounded-full">
                {React.createElement(getIconByName(item.icon_name), { className: "h-5 w-5" })}
              </div>
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  {item.title}
                  <span className="text-sm font-normal text-muted-foreground">
                    {item.date}
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onMoveUp(item, index)}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onMoveDown(item, index)}
                disabled={index === totalItems - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
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

export default AccomplishmentItem;
