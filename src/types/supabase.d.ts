
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          bio: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          bio?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          bio?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          sale_price: number | null;
          preview_image_url: string | null;
          demo_video_url: string | null;
          file_url: string | null;
          category: string;
          tags: string[] | null;
          features: string[] | null;
          is_featured: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          sale_price?: number | null;
          preview_image_url?: string | null;
          demo_video_url?: string | null;
          file_url?: string | null;
          category: string;
          tags?: string[] | null;
          features?: string[] | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          sale_price?: number | null;
          preview_image_url?: string | null;
          demo_video_url?: string | null;
          file_url?: string | null;
          category?: string;
          tags?: string[] | null;
          features?: string[] | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          type: string;
          url: string;
          thumbnail_url: string | null;
          category: string;
          tags: string[] | null;
          metadata: Json | null;
          is_featured: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          type: string;
          url: string;
          thumbnail_url?: string | null;
          category: string;
          tags?: string[] | null;
          metadata?: Json | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          type?: string;
          url?: string;
          thumbnail_url?: string | null;
          category?: string;
          tags?: string[] | null;
          metadata?: Json | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          products: string[];
          total_amount: number;
          payment_status: string;
          payment_intent_id: string | null;
          download_count: number;
          download_limit: number;
          expiry_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          products: string[];
          total_amount: number;
          payment_status?: string;
          payment_intent_id?: string | null;
          download_count?: number;
          download_limit?: number;
          expiry_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          products?: string[];
          total_amount?: number;
          payment_status?: string;
          payment_intent_id?: string | null;
          download_count?: number;
          download_limit?: number;
          expiry_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      content: {
        Row: {
          id: string;
          section: string;
          title: string | null;
          subtitle: string | null;
          content: string | null;
          media_url: string | null;
          button_text: string | null;
          button_url: string | null;
          ordering: number | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section: string;
          title?: string | null;
          subtitle?: string | null;
          content?: string | null;
          media_url?: string | null;
          button_text?: string | null;
          button_url?: string | null;
          ordering?: number | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section?: string;
          title?: string | null;
          subtitle?: string | null;
          content?: string | null;
          media_url?: string | null;
          button_text?: string | null;
          button_url?: string | null;
          ordering?: number | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      hire_requests: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          project_type: string;
          project_description: string;
          budget: number | null;
          timeline: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          project_type: string;
          project_description: string;
          budget?: number | null;
          timeline?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          project_type?: string;
          project_description?: string;
          budget?: number | null;
          timeline?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
