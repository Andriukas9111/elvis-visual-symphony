
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
  icon_name?: string; // Optional icon name for lookup
  icon?: React.ReactNode; // Allow direct icon element for legacy code
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
  icon_name?: string; // Optional icon name for lookup
  icon?: React.ReactNode; // Allow direct icon element for legacy code
  value: number;
  suffix: string;
  label: string;
  sort_order: number;
};

export type Accomplishment = {
  id: string;
  text: string;
};

// Additional types needed for other components
export type TabData = {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode; // Allow React elements for icons
};

export type SkillItem = {
  id: string;
  name: string;
  level: number;
  icon?: React.ReactNode; // Allow React elements for icons
  description?: string;
  label?: string; // Added for backward compatibility
};

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode; // Allow React elements for icons
  stats?: {
    completed: number;
    inProgress: number;
  };
};

export type ProjectData = {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode; // Allow React elements for icons
  type: 'project';
};
