
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconRendererProps {
  iconName: string;
  size?: number;
}

const IconRenderer: React.FC<IconRendererProps> = ({ iconName, size = 24 }) => {
  if (iconName.startsWith('lucide-')) {
    const iconKey = iconName.replace('lucide-', '');
    // Convert kebab-case to PascalCase for Lucide icons
    const pascalCaseIcon = iconKey
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    const Icon = (LucideIcons as any)[pascalCaseIcon];
    
    if (Icon) {
      return <Icon size={size} />;
    }
  }
  
  // Fallback to class-based icon (for Font Awesome, etc.)
  return <i className={iconName}></i>;
};

export default IconRenderer;
