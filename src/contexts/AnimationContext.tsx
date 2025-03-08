
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AnimationContextType {
  isFirstVisit: boolean;
  setFirstVisit: (value: boolean) => void;
  prefersReducedMotion: boolean;
  setPrefersReducedMotion: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [isFirstVisit, setFirstVisit] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user prefers reduced motion on initial render
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        isFirstVisit,
        setFirstVisit,
        prefersReducedMotion,
        setPrefersReducedMotion,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};
