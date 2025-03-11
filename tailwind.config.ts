
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
      },
      colors: {
        border: "#4B5563",
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        blue: {
          400: "#2589FE",
          500: "#0070F3",
          600: "#0052D4",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        "elvis-pink": '#FF66FF',
        "elvis-purple": {
          DEFAULT: '#9b87f5',
          dark: '#6E59A5',
        },
        "elvis-dark": '#1A1F2C',
        "elvis-medium": '#2A1E30',
        "elvis-light": '#403E43',
      },
      fontSize: {
        // Add custom font sizes for headings
        'heading-1': '2.25rem',
        'heading-2': '1.875rem',
        'heading-3': '1.5rem',
        'heading-4': '1.25rem',
        'display-1': '3.75rem',
        'display-2': '3rem',
        'display-3': '2.5rem',
        'body': '1rem',
      },
      boxShadow: {
        // Add custom shadows
        'pink-glow': '0 0 15px rgba(255, 102, 255, 0.7)',
        'purple-glow': '0 0 15px rgba(155, 135, 245, 0.7)',
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(165%)",
          },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        cursive: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
