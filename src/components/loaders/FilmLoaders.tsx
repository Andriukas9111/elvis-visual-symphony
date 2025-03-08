
import React from 'react';

type LoaderProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
};

const sizesMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export const FilmReelLoader: React.FC<LoaderProps> = ({ 
  className = '', 
  size = 'md',
  color = 'currentColor'
}) => {
  return (
    <div className={`${sizesMap[size]} relative ${className}`}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-gray-600 animate-spin-slow" style={{ borderColor: color, opacity: 0.3 }} />
      
      {/* Film holes */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-2 h-2 rounded-full bg-current animate-pulse"
          style={{ 
            color,
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 45}deg) translateY(-150%) translateX(-50%)`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
      
      {/* Center */}
      <div className="absolute inset-0 m-auto w-1/3 h-1/3 rounded-full bg-current animate-pulse" style={{ color }} />
    </div>
  );
};

export const ShutterLoader: React.FC<LoaderProps> = ({ 
  className = '', 
  size = 'md',
  color = 'currentColor'
}) => {
  return (
    <div className={`${sizesMap[size]} relative ${className}`}>
      {/* Shutter blades */}
      {[...Array(6)].map((_, i) => (
        <div 
          key={i}
          className="absolute origin-bottom-center w-1/4 h-1/2 bg-current"
          style={{ 
            color,
            top: 0,
            left: '50%',
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${i * 60}deg)`,
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
            animation: 'shutter-open-close 2s infinite',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes shutter-open-close {
          0%, 100% { transform: translateX(-50%) rotate(${0}deg) scale(0.5); }
          50% { transform: translateX(-50%) rotate(${60}deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

export const LoadingDots: React.FC<LoaderProps> = ({ 
  className = '', 
  size = 'md',
  color = 'currentColor'
}) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          className={`rounded-full bg-current ${size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'}`}
          style={{ 
            color,
            animation: 'loading-dot 1.4s infinite ease-in-out',
            animationDelay: `${i * 0.16}s`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes loading-dot {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
