import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        paper: "#f7f4ed",
        clay: "#b65c38",
        moss: "#4f7f52",
        brass: "#c49b4e"
      }
    }
  },
  plugins: []
} satisfies Config;
