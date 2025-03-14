
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
  TikTok,
  FileText,
  MessageSquare,
  Clock,
  Film,
  Calendar,
  Gift,
  Camera2,
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
  { value: 'TikTok', component: <TikTok /> },
  { value: 'FileText', component: <FileText /> },
  { value: 'MessageSquare', component: <MessageSquare /> },
  { value: 'Clock', component: <Clock /> },
  { value: 'Film', component: <Film /> },
  { value: 'Calendar', component: <Calendar /> },
  { value: 'Gift', component: <Gift /> },
  { value: 'Camera2', component: <Camera2 /> },
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

export function getIconByName(name?: string, className?: string) {
  const icon = iconOptions.find(icon => icon.value === name);
  if (!icon) return <Award className={className} />;
  
  const IconComponent = icon.component.type;
  return <IconComponent className={className} />;
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
