
import React from 'react';
import AboutSection from './about/AboutSection';
import { ErrorBoundary } from '../admin/ErrorBoundary';
import SocialStatistics from './about/SocialStatistics';

const About = () => {
  return (
    <div id="about-section" className="relative">
      <ErrorBoundary componentName="AboutSection">
        <AboutSection />
      </ErrorBoundary>
      <div className="container mx-auto px-4 py-16">
        <ErrorBoundary componentName="SocialStatistics">
          <SocialStatistics tab="social" />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default About;
