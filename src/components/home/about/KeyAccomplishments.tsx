
import React from 'react';
import { useAccomplishments } from '@/hooks/api/useAccomplishments';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AccomplishmentCard } from './AccomplishmentCard';

const KeyAccomplishments = () => {
  const { data: accomplishments, isLoading } = useAccomplishments();
  const [ref, inView] = useInView({ triggerOnce: true });

  if (isLoading) return null;

  return (
    <div className="container mx-auto px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Key Accomplishments</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Highlighting my achievements and milestones throughout my professional journey
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {accomplishments?.map((accomplishment, index) => (
          <motion.div
            key={accomplishment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <AccomplishmentCard accomplishment={accomplishment} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KeyAccomplishments;
