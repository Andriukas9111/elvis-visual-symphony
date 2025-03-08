
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type TransitionType = 'fade' | 'wipe' | 'iris' | 'zoom' | 'slide';

type VideoTransitionProps = {
  children: React.ReactNode;
  type?: TransitionType;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  duration?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  trigger?: boolean;
};

export const VideoTransition: React.FC<VideoTransitionProps> = ({
  children,
  type = 'fade',
  direction = 'left',
  duration = 0.8,
  delay = 0,
  className = '',
  onComplete,
  trigger = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (!trigger) return;
    
    setIsAnimating(true);
    
    const animationTimeout = setTimeout(() => {
      setIsVisible(true);
      
      const completionTimeout = setTimeout(() => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }, duration * 1000);
      
      return () => clearTimeout(completionTimeout);
    }, delay * 1000);
    
    return () => clearTimeout(animationTimeout);
  }, [trigger, delay, duration, onComplete]);
  
  // Define animation styles based on type
  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `all ${duration}s ease-in-out`,
      transitionDelay: `${delay}s`,
    };
    
    switch (type) {
      case 'fade':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
        };
        
      case 'wipe':
        return {
          ...baseStyles,
          clipPath: isVisible 
            ? 'inset(0% 0% 0% 0%)' 
            : direction === 'left' 
              ? 'inset(0% 100% 0% 0%)' 
              : direction === 'right' 
                ? 'inset(0% 0% 0% 100%)' 
                : direction === 'top' 
                  ? 'inset(100% 0% 0% 0%)' 
                  : 'inset(0% 0% 100% 0%)',
        };
        
      case 'iris':
        return {
          ...baseStyles,
          clipPath: isVisible ? 'circle(100% at center)' : 'circle(0% at center)',
        };
        
      case 'zoom':
        return {
          ...baseStyles,
          transform: isVisible ? 'scale(1)' : 'scale(0)',
          opacity: isVisible ? 1 : 0,
        };
        
      case 'slide':
        return {
          ...baseStyles,
          transform: isVisible 
            ? 'translateX(0)' 
            : direction === 'left' 
              ? 'translateX(100%)' 
              : direction === 'right' 
                ? 'translateX(-100%)' 
                : direction === 'top' 
                  ? 'translateY(100%)' 
                  : 'translateY(-100%)',
        };
        
      default:
        return baseStyles;
    }
  };
  
  return (
    <div 
      className={cn('overflow-hidden', className)}
      style={getAnimationStyles()}
    >
      {children}
    </div>
  );
};

// Usage example component
export const TransitionExample: React.FC = () => {
  const [currentTransition, setCurrentTransition] = useState<TransitionType>('fade');
  const [showContent, setShowContent] = useState(true);

  const handleTransitionChange = (type: TransitionType) => {
    setShowContent(false);
    setTimeout(() => {
      setCurrentTransition(type);
      setShowContent(true);
    }, 800);
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        {(['fade', 'wipe', 'iris', 'zoom', 'slide'] as TransitionType[]).map(type => (
          <button
            key={type}
            onClick={() => handleTransitionChange(type)}
            className="px-3 py-1 bg-elvis-medium rounded hover:bg-elvis-pink/20 transition-colors"
          >
            {type}
          </button>
        ))}
      </div>
      
      <VideoTransition 
        type={currentTransition}
        trigger={showContent}
        className="w-full h-64 bg-elvis-medium rounded-xl flex items-center justify-center"
      >
        <h3 className="text-2xl font-bold">Transition: {currentTransition}</h3>
      </VideoTransition>
    </div>
  );
};
