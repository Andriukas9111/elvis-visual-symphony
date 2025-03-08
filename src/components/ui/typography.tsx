
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Heading styles
const headingVariants = cva(
  "font-sans tracking-tighter",
  {
    variants: {
      size: {
        "1": "text-display-1 md:text-display-1 leading-tight",
        "2": "text-display-3 md:text-display-2 leading-tight",
        "3": "text-heading-1 leading-tight",
        "4": "text-heading-2 leading-tight",
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        black: "font-extrabold",
      },
      colorStyle: {
        default: "text-white",
        primary: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
        accent: "text-accent",
        white: "text-white",
        pink: "text-elvis-pink",
      },
    },
    defaultVariants: {
      size: "1",
      weight: "bold",
      colorStyle: "default",
    },
  }
);

// Text/paragraph styles
const textVariants = cva(
  "font-sans",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      colorStyle: {
        default: "text-white",
        primary: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
        accent: "text-accent",
        white: "text-white",
        pink: "text-elvis-pink",
      },
      leading: {
        tight: "leading-tight",
        normal: "leading-normal",
        relaxed: "leading-relaxed",
        loose: "leading-loose",
      },
    },
    defaultVariants: {
      size: "md",
      weight: "normal",
      colorStyle: "default",
      leading: "normal",
    },
  }
);

// Interface for Heading component
interface HeadingProps extends
  React.HTMLAttributes<HTMLHeadingElement>,
  Omit<VariantProps<typeof headingVariants>, 'color'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  colorStyle?: "default" | "primary" | "secondary" | "muted" | "accent" | "white" | "pink";
  gradient?: boolean;
}

export const Heading = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps
>(({
  level = 1,
  size,
  weight,
  colorStyle = "default",
  className,
  children,
  gradient = false,
  ...props
}, ref) => {
  const Component = `h${level}` as const;
  
  return (
    <Component
      ref={ref}
      className={cn(
        headingVariants({ size, weight, colorStyle }),
        gradient && "text-gradient",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Heading.displayName = "Heading";

// Interface for Text component
interface TextProps extends
  React.HTMLAttributes<HTMLParagraphElement>,
  Omit<VariantProps<typeof textVariants>, 'color'> {
  as?: React.ElementType;
  colorStyle?: "default" | "primary" | "secondary" | "muted" | "accent" | "white" | "pink";
  gradient?: boolean;
}

export const Text = React.forwardRef<
  HTMLParagraphElement,
  TextProps
>(({
  as: Component = "p",
  size,
  weight,
  colorStyle = "default",
  leading,
  className,
  children,
  gradient = false,
  ...props
}, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        textVariants({ size, weight, colorStyle, leading }),
        gradient && "text-gradient",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.displayName = "Text";

export { headingVariants, textVariants };
