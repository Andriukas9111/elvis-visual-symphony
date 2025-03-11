
import React from 'react';
import * as Icons from 'lucide-react';

export const getAllIcons = () => {
  return Object.keys(Icons)
    .filter(iconName => 
      typeof Icons[iconName as keyof typeof Icons] === 'function' && 
      iconName !== 'createLucideIcon')
    .map(iconName => ({
      name: iconName,
      component: Icons[iconName as keyof typeof Icons]
    }));
};

export const getIconByName = (iconName: string): React.ReactNode => {
  if (!iconName) return null;
  
  const IconComponent = Icons[iconName as keyof typeof Icons];
  if (typeof IconComponent === 'function' && iconName !== 'createLucideIcon') {
    return React.createElement(IconComponent, { size: 24 });
  }
  return null;
};

export default {
  getAllIcons,
  getIconByName
};
