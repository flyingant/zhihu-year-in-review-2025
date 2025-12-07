import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'theme-blue': 'rgb(5 109 232)',
        'theme-blue-light': 'rgba(5, 109, 232, 0.08)',
        'card-glass': 'rgba(255, 255, 255, 0.7)',
        black: '#444',
        gray: {
          DEFAULT: '#999',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        blue: {
          DEFAULT: '#2079fe',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'r-pink': '#FF8992',
        'r-blue': '#00ADE9',
        'r-fern': '#00C2A9',
        'r-green': '#4BAD39',
        'r-yellow': '#FFD700',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        tianwang: ['var(--font-tianwang)', 'sans-serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': {
            transform: 'translateX(100vw)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        marquee: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
        contentShow: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        blink: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0',
          },
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        'float-path': {
          from: {
            'offset-distance': '0%',
          },
          to: {
            'offset-distance': '100%',
          },
        },
      },
      animation: {
        marquee: 'marquee linear infinite',
        'slide-in': 'slide-in 8s ease-out forwards',
        contentShow: 'contentShow 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slide-up 0.3s ease-out forwards',
        'float-path': 'float-path 15s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;

