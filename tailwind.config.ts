import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--cc-bg)',
        'bg-alt': 'var(--cc-bg-alt)',
        surface: 'var(--cc-surface)',
        'surface-2': 'var(--cc-surface-2)',
        'surface-glow': 'var(--cc-surface-glow)',
        primary: {
          DEFAULT: 'var(--cc-primary)',
          hover: 'var(--cc-primary-hover)',
          soft: 'var(--cc-primary-soft)',
        },
        secondary: 'var(--cc-secondary)',
        accent: 'var(--cc-accent)',
        success: 'var(--cc-success)',
        warn: 'var(--cc-warn)',
        danger: 'var(--cc-danger)',
        info: 'var(--cc-info)',
        'route-a': 'var(--cc-route-a)',
        'route-b': 'var(--cc-route-b)',
        border: 'var(--cc-border)',
        'border-subtle': 'var(--cc-border-subtle)',
        text: {
          DEFAULT: 'var(--cc-text)',
          2: 'var(--cc-text-2)',
          3: 'var(--cc-text-3)',
        },
        tier: {
          1: 'var(--cc-tier-1)',
          2: 'var(--cc-tier-2)',
          3: 'var(--cc-tier-3)',
          4: 'var(--cc-tier-4)',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        card: 'var(--r-card, 16px)',
        inner: 'var(--r-inner, 12px)',
        btn: 'var(--r-btn, 12px)',
        input: 'var(--r-input, 12px)',
        pill: 'var(--r-pill, 999px)',
      },
      boxShadow: {
        card: 'var(--cc-card-shadow)',
        'card-hover': 'var(--cc-card-shadow-hover)',
        gradient: '0 4px 20px rgba(124, 58, 237, 0.3)',
      },
      backgroundImage: {
        'primary-gradient': 'var(--cc-primary-gradient)',
      },
    },
  },
  plugins: [],
} satisfies Config;
