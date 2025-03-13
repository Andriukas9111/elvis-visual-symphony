
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3;
  children: React.ReactNode;
}

export function SectionHeader({ 
  level = 1, 
  children, 
  className, 
  ...props 
}: SectionHeaderProps) {
  const baseStyle = "font-bold tracking-tight";
  
  const sizes = {
    1: "text-2xl md:text-3xl",
    2: "text-xl md:text-2xl",
    3: "text-lg md:text-xl",
  };
  
  const combinedClassName = cn(baseStyle, sizes[level], className);
  
  switch (level) {
    case 1:
      return <h1 className={combinedClassName} {...props}>{children}</h1>;
    case 2:
      return <h2 className={combinedClassName} {...props}>{children}</h2>;
    case 3:
      return <h3 className={combinedClassName} {...props}>{children}</h3>;
    default:
      return <h1 className={combinedClassName} {...props}>{children}</h1>;
  }
}

interface SectionSubheaderProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function SectionSubheader({ 
  children, 
  className, 
  ...props 
}: SectionSubheaderProps) {
  return (
    <p 
      className={cn("text-muted-foreground text-sm md:text-base", className)} 
      {...props}
    >
      {children}
    </p>
  );
}

interface CardTitleIconProps extends React.HTMLAttributes<HTMLHeadingElement> {
  icon: React.ReactNode;
  children: React.ReactNode;
  iconClassName?: string;
}

export function CardTitleWithIcon({
  icon,
  children,
  className,
  iconClassName,
  ...props
}: CardTitleIconProps) {
  return (
    <h3 
      className={cn("flex items-center font-medium", className)} 
      {...props}
    >
      <span className={cn("mr-2", iconClassName)}>{icon}</span>
      <span>{children}</span>
    </h3>
  );
}
