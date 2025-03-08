
import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  magneticEffect?: boolean;
  intensity?: number;
  glowEffect?: boolean;
  glowColor?: string;
  iconOnly?: boolean;
  roundedFull?: boolean;
}

const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    children,
    magneticEffect = true,
    intensity = 0.3,
    glowEffect = true,
    glowColor = 'rgba(255, 0, 255, 0.5)',
    iconOnly = false,
    roundedFull = false,
    ...props
  }, ref) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    
    // Motion values for position
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    // Apply spring physics for smoother movement
    const springConfig = { damping: 15, stiffness: 150 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    // Calculate magnetic pull based on mouse position
    useEffect(() => {
      if (!magneticEffect || !isHovered || !buttonRef.current) return;
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = buttonRef.current!.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from center (normalized from -1 to 1)
        const maxDistance = Math.max(rect.width, rect.height) / 2;
        const mouseX = (e.clientX - centerX) / maxDistance;
        const mouseY = (e.clientY - centerY) / maxDistance;
        
        // Apply the magnetic pull with intensity factor
        x.set(mouseX * 20 * intensity);
        y.set(mouseY * 20 * intensity);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }, [isHovered, magneticEffect, intensity]);

    // Reset position when mouse leaves
    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    // Size styles
    const sizeStyles = {
      sm: iconOnly ? "h-8 w-8" : "h-8 px-3 text-xs",
      md: iconOnly ? "h-10 w-10" : "h-10 px-4 text-sm",
      lg: iconOnly ? "h-12 w-12" : "h-12 px-5 text-base",
    };

    // Variant styles
    const variantStyles = {
      primary: "bg-elvis-pink text-white hover:bg-elvis-pink-800 focus:ring-2 focus:ring-elvis-pink focus:ring-offset-2 focus:ring-offset-elvis-dark",
      secondary: "bg-elvis-purple text-white hover:bg-elvis-purple-800 focus:ring-2 focus:ring-elvis-purple focus:ring-offset-2 focus:ring-offset-elvis-dark",
      outline: "bg-transparent border-2 border-elvis-pink text-white hover:bg-elvis-pink/10 focus:ring-2 focus:ring-elvis-pink focus:ring-offset-2 focus:ring-offset-elvis-dark",
      ghost: "bg-transparent hover:bg-white/10 text-white focus:ring-2 focus:ring-white/20",
    };

    // Set up glow effects
    const glowVariants = {
      initial: {
        boxShadow: "0 0 0 rgba(255, 0, 255, 0)",
      },
      hover: {
        boxShadow: `0 0 20px ${glowColor}`,
        transition: {
          duration: 0.3,
        },
      },
    };

    return (
      <motion.div
        ref={buttonRef}
        className="inline-flex relative"
        style={{ x: xSpring, y: ySpring }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial="initial"
        animate={isHovered && glowEffect ? "hover" : "initial"}
        variants={glowVariants}
      >
        <motion.button
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center font-medium transition-colors focus:outline-none",
            variantStyles[variant],
            sizeStyles[size],
            roundedFull ? "rounded-full" : "rounded-md",
            className
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          {...props}
        >
          {children}
          
          {/* Subtle inner glow effect */}
          {isHovered && glowEffect && (
            <motion.span
              className={cn(
                "absolute inset-0 pointer-events-none",
                roundedFull ? "rounded-full" : "rounded-md"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: `radial-gradient(circle, ${glowColor} 0%, rgba(255,255,255,0) 70%)`,
                mixBlendMode: "overlay",
              }}
            />
          )}
        </motion.button>
      </motion.div>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';

export default MagneticButton;
