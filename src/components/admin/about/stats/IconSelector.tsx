import React from 'react';
import { Camera, Video, Award, Users, Instagram, Youtube, Mail, Star, Music, Heart, Film, Share2, Play, HeartPulse, VideoIcon, Aperture, ShieldCheck, Mic2, Clock, Flame, Gift, Compass, Zap, Monitor, Crop, FileImage, Edit3, Twitter } from 'lucide-react';
import { SelectItem } from '@/components/ui/select';

export const iconOptions = [
  { 
    category: 'Social Media',
    icons: [
      { value: 'Instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
      { value: 'Youtube', label: 'YouTube', icon: <Youtube className="h-4 w-4" /> },
      { value: 'Twitter', label: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
      { value: 'Share2', label: 'Social', icon: <Share2 className="h-4 w-4" /> },
      { value: 'Mail', label: 'Email', icon: <Mail className="h-4 w-4" /> },
    ]
  },
  { 
    category: 'Media & Professional',
    icons: [
      { value: 'Camera', label: 'Camera', icon: <Camera className="h-4 w-4" /> },
      { value: 'Video', label: 'Video', icon: <Video className="h-4 w-4" /> },
      { value: 'VideoIcon', label: 'Video Alt', icon: <VideoIcon className="h-4 w-4" /> },
      { value: 'Film', label: 'Film', icon: <Film className="h-4 w-4" /> },
      { value: 'Aperture', label: 'Aperture', icon: <Aperture className="h-4 w-4" /> },
      { value: 'Play', label: 'Play', icon: <Play className="h-4 w-4" /> },
      { value: 'Mic2', label: 'Microphone', icon: <Mic2 className="h-4 w-4" /> },
      { value: 'FileImage', label: 'Image', icon: <FileImage className="h-4 w-4" /> },
      { value: 'Edit3', label: 'Edit', icon: <Edit3 className="h-4 w-4" /> },
      { value: 'Crop', label: 'Crop', icon: <Crop className="h-4 w-4" /> },
      { value: 'Monitor', label: 'Monitor', icon: <Monitor className="h-4 w-4" /> },
    ]
  },
  {
    category: 'Metrics & Statistics',
    icons: [
      { value: 'Users', label: 'Users', icon: <Users className="h-4 w-4" /> },
      { value: 'Award', label: 'Award', icon: <Award className="h-4 w-4" /> },
      { value: 'Star', label: 'Star', icon: <Star className="h-4 w-4" /> },
      { value: 'Heart', label: 'Heart', icon: <Heart className="h-4 w-4" /> },
      { value: 'HeartPulse', label: 'Heart Pulse', icon: <HeartPulse className="h-4 w-4" /> },
      { value: 'Clock', label: 'Clock', icon: <Clock className="h-4 w-4" /> },
      { value: 'Flame', label: 'Flame', icon: <Flame className="h-4 w-4" /> },
      { value: 'Zap', label: 'Lightning', icon: <Zap className="h-4 w-4" /> },
      { value: 'ShieldCheck', label: 'Shield', icon: <ShieldCheck className="h-4 w-4" /> },
      { value: 'Gift', label: 'Gift', icon: <Gift className="h-4 w-4" /> },
      { value: 'Compass', label: 'Compass', icon: <Compass className="h-4 w-4" /> },
      { value: 'Music', label: 'Music', icon: <Music className="h-4 w-4" /> },
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
