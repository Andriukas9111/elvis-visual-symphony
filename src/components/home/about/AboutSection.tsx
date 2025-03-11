
import React from 'react';
import { useInView } from 'react-intersection-observer';
import AboutProfile from './AboutProfile';
import AboutStory from './AboutStory';
import AccomplishmentsDisplay from './AccomplishmentsDisplay';
import SocialStatisticsGrid from './SocialStatisticsGrid';
import TestimonialsSection from './TestimonialsSection';
import TechnicalSkillsGrid from './TechnicalSkillsGrid';
import KeyAccomplishments from './KeyAccomplishments';
import ConnectWithMe from './ConnectWithMe';

const AboutSection: React.FC = () => {
  // Create separate ref and inView state for each section for better control
  const { ref: profileRef, inView: profileInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: storyRef, inView: storyInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: keyAccomplishmentsRef, inView: keyAccomplishmentsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: skillsRef, inView: skillsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: accomplishmentsRef, inView: accomplishmentsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: connectRef, inView: connectInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <div className="bg-elvis-dark text-white py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile and Story section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <div ref={profileRef} className="lg:col-span-4">
            <AboutProfile isInView={profileInView} />
          </div>
          
          <div ref={storyRef} className="lg:col-span-8">
            <AboutStory isInView={storyInView} />
          </div>
        </div>
        
        {/* Key Accomplishments section */}
        <div ref={keyAccomplishmentsRef} className="mb-24">
          <KeyAccomplishments isInView={keyAccomplishmentsInView} />
        </div>
        
        {/* Social Statistics section */}
        <div ref={statsRef} className="mb-24">
          <SocialStatisticsGrid isInView={statsInView} />
        </div>
        
        {/* Technical Skills section */}
        <div ref={skillsRef} className="mb-24">
          <div className="flex items-center mb-8">
            <div className="w-1 h-6 bg-purple-500 mr-3"></div>
            <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
          </div>
          <TechnicalSkillsGrid isInView={skillsInView} />
        </div>
        
        {/* Accomplishments section */}
        <div ref={accomplishmentsRef} className="mb-24">
          <AccomplishmentsDisplay isInView={accomplishmentsInView} />
        </div>
        
        {/* Connect With Me section */}
        <div ref={connectRef} className="mb-24">
          <ConnectWithMe isInView={connectInView} />
        </div>
        
        {/* Testimonials section */}
        <div ref={testimonialsRef}>
          <TestimonialsSection isInView={testimonialsInView} />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
