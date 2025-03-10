
import React from 'react';
import {
  Camera, Video, Music, Image, FileText, Mail, Calendar, 
  Clock, Award, Trophy, Target, Star, Heart, ThumbsUp,
  Users, User, Briefcase, MapPin, Globe, Phone, 
  CheckCircle, Zap, Bookmark, Share2, Smile, 
  PieChart, BarChart, Activity, Film, Play
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SelectItem } from '@/components/ui/select';

export const iconOptions = [
  {
    category: 'Media',
    icons: [
      { value: 'Camera', label: 'Camera', icon: <Camera size={16} /> },
      { value: 'Video', label: 'Video', icon: <Video size={16} /> },
      { value: 'Film', label: 'Film', icon: <Film size={16} /> },
      { value: 'Play', label: 'Play', icon: <Play size={16} /> },
      { value: 'Music', label: 'Music', icon: <Music size={16} /> },
      { value: 'Image', label: 'Image', icon: <Image size={16} /> },
      { value: 'FileText', label: 'Document', icon: <FileText size={16} /> }
    ]
  },
  {
    category: 'Communication',
    icons: [
      { value: 'Mail', label: 'Mail', icon: <Mail size={16} /> },
      { value: 'Phone', label: 'Phone', icon: <Phone size={16} /> },
      { value: 'Globe', label: 'Website', icon: <Globe size={16} /> },
      { value: 'Share2', label: 'Share', icon: <Share2 size={16} /> }
    ]
  },
  {
    category: 'Time & Events',
    icons: [
      { value: 'Calendar', label: 'Calendar', icon: <Calendar size={16} /> },
      { value: 'Clock', label: 'Clock', icon: <Clock size={16} /> }
    ]
  },
  {
    category: 'Achievements',
    icons: [
      { value: 'Award', label: 'Award', icon: <Award size={16} /> },
      { value: 'Trophy', label: 'Trophy', icon: <Trophy size={16} /> },
      { value: 'Star', label: 'Star', icon: <Star size={16} /> },
      { value: 'CheckCircle', label: 'Check', icon: <CheckCircle size={16} /> },
      { value: 'Target', label: 'Target', icon: <Target size={16} /> }
    ]
  },
  {
    category: 'People & Places',
    icons: [
      { value: 'User', label: 'User', icon: <User size={16} /> },
      { value: 'Users', label: 'Users', icon: <Users size={16} /> },
      { value: 'Briefcase', label: 'Work', icon: <Briefcase size={16} /> },
      { value: 'MapPin', label: 'Location', icon: <MapPin size={16} /> }
    ]
  },
  {
    category: 'Data & Analytics',
    icons: [
      { value: 'PieChart', label: 'Pie Chart', icon: <PieChart size={16} /> },
      { value: 'BarChart', label: 'Bar Chart', icon: <BarChart size={16} /> },
      { value: 'Activity', label: 'Activity', icon: <Activity size={16} /> }
    ]
  },
  {
    category: 'Engagement',
    icons: [
      { value: 'Heart', label: 'Heart', icon: <Heart size={16} /> },
      { value: 'ThumbsUp', label: 'Like', icon: <ThumbsUp size={16} /> },
      { value: 'Bookmark', label: 'Bookmark', icon: <Bookmark size={16} /> },
      { value: 'Smile', label: 'Smile', icon: <Smile size={16} /> },
      { value: 'Zap', label: 'Lightning', icon: <Zap size={16} /> }
    ]
  }
];

export const IconSelector: React.FC = () => (
  <ScrollArea className="h-[200px]">
    <div className="space-y-2 p-1">
      {iconOptions.map((category) => (
        <div key={category.category}>
          <h4 className="mb-1 text-sm font-medium">{category.category}</h4>
          <div>
            {category.icons.map((icon) => (
              <SelectItem key={icon.value} value={icon.value}>
                <div className="flex items-center gap-2">
                  {icon.icon}
                  <span>{icon.label}</span>
                </div>
              </SelectItem>
            ))}
          </div>
        </div>
      ))}
    </div>
  </ScrollArea>
);

export const getIconByName = (iconName: string) => {
  const size = 20;
  
  switch (iconName) {
    case 'Camera':
      return <Camera size={size} />;
    case 'Video':
      return <Video size={size} />;
    case 'Film':
      return <Film size={size} />;
    case 'Play':
      return <Play size={size} />;
    case 'Music':
      return <Music size={size} />;
    case 'Image':
      return <Image size={size} />;
    case 'FileText':
      return <FileText size={size} />;
    case 'Mail':
      return <Mail size={size} />;
    case 'Phone':
      return <Phone size={size} />;
    case 'Globe':
      return <Globe size={size} />;
    case 'Share2':
      return <Share2 size={size} />;
    case 'Calendar':
      return <Calendar size={size} />;
    case 'Clock':
      return <Clock size={size} />;
    case 'Award':
      return <Award size={size} />;
    case 'Trophy':
      return <Trophy size={size} />;
    case 'Star':
      return <Star size={size} />;
    case 'CheckCircle':
      return <CheckCircle size={size} />;
    case 'Target':
      return <Target size={size} />;
    case 'User':
      return <User size={size} />;
    case 'Users':
      return <Users size={size} />;
    case 'Briefcase':
      return <Briefcase size={size} />;
    case 'MapPin':
      return <MapPin size={size} />;
    case 'PieChart':
      return <PieChart size={size} />;
    case 'BarChart':
      return <BarChart size={size} />;
    case 'Activity':
      return <Activity size={size} />;
    case 'Heart':
      return <Heart size={size} />;
    case 'ThumbsUp':
      return <ThumbsUp size={size} />;
    case 'Bookmark':
      return <Bookmark size={size} />;
    case 'Smile':
      return <Smile size={size} />;
    case 'Zap':
      return <Zap size={size} />;
    default:
      return <Star size={size} />;
  }
};

export const getAllIcons = () => {
  const iconMap: { [key: string]: React.ReactNode } = {};
  
  iconOptions.forEach(category => {
    category.icons.forEach(icon => {
      iconMap[icon.value] = icon.icon;
    });
  });
  
  return iconMap;
};
