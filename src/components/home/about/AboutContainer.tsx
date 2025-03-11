
import React from 'react';
import { useSectionSettings } from '@/hooks/api/useSectionSettings';
import AboutHeader from './AboutHeader';
import SocialStatistics from './SocialStatistics';
import AboutStory from './AboutStory';
import KeyAccomplishments from './KeyAccomplishments';

const AboutContainer = () => {
  const { settings, isLoading } = useSectionSettings();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isVisible = (sectionName: string) => 
    settings?.find(s => s.section_name === sectionName)?.is_visible ?? true;

  return (
    <div className="space-y-24 py-16">
      {isVisible('header') && <AboutHeader />}
      {isVisible('social-stats') && <SocialStatistics />}
      {isVisible('story') && <AboutStory />}
      {isVisible('accomplishments') && <KeyAccomplishments />}
    </div>
  );
};

export default AboutContainer;
