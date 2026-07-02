const fs = require('fs');

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
};

const colors = {
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
};

let cssVars = '';
let twColors = {};

const processColors = (obj, prefix = '') => {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      const varName = `--color-${prefix}${key}`;
      cssVars += `  ${varName}: ${hexToRgb(val)}; /* ${val} */\n`;
      result[key] = `rgb(var(${varName}) / <alpha-value>)`;
    } else {
      result[key] = processColors(val, `${prefix}${key}-`);
    }
  }
  return result;
};

twColors = processColors(colors);

const indexCss = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
${cssVars}
  --radius: 0.75rem;
}

* {
  box-sizing: border-box;
}

body {
  background-color: rgb(var(--color-canvas));
  color: rgb(var(--color-primary));
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.font-mono, .tabular-nums {
  font-variant-numeric: tabular-nums;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgb(var(--color-subtle));
}
::-webkit-scrollbar-thumb {
  background: rgb(var(--color-border-strong));
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--color-tertiary));
}
\`;

fs.writeFileSync('src/index.css', indexCss);

const twConfig = \`/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: \${JSON.stringify(twColors, null, 8).replace(/"([^"]+)":/g, '$1:')},
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
\`;

// fix formatting a bit
fs.writeFileSync('tailwind.config.js', twConfig.replace(/"/g, "'"));
