
import { useEffect, useRef, MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useAnimation } from '@/contexts/AnimationContext';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

type GSAPTarget = string | Element | Element[] | NodeList | MutableRefObject<Element | null>;

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

    // Create animation
    animationRef.current = gsap.fromTo(
      targetElement,
      fromVars,
      {
        ...animation,
        scrollTrigger: {
          trigger: trigger || targetElement,
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
          id: `scroll-trigger-${Math.random()}`,
        },
      }
    );

    // Store ScrollTrigger instance
    if (animationRef.current.scrollTrigger) {
      scrollTriggerRef.current = animationRef.current.scrollTrigger;
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
 * Hook for text reveal animations with GSAP SplitText
 */
export const useSplitTextReveal = (
  targetRef: MutableRefObject<Element | null>,
  options: {
    type?: string;
    trigger?: GSAPTarget;
    start?: string;
    linesClass?: string;
    charsClass?: string;
    wordsClass?: string;
  } = {}
) => {
  const { prefersReducedMotion } = useAnimation();
  const splitRef = useRef<SplitText | null>(null);

  const {
    type = 'chars, words, lines',
    trigger,
    start = 'top 80%',
    linesClass = '',
    wordsClass = '',
    charsClass = '',
  } = options;

  useEffect(() => {
    if (prefersReducedMotion || !targetRef.current) return;

    // Create SplitText instance
    splitRef.current = new SplitText(targetRef.current, {
      type,
      linesClass,
      wordsClass,
      charsClass,
    });

    // Animate based on the split type
    if (type.includes('chars') && splitRef.current.chars) {
      gsap.from(splitRef.current.chars, {
        opacity: 0,
        y: 30,
        rotationX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: trigger || targetRef.current,
          start,
          toggleActions: 'play none none reverse',
        },
      });
    } else if (type.includes('words') && splitRef.current.words) {
      gsap.from(splitRef.current.words, {
        opacity: 0,
        y: 30,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: trigger || targetRef.current,
          start,
          toggleActions: 'play none none reverse',
        },
      });
    } else if (type.includes('lines') && splitRef.current.lines) {
      gsap.from(splitRef.current.lines, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: trigger || targetRef.current,
          start,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Cleanup
    return () => {
      if (splitRef.current) {
        splitRef.current.revert();
      }
    };
  }, [targetRef, prefersReducedMotion]);

  return splitRef;
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
        scrub: true,
      },
    });

    return () => {
      parallaxAnimation.kill();
    };
  }, [targetRef, speed, direction, prefersReducedMotion]);
};

export default useGSAP;
