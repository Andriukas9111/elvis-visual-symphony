
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Camera3DCardProps = React.ComponentProps<typeof Card> & {
  imageSrc: string;
  title: string;
  description?: string;
  maxRotation?: number;
};

export const Camera3DCard = ({ 
  className, 
  imageSrc, 
  title, 
  description,
  maxRotation = 15,
  ...props 
}: Camera3DCardProps) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Calculate position relative to card center (from -1 to 1)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const posX = (e.clientX - centerX) / (rect.width / 2);
    const posY = (e.clientY - centerY) / (rect.height / 2);
    
    // Inverse Y axis for natural rotation feel
    setRotation({ 
      x: -posY * maxRotation, 
      y: posX * maxRotation 
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div 
      className="perspective-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card 
        className={cn(
          'transform-3d w-full overflow-hidden bg-elvis-medium border-elvis-pink/30',
          isHovered && 'shadow-pink-glow',
          className
        )}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovered ? 'transform 0.2s ease-out' : 'transform 0.5s ease-out',
        }}
        {...props}
      >
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-elvis-gradient opacity-0 transition-opacity duration-300 z-10"
            style={{ opacity: isHovered ? 0.2 : 0 }}
          />
          
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-48 object-cover transition-transform duration-700"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        </div>
        
        <CardContent className="pt-4 pb-6">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          {description && (
            <p className="text-white/70 text-sm">{description}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
