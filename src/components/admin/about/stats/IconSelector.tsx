
import React from 'react';
import {
  Award,
  BarChart,
  Heart,
  Star,
  Trophy,
  User,
  Users,
  Video,
  Camera,
  ThumbsUp,
  Globe,
  Briefcase,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  FileText,
  MessageSquare,
  Clock,
  Film,
  Calendar,
  Gift,
  VideoIcon,
  Share2,
  Smile,
  Headphones,
  Monitor,
  Smartphone,
  Mail,
  AlignJustify,
  Activity,
  Flag,
  Rss,
  CheckCircle,
  PenTool,
  Image,
  Mic,
  Music,
  Layers,
  Code,
  Eye,
  Zap,
  Box,
  Coffee,
  Book,
  Bookmark,
  Hexagon,
  Circle,
  Square,
  Play,
  Server,
  Settings,
  Map,
  MapPin,
  Wind,
  Cloud,
  Sun,
  Moon,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { SelectItem } from '@/components/ui/select';

export type IconCategory = {
  category: string;
  icons: {
    value: string;
    label: string;
    icon: React.ReactNode;
  }[];
};

export const iconOptions = [
  { value: 'Award', component: <Award className="h-4 w-4" /> },
  { value: 'BarChart', component: <BarChart className="h-4 w-4" /> },
  { value: 'Heart', component: <Heart className="h-4 w-4" /> },
  { value: 'Star', component: <Star className="h-4 w-4" /> },
  { value: 'Trophy', component: <Trophy className="h-4 w-4" /> },
  { value: 'User', component: <User className="h-4 w-4" /> },
  { value: 'Users', component: <Users className="h-4 w-4" /> },
  { value: 'Video', component: <Video className="h-4 w-4" /> },
  { value: 'Camera', component: <Camera className="h-4 w-4" /> },
  { value: 'ThumbsUp', component: <ThumbsUp className="h-4 w-4" /> },
  { value: 'Globe', component: <Globe className="h-4 w-4" /> },
  { value: 'Briefcase', component: <Briefcase className="h-4 w-4" /> },
  { value: 'Instagram', component: <Instagram className="h-4 w-4" /> },
  { value: 'Youtube', component: <Youtube className="h-4 w-4" /> },
  { value: 'Twitter', component: <Twitter className="h-4 w-4" /> },
  { value: 'Facebook', component: <Facebook className="h-4 w-4" /> },
  { value: 'Linkedin', component: <Linkedin className="h-4 w-4" /> },
  { value: 'FileText', component: <FileText className="h-4 w-4" /> },
  { value: 'MessageSquare', component: <MessageSquare className="h-4 w-4" /> },
  { value: 'Clock', component: <Clock className="h-4 w-4" /> },
  { value: 'Film', component: <Film className="h-4 w-4" /> },
  { value: 'Calendar', component: <Calendar className="h-4 w-4" /> },
  { value: 'Gift', component: <Gift className="h-4 w-4" /> },
  { value: 'VideoIcon', component: <VideoIcon className="h-4 w-4" /> },
  { value: 'Share2', component: <Share2 className="h-4 w-4" /> },
  { value: 'Smile', component: <Smile className="h-4 w-4" /> },
  { value: 'Headphones', component: <Headphones className="h-4 w-4" /> },
  { value: 'Monitor', component: <Monitor className="h-4 w-4" /> },
  { value: 'Smartphone', component: <Smartphone className="h-4 w-4" /> },
  { value: 'Mail', component: <Mail className="h-4 w-4" /> },
  { value: 'AlignJustify', component: <AlignJustify className="h-4 w-4" /> },
  { value: 'Activity', component: <Activity className="h-4 w-4" /> },
  { value: 'Flag', component: <Flag className="h-4 w-4" /> },
  { value: 'Rss', component: <Rss className="h-4 w-4" /> },
  { value: 'CheckCircle', component: <CheckCircle className="h-4 w-4" /> },
  { value: 'PenTool', component: <PenTool className="h-4 w-4" /> },
  { value: 'Image', component: <Image className="h-4 w-4" /> },
  { value: 'Mic', component: <Mic className="h-4 w-4" /> },
  { value: 'Music', component: <Music className="h-4 w-4" /> },
  { value: 'Layers', component: <Layers className="h-4 w-4" /> },
  { value: 'Code', component: <Code className="h-4 w-4" /> },
  { value: 'Eye', component: <Eye className="h-4 w-4" /> },
  { value: 'Zap', component: <Zap className="h-4 w-4" /> },
  { value: 'Box', component: <Box className="h-4 w-4" /> },
  { value: 'Coffee', component: <Coffee className="h-4 w-4" /> },
  { value: 'Book', component: <Book className="h-4 w-4" /> },
  { value: 'Bookmark', component: <Bookmark className="h-4 w-4" /> },
  { value: 'Hexagon', component: <Hexagon className="h-4 w-4" /> },
  { value: 'Circle', component: <Circle className="h-4 w-4" /> },
  { value: 'Square', component: <Square className="h-4 w-4" /> },
  { value: 'Play', component: <Play className="h-4 w-4" /> },
  { value: 'Server', component: <Server className="h-4 w-4" /> },
  { value: 'Settings', component: <Settings className="h-4 w-4" /> },
  { value: 'Map', component: <Map className="h-4 w-4" /> },
  { value: 'MapPin', component: <MapPin className="h-4 w-4" /> },
  { value: 'Wind', component: <Wind className="h-4 w-4" /> },
  { value: 'Cloud', component: <Cloud className="h-4 w-4" /> },
  { value: 'Sun', component: <Sun className="h-4 w-4" /> },
  { value: 'Moon', component: <Moon className="h-4 w-4" /> },
  { value: 'Lightbulb', component: <Lightbulb className="h-4 w-4" /> },
  { value: 'Rocket', component: <Rocket className="h-4 w-4" /> }
];

// For categorizing icons in the UI
export const iconOptionsGrouped: IconCategory[] = [
  {
    category: "Media",
    icons: [
      { value: "Camera", label: "Camera", icon: <Camera className="h-4 w-4" /> },
      { value: "Video", label: "Video", icon: <Video className="h-4 w-4" /> },
      { value: "Film", label: "Film", icon: <Film className="h-4 w-4" /> },
      { value: "Image", label: "Image", icon: <Image className="h-4 w-4" /> },
      { value: "VideoIcon", label: "VideoIcon", icon: <VideoIcon className="h-4 w-4" /> },
      { value: "Mic", label: "Mic", icon: <Mic className="h-4 w-4" /> },
      { value: "Music", label: "Music", icon: <Music className="h-4 w-4" /> },
      { value: "Headphones", label: "Headphones", icon: <Headphones className="h-4 w-4" /> },
      { value: "Play", label: "Play", icon: <Play className="h-4 w-4" /> }
    ]
  },
  {
    category: "Social Media",
    icons: [
      { value: "Instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
      { value: "Youtube", label: "Youtube", icon: <Youtube className="h-4 w-4" /> },
      { value: "Twitter", label: "Twitter", icon: <Twitter className="h-4 w-4" /> },
      { value: "Facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
      { value: "Linkedin", label: "Linkedin", icon: <Linkedin className="h-4 w-4" /> },
      { value: "Globe", label: "Globe", icon: <Globe className="h-4 w-4" /> },
      { value: "Share2", label: "Share", icon: <Share2 className="h-4 w-4" /> },
      { value: "MessageSquare", label: "Message", icon: <MessageSquare className="h-4 w-4" /> },
      { value: "Mail", label: "Mail", icon: <Mail className="h-4 w-4" /> },
      { value: "Rss", label: "RSS", icon: <Rss className="h-4 w-4" /> },
      { value: "Users", label: "Users", icon: <Users className="h-4 w-4" /> },
      { value: "User", label: "User", icon: <User className="h-4 w-4" /> },
      { value: "Eye", label: "Eye", icon: <Eye className="h-4 w-4" /> }
    ]
  },
  {
    category: "Achievements",
    icons: [
      { value: "Award", label: "Award", icon: <Award className="h-4 w-4" /> },
      { value: "Trophy", label: "Trophy", icon: <Trophy className="h-4 w-4" /> },
      { value: "Star", label: "Star", icon: <Star className="h-4 w-4" /> },
      { value: "CheckCircle", label: "Verified", icon: <CheckCircle className="h-4 w-4" /> },
      { value: "ThumbsUp", label: "Like", icon: <ThumbsUp className="h-4 w-4" /> },
      { value: "Heart", label: "Heart", icon: <Heart className="h-4 w-4" /> },
      { value: "Zap", label: "Zap", icon: <Zap className="h-4 w-4" /> },
      { value: "Rocket", label: "Rocket", icon: <Rocket className="h-4 w-4" /> }
    ]
  },
  {
    category: "Metrics & Time",
    icons: [
      { value: "BarChart", label: "Chart", icon: <BarChart className="h-4 w-4" /> },
      { value: "Activity", label: "Activity", icon: <Activity className="h-4 w-4" /> },
      { value: "Clock", label: "Time", icon: <Clock className="h-4 w-4" /> },
      { value: "Calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> }
    ]
  },
  {
    category: "Business",
    icons: [
      { value: "Briefcase", label: "Work", icon: <Briefcase className="h-4 w-4" /> },
      { value: "FileText", label: "Document", icon: <FileText className="h-4 w-4" /> },
      { value: "Book", label: "Book", icon: <Book className="h-4 w-4" /> },
      { value: "Bookmark", label: "Bookmark", icon: <Bookmark className="h-4 w-4" /> },
      { value: "Server", label: "Server", icon: <Server className="h-4 w-4" /> },
      { value: "Settings", label: "Settings", icon: <Settings className="h-4 w-4" /> }
    ]
  },
  {
    category: "General",
    icons: [
      { value: "Lightbulb", label: "Idea", icon: <Lightbulb className="h-4 w-4" /> },
      { value: "Gift", label: "Gift", icon: <Gift className="h-4 w-4" /> },
      { value: "Smile", label: "Smile", icon: <Smile className="h-4 w-4" /> },
      { value: "Coffee", label: "Coffee", icon: <Coffee className="h-4 w-4" /> },
      { value: "Box", label: "Box", icon: <Box className="h-4 w-4" /> },
      { value: "Flag", label: "Flag", icon: <Flag className="h-4 w-4" /> }
    ]
  },
  {
    category: "Devices",
    icons: [
      { value: "Monitor", label: "Monitor", icon: <Monitor className="h-4 w-4" /> },
      { value: "Smartphone", label: "Phone", icon: <Smartphone className="h-4 w-4" /> }
    ]
  },
  {
    category: "UI/Design",
    icons: [
      { value: "PenTool", label: "Design", icon: <PenTool className="h-4 w-4" /> },
      { value: "Layers", label: "Layers", icon: <Layers className="h-4 w-4" /> },
      { value: "Code", label: "Code", icon: <Code className="h-4 w-4" /> },
      { value: "AlignJustify", label: "Menu", icon: <AlignJustify className="h-4 w-4" /> },
      { value: "Hexagon", label: "Hexagon", icon: <Hexagon className="h-4 w-4" /> },
      { value: "Circle", label: "Circle", icon: <Circle className="h-4 w-4" /> },
      { value: "Square", label: "Square", icon: <Square className="h-4 w-4" /> }
    ]
  },
  {
    category: "Travel & Weather",
    icons: [
      { value: "Map", label: "Map", icon: <Map className="h-4 w-4" /> },
      { value: "MapPin", label: "Location", icon: <MapPin className="h-4 w-4" /> },
      { value: "Wind", label: "Wind", icon: <Wind className="h-4 w-4" /> },
      { value: "Cloud", label: "Cloud", icon: <Cloud className="h-4 w-4" /> },
      { value: "Sun", label: "Sun", icon: <Sun className="h-4 w-4" /> },
      { value: "Moon", label: "Moon", icon: <Moon className="h-4 w-4" /> }
    ]
  }
];

export function getIconByName(name?: string, className?: string) {
  const icon = iconOptions.find(icon => icon.value === name);
  if (!icon) return <Award className={className || "h-4 w-4"} />;
  
  const IconComponent = icon.component.type;
  return <IconComponent className={className || "h-4 w-4"} />;
}

export function getAllIcons() {
  const iconMap: Record<string, React.ReactNode> = {};
  iconOptions.forEach(icon => {
    iconMap[icon.value] = React.cloneElement(icon.component, { className: "h-4 w-4" });
  });
  return iconMap;
}

const IconSelector: React.FC = () => {
  return (
    <>
      {iconOptionsGrouped.map((category) => (
        <div key={category.category} className="mb-2">
          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
            {category.category}
          </div>
          {category.icons.map((icon) => (
            <SelectItem key={icon.value} value={icon.value} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {icon.icon}
                <span>{icon.label}</span>
              </div>
            </SelectItem>
          ))}
        </div>
      ))}
    </>
  );
};

export default IconSelector;
