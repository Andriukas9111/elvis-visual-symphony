
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
  title: string;
  icon: ReactNode;
  skills: {
    name: string;
    level: number;
  }[];
}
