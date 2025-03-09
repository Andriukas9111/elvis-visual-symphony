
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAnimation as useGlobalAnimation } from '@/contexts/AnimationContext';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  glareEnabled?: boolean;
  persistOnHover?: boolean;
  shadowColor?: string;
  borderColor?: string;
  borderWidth?: number;
  noHover?: boolean;
}

export const Card3D = ({
  children,
  className = "",
  strength = 20,
  glareEnabled = true,
  persistOnHover = false,
  shadowColor = "rgba(255, 0, 255, 0.6)",
  borderColor = "rgba(255, 0, 255, 0.4)",
  borderWidth = 1,
  noHover = false
}: Card3DProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useGlobalAnimation();
  const controls = useAnimation();
  const cardSize = useRef({ width: 0, height: 0 });
  
  // Motion values for smooth transitions
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Create springs for smoother animations
  const springConfig = { damping: 20, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Glare effect position
  const glareX = useMotionValue(0);
  const glareY = useMotionValue(0);
  const springGlareX = useSpring(glareX, springConfig);
  const springGlareY = useSpring(glareY, springConfig);
  const glareOpacity = useTransform(springRotateX, [-10, 0, 10], [0.1, 0.3, 0.1]);
  
  // Shadow offset based on rotation
  const shadowX = useTransform(springRotateY, [-10, 0, 10], [-10, 0, 10]);
  const shadowY = useTransform(springRotateX, [-10, 0, 10], [10, 0, -10]);

  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      cardSize.current = { width: rect.width, height: rect.height };
    }
    
    // Reset on component unmount
    return () => {
      controls.stop();
    };
  }, [controls]);

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || noHover) return;
    
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation based on mouse position (invert Y axis for natural feeling)
    const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * strength;
    const rotateXValue = ((centerY - mouseY) / (rect.height / 2)) * strength;
    
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    
    // Calculate glare position (opposite of rotation for realistic light effect)
    glareX.set(50 + (rotateYValue / strength) * -30); // Percentage position
    glareY.set(50 + (rotateXValue / strength) * -30); // Percentage position
  };

  const handleMouseEnter = () => {
    if (prefersReducedMotion || noHover) return;
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion || noHover) return;
    
    if (!persistOnHover) {
      // Reset to original position
      rotateX.set(0);
      rotateY.set(0);
      glareX.set(50);
      glareY.set(50);
    }
    
    setIsHovering(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      whileHover={!prefersReducedMotion && !noHover ? { scale: 1.02 } : {}}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
          boxShadow: isHovering ? `
            0 10px 20px -5px rgba(0, 0, 0, 0.2),
            ${shadowX.get()}px ${shadowY.get()}px 30px -10px ${shadowColor}
          ` : `0 4px 6px -1px rgba(0, 0, 0, 0.1)`,
          border: `${borderWidth}px solid ${
            isHovering ? borderColor : "rgba(255, 255, 255, 0.1)"
          }`,
          transition: "box-shadow 0.4s, border 0.4s"
        }}
      >
        {/* Main content */}
        <div className="w-full h-full relative">
          {children}
        </div>
        
        {/* Glare effect */}
        {glareEnabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]"
            style={{
              opacity: isHovering ? glareOpacity : 0,
              background: `radial-gradient(
                circle at ${springGlareX}% ${springGlareY}%,
                rgba(255, 255, 255, 0.6) 0%,
                rgba(255, 255, 255, 0) 70%
              )`,
              mixBlendMode: "overlay",
              transition: "opacity 0.4s"
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default Card3D;
