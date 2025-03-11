
import React, { useRef, useEffect } from 'react';
import { StatData } from '@/hooks/api/useStats';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useAnimation } from '@/contexts/AnimationContext';
import { useCountUp } from 'react-countup';

interface StatCardProps {
  stat: StatData;
}

export const StatCard = ({ stat }: StatCardProps) => {
  const { prefersReducedMotion } = useAnimation();
  const countUpRef = useRef<HTMLParagraphElement>(null);
  
  const { start } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: parseInt(stat.value) || 0,
    duration: prefersReducedMotion ? 0 : 2,
    separator: ',',
  });

  useEffect(() => {
    start();
  }, [start]);

  return (
    <Card className="hover-card p-6 transition-all duration-300"
      style={{ backgroundColor: stat.background_color }}>
      <div className="space-y-4">
        <div className="rounded-full w-12 h-12 flex items-center justify-center"
          style={{ backgroundColor: `${stat.background_color}22` }}>
          <Icon name={stat.icon} className="w-6 h-6" style={{ color: stat.text_color }} />
        </div>
        <div className="space-y-2">
          <p className="font-display text-3xl" style={{ color: stat.text_color }} ref={countUpRef}>
            0
          </p>
          <p className="text-sm font-medium" style={{ color: stat.text_color }}>
            {stat.title}
          </p>
          {stat.subtitle && (
            <p className="text-xs opacity-80" style={{ color: stat.text_color }}>
              {stat.subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
