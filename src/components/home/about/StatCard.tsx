
import React from 'react';
import { StatData } from '@/hooks/api/useStats';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useAnimation } from '@/contexts/AnimationContext';
import { useCountUp } from 'react-countup';

interface StatCardProps {
  stat: StatData;
}

export const StatCard = ({ stat }: StatCardProps) => {
  const { prefersReducedMotion } = useAnimation();
  const { countUp } = useCountUp({
    end: parseInt(stat.value) || 0,
    duration: prefersReducedMotion ? 0 : 2,
  });

  // Dynamically get icon from lucide-react
  const IconComponent = (Icons as Record<string, LucideIcon>)[stat.icon] || Icons.Activity;

  return (
    <Card className={`hover-card p-6 transition-all duration-300`}
      style={{ backgroundColor: stat.background_color }}>
      <div className="space-y-4">
        <div className="rounded-full w-12 h-12 flex items-center justify-center"
          style={{ backgroundColor: `${stat.background_color}22` }}>
          <IconComponent className={`w-6 h-6`} style={{ color: stat.text_color }} />
        </div>
        <div className="space-y-2">
          <p className="font-display text-3xl" style={{ color: stat.text_color }}>
            {countUp}
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
