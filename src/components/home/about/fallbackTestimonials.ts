
import { Testimonial } from './types';

export const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    client_name: 'John Smith',
    role: 'Marketing Director, ABC Corporation',
    client_company: 'ABC Corporation',
    content: 'Working with Elvis Creative was an absolute pleasure. Their attention to detail and creative vision brought our brand to life in ways we couldn\'t have imagined.',
    rating: 5,
    is_featured: true,
    
    // UI mapping
    name: 'John Smith',
    position: 'Marketing Director',
    company: 'ABC Corporation',
    quote: 'Working with Elvis Creative was an absolute pleasure. Their attention to detail and creative vision brought our brand to life in ways we couldn\'t have imagined.'
  },
  {
    id: '2',
    client_name: 'Sarah Johnson',
    role: 'CEO, Tech Innovations',
    client_company: 'Tech Innovations',
    content: 'The video production quality was exceptional. Elvis delivered ahead of schedule and exceeded our expectations. We\'ve already booked our next project!',
    rating: 5,
    is_featured: true,
    
    // UI mapping
    name: 'Sarah Johnson',
    position: 'CEO',
    company: 'Tech Innovations',
    quote: 'The video production quality was exceptional. Elvis delivered ahead of schedule and exceeded our expectations. We\'ve already booked our next project!'
  },
  {
    id: '3',
    client_name: 'Michael Chang',
    role: 'Event Manager, Global Conferences',
    client_company: 'Global Conferences',
    content: 'Our conference highlight reel was stunning. Elvis captured the energy and essence of our event perfectly. Highly recommended for professional video work.',
    rating: 5,
    is_featured: true,
    
    // UI mapping
    name: 'Michael Chang',
    position: 'Event Manager',
    company: 'Global Conferences',
    quote: 'Our conference highlight reel was stunning. Elvis captured the energy and essence of our event perfectly. Highly recommended for professional video work.'
  }
];
