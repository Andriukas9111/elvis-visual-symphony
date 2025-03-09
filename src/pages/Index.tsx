
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PortfolioPreview from '@/components/portfolio/PortfolioPreview';
import HireMeForm from '@/components/hire-me/HireMeForm';
import About from '@/components/About';
import ShopTeaser from '@/components/ShopTeaser';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import EquipmentShowcase from '@/components/EquipmentShowcase';
import ContactSection from '@/components/ContactSection';

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
          
          {/* About section - proper section formatting */}
          <section id="about" className="py-20 bg-elvis-darker relative overflow-hidden">
            <div className="container mx-auto px-4">
              <About />
            </div>
          </section>
          
          {/* Portfolio Preview section */}
          <PortfolioPreview />
          
          {/* Equipment Showcase section - proper section formatting */}
          <section id="equipment" className="py-20 bg-elvis-medium relative overflow-hidden">
            <div className="container mx-auto px-4">
              <EquipmentShowcase />
            </div>
          </section>
          
          {/* Hire Me section with form */}
          <section id="hire-section" className="py-20 relative bg-gradient-to-b from-elvis-darker to-elvis-dark">
            <div className="absolute inset-0 bg-grid opacity-10"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-elvis-pink/10 blur-3xl"></div>
            <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-elvis-purple/10 blur-3xl"></div>
            
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-gradient mb-4">Work With Me</h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  Ready to turn your vision into reality? Let's collaborate and create something amazing together.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left side - Why Hire Me content */}
                <div className="space-y-6">
                  <h3 className="text-heading-3 mb-6">Why Choose Me</h3>
                  
                  <div className="space-y-4">
                    <div className="glass-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-elvis-pink/20 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-elvis-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold mb-2">Professional Quality</h4>
                          <p className="text-gray-300">Industry-standard equipment and techniques for cinema-quality results.</p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-elvis-pink/20 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-elvis-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold mb-2">Timely Delivery</h4>
                          <p className="text-gray-300">I respect deadlines and keep you updated throughout the process.</p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-elvis-pink/20 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-elvis-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold mb-2">Creative Vision</h4>
                          <p className="text-gray-300">Unique artistic approach that captures your story authentically.</p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-elvis-pink/20 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-elvis-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold mb-2">Client Collaboration</h4>
                          <p className="text-gray-300">I work closely with you to bring your ideas to life exactly as you envision.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border border-elvis-pink/20 rounded-xl bg-elvis-darker/50">
                    <blockquote className="text-lg italic text-gray-300">
                      "Elvis created exactly the video I needed for my business launch. Professional, creative, and delivered on time!"
                      <footer className="mt-2 text-elvis-pink font-medium">— Sarah Johnson, CEO of StyleFusion</footer>
                    </blockquote>
                  </div>
                </div>
                
                {/* Right side - Contact form */}
                <div className="glass-card p-8">
                  <h3 className="text-heading-3 mb-4">Let's Work Together</h3>
                  <p className="text-gray-300 mb-6">
                    Fill out the form below to tell me about your project, and I'll get back to you within 48 hours.
                  </p>
                  
                  {/* HireMeForm component */}
                  <HireMeForm />
                </div>
              </div>
            </div>
          </section>
          
          {/* Contact Section - proper section formatting */}
          <section id="contact" className="py-20 bg-elvis-darker relative overflow-hidden">
            <div className="container mx-auto px-4">
              <ContactSection />
            </div>
          </section>
          
          {/* Shop Teaser section - proper section formatting */}
          <section id="shop-teaser" className="py-20 bg-elvis-medium relative overflow-hidden">
            <div className="container mx-auto px-4">
              <ShopTeaser />
            </div>
          </section>
          
          {/* Footer */}
          <Footer />
        </motion.div>
      )}
    </>
  );
};

export default Index;
