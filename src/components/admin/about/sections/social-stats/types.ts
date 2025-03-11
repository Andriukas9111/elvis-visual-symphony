
import { ReactNode } from 'react';

export interface SocialStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  background_color?: string;
  text_color?: string;
  order_index: number;
}

export interface StatCardProps {
  stat: Partial<SocialStat>;
  index: number;
  updateStat: (index: number, field: keyof SocialStat, value: string) => void;
  removeStat: (index: number) => void;
}

export interface StatFormActionsProps {
  onSave: () => void;
  addStat: () => void;
  isSubmitting: boolean;
}

export interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
