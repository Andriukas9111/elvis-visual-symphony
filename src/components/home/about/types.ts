
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
  icon?: React.ReactNode;  // For backward compatibility
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
  icon?: React.ReactNode; // For backward compatibility
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
  title?: string; // For backward compatibility
  description: string;
  icon_name: string;
  icon?: React.ReactNode; // For backward compatibility
  color: string;
  sort_order: number;
  stats?: {
    completed: number;
    inProgress: number;
  };
};

// Type for skill items
export type SkillItem = {
  id: string;
  name: string;
  label?: string; // For backward compatibility
  category: string;
  proficiency: number;
  years_experience?: number;
  icon_name?: string;
  icon?: React.ReactNode; // For backward compatibility
  description?: string;
  certification?: string;
  sort_order: number;
};

// Type for content tabs in expertise section
export type TabData = {
  id: string;
  label: string;
  title?: string; // For backward compatibility
  icon: React.ReactNode;
};

// Type for project data in expertise section
export type ProjectData = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  icon?: React.ReactNode; // For backward compatibility
  link?: string;
};
