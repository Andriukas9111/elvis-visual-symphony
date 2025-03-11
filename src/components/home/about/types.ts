
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
  name: string;
  category: string;
  proficiency: number;
  icon_name?: string;
  description?: string;
  sort_order?: number;
}
