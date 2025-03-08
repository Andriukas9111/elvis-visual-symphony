
import React, { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CameraCardProps {
  title: string;
  description?: string;
  imageUrl: string;
  className?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'cinema';
  onClick?: () => void;
}

const CameraCard: React.FC<CameraCardProps> = ({
  title,
  description,
  imageUrl,
  className,
  aspectRatio = '16:9',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for the 3D tilting effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Convert mouse position to tilt
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  // Spring animations for smoother motion
  const springConfig = { damping: 20, stiffness: 200 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  // Handle mouse move for the 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Update motion values
    x.set(mouseX);
    y.set(mouseY);
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Determine aspect ratio class
  const aspectRatioClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    'cinema': 'aspect-[21/9]'
  }[aspectRatio];

  // Shutter animation variants
  const shutterVariants = {
    closed: { scaleY: 1 },
    open: { scaleY: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Lens aperture animation
  const apertureVariants = {
    closed: { scale: 0.7, opacity: 0.7 },
    open: { scale: 1, opacity: 1, transition: { duration: 0.3 } }
  };
  
  // Image variants for zoom effect
  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-lg bg-elvis-medium cursor-pointer",
        aspectRatioClass,
        className
      )}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      whileHover={{ z: 10 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
    >
      {/* Card background image */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
        variants={imageVariants}
      />
      
      {/* Shutter effect overlay */}
      <motion.div 
        className="absolute inset-0 bg-black origin-top"
        variants={shutterVariants}
        initial="closed"
        animate={isHovered ? "open" : "closed"}
      />
      
      {/* Content container */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        {/* Lens aperture decorative element */}
        <motion.div 
          className="absolute top-4 right-4 w-12 h-12"
          variants={apertureVariants}
          initial="closed"
          animate={isHovered ? "open" : "closed"}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 border-2 border-elvis-pink rounded-full" />
            <div className="absolute inset-2 border border-elvis-pink rounded-full" />
            <div className="absolute inset-4 bg-elvis-pink rounded-full" />
          </div>
        </motion.div>

        {/* Title and description */}
        <motion.h3 
          className="text-xl font-bold text-white mb-1"
          style={{ transform: "translateZ(30px)" }}
        >
          {title}
        </motion.h3>
        
        {description && (
          <motion.p 
            className="text-sm text-white/80"
            style={{ transform: "translateZ(20px)" }}
          >
            {description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default CameraCard;
