/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
         '3xl': '1920px',
         '4xl': '2560px',
         '5xl': '3440px',
         '360px': '360px',
         '380px': '380px',
         '430px': '430px',
      },
      gridTemplateColumns: {
        40: 'repeat(40, minmax(0, 1fr))',
        25: 'repeat(25, minmax(0, 1fr))',
        20: 'repeat(20, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
      },
    }
  },
  plugins: [],
  safelist: [
    {
      pattern: /from-(red|green|yellow|gray)-(300|500|700|900)/,
    },
  ],
};
