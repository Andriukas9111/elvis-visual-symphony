
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  children, 
  className 
}) => {
  return (
    <h2 className={cn(
      "text-2xl font-bold tracking-tight", 
      className
    )}>
      {children}
    </h2>
  );
};

interface SubheadingProps {
  children: React.ReactNode;
  className?: string;
}

export const Subheading: React.FC<SubheadingProps> = ({ 
  children, 
  className 
}) => {
  return (
    <h3 className={cn(
      "text-xl font-semibold tracking-tight", 
      className
    )}>
      {children}
    </h3>
  );
};

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({ 
  children,
  className 
}) => {
  return (
    <p className={cn(
      "text-base text-muted-foreground", 
      className
    )}>
      {children}
    </p>
  );
};

interface LabelTextProps {
  children: React.ReactNode;
  className?: string;
}

export const LabelText: React.FC<LabelTextProps> = ({ 
  children,
  className 
}) => {
  return (
    <span className={cn(
      "text-sm font-medium", 
      className
    )}>
      {children}
    </span>
  );
};

interface CardTitleWithIconProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const CardTitleWithIcon: React.FC<CardTitleWithIconProps> = ({ 
  children,
  icon,
  className 
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {icon}
      <h3 className="font-semibold tracking-tight">{children}</h3>
    </div>
  );
};
