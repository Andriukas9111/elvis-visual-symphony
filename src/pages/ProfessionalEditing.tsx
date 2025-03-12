
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ProfessionalEditing = () => {
  return (
    <motion.div 
      className="min-h-screen bg-elvis-dark text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Professional Editing Services
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/80 mb-6">
                Transform your raw footage into polished, professional content with our expert editing services.
                We combine technical expertise with creative vision to deliver exceptional results.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 mt-8">Our Editing Services</h2>
              
              <div className="grid gap-6 mb-8">
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Video Editing</h3>
                  <p className="text-white/70">
                    Professional video editing including cutting, transitions, effects, and sound design
                    to create engaging content.
                  </p>
                </div>
                
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Color Grading</h3>
                  <p className="text-white/70">
                    Expert color correction and grading to enhance the visual appeal and maintain 
                    consistency across your content.
                  </p>
                </div>
                
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Motion Graphics</h3>
                  <p className="text-white/70">
                    Custom motion graphics and animations to add dynamic elements to your videos.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Editing Specialties</h2>
              <ul className="list-disc pl-6 space-y-2 text-white/70">
                <li>Commercial Video Editing</li>
                <li>Social Media Content</li>
                <li>Music Video Editing</li>
                <li>Documentary Editing</li>
                <li>Corporate Video Editing</li>
                <li>Wedding Video Editing</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default ProfessionalEditing;
