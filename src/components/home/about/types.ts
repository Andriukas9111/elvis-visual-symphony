
import { ReactNode } from 'react';

export interface TabData {
  id: string;
  title: string;
  icon: ReactNode;
}

export interface ExpertiseData {
  id: number;
  icon: ReactNode;
  label: string;
  description: string;
}

export interface ProjectData {
  id: number;
  icon: ReactNode;
  title: string;
  description: string;
}

export interface TechnicalSkillData {
  id: number;
  category: string;
  skills: string[];
}

export interface StatItem {
  id: number;
  icon: ReactNode;
  value: string | number;
  suffix?: string;
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
  stats?: {
    completed: number;
    inProgress: number;
  };
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  quote: string;
  avatar: string;
}
