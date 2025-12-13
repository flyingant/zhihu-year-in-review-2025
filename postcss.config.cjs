module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-mobile-forever': {
      viewportWidth: 375,
      maxDisplayWidth: 600,
      disableMobile: true, // Disable px to vw/vh conversion
      include: [/\/src\//, /\/app\//, /\/components\//], 
    },
  },
};