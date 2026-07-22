/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette personnalisée pour l'identité visuelle
        terracotta: '#C85A32',  // Chaleur de la terre / Argile
        waxgold: '#E5A93B',     // Jaune vibrant des imprimés Wax
        indigo: '#1E293B',      // Teinte des teintures traditionnelles
        sand: '#FDFBF7',        // Fond doux pour faire ressortir les vêtements
        ebony: '#121212',       // Noir profond pour le luxe et le minimalisme
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // Idéal pour les titres de stylisme haut de gamme
      }
    },
  },
  plugins: [],
}