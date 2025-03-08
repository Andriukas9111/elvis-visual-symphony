
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useElementInView } from './use-framer-animations';

/**
 * Hook to create a parallax scrolling effect on an element
 * @param speed The speed of the parallax effect (lower = slower)
 */
function useParallax(targetRef: React.RefObject<HTMLElement>, speed: number = 0.3) {
  const { ref, isInView } = useElementInView({ once: false, rootMargin: "-10%" });
  
  useEffect(() => {
    if (!targetRef.current) return;
    
    const element = targetRef.current;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const yPos = scrollY * speed;
      gsap.to(element, {
        y: yPos,
        duration: 0.5,
        ease: "power1.out"
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [targetRef, speed]);
  
  return { ref, isInView };
}

export default useParallax;
