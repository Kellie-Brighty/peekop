/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#1E1E1E",
        "gray-light": "#F5F5F5",
        "gray-medium": "#717171",
        "gray-dark": "#4A4A4A",
      },
      fontFamily: {
        georama: ["Georama", "sans-serif"],
      },
    },
  },
  plugins: [],
};
