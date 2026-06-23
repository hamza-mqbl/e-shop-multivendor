/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  mode: "jit",
  theme: {
    fontFamily: {
      // Brand roles
      display: ['"Clash Display"', "Poppins", "sans-serif"], // headings, wordmark
      sans: ["Inter", "system-ui", "sans-serif"], // body / UI
      mono: ['"JetBrains Mono"', "monospace"], // sizes, SKUs, prices-as-data
      // Legacy aliases kept so existing font-Roboto / font-Poppins classes
      // automatically render the new brand fonts during the rebrand.
      Roboto: ["Inter", "system-ui", "sans-serif"],
      Poppins: ["Inter", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        // Qadam — warm leather-craft palette
        espresso: "#241A14", // primary text, dark sections
        coffee: "#3A2A20", // raised dark surfaces (e.g. nav bar)
        marigold: {
          DEFAULT: "#F2A93B", // primary brand accent
          dark: "#D98E22", // hover / pressed
        },
        brick: "#B5462B", // sale price, urgent accents
        bone: "#FBF8F3", // page background
        sand: "#E7DDCE", // cards, hairlines, stitch lines
        clay: "#8C7A6B", // muted / secondary text
      },
      boxShadow: {
        card: "0 2px 10px -4px rgba(36, 26, 20, 0.18)",
        cardHover: "0 14px 30px -12px rgba(36, 26, 20, 0.30)",
      },
      screens: {
        "1000px": "1050px",
        "1100px": "1110px",
        "800px": "800px",
        "1300px": "1300px",
        "400px": "400px",
      },
    },
  },
  plugins: [],
};
