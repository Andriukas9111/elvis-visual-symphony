
import { useMotionValue, useSpring, MotionValue } from 'framer-motion';

interface CursorSpringConfig {
  damping: number;
  stiffness: number;
  mass: number;
}

export const useCursorAnimations = () => {
  // Spring motion values for smoother animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Configure spring for lag effect
  const springConfig: CursorSpringConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Scale springs for click/hover effects
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const springScaleX = useSpring(scaleX, springConfig);
  const springScaleY = useSpring(scaleY, springConfig);
  
  // For the outer circle animation
  const outerScaleX = useMotionValue(1);
  const outerScaleY = useMotionValue(1);
  const outerSpringScaleX = useSpring(outerScaleX, { ...springConfig, damping: 20 });
  const outerSpringScaleY = useSpring(outerScaleY, { ...springConfig, damping: 20 });
  
  // For rotation animation
  const rotate = useMotionValue(0);
  const springRotate = useSpring(rotate, { damping: 50, stiffness: 200 });

  return {
    // Position values
    mouseX,
    mouseY,
    springX,
    springY,
    
    // Scale values
    scaleX,
    scaleY,
    springScaleX,
    springScaleY,
    
    // Outer scale values
    outerScaleX,
    outerScaleY,
    outerSpringScaleX,
    outerSpringScaleY,
    
    // Rotation values
    rotate,
    springRotate,
  };
};
