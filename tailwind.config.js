/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/shared/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        lexend: ["Lexend-Regular", "sans-serif"],
        "lexend-bold": ["Lexend-Bold", "sans-serif"],
        "lexend-black": ["Lexend-Black", "sans-serif"],
        "lexend-light": ["Lexend-Light", "sans-serif"],
        "lexend-thin": ["Lexend-Thin", "sans-serif"],
        "lexend-medium": ["Lexend-Medium", "sans-serif"],
        "lexend-semi-bold": ["Lexend-SemiBold", "sans-serif"],
        "lexend-extra-bold": ["Lexend-ExtraBold", "sans-serif"],
        "lexend-extra-light": ["Lexend-ExtraLight", "sans-serif"],
        "open-dyslexic": ["OpenDyslexic-Regular", "sans-serif"],
        "open-dyslexic-bold": ["OpenDyslexic-Bold", "sans-serif"],
        "open-dyslexic-italic": ["OpenDyslexic-Italic", "sans-serif"],
        "open-dyslexic-bold-italic": ["OpenDyslexic-BoldItalic", "sans-serif"],
      },
      lineHeight: {
        dyslexic: "1.625",
        "dyslexic-loose": "2.0",
      },
      letterSpacing: {
        dyslexic: "0.05em",
        "dyslexic-wide": "0.1em",
      },
    },
  },
  plugins: [],
};
