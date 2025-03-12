export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      about_content: {
        Row: {
          created_at: string | null
          id: string
          job_title: string | null
          profile_image: string | null
          story: string
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_title?: string | null
          profile_image?: string | null
          story: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_title?: string | null
          profile_image?: string | null
          story?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      about_section_settings: {
        Row: {
          created_at: string | null
          id: string
          is_visible: boolean | null
          order_index: number | null
          section_name: string
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          order_index?: number | null
          section_name: string
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          order_index?: number | null
          section_name?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      accomplishments: {
        Row: {
          background_color: string
          created_at: string | null
          icon: string
          id: string
          order_index: number | null
          suffix: string | null
          text_color: string | null
          title: string
          updated_at: string | null
          value: string
        }
        Insert: {
          background_color: string
          created_at?: string | null
          icon: string
          id?: string
          order_index?: number | null
          suffix?: string | null
          text_color?: string | null
          title: string
          updated_at?: string | null
          value: string
        }
        Update: {
          background_color?: string
          created_at?: string | null
          icon?: string
          id?: string
          order_index?: number | null
          suffix?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      chunked_uploads: {
        Row: {
          base_path: string
          chunk_files: string[]
          chunk_size: number
          created_at: string | null
          file_size: number
          id: string
          mime_type: string
          original_filename: string
          status: string
          storage_bucket: string
          total_chunks: number
          updated_at: string | null
        }
        Insert: {
          base_path: string
          chunk_files: string[]
          chunk_size: number
          created_at?: string | null
          file_size: number
          id?: string
          mime_type: string
          original_filename: string
          status?: string
          storage_bucket: string
          total_chunks: number
          updated_at?: string | null
        }
        Update: {
          base_path?: string
          chunk_files?: string[]
          chunk_size?: number
          created_at?: string | null
          file_size?: number
          id?: string
          mime_type?: string
          original_filename?: string
          status?: string
          storage_bucket?: string
          total_chunks?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      content: {
        Row: {
          button_text: string | null
          button_url: string | null
          content: string | null
          created_at: string
          id: string
          is_published: boolean | null
          media_url: string | null
          ordering: number | null
          section: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          media_url?: string | null
          ordering?: number | null
          section: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          media_url?: string | null
          ordering?: number | null
          section?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          sort_order: number | null
          specs: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id: string
          image_url?: string | null
          name: string
          sort_order?: number | null
          specs?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          sort_order?: number | null
          specs?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      expertise: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expertise_items: {
        Row: {
          background_color: string | null
          created_at: string | null
          description: string
          icon: string
          id: string
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_color?: string | null
          created_at?: string | null
          description: string
          icon: string
          id?: string
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_color?: string | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      featured_projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          order_index: number | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          order_index?: number | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          order_index?: number | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      hire_requests: {
        Row: {
          budget: number | null
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          project_description: string
          project_type: string
          status: string
          timeline: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          project_description: string
          project_type: string
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          project_description?: string
          project_type?: string
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration: number | null
          file_format: string | null
          file_size: number | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          metadata: Json | null
          orientation: string | null
          original_filename: string | null
          processing_status: string | null
          slug: string
          sort_order: number | null
          storage_bucket: string | null
          storage_path: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string
          url: string
          video_metadata: Json | null
          video_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          duration?: number | null
          file_format?: string | null
          file_size?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          metadata?: Json | null
          orientation?: string | null
          original_filename?: string | null
          processing_status?: string | null
          slug: string
          sort_order?: number | null
          storage_bucket?: string | null
          storage_path?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string
          url: string
          video_metadata?: Json | null
          video_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          file_format?: string | null
          file_size?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          metadata?: Json | null
          orientation?: string | null
          original_filename?: string | null
          processing_status?: string | null
          slug?: string
          sort_order?: number | null
          storage_bucket?: string | null
          storage_path?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string
          url?: string
          video_metadata?: Json | null
          video_url?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          download_count: number | null
          download_limit: number | null
          expiry_date: string | null
          id: string
          payment_intent_id: string | null
          payment_status: string
          products: string[]
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          download_count?: number | null
          download_limit?: number | null
          expiry_date?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_status?: string
          products: string[]
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          download_count?: number | null
          download_limit?: number | null
          expiry_date?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_status?: string
          products?: string[]
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          demo_video_url: string | null
          description: string | null
          features: string[] | null
          file_url: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          name: string
          preview_image_url: string | null
          price: number
          sale_price: number | null
          slug: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          demo_video_url?: string | null
          description?: string | null
          features?: string[] | null
          file_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          name: string
          preview_image_url?: string | null
          price: number
          sale_price?: number | null
          slug: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          demo_video_url?: string | null
          description?: string | null
          features?: string[] | null
          file_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          name?: string
          preview_image_url?: string | null
          price?: number
          sale_price?: number | null
          slug?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      project_types: {
        Row: {
          background_color: string | null
          created_at: string | null
          description: string
          icon: string
          id: string
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_color?: string | null
          created_at?: string | null
          description: string
          icon: string
          id?: string
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_color?: string | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      secure_downloads: {
        Row: {
          created_at: string
          download_count: number
          download_token: string
          expires_at: string
          id: string
          max_downloads: number
          order_id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          download_count?: number
          download_token: string
          expires_at: string
          id?: string
          max_downloads?: number
          order_id: string
          product_id: string
        }
        Update: {
          created_at?: string
          download_count?: number
          download_token?: string
          expires_at?: string
          id?: string
          max_downloads?: number
          order_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "secure_downloads_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secure_downloads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_categories: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          name: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          background_color: string
          created_at: string | null
          icon: string
          id: string
          order_index: number | null
          platform: string
          text_color: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          background_color: string
          created_at?: string | null
          icon: string
          id?: string
          order_index?: number | null
          platform: string
          text_color?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          background_color?: string
          created_at?: string | null
          icon?: string
          id?: string
          order_index?: number | null
          platform?: string
          text_color?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      social_platforms: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string
          id: string
          name: string
          sort_order: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon: string
          id?: string
          name: string
          sort_order?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string
          id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      social_stats: {
        Row: {
          background_color: string | null
          created_at: string | null
          icon: string
          id: string
          order_index: number | null
          subtitle: string | null
          text_color: string | null
          title: string
          updated_at: string | null
          value: string
        }
        Insert: {
          background_color?: string | null
          created_at?: string | null
          icon: string
          id?: string
          order_index?: number | null
          subtitle?: string | null
          text_color?: string | null
          title: string
          updated_at?: string | null
          value: string
        }
        Update: {
          background_color?: string | null
          created_at?: string | null
          icon?: string
          id?: string
          order_index?: number | null
          subtitle?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      stats: {
        Row: {
          created_at: string | null
          icon_name: string
          id: string
          label: string
          sort_order: number | null
          suffix: string
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          icon_name: string
          id?: string
          label: string
          sort_order?: number | null
          suffix: string
          updated_at?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          icon_name?: string
          id?: string
          label?: string
          sort_order?: number | null
          suffix?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      technical_skills: {
        Row: {
          background_color: string | null
          category: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          order_index: number | null
          proficiency: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_color?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          order_index?: number | null
          proficiency?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_color?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          order_index?: number | null
          proficiency?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          client_company: string | null
          client_image: string | null
          client_name: string
          client_title: string
          content: string
          created_at: string | null
          id: string
          is_featured: boolean | null
          name: string | null
          order_index: number | null
          rating: number | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          client_company?: string | null
          client_image?: string | null
          client_name: string
          client_title: string
          content: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string | null
          order_index?: number | null
          rating?: number | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          client_company?: string | null
          client_image?: string | null
          client_name?: string
          client_title?: string
          content?: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string | null
          order_index?: number | null
          rating?: number | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          processed_at: string | null
        }
        Insert: {
          created_at?: string
          event_data: Json
          event_type: string
          id: string
          processed_at?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          processed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_profiles_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      generate_download_link: {
        Args: {
          order_id: string
          product_id: string
          expires_in?: unknown
        }
        Returns: string
      }
      get_about_section: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_admin_status: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_video_metadata: {
        Args: {
          media_id: string
          new_metadata: Json
          new_status?: string
        }
        Returns: undefined
      }
      validate_download_token: {
        Args: {
          token: string
        }
        Returns: {
          product_id: string
          file_url: string
          download_count: number
          max_downloads: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
