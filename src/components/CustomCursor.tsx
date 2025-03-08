
import React, { useEffect, useState, useRef } from 'react';
import { useAnimation } from '@/contexts/AnimationContext';
import { motion } from 'framer-motion';

interface CursorPosition {
  x: number;
  y: number;
}

const CustomCursor: React.FC = () => {
  const { prefersReducedMotion } = useAnimation();
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);

  // Skip cursor for mobile devices or reduced motion preference
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Don't render the cursor if on mobile or user prefers reduced motion
  if (isMobile || prefersReducedMotion) {
    return null;
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    // Add hover detection for buttons, links, and interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, select, textarea, [tabindex="0"]'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    // Add mouse event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Hide cursor when leaving the window
    document.documentElement.addEventListener('mouseleave', () => setIsVisible(false));
    document.documentElement.addEventListener('mouseenter', () => setIsVisible(true));

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', () => setIsVisible(false));
      document.documentElement.removeEventListener('mouseenter', () => setIsVisible(true));
      
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  const mainCursorVariants = {
    default: {
      height: 12,
      width: 12,
      backgroundColor: 'rgba(255, 0, 255, 1)',
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
  };

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50"
        style={{
          x: position.x - (isHovering ? 12 : 6),
          y: position.y - (isHovering ? 12 : 6),
        }}
        variants={mainCursorVariants}
        animate={isClicking ? 'click' : isHovering ? 'hover' : 'default'}
        transition={{
          type: 'spring',
          damping: 30,
          mass: 0.5,
          stiffness: 400,
        }}
      />
      <motion.div
        ref={cursorOuterRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50"
        style={{
          x: position.x - (isHovering ? 24 : 16),
          y: position.y - (isHovering ? 24 : 16),
        }}
        variants={outerCursorVariants}
        animate={isClicking ? 'click' : isHovering ? 'hover' : 'default'}
        transition={{
          type: 'spring',
          damping: 20,
          mass: 0.6,
          stiffness: 300,
        }}
      />
    </>
  );
};

export default CustomCursor;
