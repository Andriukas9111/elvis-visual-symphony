
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExpertiseData, ProjectData, TabData, TechnicalSkillData } from './types';
import { tabsData, technicalSkillsData } from './expertiseData';
import ExpertiseCard from './ExpertiseCard';
import ProjectCard from './ProjectCard';
import TechnicalSkillCard from './TechnicalSkillCard';
import { useContent } from '@/hooks/api/useContent';
import { Camera, FilmIcon, Palette, Code, Video, PenTool, Film, Users, PieChart, 
  Target, PictureInPicture, Tv, Sliders } from 'lucide-react';

interface ExpertiseContainerProps {
  isInView: boolean;
}

// Helper function to get icon component by name
const getIconByName = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    Camera: <Camera size={28} />,
    Film: <Film size={28} />,
    Video: <Video size={28} />,
    PenTool: <PenTool size={28} />,
    Palette: <Palette size={28} />,
    Code: <Code size={28} />,
    Users: <Users size={28} />,
    PieChart: <PieChart size={28} />,
    Target: <Target size={28} />,
    PictureInPicture: <PictureInPicture size={28} />,
    Tv: <Tv size={28} />,
    Sliders: <Sliders size={28} />,
    FilmIcon: <FilmIcon size={28} />
  };
  return icons[iconName] || <Film size={28} />;
};

// Default expertise and project data in case database content is not available
const defaultExpertiseData: ExpertiseData[] = [
  {
    id: 1,
    icon: <Camera size={28} />,
    label: "Videography",
    description: "Professional video production for all types of projects."
  },
  {
    id: 2,
    icon: <Film size={28} />,
    label: "Video Editing",
    description: "Post-production editing with industry-standard tools."
  },
  {
    id: 3,
    icon: <Palette size={28} />,
    label: "Color Grading",
    description: "Professional color correction and creative color grading."
  }
];

const defaultProjectsData: ProjectData[] = [
  {
    id: 1,
    title: "Commercial Videos",
    icon: <Video size={28} />,
    description: "Professional videos for businesses and product showcases.",
    stats: { completed: 0, inProgress: 0 }
  },
  {
    id: 2,
    title: "Music Videos",
    icon: <Tv size={28} />,
    description: "Creative visual storytelling for musical artists.",
    stats: { completed: 0, inProgress: 0 }
  },
  {
    id: 3,
    title: "Wedding Films",
    icon: <FilmIcon size={28} />,
    description: "Beautiful cinematic memories of your special day.",
    stats: { completed: 0, inProgress: 0 }
  }
];

const ExpertiseContainer = ({ isInView }: ExpertiseContainerProps) => {
  const [activeTab, setActiveTab] = useState("expertise");
  const { data: contentData, isLoading } = useContent('about');
  const [expertiseItems, setExpertiseItems] = useState<ExpertiseData[]>(defaultExpertiseData);
  const [projectItems, setProjectItems] = useState<ProjectData[]>(defaultProjectsData);

  // Parse database content when available
  useEffect(() => {
    if (contentData) {
      const expertiseContent = contentData.find(item => item.section === 'about' && item.media_url === 'expertise');
      
      if (expertiseContent?.content) {
        try {
          const parsedData = JSON.parse(expertiseContent.content);
          
          if (Array.isArray(parsedData.expertise)) {
            const processedExpertise = parsedData.expertise.map((item: any) => ({
              ...item,
              icon: getIconByName(item.iconName || 'Film')
            }));
            setExpertiseItems(processedExpertise);
          }
          
          if (Array.isArray(parsedData.projects)) {
            const processedProjects = parsedData.projects.map((item: any) => ({
              ...item,
              icon: getIconByName(item.iconName || 'Film'),
              stats: { completed: 0, inProgress: 0 } // Default stats
            }));
            setProjectItems(processedProjects);
          }
        } catch (error) {
          console.error('Error parsing expertise data:', error);
        }
      }
    }
  }, [contentData]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="w-full"
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full flex mb-10 bg-elvis-medium/20 p-1 rounded-lg border border-white/5 backdrop-blur-lg">
          {tabsData.map((tab: TabData) => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id}
              className="flex-1 py-3 data-[state=active]:bg-elvis-gradient data-[state=active]:text-white data-[state=active]:shadow-pink-glow"
            >
              <div className="flex items-center justify-center">
                {tab.icon}
                <span className="ml-2">{tab.title}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <AnimatePresence mode="wait">
          <TabsContent 
            value="expertise" 
            className={`mt-0 ${activeTab === "expertise" ? "block" : "hidden"}`}
          >
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {expertiseItems.map((expertise: ExpertiseData) => (
                <ExpertiseCard key={expertise.id} expertise={expertise} />
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent 
            value="projects" 
            className={`mt-0 ${activeTab === "projects" ? "block" : "hidden"}`}
          >
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {projectItems.map((project: ProjectData) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent 
            value="technical" 
            className={`mt-0 ${activeTab === "technical" ? "block" : "hidden"}`}
          >
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {technicalSkillsData.map((category: TechnicalSkillData) => (
                <TechnicalSkillCard key={category.id} category={category} />
              ))}
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default ExpertiseContainer;
