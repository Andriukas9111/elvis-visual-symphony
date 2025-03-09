
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Film, Music, Video, Users, FileQuestion } from 'lucide-react';
import { FormData, ProjectType } from './HireMeForm';
import Card3D from './Card3D';

interface ProjectTypeStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
}

interface ProjectOption {
  type: ProjectType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const projectOptions: ProjectOption[] = [
  {
    type: 'event',
    label: 'Event Coverage',
    icon: <Camera className="w-10 h-10 text-elvis-pink" />,
    description: 'Professional coverage of conferences, parties, or special events'
  },
  {
    type: 'commercial',
    label: 'Commercial',
    icon: <Film className="w-10 h-10 text-elvis-pink" />,
    description: 'Advertisements, product videos, and promotional content'
  },
  {
    type: 'wedding',
    label: 'Wedding',
    icon: <Users className="w-10 h-10 text-elvis-pink" />,
    description: 'Cinematic wedding films and engagement videos'
  },
  {
    type: 'music',
    label: 'Music Video',
    icon: <Music className="w-10 h-10 text-elvis-pink" />,
    description: 'Creative music videos for artists and bands'
  },
  {
    type: 'documentary',
    label: 'Documentary',
    icon: <Video className="w-10 h-10 text-elvis-pink" />,
    description: 'Documentary-style storytelling and interviews'
  },
  {
    type: 'other',
    label: 'Other',
    icon: <FileQuestion className="w-10 h-10 text-elvis-pink" />,
    description: 'Something else? Let me know what you have in mind'
  }
];

const ProjectTypeStep: React.FC<ProjectTypeStepProps> = ({ 
  formData, 
  updateFormData, 
  nextStep 
}) => {
  const handleSelectProjectType = (projectType: ProjectType) => {
    updateFormData({ projectType });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-white">What type of project do you have in mind?</h3>
      <p className="text-gray-400">Select the option that best describes your project</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {projectOptions.map((option) => (
          <Card3D key={option.type} onClick={() => handleSelectProjectType(option.type)}>
            <div 
              className={`p-6 h-full flex flex-col cursor-pointer ${
                formData.projectType === option.type ? 'bg-elvis-purple/30' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 aperture-indicator">
                  {option.icon}
                </div>
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold text-white mb-1">{option.label}</h4>
                  <p className="text-sm text-gray-400">{option.description}</p>
                </div>
                {formData.projectType === option.type && (
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-elvis-pink flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card3D>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        <motion.button
          className={`btn-primary px-8 py-3 rounded-full font-medium ${
            !formData.projectType ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={nextStep}
          disabled={!formData.projectType}
          whileHover={{ scale: formData.projectType ? 1.05 : 1 }}
          whileTap={{ scale: formData.projectType ? 0.95 : 1 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProjectTypeStep;
