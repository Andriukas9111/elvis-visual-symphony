
import React from 'react';
import { SocialPlatformData } from '@/components/home/about/types';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SocialMediaListProps {
  socialMedia: SocialPlatformData[];
  onEdit: (item: SocialPlatformData) => void;
  onDelete: (id: string) => void;
}

const SocialMediaList: React.FC<SocialMediaListProps> = ({ 
  socialMedia, 
  onEdit,
  onDelete 
}) => {
  if (socialMedia.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No social media platforms have been added yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {socialMedia.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                  {item.url}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SocialMediaList;
