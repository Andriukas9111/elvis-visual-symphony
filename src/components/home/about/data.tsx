
import React from 'react';
import { Camera, Video, Award, Users, Briefcase, Clock, MessageSquare, BarChart2 } from 'lucide-react';
import { TabData, StatItem, SkillItem, ProjectType } from './types';

export const tabsData: TabData[] = [
  {
    id: 'profile',
    title: 'Profile',
    icon: <Briefcase className="w-4 h-4" />
  },
  {
    id: 'expertise',
    title: 'Expertise',
    icon: <BarChart2 className="w-4 h-4" />
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: <MessageSquare className="w-4 h-4" />
  }
];

export const statsData: StatItem[] = [
  { 
    id: "1", 
    icon: <Camera className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
    value: 350, 
    suffix: '+', 
    label: 'Photo Projects' 
  },
  { 
    id: "2", 
    icon: <Video className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
    value: 120, 
    suffix: '+',  
    label: 'Video Productions' 
  },
  { 
    id: "3", 
    icon: <Award className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
    value: 28, 
    suffix: '',  
    label: 'Industry Awards' 
  },
  { 
    id: "4", 
    icon: <Users className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
    value: 45, 
    suffix: '+',  
    label: 'Happy Clients' 
  }
];

export const skillsData: SkillItem[] = [
  {
    id: "1",
    icon: <Camera className="h-5 w-5 text-elvis-pink" />,
    label: "Video Editing",
    description: "Professional video editing with attention to detail and creative transitions"
  },
  {
    id: "2",
    icon: <Video className="h-5 w-5 text-elvis-pink" />,
    label: "Cinematography",
    description: "Expert camera work for stunning visuals and captivating storytelling"
  },
  {
    id: "3",
    icon: <Award className="h-5 w-5 text-elvis-pink" />,
    label: "Color Grading",
    description: "Artistic color grading to enhance the mood and visual appeal of footage"
  },
  {
    id: "4",
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
