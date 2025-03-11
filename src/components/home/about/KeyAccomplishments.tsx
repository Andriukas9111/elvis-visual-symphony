
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import SectionHeading from '@/components/ui/about/SectionHeading';
import { staggerContainer, fadeInUpVariant } from '@/types/about.types';

const KeyAccomplishments: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  // Sample accomplishments data (would come from the database in a real implementation)
  const accomplishments = [
    {
      id: '1',
      title: '10+ Years Experience',
      description: 'Over a decade of professional videography experience across multiple industries and project types.',
      icon: '📹'
    },
    {
      id: '2',
      title: '500+ Projects Completed',
      description: 'Successfully delivered hundreds of video projects for clients ranging from small businesses to major corporations.',
      icon: '🏆'
    },
    {
      id: '3',
      title: 'Award-Winning Work',
      description: 'Recognized with multiple industry awards for exceptional videography and storytelling.',
      icon: '🌟'
    }
  ];
  
  return (
    <div ref={ref} className="space-y-6">
      <SectionHeading 
        title="Key Accomplishments" 
        subtitle="Milestones and achievements throughout my videography career"
        accent="purple"
      />
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {accomplishments.map((item, index) => (
          <motion.div
            key={item.id}
            variants={fadeInUpVariant}
            custom={index}
            className="bg-gradient-to-br from-elvis-darker to-elvis-dark/60 p-6 rounded-xl border border-elvis-medium/20 shadow-md"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-white/70">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default KeyAccomplishments;
