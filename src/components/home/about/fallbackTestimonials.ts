
import { Testimonial } from './types';

// Fallback testimonials in case none are loaded from the database
export const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: "John Smith",
    position: "Marketing Director",
    company: "Creative Agency",
    quote: "Elvis delivered exceptional video content that perfectly captured our brand identity. His creative vision and technical skills are outstanding!",
    avatar: "", // Empty string for fallback avatar
    is_featured: true
  },
  {
    id: '2',
    name: "Sarah Johnson",
    position: "CEO",
    company: "Tech Startup",
    quote: "Working with Elvis was a game-changer for our product launch videos. His attention to detail and storytelling ability helped us connect with our audience in a meaningful way.",
    avatar: "",
    is_featured: false
  },
  {
    id: '3',
    name: "Michael Brown",
    position: "Event Manager",
    company: "Conference Group",
    quote: "Elvis captured our annual conference with style and professionalism. The highlight reel he created was exactly what we needed to promote next year's event.",
    avatar: "",
    is_featured: false
  },
  {
    id: '4',
    name: "Emma Wilson",
    position: "Brand Manager",
    company: "Fashion Label",
    quote: "The fashion videos Elvis created for our seasonal collection exceeded our expectations. His understanding of our aesthetic was spot-on!",
    avatar: "",
    is_featured: false
  }
];

