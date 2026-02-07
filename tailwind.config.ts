import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#F5F0E8",
          100: "#FBF8F2",
          200: "#E6DFD5",
          300: "#D9CEBF",
          400: "#B8A48A",
          600: "#6B6B6B",
          700: "#4B4B4B",
          900: "#1F1F1F"
        }
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        body: ["Noto Sans KR", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
