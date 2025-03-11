
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutHeader from '@/components/about/AboutHeader';
import SocialStatsSection from '@/components/about/SocialStatsSection';
import MyStorySection from '@/components/about/MyStorySection';
import AccomplishmentsSection from '@/components/about/AccomplishmentsSection';
import ExpertiseSection from '@/components/about/ExpertiseSection';
import ConnectSection from '@/components/about/ConnectSection';
import FeaturedProjectsSection from '@/components/about/FeaturedProjectsSection';
import TestimonialsSection from '@/components/about/TestimonialsSection';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <AboutHeader 
          title="About Elvis Creative" 
          subtitle="Crafting Visual Stories That Inspire" 
        />
        <SocialStatsSection />
        <MyStorySection />
        <AccomplishmentsSection />
        <ExpertiseSection />
        <ConnectSection />
        <FeaturedProjectsSection />
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
