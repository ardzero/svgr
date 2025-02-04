/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

export default {
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities({
        clamp(value) {
          // load font sizes from theme

          const sizes = theme("fontSize"); // parse the value passed in from class name // split it by "-" or "," or ", " and compare pieces to fontSize values

          const split = value

            .split(/[-,]+/)

            .map((v) => (sizes[v] ? sizes[v]["0"] : v)); // return a clamped font-size

          return {
            fontSize: `clamp(${split[0]}, ${split[1]}, ${split[2]})`,
          };
        },
      });
    }),
  ],
};
