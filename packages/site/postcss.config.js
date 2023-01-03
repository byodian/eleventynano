module.exports = ctx => {
  const scss = ctx.file.extname === '.scss';

  return {
    parser: scss ? 'postcss-scss' : false,
    plugins: { 
      'postcss-advanced-variables': scss ? {} : false,
      'postcss-map-get': scss ? {} : false,
      'postcss-sort-media-queries': {},
      'postcss-nested': {},
      'postcss-import': {},
      'tailwindcss': {},
      'autoprefixer': {},
      'cssnano': ctx.env === 'production' ? ({
        'preset': 'default'
      }) : false
    }
  }
};
