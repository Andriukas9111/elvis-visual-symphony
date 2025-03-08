
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Hook for GSAP animations
export function useGsapAnimation<T extends HTMLElement = HTMLDivElement>(options?: {
  animation?: (element: T, tl: gsap.core.Timeline) => void;
  delay?: number;
  duration?: number;
  ease?: string;
  autoPlay?: boolean;
}) {
  const element = useRef<T>(null);
  const timeline = useRef<gsap.core.Timeline>();
  
  useEffect(() => {
    if (!element.current) return;
    
    // Create a new timeline
    timeline.current = gsap.timeline({
      paused: options?.autoPlay === false,
      delay: options?.delay || 0,
      defaults: {
        duration: options?.duration || 0.6,
        ease: options?.ease || "power3.out",
      },
    });
    
    // Apply the animation if provided
    if (options?.animation) {
      options.animation(element.current, timeline.current);
    } else {
      // Default animation
      timeline.current.fromTo(
        element.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0 }
      );
    }
    
    // Clean up
    return () => {
      if (timeline.current) {
        timeline.current.kill();
      }
    };
  }, [options]);
  
  // Play animation manually
  const play = () => {
    if (timeline.current) {
      timeline.current.play();
    }
  };
  
  // Reverse animation
  const reverse = () => {
    if (timeline.current) {
      timeline.current.reverse();
    }
  };
  
  return { element, timeline: timeline.current, play, reverse };
}

// Hook for scroll trigger animations
export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(options?: {
  animation?: (element: T, scrollTrigger: ScrollTrigger) => void;
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  pin?: boolean;
  anticipatePin?: boolean;
  onEnter?: (self: ScrollTrigger) => void;
  onLeave?: (self: ScrollTrigger) => void;
  onEnterBack?: (self: ScrollTrigger) => void;
  onLeaveBack?: (self: ScrollTrigger) => void;
}) {
  const element = useRef<T>(null);
  const scrollTrigger = useRef<ScrollTrigger>();
  
  useEffect(() => {
    if (!element.current) return;
    
    const trigger = options?.trigger 
      ? (typeof options.trigger === 'string' 
        ? document.querySelector(options.trigger) 
        : options.trigger) 
      : element.current;
    
    // Create the scroll trigger
    scrollTrigger.current = ScrollTrigger.create({
      trigger: trigger as Element,
      start: options?.start || "top bottom",
      end: options?.end || "bottom top",
      scrub: options?.scrub ?? false,
      markers: options?.markers ?? false,
      toggleActions: options?.toggleActions || "play none none reverse",
      pin: options?.pin ?? false,
      anticipatePin: options?.anticipatePin ?? false,
      onEnter: options?.onEnter,
      onLeave: options?.onLeave,
      onEnterBack: options?.onEnterBack,
      onLeaveBack: options?.onLeaveBack,
    });
    
    // Apply the animation if provided
    if (options?.animation && element.current) {
      options.animation(element.current, scrollTrigger.current);
    } else {
      // Default animation
      gsap.fromTo(
        element.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.6,
          scrollTrigger: scrollTrigger.current
        }
      );
    }
    
    // Clean up
    return () => {
      if (scrollTrigger.current) {
        scrollTrigger.current.kill();
      }
    };
  }, [options]);
  
  return { element, scrollTrigger: scrollTrigger.current };
}

// Utility hook for smooth scrolling with GSAP
export function useSmoothScroll() {
  const scrollTo = (target: string | Element | number, options?: {
    duration?: number;
    delay?: number;
    ease?: string;
    offset?: number;
  }) => {
    gsap.to(window, {
      duration: options?.duration || 1,
      delay: options?.delay || 0,
      ease: options?.ease || "power3.inOut",
      scrollTo: {
        y: target,
        offsetY: options?.offset || 0,
      },
    });
  };
  
  return { scrollTo };
}

// Hook for parallax effects
export function useParallax<T extends HTMLElement = HTMLDivElement>(options?: {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  scrub?: boolean | number;
  start?: string;
  end?: string;
}) {
  const element = useRef<T>(null);
  
  useEffect(() => {
    if (!element.current) return;
    
    const speed = options?.speed || 0.5;
    const direction = options?.direction || 'vertical';
    const movement = direction === 'vertical' ? { y: `${speed * 100}%` } : { x: `${speed * 100}%` };
    
    const trigger = ScrollTrigger.create({
      trigger: element.current,
      start: options?.start || "top bottom",
      end: options?.end || "bottom top",
      scrub: options?.scrub ?? true,
    });
    
    gsap.fromTo(
      element.current,
      { ...movement },
      { 
        ...(direction === 'vertical' ? { y: `${-speed * 100}%` } : { x: `${-speed * 100}%` }),
        ease: "none",
        scrollTrigger: trigger
      }
    );
    
    return () => {
      trigger.kill();
    };
  }, [options]);
  
  return { element };
}

// Hook for text reveal animations
export function useTextReveal<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const textElements = containerRef.current.querySelectorAll('.reveal-text');
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          gsap.to(textElements, {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.8,
            ease: "power3.out",
            onComplete: () => {
              setIsRevealed(true);
            }
          });
          observer.unobserve(containerRef.current!);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    
    // Reset text elements
    gsap.set(textElements, {
      y: 50,
      opacity: 0
    });
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  return { containerRef, isRevealed };
}
