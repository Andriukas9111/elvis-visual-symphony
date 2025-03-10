import React from 'react';
import { Camera, Video, Award, Users, Film, Clapperboard, Star, Sparkles, Palette, Music } from 'lucide-react';
import { StatItem, SkillItem } from './types';

export const statsData: StatItem[] = [
  { 
    id: 1, 
    icon: <Camera className="h-8 w-8 text-elvis-pink" strokeWidth={1.5} />, 
    value: '350+', 
    label: 'Photo Projects' 
  },
  { 
    id: 2, 
    icon: <Video className="h-8 w-8 text-elvis-pink" strokeWidth={1.5} />, 
    value: '120+', 
    label: 'Video Productions' 
  },
  { 
    id: 3, 
    icon: <Award className="h-8 w-8 text-elvis-pink" strokeWidth={1.5} />, 
    value: '28', 
    label: 'Industry Awards' 
  },
  { 
    id: 4, 
    icon: <Users className="h-8 w-8 text-elvis-pink" strokeWidth={1.5} />, 
    value: '45+', 
    label: 'Happy Clients' 
  }
];

export const skills: SkillItem[] = [
  { 
    icon: <Film className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Cinematography' 
  },
  { 
    icon: <Clapperboard className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Film Production' 
  },
  { 
    icon: <Camera className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Photography' 
  },
  { 
    icon: <Video className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Video Editing' 
  },
  { 
    icon: <Sparkles className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Visual Effects' 
  },
  { 
    icon: <Palette className="h-8 w-8" strokeWidth={1.5} />, 
    label: 'Color Grading' 
  },
];
