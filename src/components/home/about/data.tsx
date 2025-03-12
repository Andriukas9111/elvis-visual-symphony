
import React from 'react';
import { Camera, Code, Film, MountainSnow, Briefcase, VideoIcon, Award, Heart } from 'lucide-react';
import { TabData, StatItem, SkillItem, ProjectType, TechnicalSkillData } from './types';

// Social media links
export const socialLinks = [
  {
    id: '1',
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: <Camera size={24} />,
    color: 'bg-pink-600'
  },
  {
    id: '2',
    name: 'TikTok',
    url: 'https://tiktok.com',
    icon: <VideoIcon size={24} />,
    color: 'bg-black'
  },
  {
    id: '3',
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: <Film size={24} />,
    color: 'bg-red-600'
  },
  {
    id: '4',
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: <MountainSnow size={24} />,
    color: 'bg-blue-500'
  }
];

// Stats for the stats grid
export const stats: StatItem[] = [
  {
    id: '1',
    value: 300,
    label: 'Projects Completed',
    icon: <Briefcase />,
    prefix: '',
    suffix: '+',
    sort_order: 1
  },
  {
    id: '2',
    value: 5,
    label: 'Video Views',
    icon: <Film />,
    prefix: '',
    suffix: 'M+',
    sort_order: 2
  },
  {
    id: '3',
    value: 8,
    label: 'Years Experience',
    icon: <Award />,
    prefix: '',
    suffix: '+',
    sort_order: 3
  },
  {
    id: '4',
    value: 20,
    label: 'Awards Won',
    icon: <Award />,
    prefix: '',
    suffix: '+',
    sort_order: 4
  },
  {
    id: '5',
    value: 96,
    label: 'Client Satisfaction',
    icon: <Heart />,
    prefix: '',
    suffix: '%',
    sort_order: 5
  }
];

// Technical skills data
export const skills: SkillItem[] = [
  {
    id: '1',
    name: 'Video Editing',
    category: 'Editing',
    level: 90,
    icon: <Film size={24} />,
    label: 'Expert',
    description: 'Professional video editing using industry-standard software'
  },
  {
    id: '2',
    name: 'Cinematography',
    category: 'Camera',
    level: 85,
    icon: <Camera size={24} />,
    label: 'Advanced',
    description: 'Creating compelling visual narratives through camera work'
  },
  {
    id: '3',
    name: 'Color Grading',
    category: 'Post-Production',
    level: 80,
    icon: <MountainSnow size={24} />,
    label: 'Advanced',
    description: 'Professional color correction and grading'
  },
  {
    id: '4',
    name: 'Sound Design',
    category: 'Audio',
    level: 75,
    icon: <Code size={24} />,
    label: 'Proficient',
    description: 'Creating immersive audio experiences'
  }
];

// Project types data
export const projectTypes: ProjectType[] = [
  {
    id: '1',
    title: 'Commercial',
    description: 'High-impact marketing videos for brands',
    icon: <Briefcase size={24} />,
    stats: {
      completed: 45,
      inProgress: 3
    }
  },
  {
    id: '2',
    title: 'Documentary',
    description: 'In-depth storytelling through video',
    icon: <Film size={24} />,
    stats: {
      completed: 12,
      inProgress: 1
    }
  },
  {
    id: '3',
    title: 'Wedding',
    description: 'Beautiful cinematic wedding films',
    icon: <Heart size={24} />,
    stats: {
      completed: 78,
      inProgress: 5
    }
  }
];

// Technical skills data with categorization
export const technicalSkills: TechnicalSkillData[] = [
  {
    id: '1',
    name: 'Video Editing Software',
    category: 'Software',
    proficiency: 95,
    icon_name: 'Film',
    description: 'Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve',
    sort_order: 1,
    skills: ['Adobe Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'Adobe After Effects']
  },
  {
    id: '2',
    name: 'Camera Equipment',
    category: 'Equipment',
    proficiency: 90,
    icon_name: 'Camera',
    description: 'Professional camera operation and setup',
    sort_order: 2,
    skills: ['Sony A7S III', 'Canon C300', 'RED Digital Cinema', 'Blackmagic']
  },
  {
    id: '3',
    name: 'Audio Production',
    category: 'Audio',
    proficiency: 85,
    icon_name: 'Music',
    description: 'Recording, mixing and mastering audio for video',
    sort_order: 3,
    skills: ['Rode Microphones', 'Sound Design', 'Audio Mixing', 'Voice Over Recording']
  }
];
