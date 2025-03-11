
import { ReactNode } from 'react';

// Add any missing type to the types.ts file if it doesn't contain SocialPlatformData
export interface SocialPlatformData {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  sort_order?: number;
}

export interface TechnicalSkillData {
  id: string;
  name?: string;
  category: string;
  proficiency?: number;
  icon_name?: string;
  description?: string;
  sort_order?: number;
  skills?: string[]; // Skills property used in many components
}

// Accomplishment interface used by KeyAccomplishments component
export interface Accomplishment {
  id: string;
  title: string;
  description: string;
  date: string;
  icon_name: string;
  url?: string;
  url_text?: string;
  // Add the missing properties needed by AccomplishmentsManagement component
  sort_order?: number;
  label?: string;
  value?: number;
  suffix?: string;
}

// Testimonial interface used in many components
export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  quote: string;
  avatar?: string;
  is_featured: boolean;
  created_at?: string;
}

// TabData interface with updated icon type
export interface TabData {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
}

// StatItem interface with updated icon type
export interface StatItem {
  id: string;
  value: number;
  label: string;
  icon?: ReactNode;
  icon_name?: string;
  prefix?: string;
  suffix?: string;
  sort_order?: number;
}

// Alias for StatItem for backward compatibility 
export type StatData = StatItem;

// SkillItem interface with updated icon field
export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: ReactNode; 
  icon_name?: string;
  label?: string;
  description?: string;
}

// ProjectType interface with updated icon type
export interface ProjectType {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
  stats?: {
    completed: number;
    inProgress: number;
  };
}

// ExpertiseData and ProjectData interfaces with updated icon types
export interface ExpertiseData {
  id: string;
  title?: string;
  label?: string;
  description: string;
  icon?: ReactNode;
  icon_name?: string;
  type?: string;
  sort_order?: number;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  technologies?: string[];
  icon?: ReactNode;
  type?: string;
}

// Add prop interfaces for components that require isInView
export interface SocialStatisticsProps {
  isInView: boolean;
}

export interface AboutStoryProps {
  isInView: boolean;
}

export interface ExpertiseTabsProps {
  isInView: boolean;
}

export interface ConnectWithMeProps {
  isInView: boolean;
}

export interface ProjectsSliderProps {
  isInView: boolean;
}

export interface TestimonialsSectionProps {
  isInView: boolean;
}
