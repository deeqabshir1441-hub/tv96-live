// Read-only live audit. Never calls stream hosts or account/deployment APIs.
const fs = require('node:fs');
const path = require('node:path');
const model = require('./content-model.cjs');
const root = path.resolve(__dirname, '..');
const origin = 'https://www.tv96live.org';
const strip = s => s.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
async function request(url) {
    const chain = [];
    try {
        for (let i = 0; i < 8; i++) {
            const r = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
            const location = r.headers.get('location');
            chain.push({ url, status: r.status, location });
            if ([301,302,303,307,308].includes(r.status) && location) { await r.body?.cancel(); url = new URL(location, url).href; continue; }
            const type = r.headers.get('content-type') || '';
            let body = '';
            if (/text|json|xml/.test(type)) body = await r.text(); else await r.body?.cancel();
            return { requested: chain[0].url, chain, finalUrl: url, status: r.status, type, robotsHeader: r.headers.get('x-robots-tag'), body };
        }
        return { chain, error: 'Redirect limit' };
    } catch (e) { return { requested: chain[0]?.url || url, chain, error: `${e.message}: ${e.cause?.message || ''}` }; }
}
async function batch(urls) {
    const results = []; let next = 0;
    await Promise.all(Array.from({length: 4}, async () => { while(next < urls.length) { const i = next++; results[i] = await request(urls[i]); } }));
    return results;
}
(async () => {
    const pages = ['/', '/news','/matches','/standings','/about','/contact','/privacy','/terms','/watch-live'];
    const published = model.getPublishedArticles();
    const routes = [...pages, ...published.map(a => `/articles/${a.id}`), '/robots.txt','/ads.txt','/sitemap.xml','/googleae8e7d185b7c98c3.html','/site-config.js','/streams.js','/match-ids','/offline','/.editorial/news-data.js','/article-content.js','/articles/99999', ...model.articles.filter(a => !a.isPublished).map(a => `/articles/${a.id}`), ...[8,20,25].flatMap(id => [`/articles/${id}.html`, `/article-template.html?id=${id}`]), ...published.map(a => `/articles/${a.id}.html`), '/articles/12/','/news/','/news.html','/index.html','/api/matches','/api/standings?league=PL'];
    const urls = [...new Set(routes.map(r=>origin+r).concat(['http://tv96live.org/','http://www.tv96live.org/','https://tv96live.org/','https://tv96live.org/articles/12']))];
    const responses = await batch(urls);
    const assets = new Set(); const links = new Set();
    const pagesOut = responses.map(({body, ...r}) => {
        if (!body) return r;
        if (/html/.test(r.type)) {
            const markup = body.replace(/<(script|template)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
            for(const m of markup.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
                try { const u = new URL(m[1].replace(/&amp;/g,'&'),r.finalUrl); if(u.origin !== origin || u.pathname.startsWith('/_vercel/')) continue;
                    (m[0].startsWith('src=') || /\.(css|png|svg|webp|ico|js)$/.test(u.pathname) ? assets : links).add(u.href.split('#')[0]);
                } catch {}
            }
            const schemas = [...body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>{try{return JSON.parse(m[1]);}catch{return 'INVALID JSON';}});
            const article = published.find(a=>r.requested === origin+`/articles/${a.id}`);
            return {...r,title:body.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1],canonical:body.match(/rel="canonical"[^>]*href="([^"]+)"/)?.[1],robotsMeta:body.match(/name="robots"[^>]*content="([^"]+)"/)?.[1],visibleText:strip(body),schemas,articleBodyMatchesLocal:article ? body.replace(/\r\n/g,'\n').includes(model.articleContent[article.id].replace(/\r\n/g,'\n')) : undefined,scriptSources:[...body.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m=>m[1]),articleIds:[...new Set([...body.matchAll(/href="\/articles\/(\d+)"/g)].map(m=>+m[1]))]};
        }
        // Only public configuration/data, never upstream tokens or stream URLs.
        return {...r,body:body.slice(0,3000)};
    });
    const checked = new Set(urls);
    const resources = await batch([...new Set([...assets,...links])].filter(u=>!checked.has(u) && !/streams|watch-live\?/.test(u)));
    const sourceUrls = [...new Set(published.flatMap(a=>a.sources||[]).map(s=>s.url))];
    const sources = (await batch(sourceUrls)).map(({body,...r})=>({...r,title:body?.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1],textSample:strip(body||'').slice(0,1500)}));
    const evidence = {checkedAt:new Date().toISOString(),mode:'Live Node HTTP, manual redirects, no browser execution',pages:pagesOut,resources:resources.map(({body,...r})=>r),sources};
    fs.writeFileSync(path.join(__dirname,'adsense-production-results.json'),JSON.stringify(evidence,null,2)+'\n');
    console.log(JSON.stringify({pages:pagesOut.length,resources:resources.length,sources:sources.length,errors:pagesOut.filter(r=>r.error),unexpectedResources:resources.filter(r=>r.error||r.status>=400).map(({body,...r})=>r),bodyDifferences:pagesOut.filter(r=>r.articleBodyMatchesLocal===false).map(r=>r.requested)},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
