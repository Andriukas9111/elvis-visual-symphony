
import { useEffect } from 'react';
import { animate, MotionValue } from 'framer-motion';
import { useCursor, CursorState } from '@/contexts/CursorContext';

interface CursorAnimationValues {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  outerScaleX: MotionValue<number>;
  outerScaleY: MotionValue<number>;
  rotate: MotionValue<number>;
}

export const useCursorEvents = (values: CursorAnimationValues, hasMoved: boolean) => {
  const { 
    setPosition, 
    setCursorState, 
    setIsVisible, 
    setHasMoved 
  } = useCursor();
  
  const { 
    mouseX, 
    mouseY, 
    scaleX, 
    scaleY, 
    outerScaleX, 
    outerScaleY, 
    rotate 
  } = values;

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
      // Get the current state first and then decide what to set it to
      const currentState = document.querySelector('a, button, [role="button"], input, select, textarea, [tabindex="0"]')
        ? 'hover'
        : document.querySelector('p, h1, h2, h3, h4, h5, h6, span, label')
          ? 'text'
          : document.querySelector('img, video, canvas, svg, [role="img"]')
            ? 'media'
            : 'default';
      
      setCursorState(currentState);
      
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
    if (!hasMoved) {
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
    hasMoved, setHasMoved, setPosition, setCursorState, setIsVisible
  ]);
};
