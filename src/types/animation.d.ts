
export type TargetElement = string | Element | NodeList | (string | Element | NodeList)[];

export interface AnimationProps {
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  rotation?: number;
  type?: string;
  clipPath?: string;
  [key: string]: any;
}

export interface StaggerConfig extends AnimationProps {
  staggerAmount?: number;
  from?: string | number;
}

export interface ScrollRevealConfig extends AnimationProps {
  trigger?: TargetElement;
  start?: string;
  end?: string;
  markers?: boolean;
  scrub?: boolean | number;
  pin?: boolean;
  anticipatePin?: boolean;
  toggleActions?: string;
  id?: string;
}

export interface MotionVariants {
  initial?: any;
  animate?: any;
  exit?: any;
  hover?: any;
  tap?: any;
  drag?: any;
  [key: string]: any;
}

export interface TransitionConfig {
  type?: string;
  duration?: number;
  delay?: number;
  staggerChildren?: number;
  delayChildren?: number;
  ease?: string | number[];
  stiffness?: number;
  damping?: number;
  mass?: number;
}
