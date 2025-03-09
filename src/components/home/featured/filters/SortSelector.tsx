
import React from 'react';
import { Clock, SortAsc, Shuffle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from '@/hooks/useMediaFilters';

interface SortSelectorProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortSelector = ({
  sortBy,
  onSortChange,
}: SortSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="px-3 py-1 border-elvis-pink/50 flex items-center gap-1">
        <SortAsc className="w-3 h-3" /> Sort
      </Badge>
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-[140px] bg-elvis-darker/50 border-elvis-pink/20">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-elvis-darker border-elvis-pink/20">
          <SelectItem value="newest" className="text-white">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" /> Newest
            </div>
          </SelectItem>
          <SelectItem value="oldest" className="text-white">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" /> Oldest
            </div>
          </SelectItem>
          <SelectItem value="title" className="text-white">
            <div className="flex items-center gap-2">
              <SortAsc className="h-3 w-3" /> Title
            </div>
          </SelectItem>
          <SelectItem value="random" className="text-white">
            <div className="flex items-center gap-2">
              <Shuffle className="h-3 w-3" /> Random
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSelector;
