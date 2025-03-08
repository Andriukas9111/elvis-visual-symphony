
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useRef, RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function useParallax(ref: RefObject<HTMLElement>, speed: number) {
  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, [ref, speed]);
}

export function useFadeIn(ref: RefObject<HTMLElement>, delay: number = 0) {
  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [ref, delay]);
}

export function useStaggeredFadeIn(
  refs: RefObject<HTMLElement>[],
  stagger: number = 0.1,
  delay: number = 0
) {
  useEffect(() => {
    refs.forEach((ref, index) => {
      if (!ref.current) return;

      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: delay + index * stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, [refs, stagger, delay]);
}

export function useScrollTrigger(
  ref: RefObject<HTMLElement>,
  options?: {
    start?: string | number;
    end?: string | number;
    markers?: boolean;
    onEnter?: () => void;
    onLeave?: () => void;
    scrub?: boolean | number;
    toggleActions?: string;
  }
) {
  useEffect(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: options?.start || 'top 80%',
      end: options?.end || 'bottom 20%',
      markers: options?.markers || false,
      onEnter: options?.onEnter,
      onLeave: options?.onLeave,
      scrub: typeof options?.scrub === 'boolean' ? options.scrub : options?.scrub || false,
      toggleActions: options?.toggleActions || 'play none none none',
    });

    return () => {
      trigger.kill();
    };
  }, [ref, options]);
}

export function useAnimateOnScroll(
  ref: RefObject<HTMLElement>,
  animation: gsap.TweenVars, // Changed from gsap.Effects to gsap.TweenVars
  options?: {
    start?: string | number;
    end?: string | number;
    markers?: boolean;
    scrub?: boolean;
  }
) {
  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      ...animation,
      scrollTrigger: {
        trigger: ref.current,
        start: options?.start || 'top 80%',
        end: options?.end || 'bottom 20%',
        markers: options?.markers || false,
        scrub: options?.scrub || false,
      },
    });
  }, [ref, animation, options]);
}
