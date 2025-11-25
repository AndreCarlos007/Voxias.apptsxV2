/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        space: ["SpaceGrotesk_400Regular"],
        spaceBold: ["SpaceGrotesk_700Bold"],
        radio: ["RadioCanadaBig_400Regular"],
        radioBold: ["RadioCanadaBig_700Bold"],
      },
       colors: {
        primary: "#1B1B1B",    //fundo preto claro
        secondary: "#3b6331", //verde
        terciary: "#292929",   //cinza claro
        neutro: "#AEAEAE",
        border: "#145A32",  //borda verde escuro
      },
    },
  },
  plugins: [],
}
