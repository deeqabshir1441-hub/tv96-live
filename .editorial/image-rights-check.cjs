const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const model = require('./content-model.cjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const origin = 'https://www.tv96live.org';
const fallback = '/editorial-fallback.png';
const published = model.getPublishedArticles();
const registered = new Map();
const manifest = JSON.parse(read('.editorial/optimized-images.json'));
for (const a of published) {
    if (!a.image) continue;
    if (a.image === fallback) {
        assert.equal(a.imageType, 'site-fallback', `Invalid fallback type: ${a.id}`);
        assert.equal(a.rightsStatus, 'reviewed', `Unreviewed fallback: ${a.id}`);
        assert.equal(a.brandingReview, 'clear', `Fallback branding must be clear: ${a.id}`);
        assert(a.imageAlt?.trim(), `Missing fallback alt: ${a.id}`);
        continue;
    }
    assert(/^\/images\/articles\/[a-z0-9-]+\.png$/.test(a.image), `Invalid source: ${a.id}`);
    assert.equal(a.imageType, 'original-editorial', `Unregistered type: ${a.id}`);
    assert.equal(a.rightsStatus, 'reviewed', `Unreviewed rights: ${a.id}`);
    assert(['required', 'clear'].includes(a.brandingReview), `Missing branding review: ${a.id}`);
    if ([12, 14].includes(a.id)) assert.equal(a.brandingReview, 'required');
    assert(a.imageAlt?.trim(), `Missing alt: ${a.id}`);
    const delivered = a.image.replace(/\.png$/, '.webp');
    assert(manifest[a.image], `Missing optimization manifest entry: ${a.id}`);
    for (const asset of [a.image, delivered]) assert(fs.existsSync(path.join(root, asset.slice(1))), `Missing asset: ${asset}`);
    assert.equal(fs.readFileSync(path.join(root, delivered.slice(1))).toString('ascii', 0, 4), 'RIFF', `Invalid WebP: ${delivered}`);
    assert(!registered.has(delivered), `Duplicate path: ${delivered}`);
    registered.set(delivered, a);
}
assert.deepEqual(Object.keys(manifest).sort(), Array.from(published.filter(a => a.image && a.image !== fallback), a => a.image).sort(), 'Orphan or unregistered manifest entry');
assert.deepEqual(fs.readdirSync(path.join(root, 'images/articles')).filter(name => name.endsWith('.webp')).sort(), [...registered.keys()].map(name => path.basename(name)).sort(), 'Orphan or unregistered WebP file');
const allowed = new Set([fallback, '/football-fallback.svg', ...registered.keys()]);
for (const file of ['index.html', 'news.html', 'news-data.js', ...published.map(a => `articles/${a.id}.html`)]) {
    const html = read(file);
    assert(!/news(?:%20| )image\//i.test(html), `Old photograph: ${file}`);
    assert(!/imageCandidate|imageType|rightsStatus|brandingReview/.test(html), `Private metadata leaked: ${file}`);
    if (file === 'news-data.js') {
        const context = vm.createContext({});
        vm.runInContext(html + '\nglobalThis.records=articles;', context);
        for (const a of context.records) assert(!a.image || a.image === fallback || registered.has(a.image), `Unregistered public image: ${a.id}`);
        continue;
    }
    if (file === 'index.html') {
        assert(html.includes('const latestArticles = getPublishedArticles()'), 'Homepage must use central published records');
        continue;
    }
    if (file === 'news.html') {
        for (const card of html.matchAll(/<div class="news-card-image"><img\b[^>]*src="([^"]+)"[^>]*>/g)) {
            assert(card[1] === fallback || registered.has(card[1]), `External or unregistered News card image: ${card[1]}`);
            assert(card[0].includes('alt="'), `Missing News alt: ${card[1]}`);
        }
    }
    for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)) {
        const src = match[1];
        const siteChromeImage = [html.match(/<header class="main-header">[\s\S]*?<\/header>/)?.[0], html.match(/<footer class="main-footer">[\s\S]*?<\/footer>/)?.[0]].some(section => section?.includes(match[0]));
        if (src === '/logo/Logo.png' && siteChromeImage) {
            assert(fs.existsSync(path.join(root, 'logo/Logo.png')), `Missing site logo: ${file}`);
            assert(match[0].includes('alt="TV96 Live Logo"'), `Missing logo alt: ${file}`);
            continue;
        }
        if (!file.startsWith('articles/') && !src.startsWith('/images/articles/')) continue;
        assert(allowed.has(src), `Unregistered editorial image: ${file}: ${src}`);
        assert(match[0].includes('alt="'), `Missing alt: ${file}: ${src}`);
    }
    if (file.startsWith('articles/')) {
        const a = published.find(x => x.id === Number(path.basename(file, '.html')));
        const expected = a.image === fallback ? fallback : a.image?.replace(/\.png$/, '.webp') || fallback;
        const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
        assert(html.includes(`property="og:image" content="${origin}${expected}"`), `Wrong OG image: ${file}`);
        assert.equal(schema.image, a.image ? origin + expected : undefined, `Wrong Article image: ${file}`);
        const bodyImages = [...html.matchAll(/<img class="article-main-image"[^>]*src="([^"]+)"[^>]*>/g)];
        assert.equal(bodyImages.length, a.image ? 1 : 0, `Wrong body image count: ${file}`);
        if (a.image) assert.equal(bodyImages[0][1], expected, `Wrong body image: ${file}`);
    }
}
for (const [asset, a] of registered) {
    assert(read('news.html').includes(`src="${asset}"`), `News card missing: ${a.id}`);
    assert(read('news-data.js').includes(`"image": "${asset}"`), `Home metadata missing: ${a.id}`);
}
for (const a of published.filter(item => item.image === fallback)) {
    assert(read('news.html').includes(`<a href="/articles/${a.id}" class="news-card`) && read('news.html').includes(`src="${fallback}"`), `Fallback News card missing: ${a.id}`);
    assert(read('news-data.js').includes(`"image": "${fallback}"`), `Fallback Home metadata missing: ${a.id}`);
}
for (const id of [1, 2, 3]) assert.equal(model.articles.find(a => a.id === id).image, '');
for (const file of ['offline.html', 'watch-live.html']) assert(!/pagead2\.googlesyndication|adsbygoogle/.test(read(file)));
assert(fs.statSync(path.join(root, fallback.slice(1))).size < 50000);
console.log(`PASS: ${registered.size} registered local WebP images, fallback, suppressed photographs and private review flags.`);
