
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

// Updated Testimonial interface to match the database structure
export interface Testimonial {
  id: string;
  client_name: string;     // Database field
  role?: string;           // Database field
  client_company?: string; // Database field
  content: string;         // Database field
  avatar_url?: string;     // Database field
  client_image?: string;   // Database field
  rating?: number;         // Database field
  is_featured: boolean;    // Database field
  created_at?: string;
  
  // UI display properties (computed/mapped)
  name?: string;           // For UI consistency
  position?: string;       // For UI consistency
  company?: string;        // For UI consistency
  quote?: string;          // For UI consistency
  avatar?: string;         // For UI consistency
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

// Updated ExpertiseItem interface with constrained type
export interface ExpertiseItem {
  id: string;
  label: string;
  description: string;
  icon_name: string;
  type: 'expertise' | 'project';
  background_color?: string;
  sort_order?: number;
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
