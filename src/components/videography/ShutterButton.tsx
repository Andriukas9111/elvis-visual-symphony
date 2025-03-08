
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShutterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  withSound?: boolean;
}

const ShutterButton = React.forwardRef<HTMLButtonElement, ShutterButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, iconOnly = false, withSound = true, onClick, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen(false);
      
      // Play camera shutter sound
      if (withSound && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error('Failed to play shutter sound', e));
      }
      
      // Reopen the shutter after animation completes
      setTimeout(() => setIsOpen(true), 300);
      
      if (onClick) onClick(e);
    };

    // Shutter blade variants
    const bladeVariants = {
      open: (i: number) => ({
        rotate: i * 45,
        scale: 0,
        opacity: 0,
      }),
      closed: (i: number) => ({
        rotate: i * 45,
        scale: 1,
        opacity: 0.9,
      }),
    };

    // Size styles
    const sizeStyles = {
      sm: {
        button: "h-8 text-xs min-w-20",
        iconButton: "h-8 w-8",
        shutterSize: 32,
      },
      md: {
        button: "h-10 text-sm min-w-24",
        iconButton: "h-10 w-10",
        shutterSize: 40,
      },
      lg: {
        button: "h-12 text-base min-w-32",
        iconButton: "h-12 w-12",
        shutterSize: 48,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: "bg-elvis-pink text-white hover:bg-elvis-pink-800 focus:ring-2 focus:ring-elvis-pink focus:ring-offset-2 focus:ring-offset-elvis-dark",
      secondary: "bg-elvis-purple text-white hover:bg-elvis-purple-800 focus:ring-2 focus:ring-elvis-purple focus:ring-offset-2 focus:ring-offset-elvis-dark",
      outline: "bg-transparent border-2 border-elvis-pink text-white hover:bg-elvis-pink/10 focus:ring-2 focus:ring-elvis-pink focus:ring-offset-2 focus:ring-offset-elvis-dark",
      ghost: "bg-transparent hover:bg-white/10 text-white focus:ring-2 focus:ring-white/20",
    };

    const { shutterSize } = sizeStyles[size];
    const buttonClass = iconOnly ? sizeStyles[size].iconButton : sizeStyles[size].button;

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative rounded-full font-medium transition-colors focus:outline-none inline-flex items-center justify-center select-none",
          variantStyles[variant],
          buttonClass,
          className
        )}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {/* Shutter aperture overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-full">
          <div className="relative" style={{ width: shutterSize, height: shutterSize }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={bladeVariants}
                initial="open"
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black"
                style={{
                  width: shutterSize * 0.6,
                  height: shutterSize * 0.6,
                  borderRadius: shutterSize * 0.2,
                  transformOrigin: "center",
                }}
              />
            ))}
          </div>
        </div>

        {/* Button content */}
        <span className="z-10 px-4">{children}</span>

        {/* Audio for shutter sound */}
        {withSound && (
          <audio ref={audioRef} preload="auto" className="hidden">
            <source src="data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwMD4+Pj4+PkxMTExMTFpaWlpaWmhoaGhoaHZ2dnZ2doSEhISEhJKSkpKSkqCgoKCgoK6urq6urrKysr+/v7+/v8PDw8PDw8bGxtTU1NTU1NTU1NTU1ODg4ODg4ODg4ODg4Pv7+/v7+/v7+/v7+/v7+/v7+/v7AAAA//tQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwBEgAAAAAAAAAABUgJAUHQQAAgAAAHjOZTf/7UMQBg8AAAaQAAAAgAAA0gAAABExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" type="audio/mp3" />
          </audio>
        )}
      </motion.button>
    );
  }
);

ShutterButton.displayName = 'ShutterButton';

export default ShutterButton;
