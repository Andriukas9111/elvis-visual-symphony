
import React, { useState, useRef, ReactNode, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

const Card3D = ({ 
  children, 
  className = "w-32 h-32", 
  intensity = 10,
  glare = true
}: Card3DProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useAnimation();
  
  // Motion values for smooth transitions
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Create springs for smoother animations
  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // For the glare effect
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useTransform(
    [rotateX, rotateY],
    ([latestRotateX, latestRotateY]) => {
      const distance = Math.sqrt(latestRotateX ** 2 + latestRotateY ** 2);
      return Math.min(distance / intensity * 0.05, 0.4);
    }
  );

  // Effect to sync glare with rotation
  useEffect(() => {
    const unsubscribeX = rotateX.onChange(latest => {
      glareY.set(50 - latest);
    });
    
    const unsubscribeY = rotateY.onChange(latest => {
      glareX.set(50 + latest);
    });
    
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [rotateX, rotateY, glareX, glareY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation based on mouse position
    const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * intensity;
    const rotateXValue = ((centerY - mouseY) / (rect.height / 2)) * intensity;
    
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseEnter = () => {
    if (prefersReducedMotion) return;
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion) return;
    setIsHovering(false);
    
    // Reset to flat position
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center rounded-xl bg-gradient-to-br from-elvis-pink/30 to-elvis-purple/30 border border-white/20 shadow-pink-glow/20"
        style={{
          transformStyle: "preserve-3d",
          rotateX: springRotateX,
          rotateY: springRotateY,
          boxShadow: isHovering ? "0 15px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px -5px rgba(255, 0, 255, 0.7)" : undefined,
          transition: "box-shadow 0.4s ease"
        }}
      >
        <motion.div
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(20px)",
          }}
        >
          {children}
        </motion.div>
        
        {/* Glare effect */}
        {glare && (
          <motion.div
            className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
            style={{
              background: `radial-gradient(
                circle at ${glareX}% ${glareY}%, 
                rgba(255, 255, 255, 0.8) 0%, 
                rgba(255, 255, 255, 0) 70%
              )`,
              opacity: isHovering ? glareOpacity : 0,
              mixBlendMode: "overlay",
              transition: "opacity 0.3s ease"
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default Card3D;
