module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-mobile-forever': {
      viewportWidth: 375,
      maxDisplayWidth: 600,
      disableMobile: true, // Disable px to vw/vh conversion
      include: [/\/src\//, /\/app\//, /\/components\//], 
    },
  },
};