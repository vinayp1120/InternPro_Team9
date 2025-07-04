/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        accent: {
          500: '#10b981',
          600: '#059669',
        }
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-50',
    'bg-purple-50',
    'bg-green-50',
    'bg-orange-50',
    'bg-teal-50',
    'bg-pink-50',
    'text-blue-600',
    'text-purple-600',
    'text-green-600',
    'text-orange-600',
    'text-teal-600',
    'text-pink-600',
    'border-blue-200',
    'border-purple-200',
    'border-green-200',
    'border-orange-200',
  ]
};