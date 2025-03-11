
import React from 'react';
import { motion } from 'framer-motion';
import { TechnicalSkillData } from './types';

export interface TechnicalSkillCardProps {
  data: TechnicalSkillData;
}

const TechnicalSkillCard: React.FC<TechnicalSkillCardProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-elvis-dark-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{data.category}</h3>
        
        <div className="mt-4 space-y-4">
          {data.proficiency && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-elvis-light">Proficiency</span>
                <span className="text-sm text-elvis-pink">{data.proficiency}%</span>
              </div>
              <div className="h-2 bg-elvis-dark-tertiary rounded-full">
                <div
                  className="h-2 bg-gradient-to-r from-elvis-pink to-elvis-purple rounded-full"
                  style={{ width: `${data.proficiency}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {data.skills && data.skills.length > 0 && (
            <div>
              <h4 className="text-elvis-light text-sm mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-elvis-dark-tertiary text-elvis-light text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TechnicalSkillCard;
