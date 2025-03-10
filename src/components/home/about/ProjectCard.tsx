
import React from 'react';
import { Camera, Film, Video, Award, Users, Check } from 'lucide-react';
import { ExpertiseItem } from '@/hooks/api/useExpertise';

interface ProjectCardProps {
  project: ExpertiseItem;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Get the appropriate icon based on the icon_name
  const getIcon = () => {
    switch (project.icon_name) {
      case 'Camera':
        return <Camera className="h-6 w-6 text-elvis-pink" strokeWidth={1.5} />;
      case 'Film':
        return <Film className="h-6 w-6 text-elvis-pink" strokeWidth={1.5} />;
      case 'Video':
        return <Video className="h-6 w-6 text-elvis-pink" strokeWidth={1.5} />;
      case 'Award':
        return <Award className="h-6 w-6 text-elvis-pink" strokeWidth={1.5} />;
      case 'Users':
        return <Users className="h-6 w-6 text-elvis-pink" strokeWidth={1.5} />;
      default:
        return <Check className="h-6 w-6 text-elvis-pink" strokeWidth={1.5} />;
    }
  };

  return (
    <div className="bg-elvis-dark/30 border border-white/5 rounded-lg p-4 hover:border-elvis-pink/20 transition-all">
      <div className="flex">
        <div className="flex-shrink-0 mr-4">
          <div className="w-12 h-12 bg-elvis-dark/70 rounded-lg border border-elvis-pink/20 flex items-center justify-center">
            {getIcon()}
          </div>
        </div>
        <div>
          <h4 className="text-xl font-bold text-white mb-1">{project.label}</h4>
          <p className="text-white/70 text-sm">{project.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
