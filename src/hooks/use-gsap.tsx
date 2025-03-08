
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

type Animation = {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number | object;
};

type ScrollAnimation = Animation & {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  pin?: boolean;
  toggleActions?: string;
};

export interface UseGSAPOptions {
  animation: Animation;
  scrollTrigger?: boolean;
  scrollAnimation?: ScrollAnimation;
  dependencies?: any[];
}

/**
 * Custom hook for GSAP animations
 * @param target - The target element(s) to animate
 * @param options - Animation options
 */
const useGSAP = (
  target: React.RefObject<HTMLElement> | string,
  options: UseGSAPOptions
) => {
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    // Get the target element(s)
    let element: HTMLElement | string | null = null;
    
    if (typeof target === 'string') {
      element = target; // CSS selector
    } else if (target.current) {
      element = target.current; // React ref
    }

    // Return early if no element found
    if (!element) return;

    // Default animation
    const {
      animation,
      scrollTrigger = false,
      scrollAnimation,
      dependencies = []
    } = options;

    // Basic animation (no scroll trigger)
    if (!scrollTrigger) {
      animationRef.current = gsap.to(element as any, {
        ...animation,
        onComplete: () => {
          // Cleanup
        }
      });
    }
    // Scroll-triggered animation
    else if (scrollAnimation) {
      const { 
        trigger = element, 
        start = 'top 80%', 
        end = 'bottom 20%', 
        scrub = false,
        markers = false,
        pin = false,
        toggleActions = 'play none none none',
        ...animProps 
      } = scrollAnimation;

      // Create ScrollTrigger
      const triggerParams = {
        trigger: trigger as string | Element,
        start,
        end,
        scrub: scrub ? 1 : false as any,
        markers,
        pin,
        toggleActions,
      };

      // Apply animation with ScrollTrigger
      animationRef.current = gsap.to(element as any, {
        ...animProps,
        scrollTrigger: triggerParams as any
      });

      // Store ScrollTrigger instance for cleanup
      if (animationRef.current && (animationRef.current.scrollTrigger as any)) {
        scrollTriggerRef.current = animationRef.current.scrollTrigger as any;
      }
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [target, ...(options.dependencies || [])]);

  return { animationRef, scrollTriggerRef };
};

export default useGSAP;
