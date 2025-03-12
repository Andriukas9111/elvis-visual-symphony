
import React from 'react';
import { motion } from 'framer-motion';

interface AboutProfileProps {
  isInView: boolean;
}

const AboutProfile = ({ isInView }: AboutProfileProps) => {
  return (
    <div>
      {/* Profile Image */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="relative perspective-container group">
          {/* Decorative elements */}
          <motion.div 
            className="absolute -top-5 -left-5 w-28 h-28 border-2 border-elvis-purple/40 rounded-lg -z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          ></motion.div>
          <motion.div 
            className="absolute -bottom-5 -right-5 w-36 h-36 border-2 border-elvis-pink/40 rounded-lg -z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          ></motion.div>
          
          {/* Main photo */}
          <div className="rounded-xl overflow-hidden shadow-xl relative transform-3d hover-rotate-y group cursor-pointer">
            <div className="absolute inset-0 bg-elvis-gradient opacity-10 z-10 transition-opacity duration-300 group-hover:opacity-20"></div>
            <img 
              src="/lovable-uploads/4b1271b8-e1a8-494f-a510-e17f286adf45.png" 
              alt="Elvis with camera equipment" 
              className="w-full object-cover transition-all duration-700 group-hover:scale-105"
            />
            
            {/* Photo overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-elvis-dark/90 via-transparent to-transparent z-20"></div>
            
            {/* Camera aperture overlay */}
            <div className="absolute top-4 right-4 z-30">
              <div className="aperture-indicator w-12 h-12"></div>
            </div>
            
            {/* Photo info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-30 transition-transform duration-300 transform group-hover:translate-y-0">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-elvis-pink rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white/90">Videographer & Cinematographer</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutProfile;
