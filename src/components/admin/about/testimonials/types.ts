
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar_url: string | null;
  is_featured: boolean;
  order_index: number;
}

export interface TestimonialFormData {
  name: string;
  role: string;
  content: string;
  avatar_url: string | null;
}
