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
        success: 'var(--cc-success)',
        warn: 'var(--cc-warn)',
        danger: 'var(--cc-danger)',
        info: 'var(--cc-info)',
        'route-a': 'var(--cc-route-a)',
        'route-b': 'var(--cc-route-b)',
        border: 'var(--cc-border)',
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
        mono: ['var(--font)'],
      },
      borderRadius: {
        card: 'var(--r-card, 24px)',
        inner: 'var(--r-inner, 16px)',
        btn: 'var(--r-btn, 16px)',
        input: 'var(--r-input, 14px)',
        pill: 'var(--r-pill, 999px)',
        'phone-frame': '44px',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
