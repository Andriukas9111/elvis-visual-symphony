
import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PortfolioSection from '@/components/PortfolioSection';
import About from '@/components/About';
import ShopTeaser from '@/components/ShopTeaser';
import DesignSystemShowcase from '@/components/DesignSystemShowcase';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/layout/AnimatedSection';
import useGSAP from '@/hooks/use-gsap';

const Index = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Use GSAP for page transitions
  useGSAP(pageRef, {
    animation: {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }
  });

  return (
    <motion.div 
      ref={pageRef}
      className="min-h-screen bg-elvis-dark text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      
      <AnimatedSection variant="fadeIn" delay={0.2}>
        <Hero />
      </AnimatedSection>
      
      <AnimatedSection variant="fadeInUp" delay={0.3}>
        <PortfolioSection />
      </AnimatedSection>
      
      <AnimatedSection variant="fadeInUp" delay={0.2}>
        <DesignSystemShowcase />
      </AnimatedSection>
      
      <AnimatedSection variant="fadeInUp" delay={0.3}>
        <About />
      </AnimatedSection>
      
      <AnimatedSection variant="fadeInUp" delay={0.2}>
        <ShopTeaser />
      </AnimatedSection>
      
      <AnimatedSection variant="fadeIn" delay={0.3}>
        <Footer />
      </AnimatedSection>
    </motion.div>
  );
};

export default Index;
