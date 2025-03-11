
import React from 'react';
import { Camera, Code, PenTool, Layers, Video, Sparkles } from 'lucide-react';
import { ExpertiseData, TechnicalSkillData, TabData, StatItem, SkillItem, ProjectType } from './types';

// Expertise data with icon_name as string instead of ReactNode
export const expertiseData: ExpertiseData[] = [
  {
    id: '1',
    title: 'Photography',
    description: 'Professional photography services with expertise in portrait, product, and landscape photography.',
    icon_name: 'Camera'
  },
  {
    id: '2',
    title: 'Web Development',
    description: 'Custom website development using modern frameworks and technologies.',
    icon_name: 'Code'
  },
  {
    id: '3',
    title: 'Graphic Design',
    description: 'Creative design solutions for branding, marketing materials, and digital assets.',
    icon_name: 'PenTool'
  },
  {
    id: '4',
    title: 'UI/UX Design',
    description: 'User-centered design approach to create intuitive and engaging interfaces.',
    icon_name: 'Layers'
  },
  {
    id: '5',
    title: 'Video Production',
    description: 'High-quality video production services from concept to final edit.',
    icon_name: 'Video'
  }
];

// Tab data
export const tabsData: TabData[] = [
  {
    id: 'tab1',
    title: 'Expertise',
    content: <div>Expertise content goes here</div>
  },
  {
    id: 'tab2',
    title: 'Technical Skills',
    content: <div>Technical skills content goes here</div>
  },
  {
    id: 'tab3',
    title: 'Projects',
    content: <div>Projects content goes here</div>
  }
];

// Stats data
export const statsData: StatItem[] = [
  {
    id: 'stat1',
    title: 'Clients',
    value: 100,
    label: 'Satisfied clients worldwide',
    icon_name: 'Users'
  },
  {
    id: 'stat2',
    title: 'Projects',
    value: 250,
    label: 'Successfully completed projects',
    icon_name: 'Briefcase'
  },
  {
    id: 'stat3',
    title: 'Experience',
    value: 10,
    suffix: '+',
    label: 'Years of professional experience',
    icon_name: 'Calendar'
  },
  {
    id: 'stat4',
    title: 'Awards',
    value: 15,
    label: 'Industry awards and recognitions',
    icon_name: 'Award'
  }
];

// Function to render icon (for demo purposes)
export const renderIcon = (name: string) => {
  switch (name) {
    case 'Camera': return <Camera size={24} />;
    case 'Code': return <Code size={24} />;
    case 'PenTool': return <PenTool size={24} />;
    case 'Layers': return <Layers size={24} />;
    case 'Video': return <Video size={24} />;
    default: return <Sparkles size={24} />;
  }
};

// Technical skills data
export const technicalSkillsData: TechnicalSkillData[] = [
  {
    id: 'ts1',
    name: 'Frontend Development',
    category: 'Development',
    proficiency: 90,
    icon_name: 'Code',
    color: '#61DAFB',
    skills: ['React', 'Vue.js', 'Angular', 'HTML/CSS', 'JavaScript', 'TypeScript']
  },
  {
    id: 'ts2',
    name: 'Backend Development',
    category: 'Development',
    proficiency: 85,
    icon_name: 'Server',
    color: '#68A063',
    skills: ['Node.js', 'Express', 'Django', 'Ruby on Rails', 'PHP']
  },
  {
    id: 'ts3',
    name: 'UI/UX Design',
    category: 'Design',
    proficiency: 88,
    icon_name: 'Palette',
    color: '#FF7262',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Prototyping']
  }
];

// Project types
export const projectTypes: ProjectType[] = [
  {
    id: 'pt1',
    title: 'Web Development',
    description: 'Custom websites and web applications',
    icon: <Code size={24} />,
    stats: {
      completed: 45,
      inProgress: 3
    }
  },
  {
    id: 'pt2',
    title: 'UI/UX Design',
    description: 'User interface and experience design',
    icon: <Layers size={24} />,
    stats: {
      completed: 32,
      inProgress: 2
    }
  },
  {
    id: 'pt3',
    title: 'Video Production',
    description: 'Professional video content creation',
    icon: <Video size={24} />,
    stats: {
      completed: 28,
      inProgress: 1
    }
  }
];

// Skills items
export const skillItems: SkillItem[] = [
  {
    id: 'skill1',
    name: 'React',
    category: 'Frontend',
    level: 95,
    icon: <Code size={20} />,
    label: 'Expert',
    description: 'Advanced React development with hooks, context, and Redux'
  },
  {
    id: 'skill2',
    name: 'Node.js',
    category: 'Backend',
    level: 90,
    icon: <Code size={20} />,
    label: 'Expert',
    description: 'Server-side JavaScript development with Express'
  },
  {
    id: 'skill3',
    name: 'UI Design',
    category: 'Design',
    level: 85,
    icon: <PenTool size={20} />,
    label: 'Advanced',
    description: 'Creating beautiful, intuitive user interfaces'
  }
];
