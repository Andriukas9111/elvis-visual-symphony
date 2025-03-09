
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

type FloatingLabelInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
};

const FloatingLabelInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  icon,
  error,
  className = ''
}: FloatingLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const isActive = isFocused || value !== '';

  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            bg-white/5 border ${error ? 'border-red-500' : isFocused ? 'border-violet-400' : 'border-white/10'} text-white w-full rounded-md
            h-14 px-3 ${icon ? 'pl-10' : 'pl-3'} pt-6 pb-2 peer transition-colors
            focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400
            disabled:opacity-70 disabled:cursor-not-allowed ${className}
          `}
          disabled={disabled}
          required={required}
        />
        
        <motion.label
          htmlFor={id}
          className={`
            absolute text-white/60 left-0 ${icon ? 'ml-10' : 'ml-3'}
            transform transition-all duration-200 pointer-events-none
            ${isActive ? 'text-xs top-2' : 'text-base top-1/2 -translate-y-1/2'}
            ${error ? 'text-red-400' : isFocused ? 'text-violet-400' : ''}
          `}
        >
          {label}{required && !isActive && '*'}
        </motion.label>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 text-red-400 text-xs mt-1 ml-1"
          >
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingLabelInput;
