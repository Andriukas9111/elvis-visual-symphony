
import React from 'react';
import { useAnimation } from '@/contexts/AnimationContext';
import { CursorProvider, useCursor } from '@/contexts/CursorContext';
import { useCursorAnimations } from '@/hooks/useCursorAnimations';
import { useCursorEvents } from '@/hooks/useCursorEvents';
import CursorDot from '@/components/cursor/CursorDot';
import CursorRing from '@/components/cursor/CursorRing';
import CursorGlow from '@/components/cursor/CursorGlow';

const CursorRenderer: React.FC = () => {
  const { hasMoved } = useCursor();
  const animationValues = useCursorAnimations();
  
  // Set up event handlers
  useCursorEvents(animationValues, hasMoved);
  
  const { 
    springX, 
    springY, 
    springScaleX, 
    springScaleY, 
    springRotate,
    outerSpringScaleX, 
    outerSpringScaleY 
  } = animationValues;

  return (
    <>
      {/* Main cursor dot */}
      <CursorDot 
        springX={springX}
        springY={springY}
        springScaleX={springScaleX}
        springScaleY={springScaleY}
        springRotate={springRotate}
      />
      
      {/* Outer cursor ring */}
      <CursorRing 
        springX={springX}
        springY={springY}
        outerSpringScaleX={outerSpringScaleX}
        outerSpringScaleY={outerSpringScaleY}
      />
      
      {/* Glow effect */}
      <CursorGlow 
        springX={springX}
        springY={springY}
      />
    </>
  );
};

const CustomCursor: React.FC = () => {
  const { prefersReducedMotion } = useAnimation();
  
  // Skip cursor for mobile devices or reduced motion preference
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Don't render the cursor if on mobile or user prefers reduced motion
  if (isMobile || prefersReducedMotion) {
    return null;
  }

  return (
    <CursorProvider>
      <CursorRenderer />
    </CursorProvider>
  );
};

export default CustomCursor;
