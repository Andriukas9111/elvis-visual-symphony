
export interface ExpertiseData {
  id: string;
  title: string;
  description: string;
  icon?: string;
  category?: string;
  sort_order?: number;
}

export interface TechnicalSkillData {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  color?: string;
  sort_order?: number;
}

export interface SocialPlatformData {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sort_order?: number;
  followers?: number;
  is_displayed?: boolean;
}

export interface TestimonialData {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar_url?: string;
  rating?: number;
  date?: string;
  is_featured?: boolean;
}

export interface StatData {
  id: string;
  title: string;
  value: string | number;
  icon?: string;
  prefix?: string;
  suffix?: string;
  sort_order?: number;
}
