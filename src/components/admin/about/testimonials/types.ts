
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  avatar_url?: string;
  is_featured: boolean;
  order_index: number;
  rating?: number;
  // Legacy fields for backward compatibility
  client_name?: string;
  client_title?: string;
  client_company?: string;
  client_image?: string;
}

export interface TestimonialFormData {
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar_url: string;
  rating?: number;
}
