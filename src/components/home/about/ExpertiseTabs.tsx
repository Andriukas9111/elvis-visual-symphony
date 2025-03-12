
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useExpertise } from '@/hooks/api/useExpertise';
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h3 className="text-3xl font-bold mb-3 text-white">My Expertise</h3>
        <p className="text-white/70 max-w-2xl mx-auto">
          Delivering exceptional visual storytelling through my specialized skills and experience
        </p>
      </motion.div>
      
      <div className="bg-gradient-to-br from-elvis-dark/90 to-elvis-medium/70 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Sidebar Tabs */}
          <div className="md:w-1/4 lg:w-1/5 mb-4 md:mb-0 md:border-r md:border-white/10 md:pr-4 overflow-hidden">
            <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 sticky top-0 pb-2 md:pb-0">
              {Object.keys(categories).map((key) => (
                <motion.button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center p-3 w-full text-left rounded-lg transition-all ${
                    activeTab === key 
                      ? 'bg-gradient-to-r from-elvis-pink to-elvis-purple text-white shadow-lg shadow-elvis-pink/20 font-medium' 
                      : 'hover:bg-white/10 text-white/80'
                  }`}
                >
                  <span className={`flex items-center justify-center rounded-full p-1.5 mr-2 ${
                    activeTab === key 
                      ? 'bg-white/20' 
                      : 'bg-elvis-dark/40'
                  }`}>
                    {categories[key].icon}
                  </span>
                  <span>{categories[key].title}</span>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Content Area */}
          <div className="md:w-3/4 lg:w-4/5 md:pl-6 h-full overflow-hidden">
            <div className="bg-elvis-dark/60 rounded-lg p-6 shadow-inner h-full overflow-y-auto custom-scrollbar">
              {!isTechnicalCategory(categories[activeTab]) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-4 sticky top-0 bg-elvis-dark/95 backdrop-blur-lg p-3 rounded-lg z-10 border-b border-elvis-pink/20">
                    <div className="bg-gradient-to-br from-elvis-pink/30 to-elvis-purple/30 p-3 rounded-full">
                      {categories[activeTab].icon}
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {categories[activeTab].title}
                    </h3>
                  </div>
                  
                  <p className="text-white/80 text-lg leading-relaxed border-l-2 border-elvis-pink/60 pl-4 italic backdrop-blur-sm bg-white/5 p-3 rounded-r-lg">
                    {categories[activeTab].description}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-5 pt-2">
                    {(categories[activeTab] as StandardCategory).software && (
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={0}
                        variants={cardVariants}
                        className="bg-gradient-to-br from-elvis-medium/40 to-elvis-medium/20 rounded-xl p-5 backdrop-blur-sm shadow-md hover:shadow-elvis-pink/10 hover:shadow-lg transition-all border border-white/5"
                      >
                        <h4 className="text-lg font-medium mb-4 flex items-center text-elvis-pink">
                          <Monitor className="h-5 w-5 mr-2" />
                          <span className="bg-gradient-to-r from-elvis-pink to-elvis-purple-400 bg-clip-text text-transparent">Software</span>
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                          {(categories[activeTab] as StandardCategory).software?.map((software, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              className="bg-elvis-dark/70 rounded-lg p-3 text-sm flex items-center hover:bg-elvis-dark/90 transition-colors border border-white/5 shadow-sm hover:translate-x-1 hover:translate-y-[-2px] hover:shadow-md duration-300"
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-elvis-pink to-elvis-purple rounded-full mr-2 animate-pulse"></div>
                              {software}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {(categories[activeTab] as StandardCategory).equipment && (
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={1}
                        variants={cardVariants}
                        className="bg-gradient-to-br from-elvis-medium/40 to-elvis-medium/20 rounded-xl p-5 backdrop-blur-sm shadow-md hover:shadow-elvis-pink/10 hover:shadow-lg transition-all border border-white/5"
                      >
                        <h4 className="text-lg font-medium mb-4 flex items-center text-elvis-pink">
                          <Camera className="h-5 w-5 mr-2" />
                          <span className="bg-gradient-to-r from-elvis-pink to-elvis-purple-400 bg-clip-text text-transparent">Equipment</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(categories[activeTab] as StandardCategory).equipment?.map((equipment, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              className="bg-elvis-dark/70 rounded-lg p-3 text-sm flex items-center hover:bg-elvis-dark/90 transition-colors border border-white/5 shadow-sm hover:translate-x-1 hover:translate-y-[-2px] hover:shadow-md duration-300"
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-elvis-pink to-elvis-purple rounded-full mr-2 animate-pulse"></div>
                              {equipment}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {(categories[activeTab] as StandardCategory).specialties && (
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={2}
                        variants={cardVariants}
                        className="bg-gradient-to-br from-elvis-medium/40 to-elvis-medium/20 rounded-xl p-5 backdrop-blur-sm shadow-md hover:shadow-elvis-pink/10 hover:shadow-lg transition-all border border-white/5"
                      >
                        <h4 className="text-lg font-medium mb-4 flex items-center text-elvis-pink">
                          <Palette className="h-5 w-5 mr-2" />
                          <span className="bg-gradient-to-r from-elvis-pink to-elvis-purple-400 bg-clip-text text-transparent">Specialties</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(categories[activeTab] as StandardCategory).specialties?.map((specialty, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              className="bg-elvis-dark/70 rounded-lg p-3 text-sm flex items-center hover:bg-elvis-dark/90 transition-colors border border-white/5 shadow-sm hover:translate-x-1 hover:translate-y-[-2px] hover:shadow-md duration-300"
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-elvis-pink to-elvis-purple rounded-full mr-2 animate-pulse"></div>
                              {specialty}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {(categories[activeTab] as StandardCategory).workflow && (
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={3}
                        variants={cardVariants}
                        className="bg-gradient-to-br from-elvis-medium/40 to-elvis-medium/20 rounded-xl p-5 backdrop-blur-sm shadow-md hover:shadow-elvis-pink/10 hover:shadow-lg transition-all border border-white/5"
                      >
                        <h4 className="text-lg font-medium mb-4 flex items-center text-elvis-pink">
                          <PenTool className="h-5 w-5 mr-2" />
                          <span className="bg-gradient-to-r from-elvis-pink to-elvis-purple-400 bg-clip-text text-transparent">Workflow</span>
                        </h4>
                        <ol className="space-y-3">
                          {(categories[activeTab] as StandardCategory).workflow?.map((step, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.15, duration: 0.3 }}
                              className="bg-elvis-dark/70 rounded-lg p-3 text-sm flex items-center hover:bg-elvis-dark/90 transition-colors border border-white/5 shadow-sm hover:translate-x-1 hover:translate-y-[-2px] hover:shadow-md duration-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-elvis-pink/20 to-elvis-purple/20 flex items-center justify-center mr-3 text-xs">{index + 1}</span>
                              {step}
                            </motion.li>
                          ))}
                        </ol>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {isTechnicalCategory(categories[activeTab]) && (
                <div>
                  <div className="flex items-center space-x-3 mb-6 sticky top-0 bg-elvis-dark/95 backdrop-blur-lg p-3 rounded-lg z-10 border-b border-elvis-pink/20">
                    <div className="bg-gradient-to-br from-elvis-pink/30 to-elvis-purple/30 p-3 rounded-full">
                      {categories[activeTab].icon}
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {categories[activeTab].title}
                    </h3>
                  </div>
                  
                  <p className="text-white/80 text-lg leading-relaxed border-l-2 border-elvis-pink/60 pl-4 italic backdrop-blur-sm bg-white/5 p-3 rounded-r-lg mb-6">
                    {categories[activeTab].description}
                  </p>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-min"
                  >
                    {(categories[activeTab] as TechnicalCategory).skills.map((skillGroup, groupIndex) => (
                      <motion.div
                        key={skillGroup.category}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={groupIndex}
                        variants={cardVariants}
                        className="bg-gradient-to-br from-elvis-medium/40 to-elvis-medium/20 p-5 rounded-xl border border-white/10 shadow-md hover:shadow-elvis-pink/10 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center mb-4">
                          <div className="bg-gradient-to-r from-elvis-pink/20 to-elvis-purple/20 p-2.5 rounded-lg mr-3">
                            {skillGroup.icon}
                          </div>
                          <h4 className="text-xl font-medium bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{skillGroup.category}</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {skillGroup.items.map((skill, index) => (
                            <motion.div 
                              key={`${groupIndex}-${index}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.08, duration: 0.3 }}
                              whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                              className="bg-elvis-dark/50 rounded-lg p-2.5 flex items-center transform transition-all duration-300 shadow-sm border border-white/5 hover:shadow-md"
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-elvis-pink to-elvis-purple rounded-full mr-2"></div>
                              <span className="text-sm text-white/90">{skill}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(255, 0, 255, 0.3), rgba(176, 38, 255, 0.3));
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(255, 0, 255, 0.5), rgba(176, 38, 255, 0.5));
        }
      `}} />
    </div>
  );
};

export default ExpertiseTabs;
