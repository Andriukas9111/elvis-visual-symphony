
import React from 'react';
import { motion } from 'framer-motion';
import { useSocialProfiles } from '@/hooks/api/useSocialProfiles';
import SocialProfileCard from '@/components/ui/about/SocialProfileCard';
import SectionHeading from '@/components/ui/about/SectionHeading';
import { staggerContainer, fadeInUpVariant } from '@/types/about.types';

const SocialProfiles: React.FC = () => {
  const { data: profiles = [], isLoading } = useSocialProfiles();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-elvis-medium/20 h-10 w-48 rounded"></div>
        <div className="bg-elvis-medium/20 h-6 w-full rounded mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-elvis-medium/20 rounded-xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // If no profiles, show placeholder message
  if (profiles.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHeading 
          title="Connect With Me" 
          subtitle="Find me on social media and other platforms"
          accent="blue"
        />
        <div className="text-center py-10">
          <p className="text-white/60">Social profiles coming soon...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <SectionHeading 
        title="Connect With Me" 
        subtitle="Find me on social media and other platforms"
        accent="blue"
      />
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {profiles.map((profile, index) => (
          <SocialProfileCard
            key={profile.id}
            profile={profile}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default SocialProfiles;
