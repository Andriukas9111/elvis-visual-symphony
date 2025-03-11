
import React from 'react';

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
  return (
    <div className="text-sm text-white/60 mb-2">
      {filteredCount} {filteredCount === 1 ? 'item' : 'items'} found
      {categoryFilter && ` in category "${categoryFilter}"`}
      {searchQuery && ` matching "${searchQuery}"`}
    </div>
  );
};

export default FilterStatusBar;
