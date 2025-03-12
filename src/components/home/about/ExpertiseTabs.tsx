
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useExpertise } from '@/hooks/api/useExpertise';
import { useStats, StatItem } from '@/hooks/api/useStats';
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
  Monitor,
  LucideIcon,
  Code,
  Laptop,
  Smartphone
} from 'lucide-react';

interface ExpertiseTabsProps {
  isInView: boolean;
}

// Define base category interface
interface BaseCategory {
  title: string;
  icon: React.ReactNode;
  description: string;
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
  skills: {
    category: string;
    icon: React.ReactNode;
    items: string[];
  }[];
}

// Define categories type
type CategoryType = {
  [key: string]: StandardCategory | TechnicalCategory;
};

const ExpertiseTabs: React.FC<ExpertiseTabsProps> = ({ isInView }) => {
  const [activeTab, setActiveTab] = useState('videography');
  const { data: expertiseData, isLoading } = useExpertise();

  // Helper function to check if category is a technical category
  const isTechnicalCategory = (category: StandardCategory | TechnicalCategory): category is TechnicalCategory => {
    return 'skills' in category;
  };

  // Categories with their detailed information
  const categories: CategoryType = {
    videography: {
      title: 'Videography',
      icon: <Film className="h-6 w-6" />,
      description: 'Professional videography services with attention to detail and creative storytelling. I specialize in creating high-quality visual content that captures the essence of your brand or story.',
      software: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro X', 'Adobe After Effects'],
      equipment: ['Sony FX6', 'DJI Ronin Gimbal', 'Aputure 600d', 'Sennheiser Wireless Mics'],
      specialties: ['Cinematic Storytelling', 'Commercial Production', 'Event Coverage', 'Motion Graphics'],
    },
    photography: {
      title: 'Photography',
      icon: <Camera className="h-6 w-6" />,
      description: 'Capturing moments with artistic composition and technical excellence. My photography services range from portraits and events to product photography, always with an eye for detail and quality.',
      software: ['Adobe Lightroom', 'Adobe Photoshop', 'Capture One Pro', 'DxO PhotoLab'],
      equipment: ['Sony Alpha 7R IV', 'Canon EOS R5', 'Professional Prime Lenses', 'Godox Lighting Kit'],
      specialties: ['Portrait Photography', 'Product Photography', 'Landscape Photography', 'Event Photography'],
    },
    editing: {
      title: 'Post-Production',
      icon: <Edit className="h-6 w-6" />,
      description: 'Professional editing services that elevate your visual content to the highest quality. I transform raw footage into polished, professional content that stands out and engages your audience.',
      software: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Adobe After Effects', 'Adobe Audition'],
      specialties: ['Color Grading', 'Sound Design', 'Motion Graphics', 'Visual Effects'],
      workflow: ['Rough Cut', 'Fine Cut', 'Color Grading', 'Sound Design', 'Final Delivery'],
    },
    technical: {
      title: 'Technical Skills',
      icon: <Wrench className="h-6 w-6" />,
      description: 'Comprehensive technical expertise across various specialized areas. I bring a diverse set of technical skills to every project, ensuring the highest quality results.',
      skills: [
        {
          category: 'Photography',
          icon: <Camera className="h-5 w-5" />,
          items: ['Portrait Photography', 'Landscape Photography', 'Studio Lighting', 'Photo Editing']
        },
        {
          category: 'Videography',
          icon: <Video className="h-5 w-5" />,
          items: ['Cinematic Filming', 'Video Editing', 'Color Grading', 'Aerial Videography']
        },
        {
          category: 'Software',
          icon: <Laptop className="h-5 w-5" />,
          items: ['Adobe Photoshop', 'Adobe Premiere Pro', 'Adobe Lightroom', 'Final Cut Pro', 'DaVinci Resolve']
        },
        {
          category: 'Web & Mobile',
          icon: <Smartphone className="h-5 w-5" />,
          items: ['Responsive Design', 'Content Creation', 'UI/UX Understanding', 'Social Media Integration']
        }
      ]
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
      case 'Monitor':
        return <Monitor className="h-6 w-6" />;
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
      
      <div className="bg-elvis-medium/20 backdrop-blur-sm rounded-xl p-6 border border-white/5 shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Side Navigation Tabs */}
          <div className="md:w-1/4 mb-4 md:mb-0 md:border-r md:border-white/10 md:pr-4">
            <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
              <button
                onClick={() => setActiveTab('videography')}
                className={`flex items-center p-3 w-full text-left rounded-lg transition-all ${
                  activeTab === 'videography' 
                    ? 'bg-elvis-pink text-white shadow-md scale-105' 
                    : 'hover:bg-white/5'
                }`}
              >
                <Film className="mr-2 h-5 w-5" />
                <span>Videography</span>
              </button>
              
              <button
                onClick={() => setActiveTab('photography')}
                className={`flex items-center p-3 w-full text-left rounded-lg transition-all ${
                  activeTab === 'photography' 
                    ? 'bg-elvis-pink text-white shadow-md scale-105' 
                    : 'hover:bg-white/5'
                }`}
              >
                <Camera className="mr-2 h-5 w-5" />
                <span>Photography</span>
              </button>
              
              <button
                onClick={() => setActiveTab('editing')}
                className={`flex items-center p-3 w-full text-left rounded-lg transition-all ${
                  activeTab === 'editing' 
                    ? 'bg-elvis-pink text-white shadow-md scale-105' 
                    : 'hover:bg-white/5'
                }`}
              >
                <Edit className="mr-2 h-5 w-5" />
                <span>Post-Production</span>
              </button>
              
              <button
                onClick={() => setActiveTab('technical')}
                className={`flex items-center p-3 w-full text-left rounded-lg transition-all ${
                  activeTab === 'technical' 
                    ? 'bg-elvis-pink text-white shadow-md scale-105' 
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
            <div className="bg-elvis-dark/50 rounded-lg p-6 shadow-inner min-h-[400px]">
              {!isTechnicalCategory(categories[activeTab]) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-elvis-pink/20 p-3 rounded-full">
                      {categories[activeTab].icon}
                    </div>
                    <h3 className="text-2xl font-semibold">
                      {categories[activeTab].title}
                    </h3>
                  </div>
                  
                  <p className="text-white/80 text-lg leading-relaxed border-l-2 border-elvis-pink/40 pl-4 italic">
                    {categories[activeTab].description}
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Software Section */}
                    {(categories[activeTab] as StandardCategory).software && (
                      <div className="bg-elvis-medium/30 rounded-xl p-5 backdrop-blur-sm shadow-md transform transition-all hover:scale-102">
                        <h4 className="text-lg font-medium mb-3 flex items-center text-elvis-pink">
                          <Monitor className="h-5 w-5 mr-2" />
                          Software
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(categories[activeTab] as StandardCategory).software?.map((software, index) => (
                            <div key={index} className="bg-elvis-dark/40 rounded-lg p-3 text-sm flex items-center">
                              <div className="w-2 h-2 bg-elvis-pink rounded-full mr-2"></div>
                              {software}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Equipment Section */}
                    {(categories[activeTab] as StandardCategory).equipment && (
                      <div className="bg-elvis-medium/30 rounded-xl p-5 backdrop-blur-sm shadow-md transform transition-all hover:scale-102">
                        <h4 className="text-lg font-medium mb-3 flex items-center text-elvis-pink">
                          <Camera className="h-5 w-5 mr-2" />
                          Equipment
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(categories[activeTab] as StandardCategory).equipment?.map((equipment, index) => (
                            <div key={index} className="bg-elvis-dark/40 rounded-lg p-3 text-sm flex items-center">
                              <div className="w-2 h-2 bg-elvis-pink rounded-full mr-2"></div>
                              {equipment}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Specialties Section */}
                    {(categories[activeTab] as StandardCategory).specialties && (
                      <div className="bg-elvis-medium/30 rounded-xl p-5 backdrop-blur-sm shadow-md transform transition-all hover:scale-102">
                        <h4 className="text-lg font-medium mb-3 flex items-center text-elvis-pink">
                          <Palette className="h-5 w-5 mr-2" />
                          Specialties
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(categories[activeTab] as StandardCategory).specialties?.map((specialty, index) => (
                            <div key={index} className="bg-elvis-dark/40 rounded-lg p-3 text-sm flex items-center">
                              <div className="w-2 h-2 bg-elvis-pink rounded-full mr-2"></div>
                              {specialty}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Workflow Section */}
                    {(categories[activeTab] as StandardCategory).workflow && (
                      <div className="bg-elvis-medium/30 rounded-xl p-5 backdrop-blur-sm shadow-md transform transition-all hover:scale-102">
                        <h4 className="text-lg font-medium mb-3 flex items-center text-elvis-pink">
                          <PenTool className="h-5 w-5 mr-2" />
                          Workflow
                        </h4>
                        <ol className="space-y-2">
                          {(categories[activeTab] as StandardCategory).workflow?.map((step, index) => (
                            <li key={index} className="bg-elvis-dark/40 rounded-lg p-3 text-sm flex items-center">
                              <span className="w-5 h-5 rounded-full bg-elvis-pink/20 flex items-center justify-center mr-3 text-xs">{index + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Technical Skills Tab */}
              {isTechnicalCategory(categories[activeTab]) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-elvis-pink/20 p-3 rounded-full">
                      {categories[activeTab].icon}
                    </div>
                    <h3 className="text-2xl font-semibold">
                      {categories[activeTab].title}
                    </h3>
                  </div>
                  
                  <p className="text-white/80 text-lg leading-relaxed border-l-2 border-elvis-pink/40 pl-4 italic mb-6">
                    {categories[activeTab].description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(categories[activeTab] as TechnicalCategory).skills.map((skillGroup, groupIndex) => (
                      <motion.div
                        key={skillGroup.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
                        className="bg-elvis-medium/30 p-5 rounded-xl border border-white/5 shadow-md"
                      >
                        <div className="flex items-center mb-4">
                          <div className="bg-elvis-pink/20 p-2.5 rounded-lg mr-3">
                            {skillGroup.icon}
                          </div>
                          <h4 className="text-xl font-medium">{skillGroup.category}</h4>
                        </div>
                        
                        <div className="space-y-2">
                          {skillGroup.items.map((skill, index) => (
                            <div 
                              key={`${groupIndex}-${index}`}
                              className="bg-elvis-dark/40 rounded-lg p-3 flex items-center transform transition-all hover:translate-x-1"
                            >
                              <div className="w-2 h-2 bg-elvis-pink rounded-full mr-2"></div>
                              <span className="text-white/90">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
