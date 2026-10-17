const fs = require('node:fs');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const model = require('./content-model.cjs');
const evidence = require('./article-24-revision-evidence.json');
const hash = text => crypto.createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');
const article = JSON.parse(JSON.stringify(model.articles.find(a => a.id === 24)));
for (const key of Object.keys(evidence.article24)) if (!['sources','updatedAt','wordCount'].includes(key)) assert.deepEqual(article[key], evidence.article24[key], `Article 24 metadata changed: ${key}`);
const tiebreak=require('./article-24-tiebreak-evidence.json');
assert.equal(tiebreak.articlesBefore.find(a=>a.id===24).updatedAt,'2026-10-12','Retain original correction metadata evidence');
assert.equal(article.updatedAt, '2026-10-13');
const priorParagraphs = evidence.beforeBody.match(/<h2>Relegation and the play-off route<\/h2>\n(<p>.*?<\/p>)\n(<p>.*?<\/p>)/).slice(1);
let expected = evidence.beforeBody;
priorParagraphs.forEach((text, i) => { expected = expected.replace(text, '<p>' + evidence.replacement[i] + '</p>'); });
expected = expected.replace('<h2>Relegation and the play-off route</h2>', evidence.revisionNote + '<h2>Relegation and the play-off route</h2>');
assert.equal(tiebreak.beforeBody,expected,'Retain exact original correction and revision baseline');
assert.equal(model.articleContent[24],expected.replace('<h2>History and development</h2>',tiebreak.insertion+'<h2>History and development</h2>')+tiebreak.revision,'Only original correction plus approved tiebreak insertion/revision');
for (const [id, digest] of Object.entries(evidence.bodies)) if (id !== '24') {
    const approved = id === '3' ? require('./article-3-revision-evidence.json') : id === '9' ? require('./article-9-revision-evidence.json') : null;
    if (approved) assert.equal(approved.beforeBodyHash, digest, 'Article 3 preserves earlier body baseline');
    assert.equal(hash(model.articleContent[id]), require('./article-21-preservation.cjs').body(id,approved?.afterBodyHash || digest), `Unrelated body changed: ${id}`);
}
assert.deepEqual(JSON.parse(JSON.stringify(model.articles.find(a => a.id === 32))), evidence.article32);
assert.equal(hash(fs.readFileSync('articles/32.html', 'utf8')), evidence.article32Page);
for (const [ext,digest] of Object.entries(evidence.article32Images)) assert.equal(crypto.createHash('sha256').update(fs.readFileSync('images/articles/jj-gabriel.' + ext)).digest('hex'), digest);
assert(article.sources[0].name.includes('Article 519 ter'));
assert(article.sources.slice(2,4).every(s => s.name.startsWith('Historical context')));
console.log('PASS: exact approved Article 24 paragraphs, dated revision, original metadata and all unrelated bodies preserved; Article 32 metadata/page/images unchanged.');
