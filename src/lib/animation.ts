
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Types
export type EasingFunction = 
  | 'none' 
  | 'power1.in' | 'power1.out' | 'power1.inOut'
  | 'power2.in' | 'power2.out' | 'power2.inOut'
  | 'power3.in' | 'power3.out' | 'power3.inOut'
  | 'power4.in' | 'power4.out' | 'power4.inOut'
  | 'back.in' | 'back.out' | 'back.inOut'
  | 'elastic.in' | 'elastic.out' | 'elastic.inOut'
  | 'bounce.in' | 'bounce.out' | 'bounce.inOut'
  | 'rough' | 'slow' | 'expoScale' | 'circ.in' | 'circ.out' | 'circ.inOut';

// Type safe animation configuration
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: EasingFunction;
  onComplete?: () => void;
  onStart?: () => void;
  overwrite?: boolean;
  stagger?: number | {
    amount?: number;
    from?: string | number;
  };
}

export interface TargetElement {
  element: HTMLElement | string | NodeList;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  config?: AnimationConfig;
}

export interface ScrollAnimationConfig extends AnimationConfig {
  trigger?: HTMLElement | string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  pin?: boolean;
  toggleActions?: string;
  animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'scale' | 'opacity';
  once?: boolean;
}

/**
 * Creates a fade animation with optional direction
 */
export function createFadeAnimation(
  target: HTMLElement | string,
  direction: 'in' | 'out',
  config: AnimationConfig = {}
) {
  const { duration = 0.5, delay = 0, ease = 'power2.out', ...rest } = config;
  
  if (direction === 'in') {
    return gsap.to(target, { 
      opacity: 1, 
      duration, 
      delay, 
      ease,
      ...rest 
    });
  } else {
    return gsap.to(target, { 
      opacity: 0, 
      duration, 
      delay, 
      ease,
      ...rest 
    });
  }
}

/**
 * Creates a scroll-triggered animation
 */
export function createScrollAnimation(
  target: TargetElement,
  scrollConfig: ScrollAnimationConfig = {}
) {
  const { 
    duration = 1, 
    delay = 0, 
    ease = 'power2.out',
    trigger,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    markers = false,
    pin = false,
    toggleActions = 'play none none none',
    animateFrom = 'bottom',
    once = true,
    ...rest
  } = scrollConfig;

  // Default from values based on animateFrom property
  let defaultFrom: gsap.TweenVars = { opacity: 0 };
  
  switch (animateFrom) {
    case 'top':
      defaultFrom.y = -50;
      break;
    case 'bottom':
      defaultFrom.y = 50;
      break;
    case 'left':
      defaultFrom.x = -50;
      break;
    case 'right':
      defaultFrom.x = 50;
      break;
    case 'scale':
      defaultFrom.scale = 0.8;
      break;
    case 'opacity':
      // Already set opacity to 0
      break;
  }

  // Default to values
  const defaultTo: gsap.TweenVars = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration,
    delay,
    ease,
    ...rest
  };

  // Use provided from/to values or defaults
  const fromVars = target.from || defaultFrom;
  const toVars = { 
    ...defaultTo, 
    ...target.to,
    scrollTrigger: {
      trigger: trigger || target.element,
      start,
      end,
      scrub: scrub as boolean | number,
      markers,
      pin,
      toggleActions,
      once
    }
  };

  return gsap.fromTo(target.element, fromVars, toVars);
}

/**
 * Creates a sequence of animations
 */
export function createSequence(
  targets: TargetElement[],
  config: AnimationConfig = {}
) {
  const { duration = 0.5, delay = 0, ease = 'power2.out', stagger = 0.1 } = config;
  const timeline = gsap.timeline({ delay });

  targets.forEach(target => {
    const fromVars = target.from || { opacity: 0, y: 20 };
    const toVars = { 
      ...{ opacity: 1, y: 0, duration, ease }, 
      ...target.to
    };

    if (stagger) {
      timeline.fromTo(
        target.element, 
        fromVars, 
        { ...toVars, stagger: typeof stagger === 'number' ? stagger : stagger.amount || 0.1 }
      );
    } else {
      timeline.fromTo(target.element, fromVars, toVars);
    }
  });

  return timeline;
}

/**
 * Creates a parallax scroll effect
 */
export function createParallaxEffect(
  target: HTMLElement | string,
  config: {
    speed?: number;
    direction?: 'vertical' | 'horizontal';
    trigger?: HTMLElement | string;
  } = {}
) {
  const { 
    speed = 0.5, 
    direction = 'vertical',
    trigger
  } = config;

  const propName = direction === 'vertical' ? 'y' : 'x';
  const value = direction === 'vertical' 
    ? `-${speed * 100}%` 
    : `${speed * 100}%`;

  return gsap.to(target, {
    [propName]: value,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || target,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}

export default {
  createFadeAnimation,
  createScrollAnimation,
  createSequence,
  createParallaxEffect
};
