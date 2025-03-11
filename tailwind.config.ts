
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
      backgroundImage: {
        // Add custom gradients
        'elvis-gradient': 'linear-gradient(to right, #FF66FF, #9b87f5)',
        'elvis-gradient-reverse': 'linear-gradient(to left, #FF66FF, #9b87f5)',
        'elvis-gradient-diagonal': 'linear-gradient(135deg, #FF66FF, #9b87f5)',
        // Add grid patterns
        'neon-grid': 'linear-gradient(to right, rgba(255, 102, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 102, 255, 0.1) 1px, transparent 1px)',
        'glow-grid': 'radial-gradient(circle, rgba(155, 135, 245, 0.15) 1px, transparent 1px)',
      },
      backgroundSize: {
        '200': '200% 200%',
        'grid-sm': '10px 10px',
        'grid-md': '20px 20px',
        'grid-lg': '40px 40px',
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(165%)",
          },
        },
        glow: {
          "0%": { opacity: 0.5, borderColor: "#FF66FF" },
          "50%": { opacity: 1, borderColor: "#9b87f5" },
          "100%": { opacity: 0.5, borderColor: "#FF66FF" }
        },
        "reveal-text": {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        },
        "reveal-mask": {
          "0%": { transform: "scaleY(1)" },
          "100%": { transform: "scaleY(0)" }
        },
        "bg-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        },
        "revealUp": {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        },
        "loader": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "char-reveal": {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        }
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        glow: "glow 2s infinite alternate",
        "reveal-text": "reveal-text 0.5s forwards cubic-bezier(0.16, 1, 0.3, 1)",
        "reveal-mask": "reveal-mask 0.5s forwards cubic-bezier(0.16, 1, 0.3, 1)",
        "bg-shift": "bg-shift 6s infinite linear"
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
