
import React, { useRef, useEffect } from 'react';
import { AccomplishmentData } from '@/hooks/api/useAccomplishments';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useAnimation } from '@/contexts/AnimationContext';
import { useCountUp } from 'react-countup';

interface AccomplishmentCardProps {
  accomplishment: AccomplishmentData;
}

export const AccomplishmentCard = ({ accomplishment }: AccomplishmentCardProps) => {
  const { prefersReducedMotion } = useAnimation();
  const countUpRef = useRef<HTMLParagraphElement>(null);
  
  const { start } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: parseInt(accomplishment.value) || 0,
    duration: prefersReducedMotion ? 0 : 2,
    separator: ',',
    suffix: accomplishment.suffix || '',
  });

  useEffect(() => {
    start();
  }, [start]);

  return (
    <Card className="hover-card p-6 transition-all duration-300"
      style={{ backgroundColor: accomplishment.background_color }}>
      <div className="space-y-4">
        <div className="rounded-full w-12 h-12 flex items-center justify-center"
          style={{ backgroundColor: `${accomplishment.background_color}22` }}>
          <Icon name={accomplishment.icon} className="w-6 h-6" style={{ color: accomplishment.text_color }} />
        </div>
        <div className="space-y-2">
          <p className="font-display text-3xl" style={{ color: accomplishment.text_color }} ref={countUpRef}>
            0
          </p>
          <p className="text-sm font-medium" style={{ color: accomplishment.text_color }}>
            {accomplishment.title}
          </p>
        </div>
      </div>
    </Card>
  );
};
