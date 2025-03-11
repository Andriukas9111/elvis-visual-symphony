
import React from 'react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const getAllIcons = () => {
  return Object.keys(Icons)
    .filter(iconName => 
      typeof Icons[iconName as keyof typeof Icons] === 'function' && 
      iconName !== 'createLucideIcon')
    .map(iconName => ({
      name: iconName,
      component: Icons[iconName as keyof typeof Icons] as LucideIcon
    }));
};

export const getIconByName = (iconName: string): React.ReactNode => {
  if (!iconName) return null;
  
  const IconComponent = Icons[iconName as keyof typeof Icons] as LucideIcon;
  if (typeof IconComponent === 'function' && iconName !== 'createLucideIcon') {
    return <IconComponent size={24} />;
  }
  return null;
};

export default {
  getAllIcons,
  getIconByName
};
