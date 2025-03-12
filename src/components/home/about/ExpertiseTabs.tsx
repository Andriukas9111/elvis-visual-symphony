
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useExpertise } from '@/hooks/api/useExpertise';
import TechnicalSkillsTab from './TechnicalSkillsTab';
import { 
  Film, 
  Briefcase, 
  Wrench, 
  Camera, 
  Edit, 
  Video,
  Pencil,
  Palette, 
  PenTool
} from 'lucide-react';

interface ExpertiseTabsProps {
  isInView: boolean;
}

const ExpertiseTabs: React.FC<ExpertiseTabsProps> = ({ isInView }) => {
  const [activeTab, setActiveTab] = useState('expertise');
  const { data: expertiseData, isLoading } = useExpertise();

  // Filter data by type
  const expertiseItems = expertiseData?.filter(item => item.type === 'expertise') || [];
  const projectItems = expertiseData?.filter(item => item.type === 'project') || [];

  // Default items if none found in database
  const defaultExpertise = [
    {
      id: '1',
      type: 'expertise',
      icon_name: 'Film',
      label: 'Cinematic Storytelling',
      description: 'Bringing visuals to life with a unique creative approach.'
    },
    {
      id: '2',
      type: 'expertise',
      icon_name: 'Camera',
      label: 'Dynamic Camera Work',
      description: 'Capturing smooth, high-energy, and engaging shots.'
    },
    {
      id: '3',
      type: 'expertise',
      icon_name: 'Edit',
      label: 'Expert Video Editing & Colour Grading',
      description: 'Ensuring every frame looks its best.'
    }
  ];

  // Get icon based on name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Film':
        return <Film className="h-6 w-6" />;
      case 'Camera':
        return <Camera className="h-6 w-6" />;
      case 'Edit':
        return <Edit className="h-6 w-6" />;
      case 'Video':
        return <Video className="h-6 w-6" />;
      case 'Pencil':
        return <Pencil className="h-6 w-6" />;
      case 'Palette':
        return <Palette className="h-6 w-6" />;
      case 'PenTool':
        return <PenTool className="h-6 w-6" />;
      default:
        return <Film className="h-6 w-6" />;
    }
  };

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h3 className="text-3xl font-bold mb-3">My Expertise</h3>
        <p className="text-white/70 max-w-2xl mx-auto">
          Delivering exceptional visual storytelling through my specialized skills and experience
        </p>
      </motion.div>
      
      <div className="bg-elvis-medium/20 backdrop-blur-sm rounded-xl p-6 border border-white/5">
        <div className="flex flex-col md:flex-row">
          {/* Side Navigation Tabs */}
          <div className="md:w-1/4 mb-4 md:mb-0 md:border-r md:border-white/10 md:pr-4">
            <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
              <button
                onClick={() => setActiveTab('expertise')}
                className={`flex items-center p-3 w-full text-left rounded-lg transition-colors ${
                  activeTab === 'expertise' 
                    ? 'bg-elvis-pink text-white' 
                    : 'hover:bg-white/5'
                }`}
              >
                <Film className="mr-2 h-5 w-5" />
                <span>Expertise</span>
              </button>
              
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center p-3 w-full text-left rounded-lg transition-colors ${
                  activeTab === 'projects' 
                    ? 'bg-elvis-pink text-white' 
                    : 'hover:bg-white/5'
                }`}
              >
                <Briefcase className="mr-2 h-5 w-5" />
                <span>Project Types</span>
              </button>
              
              <button
                onClick={() => setActiveTab('skills')}
                className={`flex items-center p-3 w-full text-left rounded-lg transition-colors ${
                  activeTab === 'skills' 
                    ? 'bg-elvis-pink text-white' 
                    : 'hover:bg-white/5'
                }`}
              >
                <Wrench className="mr-2 h-5 w-5" />
                <span>Technical Skills</span>
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="md:w-3/4 md:pl-6">
            <div className="bg-elvis-dark/50 rounded-lg p-4 min-h-[400px]">
              {/* Expertise Content */}
              {activeTab === 'expertise' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {(expertiseItems.length > 0 ? expertiseItems : defaultExpertise).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-elvis-darker/70 p-4 rounded-lg border border-white/5 hover:border-elvis-pink/30 transition-colors"
                    >
                      <div className="bg-elvis-pink/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                        {getIcon(item.icon_name)}
                      </div>
                      <h4 className="text-white text-lg font-semibold mb-2">{item.label}</h4>
                      <p className="text-white/70 text-sm">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              {/* Projects Content */}
              {activeTab === 'projects' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {projectItems.length > 0 ? (
                    projectItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-elvis-darker/70 p-4 rounded-lg border border-white/5 hover:border-elvis-purple/30 transition-colors"
                      >
                        <div className="bg-elvis-purple/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                          {getIcon(item.icon_name)}
                        </div>
                        <h4 className="text-white text-lg font-semibold mb-2">{item.label}</h4>
                        <p className="text-white/70 text-sm">{item.description}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-white/50">
                      No project types found. Add some in the admin panel.
                    </div>
                  )}
                </motion.div>
              )}
              
              {/* Skills Content */}
              {activeTab === 'skills' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TechnicalSkillsTab isInView={isInView && activeTab === 'skills'} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertiseTabs;
