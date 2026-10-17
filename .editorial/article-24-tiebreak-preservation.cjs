const assert=require('node:assert/strict'),e=require('./article-24-tiebreak-evidence.json');
exports.body=(id,previous)=>{if(String(id)==='24'){assert.equal(previous,e.beforeBodyHash,'Article 24 historical body chain');previous=e.afterBodyHash;}return require('./consolidated-preservation.cjs').body(id,previous);};
exports.file=(file,previous)=>{const next=e.sourceFiles[file]||e.generatedFiles[file];if(next){assert.equal(next.before,previous,`Article 24 tiebreak historical file chain ${file}`);previous=next.after;}return require('./consolidated-preservation.cjs').file(file,previous);};
exports.metadata=before=>assert.deepEqual(before,e.articlesBefore.find(a=>a.id===24),'Article 24 prior metadata baseline');
