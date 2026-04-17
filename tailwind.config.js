/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fountain: {
          trt: '#2DD4BF',
          hrt: '#EC4899',
          glp: '#7C6F9B',
        }
      }
    },
  },
  plugins: [],
}
