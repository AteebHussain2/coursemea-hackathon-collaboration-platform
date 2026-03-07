/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e', 
          600: '#16a34a',
          900: '#14532d',
        },
        surface: {
          50: '#f8fafc',  
          100: '#f1f5f9', 
          white: '#ffffff',
        },
        content: {
          primary: '#0f172a',   
          secondary: '#64748b', 
          muted: '#cbd5e1',     
        },
        status: {
          info: '#3b82f6',      
          success: '#22c55e',   
          warning: '#f59e0b',   
          danger: '#ef4444',    
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
