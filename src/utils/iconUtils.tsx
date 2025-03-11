
import React from 'react';
import * as LucideIcons from 'lucide-react';

// Helper function to get a dynamic icon from the icon name
export const getDynamicIcon = (iconName: string, className = ''): React.ComponentType => {
  const defaultIcon = LucideIcons.Film;
  
  // If iconName is empty or not a string, return default icon
  if (!iconName || typeof iconName !== 'string') {
    return (props: any) => <defaultIcon {...props} className={className} />;
  }
  
  // Convert to proper case for Lucide icons (e.g., "video-camera" becomes "VideoCamera")
  const formattedIconName = iconName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  // Get the icon from Lucide icons
  const Icon = (LucideIcons as any)[formattedIconName] || defaultIcon;
  
  // Return a component that renders the icon with the given props
  return (props: any) => <Icon {...props} className={`${className} ${props.className || ''}`} />;
};

// Helper function to get all available icons
export const getAllIcons = () => {
  const icons: Record<string, React.ComponentType> = {};
  
  // Add all Lucide icons
  Object.entries(LucideIcons).forEach(([name, Component]) => {
    // Skip exports that aren't icons
    if (typeof Component === 'function' && name !== 'createElement' && name !== 'default') {
      icons[name] = Component;
    }
  });
  
  return icons;
};

// Get icon names list
export const getIconNamesList = () => {
  return Object.keys(getAllIcons());
};
