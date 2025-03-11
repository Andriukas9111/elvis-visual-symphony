
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideIcon, LucideProps } from 'lucide-react';

export type IconProps = LucideProps & {
  className?: string;
};

// Helper function to get a dynamic icon from the icon name
export const getDynamicIcon = (iconName: string): React.ComponentType<IconProps> => {
  const DefaultIcon = LucideIcons.Film;
  
  // If iconName is empty or not a string, return default icon
  if (!iconName || typeof iconName !== 'string') {
    return DefaultIcon;
  }
  
  // Convert to proper case for Lucide icons (e.g., "video-camera" becomes "VideoCamera")
  const formattedIconName = iconName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  // Get the icon from Lucide icons using a type assertion to fix type issue
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  const Icon = icons[formattedIconName] || DefaultIcon;
  
  return Icon;
};

// Helper function to get all available icons
export const getAllIcons = () => {
  return Object.fromEntries(
    Object.entries(LucideIcons)
      .filter(([name, Component]) => 
        typeof Component === 'function' && 
        name !== 'createElement' && 
        name !== 'default'
      )
  );
};

// Get icon names list
export const getIconNamesList = () => {
  return Object.keys(getAllIcons());
};
