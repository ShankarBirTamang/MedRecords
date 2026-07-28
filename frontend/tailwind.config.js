/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--button-primary)",
          dark: "var(--button-primary-hover)",
          light: "var(--button-primary)",
          soft: "var(--button-soft)",
        },

        ink: "var(--text-primary)",
        muted: "var(--text-secondary)",
        border: "var(--border-color)",

        danger: "var(--danger-color)",
        success: "var(--success-color)",
      },

      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.08)",
      },
    },
  },

  plugins: [],
};