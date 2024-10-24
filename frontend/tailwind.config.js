/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cafe: {
          claro: "#F2D6A2", // Tono claro
          medio: "#BF9663", // Tono medio
          suave: "#F2DEC4", // Tono suave
          oscuro: "#592411", // Tono oscuro
          intenso: "#260E09", // Tono más oscuro
        },
      },
    },
  },
  plugins: [],
};
