
import React from 'react';
import { Camera, Video, Film, Briefcase, Users } from 'lucide-react';
import { ExpertiseData, ProjectData } from './types';

// Expertise data
export const expertiseData: ExpertiseData[] = [
  {
    id: '1',
    title: 'Commercial Videography',
    description: 'Creating compelling video content for brands and businesses',
    icon: <Briefcase size={24} />,
    icon_name: 'Briefcase',
    sort_order: 1
  },
  {
    id: '2',
    title: 'Documentary Filmmaking',
    description: 'Telling powerful stories through documentary-style videos',
    icon: <Film size={24} />,
    icon_name: 'Film',
    sort_order: 2
  },
  {
    id: '3',
    title: 'Event Coverage',
    description: 'Comprehensive video coverage of events and conferences',
    icon: <Users size={24} />,
    icon_name: 'Users',
    sort_order: 3
  },
  {
    id: '4',
    title: 'Aerial Videography',
    description: 'Stunning aerial footage using state-of-the-art drone technology',
    icon: <Camera size={24} />,
    icon_name: 'Camera',
    sort_order: 4
  }
];

// Project data
export const projectData: ProjectData[] = [
  {
    id: '1',
    title: 'Brand Campaign - XYZ Company',
    description: 'Full video campaign for product launch including social media shorts',
    image: '/projects/project1.jpg',
    technologies: ['Commercial', 'Marketing', 'Social Media'],
    icon: <Briefcase size={24} />,
    type: 'Commercial'
  },
  {
    id: '2',
    title: 'Life in the City - Documentary',
    description: 'Award-winning short documentary about urban living',
    image: '/projects/project2.jpg',
    technologies: ['Documentary', 'Storytelling', 'Cinematography'],
    icon: <Film size={24} />,
    type: 'Documentary'
  },
  {
    id: '3',
    title: 'Tech Conference 2023',
    description: 'Complete event coverage including keynotes and interviews',
    image: '/projects/project3.jpg',
    technologies: ['Event', 'Interview', 'Multi-camera'],
    icon: <Users size={24} />,
    type: 'Event'
  },
  {
    id: '4',
    title: 'Coastal Adventures - Travel Series',
    description: 'Cinematic travel series featuring coastal destinations',
    image: '/projects/project4.jpg',
    technologies: ['Travel', 'Aerial', 'Cinematic'],
    icon: <Camera size={24} />,
    type: 'Travel'
  }
];
