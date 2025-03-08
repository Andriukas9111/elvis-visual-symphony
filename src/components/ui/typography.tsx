
import React, { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// DisplayText component
const displayTextVariants = cva(
  'font-display tracking-tighter text-foreground',
  {
    variants: {
      size: {
        xs: 'text-4xl',
        sm: 'text-5xl',
        md: 'text-6xl',
        lg: 'text-7xl',
        xl: 'text-8xl',
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      textColor: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        accent: 'text-primary',
        gradient: 'bg-elvis-gradient bg-clip-text text-transparent',
      },
    },
    defaultVariants: {
      size: 'md',
      weight: 'bold',
      align: 'left',
      textColor: 'default',
    },
  }
);

export interface DisplayTextProps 
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof displayTextVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
  children: React.ReactNode;
}

export const DisplayText = ({
  as: Component = 'h1',
  children,
  size,
  weight,
  align,
  textColor,
  className,
  ...props
}: DisplayTextProps) => {
  return (
    <Component
      className={cn(displayTextVariants({ size, weight, align, textColor }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};

// Heading component
const headingVariants = cva('font-sans tracking-tighter text-foreground', {
  variants: {
    level: {
      1: 'text-4xl md:text-5xl font-bold leading-tight',
      2: 'text-3xl md:text-4xl font-bold leading-tight',
      3: 'text-2xl md:text-3xl font-semibold leading-snug',
      4: 'text-xl md:text-2xl font-semibold leading-snug',
    },
    textColor: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-primary',
      gradient: 'bg-elvis-gradient bg-clip-text text-transparent',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    level: 1, // Changed from "1" to 1 (number instead of string)
    textColor: 'default',
    align: 'left',
  },
});

export interface HeadingProps 
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

export const Heading = ({
  as,
  level = 1, // Changed from "1" to 1 (number instead of string)
  textColor,
  align,
  children,
  className,
  ...props
}: HeadingProps) => {
  const Component = as || (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
  
  return (
    <Component
      className={cn(headingVariants({ level, textColor, align }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};

// Text component
const textVariants = cva('font-sans text-foreground', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    textColor: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-primary',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'md',
    weight: 'normal',
    textColor: 'default',
    align: 'left',
  },
});

export interface TextProps 
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
  children: React.ReactNode;
}

export const Text = ({
  as: Component = 'p',
  size,
  weight,
  textColor,
  align,
  className,
  children,
  ...props
}: TextProps) => {
  return (
    <Component
      className={cn(textVariants({ size, weight, textColor, align }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};

// Caption component
const captionVariants = cva('text-xs text-muted-foreground', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

export interface CaptionProps extends HTMLAttributes<HTMLParagraphElement>, 
  VariantProps<typeof captionVariants> {
  children: React.ReactNode;
}

export const Caption = ({
  align,
  className,
  children,
  ...props
}: CaptionProps) => {
  return (
    <p
      className={cn(captionVariants({ align }), className)}
      {...props}
    >
      {children}
    </p>
  );
};
