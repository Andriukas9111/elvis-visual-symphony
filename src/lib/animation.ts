
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { AnimationProps, TargetElement, StaggerConfig, ScrollRevealConfig } from '../types/animation';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

// Animation Presets for common use cases
export const animationPresets = {
  fadeIn: {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  },
  slideUp: {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  },
  slideDown: {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  },
  slideLeft: {
    x: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  },
  slideRight: {
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  },
  scale: {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  },
  clip: {
    clipPath: 'inset(0 100% 0 0)',
    duration: 1,
    ease: 'power4.inOut',
  },
  rotate: {
    rotation: -5,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  },
};

// Transition Presets
export const transitions = {
  smooth: { type: 'tween', ease: [0.25, 0.1, 0.25, 1], duration: 0.6 },
  slow: { type: 'tween', ease: [0.43, 0.13, 0.23, 0.96], duration: 1 },
  bounce: { type: 'spring', stiffness: 300, damping: 20, mass: 1 },
  elastic: { type: 'spring', stiffness: 400, damping: 10, mass: 1.5 },
  gentle: { type: 'spring', stiffness: 100, damping: 20, mass: 1 },
};

// Stagger children elements with GSAP
export const staggerElements = (
  elements: TargetElement,
  config: StaggerConfig = {}
) => {
  const {
    staggerAmount = 0.1,
    from = 'start',
    duration = 0.8,
    y = 20,
    opacity = 0,
    ease = 'power2.out',
    delay = 0,
  } = config;

  return gsap.fromTo(
    elements,
    { y, opacity },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger: {
        amount: staggerAmount,
        from,
      },
      ease,
      delay,
    }
  );
};

// Create scroll-triggered animations
export const scrollReveal = (
  elements: TargetElement,
  config: ScrollRevealConfig = {}
) => {
  const {
    trigger = elements,
    start = 'top 80%',
    end = 'bottom 20%',
    y = 50,
    opacity = 0,
    duration = 0.8,
    stagger = 0.1,
    markers = false,
    ease = 'power2.out',
    scrub = false,
    pin = false,
    anticipatePin = false,
  } = config;

  return ScrollTrigger.batch(elements, {
    interval: 0.1,
    batchMax: 3,
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { y, opacity },
        {
          y: 0,
          opacity: 1,
          stagger,
          duration,
          ease,
        }
      ),
    onLeave: (batch) =>
      gsap.to(batch, {
        y: -y,
        opacity: 0,
        stagger,
        duration,
        ease,
      }),
    onEnterBack: (batch) =>
      gsap.fromTo(
        batch,
        { y: -y, opacity },
        {
          y: 0,
          opacity: 1,
          stagger,
          duration,
          ease,
        }
      ),
    onLeaveBack: (batch) =>
      gsap.to(batch, {
        y,
        opacity: 0,
        stagger,
        duration,
        ease,
      }),
    start,
    end,
    markers,
    scrub,
    pin,
    anticipatePin,
  });
};

// Text reveal animation with SplitText
export const revealText = (
  elements: TargetElement,
  config: AnimationProps = {}
) => {
  const {
    type = 'chars, words',
    duration = 1,
    stagger = 0.02,
    ease = 'power2.out',
    y = 100,
    delay = 0,
  } = config;

  const splitTexts = new SplitText(elements, { type });

  return gsap.fromTo(
    type.includes('chars') ? splitTexts.chars : splitTexts.words,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease,
      delay,
      onComplete: () => splitTexts.revert(),
    }
  );
};

// React hook for scroll animations
export const useScrollAnimation = (
  ref: React.RefObject<HTMLElement>,
  config: ScrollRevealConfig = {}
) => {
  useEffect(() => {
    if (!ref.current) return;

    const { y = 30, opacity = 0, duration = 0.8, markers = false } = config;

    const animation = gsap.fromTo(
      ref.current,
      { y, opacity },
      {
        y: 0,
        opacity: 1,
        duration,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          markers,
          ...config,
        },
      }
    );

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [ref, config]);
};

// Parallax effect
export const createParallax = (
  element: string | Element,
  speed: number = 0.5
) => {
  gsap.to(element, {
    y: `-${speed * 100}%`,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

// Horizontal scroll animation
export const horizontalScroll = (
  container: string | Element,
  elements: string | Element | (string | Element)[]
) => {
  const sections = gsap.utils.toArray(elements);
  const totalWidth = (sections as Element[]).reduce(
    (width, el) => width + (el as HTMLElement).offsetWidth,
    0
  );

  gsap.to(sections, {
    x: () => `-${totalWidth - window.innerWidth}`,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      end: () => `+=${totalWidth}`,
    },
  });
};

// Magnetic effect for elements (follow cursor)
export const createMagneticEffect = (element: HTMLElement, intensity: number = 0.3) => {
  const bounds = element.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;

  const handleMouseMove = (e: MouseEvent) => {
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    gsap.to(element, {
      x: distanceX * intensity,
      y: distanceY * intensity,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// Page transition animations
export const pageTransitions = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
};

// Advanced hover effects
export const hoverEffects = {
  grow: {
    scale: 1.05,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  lift: {
    y: -5,
    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  glow: {
    boxShadow: '0 0 15px rgba(255, 0, 255, 0.7)',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};
