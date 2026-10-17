const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const model = require('./content-model.cjs');
const e = require('./article-9-revision-evidence.json');
const hash = bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const bodyHash = text=>hash(text.replace(/\r\n/g,'\n'));
assert.equal(bodyHash(e.beforeBody),e.beforeBodyHash);
assert.equal(model.articleContent[9],e.beforeBody.replace('<h2>Use the right competition rules</h2>',e.insertion+'<h2>Use the right competition rules</h2>')+e.revision,'Exact insertion and every prior paragraph/correction');
assert.equal([...e.insertion.matchAll(/<p>/g)].length,4);
const current=JSON.parse(JSON.stringify(model.articles));
for(const before of e.articlesBefore) {
    const after=current.find(a=>a.id===before.id);
    for(const key of new Set([...Object.keys(before),...Object.keys(after)])) {if(before.id===23&&['sources','updatedAt','wordCount'].includes(key)){require('./consolidated-preservation.cjs').metadata(before);continue;}
        if(before.id===22&&['sources','updatedAt','wordCount'].includes(key)){require('./article-22-preservation.cjs').metadata(before);continue;}
        if(before.id===24&&['sources','updatedAt','wordCount'].includes(key)){require('./article-24-tiebreak-preservation.cjs').metadata(before);continue;}
        if(before.id===9&&['sources','updatedAt','wordCount'].includes(key))continue;
        if(before.id===21&&['sources','updatedAt','wordCount'].includes(key)){require('./article-21-preservation.cjs').metadata(before);continue;}
        assert.deepEqual(after[key],before[key],`Original metadata ${before.id}.${key}`);
    }
}
const a=current.find(a=>a.id===9),before=e.articlesBefore.find(a=>a.id===9);
assert.equal(a.updatedAt,'2026-10-12');
assert.deepEqual(a.sources.slice(0,5),e.sources);
assert.deepEqual(a.sources.slice(0,5).map(s=>s.url),[...e.insertion.matchAll(/href="([^"]+)"/g)].map(m=>m[1]));
assert.equal(a.sources.length,7);
assert.deepEqual(a.sources[5],before.sources[0]);
assert.equal(a.sources[6].url,before.sources[1].url);
assert(a.sources[6].name.startsWith('Comparison reading only:'));
for(const [id,h]of Object.entries(e.bodyHashesBefore))if(id!=='9')assert.equal(bodyHash(model.articleContent[id]),require('./article-21-preservation.cjs').body(id,h),`Unrelated body ${id}`);
for(const [file,h]of Object.entries(e.publicFilesBefore))assert.equal(hash(fs.readFileSync(file)),require('./article-21-preservation.cjs').file(file,e.generatedFiles[file]?.after || h),`Public preservation ${file}`);
for(const [file,approval]of Object.entries(e.sourceFiles))assert.equal(hash(fs.readFileSync(file)),require('./article-21-preservation.cjs').file(file,approval.after),`Authorized source ${file}`);
const related='articles/14.html',html=fs.readFileSync(related,'utf8');
const updated='<time datetime="2026-08-28T15:00:00+03:00">28 Aug 2026</time> · 4 min read';
assert.equal(html.split(updated).length,2);
assert.equal(hash(html.replace(updated,updated.replace('4 min read','3 min read'))),e.publicFilesBefore[related],'Only related Article 9 reading time changes');
const generated=fs.readFileSync('articles/9.html','utf8');
assert(generated.includes('"dateModified":"2026-10-12"'));
assert(generated.includes('"datePublished":"2026-08-28T15:00:00+03:00"'));
assert(generated.includes('https://www.tv96live.org/articles/9'));
console.log('PASS: exact Article 9 example/revision, all prior paragraphs/correction and metadata preserved; five consistent external citations plus retained comparisons; other bodies, Article 32, Standings, APIs and images unchanged.');
