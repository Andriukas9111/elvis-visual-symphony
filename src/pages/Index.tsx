
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PortfolioSection from '@/components/PortfolioSection';
import About from '@/components/About';
import ShopTeaser from '@/components/ShopTeaser';
import DesignSystemShowcase from '@/components/DesignSystemShowcase';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Index = () => {
  // Initialize section animations
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.section-animate');
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
          section.classList.add('animate-in');
        }
      });
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-elvis-dark text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <Hero />
      <PortfolioSection />
      <DesignSystemShowcase />
      <About />
      <ShopTeaser />
      <Footer />
    </motion.div>
  );
};

export default Index;
