module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-mobile-forever': {
      viewportWidth: 375,
      maxDisplayWidth: 600,
      disableMobile: false,
      include: [/\/src\//, /\/app\//, /\/components\//], 
    },
  },
};