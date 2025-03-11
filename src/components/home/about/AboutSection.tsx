
import React, { useRef } from 'react';
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
  const { ref: aboutRef, inView: aboutInView } = useInView({
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

  const { ref: keyAccomplishmentsRef, inView: keyAccomplishmentsInView } = useInView({
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
        <div ref={aboutRef}>
          <AboutProfile isInView={aboutInView} />
          <AboutStory isInView={aboutInView} />
        </div>

        <div ref={keyAccomplishmentsRef} className="mt-20">
          <KeyAccomplishments isInView={keyAccomplishmentsInView} />
        </div>

        <div ref={statsRef} className="mt-20">
          <SocialStatisticsGrid isInView={statsInView} />
        </div>

        <div ref={skillsRef} className="mt-20">
          <TechnicalSkillsGrid isInView={skillsInView} />
        </div>

        <div ref={accomplishmentsRef} className="mt-20">
          <AccomplishmentsDisplay isInView={accomplishmentsInView} />
        </div>

        <div ref={connectRef} className="mt-20">
          <ConnectWithMe isInView={connectInView} />
        </div>

        <div ref={testimonialsRef} className="mt-20">
          <TestimonialsSection isInView={testimonialsInView} />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
