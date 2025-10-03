// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/nesting': {}, // Use the package name exactly as installed
    '@tailwindcss/postcss': {
      tailwindConfig: './tailwind.config.js'
    },
    'autoprefixer': {},
  }
};

export default config;