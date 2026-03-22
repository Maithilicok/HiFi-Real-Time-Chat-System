import daisyui from "daisyui";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light", "dark", "cupcake", "retro", "cyberpunk",
      "valentine", "aqua", "forest", "lofi", "dracula",
      "night", "coffee", "winter", "dim", "nord"
    ],
  },
};