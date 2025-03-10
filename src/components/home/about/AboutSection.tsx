
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useContent } from '@/hooks/api/useContent';
import AboutHeader from './AboutHeader';
import AboutMeSection from './AboutMeSection';
import StatisticsSection from './StatisticsSection';
import EnhancedExpertiseContainer from './EnhancedExpertiseContainer';
import AccomplishmentsDisplay from './AccomplishmentsDisplay';

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const [ready, setReady] = useState(false);
  
  const { data: contentData, isLoading } = useContent('about');
  
  // Prepare data
  const aboutData = React.useMemo(() => {
    if (!contentData || contentData.length === 0) {
      return {
        title: 'About Me',
        subtitle: 'Professional videographer with over 8 years of experience',
        content: ''
      };
    }
    
    const title = contentData.find(item => item.title)?.title || 'About Me';
    const subtitle = contentData.find(item => item.subtitle)?.subtitle || 'Professional videographer with over 8 years of experience';
    const content = contentData.find(item => item.content)?.content || '';
    
    return { title, subtitle, content };
  }, [contentData]);
  
  useEffect(() => {
    // Small delay to ensure animations run properly
    const timer = setTimeout(() => {
      setReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div ref={ref} className="pt-20 pb-28 min-h-screen z-20 relative">
      <div className="container mx-auto px-4">
        <AboutHeader 
          title={aboutData.title} 
          subtitle={aboutData.subtitle} 
          isInView={isInView && ready} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Column 1: About content */}
          <div className="md:col-span-2">
            <AboutMeSection 
              content={aboutData.content}
              isLoading={isLoading}
              isInView={isInView && ready} 
            />
            <AccomplishmentsDisplay isInView={isInView && ready} />
          </div>
          
          {/* Column 2: Statistics */}
          <div className="md:col-span-1">
            <StatisticsSection isInView={isInView && ready} />
          </div>
        </div>
        
        {/* Expertise, Projects and Skills */}
        <div className="mt-16">
          <EnhancedExpertiseContainer isInView={isInView && ready} />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
