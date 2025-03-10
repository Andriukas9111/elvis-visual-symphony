
import React from 'react';
import { motion } from 'framer-motion';
import { Tables } from '@/types/supabase';
import MediaCardTags from './MediaCardTags';

interface MediaCardContentProps {
  item: Tables<'media'>;
}

const MediaCardContent: React.FC<MediaCardContentProps> = ({ item }) => {
  return (
    <motion.div className="p-4 flex flex-col flex-grow">
      <motion.h3 
        className="text-xl font-bold text-white mb-2"
        layoutId={`media-title-${item.id}`}
      >
        {item.title}
      </motion.h3>
      
      {item.description && (
        <motion.p 
          className="text-gray-300 line-clamp-2 mb-auto"
          layoutId={`media-desc-${item.id}`}
        >
          {item.description}
        </motion.p>
      )}
      
      {item.tags && <MediaCardTags tags={item.tags} />}
    </motion.div>
  );
};

export default MediaCardContent;
