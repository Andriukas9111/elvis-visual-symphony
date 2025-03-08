
import React, { useRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import useFramerAnimation, { AnimationVariant } from '@/hooks/use-framer-animations';
import { useAnimation } from '@/contexts/AnimationContext';

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number;
  className?: string;
  children: React.ReactNode;
  containerClassName?: string;
  motionProps?: MotionProps;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  as: Component = motion.div,
  variant = 'fadeIn',
  delay = 0,
  duration = 0.5,
  amount = 0.1,
  once = true,
  staggerChildren = false,
  staggerDelay = 0.1,
  className,
  children,
  containerClassName,
  motionProps,
  ...props
}) => {
  const { prefersReducedMotion } = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <div 
        className={cn('w-full', containerClassName)} 
        {...props}
      >
        <div className={className}>{children}</div>
      </div>
    );
  }

  const { motionProps: animationProps, ref } = useFramerAnimation({
    variant,
    delay,
    duration,
    amount,
    once
  });

  // For staggering child animations
  const staggerContainerProps = staggerChildren ? {
    variants: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay,
        }
      }
    },
    initial: 'hidden',
    animate: 'visible',
  } : {};

  return (
    <div 
      ref={containerRef} 
      className={cn('w-full', containerClassName)}
      {...props}
    >
      <Component
        ref={ref}
        className={className}
        {...(!staggerChildren ? animationProps : {})}
        {...(staggerChildren ? staggerContainerProps : {})}
        {...motionProps}
      >
        {children}
      </Component>
    </div>
  );
};

export const AnimatedItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  motionProps?: MotionProps;
}> = ({ 
  children, 
  className, 
  variant = 'fadeIn',
  delay = 0,
  motionProps 
}) => {
  const { prefersReducedMotion } = useAnimation();

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const { motionProps: animationProps } = useFramerAnimation({
    variant,
    delay
  });

  return (
    <motion.div
      className={className}
      {...animationProps}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
