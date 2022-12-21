const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginRSS = require('@11ty/eleventy-plugin-rss');
const htmlmin = require('html-minifier');
const postCSSPluin = require('eleventynano-plugin-postcss');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy('src/admin');
  eleventyConfig.addLayoutAlias('base', 'base.html');
  eleventyConfig.addLayoutAlias('blog', 'blog.html');
  eleventyConfig.addLayoutAlias('posts', 'posts.html');

  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginRSS);
  eleventyConfig.addPlugin(postCSSPluin);

  // eleventyConfig.addFilter('dateReadable', date => {
  //   return moment(new Date(date)).format('LL');
  // });

  eleventyConfig.addFilter('arrFilter', (arr) => {
    const selectedArr = arr.slice(0, 5);
    return selectedArr;
  });

  /**
   * @return {Array} - [{ year: 2021, blogs: [] }, { year: 2022, blogs: [] }]
   */
  eleventyConfig.addCollection('blogs', (collection) => {
    /**
     * @returns { 2021: [{ content: "..." }], 2022: [{ content: "..." }]}
     */
    const blogsByCreated = collection
      .getFilteredByGlob(['./src/blog/*.md'])
      .sort((a, b) => a.data.created - b.data.created)
      .reduce((blog, item) => {
        const year = item.data.created.getFullYear();
        if (blog.hasOwnProperty(year)) {
          blog[year].push(item);
        } else {
          blog[year] = [item];
        }

        return blog;
      }, {});

    return Object.keys(blogsByCreated)
      .map((key) => ({
        year: key,
        blogs: blogsByCreated[key],
      }))
      .reverse();
  });

  // eleventyConfig.addCollection('tagList', collection => {
  //   const tagSet = new Set();
  //   const filterTag = new Set(['blog', 'tagList']);
  //   /**
  //     * collections.getAll() return an array about all collections
  //     * Each collection item have the following data:
  //     *  {
  //     *   ...
  //     *   data: { title: 'Test Title', tags: ['tag1', 'tag2'], date: 'Last Modified' },
  //     * }
  //   */

  //   collection.getAll().forEach(item => {
  //     if ('tags' in item.data) {
  //       const tags = typeof tags === 'string' ? [tags] : item.data.tags;
  //       for (const tag of tags.filter(tag => !filterTag.has(tag))) {
  //         tagSet.add(tag);
  //       }
  //     }
  //   });

  //   // Return an array in addCollections
  //   return [...tagSet];
  // });

  // html-minifer
  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  return {
    passthroughFileCopy: true,
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: '.',
      output: '_site',
      includes: '_includes',
    },
  };
};
