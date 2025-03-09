
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type PasswordStrengthProps = {
  password: string;
};

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'very-strong';

const PasswordStrengthMeter = ({ password }: PasswordStrengthProps) => {
  const [strength, setStrength] = useState<{
    level: StrengthLevel;
    score: number;
    label: string;
    color: string;
  }>({
    level: 'weak',
    score: 0,
    label: 'Weak',
    color: '#ef4444', // red
  });

  useEffect(() => {
    // Calculate password strength
    const calculateStrength = () => {
      // Start with a basic score
      let score = 0;
      
      // Add points for length
      if (password.length >= 8) score += 1;
      if (password.length >= 12) score += 1;
      
      // Add points for complexity
      if (/[A-Z]/.test(password)) score += 1; // Has uppercase
      if (/[a-z]/.test(password)) score += 1; // Has lowercase
      if (/[0-9]/.test(password)) score += 1; // Has number
      if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
      
      // Determine strength level
      let strengthLevel: StrengthLevel;
      let label: string;
      let color: string;
      
      if (score <= 2) {
        strengthLevel = 'weak';
        label = 'Weak';
        color = '#ef4444'; // red
      } else if (score <= 4) {
        strengthLevel = 'medium';
        label = 'Medium';
        color = '#eab308'; // yellow
      } else if (score <= 5) {
        strengthLevel = 'strong';
        label = 'Strong';
        color = '#22c55e'; // green
      } else {
        strengthLevel = 'very-strong';
        label = 'Very Strong';
        color = '#10b981'; // emerald
      }
      
      setStrength({
        level: strengthLevel,
        score: Math.min(score, 6), // Cap at 6
        label,
        color
      });
    };
    
    calculateStrength();
  }, [password]);

  const segments = [1, 2, 3, 4, 5, 6];
  const filledSegments = strength.score;

  return (
    <div className="mt-2 mb-1">
      <div className="flex gap-1 mb-1">
        {segments.map((segment, index) => (
          <motion.div 
            key={segment}
            className="h-1 flex-1 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
          >
            {index < filledSegments && (
              <motion.div
                className="h-full w-full"
                style={{ backgroundColor: strength.color }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              />
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: strength.color }}
          className="font-medium"
        >
          {strength.label}
        </motion.p>
        
        <p className="text-white/40">Use 8+ characters with letters, numbers & symbols</p>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
