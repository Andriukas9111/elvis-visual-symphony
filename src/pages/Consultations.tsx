
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Consultations = () => {
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
              Professional Consultations
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/80 mb-6">
                Get expert guidance for your video and photography projects. Our consultation services
                help you plan and execute your creative vision effectively.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 mt-8">Consultation Services</h2>
              
              <div className="grid gap-6 mb-8">
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Project Planning</h3>
                  <p className="text-white/70">
                    Comprehensive project planning including concept development, budgeting, 
                    and timeline creation.
                  </p>
                </div>
                
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Technical Consultation</h3>
                  <p className="text-white/70">
                    Expert advice on equipment selection, technical requirements, and best practices
                    for your specific needs.
                  </p>
                </div>
                
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Production Strategy</h3>
                  <p className="text-white/70">
                    Strategic guidance on production approaches, creative direction, and content optimization.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Areas of Expertise</h2>
              <ul className="list-disc pl-6 space-y-2 text-white/70">
                <li>Video Production Planning</li>
                <li>Photography Project Strategy</li>
                <li>Equipment Recommendations</li>
                <li>Post-Production Workflow</li>
                <li>Content Strategy</li>
                <li>Technical Training</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Consultations;
