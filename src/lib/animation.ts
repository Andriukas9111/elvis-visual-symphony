
import { Variants } from "framer-motion";

// Default ease curve for smooth animations
export const defaultEase = [0.6, 0.05, -0.01, 0.9];

// Duration multipliers
export const duration = {
  fastest: 0.2,
  fast: 0.4,
  normal: 0.6,
  slow: 0.8,
  slowest: 1.2,
};

// Base transitions
export const defaultTransition = {
  duration: duration.normal,
  ease: defaultEase,
};

// Element entrance animations
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    transition: { ...defaultTransition, duration: duration.fast },
  },
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: { ...defaultTransition, duration: duration.fast },
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { ...defaultTransition, duration: duration.fast },
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { ...defaultTransition, duration: duration.fast },
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: { ...defaultTransition, duration: duration.fast },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: { ...defaultTransition, duration: duration.fast },
  },
};

export const scaleInUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 30,
    transition: { ...defaultTransition, duration: duration.fast },
  },
};

// Page transitions
export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: defaultEase,
    },
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 0.3,
      ease: defaultEase,
    },
  },
};

// Staggered children animations
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Text animations
export const revealText: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.77, 0, 0.175, 1],
    },
  },
};

// For letter animations in headings
export const letterAnimation: Variants = {
  hidden: { 
    opacity: 0,
    y: 50,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// For hover animations
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: 0.3,
    ease: "easeInOut",
  },
};

// For scroll-based animations
export const scrollReveal = (delay: number = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: defaultEase,
      delay,
    },
  },
});

// For button hover states
export const buttonHover = {
  scale: 1.03,
  transition: {
    duration: 0.2,
    ease: "easeInOut",
  },
};

// For scroll-linked animations
export function createScrollAnimation(start: number, end: number, fromValue: any, toValue: any) {
  return (progress: number) => {
    // Normalize progress between start and end points
    const normalizedProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)));
    
    // Handle different value types
    if (typeof fromValue === 'number' && typeof toValue === 'number') {
      return fromValue + normalizedProgress * (toValue - fromValue);
    }
    
    // For objects (like colors), we'd need more complex interpolation logic
    return normalizedProgress < 0.5 ? fromValue : toValue;
  };
}

// Animation utility for scroll-triggered reveal
export function useScrollReveal() {
  return (node: HTMLElement) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    
    if (node) {
      observer.observe(node);
    }
    
    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  };
}
