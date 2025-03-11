
import React from 'react';
import { SocialProfile } from '@/types/about.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { getDynamicIcon } from '@/utils/iconUtils';

interface PlatformItemProps {
  platform: SocialProfile;
  onEdit: (platform: SocialProfile) => void;
  onDelete: (id: string) => void;
}

const PlatformItem = ({ platform, onEdit, onDelete }: PlatformItemProps) => {
  const Icon = getDynamicIcon(platform.icon_name);

  return (
    <Card className="mb-2 border border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
            <div className="bg-muted p-2 rounded-full">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{platform.platform}</p>
              <p className="text-sm text-muted-foreground">@{platform.username}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(platform)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(platform.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformItem;
