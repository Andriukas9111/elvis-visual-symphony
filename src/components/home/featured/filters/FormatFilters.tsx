
import React from 'react';
import { Film, Camera, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrientationType } from '@/hooks/useMediaFilters';

interface FormatFiltersProps {
  orientation: OrientationType;
  onOrientationChange: (orientation: OrientationType) => void;
}

const FormatFilters = ({
  orientation,
  onOrientationChange,
}: FormatFiltersProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className="px-3 py-1 border-elvis-pink/50 flex items-center gap-1">
        <SlidersHorizontal className="w-3 h-3" /> Format
      </Badge>
      <div className="flex bg-elvis-darker/50 rounded-full p-1">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full px-3 py-1 text-xs ${orientation === 'all' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
          onClick={() => onOrientationChange('all')}
        >
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full px-3 py-1 text-xs flex items-center ${orientation === 'horizontal' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
          onClick={() => onOrientationChange('horizontal')}
        >
          <Film className="w-3 h-3 mr-1" /> Widescreen
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full px-3 py-1 text-xs flex items-center ${orientation === 'vertical' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
          onClick={() => onOrientationChange('vertical')}
        >
          <Camera className="w-3 h-3 mr-1" /> Vertical
        </Button>
      </div>
    </div>
  );
};

export default FormatFilters;
