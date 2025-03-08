
import { useRef, useEffect } from 'react';
import { useAnimation } from '@/contexts/AnimationContext';

interface UseSmoothScrollOptions {
  speed?: number;
  enabled?: boolean;
}

/**
 * Hook for creating smooth scrolling effects
 */
const useSmoothScroll = ({ speed = 0.1, enabled = true }: UseSmoothScrollOptions = {}) => {
  const { prefersReducedMotion } = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef({
    current: 0,
    target: 0,
    ease: speed,
    last: 0,
    active: false
  });
  
  // Don't enable smooth scrolling if user prefers reduced motion
  const shouldEnable = enabled && !prefersReducedMotion;

  useEffect(() => {
    if (!shouldEnable || !containerRef.current) return;
    
    const container = containerRef.current;
    const scrollData = scrollingRef.current;
    
    // Create proxy element that will be transformed
    const scrollProxy = document.createElement('div');
    scrollProxy.style.position = 'fixed';
    scrollProxy.style.top = '0';
    scrollProxy.style.left = '0';
    scrollProxy.style.width = '1px';
    scrollProxy.style.height = '1px';
    scrollProxy.style.visibility = 'hidden';
    scrollProxy.style.pointerEvents = 'none';
    document.body.appendChild(scrollProxy);
    
    // Initial body height setup
    document.body.style.height = `${container.scrollHeight}px`;
    
    // Handle resize
    const handleResize = () => {
      document.body.style.height = `${container.scrollHeight}px`;
    };
    
    // Update scroll position
    const updateScroll = () => {
      if (!scrollData.active) return;
      
      // Calculate smooth scrolling
      scrollData.current += (scrollData.target - scrollData.current) * scrollData.ease;
      
      // Apply transform
      container.style.transform = `translateY(${-scrollData.current}px)`;
      
      // Request next frame
      requestAnimationFrame(updateScroll);
    };
    
    // Scroll handler
    const handleScroll = () => {
      scrollData.target = window.scrollY;
      
      // Start animation if not already running
      if (!scrollData.active) {
        scrollData.active = true;
        requestAnimationFrame(updateScroll);
      }
    };
    
    // When animation stops
    const checkActivity = () => {
      if (Math.abs(scrollData.target - scrollData.current) < 0.1) {
        scrollData.active = false;
        scrollData.current = scrollData.target;
        container.style.transform = `translateY(${-scrollData.current}px)`;
      } else {
        requestAnimationFrame(checkActivity);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Start initial scroll position
    scrollData.target = window.scrollY;
    scrollData.current = scrollData.target;
    requestAnimationFrame(checkActivity);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(scrollProxy);
      document.body.style.height = '';
      container.style.transform = '';
      scrollData.active = false;
    };
  }, [shouldEnable]);
  
  return containerRef;
};

export default useSmoothScroll;
