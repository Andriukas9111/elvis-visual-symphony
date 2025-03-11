
import React from 'react';
import { Camera, Video, Film, Music, Users } from 'lucide-react';
import { ExpertiseData, ProjectData } from './types';

export const expertiseData: ExpertiseData[] = [
  {
    id: "1",
    title: "Video Production",
    description: "Professional video content creation for businesses and brands",
    icon: <Camera className="h-7 w-7 text-elvis-pink" />,
    icon_name: "Camera",
    type: "service",
    sort_order: 1
  },
  {
    id: "2",
    title: "Photography",
    description: "High-quality photography services for various occasions and purposes",
    icon: <Camera className="h-7 w-7 text-elvis-pink" />,
    icon_name: "Camera",
    type: "service",
    sort_order: 2
  },
  {
    id: "3",
    title: "Content Strategy",
    description: "Strategic planning and development of content for optimal engagement",
    icon: <Film className="h-7 w-7 text-elvis-pink" />,
    icon_name: "Film",
    type: "service",
    sort_order: 3
  },
  {
    id: "4",
    title: "Post-Production",
    description: "Advanced editing, color grading, and effects for video content",
    icon: <Video className="h-7 w-7 text-elvis-pink" />,
    icon_name: "Video",
    type: "service",
    sort_order: 4
  }
];

export const projectsData: ProjectData[] = [
  {
    id: "1",
    title: "Commercial Shoot",
    description: "Product commercial for a major tech company",
    image: "/projects/commercial.jpg",
    icon: <Camera className="h-6 w-6 text-elvis-pink" />,
    type: "commercial"
  },
  {
    id: "2",
    title: "Music Video",
    description: "Creative music video for an indie band",
    image: "/projects/music.jpg",
    icon: <Music className="h-6 w-6 text-elvis-pink" />,
    type: "music"
  },
  {
    id: "3",
    title: "Wedding Film",
    description: "Cinematic wedding film for a luxury event",
    image: "/projects/wedding.jpg",
    icon: <Film className="h-6 w-6 text-elvis-pink" />,
    type: "wedding"
  },
  {
    id: "4",
    title: "Event Coverage",
    description: "Full coverage of a corporate conference",
    image: "/projects/event.jpg",
    icon: <Users className="h-6 w-6 text-elvis-pink" />,
    type: "event"
  }
];
