
import React from 'react';
import {
  Film,
  Camera,
  Scissors,
  Cast,
  Video,
  Tv,
  Users,
  Trophy,
  Star,
  Calendar,
  CheckCircle,
  Image,
  Briefcase,
  Package,
  Clock,
  LucideProps
} from 'lucide-react';

interface IconRendererProps {
  iconName: string;
  size?: number;
}

const IconRenderer: React.FC<IconRendererProps> = ({ iconName, size = 20 }) => {
  const iconProps: LucideProps = {
    size,
    className: "text-white"
  };

  // Map of icon names to Lucide components
  const iconMap: Record<string, React.ReactNode> = {
    'lucide-film': <Film {...iconProps} />,
    'lucide-camera': <Camera {...iconProps} />,
    'lucide-scissors': <Scissors {...iconProps} />,
    'lucide-cast': <Cast {...iconProps} />,
    'lucide-video': <Video {...iconProps} />,
    'lucide-tv': <Tv {...iconProps} />,
    'lucide-users': <Users {...iconProps} />,
    'lucide-trophy': <Trophy {...iconProps} />,
    'lucide-star': <Star {...iconProps} />,
    'lucide-calendar': <Calendar {...iconProps} />,
    'lucide-check-circle': <CheckCircle {...iconProps} />,
    'lucide-image': <Image {...iconProps} />,
    'lucide-briefcase': <Briefcase {...iconProps} />,
    'lucide-package': <Package {...iconProps} />,
    'lucide-clock': <Clock {...iconProps} />
  };

  // Return the requested icon or a placeholder if not found
  return <>{iconMap[iconName] || iconName}</>;
};

export default IconRenderer;
