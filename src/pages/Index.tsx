import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import Equipment from '@/components/home/Equipment';
import Services from '@/components/home/Services';
import Contact from '@/components/home/Contact';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import { ErrorBoundary } from '@/components/admin/ErrorBoundary';

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

  if (isLoading && isFirstVisit) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <motion.div 
      className="min-h-screen bg-elvis-dark text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <Hero />
      <About />
      <ErrorBoundary componentName="FeaturedProjects">
        <FeaturedProjects />
      </ErrorBoundary>
      <ErrorBoundary componentName="Equipment">
        <Equipment />
      </ErrorBoundary>
      <ErrorBoundary componentName="Services">
        <Services />
      </ErrorBoundary>
      <ErrorBoundary componentName="Contact">
        <Contact />
      </ErrorBoundary>
      <Footer />
    </motion.div>
  );
};

export default Index;
