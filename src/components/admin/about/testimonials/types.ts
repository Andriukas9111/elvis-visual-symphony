
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  avatar_url?: string;
  is_featured: boolean;
  order_index: number;
}

export interface TestimonialFormData {
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar_url: string;
}
