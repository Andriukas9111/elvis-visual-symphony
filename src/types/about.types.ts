
import { ReactNode } from 'react';

export interface AboutSectionData {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  is_visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Expertise {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  type: string;
  label: string;
  category: string;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon_name?: string;
  description?: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  quote: string;
  avatar_url?: string;
  rating: number;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SocialProfile {
  id: string;
  platform: string;
  url: string;
  username: string;
  icon_name: string;
  follower_count?: number;
  is_primary: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Statistic {
  id: string;
  title: string;
  value: number;
  icon_name: string;
  suffix?: string;
  prefix?: string;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface TechnicalSkillData {
  id: string;
  category: string;
  skills: string[];
}

// For backward compatibility
export type ExpertiseItem = Expertise;

// Animation variants for framer-motion
export const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: delay * 0.1
    }
  })
};

// Stagger container for children animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// For UI components that need accent color
export type AccentColor = "pink" | "purple" | "blue" | "teal" | "yellow";

// Social platform data for compatibility with existing components
export interface SocialPlatformData {
  id: string;
  name: string;
  url: string;
  icon?: string;
}
