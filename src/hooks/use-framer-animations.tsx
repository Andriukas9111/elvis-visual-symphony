
import { useInView, useAnimationControls, MotionProps } from 'framer-motion';
import { useRef, useEffect } from 'react';

export type AnimationVariant = 
  | 'fadeIn' 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight' 
  | 'scale' 
  | 'rotate';

interface UseFramerAnimationProps {
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  amount?: 'some' | 'all';
  customVariants?: Record<string, any>;
}

export const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  slideDown: {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  slideLeft: {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  slideRight: {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  scale: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  },
  rotate: {
    hidden: { rotate: -5, opacity: 0 },
    visible: { rotate: 0, opacity: 1 }
  }
};

export const useFramerAnimation = ({
  variant = 'fadeIn',
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  once = true,
  amount = 'some',
  customVariants
}: UseFramerAnimationProps = {}) => {
  const ref = useRef<HTMLElement>(null);
  const controls = useAnimationControls();
  const isInView = useInView(ref, { 
    amount, 
    once,
    threshold
  });

  // Use either custom variants or predefined ones
  const variants = customVariants || animationVariants[variant];

  // Default transition
  const transition = {
    duration,
    delay,
    ease: [0.25, 0.1, 0.25, 1] // cubic-bezier easing
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  // Motion props to be spread onto a framer-motion component
  const motionProps: MotionProps = {
    ref,
    initial: 'hidden',
    animate: controls,
    variants,
    transition
  };

  return { ref, isInView, controls, motionProps };
};

export const useStaggerChildren = (
  staggerDuration: number = 0.1,
  containerDelay: number = 0
) => {
  return {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        delayChildren: containerDelay,
        staggerChildren: staggerDuration
      }
    }
  };
};

export default useFramerAnimation;
