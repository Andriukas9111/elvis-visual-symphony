
import React from 'react';
import { SocialPlatformData } from '@/components/home/about/types';
import PlatformItem from './PlatformItem';

interface PlatformListProps {
  platforms: SocialPlatformData[];
  isEditing: string | null;
  editedPlatform: Partial<SocialPlatformData>;
  setEditedPlatform: React.Dispatch<React.SetStateAction<Partial<SocialPlatformData>>>;
  onEdit: (platform: SocialPlatformData) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const platformOptions = [
  { value: 'Instagram', label: 'Instagram', color: 'pink' },
  { value: 'Youtube', label: 'YouTube', color: 'red' },
  { value: 'Twitter', label: 'Twitter', color: 'blue' },
  { value: 'Facebook', label: 'Facebook', color: 'blue' },
  { value: 'Linkedin', label: 'LinkedIn', color: 'blue' },
  { value: 'TikTok', label: 'TikTok', color: 'black' },
  { value: 'Pinterest', label: 'Pinterest', color: 'red' },
  { value: 'Behance', label: 'Behance', color: 'blue' },
];

const PlatformList: React.FC<PlatformListProps> = ({
  platforms,
  isEditing,
  editedPlatform,
  setEditedPlatform,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  if (platforms.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No social media platforms added yet. Add your first platform to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {platforms.map((platform, index) => (
        <PlatformItem
          key={platform.id}
          platform={platform}
          index={index}
          totalCount={platforms.length}
          isEditing={isEditing === platform.id}
          editedPlatform={editedPlatform}
          setEditedPlatform={setEditedPlatform}
          onEdit={onEdit}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          platformOptions={platformOptions}
        />
      ))}
    </div>
  );
};

export default PlatformList;
