
// Shared types for expertise section components
export interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
}

export interface ProjectType {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
}

export interface TechnicalSkill {
  id: string;
  name: string;
  proficiency: number;
  category_id: string;
  order_index: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  order_index: number;
  icon?: string;
  skills?: TechnicalSkill[];
}

// Animation variants for reuse
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};
