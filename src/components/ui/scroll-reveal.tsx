
import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView, Variant, Variants } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  variants?: Variants;
  threshold?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function ScrollReveal({
  children,
  variants,
  threshold = 0.1,
  delay = 0,
  duration = 0.6,
  once = true,
  className,
}: ScrollRevealProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, isInView, once]);

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants || defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Specific animation variants
export function FadeUp({ children, className, delay = 0, once = true }: Omit<ScrollRevealProps, 'variants'>) {
  return (
    <ScrollReveal 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.6,
            delay,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      once={once}
      className={className}
    >
      {children}
    </ScrollReveal>
  );
}

export function FadeIn({ children, className, delay = 0, once = true }: Omit<ScrollRevealProps, 'variants'>) {
  return (
    <ScrollReveal 
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: {
            duration: 0.6,
            delay,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      once={once}
      className={className}
    >
      {children}
    </ScrollReveal>
  );
}

export function ScaleIn({ children, className, delay = 0, once = true }: Omit<ScrollRevealProps, 'variants'>) {
  return (
    <ScrollReveal 
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: {
            duration: 0.5,
            delay,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      once={once}
      className={className}
    >
      {children}
    </ScrollReveal>
  );
}

export function SlideInLeft({ children, className, delay = 0, once = true }: Omit<ScrollRevealProps, 'variants'>) {
  return (
    <ScrollReveal 
      variants={{
        hidden: { opacity: 0, x: -50 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: {
            duration: 0.6,
            delay,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      once={once}
      className={className}
    >
      {children}
    </ScrollReveal>
  );
}

export function SlideInRight({ children, className, delay = 0, once = true }: Omit<ScrollRevealProps, 'variants'>) {
  return (
    <ScrollReveal 
      variants={{
        hidden: { opacity: 0, x: 50 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: {
            duration: 0.6,
            delay,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      once={once}
      className={className}
    >
      {children}
    </ScrollReveal>
  );
}

// Staggered children animation
export function StaggerContainer({ 
  children, 
  className, 
  staggerDelay = 0.1,
  initialDelay = 0,
  once = true
}: {
  children: React.ReactNode; 
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  once?: boolean;
}) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.1 });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, isInView, once]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          }
        }
      }}
      className={className}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        return React.cloneElement(child as React.ReactElement, {
          variants: {
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }
            }
          }
        });
      })}
    </motion.div>
  );
}
