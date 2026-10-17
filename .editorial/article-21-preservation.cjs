// Extend existing protections through this one explicit owner-approved revision.
const assert=require('node:assert/strict'),e=require('./article-21-revision-evidence.json');
exports.body=(id,previous)=>{if(String(id)==='21'){assert.equal(e.beforeBodyHash,previous,'Article 21 body approval chain');previous=e.afterBodyHash;}return require('./article-22-preservation.cjs').body(id,previous);};
exports.file=(file,previous)=>{const next=e.sourceFiles[file]||e.generatedFiles[file];if(next){assert.equal(next.before,previous,`Article 21 file approval chain: ${file}`);previous=next.after;}return require('./article-22-preservation.cjs').file(file,previous);};
exports.metadata=(before)=>{const snapshot=e.articlesBefore.find(a=>a.id===21);assert.deepEqual(snapshot,before,'Article 21 prior metadata baseline');};
