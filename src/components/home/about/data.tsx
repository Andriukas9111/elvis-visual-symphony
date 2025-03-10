
import React from 'react';
import { Camera, Video, Award, Users, Film, Clapperboard, Star } from 'lucide-react';
import { StatItem, SkillItem, Testimonial } from './types';

export const statsData: StatItem[] = [
  { id: 1, icon: <Camera className="h-8 w-8 text-elvis-pink" />, value: '350+', label: 'Photo Projects' },
  { id: 2, icon: <Video className="h-8 w-8 text-elvis-pink" />, value: '120+', label: 'Video Productions' },
  { id: 3, icon: <Award className="h-8 w-8 text-elvis-pink" />, value: '28', label: 'Industry Awards' },
  { id: 4, icon: <Users className="h-8 w-8 text-elvis-pink" />, value: '45+', label: 'Happy Clients' }
];

export const skills: SkillItem[] = [
  { icon: <Film className="h-6 w-6" />, label: 'Cinematography' },
  { icon: <Clapperboard className="h-6 w-6" />, label: 'Film Production' },
  { icon: <Camera className="h-6 w-6" />, label: 'Photography' },
  { icon: <Video className="h-6 w-6" />, label: 'Video Editing' },
  { icon: <Star className="h-6 w-6" />, label: 'Visual Effects' },
  { icon: <Award className="h-6 w-6" />, label: 'Color Grading' },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Elvis brings an exceptional level of creativity and technical skill to every project. His ability to capture the perfect moment and transform it into a compelling visual story is truly remarkable.",
    name: "Andrew K",
    company: "Nixon Coffee",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: 2,
    quote: "Working with Elvis was a game-changer for our brand. The videos he created perfectly captured our essence and helped us connect with our audience in ways we never imagined possible.",
    name: "Rusne K",
    company: "Cats and Boots",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=2574"
  },
  {
    id: 3,
    quote: "Elvis has a unique eye for detail that sets him apart. His work for our campaign exceeded expectations and delivered measurable results. I wouldn't hesitate to recommend him.",
    name: "Sarah Thompson",
    company: "Luminous Studios",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=2574"
  }
];
