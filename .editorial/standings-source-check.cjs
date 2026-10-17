const fs = require('node:fs');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const evidence = require('./standings-source-revision.json');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(hash(fs.readFileSync('standings.html')), evidence.afterRaw, 'Approved Standings UI hash');
const article3 = require('./article-3-revision-evidence.json');
for (const [file,digest] of Object.entries(evidence.protectedFiles)) {
    const approval = article3.sourceFiles[file] || article3.generatedFiles[file];
    if (approval) assert.equal(approval.before, digest, `Article 3 preserves Standings-era baseline: ${file}`);
    const article9 = require('./article-9-revision-evidence.json');
    const next = article9.sourceFiles[file] || article9.generatedFiles[file];
    if(next)assert.equal(next.before,approval?.after || digest,`Article 9 preserves prior approved baseline: ${file}`);
    assert.equal(hash(fs.readFileSync(file)), require('./article-21-preservation.cjs').file(file,next?.after || approval?.after || digest), `Unrelated file changed: ${file}`);
}
console.log('PASS: approved Standings page hash; API, ranking implementation, other pages, article sources, Article 32 and image bytes preserved.');
