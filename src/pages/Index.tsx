
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAnimation } from '@/contexts/AnimationContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import Equipment from '@/components/home/Equipment';
import Services from '@/components/home/Services';
import Contact from '@/components/home/Contact';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const { isFirstVisit, isLoading, setIsLoading } = useAnimation();
  const [showContent, setShowContent] = useState(!isFirstVisit);

  useEffect(() => {
    if (!isFirstVisit) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, [isFirstVisit, setIsLoading]);

  const handleLoadingComplete = () => {
    setShowContent(true);
  };

  // Scroll to contact section if URL has #contact hash
  useEffect(() => {
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Small delay to ensure content is rendered
    }
  }, [showContent]);

  return (
    <>
      {isLoading && isFirstVisit && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}

      {showContent && (
        <motion.div 
          className="min-h-screen bg-elvis-dark text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar />
          <Hero />
          <FeaturedProjects />
          <Equipment />
          <Services />
          <Contact />
          <Footer />
        </motion.div>
      )}
    </>
  );
};

export default Index;
