
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import SectionHeading from '@/components/ui/about/SectionHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExpertise } from '@/hooks/api/useExpertise';
import { Expertise, staggerContainer } from '@/types/about.types';
import ExpertiseCard from '@/components/ui/about/ExpertiseCard';

// Define the interface for the TechnicalSkillsTab component props
interface TechnicalSkillsTabProps {
  isInView?: boolean;
}

// The TechnicalSkillsTab component is a placeholder since we can't access the original
const TechnicalSkillsTab: React.FC<TechnicalSkillsTabProps> = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <p className="text-white/60 col-span-3 text-center">Technical skills coming soon...</p>
    </div>
  );
};

const ExpertiseTabs: React.FC = () => {
  const { data: expertise = [], isLoading } = useExpertise();
  const [activeTab, setActiveTab] = useState('services');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  // Group expertise items by type
  const expertiseByType = React.useMemo(() => {
    const grouped = {
      services: expertise.filter(item => item.type === 'service'),
      skills: expertise.filter(item => item.type === 'skill'),
      tools: expertise.filter(item => item.type === 'tool')
    };
    
    return grouped;
  }, [expertise]);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-elvis-medium/20 h-10 w-48 rounded"></div>
        <div className="bg-elvis-medium/20 h-12 w-full rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-elvis-medium/20 rounded-xl h-48"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // If expertiseByType.services is empty, add some placeholder data
  if (expertiseByType.services.length === 0) {
    expertiseByType.services = [
      {
        id: '1',
        title: 'Commercial Videos',
        description: 'High-quality promotional videos for businesses and products',
        icon_name: 'Video',
        type: 'service',
        label: 'Commercial',
        category: 'videography',
        is_featured: true,
        sort_order: 1,
        created_at: '',
        updated_at: ''
      },
      {
        id: '2',
        title: 'Wedding Videography',
        description: 'Capturing your special day with cinematic storytelling',
        icon_name: 'Heart',
        type: 'service',
        label: 'Weddings',
        category: 'videography',
        is_featured: true,
        sort_order: 2,
        created_at: '',
        updated_at: ''
      },
      {
        id: '3',
        title: 'Documentary Films',
        description: 'Compelling visual storytelling for documentaries and interviews',
        icon_name: 'Film',
        type: 'service',
        label: 'Documentary',
        category: 'videography',
        is_featured: true,
        sort_order: 3,
        created_at: '',
        updated_at: ''
      }
    ];
  }
  
  return (
    <div ref={ref} className="space-y-6">
      <SectionHeading 
        title="My Expertise" 
        subtitle="Services and skills to bring your vision to life"
        accent="pink"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-8">
          <TabsTrigger value="services" className="text-base">
            Services
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-base">
            Technical Skills
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-base">
            Equipment
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="mt-0">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {expertiseByType.services.map((service, index) => (
              <ExpertiseCard
                key={service.id}
                expertise={service}
                index={index}
              />
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-0">
          <TechnicalSkillsTab isInView={isInView} />
        </TabsContent>
        
        <TabsContent value="tools" className="mt-0">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {expertiseByType.tools.length > 0 ? (
              expertiseByType.tools.map((tool, index) => (
                <ExpertiseCard
                  key={tool.id}
                  expertise={tool}
                  index={index}
                />
              ))
            ) : (
              <p className="text-white/60 col-span-3 text-center">No equipment data available</p>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpertiseTabs;
