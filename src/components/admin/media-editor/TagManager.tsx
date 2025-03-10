
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tag, X } from 'lucide-react';

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagManager: React.FC<TagManagerProps> = ({ tags, onTagsChange }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="newTag">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="newTag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="bg-elvis-medium border-white/10"
            placeholder="Add tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button 
            type="button"
            variant="outline"
            onClick={handleAddTag}
            className="border-white/10 hover:bg-elvis-pink/20"
          >
            <Tag className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map(tag => (
          <Badge
            key={tag}
            variant="outline"
            className="flex items-center gap-1 px-3 py-1 bg-elvis-medium/50"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 rounded-full hover:bg-white/10 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
};

export default TagManager;
