
import React from 'react';
import { Camera, Video, Award, Users, Briefcase, Clock, MessageSquare, BarChart2, Film, Tv, Smartphone, Heart } from 'lucide-react';
import { ExpertiseData, ProjectData } from './types';

export const expertiseData: ExpertiseData[] = [
  {
    id: "1",
    label: 'Videography',
    description: 'Professional video production for commercial, music videos, and events.',
    icon_name: 'Camera',
    type: 'expertise',
    sort_order: 1
  },
  {
    id: "2",
    label: 'Cinematography',
    description: 'Artistic camera work to create visually stunning and emotionally engaging content.',
    icon_name: 'Film',
    type: 'expertise',
    sort_order: 2
  },
  {
    id: "3",
    label: 'Video Editing',
    description: 'Post-production excellence with attention to pacing, transitions, and storytelling.',
    icon_name: 'Video',
    type: 'expertise',
    sort_order: 3
  },
  {
    id: "4",
    label: 'Color Grading',
    description: 'Enhancing the visual appeal through professional color correction and stylistic grades.',
    icon_name: 'Tv',
    type: 'expertise',
    sort_order: 4
  }
];

export const projectsData: ProjectData[] = [
  {
    id: "1",
    title: 'Commercial Videos',
    description: 'Professional brand videos, product showcases, and promotional content for businesses.',
    image: '',
    category: 'commercial',
  },
  {
    id: "2",
    title: 'Social Media Content',
    description: 'Engaging short-form videos optimized for Instagram, TikTok, and other platforms.',
    image: '',
    category: 'social',
  },
  {
    id: "3",
    title: 'Wedding Videography',
    description: 'Beautifully crafted wedding films that capture the emotions and moments of your special day.',
    image: '',
    category: 'wedding',
  },
  {
    id: "4",
    title: 'Music Videos',
    description: 'Creative visual storytelling for artists and bands that elevate their music.',
    image: '',
    category: 'music',
  }
];
