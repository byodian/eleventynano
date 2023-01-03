const postcss = require('postcss');
const postcssrc = require('postcss-load-config');
const path = require('node:path');

module.exports = (eleventyConfig, options = {}) => {
  const { 
    inputPath = './styles/',
    watch = true,
    format = 'css'
  } = options;

  if (watch) {
    eleventyConfig.addWatchTarget(inputPath);
  }

  eleventyConfig.addTemplateFormats(format);

  eleventyConfig.addExtension(format, {
    outputFileExtension: 'css',

    async compile (inputContent, inputPath) {
      return async ({ page }) => {
        const parsed = path.parse(inputPath);
        if (parsed.name.startsWith("_")) return;
        
        const ctx = {
          file: {
            dirname: path.join(process.cwd(), parsed.dir),
            basename: parsed.base,
            extname: parsed.ext
          }
        };

        const { plugins, options } = await postcssrc(ctx);
        const result = await postcss(plugins)
          .process(inputContent, {
            ...options,
            from: inputPath,
            to: page.outputPath
          });

        return result.css
      }
    }
  })
}
