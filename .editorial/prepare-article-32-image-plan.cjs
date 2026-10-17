// Review-only preparation: no image generation, substitution, deletion or deployment.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const model = require('./content-model.cjs');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (['.git', 'node_modules', '.qodo', '.vscode'].includes(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
const targets = ['images/articles/jj-gabriel.png', 'images/articles/jj-gabriel.webp'];
const references = [];
for (const file of walk(root).filter(file => /\.(?:html|js|cjs|css|json|xml|txt|md|patch|proposed)$/i.test(file))) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  read(relative).split('\n').forEach((line, i) => {
    for (const asset of targets) if (line.includes(asset)) references.push({ asset, file: relative, line: i + 1, deployment: relative.startsWith('.editorial/') ? 'excluded private source/test/report' : 'public source/output' });
  });
}
const legacy = fs.readdirSync(path.join(root, 'news image')).filter(name => fs.statSync(path.join(root, 'news image', name)).isFile()).map(name => 'news image/' + name).sort();
const bannerCandidates = ['banner/banner.jpg', 'banner/banner1.jpg', 'banner/hero.jpg', 'banner/omar.jpg'];
const publicFiles = walk(root).map(file => path.relative(root, file).replaceAll('\\', '/')).filter(file => !file.startsWith('.editorial/') && /\.(?:html|js|css|json|xml|txt|svg)$/i.test(file));
const unused = [...legacy, ...bannerCandidates].map(asset => {
  const refs = publicFiles.flatMap(file => read(file).split('\n').flatMap((line, i) => {
    let decoded; try { decoded = decodeURIComponent(line); } catch { decoded = line; }
    return decoded.toLowerCase().includes(asset.toLowerCase()) ? [`${file}:${i + 1}`] : [];
  }));
  assert.equal(refs.length, 0, `Proposed exclusion has a public reference: ${asset}`);
  return { path: asset, bytes: fs.statSync(path.join(root, asset)).size, sha256: digest(fs.readFileSync(path.join(root, asset))), publicLiteralReferences: refs, rightsEvidence: asset.includes('GettyImages') ? 'Agency-named photographic file; no licence established in available evidence; attribution/source ID requires verification.' : 'Legacy image/photo/composite; no creation/licence evidence established; do not infer original authorship from appearance.' };
});
const current = model.articles.find(a => a.id === 32);
assert.equal(current.imageType, 'user-provided');
assert.equal(current.rightsStatus, 'user-provided');
assert.equal(current.imageReviewRequired, true);
const oldSource = read('.editorial/news-data.js');
let proposed = oldSource.replace('"image": "/images/articles/jj-gabriel.png"', '"image": "/images/articles/football-academy-generic.png"')
  .replace('"imageAlt": "JJ Gabriel in a Manchester United shirt with the club crest and stadium background"', '"imageAlt": "Generic editorial illustration of a football, training cones and an empty pitch; no player depicted"');
