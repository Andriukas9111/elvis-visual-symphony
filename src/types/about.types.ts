
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

