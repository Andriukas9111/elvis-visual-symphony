
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutSection from '@/components/about/AboutSection';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default About;
