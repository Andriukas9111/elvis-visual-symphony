
import { useEffect, useRef, MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnimation } from '@/contexts/AnimationContext';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

type GSAPTarget = Element | Element[] | string | MutableRefObject<Element | null>;

// Refined type for ScrollTrigger configuration to match GSAP's expected types
interface ScrollTriggerVars {
  trigger?: Element | string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  pin?: boolean;
  anticipatePin?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  id?: string;
}

interface UseGSAPOptions {
  animation?: gsap.TweenVars;
  trigger?: GSAPTarget;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  pin?: boolean;
  anticipatePin?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  skipOutsideViewport?: boolean;
  disabledWhen?: boolean;
}

/**
 * Hook to create GSAP animations with ScrollTrigger
 */
export const useGSAP = (
  target: GSAPTarget,
  options: UseGSAPOptions = {}
) => {
  const { prefersReducedMotion } = useAnimation();
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Default animation if none provided
  const defaultAnimation: gsap.TweenVars = {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
  };

  const {
    animation = defaultAnimation,
    trigger,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    markers = false,
    pin = false,
    anticipatePin = false,
    toggleActions = 'play none none reverse',
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
    skipOutsideViewport = true,
    disabledWhen = prefersReducedMotion,
  } = options;

  useEffect(() => {
    // Return early if animations are disabled
    if (disabledWhen) return;

    let targetElement: any;

    // Handle ref or direct element
    if (target && 'current' in target) {
      targetElement = target.current;
    } else {
      targetElement = target;
    }

    if (!targetElement) return;

    // Set from values
    const fromVars: gsap.TweenVars = {
      y: 50,
      opacity: 0,
    };

    // Prepare ScrollTrigger configuration
    const scrollTriggerConfig: ScrollTriggerVars = {
      trigger: trigger ? (trigger instanceof Element || typeof trigger === 'string' ? trigger : 'current' in trigger ? trigger.current : null) : targetElement,
      start,
      end,
      scrub,
      markers,
      pin,
      anticipatePin,
      toggleActions,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack,
      id: `scroll-trigger-${Math.random()}`
    };

    // Create animation
    animationRef.current = gsap.fromTo(
      targetElement,
      fromVars,
      {
        ...animation,
        scrollTrigger: scrollTriggerConfig
      }
    );

    // Store ScrollTrigger instance
    if (animationRef.current.scrollTrigger) {
      scrollTriggerRef.current = animationRef.current.scrollTrigger as unknown as ScrollTrigger;
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [target, disabledWhen]);

  return { animation: animationRef, scrollTrigger: scrollTriggerRef };
};

/**
 * Hook for text reveal animations
 * This is a simplified version that doesn't require the SplitText plugin
 */
export const useTextReveal = (
  targetRef: MutableRefObject<Element | null>,
  options: {
    trigger?: Element | string;
    start?: string;
    staggerAmount?: number;
    duration?: number;
    ease?: string;
  } = {}
) => {
  const { prefersReducedMotion } = useAnimation();
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  const {
    trigger,
    start = 'top 80%',
    staggerAmount = 0.05,
    duration = 0.8,
    ease = 'power2.out',
  } = options;

  useEffect(() => {
    if (prefersReducedMotion || !targetRef.current) return;

    // Select all child elements for staggered animation
    const childElements = targetRef.current.querySelectorAll(':scope > *');
    
    if (childElements.length === 0) return;

    // Create timeline for staggered animation
    animationRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || targetRef.current,
        start,
        toggleActions: 'play none none reverse'
      }
    });

    animationRef.current.from(childElements, {
      opacity: 0,
      y: 30,
      duration,
      stagger: staggerAmount,
      ease
    });

    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [targetRef, prefersReducedMotion]);

  return animationRef;
};

/**
 * Hook for creating parallax effects
 */
export const useParallax = (
  targetRef: MutableRefObject<Element | null>,
  speed: number = 0.5,
  direction: 'vertical' | 'horizontal' = 'vertical'
) => {
  const { prefersReducedMotion } = useAnimation();

  useEffect(() => {
    if (prefersReducedMotion || !targetRef.current) return;

    const propName = direction === 'vertical' ? 'y' : 'x';
    const value = `${direction === 'vertical' ? '-' : ''}${speed * 100}%`;

    const parallaxAnimation = gsap.to(targetRef.current, {
      [propName]: value,
      ease: 'none',
      scrollTrigger: {
        trigger: targetRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      parallaxAnimation.kill();
    };
  }, [targetRef, speed, direction, prefersReducedMotion]);
};

export default useGSAP;
