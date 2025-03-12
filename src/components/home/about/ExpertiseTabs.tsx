
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useExpertise } from '@/hooks/api/useExpertise';
import { useStats, StatItem } from '@/hooks/api/useStats';
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
  PenTool,
  Tv,
  Monitor,
  Sliders
} from 'lucide-react';

interface ExpertiseTabsProps {
  isInView: boolean;
}

// Define base category interface
interface BaseCategory {
  title: string;
  icon: React.ReactNode;
  description: string;
  stats?: StatItem[];
}

// Define standard category interface
interface StandardCategory extends BaseCategory {
  software?: string[];
  equipment?: string[];
  specialties?: string[];
  workflow?: string[];
}

// Define technical category interface
interface TechnicalCategory extends BaseCategory {
  component: React.ReactNode;
}

// Define categories type
type CategoryType = {
  [key: string]: StandardCategory | TechnicalCategory;
};

const ExpertiseTabs: React.FC<ExpertiseTabsProps> = ({ isInView }) => {
  const [activeTab, setActiveTab] = useState('videography');
  const { data: expertiseData, isLoading } = useExpertise();
  const { data: statsData } = useStats();

  // Helper function to check if category is a standard category
  const isStandardCategory = (category: StandardCategory | TechnicalCategory): category is StandardCategory => {
    return !('component' in category);
  };

  // Categories with their detailed information
  const categories: CategoryType = {
    videography: {
      title: 'Videography',
      icon: <Film className="h-6 w-6" />,
      description: 'Professional videography services with attention to detail and creative storytelling.',
      software: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro X', 'Adobe After Effects'],
      equipment: ['Sony FX6', 'DJI Ronin Gimbal', 'Aputure 600d', 'Sennheiser Wireless Mics'],
      specialties: ['Cinematic Storytelling', 'Commercial Production', 'Event Coverage', 'Motion Graphics'],
      stats: statsData?.filter(stat => stat.tab === 'videography' || !stat.tab) || []
    },
    photography: {
      title: 'Photography',
      icon: <Camera className="h-6 w-6" />,
      description: 'Capturing moments with artistic composition and technical excellence.',
      software: ['Adobe Lightroom', 'Adobe Photoshop', 'Capture One Pro', 'DxO PhotoLab'],
      equipment: ['Sony Alpha 7R IV', 'Canon EOS R5', 'Professional Prime Lenses', 'Godox Lighting Kit'],
      specialties: ['Portrait Photography', 'Product Photography', 'Landscape Photography', 'Event Photography'],
      stats: statsData?.filter(stat => stat.tab === 'photography' || !stat.tab) || []
    },
    editing: {
      title: 'Post-Production',
      icon: <Edit className="h-6 w-6" />,
      description: 'Professional editing services that elevate your visual content to the highest quality.',
      software: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Adobe After Effects', 'Adobe Audition'],
      specialties: ['Color Grading', 'Sound Design', 'Motion Graphics', 'Visual Effects'],
      workflow: ['Rough Cut', 'Fine Cut', 'Color Grading', 'Sound Design', 'Final Delivery'],
      stats: statsData?.filter(stat => stat.tab === 'editing' || !stat.tab) || []
    },
    technical: {
      title: 'Technical Skills',
      icon: <Wrench className="h-6 w-6" />,
      description: 'Comprehensive technical expertise across various specialized areas.',
      component: <TechnicalSkillsTab isInView={isInView && activeTab === 'technical'} />
    }
  };

  // Get expertise items from database if available
  const expertiseItems = expertiseData?.filter(item => item.type === 'expertise') || [];
  const projectItems = expertiseData?.filter(item => item.type === 'project') || [];

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
      case 'Tv':
        return <Tv className="h-6 w-6" />;
      case 'Monitor':
        return <Monitor className="h-6 w-6" />;
      case 'Sliders':
        return <Sliders className="h-6 w-6" />;
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
                onClick={() => setActiveTab('videography')}
                className={`flex items-center p-3 w-full text-left rounded-lg transition-colors ${
                  activeTab === 'videography' 
                    ? 'bg-elvis-pink text-white' 
                    : 'hover:bg-white/5'
                }`}
              >
                <Film className="mr-2 h-5 w-5" />
                <span>Videography</span>
              </button>
              
              <button
                onClick={() => setActiveTab('photography')}
                className={`flex items-center p-3 w-full text-left rounded-lg transition-colors ${
                  activeTab === 'photography' 
                    ? 'bg-elvis-pink text-white' 
                    : 'hover:bg-white/5'
                }`}
              >
                <Camera className="mr-2 h-5 w-5" />
                <span>Photography</span>
              </button>
              
              <button
                onClick={() => setActiveTab('editing')}
                className={`flex items-center p-3 w-full text-left rounded-lg transition-colors ${
                  activeTab === 'editing' 
                    ? 'bg-elvis-pink text-white' 
                    : 'hover:bg-white/5'
                }`}
              >
                <Edit className="mr-2 h-5 w-5" />
                <span>Post-Production</span>
              </button>
              
              <button
                onClick={() => setActiveTab('technical')}
                className={`flex items-center p-3 w-full text-left rounded-lg transition-colors ${
                  activeTab === 'technical' 
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
              {activeTab !== 'technical' && categories[activeTab] && isStandardCategory(categories[activeTab]) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-semibold border-b border-white/10 pb-2">
                    {categories[activeTab].title}
                  </h3>
                  
                  <p className="text-white/80">
                    {categories[activeTab].description}
                  </p>
                  
                  {/* Software Section */}
                  {categories[activeTab].software && (
                    <div className="mt-4">
                      <h4 className="text-lg font-medium mb-2 flex items-center">
                        <Monitor className="h-4 w-4 mr-2 text-elvis-pink" />
                        Software
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categories[activeTab].software?.map((software, index) => (
                          <div key={index} className="bg-elvis-medium/30 rounded p-2 text-sm">
                            {software}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Equipment Section */}
                  {categories[activeTab].equipment && (
                    <div className="mt-4">
                      <h4 className="text-lg font-medium mb-2 flex items-center">
                        <Camera className="h-4 w-4 mr-2 text-elvis-pink" />
                        Equipment
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categories[activeTab].equipment?.map((equipment, index) => (
                          <div key={index} className="bg-elvis-medium/30 rounded p-2 text-sm">
                            {equipment}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Specialties Section */}
                  {categories[activeTab].specialties && (
                    <div className="mt-4">
                      <h4 className="text-lg font-medium mb-2 flex items-center">
                        <Palette className="h-4 w-4 mr-2 text-elvis-pink" />
                        Specialties
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categories[activeTab].specialties?.map((specialty, index) => (
                          <div key={index} className="bg-elvis-medium/30 rounded p-2 text-sm">
                            {specialty}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Workflow Section */}
                  {categories[activeTab].workflow && (
                    <div className="mt-4">
                      <h4 className="text-lg font-medium mb-2 flex items-center">
                        <PenTool className="h-4 w-4 mr-2 text-elvis-pink" />
                        Workflow
                      </h4>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        {categories[activeTab].workflow?.map((step, index) => (
                          <li key={index} className="text-white/80">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  {/* Stats Section */}
                  {categories[activeTab].stats && categories[activeTab].stats.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-medium mb-3 flex items-center">
                        <Sliders className="h-4 w-4 mr-2 text-elvis-pink" />
                        Statistics
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {categories[activeTab].stats.slice(0, 4).map((stat) => (
                          <div key={stat.id} className="bg-elvis-medium/30 rounded-lg p-3 flex items-center">
                            <div className="bg-elvis-pink/20 p-2 rounded-lg mr-3">
                              {getIcon(stat.icon_name)}
                            </div>
                            <div>
                              <div className="text-xl font-bold">{stat.value}{stat.suffix}</div>
                              <div className="text-xs text-white/70">{stat.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              
              {/* Technical Skills Tab */}
              {activeTab === 'technical' && !isStandardCategory(categories[activeTab]) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-semibold border-b border-white/10 pb-2 mb-4">
                    {categories[activeTab].title}
                  </h3>
                  {categories[activeTab].component}
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
