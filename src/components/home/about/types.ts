
import { ReactNode } from 'react';

export interface TabData {
  id: string;
  title: string;
  icon: ReactNode;
}

export interface ExpertiseData {
  id: string;
  icon: ReactNode;
  label: string;
  description: string;
}

export interface ProjectData {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export interface TechnicalSkillData {
  id: string;
  category: string;
  skills: string[];
}

export interface StatItem {
  id: string;
  icon: ReactNode;
  value: string | number;
  suffix?: string;
  label: string;
}

export interface SkillItem {
  id: string;
  icon: ReactNode;
  label: string;
  description: string;
}

export interface ProjectType {
  id: string;
  title: string;
  icon: ReactNode;
  description: string;
  stats?: {
    completed: number;
    inProgress: number;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  quote: string;
  avatar: string;
  is_featured: boolean;
}
