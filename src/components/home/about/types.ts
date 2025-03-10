
import { ReactNode } from 'react';

export interface StatItem {
  id: number;
  icon: ReactNode;
  value: string;
  label: string;
}

export interface SkillItem {
  id: number;
  icon: ReactNode;
  label: string;
  description: string;
}

export interface ProjectType {
  id: number;
  title: string;
  icon: ReactNode;
  description: string;
  stats: {
    completed: number;
    inProgress: number;
  };
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  company: string;
  image: string;
}
