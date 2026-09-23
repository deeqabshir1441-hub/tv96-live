const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const vm = require('node:vm');
const model = require('./content-model.cjs');
const server = http.createServer(require('./static-server.cjs'));
const published = model.getPublishedArticles();
const retirements = require('./article-retirements.cjs');
const escape = model.escapeArticleText;
const strip = text => text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const titles = new Set(), descriptions = new Set(), results = [];
    async function get(route, status = 200) {
        const response = await fetch(origin + route);
        assert.equal(response.status, status, `${route}: HTTP ${response.status}`);
        return response.text();
    }
    async function links(html, route) {
        for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
            const href = match[1].replace(/&amp;/g, '&');
            const target = new URL(href, origin + route);
            if (target.origin !== origin || target.pathname.startsWith('/_vercel/')) continue;
            await get(target.pathname + target.search);
        }
        assert(!/Loading article|Article Not Found|\{\{[A-Z]+\}\}/.test(html), `Unresolved content ${route}`);
    }
    for (const article of published) {
        const route = `/articles/${article.id}`;
        const html = await get(route);
        assert.equal((html.match(/<h1\b/g) || []).length, 1);
        assert(html.includes(`id="articleTitle">${escape(article.title)}</h1>`));
        assert(html.replace(/\r\n/g, '\n').includes(model.articleContent[article.id].replace(/\r\n/g, '\n')), `Body preservation ${route}`);
        assert(!/src="\/(article-content|news-data)\.js"/.test(html));
        const title = html.match(/<title[^>]*>(.*?)<\/title>/s)[1];
        const description = html.match(/name="description" content="([^"]+)"/)[1];
        assert.equal(title, escape(article.title + ' | TV96 Live'));
        assert.equal(description, escape(article.description));
        titles.add(title); descriptions.add(description);
        assert(html.includes(`rel="canonical" href="https://www.tv96live.org${route}"`));
        for (const field of ['title', 'description', 'url', 'image', 'type']) assert(html.includes(`property="og:${field}" content="`));
        const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
        assert.equal(schema['@type'], 'Article'); assert.equal(schema.headline, article.title);
        assert.equal(schema.datePublished, article.publishedAt); assert.equal(schema.author.name, article.author);
        assert.equal(schema.url, `https://www.tv96live.org${route}`);
        assert(html.includes(`id="articleAuthor">${escape(article.author)}</span>`));
        assert(html.includes(`id="articlePublished" datetime="${article.publishedAt}"`));
        assert(html.includes(model.getArticleReadingTime(article)));
        const related = html.split('id="relatedArticleCards">')[1].split('</section>')[0];
        assert.equal((related.match(/href="\/articles\/\d+"/g) || []).length, 3);
        await links(html, route);
        results.push({ route, status: 200, words: article.wordCount, h1: 1, related: 3 });
        if (article.id === 12) {
            const paragraphs = [...model.articleContent[12].matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].slice(0,3).map(m => strip(m[1]));
            console.log('RAW /articles/12: HTTP 200\n' + html.match(/<title[^>]*>.*?<\/title>/s)[0] + '\n' + html.match(/<meta[^>]*name="description"[^>]*>/)[0] + '\n' + html.match(/<link[^>]*rel="canonical"[^>]*>/)[0] + '\n' + html.match(/<h1\b[^>]*>.*?<\/h1>/s)[0] + '\n' + paragraphs.join('\n\n') + '\nArticle JSON-LD: ' + JSON.stringify(schema));
        }
    }
    assert.equal(titles.size, published.length); assert.equal(descriptions.size, published.length);
    const rawNews = (await get('/news')).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    const newsIds = [...new Set([...rawNews.matchAll(/href="\/articles\/(\d+)"/g)].map(m => Number(m[1])))].sort((a,b) => a-b);
    assert.deepEqual(newsIds, Array.from(published, a => a.id).sort((a,b) => a-b));
    await links(rawNews, '/news');
    const rawHome = (await get('/')).match(/<!-- BEGIN STATIC HOME -->([\s\S]*?)<!-- END STATIC HOME -->/)[1];
    assert.equal((rawHome.match(/class="home-story-link"/g) || []).length, 4);
    for (const a of model.getHomeArticles()) assert(rawHome.includes(`href="/articles/${a.id}"`));
    const rawWatch = await get('/watch-live');
    assert(rawWatch.includes('content="noindex, follow"'));
    const visibleWatch = strip(rawWatch.replace(/<template\b[^>]*>[\s\S]*?<\/template>/g, ''));
    assert(visibleWatch.includes('Live viewing is currently unavailable'));
    assert(!/1080p|Loading match|Football Competitions History|Server 1/.test(visibleWatch));
    const excluded = [...model.articles.filter(a => !a.isPublished && !retirements.merged[a.id]).map(a => `/articles/${a.id}`), ...retirements.removed.map(id => `/article-template?id=${id}`), '/articles/99999', '/article-template?id=5', '/article-template?id=99999', '/article-content.js', '/.editorial/REPORT.md', '/.editorial/season-drafts.md', '/.editorial/article-content.js', '/.editorial/news-data.js', '/.editorial/browser-results.json'];
    for (const route of excluded) await get(route, 404);
    for (const [id, destination] of Object.entries(retirements.merged)) {
        for (const route of [`/articles/${id}`, `/articles/${id}.html`, `/article-template?id=${id}`, `/article-template.html?id=${id}`]) {
            const response = await fetch(origin + route, { redirect: 'manual' });
            assert.equal(response.status, 308, route);
            assert.equal(response.headers.get('location'), `/articles/${destination}`, route);
        }
    }
    for (const id of retirements.removed) await get(`/articles/${id}.html`, 404);
    for (const article of published) {
        const response = await fetch(`${origin}/article-template.html?id=${article.id}`, { redirect: 'manual' });
        assert.equal(response.status, 308); assert.equal(response.headers.get('location'), `/articles/${article.id}`);
    }
    const publicContext = vm.createContext({});
    vm.runInContext(await get('/news-data.js') + '\nglobalThis.records = articles;', publicContext);
    assert.equal(publicContext.records.length, published.length); assert(publicContext.records.every(a => a.isPublished));
    const urls = [...(await get('/sitemap.xml')).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
    assert.equal(urls.length, 8 + published.length); assert.equal(new Set(urls).size, 8 + published.length);
    assert.deepEqual(urls.filter(u => u.startsWith('/articles/')).sort(), results.map(r => r.route).sort());
    assert.deepEqual(urls.filter(u => !u.startsWith('/articles/')).sort(), ['/', '/matches', '/standings', '/news', '/about', '/contact', '/privacy', '/terms'].sort());
    for (const route of urls) await get(route);
    for (const route of ['/', '/about', '/contact', '/privacy', '/terms']) await links((await get(route)).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''), route);
    fs.writeFileSync(require('node:path').join(__dirname, 'raw-html-results.json'), JSON.stringify({ mode: 'Local HTTP; Vercel clean URLs and deployment exclusions modeled; no JavaScript execution', articles: results, newsIds, excluded: excluded.map(route => ({ route, status: 404 })), sitemap: urls }, null, 2) + '\n');
    console.log(`PASS: ${published.length} raw article responses, News links, unique metadata, schema, preserved bodies, related/internal links, local assets, ${urls.length} sitemap URLs, draft/unknown/internal HTTP 404 and legacy redirects.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { server.closeAllConnections(); server.close(); });
