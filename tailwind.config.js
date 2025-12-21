/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'theme-blue': 'rgb(5 109 232)',
        'theme-blue-light': 'rgba(5, 109, 232, 0.08)',
        'card-glass': 'rgba(255, 255, 255, 0.7)',
        black: '#444',
        gray: '#999',
        blue: '#2079fe',
        'r-pink': '#FF8992',
        'r-blue': '#00ADE9',
        'r-fern': '#00C2A9',
        'r-green': '#4BAD39',
        'r-purple': '#BD66CD',
        'r-yellow': '#FFAE00',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        tianwang: ['var(--font-tianwang)', 'sans-serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'wiggle-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(6px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pop-sparkle': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-in-right-fade': {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pop-dialog': {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '70%': { opacity: '1', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pop-bubble': {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '80%': { opacity: '1', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pop-bubble-vanish': {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '40%': { opacity: '1', transform: 'scale(1.1)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' },
          // '50%': { opacity: '1', transform: 'scale(1)' },
          // '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
        'jump-steps': {
          '0%': { transform: 'translate(-10px, 0)' },
          '20%': { transform: 'translate(0px, -30px)' }, // 第一跳最高点
          '40%': { transform: 'translate(10px, -15px)' }, // 落在第一阶

          '50%': { transform: 'translate(10px, -15px)' },

          '70%': { transform: 'translate(45Px, -48Px)' }, // 第二跳最高点
          '100%': { transform: 'translate(60Px, -35Px)' }, // 落在讲台上 用大写P是不想让tailwind转换
        },
        contentShow: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        overlayShow: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'float-path': {
          from: { offsetDistance: '0%' },
          to: { offsetDistance: '100%' },
        },
        'glitch': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'pop-in-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0)' },
        },
        // 3D Hi：弹性弹出
        'pop-in-elastic': {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '60%': { opacity: '1', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // 1. 刘看山顶球：上跳后回落
        'jump-hit': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0)' },
        },
        // 2. 黄色球被顶：变大并向上弹一下
        'ball-bump': {
          '0%': { transform: 'scale(0.8) translateY(0)' },
          '50%': { transform: 'scale(1.1) translateY(-10px)' },
          '100%': { transform: 'scale(1) translateY(0)' },
        },
        // 3. 闪光特效：放大并淡出
        'flash-scale': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
          '100%': { opacity: '0', transform: 'scale(1.5)' },
        },
        'orbit-spin': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        // 反向自转：抵消轨道的旋转，保持图标直立
        'counter-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        marquee: 'marquee linear infinite',
        'slide-in': 'slide-in 8s ease-out forwards',
        'blink': 'blink 1s step-end infinite',
        'wiggle-x': 'wiggle-x 1.5s ease-in-out infinite',
        float: 'float 1.5s ease-in-out infinite',
        'pop-dialog': 'pop-dialog 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s forwards',
        'pop-sparkle': 'pop-sparkle 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards',
        'jump-steps': 'jump-steps 2s ease-in-out forwards',
        'pop-bubble': 'pop-bubble 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pop-bubble-vanish': 'pop-bubble-vanish 3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'slide-in-right': 'slide-in-right-fade 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        contentShow: 'contentShow 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        overlayShow: 'overlayShow 0.2s ease-out forwards',
        'slide-up': 'slide-up 0.3s ease-out forwards',
        'float-path': 'float-path 15s linear infinite',
        'glitch-light': 'glitch 3s infinite',
        'glitch-heavy': 'glitch 1.5s infinite steps(2, end)',
        'jump-hit': 'jump-hit 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'ball-bump': 'ball-bump 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'flash-scale': 'flash-scale 0.6s ease-out forwards',
        'mirror-vanish': 'pop-in-out 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        '3d-pop': 'pop-in-elastic 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'orbit': 'orbit-spin 12s linear infinite',
        'counter-spin': 'counter-spin 12s linear infinite',
      },
    },
  },
  plugins: [],
};
