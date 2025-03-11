
import React from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '@/contexts/CursorContext';

interface CursorGlowProps {
  springX: any;
  springY: any;
}

const CursorGlow: React.FC<CursorGlowProps> = ({ springX, springY }) => {
  const { cursorState } = useCursor();

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full bg-elvis-pink/20 blur-md"
      style={{
        x: springX,
        y: springY,
        width: 80,
        height: 80,
        translateX: "-50%",
        translateY: "-50%",
        opacity: cursorState === 'hover' || cursorState === 'media' ? 0.4 : 0,
        scale: cursorState === 'hover' ? 1.2 : cursorState === 'media' ? 1.5 : 1,
      }}
      transition={{
        opacity: { duration: 0.4 },
        scale: { type: 'spring', damping: 20, stiffness: 300 },
      }}
    />
  );
};

export default CursorGlow;
