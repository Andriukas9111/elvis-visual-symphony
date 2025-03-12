
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const VideoProduction = () => {
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
              Video Production Services
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/80 mb-6">
                Professional video production services tailored to your needs. From concept to final delivery, 
                we ensure your vision comes to life with stunning visual quality.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 mt-8">Our Video Production Process</h2>
              
              <div className="grid gap-6 mb-8">
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Pre-Production</h3>
                  <p className="text-white/70">
                    Comprehensive planning including script development, storyboarding, location scouting, 
                    and production scheduling.
                  </p>
                </div>
                
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Production</h3>
                  <p className="text-white/70">
                    Professional filming with state-of-the-art equipment, expert cinematography, 
                    and direction to capture your vision perfectly.
                  </p>
                </div>
                
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Post-Production</h3>
                  <p className="text-white/70">
                    Detailed editing, color grading, sound design, and visual effects to create 
                    a polished final product.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Types of Video Production</h2>
              <ul className="list-disc pl-6 space-y-2 text-white/70">
                <li>Corporate Videos</li>
                <li>Commercial Production</li>
                <li>Music Videos</li>
                <li>Event Coverage</li>
                <li>Documentary Production</li>
                <li>Social Media Content</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default VideoProduction;
