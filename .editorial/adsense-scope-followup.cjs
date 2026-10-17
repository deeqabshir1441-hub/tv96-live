// Local consistency evidence and optional read-only requests to specified public sources.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const model=require('./content-model.cjs');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const pages=['index.html','news.html','matches.html','standings.html','about.html','privacy.html','terms.html','contact.html','watch-live.html','offline.html',...model.getPublishedArticles().map(a=>`articles/${a.id}.html`)];
const records=pages.map(file=>{
 const html=read(file);return {file,publisherIds:[...new Set(html.match(/ca-pub-\d+/g)||[])],canonical:html.match(/rel="canonical" href="([^"]+)"/)?.[1]||null,robots:html.match(/name="robots" content="([^"]+)"/)?.[1]||null,localCmpMarkers:/__tcfapi|fundingchoices|fctype=gdpr|cmp\.js/i.test(html)};
});
for(const page of records){ assert(page.publisherIds.every(id=>id==='ca-pub-9924964891667864'));if(page.canonical)assert.equal(page.canonical,'https://www.tv96live.org'+(page.file==='index.html'?'/':'/'+page.file.replace(/\.html$/,'')),`Canonical ${page.file}`); }
assert.equal(read('ads.txt').trim(),'google.com, pub-9924964891667864, DIRECT, f08c47fec0942fa0');
assert(read('robots.txt').includes('Sitemap: https://www.tv96live.org/sitemap.xml'));
const sitemap=[...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(sitemap.length,24);assert.equal(new Set(sitemap).size,24);
for(const article of model.getPublishedArticles())assert(sitemap.includes('https://www.tv96live.org/articles/'+article.id));
const targets=[
 'https://ligue1.com/en/articles/l1_article_93-',
 'https://ligue1.com/en/articles/l1_article_5074-',
 'https://www.lfp.fr/article/publication-du-calendrier-general-de-la-ligue-1-mcdonald-s-pour-la-saison-2026-2027',
 'https://ligue1.com/en/articles/l1_article_5328-when-does-the-season-start-for-ligue-1-mc-donald-s-clubs'
];
(async()=>{
 const resultPath=path.join(__dirname,'adsense-scope-followup-results.json');
 const previous=fs.existsSync(resultPath)?JSON.parse(fs.readFileSync(resultPath,'utf8')):null;
 const sources=process.argv.includes('--sources')?await Promise.all(targets.map(async url=>{try{const res=await fetch(url,{signal:AbortSignal.timeout(20000)});await res.arrayBuffer();return{url,observedAt:new Date().toISOString(),status:res.status,finalUrl:res.url};}catch(e){return{url,observedAt:new Date().toISOString(),error:e.message};}})):previous?.sources||[];
 const result={checkedAt:new Date().toISOString(),pages:records,publisherConsistency:'pass',adsTxt:read('ads.txt').trim(),robots:read('robots.txt').trim(),sitemap:{count:sitemap.length,urls:sitemap},sources,limits:'No AdSense account access or remote CMP configuration verification. Canonical and publisher checks local; public source availability is a point-in-time result.'};
 fs.writeFileSync(path.join(__dirname,'adsense-scope-followup-results.json'),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({pages:records.length,sitemap:sitemap.length,publisherConsistency:'pass',canonicalConsistency:'pass',localCmpMarkers:records.filter(p=>p.localCmpMarkers).length,sources},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
