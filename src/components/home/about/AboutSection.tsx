
import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import AboutStory from './AboutStory';
import SocialStatistics from './SocialStatistics';
import KeyAccomplishments from './KeyAccomplishments';
import ExpertiseSection from './ExpertiseSection';
import SkillsSection from './SkillsSection';
import TestimonialsSection from './TestimonialsSection';
import SocialProfiles from './SocialProfiles';
import SectionHeading from '@/components/ui/about/SectionHeading';

const AboutSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });
  
  return (
    <div ref={ref} className="container mx-auto px-4 py-16 space-y-24">
      <div>
        <SectionHeading 
          title="About Elvis Creative" 
          subtitle="Professional videographer with over 8 years of experience"
          centered={true}
          accent="pink"
          className="mb-16"
        />
        
        <AboutStory />
      </div>
      
      <SocialStatistics />
      
      <KeyAccomplishments />
      
      <ExpertiseSection />
      
      <SkillsSection />
      
      <TestimonialsSection />
      
      <SocialProfiles />
    </div>
  );
};

export default AboutSection;
