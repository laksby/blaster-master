const tailwind = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const postcssImport = require('postcss-import');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    postcssImport,
    tailwind,
    autoprefixer,
    postcssPresetEnv({
      stage: 0,
    }),
    cssnano({
      preset: 'default',
    }),
  ],
};
