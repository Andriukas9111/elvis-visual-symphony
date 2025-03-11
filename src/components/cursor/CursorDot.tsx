
import React from 'react';
import { motion } from 'framer-motion';
import { useCursor, CursorState } from '@/contexts/CursorContext';

interface CursorDotProps {
  springX: any;
  springY: any;
  springScaleX: any;
  springScaleY: any;
  springRotate: any;
}

const CursorDot: React.FC<CursorDotProps> = ({ 
  springX, 
  springY, 
  springScaleX, 
  springScaleY, 
  springRotate 
}) => {
  const { cursorState, isVisible } = useCursor();

  // Cursor state variants
  const cursorVariants = {
    default: {
      height: 12,
      width: 12,
      backgroundColor: 'rgba(255, 0, 255, 1)',
      mixBlendMode: 'difference' as 'difference',
      opacity: isVisible ? 1 : 0,
    },
    hover: {
      height: 24,
      width: 24,
      backgroundColor: 'rgba(255, 0, 255, 0.5)',
      mixBlendMode: 'difference' as 'difference',
    },
    click: {
      height: 10,
      width: 10,
      backgroundColor: 'rgba(255, 0, 255, 1)',
    },
    text: {
      height: 8,
      width: 8,
      backgroundColor: 'rgba(255, 0, 255, 1)',
    },
    media: {
      height: 16,
      width: 16,
      backgroundColor: 'rgba(255, 0, 255, 0.8)',
      mixBlendMode: 'difference' as 'difference',
    },
    hidden: {
      opacity: 0,
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
      style={{
        x: springX,
        y: springY,
        scaleX: springScaleX, 
        scaleY: springScaleY,
        rotate: springRotate,
        translateX: "-50%",
        translateY: "-50%",
        transformOrigin: "center center",
      }}
      variants={cursorVariants}
      animate={cursorState}
      transition={{
        type: 'spring',
        damping: 30,
        mass: 0.5,
        stiffness: 400,
      }}
    />
  );
};

export default CursorDot;
