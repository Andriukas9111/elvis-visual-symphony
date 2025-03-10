
import React from 'react';
import { 
  Camera, 
  Video, 
  Award, 
  Users, 
  Film, 
  Clapperboard, 
  Palette, 
  Music, 
  Lightbulb, 
  PenTool, 
  Tv, 
  Sliders 
} from 'lucide-react';
import { ExpertiseData, ProjectData, TabData, TechnicalSkillData } from './types';

export const expertiseData: ExpertiseData[] = [
  { 
    id: 1,
    icon: <Film className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Cinematography',
    description: 'Creating visually stunning and emotionally engaging scenes through expert camera work and lighting techniques.'
  },
  { 
    id: 2,
    icon: <Clapperboard className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Film Production',
    description: 'Managing all aspects of production from pre to post, ensuring high-quality results that exceed client expectations.'
  },
  { 
    id: 3,
    icon: <Camera className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Photography',
    description: 'Capturing powerful still images that tell stories and evoke emotions through careful composition and timing.'
  },
  { 
    id: 4,
    icon: <Video className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Video Editing',
    description: 'Crafting compelling narratives through precision editing, pacing, and seamless transitions that enhance storytelling.'
  },
  { 
    id: 5,
    icon: <PenTool className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Visual Effects',
    description: 'Adding cutting-edge visual elements and enhancements that elevate productions to professional industry standards.'
  },
  { 
    id: 6,
    icon: <Palette className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Color Grading',
    description: 'Establishing mood and visual consistency through expert color manipulation that brings footage to life.'
  }
];

export const projectsData: ProjectData[] = [
  {
    id: 1,
    title: 'Commercial Productions',
    icon: <Tv className="h-8 w-8" strokeWidth={1.5} />,
    description: 'Creating engaging commercial content that helps brands connect with their audience effectively.',
    stats: {
      completed: 85,
      inProgress: 3
    }
  },
  {
    id: 2,
    title: 'Wedding Videography',
    icon: <Music className="h-8 w-8" strokeWidth={1.5} />,
    description: 'Capturing the most important moments of your special day with cinematic quality and artistic flair.',
    stats: {
      completed: 42,
      inProgress: 5
    }
  },
  {
    id: 3,
    title: 'Documentary Films',
    icon: <Film className="h-8 w-8" strokeWidth={1.5} />,
    description: 'Telling powerful real-life stories that educate, inspire, and create lasting impact on viewers.',
    stats: {
      completed: 12,
      inProgress: 2
    }
  },
  {
    id: 4,
    title: 'Music Videos',
    icon: <Music className="h-8 w-8" strokeWidth={1.5} />,
    description: 'Creating visually stunning videos that elevate musical artists and bring their vision to life.',
    stats: {
      completed: 36,
      inProgress: 1
    }
  },
  {
    id: 5,
    title: 'Corporate Videos',
    icon: <Users className="h-8 w-8" strokeWidth={1.5} />,
    description: 'Developing professional videos that communicate your company\'s message clearly and effectively.',
    stats: {
      completed: 64,
      inProgress: 4
    }
  },
  {
    id: 6,
    title: 'Short Films',
    icon: <Clapperboard className="h-8 w-8" strokeWidth={1.5} />,
    description: 'Crafting compelling narratives in short format that showcase storytelling prowess and technical expertise.',
    stats: {
      completed: 18,
      inProgress: 0
    }
  }
];

export const tabsData: TabData[] = [
  {
    id: "expertise",
    title: "Areas of Expertise",
    icon: <Lightbulb className="h-4 w-4" strokeWidth={1.5} />
  },
  {
    id: "projects",
    title: "Project Experience",
    icon: <Clapperboard className="h-4 w-4" strokeWidth={1.5} />
  },
  {
    id: "technical",
    title: "Technical Skills",
    icon: <Sliders className="h-4 w-4" strokeWidth={1.5} />
  }
];

export const technicalSkillsData: TechnicalSkillData[] = [
  {
    id: 1,
    category: "Software",
    skills: ["Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve", "Adobe After Effects", "Photoshop", "Cinema 4D"]
  },
  {
    id: 2,
    category: "Camera Equipment",
    skills: ["Sony Alpha Series", "RED Digital Cinema", "Canon EOS", "DJI Drones", "Gimbal Systems", "Manual Rigs"]
  },
  {
    id: 3,
    category: "Production",
    skills: ["Lighting Design", "Audio Recording", "Green Screen", "On-Location Shooting", "Studio Production", "Multi-Camera Setup"]
  }
];
