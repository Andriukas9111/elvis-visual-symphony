
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

type IconType = 'camera' | 'clapperboard' | 'lens' | 'film' | 'microphone' | 'light';

interface VideographyIconProps {
  type: IconType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

const VideographyIcon: React.FC<VideographyIconProps> = ({
  type,
  size = 'md',
  color = 'currentColor',
  animated = true,
  className,
  onClick
}) => {
  // Size mapping
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  };

  const iconSize = sizeMap[size];
  
  // Animation variants
  const iconVariants: Variants = {
    initial: {},
    hover: {},
  };
  
  // Camera animation variants
  const cameraVariants: Variants = {
    initial: {
      opacity: 1,
    },
    hover: {
      opacity: 1,
    },
  };

  const shutterVariants: Variants = {
    initial: {
      scale: 0.8,
      opacity: 0,
    },
    hover: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.3,
      },
    },
  };

  const lensVariants: Variants = {
    initial: {
      scale: 1,
    },
    hover: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.6,
        times: [0, 0.5, 1],
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  // Clapperboard animation variants
  const clapperVariants: Variants = {
    initial: {
      rotate: 0,
    },
    hover: {
      rotate: [-5, 0],
      transition: {
        duration: 0.4,
        repeat: 1,
        repeatType: "reverse",
      },
    },
  };

  // Film animation variants
  const filmVariants: Variants = {
    initial: {
      y: 0,
    },
    hover: {
      y: [-4, 0],
      transition: {
        duration: 0.7,
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  // Microphone animation variants
  const microphoneVariants: Variants = {
    initial: {
      scale: 1,
    },
    hover: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  // Light animation variants
  const lightVariants: Variants = {
    initial: {
      opacity: 0.7,
    },
    hover: {
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1,
        repeat: Infinity,
      },
    },
  };
  
  // Render appropriate icon based on type
  const renderIcon = () => {
    switch (type) {
      case 'camera':
        return (
          <motion.svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
            className={cn("transition-transform", className)}
            onClick={onClick}
          >
            {/* Camera body */}
            <motion.rect 
              x="2" 
              y="6" 
              width="18" 
              height="12" 
              rx="2" 
              stroke={color} 
              strokeWidth="2" 
              fill="transparent" 
              variants={cameraVariants}
            />
            
            {/* Camera lens */}
            <motion.circle 
              cx="11" 
              cy="12" 
              r="4" 
              stroke={color} 
              strokeWidth="2" 
              fill="transparent" 
              variants={lensVariants}
            />
            
            {/* Flash */}
            <motion.rect 
              x="16.5" 
              y="8" 
              width="2" 
              height="2" 
              rx="0.5" 
              fill={color} 
              variants={shutterVariants}
            />
            
            {/* Viewfinder */}
            <motion.rect 
              x="16.5" 
              y="3" 
              width="5" 
              height="3" 
              rx="1" 
              stroke={color} 
              strokeWidth="1.5" 
              fill="transparent" 
            />
            <motion.path 
              d="M16.5 6V6C16.5 5.44772 16.9477 5 17.5 5H20.5C21.0523 5 21.5 5.44772 21.5 6V6" 
              stroke={color} 
              strokeWidth="1.5"
            />
          </motion.svg>
        );
        
      case 'clapperboard':
        return (
          <motion.svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
            className={cn("transition-transform", className)}
            onClick={onClick}
          >
            {/* Board */}
            <motion.rect 
              x="2" 
              y="5" 
              width="20" 
              height="14" 
              rx="2" 
              stroke={color} 
              strokeWidth="2"
              fill="transparent"
            />
            
            {/* Clapper top part */}
            <motion.path 
              d="M2 9H22" 
              stroke={color} 
              strokeWidth="2"
            />
            
            {/* Diagonal lines */}
            <motion.path 
              d="M6 5L8 9" 
              stroke={color} 
              strokeWidth="1.5"
            />
            <motion.path 
              d="M10 5L12 9" 
              stroke={color} 
              strokeWidth="1.5"
            />
            <motion.path 
              d="M14 5L16 9" 
              stroke={color} 
              strokeWidth="1.5"
            />
            <motion.path 
              d="M18 5L20 9" 
              stroke={color} 
              strokeWidth="1.5"
            />
            
            {/* Clapper arm */}
            <motion.rect 
              x="3" 
              y="3" 
              width="18" 
              height="2" 
              rx="1" 
              stroke={color} 
              strokeWidth="1.5"
              fill="transparent"
              variants={clapperVariants}
              transformOrigin="left center"
            />
          </motion.svg>
        );
        
      case 'lens':
        return (
          <motion.svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
            className={cn("transition-transform", className)}
            onClick={onClick}
          >
            {/* Outer circle */}
            <motion.circle 
              cx="12" 
              cy="12" 
              r="9" 
              stroke={color} 
              strokeWidth="2" 
              fill="transparent"
            />
            
            {/* Middle circle */}
            <motion.circle 
              cx="12" 
              cy="12" 
              r="6" 
              stroke={color} 
              strokeWidth="1.5" 
              fill="transparent"
            />
            
            {/* Inner circle */}
            <motion.circle 
              cx="12" 
              cy="12" 
              r="3" 
              stroke={color} 
              strokeWidth="1.5" 
              fill="transparent"
              variants={lensVariants}
            />
            
            {/* Reflection dot */}
            <motion.circle 
              cx="9" 
              cy="9" 
              r="1" 
              fill={color}
            />
          </motion.svg>
        );
        
      case 'film':
        return (
          <motion.svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
            className={cn("transition-transform", className)}
            onClick={onClick}
          >
            {/* Film body */}
            <motion.rect 
              x="4" 
              y="3" 
              width="16" 
              height="18" 
              rx="2" 
              stroke={color} 
              strokeWidth="2"
              fill="transparent"
              variants={filmVariants}
            />
            
            {/* Sprocket holes */}
            <motion.circle cx="7" cy="6" r="1" fill={color} />
            <motion.circle cx="7" cy="10" r="1" fill={color} />
            <motion.circle cx="7" cy="14" r="1" fill={color} />
            <motion.circle cx="7" cy="18" r="1" fill={color} />
            
            <motion.circle cx="17" cy="6" r="1" fill={color} />
            <motion.circle cx="17" cy="10" r="1" fill={color} />
            <motion.circle cx="17" cy="14" r="1" fill={color} />
            <motion.circle cx="17" cy="18" r="1" fill={color} />
          </motion.svg>
        );
        
      case 'microphone':
        return (
          <motion.svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
            className={cn("transition-transform", className)}
            onClick={onClick}
          >
            {/* Mic body */}
            <motion.rect 
              x="9" 
              y="3" 
              width="6" 
              height="10" 
              rx="3" 
              stroke={color} 
              strokeWidth="2"
              fill="transparent"
              variants={microphoneVariants}
            />
            
            {/* Stand */}
            <motion.path 
              d="M12 17V21" 
              stroke={color} 
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Base */}
            <motion.path 
              d="M8 21H16" 
              stroke={color} 
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Sound waves */}
            <motion.path 
              d="M6 10C6 10 5 10 5 12" 
              stroke={color} 
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <motion.path 
              d="M18 10C18 10 19 10 19 12" 
              stroke={color} 
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </motion.svg>
        );
        
      case 'light':
        return (
          <motion.svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
            className={cn("transition-transform", className)}
            onClick={onClick}
          >
            {/* Light body */}
            <motion.rect 
              x="7" 
              y="4" 
              width="10" 
              height="8" 
              rx="1" 
              stroke={color} 
              strokeWidth="2"
              fill="transparent"
            />
            
            {/* Stand */}
            <motion.path 
              d="M12 12V17" 
              stroke={color} 
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Base */}
            <motion.path 
              d="M8 17H16" 
              stroke={color} 
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Light rays */}
            <motion.path 
              d="M4 8H5" 
              stroke={color} 
              strokeWidth="1.5"
              strokeLinecap="round"
              variants={lightVariants}
            />
            <motion.path 
              d="M19 8H20" 
              stroke={color} 
              strokeWidth="1.5"
              strokeLinecap="round"
              variants={lightVariants}
            />
            <motion.path 
              d="M12 1V2" 
              stroke={color} 
              strokeWidth="1.5"
              strokeLinecap="round"
              variants={lightVariants}
            />
            <motion.path 
              d="M6 3L7 4" 
              stroke={color} 
              strokeWidth="1.5"
              strokeLinecap="round"
              variants={lightVariants}
            />
            <motion.path 
              d="M18 3L17 4" 
              stroke={color} 
              strokeWidth="1.5"
              strokeLinecap="round"
              variants={lightVariants}
            />
          </motion.svg>
        );
        
      default:
        return null;
    }
  };

  return renderIcon();
};

export default VideographyIcon;
