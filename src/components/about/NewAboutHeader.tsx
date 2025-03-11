
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface AboutHeaderProps {
  title?: string;
  subtitle?: string;
}

const NewAboutHeader: React.FC<AboutHeaderProps> = ({ 
  title = "About Elvis Creative",
  subtitle = "Professional videographer and cinematographer with over 8 years of experience creating visual stories that captivate and inspire audiences worldwide."
}) => {
  // Split the title to style "Elvis Creative" differently
  const [firstWord, ...restWords] = title.split(' ');
  const highlightedText = restWords.join(' ');

  return (
    <div className="relative py-20 px-4">
      {/* Background circles */}
      <div className="absolute top-[10%] left-[20%] w-2 h-2 rounded-full bg-elvis-pink/30" />
      <div className="absolute top-[15%] right-[30%] w-2 h-2 rounded-full bg-elvis-pink/30" />
      <div className="absolute bottom-[20%] right-[20%] w-2 h-2 rounded-full bg-elvis-pink/30" />
      
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {firstWord}{' '}
          <span className={cn(
            "bg-gradient-to-r from-[#9b87f5] to-[#6E59A5]",
            "text-transparent bg-clip-text font-cursive"
          )}>
            {highlightedText}
          </span>
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default NewAboutHeader;
