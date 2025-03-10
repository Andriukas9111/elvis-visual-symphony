
import React from 'react';
import { motion } from 'framer-motion';

interface ProfileImageProps {
  isInView: boolean;
}

const ProfileImage = ({ isInView }: ProfileImageProps) => {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-elvis-purple/40 rounded-lg -z-10"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-elvis-pink/40 rounded-lg -z-10"></div>
        
        {/* Main photo */}
        <div className="rounded-xl overflow-hidden shadow-xl relative">
          <div className="absolute inset-0 bg-elvis-gradient opacity-10 z-10"></div>
          <img 
            src="/lovable-uploads/4b1271b8-e1a8-494f-a510-e17f286adf45.png" 
            alt="Elvis with camera equipment" 
            className="w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          
          {/* Photo overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-elvis-dark/90 via-transparent to-transparent z-20"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-elvis-pink rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white/80">Videographer & Cinematographer</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileImage;
