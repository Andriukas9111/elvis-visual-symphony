
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialPlatformData } from '@/components/home/about/types';

interface PlatformItemProps {
  platform: SocialPlatformData;
  index: number;
  totalCount: number;
  isEditing: boolean;
  editedPlatform: Partial<SocialPlatformData>;
  setEditedPlatform: React.Dispatch<React.SetStateAction<Partial<SocialPlatformData>>>;
  onEdit: (platform: SocialPlatformData) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  platformOptions: { value: string; label: string; color: string }[];
}

const PlatformItem: React.FC<PlatformItemProps> = ({
  platform,
  index,
  totalCount,
  isEditing,
  editedPlatform,
  setEditedPlatform,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onMoveUp,
  onMoveDown,
  platformOptions
}) => {
  return (
    <div className="p-4 border rounded-md flex items-start justify-between">
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div>
            <Label htmlFor={`edit-name-${platform.id}`} className="mb-1 block">Platform Name</Label>
            <Input
              id={`edit-name-${platform.id}`}
              value={editedPlatform.name || ''}
              onChange={(e) => setEditedPlatform({...editedPlatform, name: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor={`edit-url-${platform.id}`} className="mb-1 block">Platform URL</Label>
            <Input
              id={`edit-url-${platform.id}`}
              value={editedPlatform.url || ''}
              onChange={(e) => setEditedPlatform({...editedPlatform, url: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor={`edit-platform-${platform.id}`} className="mb-1 block">Platform Type</Label>
            <Select
              value={editedPlatform.icon || ''}
              onValueChange={(value) => {
                const selected = platformOptions.find(p => p.value === value);
                setEditedPlatform({
                  ...editedPlatform, 
                  icon: value,
                  color: selected?.color || 'gray'
                });
              }}
            >
              <SelectTrigger id={`edit-platform-${platform.id}`}>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="flex flex-col">
            <p className="font-medium">{platform.name}</p>
            <p className="text-sm text-muted-foreground">{platform.url}</p>
          </div>
        </div>
      )}
      
      <div className="flex gap-1 shrink-0">
        {isEditing ? (
          <>
            <Button onClick={onSave} size="icon" variant="ghost">
              <Check className="h-4 w-4" />
            </Button>
            <Button onClick={onCancel} size="icon" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={() => onMoveUp(index)} 
              size="icon" 
              variant="ghost"
              disabled={index === 0}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => onMoveDown(index)} 
              size="icon" 
              variant="ghost"
              disabled={index === totalCount - 1}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button onClick={() => onEdit(platform)} size="icon" variant="ghost">
              <Edit className="h-4 w-4" />
            </Button>
            <Button onClick={() => onDelete(platform.id)} size="icon" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlatformItem;
