import React, { useEffect, useState, useRef } from 'react';
import { useAnimation } from '@/contexts/AnimationContext';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';

interface CursorPosition {
  x: number;
  y: number;
}

// Define different cursor states with animation properties
type CursorState = 'default' | 'hover' | 'click' | 'hidden' | 'text' | 'media' | 'link';

const CustomCursor: React.FC = () => {
  const { prefersReducedMotion } = useAnimation();
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  
  // Spring motion values for smoother animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Configure spring for lag effect
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
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

  // Skip cursor for mobile devices or reduced motion preference
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Don't render the cursor if on mobile or user prefers reduced motion
  if (isMobile || prefersReducedMotion) {
    return null;
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMoved) setHasMoved(true);
      
      // Update motion values
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Update state (for non-spring elements)
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setCursorState('click');
      
      // Squish effect
      scaleX.set(0.8);
      scaleY.set(0.8);
      outerScaleX.set(0.9);
      outerScaleY.set(0.9);
      
      // Random rotation for more dynamic feel
      rotate.set(Math.random() * 20 - 10);
    };
    
    const handleMouseUp = () => {
      setCursorState(prevState => prevState === 'click' ? 'default' : prevState);
      
      // Reset scales with spring animation
      scaleX.set(1);
      scaleY.set(1);
      outerScaleX.set(1);
      outerScaleY.set(1);
      rotate.set(0);
    };

    // Detect interactive elements
    const handleElementDetection = () => {
      const detectInteractiveElement = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Check for different interactive elements
        if (target.closest('a, button, [role="button"], input, select, textarea, [tabindex="0"]')) {
          setCursorState('hover');
          outerScaleX.set(1.3);
          outerScaleY.set(1.3);
        } else if (target.closest('p, h1, h2, h3, h4, h5, h6, span, label')) {
          setCursorState('text');
          scaleX.set(1.2);
          scaleY.set(0.3);
          rotate.set(0);
        } else if (target.closest('img, video, canvas, svg, [role="img"]')) {
          setCursorState('media');
          outerScaleX.set(1.5);
          outerScaleY.set(1.5);
          rotate.set(0);
        } else {
          setCursorState('default');
          scaleX.set(1);
          scaleY.set(1);
          outerScaleX.set(1);
          outerScaleY.set(1);
          rotate.set(0);
        }
      };
      
      document.addEventListener('mouseover', detectInteractiveElement);
      return () => document.removeEventListener('mouseover', detectInteractiveElement);
    };
    
    const elementDetectionCleanup = handleElementDetection();

    // Add mouse event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Hide cursor when leaving the window
    document.documentElement.addEventListener('mouseleave', () => {
      setIsVisible(false);
      setCursorState('hidden');
    });
    
    document.documentElement.addEventListener('mouseenter', () => {
      setIsVisible(true);
      setCursorState('default');
    });

    // Initial animation when the cursor first appears
    if (!hasMoved && cursorRef.current && cursorOuterRef.current) {
      animate(scaleX, [0, 1.5, 1], { duration: 0.8, ease: "backOut" });
      animate(scaleY, [0, 1.5, 1], { duration: 0.8, ease: "backOut" });
      animate(outerScaleX, [0, 1.5, 1], { duration: 1, ease: "backOut" });
      animate(outerScaleY, [0, 1.5, 1], { duration: 1, ease: "backOut" });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', () => setIsVisible(false));
      document.documentElement.removeEventListener('mouseenter', () => setIsVisible(true));
      elementDetectionCleanup();
    };
  }, [
    mouseX, mouseY, scaleX, scaleY, outerScaleX, outerScaleY, rotate, 
    hasMoved, prefersReducedMotion
  ]);

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
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
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
      
      {/* Outer cursor ring */}
      <motion.div
        ref={cursorOuterRef}
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
      
      {/* Glow effect */}
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
    </>
  );
};

export default CustomCursor;
