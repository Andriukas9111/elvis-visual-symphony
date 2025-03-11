
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
  skills?: string[]; // Add the skills property that is being used in many components
}

// Add the Testimonial interface that is being used in many components
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

// Add the missing TabData interface
export interface TabData {
  id: string;
  title: string;
  content: string;
  icon?: string;
}

// Add the missing StatItem interface
export interface StatItem {
  id: string;
  value: number;
  label: string;
  icon?: string;
  prefix?: string;
  suffix?: string;
}

// Add the missing SkillItem interface
export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: number;
}

// Add the missing ProjectType interface
export interface ProjectType {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

// Add ExpertiseData and ProjectData interfaces
export interface ExpertiseData {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  technologies?: string[];
}
