/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        library: {
          50:  "#fdf8f0",
          100: "#faefd8",
          200: "#f4dba8",
          300: "#ecc06e",
          400: "#e49e3c",
          500: "#d4821e",
          600: "#b96516",
          700: "#994e15",
          800: "#7d4017",
          900: "#683618",
        },
        ink: {
          50:  "#f4f3f0",
          100: "#e5e3dc",
          200: "#cdc9bc",
          300: "#afa895",
          400: "#958c77",
          500: "#837a66",
          600: "#6e6556",
          700: "#5a5245",
          800: "#4b453a",
          900: "#1a1713",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { transform: "translateY(16px)", opacity: 0 }, to: { transform: "translateY(0)", opacity: 1 } },
      },
    },
  },
  plugins: [],
};
