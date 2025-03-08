
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define heading styles
const headingVariants = cva('font-heading tracking-tight', {
  variants: {
    size: {
      '1': 'text-4xl md:text-5xl lg:text-6xl',
      '2': 'text-3xl md:text-4xl lg:text-5xl',
      '3': 'text-2xl md:text-3xl lg:text-4xl',
      '4': 'text-xl md:text-2xl lg:text-3xl',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      black: 'font-black',
    },
    color: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted-foreground',
      accent: 'text-accent',
      white: 'text-white',
      pink: 'text-pink-500',
    },
  },
  defaultVariants: {
    size: '1',
    weight: 'bold',
    color: 'default',
  },
});

// Define text styles
const textVariants = cva('max-w-prose', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm leading-normal',
      md: 'text-base leading-relaxed',
      lg: 'text-lg leading-relaxed',
      xl: 'text-xl leading-relaxed',
      '2xl': 'text-2xl leading-relaxed',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted-foreground',
      accent: 'text-accent',
      white: 'text-white',
      pink: 'text-pink-500',
    },
    leading: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
  },
  defaultVariants: {
    size: 'md',
    weight: 'normal',
    color: 'default',
    leading: 'normal',
  },
});

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  level?: 1 | 2 | 3 | 4;
}

export const Heading = ({
  className,
  children,
  size,
  weight,
  color,
  as,
  level = 1,
  ...props
}: HeadingProps) => {
  const Component = as || (`h${level}` as keyof JSX.IntrinsicElements);
  
  return (
    <Component
      className={cn(headingVariants({ size, weight, color, className }))}
      {...props}
    >
      {children}
    </Component>
  );
};

interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: keyof JSX.IntrinsicElements;
}

export const Text = ({
  className,
  children,
  size,
  weight,
  color,
  leading,
  as = 'p',
  ...props
}: TextProps) => {
  const Component = as;
  return (
    <Component
      className={cn(textVariants({ size, weight, color, leading, className }))}
      {...props}
    >
      {children}
    </Component>
  );
};

export const Display = ({ 
  className, 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h1 
      className={cn(
        "font-heading text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
};

export const Caption = ({ 
  className, 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p 
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

export { headingVariants, textVariants };
