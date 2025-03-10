
// Types used across about page components
export type Testimonial = {
  id: string;
  name: string;
  position: string;
  company: string;
  quote: string;
  avatar?: string;
  is_featured: boolean;
};

export type TechnicalSkillData = {
  id: string;
  category: string;
  skills: string[];
};

export type ExpertiseData = {
  id: string;
  label: string;
  description: string;
  icon_name: string;
  type: 'expertise' | 'project';
  sort_order: number;
};

export type SocialPlatformData = {
  name: string;
  url: string;
  icon: string;
  color: string;
  hoverGradient?: string;
};

// StatItem type for statistics
export type StatItem = {
  id: string;
  icon_name: string;
  value: number;
  suffix?: string;
  label: string;
  sort_order: number;
};

// Types for accomplishments
export type AccomplishmentData = {
  id: string;
  value: string;
  label: string;
  icon_name: string;
  color: string;
  sort_order: number;
};

// Type for social media profiles
export type SocialMedia = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  color: string;
  sort_order: number;
};

// Type for project types
export type ProjectType = {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  color: string;
  sort_order: number;
};

// Type for skill items
export type SkillItem = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  years_experience?: number;
  icon_name?: string;
  certification?: string;
  sort_order: number;
};
