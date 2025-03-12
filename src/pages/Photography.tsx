
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Photography = () => {
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
              Photography Services
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/80 mb-6">
                Capture your moments with professional photography services. Whether it's a commercial shoot,
                event coverage, or portrait session, we deliver exceptional quality photos that tell your story.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 mt-8">Photography Specialties</h2>
              
              <div className="grid gap-6 mb-8">
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Commercial Photography</h3>
                  <p className="text-white/70">
                    Product photography, corporate headshots, and promotional material that showcases 
                    your brand in the best light.
                  </p>
                </div>
                
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Event Photography</h3>
                  <p className="text-white/70">
                    Professional coverage of corporate events, conferences, weddings, and special occasions.
                  </p>
                </div>
                
                <div className="bg-elvis-medium/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Portrait Photography</h3>
                  <p className="text-white/70">
                    Professional portraits for individuals, families, and corporate teams.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Equipment & Expertise</h2>
              <ul className="list-disc pl-6 space-y-2 text-white/70">
                <li>Professional DSLR and Mirrorless Cameras</li>
                <li>Wide Range of Professional Lenses</li>
                <li>Studio Lighting Equipment</li>
                <li>Advanced Post-Processing</li>
                <li>High-Resolution Deliverables</li>
                <li>Quick Turnaround Times</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Photography;
