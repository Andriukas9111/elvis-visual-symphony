
import React from 'react';
import { Camera, Video, Award, Users, Briefcase, Clock, MessageSquare, BarChart2, Film, Tv, Smartphone, Heart } from 'lucide-react';
import { TabData, StatItem, SkillItem, ProjectType, TechnicalSkillData } from './types';

export const tabsData: TabData[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <Briefcase className="w-4 h-4" />
  },
  {
    id: 'expertise',
    label: 'Expertise',
    icon: <BarChart2 className="w-4 h-4" />
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: <MessageSquare className="w-4 h-4" />
  }
];

export const statsData: StatItem[] = [
  { 
    id: "1", 
    icon_name: "Camera",
    value: 350, 
    suffix: '+', 
    label: 'Photo Projects',
    sort_order: 1
  },
  { 
    id: "2", 
    icon_name: "Video",
    value: 120, 
    suffix: '+',  
    label: 'Video Productions',
    sort_order: 2
  },
  { 
    id: "3", 
    icon_name: "Award",
    value: 28, 
    suffix: '',  
    label: 'Industry Awards',
    sort_order: 3
  },
  { 
    id: "4", 
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
    category: "Video Production",
    proficiency: 90,
    icon_name: "Camera",
    sort_order: 1
  },
  {
    id: "2",
    name: "Cinematography",
    category: "Video Production",
    proficiency: 85,
    icon_name: "Video",
    sort_order: 2
  },
  {
    id: "3",
    name: "Color Grading",
    category: "Post Production",
    proficiency: 80,
    icon_name: "Award",
    sort_order: 3
  },
  {
    id: "4",
    name: "Motion Graphics",
    category: "Animation",
    proficiency: 75,
    icon_name: "Clock",
    sort_order: 4
  }
];

export const projectTypesData: ProjectType[] = [
  {
    id: "1",
    name: "Commercial",
    description: "Professional video production for businesses and brands",
    icon_name: "Briefcase",
    color: "from-blue-500/20 to-blue-600/30",
    sort_order: 1
  },
  {
    id: "2",
    name: "Music Videos",
    description: "Creative music videos for artists and labels",
    icon_name: "Video",
    color: "from-purple-500/20 to-purple-600/30",
    sort_order: 2
  },
  {
    id: "3",
    name: "Weddings",
    description: "Beautiful wedding films to capture your special day",
    icon_name: "Users",
    color: "from-pink-500/20 to-pink-600/30",
    sort_order: 3
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
