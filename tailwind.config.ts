
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			// TYPOGRAPHY SYSTEM
			fontSize: {
				'display-1': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
				'display-2': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
				'display-3': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
				'heading-1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
				'heading-2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
				'heading-3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
				'heading-4': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
				'body-lg': ['1.125rem', { lineHeight: '1.6' }],
				'body': ['1rem', { lineHeight: '1.6' }],
				'body-sm': ['0.875rem', { lineHeight: '1.5' }],
				'caption': ['0.75rem', { lineHeight: '1.5' }],
			},
			// SPACING SYSTEM - for layouts and components
			spacing: {
				'3xs': '0.125rem', // 2px
				'2xs': '0.25rem',  // 4px
				'xs': '0.5rem',    // 8px
				'sm': '0.75rem',   // 12px
				'md': '1rem',      // 16px - base
				'lg': '1.5rem',    // 24px
				'xl': '2rem',      // 32px
				'2xl': '2.5rem',   // 40px
				'3xl': '3rem',     // 48px
				'4xl': '4rem',     // 64px
				'5xl': '5rem',     // 80px
				'6xl': '6rem',     // 96px
			},
			// GRID SYSTEM
			gridTemplateColumns: {
				'main': 'repeat(24, minmax(0, 1fr))',
				'responsive': 'repeat(auto-fit, minmax(280px, 1fr))',
				'auto-fill-sm': 'repeat(auto-fill, minmax(180px, 1fr))',
				'auto-fill-md': 'repeat(auto-fill, minmax(250px, 1fr))',
				'auto-fill-lg': 'repeat(auto-fill, minmax(320px, 1fr))',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				elvis: {
					dark: '#0F0F0F',
					darker: '#0A0A0A',
					medium: '#1A1A1A',
					light: '#252525',
					pink: '#FF00FF',
					magenta: '#FF00FF',
					purple: '#B026FF',
					'pink-800': '#CC00CC',
					'pink-600': '#FF33FF',
					'pink-400': '#FF66FF',
					'pink-200': '#FFCCFF',
					'purple-800': '#8C1ECC',
					'purple-600': '#C44DFF',
					'purple-400': '#D580FF',
					'purple-200': '#EACCFF',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
				accent: ['Playfair Display', 'serif'],
				script: ['Dancing Script', 'cursive'],
				display: ['Montserrat', 'sans-serif'],
				mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
			},
			// ADVANCED ANIMATION KEYFRAMES
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'slide-in-bottom': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-in-top': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'glow': {
					'0%': { boxShadow: '0 0 5px rgba(255, 0, 255, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(255, 0, 255, 0.8)' },
					'100%': { boxShadow: '0 0 5px rgba(255, 0, 255, 0.5)' }
				},
				'float': {
					'0%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
					'100%': { transform: 'translateY(0px)' }
				},
				'pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'bg-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'text-shine': {
					'0%': { 
						backgroundPosition: '0% 50%',
						color: 'rgba(255, 0, 255, 0.5)'
					},
					'50%': { 
						backgroundPosition: '100% 50%',
						color: 'rgba(176, 38, 255, 1)'
					},
					'100%': { 
						backgroundPosition: '0% 50%',
						color: 'rgba(255, 0, 255, 0.5)'
					}
				},
				'reveal-text': {
					'0%': { 
						transform: 'translateY(100%)',
						opacity: '0'
					},
					'100%': { 
						transform: 'translateY(0)',
						opacity: '1' 
					}
				},
				'reveal-mask': {
					'0%': { 
						transform: 'scaleY(1)'
					},
					'100%': { 
						transform: 'scaleY(0)'
					}
				},
				'char-reveal': {
					'0%': { 
						transform: 'translateY(100%)',
						opacity: '0'
					},
					'100%': { 
						transform: 'translateY(0)',
						opacity: '1' 
					}
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'slide-in-bottom': 'slide-in-bottom 0.5s ease-out',
				'slide-in-left': 'slide-in-left 0.5s ease-out',
				'slide-in-top': 'slide-in-top 0.5s ease-out',
				'glow': 'glow 3s infinite ease-in-out',
				'float': 'float 6s infinite ease-in-out',
				'pulse': 'pulse 3s infinite cubic-bezier(0.4, 0, 0.6, 1)',
				'spin-slow': 'spin-slow 8s linear infinite',
				'bg-shift': 'bg-shift 5s ease infinite',
				'text-shine': 'text-shine 3s ease infinite',
				'reveal-text': 'reveal-text 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards',
				'reveal-mask': 'reveal-mask 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards',
				'char-reveal': 'char-reveal 0.5s cubic-bezier(0.77, 0, 0.175, 1) forwards',
				'enter': 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
				'exit': 'fade-out 0.3s ease-out, scale-out 0.2s ease-out'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'elvis-gradient': 'linear-gradient(45deg, #B026FF, #FF00FF)',
				'elvis-dark-gradient': 'linear-gradient(45deg, rgba(10,10,10,0.9), rgba(25,25,25,0.9))',
				'neon-grid': 'linear-gradient(90deg, rgba(255,0,255,0.15) 1px, transparent 1px), linear-gradient(0deg, rgba(255,0,255,0.15) 1px, transparent 1px)',
				'glow-grid': 'radial-gradient(circle, rgba(255,0,255,0.1) 1px, transparent 1px)',
			},
			boxShadow: {
				'pink-glow': '0 0 10px 0 rgba(255, 0, 255, 0.3)',
				'purple-glow': '0 0 10px 0 rgba(176, 38, 255, 0.3)',
				'intense-pink-glow': '0 0 20px 5px rgba(255, 0, 255, 0.5)',
				'neon-outline': '0 0 0 2px rgba(255, 0, 255, 0.8), 0 0 10px 0 rgba(255, 0, 255, 0.4)',
				'inner-glow': 'inset 0 0 10px 0 rgba(255, 0, 255, 0.3)',
			},
			backgroundSize: {
				'grid-lg': '40px 40px',
				'grid-md': '20px 20px',
				'grid-sm': '10px 10px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
