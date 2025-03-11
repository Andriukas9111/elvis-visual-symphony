
import React from 'react';
import { Camera, Video, Award, Users, Briefcase, Clock, MessageSquare, BarChart2, Film, Tv, Smartphone, Heart } from 'lucide-react';
import { ExpertiseData, ProjectData } from './types';

export const expertiseData: ExpertiseData[] = [
  {
    id: "1",
    icon: <Camera className="h-10 w-10 text-elvis-pink" strokeWidth={1.5} />,
    icon_name: "Camera",
    label: 'Videography',
    description: 'Professional video production for commercial, music videos, and events.',
    type: 'expertise',
    sort_order: 1
  },
  {
    id: "2",
    icon: <Film className="h-10 w-10 text-elvis-pink" strokeWidth={1.5} />,
    icon_name: "Film",
    label: 'Cinematography',
    description: 'Artistic camera work to create visually stunning and emotionally engaging content.',
    type: 'expertise',
    sort_order: 2
  },
  {
    id: "3",
    icon: <Video className="h-10 w-10 text-elvis-pink" strokeWidth={1.5} />,
    icon_name: "Video",
    label: 'Video Editing',
    description: 'Post-production excellence with attention to pacing, transitions, and storytelling.',
    type: 'expertise',
    sort_order: 3
  },
  {
    id: "4",
    icon: <Tv className="h-10 w-10 text-elvis-pink" strokeWidth={1.5} />,
    icon_name: "Tv",
    label: 'Color Grading',
    description: 'Enhancing the visual appeal through professional color correction and stylistic grades.',
    type: 'expertise',
    sort_order: 4
  }
];

export const projectsData: ProjectData[] = [
  {
    id: "1",
    icon: <Briefcase className="h-10 w-10 text-elvis-pink" strokeWidth={1.5} />,
    title: 'Commercial Videos',
    description: 'Professional brand videos, product showcases, and promotional content for businesses.',
    type: 'project'
  },
  {
    id: "2",
    icon: <Smartphone className="h-10 w-10 text-elvis-pink" strokeWidth={1.5} />,
    title: 'Social Media Content',
    description: 'Engaging short-form videos optimized for Instagram, TikTok, and other platforms.',
    type: 'project'
  },
  {
    id: "3",
    icon: <Heart className="h-10 w-10 text-elvis-pink" strokeWidth={1.5} />,
    title: 'Wedding Videography',
    description: 'Beautifully crafted wedding films that capture the emotions and moments of your special day.',
    type: 'project'
  },
  {
    id: "4",
    icon: <Award className="h-10 w-10 text-elvis-pink" strokeWidth={1.5} />,
    title: 'Music Videos',
    description: 'Creative visual storytelling for artists and bands that elevate their music.',
    type: 'project'
  }
];
