
import React from 'react';
import { cn } from '@/lib/utils';

type GridProps = {
  children: React.ReactNode;
  className?: string;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  } | number;
  autoFit?: boolean;
  minChildWidth?: string;
  maxWidth?: string;
  fullWidth?: boolean;
  as?: React.ElementType;
};

const Grid: React.FC<GridProps> = ({
  children,
  className,
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
  },
  gap = 4,
  autoFit = false,
  minChildWidth,
  maxWidth = '1280px',
  fullWidth = false,
  as: Component = 'div',
}) => {
  // Convert numeric gap to spacing class
  const getGapClass = (gap: number) => {
    switch (gap) {
      case 1: return 'gap-2xs';
      case 2: return 'gap-xs';
      case 3: return 'gap-sm';
      case 4: return 'gap-md';
      case 5: return 'gap-lg';
      case 6: return 'gap-xl';
      case 7: return 'gap-2xl';
      case 8: return 'gap-3xl';
      default: return 'gap-md';
    }
  };

  // Build responsive grid columns
  const getGridCols = () => {
    if (autoFit && minChildWidth) {
      return `grid-cols-[repeat(auto-fit,minmax(${minChildWidth},1fr))]`;
    }

    const colClasses = [];
    if (columns.xs) colClasses.push(`grid-cols-${columns.xs}`);
    if (columns.sm) colClasses.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) colClasses.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) colClasses.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) colClasses.push(`xl:grid-cols-${columns.xl}`);
    return colClasses.join(' ');
  };

  // Handle responsive gaps
  const getGapClasses = () => {
    if (typeof gap === 'number') {
      return getGapClass(gap);
    }
    
    const gapClasses = [];
    if (gap.xs) gapClasses.push(getGapClass(gap.xs));
    if (gap.sm) gapClasses.push(`sm:${getGapClass(gap.sm)}`);
    if (gap.md) gapClasses.push(`md:${getGapClass(gap.md)}`);
    if (gap.lg) gapClasses.push(`lg:${getGapClass(gap.lg)}`);
    if (gap.xl) gapClasses.push(`xl:${getGapClass(gap.xl)}`);
    return gapClasses.join(' ');
  };

  return (
    <Component 
      className={cn(
        'grid',
        getGridCols(),
        getGapClasses(),
        !fullWidth && 'mx-auto',
        !fullWidth && `max-w-[${maxWidth}]`,
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Grid;
