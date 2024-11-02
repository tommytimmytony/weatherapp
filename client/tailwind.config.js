/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'rgb(198 139 0)',
        'electricBlue': '#0AB9F2',
        'neonPink': '#FF217C',
        'deepPurple': '#292477',
        'cyberYellow': '#F2E527',
        'metallicSilver': '#C0C5CE',
        'darkCharcoal': '#1D1F20',
      },
      keyframes:{
        'fade-in':{
          '0%': {opacity: '0'},
          '100%': {opacity: '1'}
        },
        'slide-in':{
          '0%': {transform: 'translateX(-100%)', opacity: '0'},
          '100%': {transform: 'translateX(0)', opacity: '1'}
      
        },
      },
      animation:{
        'fade-in': 'fade-in 1s ease-out',
        'slide-in': 'slide-in 0.8s ease-out',
      },
    },
  },
  plugins: [],
}

