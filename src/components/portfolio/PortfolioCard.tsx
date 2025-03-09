
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Image as ImageIcon, Video, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  video?: boolean;
  videoUrl?: string;
  featured?: boolean;
  description?: string;
}

interface PortfolioCardProps {
  item: PortfolioItem;
  index: number;
  isVisible?: boolean;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ 
  item, 
  index, 
  isVisible = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D transform variables
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Limit rotation to a smaller range for subtle effect
    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;
    
    setRotateX(rotateX);
    setRotateY(rotateY);
  };
  
  const resetRotation = () => {
    setRotateX(0);
    setRotateY(0);
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "portfolio-card cursor-pointer perspective-container",
        item.featured && "col-span-2 row-span-2"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 20,
        transition: { delay: index * 0.1, duration: 0.4 }
      }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetRotation();
      }}
      onMouseMove={handleMouseMove}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div className="relative overflow-hidden rounded-xl h-full">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square w-full h-full">
          <img 
            src={item.image} 
            alt={item.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered && "scale-105"
            )}
          />
          
          {/* Format indicator & featured badge */}
          <div className="absolute top-3 left-3 flex space-x-2">
            {item.featured && (
              <span className="rounded-full bg-elvis-pink/90 backdrop-blur-sm p-1.5 shadow-pink-glow">
                <Star className="h-4 w-4 text-white fill-white" />
              </span>
            )}
            
            <span className="rounded-full bg-black/50 backdrop-blur-sm p-1.5">
              {item.video ? (
                <Video className="h-4 w-4 text-white" />
              ) : (
                <ImageIcon className="h-4 w-4 text-white" />
              )}
            </span>
          </div>
          
          {/* Overlay */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-elvis-dark via-transparent to-transparent",
              "opacity-0 transition-opacity duration-300",
              isHovered && "opacity-100"
            )}
          />
          
          {/* Play button for videos */}
          {item.video && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                scale: isHovered ? 1 : 0.8,
                transition: { duration: 0.3 }
              }}
            >
              <div className="w-16 h-16 rounded-full bg-elvis-pink/30 backdrop-blur-md 
                  flex items-center justify-center shadow-pink-glow hover:bg-elvis-pink/50 
                  transition-colors duration-300">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            </motion.div>
          )}
          
          {/* Caption */}
          <motion.div 
            className="absolute bottom-0 left-0 w-full p-4 z-20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: isHovered ? 0 : 20, 
              opacity: isHovered ? 1 : 0,
              transition: { duration: 0.3 }
            }}
          >
            <span className="text-sm text-elvis-pink font-medium block mb-1">{item.category}</span>
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            {item.description && isHovered && (
              <motion.p 
                className="text-white/80 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {item.description}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioCard;
