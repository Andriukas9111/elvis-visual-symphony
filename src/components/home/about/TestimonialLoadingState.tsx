
import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialLoadingStateProps {
  isInView: boolean;
}

const TestimonialLoadingState: React.FC<TestimonialLoadingStateProps> = ({ isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex items-center mb-8">
        <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
        <h3 className="text-3xl font-bold">What Clients Say</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="glass-card p-5 rounded-xl border border-white/10 animate-pulse">
            <div className="h-8 w-8 bg-elvis-pink/30 rounded-full mb-3"></div>
            <div className="h-24 bg-white/10 rounded mb-4"></div>
            <div className="mt-auto space-y-2">
              <div className="h-5 bg-white/20 rounded w-2/3"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TestimonialLoadingState;
