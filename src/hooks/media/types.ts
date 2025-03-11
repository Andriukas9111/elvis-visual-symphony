
export interface MediaItem {
  id: string;
  title?: string;
  description?: string;
  url?: string;
  thumbnail_url?: string | null;
  category?: string;
  tags?: string[];
  is_published?: boolean;
  is_featured?: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SortOrderUpdate {
  id: string;
  sort_order: number;
}

export interface OrderUpdateLog {
  timestamp: string;
  updates: { id: string; new_order: number }[];
}
