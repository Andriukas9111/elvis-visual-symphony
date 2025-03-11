
import React from 'react';
import * as Icons from 'lucide-react';

export const getAllIcons = () => {
  return Object.keys(Icons).map(iconName => ({
    name: iconName,
    component: Icons[iconName as keyof typeof Icons]
  }));
};

export const getIconByName = (iconName: string): React.ReactNode => {
  const IconComponent = Icons[iconName as keyof typeof Icons];
  if (IconComponent) {
    return React.createElement(IconComponent, { size: 24 });
  }
  return null;
};

export default {
  getAllIcons,
  getIconByName
};

