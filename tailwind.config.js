/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf7fe",
          100: "#f3ecfc",
          200: "#e3d0f7",
          300: "#e0aaff",
          400: "#c77dff",
          500: "#9d4edd",
          600: "#7b2cbf",
          700: "#5a189a",
          800: "#3c096c",
          900: "#240046",
          950: "#10002b",
        },
        primary: "#7B2CBF",
        ink: "#404040",
        muted: "#A3A3A3",
      },
      fontFamily: {
        jakarta: ["PlusJakartaSans_400Regular"],
        "jakarta-medium": ["PlusJakartaSans_500Medium"],
        "jakarta-semibold": ["PlusJakartaSans_600SemiBold"],
        "jakarta-bold": ["PlusJakartaSans_700Bold"],
        "jakarta-extrabold": ["PlusJakartaSans_800ExtraBold"],
        rubik: ["Rubik_400Regular"],
        "rubik-medium": ["Rubik_500Medium"],
        "rubik-bold": ["Rubik_700Bold"],
      },
    },
  },
  plugins: [],
};
