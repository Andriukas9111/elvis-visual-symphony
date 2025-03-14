
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
  Code
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
  { value: 'Award', component: <Award /> },
  { value: 'BarChart', component: <BarChart /> },
  { value: 'Heart', component: <Heart /> },
  { value: 'Star', component: <Star /> },
  { value: 'Trophy', component: <Trophy /> },
  { value: 'User', component: <User /> },
  { value: 'Users', component: <Users /> },
  { value: 'Video', component: <Video /> },
  { value: 'Camera', component: <Camera /> },
  { value: 'ThumbsUp', component: <ThumbsUp /> },
  { value: 'Globe', component: <Globe /> },
  { value: 'Briefcase', component: <Briefcase /> },
  { value: 'Instagram', component: <Instagram /> },
  { value: 'Youtube', component: <Youtube /> },
  { value: 'Twitter', component: <Twitter /> },
  { value: 'Facebook', component: <Facebook /> },
  { value: 'Linkedin', component: <Linkedin /> },
  { value: 'FileText', component: <FileText /> },
  { value: 'MessageSquare', component: <MessageSquare /> },
  { value: 'Clock', component: <Clock /> },
  { value: 'Film', component: <Film /> },
  { value: 'Calendar', component: <Calendar /> },
  { value: 'Gift', component: <Gift /> },
  { value: 'VideoIcon', component: <VideoIcon /> },
  { value: 'Share2', component: <Share2 /> },
  { value: 'Smile', component: <Smile /> },
  { value: 'Headphones', component: <Headphones /> },
  { value: 'Monitor', component: <Monitor /> },
  { value: 'Smartphone', component: <Smartphone /> },
  { value: 'Mail', component: <Mail /> },
  { value: 'AlignJustify', component: <AlignJustify /> },
  { value: 'Activity', component: <Activity /> },
  { value: 'Flag', component: <Flag /> },
  { value: 'Rss', component: <Rss /> },
  { value: 'CheckCircle', component: <CheckCircle /> },
  { value: 'PenTool', component: <PenTool /> },
  { value: 'Image', component: <Image /> },
  { value: 'Mic', component: <Mic /> },
  { value: 'Music', component: <Music /> },
  { value: 'Layers', component: <Layers /> },
  { value: 'Code', component: <Code /> }
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
      { value: "Headphones", label: "Headphones", icon: <Headphones className="h-4 w-4" /> }
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
      { value: "MessageSquare", label: "Message", icon: <MessageSquare className="h-4 w-4" /> }
    ]
  },
  {
    category: "Achievements",
    icons: [
      { value: "Award", label: "Award", icon: <Award className="h-4 w-4" /> },
      { value: "Trophy", label: "Trophy", icon: <Trophy className="h-4 w-4" /> },
      { value: "Star", label: "Star", icon: <Star className="h-4 w-4" /> },
      { value: "CheckCircle", label: "Verified", icon: <CheckCircle className="h-4 w-4" /> },
      { value: "ThumbsUp", label: "Like", icon: <ThumbsUp className="h-4 w-4" /> }
    ]
  },
  {
    category: "Metrics",
    icons: [
      { value: "Users", label: "Users", icon: <Users className="h-4 w-4" /> },
      { value: "User", label: "User", icon: <User className="h-4 w-4" /> },
      { value: "BarChart", label: "Chart", icon: <BarChart className="h-4 w-4" /> },
      { value: "Activity", label: "Activity", icon: <Activity className="h-4 w-4" /> },
      { value: "Clock", label: "Time", icon: <Clock className="h-4 w-4" /> },
      { value: "Calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> }
    ]
  },
  {
    category: "Other",
    icons: [
      { value: "Heart", label: "Heart", icon: <Heart className="h-4 w-4" /> },
      { value: "Briefcase", label: "Work", icon: <Briefcase className="h-4 w-4" /> },
      { value: "FileText", label: "Document", icon: <FileText className="h-4 w-4" /> },
      { value: "Gift", label: "Gift", icon: <Gift className="h-4 w-4" /> },
      { value: "Smile", label: "Smile", icon: <Smile className="h-4 w-4" /> },
      { value: "Monitor", label: "Monitor", icon: <Monitor className="h-4 w-4" /> },
      { value: "Smartphone", label: "Phone", icon: <Smartphone className="h-4 w-4" /> },
      { value: "Mail", label: "Mail", icon: <Mail className="h-4 w-4" /> },
      { value: "AlignJustify", label: "Menu", icon: <AlignJustify className="h-4 w-4" /> },
      { value: "Flag", label: "Flag", icon: <Flag className="h-4 w-4" /> },
      { value: "Rss", label: "RSS", icon: <Rss className="h-4 w-4" /> },
      { value: "PenTool", label: "Design", icon: <PenTool className="h-4 w-4" /> },
      { value: "Layers", label: "Layers", icon: <Layers className="h-4 w-4" /> },
      { value: "Code", label: "Code", icon: <Code className="h-4 w-4" /> }
    ]
  }
];

export function getIconByName(name?: string, className?: string) {
  const icon = iconOptions.find(icon => icon.value === name);
  if (!icon) return <Award className={className} />;
  
  const IconComponent = icon.component.type;
  return <IconComponent className={className} />;
}

export function getAllIcons() {
  const iconMap: Record<string, React.ReactNode> = {};
  iconOptions.forEach(icon => {
    iconMap[icon.value] = icon.component;
  });
  return iconMap;
}

const IconSelector: React.FC = () => {
  return (
    <>
      {iconOptions.map((icon) => (
        <SelectItem key={icon.value} value={icon.value} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {icon.component}
            <span>{icon.value}</span>
          </div>
        </SelectItem>
      ))}
    </>
  );
};

export default IconSelector;
