/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#1a232a",
          900: "#212a31",
          800: "#2e3944"
        },
        stage: {
          50: "#eef1ef",
          100: "#d3d9d4",
          300: "#9aafb3",
          400: "#748d92",
          500: "#5c7378",
          700: "#3d4f55"
        },
        mint: {
          300: "#3e7390",
          400: "#124e66",
          500: "#0f4055"
        }
      },
      boxShadow: {
        glow: "0 24px 80px rgba(18, 78, 102, 0.28)",
        panel: "0 18px 50px rgba(13, 19, 24, 0.42)"
      },
      backgroundImage: {
        "mesh-glow":
          "radial-gradient(circle at 18% 18%, rgba(18, 78, 102, 0.34), transparent 34%), radial-gradient(circle at 82% 12%, rgba(116, 141, 146, 0.2), transparent 28%), radial-gradient(circle at 52% 82%, rgba(211, 217, 212, 0.1), transparent 40%)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" }
        }
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "pulse-soft": "pulseSoft 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
