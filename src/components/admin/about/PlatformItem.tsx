
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { SocialPlatformData } from '@/types/about.types';

interface PlatformItemProps {
  platform: SocialPlatformData;
  onEdit: (platform: SocialPlatformData) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: any;
}

const PlatformItem: React.FC<PlatformItemProps> = ({
  platform,
  onEdit,
  onDelete,
  dragHandleProps
}) => {
  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {dragHandleProps && (
              <div {...dragHandleProps} className="cursor-grab">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <h3 className="font-medium">{platform.name}</h3>
              <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-[300px] md:max-w-[500px]">
                {platform.url}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(platform)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(platform.id)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformItem;
