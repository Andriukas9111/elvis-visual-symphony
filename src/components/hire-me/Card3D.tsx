
import React, { useState, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Card3DProps {
  children: ReactNode;
}

const Card3D = ({ children }: Card3DProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation based on mouse position
    const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * 10;
    const rotateXValue = ((centerY - mouseY) / (rect.height / 2)) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="perspective-1000 w-32 h-32"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center rounded-xl bg-gradient-to-br from-elvis-pink/30 to-elvis-purple/30 border border-white/20 shadow-lg"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(20px)",
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Card3D;
