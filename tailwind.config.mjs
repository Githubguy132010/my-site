/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'terminal-green': {
          primary: '#00ff41',    // Matrix green
          secondary: '#00cc33',  // Darker green
          accent: '#39ff14',     // Bright terminal green
          dim: '#009926',        // Dimmed green
        },
        'terminal-bg': {
          primary: '#0a0a0a',    // Deep black
          secondary: '#1a1a1a',  // Slightly lighter black
          tertiary: '#2a2a2a',   // Card backgrounds
        },
        'terminal-text': {
          primary: '#00ff41',    // Primary green text
          secondary: '#ffffff',  // White text
          dim: '#888888',        // Dimmed text
        },
        'terminal-error': '#ff0039',   // Red for errors
        'terminal-warning': '#ffff00', // Yellow for warnings
        'terminal-info': '#00ffff',    // Cyan for info
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Courier New', 'monospace'],
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s infinite',
        'typing': 'typing 2s steps(40, end), blink-caret 0.75s step-end infinite',
        'scanlines': 'scanlines 0.1s linear infinite',
        'underline-expand': 'underline-expand 0.3s ease-out forwards',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'typing': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: 'var(--terminal-green-primary)' },
        },
        'scanlines': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(2px)' },
        },
        'underline-expand': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};