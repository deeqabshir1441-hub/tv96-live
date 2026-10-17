const assert=require('node:assert/strict'),e=require('./article-22-revision-evidence.json');
exports.body=(id,previous)=>{if(String(id)==='22'){assert.equal(previous,e.beforeBodyHash,'Article 22 historical body chain');previous=e.afterBodyHash;}return require('./article-24-tiebreak-preservation.cjs').body(id,previous);};
exports.file=(file,previous)=>{const next=e.sourceFiles[file]||e.generatedFiles[file];if(next){assert.equal(next.before,previous,`Article 22 historical file chain ${file}`);previous=next.after;}return require('./article-24-tiebreak-preservation.cjs').file(file,previous);};
exports.metadata=before=>assert.deepEqual(before,e.articlesBefore.find(a=>a.id===22),'Article 22 historical metadata baseline');
