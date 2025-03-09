
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PortfolioPreview from '@/components/portfolio/PortfolioPreview';
import WhyHireMe from '@/components/WhyHireMe';
import HireMeForm from '@/components/hire-me/HireMeForm';
import About from '@/components/About';
import ShopTeaser from '@/components/ShopTeaser';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/layout/AnimatedSection';
import { useAnimation } from '@/contexts/AnimationContext';

const Index = () => {
  const { isFirstVisit, isLoading, setIsLoading } = useAnimation();
  const [showContent, setShowContent] = useState(!isFirstVisit);

  useEffect(() => {
    // Only show loading on first visit
    if (!isFirstVisit) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, [isFirstVisit, setIsLoading]);

  const handleLoadingComplete = () => {
    setShowContent(true);
  };

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
          
          {/* Hero section without animation wrapper for custom animations */}
          <Hero />
          
          {/* Using our new PortfolioPreview component */}
          <PortfolioPreview />
          
          {/* Why Hire Me and Hire Me Form in one section */}
          <section id="hire-section" className="relative bg-gradient-to-b from-elvis-darker to-elvis-dark py-24">
            <div className="absolute inset-0 bg-grid opacity-10"></div>
            
            {/* Why Hire Me */}
            <WhyHireMe />
            
            {/* Hire Me Form */}
            <HireMeForm />
          </section>
          
          <AnimatedSection variant="fadeInUp" delay={0.2}>
            <About />
          </AnimatedSection>
          
          <AnimatedSection variant="fadeInUp" delay={0.3}>
            <ShopTeaser />
          </AnimatedSection>
          
          <AnimatedSection variant="fadeIn" delay={0.3}>
            <Footer />
          </AnimatedSection>
        </motion.div>
      )}
    </>
  );
};

export default Index;
