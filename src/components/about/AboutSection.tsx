
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import AboutHeader from './AboutHeader';
import SocialStatsSection from './SocialStatsSection';
import MyStorySection from './MyStorySection';
import AccomplishmentsSection from './AccomplishmentsSection';
import ExpertiseSection from './ExpertiseSection';
import ConnectSection from './ConnectSection';
import FeaturedProjectsSection from './FeaturedProjectsSection';
import TestimonialsSection from './TestimonialsSection';

interface AboutSectionSettings {
  id: string;
  section_name: string;
  title: string;
  subtitle?: string;
  is_visible: boolean;
  order_index: number;
}

interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
}

const AboutSection: React.FC = () => {
  const { data: settings } = useQuery({
    queryKey: ['aboutSectionSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_section_settings')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as AboutSectionSettings[];
    }
  });
  
  const { data: content } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('title, subtitle')
        .limit(1)
        .single();
        
      if (error) throw error;
      return data as AboutContent;
    }
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Function to determine visibility of a section
  const isSectionVisible = (sectionName: string): boolean => {
    if (!settings) return true; // Show by default if settings not loaded
    const section = settings.find(s => s.section_name === sectionName);
    return section ? section.is_visible : true;
  };
  
  // Function to get ordered sections
  const getOrderedSections = () => {
    if (!settings) return [
      'social_stats',
      'my_story',
      'accomplishments',
      'expertise',
      'connect',
      'featured_projects',
      'testimonials'
    ];
    
    return settings
      .filter(s => s.is_visible)
      .sort((a, b) => {
        if (a.order_index === null) return 1;
        if (b.order_index === null) return -1;
        return a.order_index - b.order_index;
      })
      .map(s => s.section_name);
  };
  
  // Component map for rendering sections
  const sectionComponents: Record<string, React.ReactNode> = {
    'social_stats': <SocialStatsSection />,
    'my_story': <MyStorySection />,
    'accomplishments': <AccomplishmentsSection />,
    'expertise': <ExpertiseSection />,
    'connect': <ConnectSection />,
    'featured_projects': <FeaturedProjectsSection />,
    'testimonials': <TestimonialsSection />
  };
  
  return (
    <div className="bg-elvis-dark text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {content && (
          <AboutHeader 
            title={content.title || "About Elvis Creative"} 
            subtitle={content.subtitle || ""} 
          />
        )}
        
        {getOrderedSections().map(sectionName => (
          <React.Fragment key={sectionName}>
            {sectionComponents[sectionName]}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AboutSection;
