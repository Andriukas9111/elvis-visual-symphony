
import React from 'react';
import AboutSection from './about/AboutSection';
import { ErrorBoundary } from '../admin/ErrorBoundary';

const About = () => {
  return (
    <div id="about-section" className="relative">
      <ErrorBoundary componentName="AboutSection">
        <AboutSection />
      </ErrorBoundary>
    </div>
  );
};

export default About;
