const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const { articles, articleContent, getPublishedArticles, getRelatedArticles, getFeaturedArticles } = require('./content-model.cjs');
const published = getPublishedArticles();
const p0 = require('./p0-check.cjs');
const retirements = require('./article-retirements.cjs');
const ids = new Set(articles.map(article => article.id));
assert.equal(ids.size, articles.length, 'Duplicate article IDs');
assert.equal(new Set(published.map(article => article.title)).size, published.length, 'Duplicate titles');
assert.equal(new Set(published.map(article => article.description)).size, published.length, 'Duplicate descriptions');
const sitemapIds = [...read('sitemap.xml').matchAll(/\/articles\/(\d+)<\/loc>/g)].map(match => Number(match[1]));
assert.deepEqual(sitemapIds.sort((a,b) => a-b), Array.from(published, article => article.id).sort((a,b) => a-b));
const forbidden = /Lorem ipsum|\bTODO\b|\bTBD\b|\[insert statistic\]/i;
function checkLocalLink(href, origin) {
    if (!href || /^(?:https?:|mailto:|tel:|#)/.test(href)) return;
    const url = new URL(href, 'https://www.tv96live.org/' + origin);
    const articleMatch = url.pathname.match(/^\/articles\/(\d+)$/);
    if (articleMatch) {
        assert(published.some(article => article.id === Number(articleMatch[1])), `Broken/draft link ${href} in ${origin}`);
        return;
    }
    const pathname = decodeURIComponent(url.pathname);
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    assert(fs.existsSync(path.join(root, file)) || fs.existsSync(path.join(root, file + '.html')), `Missing local link ${href} in ${origin}`);
}
for (const article of published) {
    const body = articleContent[article.id];
    assert(body?.trim(), `Empty body ${article.id}`);
    assert(!/<h1\b/i.test(body), `Body adds an H1: ${article.id}`);
    assert(/<h2\b/.test(body), `Missing headings ${article.id}`);
    assert(!forbidden.test(body), `Placeholder ${article.id}`);
    assert(article.author && article.category && article.description && article.publishedAt && article.wordCount, `Incomplete metadata ${article.id}`);
    assert(Number.isFinite(Date.parse(article.publishedAt)), `Invalid publication date ${article.id}`);
    const related = getRelatedArticles(article);
    assert.equal(related.length, 3, `Missing related items ${article.id}`);
    for (const item of related) assert(item.isPublished === true && item.id !== article.id);
    for (const match of body.matchAll(/href="([^"]+)"/g)) checkLocalLink(match[1], `articles/${article.id}`);
    if (article.id >= 12) {
        assert(article.sources?.length, `Missing source ${article.id}`);
        assert(/href="\/(?!\/)/.test(body), `No contextual links ${article.id}`);
        assert(!/streams\.js|<iframe\b|<img\b|href="[^"]*watch-live/i.test(body), `Unexpected media in guide ${article.id}`);
    }
}
for (const article of articles.filter(article => article.isPublished !== true)) {
    assert(!sitemapIds.includes(article.id));
    assert(!getFeaturedArticles().some(item => item.id === article.id));
}
const htmlFiles = [...fs.readdirSync(root).filter(file => file.endsWith('.html')), ...published.map(a => `articles/${a.id}.html`)];
for (const file of htmlFiles) {
    const html = read(file);
    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        if (/src=|application\/ld\+json/.test(match[1]) || !match[2].trim()) continue;
        new vm.Script(match[2], { filename: file });
    }
    const adScripts = (html.match(/<script\b[^>]*src="https:\/\/pagead2\.googlesyndication\.com/gi) || []).length;
    assert(adScripts <= 1, `Duplicate AdSense loader: ${file}`);
    if (['index.html', 'news.html', 'about.html'].includes(file)) {
        for (const match of html.matchAll(/href="([^"$]+)"/g)) checkLocalLink(match[1], file);
    }
}
const baseline = name => execFileSync('git', ['show', '16e286e:' + name], { cwd: root, encoding: 'utf8', maxBuffer: 2 ** 22 });
const original = name => execFileSync('git', ['show', '9ee47c6:' + name], { cwd: root, encoding: 'utf8', maxBuffer: 2 ** 22 });
const oldHtml = original('article-template.html');
const oldContext = vm.createContext({});
vm.runInContext(original('news-data.js') + '\n' + oldHtml.slice(oldHtml.indexOf('const articleBodies ='), oldHtml.indexOf('function formatEditorialDate')) + '\nglobalThis.oldArticles = articles;', oldContext);
const revisions = JSON.parse(read('.editorial/approved-source-revisions.json'));
const hash = text => require('node:crypto').createHash('sha256').update(text).digest('hex');
function preservedBody(id, body) {
    // Validate earlier approved revisions against the pre-P0 body; p0-check
    // independently checks the before/after hashes for each authorized change.
    const current = p0.review.bodies[id] ? p0.previous.articleContent[id] : articleContent[id];
    if (revisions[id]) {
        assert.equal(hash(body), revisions[id].before, `Revision baseline changed: ${id}`);
        assert.equal(hash(current), revisions[id].after, `Unreviewed editorial revision: ${id}`);
        assert(revisions[id].reason);
    } else assert.equal(current, body, `Existing body changed: ${id}`);
}
for (const article of oldContext.oldArticles) preservedBody(article.id, article.content);
const protectedFiles = ['api/matches.js', 'api/standings.js', 'matches-data.js', 'matches.html', 'standings.html', 'streams.js', 'watch-live.html', 'match-ids.html', 'history-data.js', 'site-config.js', 'robots.txt', 'ads.txt', 'privacy.html', 'terms.html', 'contact.html', 'sw.js'];
const removeAds = html => html.replace(/    <script\b[^>]*src="https:\/\/pagead2\.googlesyndication\.com[^>]*>[\s\S]*?<\/script>\r?\n/g, '');
const chromePages = new Set(['matches.html', 'standings.html', 'watch-live.html', 'privacy.html', 'terms.html', 'contact.html']);
const stripSiteChrome = (file, html) => {
    let normalized = html.replace(/\r\n/g, '\n');
    if (!chromePages.has(file)) return normalized;
    normalized = normalized.replace(/<header class="main-header">[\s\S]*?<\/header>/, '<header class="main-header"></header>');
    normalized = normalized.replace(/<footer class="main-footer">[\s\S]*?<\/footer>/, '<footer class="main-footer"></footer>');
    if (file === 'watch-live.html') normalized = normalized.replace(/    <script>\n        \/\/ PWA Install Button[\s\S]*?<\/script>\n/, '');
    return normalized.replace(/    <script defer src="https:\/\/cdn\.jsdelivr\.net\/npm\/lucide@0\.263\.0\/dist\/umd\/lucide\.min\.js"><\/script>\n/g, '');
};
execFileSync(process.execPath, [path.join(__dirname, 'sync-site-chrome.cjs'), '--check'], { cwd: root, stdio: 'inherit' });
assert(!read('watch-live.html').includes('// PWA Install Button'), 'Legacy install handler conflicts with shared header');
assert(read('site-header.js').includes("window.addEventListener('beforeinstallprompt'"), 'Shared install handler missing');
for (const file of protectedFiles) assert.equal(stripSiteChrome(file, p0.review.files[file] ? p0.baseline(file) : read(file)), stripSiteChrome(file, file === 'watch-live.html' ? removeAds(baseline(file)) : baseline(file)), `Protected file changed outside site chrome: ${file}`);
// Featured rendering is authorized; all other homepage JavaScript remains protected.
const inlineScripts = html => Array.from(html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)).filter(m => !/src=/.test(m[1])).map(m => m[2].replace(/\r\n/g, '\n'));
const approvedHomepage = baseline('index.html')
    .replace(/https:\/\/via\.placeholder\.com\/[^']+/g, '/football-fallback.svg')
    .replace('alt="${escapeArticleText(article.title)}"', 'alt="${escapeArticleText(article.imageAlt || article.title)}"');
const withoutFeaturedRenderer = html => html.replace(/    function updateNews\(\) \{[\s\S]*?\n    \}\n/, '    function updateNews() {}\n');
assert.deepEqual(inlineScripts(withoutFeaturedRenderer(read('index.html').replace(/\r\n/g, '\n'))), inlineScripts(withoutFeaturedRenderer(approvedHomepage.replace(/\r\n/g, '\n'))), 'Unrelated homepage logic changed');
for (const file of ['index.html', 'news.html', 'article-template.html', 'about.html', ...published.map(a => `articles/${a.id}.html`)]) {
    const loaders = html => Array.from(html.matchAll(/<script\b[^>]*src="(?:https:\/\/(?:pagead2\.googlesyndication\.com|cloud\.umami\.is)[^"]*|\/_vercel\/insights\/script\.js)"[^>]*>[\s\S]*?<\/script>/g), match => match[0].replace(/\r\n/g, '\n'));
    assert.deepEqual(loaders(read(file === 'article-template.html' ? '.editorial/article-template.html' : file)), loaders(baseline(file.startsWith('articles/') ? 'article-template.html' : file)), `Advertising/analytics changed: ${file}`);
}
assert(read('match-ids.html').includes('noindex'));
assert(read('offline.html').includes('noindex'));
console.log(`PASS: ${published.length} published bodies, ${articles.length - published.length} excluded drafts, unique metadata, contextual/related links, sitemap parity, inline JavaScript syntax, preserved existing bodies, ${protectedFiles.length} protected files, advertising and analytics loaders.`);

// Preserve every pre-fix body independently, including unpublished IDs 5 and 6.
const prior = vm.createContext({});
vm.runInContext(baseline('article-content.js') + '\nglobalThis.bodies = articleContent;', prior);
for (const [id, body] of Object.entries(prior.bodies)) preservedBody(id, body);
const config = JSON.parse(read('vercel.json'));
const oldConfig = JSON.parse(baseline('vercel.json'));
assert.equal(config.cleanUrls, oldConfig.cleanUrls);
assert.equal(config.trailingSlash, oldConfig.trailingSlash);
assert.deepEqual(config.headers, oldConfig.headers);
const notGeneratedRedirect = r => r.source !== '/article-template' && !Object.keys(retirements.merged).some(id => r.source === `/articles/${id}`);
assert.deepEqual(config.redirects.filter(notGeneratedRedirect), oldConfig.redirects);
assert(!config.rewrites?.some(r => r.source.startsWith('/articles/')));
assert(read('.vercelignore').split(/\r?\n/).includes('.editorial/'));
execFileSync(process.execPath, [path.join(__dirname, 'generate-static.cjs'), '--check'], { cwd: root, stdio: 'inherit' });

const cleanupBaseline = JSON.parse(read('.editorial/image-cleanup-baseline.json'));
assert.equal(hash(read('.vercelignore')), hash(cleanupBaseline['.vercelignore'].text), 'Cleanup changed deployment exclusion');
const stripGeneratedRedirects = text => {
    const value = JSON.parse(text);
    value.redirects = value.redirects.filter(notGeneratedRedirect);
    return value;
};
assert.deepEqual(stripGeneratedRedirects(read('vercel.json')), stripGeneratedRedirects(cleanupBaseline['vercel.json'].text), 'Cleanup changed protected deployment configuration');
for (const file of ['watch-live.html', 'offline.html']) {
    assert.equal(stripSiteChrome(file, p0.review.files[file] ? p0.baseline(file) : read(file)), stripSiteChrome(file, removeAds(cleanupBaseline[file].text)));
    assert(!/pagead2\.googlesyndication|adsbygoogle/.test(read(file)));
}
