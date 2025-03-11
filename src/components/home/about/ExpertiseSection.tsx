
import React from 'react';
import { motion } from 'framer-motion';
import { useExpertise } from '@/hooks/api/useExpertise';
import ExpertiseCard from '@/components/ui/about/ExpertiseCard';
import SectionHeading from '@/components/ui/about/SectionHeading';
import { staggerContainer } from '@/types/about.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ExpertiseSection: React.FC = () => {
  const { data: expertise = [], isLoading } = useExpertise();
  const [activeTab, setActiveTab] = React.useState('videography');
  
  // Group expertise items by category
  const expertiseByCategory = React.useMemo(() => {
    return expertise.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof expertise>);
  }, [expertise]);
  
  // Get unique categories
  const categories = Object.keys(expertiseByCategory);
  
  if (isLoading) {
    return (
      <div>
        <div className="bg-elvis-medium/20 h-10 w-48 rounded mb-6"></div>
        <div className="bg-elvis-medium/20 h-12 w-full rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-elvis-medium/20 rounded-xl h-48"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // If no categories, use a default one
  if (categories.length === 0) {
    categories.push('videography');
    expertiseByCategory['videography'] = [
      {
        id: '1',
        title: 'Commercial Videography',
        description: 'Professional video production for businesses to showcase products, services, and brand stories.',
        icon_name: 'Video',
        category: 'videography',
        is_featured: true,
        sort_order: 0,
        created_at: '',
        updated_at: ''
      },
      {
        id: '2',
        title: 'Documentary Filmmaking',
        description: 'Authentic storytelling that captures real-life events, interviews, and narratives with cinematic quality.',
        icon_name: 'Film',
        category: 'videography',
        is_featured: true,
        sort_order: 1,
        created_at: '',
        updated_at: ''
      },
      {
        id: '3',
        title: 'Event Coverage',
        description: 'Comprehensive video documentation of corporate events, conferences, weddings, and social gatherings.',
        icon_name: 'Calendar',
        category: 'videography',
        is_featured: true,
        sort_order: 2,
        created_at: '',
        updated_at: ''
      },
      {
        id: '4',
        title: 'Aerial Videography',
        description: 'Breathtaking drone footage that provides unique perspectives and dynamic aerial views of locations and events.',
        icon_name: 'Plane',
        category: 'videography',
        is_featured: true,
        sort_order: 3,
        created_at: '',
        updated_at: ''
      }
    ];
  }

  return (
    <div>
      <SectionHeading 
        title="Areas of Expertise" 
        subtitle="Specialized skills & services tailored for your video production needs"
        accent="pink"
      />
      
      <div className="glass-card p-8 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="mb-8 bg-elvis-dark/50 border border-white/10 p-1">
            {categories.map(category => (
              <TabsTrigger 
                key={category}
                value={category} 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-elvis-pink/20 data-[state=active]:to-elvis-purple/20 data-[state=active]:border-elvis-pink/30 data-[state=active]:border text-lg py-2 px-4"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {expertiseByCategory[category]?.length > 0 ? (
                  expertiseByCategory[category].map((item, index) => (
                    <ExpertiseCard 
                      key={item.id} 
                      expertise={item} 
                      index={index}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 col-span-2">
                    <p className="text-white/60">No expertise data found for this category.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ExpertiseSection;
