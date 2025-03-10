
import { ReactNode } from 'react';

export interface StatItem {
  id: number;
  icon: ReactNode;
  value: string;
  label: string;
}

export interface ExpertiseData {
  id: number;
  icon: ReactNode;
  label: string;
  description: string;
}

export interface ProjectData {
  id: number;
  title: string;
  icon: ReactNode;
  description: string;
  stats: {
    completed: number;
    inProgress: number;
  };
}

export interface TabData {
  id: string;
  title: string;
  icon: ReactNode;
}

export interface TechnicalSkillData {
  id: number;
  category: string;
  skills: string[];
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  company: string;
  image: string;
}
