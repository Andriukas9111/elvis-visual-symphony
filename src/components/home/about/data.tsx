
import React from 'react';
import { Camera, Video, Award, Users, Briefcase, Clock, MessageSquare, BarChart2, Film, Tv, Smartphone, Heart } from 'lucide-react';
import { TabData, StatItem, SkillItem, ProjectType, TechnicalSkillData } from './types';

export const tabsData: TabData[] = [
  {
    id: 'profile',
    title: 'Profile',
    icon: <Briefcase className="w-4 h-4" />,
    content: <div>Profile content goes here</div>
  },
  {
    id: 'expertise',
    title: 'Expertise',
    icon: <BarChart2 className="w-4 h-4" />,
    content: <div>Expertise content goes here</div>
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: <MessageSquare className="w-4 h-4" />,
    content: <div>Skills content goes here</div>
  }
];

export const statsData: StatItem[] = [
  { 
    id: "1", 
    icon: <Camera className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
    icon_name: "Camera",
    value: 350, 
    suffix: '+', 
    label: 'Photo Projects',
    sort_order: 1
  },
  { 
    id: "2", 
    icon: <Video className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
    icon_name: "Video",
    value: 120, 
    suffix: '+',  
    label: 'Video Productions',
    sort_order: 2
  },
  { 
    id: "3", 
    icon: <Award className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
    icon_name: "Award",
    value: 28, 
    suffix: '',  
    label: 'Industry Awards',
    sort_order: 3
  },
  { 
    id: "4", 
    icon: <Users className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
    icon_name: "Users",
    value: 45, 
    suffix: '+',  
    label: 'Happy Clients',
    sort_order: 4
  }
];

export const skills: SkillItem[] = [
  {
    id: "1",
    name: "Video Editing",
    category: "Production", // Added missing category
    level: 90,
    icon: <Camera className="h-5 w-5 text-elvis-pink" />,
    label: "Video Editing",
    description: "Professional video editing with attention to detail and creative transitions"
  },
  {
    id: "2",
    name: "Cinematography",
    category: "Production", // Added missing category
    level: 85,
    icon: <Video className="h-5 w-5 text-elvis-pink" />,
    label: "Cinematography",
    description: "Expert camera work for stunning visuals and captivating storytelling"
  },
  {
    id: "3",
    name: "Color Grading",
    category: "Post-Production", // Added missing category
    level: 80,
    icon: <Award className="h-5 w-5 text-elvis-pink" />,
    label: "Color Grading",
    description: "Artistic color grading to enhance the mood and visual appeal of footage"
  },
  {
    id: "4",
    name: "Motion Graphics",
    category: "Post-Production", // Added missing category
    level: 75,
    icon: <Clock className="h-5 w-5 text-elvis-pink" />,
    label: "Motion Graphics",
    description: "Dynamic motion graphics and animations to elevate your visual content"
  }
];

export const projectTypesData: ProjectType[] = [
  {
    id: "1",
    title: "Commercial",
    icon: <Briefcase className="h-5 w-5 text-elvis-pink" />,
    description: "Professional video production for businesses and brands",
    stats: {
      completed: 48,
      inProgress: 3
    }
  },
  {
    id: "2",
    title: "Music Videos",
    icon: <Video className="h-5 w-5 text-elvis-pink" />,
    description: "Creative music videos for artists and labels",
    stats: {
      completed: 36,
      inProgress: 2
    }
  },
  {
    id: "3",
    title: "Weddings",
    icon: <Users className="h-5 w-5 text-elvis-pink" />,
    description: "Beautiful wedding films to capture your special day",
    stats: {
      completed: 112,
      inProgress: 5
    }
  }
];

export const projectsData = projectTypesData;

export const technicalSkills: TechnicalSkillData[] = [
  {
    id: "1",
    category: "Video Production",
    skills: ["Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve", "After Effects"]
  },
  {
    id: "2",
    category: "Photography",
    skills: ["Lightroom", "Photoshop", "Capture One", "Portrait Photography"]
  },
  {
    id: "3",
    category: "Audio",
    skills: ["Logic Pro", "Audition", "Sound Design", "Voice Editing"]
  }
];
