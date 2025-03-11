
import React from 'react';
import { SelectItem } from '@/components/ui/select';
import * as LucideIcons from 'lucide-react';

interface IconSelectorProps {
  filterSocial?: boolean;
}

export const getAllIcons = () => {
  return LucideIcons;
};

export const getIconByName = (name: string) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return LucideIcons.HelpCircle;
  }
  return IconComponent;
};

// Social media related icons
const socialIcons = [
  'Instagram', 'Youtube', 'Twitter', 'Facebook', 'Linkedin', 'Github',
  'Mail', 'Send', 'Share', 'Share2', 'Link', 'Globe', 'MessageSquare'
];

// Common statistical icons
const statIcons = [
  'Activity', 'BarChart', 'TrendingUp', 'Award', 'Star', 'Trophy',
  'Users', 'UserCheck', 'Video', 'Clock', 'Calendar', 'Heart', 'ThumbsUp',
  'Zap', 'Camera', 'Film', 'Mic', 'Music', 'Image', 'Palette'
];

// Expertise and project icons
const expertiseIcons = [
  'Camera', 'Film', 'Video', 'Tv', 'Monitor', 'Smartphone', 'Tablet',
  'Lightbulb', 'Image', 'PenTool', 'Scissors', 'Sliders', 'Terminal', 'Code',
  'Settings', 'Layers', 'Package', 'FileText', 'BookOpen', 'Briefcase'
];

// Group icons by category for organized display
export const iconOptionsGrouped = [
  {
    category: 'Social Media',
    icons: socialIcons.map(name => ({
      value: name,
      label: name,
      icon: React.createElement((LucideIcons as any)[name], { size: 16 })
    }))
  },
  {
    category: 'Statistics',
    icons: statIcons.map(name => ({
      value: name,
      label: name,
      icon: React.createElement((LucideIcons as any)[name], { size: 16 })
    }))
  },
  {
    category: 'Expertise & Projects',
    icons: expertiseIcons.map(name => ({
      value: name,
      label: name,
      icon: React.createElement((LucideIcons as any)[name], { size: 16 })
    }))
  }
];

// All available icons for selection (flat list)
export const iconOptions = [...socialIcons, ...statIcons, ...expertiseIcons].sort();

export const IconSelector: React.FC<IconSelectorProps> = ({ filterSocial = false }) => {
  const icons = filterSocial ? socialIcons.sort() : iconOptions;

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {icons.map((iconName) => {
        const IconComponent = (LucideIcons as any)[iconName];
        if (!IconComponent) return null;
        
        return (
          <SelectItem key={iconName} value={iconName} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <IconComponent size={16} />
              <span>{iconName}</span>
            </div>
          </SelectItem>
        );
      })}
    </div>
  );
};
