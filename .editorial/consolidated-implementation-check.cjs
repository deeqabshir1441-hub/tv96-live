const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),m=require('./content-model.cjs'),e=require('./consolidated-implementation-evidence.json');
const read=f=>fs.readFileSync(f,'utf8'),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
assert.equal(hash(e.beforeBody),e.beforeBodyHash);
assert.equal(m.articleContent[23],e.beforeBody.replace('<h2>Why the run-in has several boundaries</h2>',e.insertion+'<h2>Why the run-in has several boundaries</h2>')+e.revision);
assert.equal((e.insertion.match(/<p>/g)||[]).length,4);assert.equal((e.insertion.match(/<h3>/g)||[]).length,1);
const proposal=read('.editorial/ARTICLE_23_BUNDESLIGA_PROPOSAL.md');
const block=proposal.split('### Historical worked example: ')[1].split('\n## Metadata')[0].trim();
assert.deepEqual(block.split(/\r?\n\s*\r?\n/),[e.title,...e.paragraphs]);
assert(e.insertion.includes('0 + 3 = 3')&&e.insertion.includes('3 + 0 = 3')&&e.insertion.includes('6–5'));
for(const b of e.articlesBefore){const a=JSON.parse(JSON.stringify(m.articles.find(x=>x.id===b.id)));if(b.id===23){const expected={...b,updatedAt:'2026-10-17',sources:[...e.sources,...b.sources],wordCount:1050};assert.deepEqual(a,expected);}else assert.deepEqual(a,b,'Protected metadata '+b.id);}
for(const [id,h]of Object.entries(e.bodyHashesBefore))assert.equal(hash(m.articleContent[id]),id==='23'?e.afterBodyHash:h,'Body preservation '+id);
for(const f of ['articles/9.html','articles/21.html','articles/24.html']){const old=e.beforeTexts[f],card=[...old.matchAll(/<article class="editorial-summary">[\s\S]*?<\/article>/g)].find(x=>x[0].includes('href="/articles/23"'))[0];assert.equal(read(f),old.replace(card,card.replace('4 min read','5 min read')),'Only authorized related label '+f);}
for(const f of ['index.html','about.html']){let expected=e.beforeTexts[f];for(const c of e.changes.filter(c=>c.file===f))expected=expected.replace(c.before,c.after);if(f==='index.html'){const card=[...expected.matchAll(/<article class="home-story[\s\S]*?<\/article>/g)].find(x=>x[0].includes('href="/articles/23"'))[0];expected=expected.replace(card,card.replace('4 min read','5 min read'));}assert.equal(read(f),expected,'Only exact approved authored changes and generated label '+f);}
for(const f of e.publicFiles)assert.equal(hash(fs.readFileSync(f)),e.generatedFiles[f]?.after||e.beforeHashes[f],'Public file/image/API/Standings preservation '+f);
for(const[f,v]of Object.entries(e.sourceFiles))assert.equal(hash(fs.readFileSync(f)),v.after,'Source '+f);
const review=require('./p0-review.json');assert.equal(review.bodies[23].after,e.beforeBodyHash);assert.equal(review.followupRevision.bodies[23].after,e.afterBodyHash);
assert.equal(m.getArticleReadingTime(m.articles.find(a=>a.id===23)),'5 min read');
// Reconstruct prior generated discovery output from preserved source, without writing it.
const vm=require('node:vm'),context=vm.createContext({});
vm.runInContext(e.beforeTexts['.editorial/news-data.js']+'\n'+e.beforeTexts['.editorial/article-content.js']+'\nglobalThis.old={articles,articleContent,'+m.helpers.join(',')+'};',context);
const old=context.old;
for(const a of old.getPublishedArticles())a.wordCount=old.articleContent[a.id].replace(/<[^>]*>/g,' ').replace(/&[^;]+;/g,' ').trim().split(/\s+/).length;
const delivery=a=>a.image?a.image.replace(/\.png$/,'.webp'):a.image;
const priorMetadata='// Generated published-only metadata. Edit .editorial/news-data.js and regenerate.\nconst articles = '+JSON.stringify(old.getPublishedArticles().map(({imageCandidate,imageReviewRequired,sourceReviewRequired,imageType,rightsStatus,brandingReview,...a})=>({...a,image:delivery(a)})),null,4)+';\n\n'+m.helpers.map(n=>old[n].toString()).join('\n\n')+'\n';
assert.equal(hash(priorMetadata),e.beforeHashes['news-data.js'],'Only Article 23 generated metadata changes');
let priorNews=read('news.html');
for(const[name,value]of Object.entries({FEATURED:old.getFeaturedArticles(3).map(old.renderArticleSummary).join('\n'),NEWS:[...old.getPublishedArticles()].sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt)||b.id-a.id).map(a=>old.renderNewsCard({...a,image:delivery(a)})).join('\n'),COUNT:old.getPublishedArticles().length+' articles · All'}))priorNews=priorNews.replace(new RegExp('(<!-- BEGIN STATIC '+name+' -->)[\\s\\S]*?(<!-- END STATIC '+name+' -->)'),(_,start,end)=>start+value+end);
assert.equal(hash(priorNews),e.beforeHashes['news.html'],'Only approved generated News cards');
assert.equal(hash(read('sitemap.xml').replace(/(<loc>https:\/\/www.tv96live.org\/articles\/23<\/loc><lastmod>)2026-10-17/,'$12026-09-05')),e.beforeHashes['sitemap.xml'],'Only Article 23 sitemap revision');
assert(read('articles/23.html').includes(e.insertion));assert(read('articles/23.html').includes('"dateModified":"2026-10-17"'));
console.log('PASS: exact approved Article 23/Home/About; 1050 words, 4-to-5 minutes; historical records and all unrelated public files preserved.');
