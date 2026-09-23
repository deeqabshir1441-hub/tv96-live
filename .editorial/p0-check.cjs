// Explicit September 2026 editorial revision approvals; historical guards remain.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const review = require('./p0-review.json');
const model = require('./content-model.cjs');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const baseline = file => execFileSync('git', ['show', `${review.baseCommit}:${file}`], { cwd: root, encoding: 'utf8', maxBuffer: 2 ** 24 });
const hash = text => require('node:crypto').createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');
// Later user-authorized match coverage changes have their own narrow approvals.
// Keep validating all original P0 protections against their original baselines.
const coverage = review.coverageRevision;
const coverageBefore = file => coverage?.files[file]
    ? execFileSync('git', ['show', `${coverage.baseCommit}:${file}`], { cwd: root, encoding: 'utf8' })
    : read(file);
for (const [file, approval] of Object.entries(coverage?.files || {})) {
    assert.equal(hash(coverageBefore(file)), approval.before, `Coverage baseline: ${file}`);
    assert.equal(hash(read(file)), approval.after, `Unreviewed coverage change: ${file}`);
}
const context = vm.createContext({});
vm.runInContext(baseline('.editorial/article-content.js') + '\n' + baseline('.editorial/news-data.js') + '\nglobalThis.previous = { articleContent, articles };', context);
const previous = context.previous;
for (const [id, body] of Object.entries(model.articleContent)) {
    const approval = review.bodies[id];
    if (approval) {
        assert(approval.reason, `Missing revision reason: ${id}`);
        assert.equal(hash(previous.articleContent[id]), approval.before, `P0 body baseline: ${id}`);
        assert.equal(hash(body), approval.after, `Unreviewed P0 body change: ${id}`);
    } else assert.equal(body, previous.articleContent[id], `Unapproved body change: ${id}`);
}
for (const [file, approval] of Object.entries(review.files)) {
    assert.equal(hash(baseline(file)), approval.before, `P0 file baseline: ${file}`);
    assert.equal(hash(coverageBefore(file)), approval.after, `Unreviewed P0 page change: ${file}`);
}
const protectedFiles = ['api/matches.js', 'api/standings.js', 'matches-data.js', 'streams.js', 'site-config.js', 'history-data.js', 'ads.txt', 'robots.txt', 'sw.js', 'site-header.js', 'site-chrome.css', 'style.css', '.editorial/article-template.html'];
for (const file of protectedFiles) assert.equal(hash(coverageBefore(file)), hash(baseline(file)), `Protected system: ${file}`);
assert(fs.readFileSync(path.join(root, 'logo/Logo.png')).equals(execFileSync('git', ['show', `${review.baseCommit}:logo/Logo.png`], { cwd: root })), 'Logo changed');
const scripts = html => [...html.replace(/\r\n/g, "\n").matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map(m => ({ attributes: m[1], body: m[2] }));
const watchPlayer = html => scripts(html).find(s => s.body.includes("const video = document.getElementById('live-video')")).body;
assert.equal(watchPlayer(read('watch-live.html')), watchPlayer(baseline('watch-live.html')), 'Enabled HLS/player implementation changed');
const loaders = html => scripts(html).filter(s => /googlesyndication|umami|_vercel\/insights|consent|fundingchoices/.test(s.attributes + s.body));
for (const file of ['index.html', 'news.html', 'matches.html', 'standings.html', 'watch-live.html', 'about.html', 'privacy.html']) assert.deepEqual(loaders(read(file)), loaders(baseline(file)), `Advertising/analytics/consent changed: ${file}`);
const styles = html => [...html.replace(/\r\n/g, "\n").matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
assert.deepEqual(styles(read('index.html')), styles(baseline('index.html')), 'Homepage design CSS changed');
assert.deepEqual(Array.from(model.getPublishedArticles(), a => a.id), [3,9,10,12,13,14,15,16,17,18,19,21,22,23,24,32]);
for (const a of model.articles) assert.equal(a.publishedAt, previous.articles.find(old => old.id === a.id).publishedAt, `Historical publication date changed: ${a.id}`);
for (const a of model.getPublishedArticles()) {
    assert(Date.parse(a.publishedAt) <= Date.now(), `Future publication: ${a.id}`);
    assert(!a.updatedAt || Date.parse(a.updatedAt) <= Date.now(), `Future update: ${a.id}`);
    assert(model.getPublishedArticles().some(other => other.id !== a.id && model.getRelatedArticles(other).some(related => related.id === a.id)), `No incoming related links: ${a.id}`);
}
console.log('PASS: explicit P0 body/page approvals, original publication dates, no orphans, protected APIs/player/ads/analytics/logo/home styles.');
module.exports = { review, previous, baseline, coverageBefore };
