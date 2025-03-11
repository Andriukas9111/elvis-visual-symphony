
import React from 'react';
import { Filter } from 'lucide-react';

interface FilterStatusBarProps {
  filteredCount: number;
  categoryFilter: string;
  searchQuery: string;
}

const FilterStatusBar: React.FC<FilterStatusBarProps> = ({ 
  filteredCount, 
  categoryFilter, 
  searchQuery 
}) => {
  const isFiltering = categoryFilter || searchQuery;
  
  return (
    <div className="text-sm text-white/60 mb-2 flex items-center">
      {isFiltering && <Filter className="h-3 w-3 mr-1 opacity-70" />}
      <span>
        {filteredCount} {filteredCount === 1 ? 'item' : 'items'} found
        {categoryFilter && ` in category "${categoryFilter}"`}
        {searchQuery && ` matching "${searchQuery}"`}
      </span>
    </div>
  );
};

export default FilterStatusBar;
