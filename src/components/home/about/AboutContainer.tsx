
import React from 'react';
import { useSectionSettings } from '@/hooks/api/useSectionSettings';
import AboutHeader from './AboutHeader';
import SocialStatistics from './SocialStatistics';
import AboutStory from './AboutStory';
import KeyAccomplishments from './KeyAccomplishments';
import ExpertiseTabs from './ExpertiseTabs';
import SocialConnect from './SocialConnect';

const AboutContainer = () => {
  const { settings, isLoading } = useSectionSettings();

  if (isLoading) {
    return <div className="animate-pulse h-screen bg-gradient-to-b from-elvis-dark to-elvis-dark/90"></div>;
  }

  return (
    <div className="py-16 space-y-20">
      <AboutHeader />
      
      {settings?.find(section => section.section_name === 'socialStats')?.is_visible && (
        <SocialStatistics />
      )}
      
      {settings?.find(section => section.section_name === 'aboutStory')?.is_visible && (
        <AboutStory />
      )}
      
      {settings?.find(section => section.section_name === 'accomplishments')?.is_visible && (
        <KeyAccomplishments />
      )}
      
      {settings?.find(section => section.section_name === 'expertise')?.is_visible && (
        <ExpertiseTabs />
      )}
      
      {settings?.find(section => section.section_name === 'socialConnect')?.is_visible && (
        <SocialConnect />
      )}
    </div>
  );
};

export default AboutContainer;
