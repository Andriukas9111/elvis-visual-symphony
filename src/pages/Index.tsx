
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PortfolioSection from '@/components/PortfolioSection';
import About from '@/components/About';
import ShopTeaser from '@/components/ShopTeaser';
import Footer from '@/components/Footer';

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
    <div className="min-h-screen bg-elvis-dark text-white overflow-hidden">
      <Navbar />
      <Hero />
      <PortfolioSection />
      <About />
      <ShopTeaser />
      <Footer />
    </div>
  );
};

export default Index;