// This staged route is conditional on a genuinely new, independently created asset and review.
const start = proposed.indexOf('        "imageType": "user-provided",');
const end = proposed.indexOf('        "sources": [', start);
assert(start > 0 && end > start);
proposed = proposed.slice(0, start) + '        "imageType": "original-editorial",\n        "rightsStatus": "reviewed",\n        "imageReviewRequired": false,\n        "brandingReview": "clear",\n        "imageCredit": "New generic editorial illustration created for TV96 Live; illustrative, not a photograph of JJ Gabriel",\n' + proposed.slice(end);
proposed = proposed.replace("32: '/images/articles/jj-gabriel.png'", "32: '/images/articles/football-academy-generic.png'");
function patch(file, before, after) {
  const a = before.trimEnd().split('\n'), b = after.trimEnd().split('\n');
  let front = 0; while (front < a.length && front < b.length && a[front] === b[front]) front++;
  let back = 0; while (back < a.length - front && back < b.length - front && a[a.length - 1 - back] === b[b.length - 1 - back]) back++;
  const first = Math.max(0, front - 3), ae = Math.min(a.length, a.length - back + 3), be = Math.min(b.length, b.length - back + 3);
  const lead = a.slice(first, front).map(s => ' ' + s), removed = a.slice(front, a.length - back).map(s => '-' + s), added = b.slice(front, b.length - back).map(s => '+' + s), tail = a.slice(a.length - back, ae).map(s => ' ' + s);
  return `diff --git a/${file} b/${file}\n--- a/${file}\n+++ b/${file}\n@@ -${first + 1},${ae - first} +${first + 1},${be - first} @@\n${[...lead, ...removed, ...added, ...tail].join('\n')}\n`;
}
fs.writeFileSync(path.join(__dirname, 'ARTICLE_32_IMAGE_REPLACEMENT.patch'), patch('.editorial/news-data.js', oldSource, proposed));
const manifestBefore = read('.editorial/optimized-images.json');
const manifestAfter = JSON.parse(manifestBefore);
delete manifestAfter['/images/articles/jj-gabriel.png'];
fs.writeFileSync(path.join(__dirname, 'ARTICLE_32_OLD_MANIFEST_RETIREMENT.patch'), patch('.editorial/optimized-images.json', manifestBefore, JSON.stringify(manifestAfter, null, 2) + '\n'));
const exclusions = ['.editorial/', '# Proposed unused legacy image exclusions; retain local originals.', 'news image/', ...bannerCandidates, '# Apply these two only atomically with the approved Article 32 replacement.', ...targets];
fs.writeFileSync(path.join(__dirname, 'ARTICLE_32_DEPLOYMENT_EXCLUSIONS.proposed'), exclusions.join('\n') + '\n');
const testBefore = read('.editorial/image-rights-check.cjs');
const needle = "fs.readdirSync(path.join(root, 'images/articles')).filter(name => name.endsWith('.webp')).sort()";
assert(testBefore.includes(needle));
let testAfter = testBefore.replace(needle, "fs.readdirSync(path.join(root, 'images/articles')).filter(name => name.endsWith('.webp') && name !== 'jj-gabriel.webp').sort()");
const guard = "// Retained former Article 32 pair must be excluded and have no public editorial use.\nfor (const oldAsset of ['images/articles/jj-gabriel.png', 'images/articles/jj-gabriel.webp']) {\n    assert(read('.vercelignore').split(/\\r?\\n/).includes(oldAsset), `Retained unlicensed derivative is deployable: ${oldAsset}`);\n    for (const file of ['index.html', 'news.html', 'news-data.js', ...published.map(a => `articles/${a.id}.html`)]) assert(!read(file).includes(oldAsset), `Retired derivative referenced: ${file}`);\n}\n";
testAfter = testAfter.replace('const allowed = new Set(', guard + 'const allowed = new Set(');
fs.writeFileSync(path.join(__dirname, 'ARTICLE_32_IMAGE_CHECK_UPDATE.patch'), patch('.editorial/image-rights-check.cjs', testBefore, testAfter));
fs.writeFileSync(path.join(__dirname, 'article-32-image-replacement-evidence.json'), JSON.stringify({ checkedAt: new Date().toISOString(), ownerProvenance: 'ChatGPT edit of a real photograph downloaded through Google Images; underlying licence not established.', currentArticle: { id: 32, title: current.title, publishedAt: current.publishedAt, updatedAt: current.updatedAt, bodySha256: digest(model.articleContent[32].replace(/\r\n/g, '\n')), image: current.image, imageType: current.imageType, rightsStatus: current.rightsStatus, imageReviewRequired: current.imageReviewRequired }, currentAssets: targets.map(file => ({ path: file, sha256: digest(fs.readFileSync(path.join(root, file))) })), references, unusedDeploymentCandidates: unused, pendingAsset: '/images/articles/football-academy-generic.png', currentPublicOutputs: Object.fromEntries(publicFiles.filter(file => /^(?:articles\/\d+\.html|index\.html|news\.html|news-data\.js|sitemap\.xml)$/.test(file)).map(file => [file, digest(fs.readFileSync(path.join(root, file)))])), generatedOrSubstituted: false, exclusionsApplied: false }, null, 2) + '\n');
console.log(`Prepared review-only patches and evidence: ${references.length} old-asset references, ${unused.length} unused exclusion candidates. No asset substitution or deployment exclusion applied.`);
