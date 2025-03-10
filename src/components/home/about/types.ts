
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
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  sort_order?: number;
};

export type StatItem = {
  id: string;
  icon_name: string;
  value: number;
  suffix: string;
  label: string;
  sort_order: number;
};

export type Accomplishment = {
  id: string;
  text: string;
};
