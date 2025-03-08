
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MagneticButtonProps = React.ComponentPropsWithoutRef<typeof Button> & {
  magneticEffect?: boolean;
  glowEffect?: boolean;
  strength?: number;
};

export const MagneticButton = React.forwardRef<
  HTMLButtonElement,
  MagneticButtonProps
>(({ 
  children, 
  className, 
  magneticEffect = true,
  glowEffect = true,
  strength = 30,
  ...props 
}, ref) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !magneticEffect) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from cursor to center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Scale distance to create a subtle effect
    const scaledX = distanceX * 0.2;
    const scaledY = distanceY * 0.2;
    
    setPosition({ x: scaledX, y: scaledY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Reset position on unmount or when magnetic effect is disabled
  useEffect(() => {
    if (!magneticEffect) {
      setPosition({ x: 0, y: 0 });
    }
    
    return () => {
      setPosition({ x: 0, y: 0 });
    };
  }, [magneticEffect]);

  return (
    <Button
      ref={(node) => {
        // Handle both forwardRef and internal ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        buttonRef.current = node;
      }}
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isHovered && glowEffect && 'shadow-pink-glow',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isHovered ? 'transform 0.2s ease-out' : 'transform 0.5s ease',
      }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {glowEffect && (
        <span 
          className="absolute inset-0 bg-elvis-gradient opacity-0 transition-opacity duration-300 -z-10"
          style={{ opacity: isHovered ? 0.6 : 0 }}
        />
      )}
    </Button>
  );
});

MagneticButton.displayName = 'MagneticButton';
