
import React from 'react';
import { motion } from 'framer-motion';

interface FilmLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const FilmLoader: React.FC<FilmLoaderProps> = ({
  size = 'md',
  color = 'currentColor',
  className
}) => {
  // Size mappings
  const sizeMap = {
    sm: { width: 40, height: 40, holeDiameter: 4, frameWidth: 36 },
    md: { width: 64, height: 64, holeDiameter: 6, frameWidth: 56 },
    lg: { width: 96, height: 96, holeDiameter: 8, frameWidth: 84 },
  };

  const { width, height, holeDiameter, frameWidth } = sizeMap[size];

  // Film reel animation
  const reelVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  // Film strip animation
  const stripVariants = {
    animate: {
      y: [0, -height],
      transition: {
        duration: 1.5,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  const holePositions = [];
  for (let i = 0; i < 16; i++) {
    holePositions.push(i * (height / 8));
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      {/* Film Reel */}
      <motion.div
        variants={reelVariants}
        animate="animate"
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx={width/2} cy={height/2} r={width/2 - 4} stroke={color} strokeWidth="3" strokeDasharray="4 2" />
          <circle cx={width/2} cy={height/2} r={width/4} fill="transparent" stroke={color} strokeWidth="2" />
          <circle cx={width/2} cy={height/2} r={width/8} fill={color} />
        </svg>
      </motion.div>

      {/* Film Strip */}
      <div className="absolute h-full w-10 overflow-hidden flex justify-center">
        <motion.div
          variants={stripVariants}
          animate="animate"
          className="absolute"
        >
          <svg width={frameWidth} height={height * 2} viewBox={`0 0 ${frameWidth} ${height * 2}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width={frameWidth} height={height * 2} fill="rgba(0,0,0,0.5)" />
            {/* Sprocket holes */}
            {holePositions.map((y, index) => (
              <React.Fragment key={index}>
                <circle cx={holeDiameter} cy={y + holeDiameter} r={holeDiameter/2} fill={color} />
                <circle cx={frameWidth - holeDiameter} cy={y + holeDiameter} r={holeDiameter/2} fill={color} />
              </React.Fragment>
            ))}
            {/* Film frames */}
            {Array.from({ length: 8 }).map((_, i) => (
              <rect
                key={i}
                x={holeDiameter * 2}
                y={i * (height / 4) + 2}
                width={frameWidth - holeDiameter * 4}
                height={(height / 4) - 4}
                stroke={color}
                strokeWidth="1"
                fill="transparent"
              />
            ))}
          </svg>
        </motion.div>
      </div>

      {/* Optional text */}
      <div className="sr-only">Loading...</div>
    </div>
  );
};

export default FilmLoader;
