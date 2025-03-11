
import React from 'react';
import { motion } from 'framer-motion';
import { useAccomplishments } from '@/hooks/api/useAccomplishments';
import { Award } from 'lucide-react';

interface KeyAccomplishmentsProps {
  isInView: boolean;
}

const KeyAccomplishments: React.FC<KeyAccomplishmentsProps> = ({ isInView }) => {
  const { data: accomplishments, isLoading } = useAccomplishments();

  // Use accomplishments from database or fallback to empty array
  const displayAccomplishments = accomplishments || [];

  const bgColors = [
    'from-purple-900 to-purple-800',
    'from-blue-900 to-blue-800',
    'from-green-900 to-green-800',
    'from-amber-900 to-amber-800',
    'from-rose-900 to-rose-800'
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Key Accomplishments
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayAccomplishments.map((acc, index) => (
          <motion.div
            key={acc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-gradient-to-br ${bgColors[index % bgColors.length]} rounded-xl p-5 flex flex-col items-center text-center h-full`}
          >
            <div className="bg-black/20 p-3 rounded-full mb-3">
              {acc.icon ? (
                <img src={acc.icon} alt="" className="w-6 h-6" />
              ) : (
                <Award className="w-6 h-6 text-white" />
              )}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {acc.value}{acc.suffix || ''}
            </h3>
            <p className="text-white/80 text-sm">{acc.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KeyAccomplishments;
