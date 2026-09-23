const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = vm.createContext({});
const helpers = ['getPublishedArticles', 'getRelatedArticles', 'getFeaturedArticles', 'escapeArticleText', 'getArticleReadingTime', 'renderArticleSummary', 'formatArticleDate', 'renderNewsCard', 'getHomeArticles', 'renderHomeStory', 'renderHomeFeatured'];
vm.runInContext(fs.readFileSync(path.join(__dirname, 'news-data.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, 'article-content.js'), 'utf8') + `\nglobalThis.model = { articles, articleContent, ${helpers.join(', ')} };`, context);
const model = context.model;
for (const article of model.getPublishedArticles()) {
    const body = model.articleContent[article.id];
    if (!body?.trim()) throw new Error(`Missing body: ${article.id}`);
    article.wordCount = body.replace(/<[^>]*>/g, ' ').replace(/&[^;]+;/g, ' ').trim().split(/\s+/).length;
}
module.exports = { ...model, helpers };
