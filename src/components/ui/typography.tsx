
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { letterAnimation } from '@/lib/animation';

// Display Text component
const displayTextVariants = cva('font-display tracking-tighter', {
  variants: {
    size: {
      xs: 'text-heading-1',
      sm: 'text-display-3',
      md: 'text-display-2',
      lg: 'text-display-1',
      xl: 'text-[5rem] leading-[1.1]',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-elvis-pink',
      gradient: 'text-gradient',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'md',
    weight: 'bold',
    color: 'default',
    align: 'left',
  },
});

interface DisplayTextProps extends React.HTMLAttributes<HTMLHeadingElement>,
  VariantProps<typeof displayTextVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  animated?: boolean;
  children: React.ReactNode;
}

export const DisplayText = ({
  className,
  size,
  weight,
  color,
  align,
  as = 'h2',
  animated = false,
  children,
  ...props
}: DisplayTextProps) => {
  const Component = as;
  
  if (animated) {
    return (
      <motion.div
        className={cn(displayTextVariants({ size, weight, color, align }), className)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {typeof children === 'string' ? children.split('').map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={letterAnimation}
            custom={i}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        )) : children}
      </motion.div>
    );
  }
  
  return (
    <Component
      className={cn(displayTextVariants({ size, weight, color, align }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};

// Heading component
const headingVariants = cva('font-sans tracking-tight', {
  variants: {
    level: {
      1: 'text-heading-1 font-bold',
      2: 'text-heading-2 font-bold',
      3: 'text-heading-3 font-semibold',
      4: 'text-heading-4 font-semibold',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-elvis-pink',
      gradient: 'text-gradient',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    level: 3,
    color: 'default',
    align: 'left',
  },
});

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>,
  VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  animated?: boolean;
  children: React.ReactNode;
}

export const Heading = ({
  className,
  level,
  color,
  align,
  as,
  animated = false,
  children,
  ...props
}: HeadingProps) => {
  // Default the heading element based on the level
  const Component = as || `h${level}` as any;
  
  if (animated) {
    return (
      <motion.div
        className={cn(headingVariants({ level, color, align }), className)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.03,
            },
          },
        }}
      >
        {typeof children === 'string' ? children.split('').map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={letterAnimation}
            custom={i}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        )) : children}
      </motion.div>
    );
  }
  
  return (
    <Component
      className={cn(headingVariants({ level, color, align }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};

// Text component
const textVariants = cva('font-sans', {
  variants: {
    size: {
      xs: 'text-caption',
      sm: 'text-body-sm',
      md: 'text-body',
      lg: 'text-body-lg',
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
      muted: 'text-muted-foreground',
      accent: 'text-elvis-pink',
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
    color: 'default',
    align: 'left',
  },
});

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement>,
  VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
}

export const Text = ({
  className,
  size,
  weight,
  color,
  align,
  as = 'p',
  children,
  ...props
}: TextProps) => {
  const Component = as;
  
  return (
    <Component
      className={cn(textVariants({ size, weight, color, align }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};
