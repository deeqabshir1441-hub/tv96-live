// Convert registered source PNGs to bounded, high-quality WebP delivery files.
// Original artwork remains untouched. Chrome's canvas encoder is used so no
// package or network installation is needed in this static-site workspace.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const model = require('./content-model.cjs');
const root = path.resolve(__dirname, '..');
const articleId = process.argv.find(arg => arg.startsWith('--article='))?.split('=')[1];
const inputs = model.getPublishedArticles().filter(a => (!articleId || String(a.id) === articleId) && a.image?.startsWith('/images/articles/')).map(a => a.image);
assert(inputs.length, 'No registered images selected');
const chromePath = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
assert(chromePath, 'Chrome or Edge is required for local WebP optimization');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'tv96-optimize-'));
const server = http.createServer((req, res) => {
    if (req.url === '/editorial-optimizer') { res.setHeader('Content-Type', 'text/html'); return res.end('<!doctype html><title>Local image optimizer</title>'); }
    const source = inputs.find(x => x === decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!source) { res.statusCode = 404; return res.end(); }
    res.setHeader('Content-Type', 'image/png');
    res.end(fs.readFileSync(path.join(root, source.slice(1))));
});
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let chrome, socket;
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    chrome = spawn(chromePath, ['--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${temp}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
    const portFile = path.join(temp, 'DevToolsActivePort');
    for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await pause(100);
    assert(fs.existsSync(portFile), 'Chromium did not start');
    const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
    const target = await fetch(`http://127.0.0.1:${port}/json/new?${origin}/editorial-optimizer`, { method: 'PUT' }).then(r => r.json());
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
    let seq = 0;
    const pending = new Map();
    socket.onmessage = event => {
        const msg = JSON.parse(event.data);
        if (!msg.id || !pending.has(msg.id)) return;
        const entry = pending.get(msg.id); pending.delete(msg.id);
        if (msg.error) entry.reject(new Error(msg.error.message)); else entry.resolve(msg.result);
    };
    const send = (method, params) => new Promise((resolve, reject) => {
        const id = ++seq; pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
    });
    await send('Page.navigate', { url: `${origin}/editorial-optimizer` });
    await pause(500);
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'optimized-images.json'), 'utf8'));
    for (const source of inputs) {
        const expression = `(async()=>{const im=new Image();im.src=${JSON.stringify(origin + source)};await im.decode();const scale=Math.min(1,1200/im.naturalWidth,800/im.naturalHeight);const w=Math.round(im.naturalWidth*scale),h=Math.round(im.naturalHeight*scale);const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);return {data:c.toDataURL('image/webp',0.92),w,h};})()`;
        const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
        assert(!result.exceptionDetails, `Encoding failed: ${source}: ${JSON.stringify(result.exceptionDetails)}`);
        const value = result.result.value;
        assert(value.data.startsWith('data:image/webp;base64,'), `WebP unsupported: ${source}`);
        const bytes = Buffer.from(value.data.split(',')[1], 'base64');
        const dest = path.join(root, source.slice(1).replace(/\.png$/i, '.webp'));
        assert(bytes.length < fs.statSync(path.join(root, source.slice(1))).size, `No size saving: ${source}`);
        fs.writeFileSync(dest, bytes);
        manifest[source] = { sourceSha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, source.slice(1)))).digest('hex'), deliverySha256: crypto.createHash('sha256').update(bytes).digest('hex'), width: value.w, height: value.h, sourceBytes: fs.statSync(path.join(root, source.slice(1))).size, deliveryBytes: bytes.length };
        console.log(`${source}: ${fs.statSync(path.join(root, source.slice(1))).size} -> ${bytes.length} bytes, ${value.w}x${value.h} WebP`);
    }
    fs.writeFileSync(path.join(__dirname, 'optimized-images.json'), JSON.stringify(manifest, null, 2) + '\n');
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(async () => {
    if (socket) socket.close();
    if (chrome) { chrome.kill(); await new Promise(resolve => { if (chrome.exitCode !== null) resolve(); else chrome.once('exit', resolve); }); }
    server.closeAllConnections(); server.close();
    try { fs.rmSync(temp, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 }); } catch (e) { console.warn(`Temporary Chrome profile cleanup deferred: ${e.message}`); }
});
