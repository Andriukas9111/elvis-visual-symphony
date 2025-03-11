
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Portfolio = () => {
  return (
    <motion.div 
      className="min-h-screen bg-elvis-dark text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      
      <main className="container mx-auto px-4 py-24 mt-12">
        <h1 className="text-4xl font-bold mb-8">Portfolio</h1>
        <p className="text-lg text-white/70">
          Coming soon! Our portfolio section is under construction.
        </p>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Portfolio;
