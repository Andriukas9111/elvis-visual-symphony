
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
          
          {/* Hero section */}
          <Hero />
          
          {/* Portfolio Preview section */}
          <AnimatedSection variant="fadeInUp">
            <PortfolioPreview />
          </AnimatedSection>
          
          {/* About section */}
          <AnimatedSection variant="fadeInUp" delay={0.2}>
            <About />
          </AnimatedSection>
          
          {/* Combined "Why Hire Me" and "Hire Me Form" section */}
          <section id="hire-section" className="relative bg-gradient-to-b from-elvis-darker to-elvis-dark py-24">
            <div className="absolute inset-0 bg-grid opacity-10"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-elvis-pink/10 blur-3xl"></div>
            <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-elvis-purple/10 blur-3xl"></div>
            
            <div className="container mx-auto px-4">
              <AnimatedSection variant="fadeInUp" className="text-center mb-16">
                <h2 className="text-gradient mb-4">Hire Me</h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  Ready to bring your vision to life? Here's why you should work with me and how to get started.
                </p>
              </AnimatedSection>
              
              {/* WhyHireMe component */}
              <AnimatedSection variant="fadeInUp" delay={0.1}>
                <WhyHireMe />
              </AnimatedSection>
              
              {/* Form section */}
              <AnimatedSection variant="fadeInUp" delay={0.2} className="mt-20 text-center mb-12">
                <h3 className="text-heading-3 mb-4">Let's Work Together</h3>
                <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
                  Fill out the form below to tell me about your project, and I'll get back to you within 48 hours.
                </p>
                
                {/* HireMeForm component */}
                <div className="max-w-3xl mx-auto">
                  <HireMeForm />
                </div>
              </AnimatedSection>
            </div>
          </section>
          
          {/* Shop Teaser section */}
          <AnimatedSection variant="fadeInUp" delay={0.3}>
            <ShopTeaser />
          </AnimatedSection>
          
          {/* Footer */}
          <AnimatedSection variant="fadeIn" delay={0.3}>
            <Footer />
          </AnimatedSection>
        </motion.div>
      )}
    </>
  );
};

export default Index;
