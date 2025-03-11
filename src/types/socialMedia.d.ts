
export interface SocialPlatformData {
  id: string;
  platform: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  sort_order: number;
}

export interface TestimonialData {
  id: string;
  name: string;
  role: string;
  position: string;
  company: string;
  content: string;
  quote: string;
  avatar: string;
  is_featured: boolean;
}

export interface TechnicalSkillData {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  skills: string[];
}
