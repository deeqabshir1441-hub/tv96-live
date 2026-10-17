const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const model = require('./content-model.cjs');
const review = require('./p0-review.json');
const { previous } = require('./p0-check.cjs');
const article = model.articles.find(a => a.id === 32);
const original = previous.articles.find(a => a.id === 32);
assert.equal(article.title, original.title, 'Historical headline must remain intact');
assert.equal(article.publishedAt, original.publishedAt, 'Historical publication timestamp must remain intact');
assert.equal(article.articleType, 'Archived report');
assert.equal(article.category, 'Manchester United / Archived Reports');
assert.equal(article.section, 'Archived Reports');
const body = model.articleContent[32].replace(/\r\n/g, '\n');
const historical = body.slice(body.indexOf('<p><strong>BBC Sport reports'));
assert.equal(crypto.createHash('sha256').update(historical).digest('hex'), review.followupRevision.bodies[32].before, 'Historical reporting must remain byte-identical');
assert(body.startsWith('<p><em>Archived report — first published 15 September 2026.'));
assert(body.includes('https://www.manutd.com/en/teams/under-18s-team/joseph-gabriel'));
for (const file of ['index.html', 'news.html', 'articles/32.html']) {
  const html = fs.readFileSync(require('node:path').join(__dirname, '..', file), 'utf8');
  assert(html.includes('Manchester United / Archived Reports'), `Archive category missing: ${file}`);
  assert(html.includes(article.title), `Historical title missing: ${file}`);
  assert(html.includes('2026-09-15T20:00:00+03:00'), `Historical date missing: ${file}`);
}
const page = fs.readFileSync(require('node:path').join(__dirname, '..', 'articles/32.html'), 'utf8');
assert(page.includes('This page does not establish Gabriel&#39;s registration status today.') || page.includes("This page does not establish Gabriel's registration status today."));
assert(!page.includes('Breaking news'));
console.log('PASS: approved Article 32 archive labels/notice, unchanged historical reporting/headline/publication date, generated Home/News/article presentation.');
