/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fountain: {
          trt: '#2DD4BF',
          hrt: '#EC4899',
          glp: '#7C6F9B',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'bounce-subtle': 'bounceSubtle 0.5s ease-out',
        'tab-indicator': 'tabIndicator 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        tabIndicator: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-light': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(31,41,55,0.9) 0%, rgba(31,41,55,0.7) 100%)',
        'card-gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
        'card-gradient-red': 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        'card-gradient-amber': 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
        'card-gradient-green': 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
        'card-gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'card-lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
        'inner-light': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
