const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),e=require('./consolidated-implementation-evidence.json');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
exports.body=(id,previous)=>{if(String(id)!=='23')return previous;assert.equal(previous,e.beforeBodyHash,'Article 23 historical body chain');return e.afterBodyHash;};
exports.file=(file,previous)=>{const next=e.sourceFiles[file]||e.generatedFiles[file];if(!next)return previous;assert.equal(previous,next.before,'Consolidated historical file chain '+file);return next.after;};
exports.metadata=before=>assert.deepEqual(before,e.articlesBefore.find(a=>a.id===23),'Article 23 historical metadata');
// Validate the current exact approved result before reversing it for older checks.
exports.priorText=(file,text)=>{const next=e.generatedFiles[file]||e.sourceFiles[file];assert(next&&e.beforeTexts[file]);assert.equal(hash(text),next.after,'Exact approved current file '+file);assert.equal(hash(e.beforeTexts[file]),next.before,'Historical text hash '+file);return e.beforeTexts[file];};
