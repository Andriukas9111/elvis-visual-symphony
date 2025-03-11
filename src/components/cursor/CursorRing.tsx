
import React from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '@/contexts/CursorContext';

interface CursorRingProps {
  springX: any;
  springY: any;
  outerSpringScaleX: any;
  outerSpringScaleY: any;
}

const CursorRing: React.FC<CursorRingProps> = ({ 
  springX, 
  springY, 
  outerSpringScaleX, 
  outerSpringScaleY 
}) => {
  const { cursorState, isVisible } = useCursor();

  const outerCursorVariants = {
    default: {
      height: 32,
      width: 32,
      border: '1px solid rgba(255, 0, 255, 0.5)',
      backgroundColor: 'transparent',
      opacity: isVisible ? 0.5 : 0,
    },
    hover: {
      height: 48,
      width: 48,
      border: '1px solid rgba(255, 0, 255, 0.8)',
      opacity: isVisible ? 0.8 : 0,
    },
    click: {
      height: 36,
      width: 36,
      border: '1px solid rgba(255, 0, 255, 1)',
      opacity: isVisible ? 1 : 0,
    },
    text: {
      height: 40,
      width: 40,
      border: '1px solid rgba(255, 0, 255, 0.3)',
      opacity: isVisible ? 0.3 : 0,
    },
    media: {
      height: 80,
      width: 80,
      border: '1px solid rgba(255, 0, 255, 0.4)',
      borderWidth: '2px',
      opacity: isVisible ? 0.4 : 0,
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
        scaleX: outerSpringScaleX, 
        scaleY: outerSpringScaleY,
        translateX: "-50%",
        translateY: "-50%",
        transformOrigin: "center center",
      }}
      variants={outerCursorVariants}
      animate={cursorState}
      transition={{
        type: 'spring',
        damping: 20,
        mass: 0.6,
        stiffness: 300,
      }}
    />
  );
};

export default CursorRing;
