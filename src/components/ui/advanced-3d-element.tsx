
import React, { useRef, useState, ReactNode, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useAnimation as useGlobalAnimation } from '@/contexts/AnimationContext';

interface Advanced3DElementProps {
  children: ReactNode;
  className?: string;
  depth?: number;
  springStrength?: number;
  shadowColor?: string;
  glowColor?: string;
  onClick?: () => void;
  interactive?: boolean;
  hoverScale?: number;
  clickEffect?: boolean;
}

export const Advanced3DElement: React.FC<Advanced3DElementProps> = ({
  children,
  className = "",
  depth = 30,
  springStrength = 150,
  shadowColor = "rgba(255, 0, 255, 0.3)", 
  glowColor = "rgba(255, 0, 255, 0.5)",
  onClick,
  interactive = true,
  hoverScale = 1.03,
  clickEffect = true
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useGlobalAnimation();
  
  // Motion values for spring physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const z = useMotionValue(depth);
  
  // Spring configurations for smoother animation
  const springConfig = { damping: 25, stiffness: springStrength, mass: 1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springZ = useSpring(z, springConfig);
  
  // Shadow and glow effects based on rotation
  const boxShadow = useTransform(
    [springRotateX, springRotateY, springZ],
    ([latestRotateX, latestRotateY, latestZ]) => {
      // Ensure values are treated as numbers
      const rotX = Number(latestRotateX);
      const rotY = Number(latestRotateY);
      const zVal = Number(latestZ);
      
      const shadowX = rotY * 0.2;
      const shadowY = -rotX * 0.2;
      const blurRadius = Math.max(8, Math.abs(rotX) + Math.abs(rotY));
      
      return isPressed 
        ? `0 0 15px ${glowColor}`
        : `
          ${shadowX}px ${shadowY}px ${blurRadius}px rgba(0, 0, 0, 0.2),
          0 0 ${blurRadius * 1.5}px ${shadowColor}
        `;
    }
  );
  
  // Track mouse position for interactive hover effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || prefersReducedMotion || !elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate normalized position (-1 to 1)
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);
    
    // Convert to rotation angles (-15 to 15 degrees)
    rotateY.set(normalizedX * 15);
    rotateX.set(normalizedY * -15); // Invert Y for natural tilt
  };
  
  const handleMouseEnter = () => {
    if (!interactive || prefersReducedMotion) return;
    z.set(depth + 5);
  };
  
  const handleMouseLeave = () => {
    if (!interactive || prefersReducedMotion) return;
    rotateX.set(0);
    rotateY.set(0);
    z.set(depth);
  };
  
  const handleMouseDown = () => {
    if (!interactive || prefersReducedMotion) return;
    setIsPressed(true);
    z.set(depth - 10); // Press effect
  };
  
  const handleMouseUp = () => {
    if (!interactive || prefersReducedMotion) return;
    setIsPressed(false);
    z.set(depth);
  };
  
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  // Reset on unmount
  useEffect(() => {
    return () => {
      x.set(0);
      y.set(0);
      rotateX.set(0);
      rotateY.set(0);
      z.set(depth);
    };
  }, [depth, x, y, rotateX, rotateY, z]);

  return (
    <motion.div
      ref={elementRef}
      className={`relative ${className}`}
      style={{
        perspective: 1200,
        transformStyle: 'preserve-3d',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      whileHover={!prefersReducedMotion && interactive ? { scale: hoverScale } : {}}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-full h-full rounded-lg overflow-hidden"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          z: springZ,
          boxShadow,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
      >
        {children}
        
        {/* Click ripple effect */}
        {clickEffect && (
          <AnimatePresence>
            {isPressed && (
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none rounded-[inherit]"
                initial={{ opacity: 0.3, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ mixBlendMode: 'overlay' }}
              />
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Advanced3DElement;
