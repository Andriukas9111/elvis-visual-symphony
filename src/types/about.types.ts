
import { ReactNode } from 'react';

// Base interfaces
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

export interface Statistic {
  id: string;
  icon_name: string;
  value: number;
  label: string;
  suffix?: string;
  category: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Expertise {
  id: string;
  title: string;
  description: string;
  icon_name: string;
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
  username: string;
  url: string;
  icon_name: string;
  color: string;
  sort_order: number;
  follower_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  specs?: string[];
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// Animation variants for framer-motion
export const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: delay * 0.1
    }
  })
};

export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: delay * 0.1
    }
  })
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: delay * 0.1
    }
  })
};
