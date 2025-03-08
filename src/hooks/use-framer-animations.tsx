
import { useState, useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import type { MotionProps, Variants } from 'framer-motion';

export type AnimationVariant = 
  | 'fadeIn' 
  | 'fadeInUp' 
  | 'fadeInDown' 
  | 'fadeInLeft' 
  | 'fadeInRight' 
  | 'zoomIn' 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight'
  | 'none';

// Animation variants for Framer Motion
export const animationVariants: Record<AnimationVariant, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 }
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  },
  slideUp: {
    hidden: { y: 100 },
    visible: { y: 0 }
  },
  slideDown: {
    hidden: { y: -100 },
    visible: { y: 0 }
  },
  slideLeft: {
    hidden: { x: 100 },
    visible: { x: 0 }
  },
  slideRight: {
    hidden: { x: -100 },
    visible: { x: 0 }
  },
  none: {
    hidden: {},
    visible: {}
  }
};

export interface UseFramerAnimationOptions {
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  rootMargin?: string;
}

/**
 * Hook to generate Framer Motion props for animations
 */
export function useFramerAnimation({
  variant = 'fadeIn',
  delay = 0,
  duration = 0.5,
  once = true,
  amount = 0.1,
  rootMargin = "0px"
}: UseFramerAnimationOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    amount,
    once,
    // framer-motion v12+ uses margin instead of rootMargin
    margin: rootMargin as any // Type assertion to resolve type issue
  });
  
  const variants = animationVariants[variant];
  
  const motionProps: MotionProps = {
    initial: "hidden",
    animate: inView ? "visible" : "hidden",
    variants,
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  };

  return { motionProps, ref, inView };
}

/**
 * Hook to check if element is in view for animations
 */
export function useElementInView(options?: {
  once?: boolean;
  amount?: number;
  rootMargin?: string;
}) {
  const { once = true, amount = 0.1, rootMargin = "0px" } = options || {};
  
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, {
    amount,
    once,
    // framer-motion v12+ uses margin instead of rootMargin
    margin: rootMargin as any // Type assertion to resolve type issue
  });
  
  return { ref, isInView };
}

export default useFramerAnimation;
