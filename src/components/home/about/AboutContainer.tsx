
import React from 'react';
import { useSectionSettings } from '@/hooks/api/useSectionSettings';
import AboutHeader from './AboutHeader';
import SocialStatistics from './SocialStatistics';
import AboutStory from './AboutStory';
import KeyAccomplishments from './KeyAccomplishments';
import ExpertiseTabs from './ExpertiseTabs';
import SocialConnect from './SocialConnect';

const AboutContainer = () => {
  const { data: sectionSettings, isLoading } = useSectionSettings('about');

  if (isLoading) {
    return <div className="animate-pulse h-screen bg-gradient-to-b from-elvis-dark to-elvis-dark/90"></div>;
  }

  return (
    <div className="py-16 space-y-20">
      <AboutHeader />
      
      {sectionSettings?.sections.socialStats.visible && (
        <SocialStatistics />
      )}
      
      {sectionSettings?.sections.aboutStory.visible && (
        <AboutStory />
      )}
      
      {sectionSettings?.sections.accomplishments.visible && (
        <KeyAccomplishments />
      )}
      
      {sectionSettings?.sections.expertise.visible && (
        <ExpertiseTabs />
      )}
      
      {sectionSettings?.sections.socialConnect.visible && (
        <SocialConnect />
      )}
    </div>
  );
};

export default AboutContainer;
