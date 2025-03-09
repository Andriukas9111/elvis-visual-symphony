
import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Square, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterControlsProps {
  orientation: string | null;
  setOrientation: (orientation: string | null) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  orientation,
  setOrientation,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8"
    >
      <div className="flex items-center gap-2 bg-elvis-dark/50 p-2 rounded-lg backdrop-blur-sm">
        <Button
          variant={orientation === null ? "default" : "outline"}
          size="sm"
          onClick={() => setOrientation(null)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          <span>All</span>
        </Button>
        
        <Button
          variant={orientation === 'horizontal' ? "default" : "outline"}
          size="sm"
          onClick={() => setOrientation('horizontal')}
          className="flex items-center gap-2"
        >
          <Layout className="h-4 w-4" />
          <span>Horizontal</span>
        </Button>
        
        <Button
          variant={orientation === 'vertical' ? "default" : "outline"}
          size="sm"
          onClick={() => setOrientation('vertical')}
          className="flex items-center gap-2"
        >
          <Square className="h-4 w-4 rotate-12" />
          <span>Vertical</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default FilterControls;
