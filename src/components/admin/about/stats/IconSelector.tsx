
import React from 'react';
import { Camera, Video, Award, Users, Instagram, Youtube, Mail, Star, Music, Heart, Film, Share2 } from 'lucide-react';
import { SelectItem } from '@/components/ui/select';

export const iconOptions = [
  { 
    category: 'Media & Professional',
    icons: [
      { value: 'Camera', label: 'Camera', icon: <Camera className="h-4 w-4" /> },
      { value: 'Video', label: 'Video', icon: <Video className="h-4 w-4" /> },
      { value: 'Film', label: 'Film', icon: <Film className="h-4 w-4" /> },
      { value: 'Award', label: 'Award', icon: <Award className="h-4 w-4" /> },
      { value: 'Users', label: 'Users', icon: <Users className="h-4 w-4" /> },
      { value: 'Star', label: 'Star', icon: <Star className="h-4 w-4" /> },
      { value: 'Music', label: 'Music', icon: <Music className="h-4 w-4" /> },
      { value: 'Heart', label: 'Heart', icon: <Heart className="h-4 w-4" /> },
    ]
  },
  {
    category: 'Social Media',
    icons: [
      { value: 'Instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
      { value: 'Youtube', label: 'YouTube', icon: <Youtube className="h-4 w-4" /> },
      { value: 'Share2', label: 'Social', icon: <Share2 className="h-4 w-4" /> },
      { value: 'Mail', label: 'Email', icon: <Mail className="h-4 w-4" /> },
    ]
  }
];

export const IconSelector: React.FC = () => {
  return (
    <>
      {iconOptions.map(category => (
        <React.Fragment key={category.category}>
          <div className="px-2 py-1.5 text-xs font-semibold bg-elvis-dark/60">
            {category.category}
          </div>
          {category.icons.map(icon => (
            <SelectItem key={icon.value} value={icon.value}>
              <div className="flex items-center">
                {icon.icon}
                <span className="ml-2">{icon.label}</span>
              </div>
            </SelectItem>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

export const getIconByName = (iconName: string) => {
  for (const category of iconOptions) {
    for (const icon of category.icons) {
      if (icon.value === iconName) {
        return icon.icon;
      }
    }
  }
  return <Camera className="h-4 w-4" />;
};

export const getAllIcons = () => {
  const allIcons: {[key: string]: React.ReactNode} = {};
  
  iconOptions.forEach(category => {
    category.icons.forEach(icon => {
      allIcons[icon.value] = icon.icon;
    });
  });
  
  return allIcons;
};
