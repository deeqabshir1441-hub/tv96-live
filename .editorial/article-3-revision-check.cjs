const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const model = require('./content-model.cjs');
const evidence = require('./article-3-revision-evidence.json');
const article9 = require('./article-9-revision-evidence.json');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bodyHash = body => hash(body.replace(/\r\n/g, '\n'));
assert.equal(bodyHash(evidence.beforeBody), evidence.beforeBodyHash);
assert.equal(model.articleContent[3], evidence.beforeBody.replace('<h2>Compare opportunities as well as totals</h2>', evidence.insertion + '<h2>Compare opportunities as well as totals</h2>') + evidence.revision);
const current = JSON.parse(JSON.stringify(model.articles));
for (const before of evidence.articlesBefore) {
    const after = current.find(a=>a.id===before.id);
    if (before.id===9) assert.deepEqual(article9.articlesBefore.find(a=>a.id===9),before,'Preserve Article 9 prior metadata baseline');
    for (const key of new Set([...Object.keys(before),...Object.keys(after)])) {if(before.id===23&&['sources','updatedAt','wordCount'].includes(key)){require('./consolidated-preservation.cjs').metadata(before);continue;}
        if (before.id===22 && ['updatedAt','sources','wordCount'].includes(key)) { require('./article-22-preservation.cjs').metadata(before); continue; }
        if (before.id===24 && ['updatedAt','sources','wordCount'].includes(key)) { require('./article-24-tiebreak-preservation.cjs').metadata(before); continue; }
        if (before.id===3 && ['updatedAt','sources','wordCount'].includes(key)) continue;
        if (before.id===9 && ['updatedAt','sources','wordCount'].includes(key)) continue;
        if (before.id===21 && ['updatedAt','sources','wordCount'].includes(key)) { require('./article-21-preservation.cjs').metadata(before); continue; }
        assert.deepEqual(after[key],before[key],`Preserved metadata ${before.id}.${key}`);
    }
}
const article = current.find(a=>a.id===3);
assert.equal(article.updatedAt, '2026-10-12');
assert.deepEqual(article.sources.slice(3),evidence.articlesBefore.find(a=>a.id===3).sources);
assert.equal(article.sources.length,4);
assert.deepEqual(article.sources.slice(0,3).map(s=>s.url),[...evidence.insertion.matchAll(/href="([^"]+)"/g)].map(m=>m[1]),'Metadata cites the same three external sources as the example');
for(const [id,digest]of Object.entries(evidence.bodyHashesBefore)) if(id!=='3') {
    if(id==='9') assert.equal(article9.beforeBodyHash,digest,'Article 9 body approval chain');
    assert.equal(bodyHash(model.articleContent[id]),require('./article-21-preservation.cjs').body(id,id==='9'?article9.afterBodyHash:digest),`Unrelated body ${id}`);
}
for(const [file,digest]of Object.entries(evidence.publicFilesBefore)) {
    const previous=evidence.generatedFiles[file]?.after || digest,approval=article9.generatedFiles[file];
    if(approval)assert.equal(approval.before,previous,`Article 9 public approval chain ${file}`);
    assert.equal(hash(fs.readFileSync(file)),require('./article-21-preservation.cjs').file(file,approval?.after || previous),`Public preservation ${file}`);
}
for(const [file,approval]of Object.entries(evidence.sourceFiles)) {
    const next=article9.sourceFiles[file];
    if(next)assert.equal(next.before,approval.after,`Article 9 source approval chain ${file}`);
    assert.equal(hash(fs.readFileSync(file)),require('./article-21-preservation.cjs').file(file,next?.after || approval.after),`Approved source ${file}`);
}
for(const file of ['articles/13.html','articles/16.html']) {
    const text=fs.readFileSync(file,'utf8');
    const updated='<time datetime="2026-07-14T12:02:02+03:00">14 Jul 2026</time> · 4 min read';
    assert.equal(text.split(updated).length,2);
    assert.equal(hash(text.replace(updated,updated.replace('4 min read','3 min read'))),evidence.publicFilesBefore[file],`Only related Article 3 reading time changes: ${file}`);
}
console.log('PASS: exact Article 3 insertion/revision, all earlier paragraphs/correction and original metadata preserved; every unrelated body/API/image/Article 32 unchanged; related cards only update reading time.');
