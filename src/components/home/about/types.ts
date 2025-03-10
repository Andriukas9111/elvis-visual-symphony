
import { ReactNode } from 'react';

export interface StatItem {
  id: number;
  icon: ReactNode;
  value: string;
  label: string;
}

export interface SkillItem {
  icon: ReactNode;
  label: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  company: string;
  image: string;
}
