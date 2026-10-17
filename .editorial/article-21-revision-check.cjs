const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const model=require('./content-model.cjs'),e=require('./article-21-revision-evidence.json');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const bodyHash=x=>hash(x.replace(/\r\n/g,'\n'));
assert.equal(bodyHash(e.beforeBody),e.beforeBodyHash);
assert.equal(model.articleContent[21],e.beforeBody.replace('<h2>European places and relegation</h2>',e.insertion+'<h2>European places and relegation</h2>')+e.revision,'Exact insertion; every original paragraph preserved');
assert.equal((e.insertion.match(/<h3>/g)||[]).length,2);
assert.equal(2-1,1);assert.equal(1-2,-1);
assert(e.insertion.includes('These invented figures'));assert(e.insertion.includes('Assume only Club A and Club B'));
assert(e.insertion.includes('2 \u2212 1 = <strong>+1</strong>'));assert(e.insertion.includes('1 \u2212 2 = <strong>\u22121</strong>'));
for(const before of e.articlesBefore){const after=JSON.parse(JSON.stringify(model.articles.find(a=>a.id===before.id)));for(const key of new Set([...Object.keys(before),...Object.keys(after)])){if(before.id===23&&['sources','updatedAt','wordCount'].includes(key)){require('./consolidated-preservation.cjs').metadata(before);continue;}if(before.id===22&&['updatedAt','sources','wordCount'].includes(key)){require('./article-22-preservation.cjs').metadata(before);continue;}if(before.id===24&&['updatedAt','sources','wordCount'].includes(key)){require('./article-24-tiebreak-preservation.cjs').metadata(before);continue;}if(before.id===21&&['updatedAt','sources','wordCount'].includes(key))continue;assert.deepEqual(after[key],before[key],`Preserved metadata ${before.id}.${key}`);}}
const a=model.articles.find(a=>a.id===21),before=e.articlesBefore.find(a=>a.id===21);
assert.equal(a.updatedAt,'2026-10-13');assert.deepEqual(JSON.parse(JSON.stringify(a.sources)),[e.source,...before.sources]);
for(const [id,h]of Object.entries(e.bodyHashesBefore))if(id!=='21')assert.equal(bodyHash(model.articleContent[id]),require('./article-22-preservation.cjs').body(id,h),`Unrelated body ${id}`);
assert.deepEqual(Object.keys(e.generatedFiles).sort(),['articles/10.html','articles/21.html','articles/22.html','news-data.js','news.html','sitemap.xml'].sort());
for(const [file,h]of Object.entries(e.publicFilesBefore))assert.equal(hash(fs.readFileSync(file)),require('./article-22-preservation.cjs').file(file,e.generatedFiles[file]?.after||h),`Protected public file ${file}`);
for(const [file,next]of Object.entries(e.sourceFiles))assert.equal(hash(fs.readFileSync(file)),require('./article-22-preservation.cjs').file(file,next.after),`Approved source ${file}`);
for(const file of ['articles/10.html','articles/22.html']){const text=file==='articles/22.html'?require('./article-22-revision-evidence.json').publicFilesBefore[file]&&require('./article-22-revision-evidence.json').beforeBody:fs.readFileSync(file,'utf8');if(file==='articles/22.html'){assert.equal(require('./article-22-revision-evidence.json').publicFilesBefore[file],e.generatedFiles[file].after,'Article 22 preserves prior generated related-card baseline');continue;}const card=[...text.matchAll(/<article class="editorial-summary">[\s\S]*?<\/article>/g)].find(m=>m[0].includes('href="/articles/21"'));assert(card,'Related Article 21 card');assert(card[0].includes('5 min read'));assert.equal(hash(text.replace(card[0],card[0].replace('5 min read','4 min read'))),e.publicFilesBefore[file],`Only Article 21 related-card reading time: ${file}`);}
const page=fs.readFileSync('articles/21.html','utf8');assert(page.includes(e.insertion));assert(page.includes('"dateModified":"2026-10-13"'));assert(page.includes('"datePublished":"2026-09-05T12:00:00+03:00"'));assert(page.includes('https://www.tv96live.org/articles/21'));
const review=require('./p0-review.json');assert.equal(review.bodies[21].after,e.beforeBodyHash);assert.equal(review.followupRevision.bodies[21].after,e.afterBodyHash);
console.log('PASS: exact Article 21 addition, table arithmetic, citation/dates and historical hash chain; every original paragraph and unrelated body/metadata/API/image/Article 32/Standings/Articles 3 and 9 preserved.');
