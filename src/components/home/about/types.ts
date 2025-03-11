import { ReactNode } from 'react';

export interface ExpertiseData {
  id: string;
  title: string;
  description: string;
  icon?: string;
  icon_name?: string;
  category?: string;
  sort_order?: number;
}

export interface TechnicalSkillData {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  icon_name?: string;
  color?: string;
  sort_order?: number;
  description?: string;
  skills?: string[];
}

export interface SocialPlatformData {
  id: string;
  platform: string;
  name?: string;
  url: string;
  icon: string;
  icon_name?: string;
  color?: string;
  sort_order?: number;
  followers?: number;
  is_displayed?: boolean;
}

export interface TestimonialData {
  id: string;
  name: string;
  role: string;
  position?: string;
  company: string;
  content: string;
  quote?: string;
  avatar_url?: string;
  avatar?: string;
  rating?: number;
  date?: string;
  is_featured?: boolean;
}

export interface StatData {
  id: string;
  title: string;
  value: number;
  icon?: string;
  icon_name?: string;
  prefix?: string;
  suffix?: string;
  sort_order?: number;
  label?: string;
}

export interface TabData {
  id: string;
  title: string;
  content: ReactNode;
}

export interface StatItem extends StatData {
  label: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: ReactNode;
  label: string;
  description: string;
}

export interface ProjectType {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  stats: {
    completed: number;
    inProgress: number;
  };
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  icon: ReactNode;
  type: string;
}

// Create a TechnicalSkillCardProps interface
export interface TechnicalSkillCardProps {
  data: TechnicalSkillData;
}

// Alias Testimonial to TestimonialData for backward compatibility
export type Testimonial = TestimonialData;
