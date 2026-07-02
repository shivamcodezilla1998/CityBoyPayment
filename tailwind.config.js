/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F8FB',
        surface: '#FFFFFF',
        subtle: '#F1F3F9',
        'border-soft': '#E6E8EF',
        'border-strong': '#D5D9E2',
        primary: '#0B1020',
        secondary: '#4A5167',
        tertiary: '#8189A0',
        inverse: '#FFFFFF',
        brand: {
          50: '#EEF1FF',
          100: '#DCE2FF',
          300: '#8B96F5',
          500: '#4C5BE0',
          600: '#3A47C7',
          700: '#2C36A0',
        },
        accent: {
          500: '#14C8B8',
        },
        success: {
          50: '#ECFDF5',
          500: '#16A34A',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
        },
        danger: {
          50: '#FEF2F2',
          500: '#EF4444',
        },
        info: {
          50: '#EFF6FF',
          500: '#2563EB',
        },
        chart: {
          1: '#4C5BE0',
          2: '#14C8B8',
          3: '#F59E0B',
          4: '#8B5CF6',
          5: '#EC4899',
          6: '#06B6D4',
          7: '#10B981',
          8: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,16,32,0.04), 0 4px 16px -4px rgba(11,16,32,0.06)',
        'card-hover': '0 2px 4px rgba(11,16,32,0.06), 0 8px 24px -4px rgba(11,16,32,0.10)',
      },
    },
  },
  plugins: [],
}
