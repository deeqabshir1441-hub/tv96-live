// Dependency-free Chromium smoke test. External services and football data are
// stubbed locally: this validates rendering and interactions, not live upstream uptime.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'news-data.js'), 'utf8') + '\nglobalThis.records = articles;', context);
const published = context.records.filter(article => article.isPublished === true);
const retirements = require('./article-retirements.cjs');
const draftRecords = require('./content-model.cjs').articles.filter(article => !article.isPublished && !retirements.merged[article.id]);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'tv96-editorial-'));
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const requests = [];
let apiMode = 'success';
let standingsSourceValue = 'official';
let standingsResponseOverride = null;
let standingsDelay = 0;
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Nairobi' }).format(new Date());
const fixture = { id: 'editorial-test-1', home: 'Arsenal', away: 'Liverpool', homeScore: 2, awayScore: 1, league: 'Premier League', status: 'Finished', statusClass: 'status-finished', displayTime: '15:00', matchDate: date, shouldDisplay: true, isApiMatch: true, homeLogo: '/icon-192.png', awayLogo: '/icon-192.png' };
const coverageFixtures = [fixture, ...[
    ['La Liga', 'Getafe', 'Mallorca'], ['Serie A', 'Udinese', 'Lecce'],
    ['Bundesliga', 'Mainz', 'Augsburg'], ['Ligue 1', 'Nantes', 'Toulouse'],
    ['UEFA Champions League', 'Home CL', 'Away CL'], ['Eredivisie', 'Home DED', 'Away DED'],
    ['Campeonato Brasileiro Série A', 'Home BSA', 'Away BSA'], ['Championship', 'Home ELC', 'Away ELC'],
    ['Primeira Liga', 'Home PPL', 'Away PPL'], ['FIFA World Cup', 'Home WC', 'Away WC'],
    ['European Championship', 'Home EC', 'Away EC']
].map(([league, home, away], index) => ({ ...fixture, id: `coverage-${index}`, league, home, away, displayTime: `${String(index + 1).padStart(2, '0')}:00` }))];
const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    requests.push(url.pathname + url.search);
    if (url.pathname.startsWith('/api/') && apiMode === 'failure') {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Provider temporarily unavailable.' }));
    }
    if (url.pathname === '/api/matches' && apiMode === 'delayed') {
        res.setHeader('Content-Type', 'application/json');
        return setTimeout(() => res.end(JSON.stringify({dates: {maanta: '2099-01-01'}, matchesData: {shalay: [], maanta: [{...fixture, matchDate: '2099-01-01', status: 'Upcoming', home: '<img src=x onerror=alert(1)>', away: 'Away & United'}], berri: []}})), 900);
    }
    if (url.pathname.startsWith('/api/') && apiMode === 'empty') {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(url.pathname === '/api/matches' ? { matchesData: { shalay: [], maanta: [], berri: [] } } : { standings: [] }));
    }
    if (url.pathname === '/api/matches') {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ dates: { maanta: date }, matchesData: { shalay: [], maanta: coverageFixtures, berri: [] } }));
    }
    if (url.pathname === '/api/standings') {
        res.setHeader('Content-Type', 'application/json');
        const payload = { competition: { name: 'Premier League' }, season: { startDate: '2026-08-01', endDate: '2027-05-31' }, standings: [
            { position: 1, name: 'Arsenal', played: 1, win: 1, draw: 0, lose: 0, goalsFor: 2, goalsAgainst: 1, goalDifference: 1, points: 3, form: 'W' },
            { position: 2, name: 'Liverpool', played: 1, win: 0, draw: 0, lose: 1, goalsFor: 1, goalsAgainst: 2, goalDifference: -1, points: 0, form: 'L' }
        ], standingsSource: standingsSourceValue };
        if (standingsSourceValue === 'calculated-from-finished-matches') payload.standings[0].points = 7;
        const body = standingsResponseOverride === null ? JSON.stringify(payload) : typeof standingsResponseOverride === 'string' ? standingsResponseOverride : JSON.stringify(standingsResponseOverride);
        return setTimeout(() => res.end(body), standingsDelay);
    }
    if (url.pathname.startsWith('/_')) { res.setHeader('Content-Type', 'text/javascript'); return res.end(''); }
    return require('./static-server.cjs')(req, res);
});
let chrome, socket;
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const executable = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(file => fs.existsSync(file));
    assert(executable, 'Chromium browser not installed');
    chrome = spawn(executable, ['--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${temp}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
    const portFile = path.join(temp, 'DevToolsActivePort');
    for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await pause(100);
    assert(fs.existsSync(portFile), 'Chromium did not start');
    const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
    const target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' }).then(response => response.json());
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
    let sequence = 0;
    const pending = new Map();
    let exceptions = [];
    function send(method, params = {}) {
        const id = ++sequence;
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
            pending.set(id, { resolve: result => { clearTimeout(timer); resolve(result); }, reject });
            socket.send(JSON.stringify({ id, method, params }));
        });
    }
    socket.onmessage = event => {
        const message = JSON.parse(event.data);
        if (message.id) {
            const request = pending.get(message.id); if (!request) return;
            pending.delete(message.id);
            if (message.error) request.reject(new Error(JSON.stringify(message.error))); else request.resolve(message.result);
        } else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
        else if (message.method === 'Fetch.requestPaused') {
            const { requestId, request } = message.params;
            if (request.url.startsWith(origin) || !request.url.startsWith('http')) send('Fetch.continueRequest', { requestId }).catch(() => {});
            else {
                const body = request.url.includes('lucide') ? 'window.lucide = {createIcons(){}};' : '';
                send('Fetch.fulfillRequest', { requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: request.url.includes('.css') ? 'text/css' : 'text/javascript' }], body: Buffer.from(body).toString('base64') }).catch(() => {});
            }
        }
    };
    await send('Page.enable'); await send('Runtime.enable');
    await send('Network.enable'); await send('Network.setBypassServiceWorker', { bypass: true });
    await send('Network.setCacheDisabled', { cacheDisabled: true });
    await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    const evaluate = async expression => {
        const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
        if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
        return result.result.value;
    };
    const navigate = async (route, destination = route) => {
        exceptions = [];
        await send('Page.navigate', { url: origin + route });
        for (let i = 0; i < 100; i++) {
            if (await evaluate(`location.href === ${JSON.stringify(origin + destination)} && document.readyState === 'complete'`)) break;
            await pause(50);
        }
        assert(await evaluate(`location.href === ${JSON.stringify(origin + destination)} && document.readyState === 'complete'`), `Navigation did not complete: ${route}`);
        assert.deepEqual(exceptions, [], `Browser exception on ${route}`);
    };
    const viewport = width => send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    const overflow = () => evaluate('document.documentElement.scrollWidth > innerWidth + 1');
    const screenshot = async name => {
        const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        fs.writeFileSync(path.join(temp, name + '.png'), Buffer.from(result.data, 'base64'));
    };
    if(process.argv.includes('--home-copy-only')) {
        const observations=[];
        for(const mode of ['success','empty','failure']) {
            apiMode=mode;
            await navigate('/');await pause(1500);
            const state=await evaluate(`({copy:document.getElementById('about').textContent,help:document.querySelector('.matches-section-heading').textContent,links:[...document.querySelectorAll('#about a')].map(a=>a.getAttribute('href')),cards:document.querySelectorAll('#news-container article').length})`);
            assert(state.copy.includes('TV96 Live brings together football')&&state.copy.includes('Start with our Premier League guide'));
            assert(state.help.includes('Match lists need JavaScript and an available data feed.'));
            assert.deepEqual(state.links,['/matches','/standings','/news','/articles/12','/articles/15','/news']);assert.equal(state.cards,4);
            for(const width of [360,1440]){await viewport(width);assert(!await overflow(),'Home '+mode+' '+width);}
            observations.push({mode,status:'pass',staticCopyAndLinks:true,featuredCards:4});
        }
        fs.writeFileSync(path.join(root,'.editorial/consolidated-home-browser-results.json'),JSON.stringify({checkedAt:new Date().toISOString(),mode:'Local Chromium; mocked API and external scripts',observations},null,2)+'\n');
        console.log('PASS: Home H1–H3 and six contextual links persist with successful, empty and failed API responses at 360/1440px.');
        return;
    }
    const results = [];
    await viewport(1440);
    for (const article of published) {
        await navigate('/articles/' + article.id);
        const state = await evaluate(`({ h1: document.querySelectorAll('h1').length, title: document.title, body: document.getElementById('articleBody').innerText, canonical: document.querySelector('[rel=canonical]').href, og: document.querySelector('[property="og:title"]').content, related: [...document.querySelectorAll('#relatedArticleCards a')].map(a => a.pathname), schema: JSON.parse(document.querySelector('[type="application/ld+json"]').textContent), robots: document.getElementById('article-robots').content })`);
        assert.equal(state.h1, 1); assert(state.body.length > 500); assert.equal(state.canonical, 'https://www.tv96live.org/articles/' + article.id);
        assert.equal(state.title, article.title + ' | TV96 Live'); assert.equal(state.og, state.title); assert.equal(state.schema.headline, article.title);
        assert.equal(state.related.length, 3); assert.equal(state.robots, 'index, follow'); assert(!await overflow(), `Desktop overflow ${article.id}`);
        await viewport(360); assert(!await overflow(), `Mobile overflow ${article.id}`); await viewport(1440);
        results.push({ id: article.id, status: 'pass', h1: 1, related: 3 });
    }
    console.log(`PASS: all ${published.length} article routes, metadata, JSON-LD, related cards and 360px/1440px layouts.`);
    await send('Emulation.setScriptExecutionDisabled', { value: true });
    // Exact approved additions must remain readable and linked without scripts.
    const consolidated = require('./consolidated-implementation-evidence.json');
    for (const route of ['/articles/23', '/', '/about']) {
        await navigate(route);
        await pause(1400);
        const state = await evaluate(`(() => {
            const expected = new DOMParser().parseFromString(${JSON.stringify(consolidated.insertion)}, 'text/html');
            const heading = [...document.querySelectorAll('#articleBody h3')].find(h => h.textContent === ${JSON.stringify('Historical worked example: '+consolidated.title)});
            const paragraphs=[]; let next=heading?.nextElementSibling;
            while(next?.tagName==='P' && paragraphs.length<4){paragraphs.push(next);next=next.nextElementSibling;}
            const text=document.body.textContent;
            return {h1:document.querySelectorAll('h1').length, paragraphs:paragraphs.map(p=>p.textContent),expected:[...expected.querySelectorAll('p')].map(p=>p.textContent), links:paragraphs.flatMap(p=>[...p.querySelectorAll('a')].map(a=>a.href)),expectedLinks:[...expected.querySelectorAll('a')].map(a=>a.href), next:next?.textContent, home:text.includes('Match lists need JavaScript and an available data feed.')&&text.includes('TV96 Live brings together football')&&text.includes('Start with our Premier League guide'), about:text.includes('Updated 17 October 2026')&&text.includes('TV96 Live currently provides:')&&text.includes('Fixtures, scores and standings use football-data.org'), badLinks:[...document.querySelectorAll('#articleBody a, #about a, .policy-content a')].filter(a=>!a.textContent.trim()||!a.getAttribute('href')).length};
        })()`);
        assert.equal(state.badLinks,0,'New contextual links have accessible text and destinations');
        if(route==='/articles/23'){
            assert.equal(state.h1,1);assert.deepEqual(state.paragraphs,state.expected);assert.deepEqual(state.links,state.expectedLinks);assert.equal(state.next,'Why the run-in has several boundaries');
        }else if(route==='/')assert(state.home,'Static Home H1–H3 without JavaScript');
        else assert(state.about,'About A1–A3 without JavaScript');
        for(const theme of ['dark','light']){
            await evaluate(`document.body.classList.toggle('light-mode',${theme==='light'})`);
            for(const width of [320,360,390,1440]){await viewport(width);await pause(150);assert(!await overflow(),route+' approved-copy overflow '+theme+' '+width);}
        }
        await screenshot('approved-'+(route==='/'?'home':route.replaceAll('/','-'))+'-no-js');
    }
    console.log('PASS: exact Article 23 example/citations and Home/About copy without JavaScript; named links, heading structure, both themes at 320/360/390/1440px.');
    await viewport(360);
    await navigate('/articles/32');
    assert.equal(await evaluate(`document.querySelectorAll('h1').length`), 1);
    assert(await evaluate(`document.getElementById('articleBody').innerText.length > 3000`));
    assert(!await overflow(), 'No-JavaScript article overflow');
    await screenshot('article-no-js-mobile');
    await navigate('/articles/9');
    const article9Example = require('./article-9-revision-evidence.json');
    const expectedLinks = [...article9Example.insertion.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
    const exampleState = await evaluate(`(() => {
        const h = [...document.querySelectorAll('#articleBody h2')].find(h=>h.textContent === 'Historical worked example: Manchester United’s 2024/25 Europa League draw');
        const paragraphs = []; let next=h?.nextElementSibling;
        while(next?.tagName === 'P') { paragraphs.push(next); next=next.nextElementSibling; }
        const expected = new DOMParser().parseFromString(${JSON.stringify(article9Example.insertion)},'text/html');
        return {heading:!!h, previous:h?.previousElementSibling?.textContent, next:next?.textContent, actual:paragraphs.map(p=>p.textContent), expected:[...expected.querySelectorAll('p')].map(p=>p.textContent), links:paragraphs.flatMap(p=>[...p.querySelectorAll('a')].map(a=>a.href)), correction:document.getElementById('articleBody').innerText.includes('Correction: the earlier version listed specific 2026/27 opponents'), schema:JSON.parse(document.querySelector('[type="application/ld+json"]').textContent)};
    })()`);
    assert(exampleState.heading && exampleState.correction);
    assert.deepEqual(exampleState.actual,exampleState.expected,'Exact approved Article 9 paragraphs without JavaScript');
    assert.deepEqual(exampleState.links,expectedLinks);
    assert(exampleState.previous.startsWith('The same restraint applies to travel.'));
    assert.equal(exampleState.next,'Use the right competition rules');
    assert.equal(exampleState.schema.datePublished,'2026-08-28T15:00:00+03:00');
    assert.equal(exampleState.schema.dateModified,'2026-10-12');
    for(const theme of ['dark','light']) {
        await evaluate(`document.body.classList.toggle('light-mode',${theme==='light'})`);
        await pause(350);
        for(const width of [320,360,390,1440]) {
            await viewport(width);
            assert(!await overflow(),`Article 9 no-JavaScript layout ${theme} ${width}`);
            if([320,1440].includes(width))await screenshot(`article-9-example-no-js-${theme}-${width}`);
        }
    }
    await viewport(360);
    console.log('PASS: Article 9 exact historical example, five citations, insertion boundary/correction, dates and no-JavaScript mobile/desktop rendering in both themes.');
    await navigate('/articles/21');
    const article21Example = require('./article-21-revision-evidence.json');
    const article21State = await evaluate(`(() => {
        const body=document.getElementById('articleBody'),expected=new DOMParser().parseFromString(${JSON.stringify(article21Example.insertion)},'text/html');
        const h=[...body.querySelectorAll('h3')].find(h=>h.textContent==='The 2026/27 final-table rules');
        const nodes=[];let n=h;while(n&&n.tagName!=='H2'){nodes.push(n);n=n.nextElementSibling;}
        const table=body.querySelector('table');
        return {actual:nodes.map(n=>n.textContent),expected:[...expected.body.children].map(n=>n.textContent),previous:h?.previousElementSibling?.textContent,next:n?.textContent,links:nodes.flatMap(n=>[...n.querySelectorAll('a')].map(a=>a.href)),rows:[...table.rows].map(r=>[...r.cells].map(c=>c.textContent)),rowHeaders:table.querySelectorAll('th[scope="row"]').length,columnHeaders:table.querySelectorAll('th[scope="col"]').length,label:table.getAttribute('aria-label'),schema:JSON.parse(document.querySelector('[type="application/ld+json"]').textContent)};
    })()`);
    assert.deepEqual(article21State.actual,article21State.expected,'Exact approved Article 21 text and table without JavaScript');
    assert(article21State.previous.startsWith('For example, if a rule compares'));
    assert.equal(article21State.next,'European places and relegation');
    assert.deepEqual(article21State.links,[article21Example.source.url]);
    assert.deepEqual(article21State.rows.at(-1),['Head-to-head GD','2 \u2212 1 = +1','1 \u2212 2 = \u22121']);
    assert.equal(article21State.rowHeaders,5);assert.equal(article21State.columnHeaders,3);assert(article21State.label.includes('Hypothetical'));
    assert.equal(article21State.schema.datePublished,'2026-09-05T12:00:00+03:00');assert.equal(article21State.schema.dateModified,'2026-10-13');
    for(const theme of ['dark','light']){
        await evaluate(`document.body.classList.toggle('light-mode',${theme==='light'})`);await pause(350);
        for(const width of [320,360,390,1440]){
            await viewport(width);assert(!await overflow(),`Article 21 no-JavaScript layout ${theme} ${width}`);
            assert(await evaluate(`(() => {const t=document.querySelector('#articleBody table');return t.getBoundingClientRect().width<=innerWidth&&[...t.querySelectorAll('th,td')].every(c=>c.scrollWidth<=c.clientWidth+1);})()`),`Article 21 table/cell usability ${theme} ${width}`);
            await evaluate(`document.querySelector('#articleBody table').scrollIntoView({block:'center'})`);
            if([320,1440].includes(width))await screenshot(`article-21-example-no-js-${theme}-${width}`);
        }
    }
    console.log('PASS: Article 21 exact no-JavaScript insertion, sources, table arithmetic/headers, metadata and 320/360/390/1440 layouts in both themes.');
    await navigate('/articles/22');
    const article22Example=require('./article-22-revision-evidence.json');
    const article22State=await evaluate(`(() => {
        const body=document.getElementById('articleBody'),expected=new DOMParser().parseFromString(${JSON.stringify(article22Example.insertion)},'text/html');
        const h=[...body.querySelectorAll('h3')].find(h=>h.textContent==='Which ties require a play-off in 2026/27?');const nodes=[];let n=h;while(n&&n.tagName!=='H2'){nodes.push(n);n=n.nextElementSibling;}
        const table=body.querySelector('table');return {actual:nodes.map(n=>n.textContent),expected:[...expected.body.children].map(n=>n.textContent),previous:h?.previousElementSibling?.textContent,next:n?.textContent,links:nodes.flatMap(n=>[...n.querySelectorAll('a')].map(a=>a.href)),rows:[...table.rows].map(r=>[...r.cells].map(c=>c.textContent)),rowHeaders:table.querySelectorAll('th[scope="row"]').length,columnHeaders:table.querySelectorAll('th[scope="col"]').length,label:table.getAttribute('aria-label'),schema:JSON.parse(document.querySelector('[type="application/ld+json"]').textContent)};
    })()`);
    assert.deepEqual(article22State.actual,article22State.expected,'Exact Article 22 insertion without JavaScript');assert(article22State.previous.startsWith('Multiple-team ties can require'));assert.equal(article22State.next,'Europe and the second division');assert.deepEqual(article22State.links,[article22Example.source.url,article22Example.source.url]);
    assert.deepEqual(article22State.rows.at(-2),['Head-to-head points','4','1']);assert.deepEqual(article22State.rows.at(-1),['Play-off hosting order','Second leg','First leg']);assert.equal(article22State.rowHeaders,5);assert.equal(article22State.columnHeaders,3);assert(article22State.label.includes('Hypothetical'));assert.equal(article22State.schema.datePublished,'2026-09-05T12:00:00+03:00');assert.equal(article22State.schema.dateModified,'2026-10-13');
    for(const theme of ['dark','light']){
        await evaluate(`document.body.classList.toggle('light-mode',${theme==='light'})`);await pause(350);
        for(const width of [320,360,390,1440]){
            await viewport(width);assert(!await overflow(),`Article 22 no-JavaScript ${theme} ${width}`);
            assert(await evaluate(`(() => {const t=document.querySelector('#articleBody table');return t.getBoundingClientRect().width<=innerWidth&&[...t.querySelectorAll('th,td')].every(c=>c.scrollWidth<=c.clientWidth+1);})()`),`Article 22 table usability ${theme} ${width}`);
            await evaluate(`document.querySelector('#articleBody table').scrollIntoView({block:'center'})`);if([320,1440].includes(width))await screenshot(`article-22-example-no-js-${theme}-${width}`);
        }
    }
    console.log('PASS: Article 22 exact six paragraphs, citations, hosting arithmetic/table accessibility, dates and no-JavaScript mobile/theme layouts.');
    await navigate('/articles/24');
    const article24Example=require('./article-24-tiebreak-evidence.json');
    const article24State=await evaluate(`(() => {
        const body=document.getElementById('articleBody'),expected=new DOMParser().parseFromString(${JSON.stringify(article24Example.insertion)},'text/html');
        const h=[...body.querySelectorAll('h3')].find(h=>h.textContent==='A hypothetical Ligue 1 tiebreak, step by step');const nodes=[];let n=h;while(n&&n.tagName!=='H2'){nodes.push(n);n=n.nextElementSibling;}
        const table=body.querySelector('table');return {actual:nodes.map(n=>n.textContent),expected:[...expected.body.children].map(n=>n.textContent),previous:h?.previousElementSibling?.textContent,next:n?.textContent,links:nodes.flatMap(n=>[...n.querySelectorAll('a')].map(a=>a.href)),rows:[...table.rows].map(r=>[...r.cells].map(c=>c.textContent)),rowHeaders:table.querySelectorAll('th[scope="row"]').length,columnHeaders:table.querySelectorAll('th[scope="col"]').length,label:table.getAttribute('aria-label'),correction:body.innerText.includes('Revision, 12 October 2026:'),schema:JSON.parse(document.querySelector('[type="application/ld+json"]').textContent)};
    })()`);
    assert.deepEqual(article24State.actual,article24State.expected,'Exact Article 24 insertion without JavaScript');assert(article24State.previous.startsWith('A positive GD can coexist'));assert.equal(article24State.next,'History and development');assert.deepEqual(article24State.links,[article24Example.source.url+'#page=121',article24Example.source.url+'#page=121']);assert(article24State.correction);
    assert.deepEqual(article24State.rows[4],['Overall goal difference','45 \u2212 40 = +5','50 \u2212 45 = +5']);assert.deepEqual(article24State.rows.at(-1),['Head-to-head points','4','1']);assert.equal(article24State.rowHeaders,7);assert.equal(article24State.columnHeaders,3);assert(article24State.label.includes('Hypothetical'));assert.equal(article24State.schema.datePublished,'2026-09-05T12:00:00+03:00');assert.equal(article24State.schema.dateModified,'2026-10-13');
    for(const theme of ['dark','light']){
        await evaluate(`document.body.classList.toggle('light-mode',${theme==='light'})`);await pause(350);
        for(const width of [320,360,390,1440]){
            await viewport(width);assert(!await overflow(),`Article 24 no-JavaScript ${theme} ${width}`);
            assert(await evaluate(`(() => {const t=document.querySelector('#articleBody table');return t.getBoundingClientRect().width<=innerWidth&&[...t.querySelectorAll('th,td')].every(c=>c.scrollWidth<=c.clientWidth+1);})()`),`Article 24 table usability ${theme} ${width}`);
            await evaluate(`document.querySelector('#articleBody table').scrollIntoView({block:'center'})`);if([320,1440].includes(width))await screenshot(`article-24-tiebreak-no-js-${theme}-${width}`);
        }
    }
    console.log('PASS: Article 24 exact paragraphs/table, sources, calculations/headers, historical revision, metadata and no-JavaScript mobile/theme layouts.');
    await viewport(360);
    await navigate('/news');
    assert.equal(await evaluate(`document.querySelectorAll('#news-container > a').length`), published.length);
    assert(!await overflow(), 'No-JavaScript News overflow');
    await screenshot('news-no-js-mobile');
    await navigate('/');
    assert.equal(await evaluate(`document.querySelectorAll('#news-container article').length`), 4);
    await navigate('/watch-live');
    assert(await evaluate(`document.body.innerText.includes('Live viewing is currently unavailable') && !document.querySelector('video') && !document.getElementById('historyContainer')`));
    await send('Emulation.setScriptExecutionDisabled', { value: false });
    console.log(`PASS: article body and all ${published.length} News cards visible with JavaScript disabled at 360px.`);

    for (const article of draftRecords) {
        await navigate('/articles/' + article.id);
        assert.equal(await evaluate(`document.getElementById('article-robots').content`), 'noindex, follow');
        assert(await evaluate(`document.getElementById('articleContent').innerText.includes('Page not found')`));
    }
    for (const [id, destination] of Object.entries(retirements.merged)) await navigate('/articles/' + id, '/articles/' + destination);
    await navigate('/articles/99999'); assert.equal(await evaluate(`document.getElementById('article-robots').content`), 'noindex, follow');
    await navigate('/article-template.html?id=12', '/articles/12'); assert.equal(await evaluate('document.title'), published.find(article => article.id === 12).title + ' | TV96 Live');
    await navigate('/news');
    await evaluate(`while (document.querySelector('.btn-load-more').style.display !== 'none') document.querySelector('.btn-load-more').click()`);
    assert.equal(await evaluate(`document.querySelectorAll('#news-container > a').length`), published.length);
    const filters = await evaluate(`[...document.querySelectorAll('.filter-btn')].map(button => button.textContent)`);
    for (const filter of filters) {
        await evaluate(`[...document.querySelectorAll('.filter-btn')].find(button => button.textContent === ${JSON.stringify(filter)}).click()`);
        assert(await evaluate(`document.querySelectorAll('#news-container > a').length > 0`), `Empty filter: ${filter}`);
        assert.equal(await evaluate(`document.querySelectorAll('.filter-btn[aria-pressed="true"]').length`), 1);
    }
    await navigate('/news?category=Football%20Guides');
    assert(await evaluate(`document.getElementById('articleCount').textContent.startsWith('10 articles')`));
    for (const width of [320, 360, 768, 1440]) { await viewport(width); assert(!await overflow(), `News overflow at ${width}`); }
    await viewport(1440); await screenshot('news-desktop'); await viewport(360); await screenshot('news-mobile');
    await navigate('/articles/15'); await screenshot('article-mobile');
    await navigate('/');
    // Existing sidebar entrance animations translate cards outside the viewport
    // briefly. Measure the settled layout, not the first animation frame.
    await pause(1400);
    assert.equal(await evaluate(`document.querySelectorAll('#news-container article').length`), 4);
    assert(await evaluate(`document.querySelectorAll('.match-card').length > 0`));
    const homeWidth = await evaluate('document.documentElement.scrollWidth');
    assert(await evaluate(`[...document.querySelectorAll('#news-container article')].every(element => element.getBoundingClientRect().right <= innerWidth + 1)`), 'Editorial cards exceed home viewport');
    await screenshot('home-mobile');
    assert(homeWidth <= 361, 'Homepage overflow after entrance animations');
    // Featured composition, automatic selection, approved images and both themes.
    for (const theme of ['dark', 'light']) {
        await evaluate(`document.body.classList.toggle('light-mode', ${theme == 'light'})`);
        for (const width of [1440, 390, 360, 320]) {
            await viewport(width);
            await evaluate(`document.getElementById('news').scrollIntoView({block: 'start', behavior: 'instant'})`);
            await pause(300);
            const featured = await evaluate(`(() => {
                const main = document.querySelector('.home-news-featured');
                const list = document.querySelector('.home-news-list');
                const box = element => { const r = element.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,right:r.right}; };
                const expected = getPublishedArticles().filter(a => new Date(a.publishedAt) <= Date.now()).sort((a,b) => new Date(b.publishedAt)-new Date(a.publishedAt) || b.id-a.id).slice(0,4);
                return { main:box(main), list:box(list), count:list.children.length,
                    links:[...document.querySelectorAll('.home-story-link')].map(a=>a.getAttribute('href')),
                    expected:expected.map(a=>'/articles/'+a.id),
                    images:[...document.querySelectorAll('.home-story img')].every(img=>img.complete && img.naturalWidth > 0),
                    approved:[...document.querySelectorAll('.home-story img')].every(img=>expected.some(a=>a.image===img.getAttribute('src')))
                };
            })()`);
            assert.equal(featured.count, 3);
            assert.deepEqual(featured.links, featured.expected);
            assert(featured.images && featured.approved, 'Featured images missing or unregistered');
            assert(!await overflow(), `Featured overflow at ${width} in ${theme}`);
            if (width >= 1024) {
                assert(featured.list.right < featured.main.x, 'Secondary stories must sit on the left');
                assert(featured.main.width > featured.list.width, 'Lead story must dominate');
            } else assert(featured.main.y < featured.list.y, 'Lead story must come first on mobile');
            if ([1440, 390].includes(width)) await screenshot(`featured-${theme}-${width}`);
        }
    }
    await evaluate(`document.body.classList.remove('light-mode')`);
    await evaluate(`(() => {
        window.installTestPrompted = false;
        const event = new Event('beforeinstallprompt', {cancelable:true});
        event.prompt = () => { window.installTestPrompted = true; };
        event.userChoice = Promise.resolve({outcome:'accepted'});
        window.dispatchEvent(event);
    })()`);
    assert(await evaluate(`!document.getElementById('installBtn').hidden`));
    await evaluate(`document.getElementById('installBtn').click()`);
    assert(await evaluate(`window.installTestPrompted && document.getElementById('installBtn').hidden`));
    console.log('PASS: Featured desktop/mobile composition, newest published selection, registered images, both themes and simulated Install App prompt.');
    await navigate('/matches'); assert(await evaluate(`document.querySelectorAll('.match-card').length > 0`));
    assert.equal(await evaluate(`document.querySelectorAll('#matches-container .match-card').length`), 12);
    for (const match of coverageFixtures) assert(await evaluate(`document.getElementById('matches-container').innerText.includes(${JSON.stringify(match.home)}) && document.getElementById('matches-container').innerText.includes(${JSON.stringify(match.away)})`));
    assert.deepEqual(await evaluate(`[...document.querySelectorAll('#matches-container .match-card .time')].map(node => node.textContent)`), ['15:00','11:00','10:00','09:00','08:00','07:00','06:00','05:00','04:00','03:00','02:00','01:00'], 'Existing finished-match kickoff ordering');
    await navigate('/standings');
    for (let i = 0; i < 100 && !await evaluate(`document.getElementById('standingsBody').innerText.includes('Arsenal')`); i++) await pause(50);
    assert.equal(await evaluate(`document.querySelectorAll('#standingsBody tr').length`), 2);
    assert(await evaluate(`document.getElementById('standingsBody').innerText.includes('Arsenal')`));
    const sourceLabel = () => evaluate(`document.getElementById('standingsSourceLabel').textContent`);
    const refreshStandings = async () => {
        await evaluate(`void loadStandings(false)`);
        for (let i = 0; i < 100 && await evaluate(`standingsRequestInFlight`); i++) await pause(50);
        assert(!await evaluate(`standingsRequestInFlight`), 'Standings response completed');
    };
    assert.equal(await sourceLabel(), 'Provider data');
    assert.equal(await evaluate(`document.getElementById('standingsSourceExplanation').textContent`), 'Supplied by football-data.org. Updates may be delayed.');
    assert(await evaluate(`(() => { const n = document.getElementById('standingsSourceNotice'); return !n.closest('.standings-table-wrapper') && n.parentElement.getAttribute('role') === 'status' && n.parentElement.getAttribute('aria-live') === 'polite' && n.parentElement.getAttribute('aria-atomic') === 'true'; })()`), 'Accessible notice outside table scrolling');
    standingsDelay = 700;
    for (const [source, previous, next] of [
        ['calculated-from-finished-matches', 'Provider data', 'Calculated from available results'],
        ['official', 'Calculated from available results', 'Provider data']
    ]) {
        standingsSourceValue = source;
        await evaluate(`void loadStandings(false)`);
        assert.equal(await sourceLabel(), previous, 'Keep provenance while old rows remain');
        assert.equal(await evaluate(`document.querySelector('#standingsBody .points').textContent`), previous === 'Provider data' ? '3' : '7', 'Keep old rows and their label together');
        assert(await evaluate(`document.getElementById('standingsBody').innerText.includes('Arsenal')`));
        for (let i = 0; i < 100 && await evaluate(`standingsRequestInFlight`); i++) await pause(50);
        assert.equal(await sourceLabel(), next);
        assert.equal(await evaluate(`document.querySelector('#standingsBody .points').textContent`), next === 'Provider data' ? '3' : '7', 'Replace rows and source together');
    }
    standingsDelay = 0;
    for (const source of [undefined, null, {}, [], 42, true, 'OFFICIAL', 'unknown', '<img src=x onerror=alert(1)>']) {
        standingsSourceValue = source;
        await refreshStandings();
        assert.equal(await sourceLabel(), 'Data source unavailable');
        assert.equal(await evaluate(`document.querySelectorAll('#standingsSourceNotice img, #standingsSourceNotice script').length`), 0);
        assert.equal(await evaluate(`document.getElementById('standingsSourceExplanation').textContent`), 'This response does not identify whether the standings were supplied by the provider or calculated. Check the competition’s official table before relying on a position.');
    }
    standingsSourceValue = 'calculated-from-finished-matches';
    await refreshStandings();
    assert.equal(await evaluate(`document.getElementById('standingsSourceExplanation').textContent`), 'Positions are provisional. Available results may be incomplete, and calculations may not reflect points deductions or competition-specific ranking rules. Check the competition’s official table before relying on a position.');
    for (const theme of ['dark', 'light']) {
        await evaluate(`document.body.classList.toggle('light-mode', ${theme === 'light'})`);
        await pause(350);
        const contrast = await evaluate(`(() => { const s = getComputedStyle(document.getElementById('standingsSourceNotice')); const luminance = rgb => { const channels = rgb.match(/[0-9.]+/g).slice(0,3).map(n => { const v = Number(n)/255; return v <= 0.04045 ? v/12.92 : ((v+0.055)/1.055)**2.4; }); return channels[0]*0.2126 + channels[1]*0.7152 + channels[2]*0.0722; }; const a=luminance(s.color),b=luminance(s.backgroundColor); return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05); })()`);
        assert(contrast >= 4.5, `Source notice text contrast ${theme}: ${contrast}`);
        for (const width of [320, 360, 390, 1440]) {
            await viewport(width);
            assert(!await overflow(), `Source notice layout ${theme} ${width}`);
            assert(await evaluate(`(() => { const n = document.getElementById('standingsSourceNotice'), b = n.getBoundingClientRect(), s = getComputedStyle(n); return b.width > 0 && b.right <= innerWidth + 1 && s.color !== s.backgroundColor && n.innerText.includes('Positions are provisional'); })()`));
            if ([320,1440].includes(width)) await screenshot(`standings-source-${theme}-${width}`);
        }
    }
    for (const payload of [{standings:[]}, {}, {standings:null}, '{invalid json']) {
        standingsResponseOverride = payload;
        await refreshStandings();
        assert(await evaluate(`document.getElementById('standingsBody').innerText.includes('No positions can be confirmed') && document.getElementById('standingsSourceNotice').hidden && !document.getElementById('standingsSourceLabel').textContent`));
        standingsResponseOverride = null;
        await refreshStandings();
    }
    await evaluate(`window.originalStandingsFetch = window.fetch; window.fetch = () => Promise.reject(new Error('Simulated network failure'));`);
    await refreshStandings();
    assert(await evaluate(`document.getElementById('standingsSourceNotice').hidden && !document.getElementById('standingsSourceLabel').textContent && document.getElementById('standingsBody').innerText.includes('No positions can be confirmed')`));
    await evaluate(`window.fetch = window.originalStandingsFetch; delete window.originalStandingsFetch;`);
    await refreshStandings();
    apiMode = 'failure';
    await refreshStandings();
    assert(await evaluate(`document.getElementById('standingsSourceNotice').hidden && !document.getElementById('standingsSourceLabel').textContent && document.getElementById('standingsBody').innerText.includes('No positions can be confirmed')`), 'HTTP failure clears previous provenance');
    apiMode = 'success';
    standingsDelay = 700;
    await navigate('/standings');
    assert(await evaluate(`document.getElementById('standingsSourceNotice').hidden && document.getElementById('standingsBody').innerText.includes('Loading standings')`));
    await pause(900);
    await navigate('/standings?league=Unsupported');
    assert(await evaluate(`document.getElementById('standingsSourceNotice').hidden && document.getElementById('standingsBody').innerText.includes('Automatic standings are not available')`));
    standingsDelay = 0;
    standingsSourceValue = 'official';
    await viewport(1440);
    console.log('PASS: standings provenance allowlist, exact copy, delayed refresh transitions, cleared error/empty/network states, unsupported/loading states, accessible text and mobile/theme layouts.');
    const watchRequestStart = requests.length;
    await navigate('/watch-live');
    assert(await evaluate(`document.body.innerText.includes('Live viewing is currently unavailable') && !document.querySelector('video') && !document.getElementById('historyContainer') && document.querySelector('meta[name=robots]').content === 'noindex, follow'`));
    assert(!requests.slice(watchRequestStart).some(url => /streams\.js|history-data\.js/.test(url)));
    for (const theme of ['dark', 'light']) {
        for (const route of ['/matches', '/standings', '/watch-live']) {
            await navigate(route);
            if (route === '/standings') await pause(1400);
            await evaluate(`document.body.classList.toggle('light-mode', ${theme === 'light'})`);
            await pause(350); // Let the existing theme transition finish before screenshots.
            for (const width of [390, 360, 320]) { await viewport(width); assert(!await overflow(), `${route}: ${theme} ${width}`); }
            await screenshot(route.slice(1) + '-' + theme + '-320');
        }
    }
    apiMode = 'delayed';
    await navigate('/news');
    assert(await evaluate(`document.querySelector('.trending-matches-list').innerText.includes('Loading upcoming fixtures')`), 'News hides loading state');
    await pause(1100);
    assert(await evaluate(`document.querySelector('.trending-matches-list').innerText.includes('<img src=x onerror=alert(1)> vs Away & United')`), 'News does not render the delayed API result safely');
    assert.equal(await evaluate(`document.querySelectorAll('.trending-matches-list img, .trending-matches-list a[href*="watch-live"]').length`), 0, 'News injects HTML or enables Watch links');
    for (const mode of ['empty', 'failure']) {
        apiMode = mode;
        await navigate('/matches');
        await pause(300);
        assert(await evaluate(`document.body.innerText.includes(${JSON.stringify(mode === 'empty' ? 'No fixtures returned' : 'Match data could not be loaded')})`), `Matches ${mode} state`);
        if (mode === 'failure') {
            await evaluate(`document.querySelector('.tab-btn[data-day="berri"]').click()`);
            assert(await evaluate(`document.body.innerText.includes('Match data could not be loaded')`), 'Failure lost when changing day');
        }
        await navigate('/standings');
        await pause(300);
        assert(await evaluate(`document.getElementById('standingsBody').innerText.includes('No positions can be confirmed')`), `Standings ${mode} state`);
        await navigate('/news');
        await pause(300);
        assert(await evaluate(`document.querySelector('.trending-matches-list').innerText.includes(${JSON.stringify(mode === 'empty' ? 'No upcoming fixtures returned' : 'Match data could not be loaded')})`), `News match sidebar ${mode} state`);
    }
    apiMode = 'success';
    console.log('PASS: empty/error responses distinguished from results; match failure persists across date tabs.');
    await navigate('/news');
    await evaluate(`document.getElementById('menuToggle').click()`);
    assert.equal(await evaluate(`document.getElementById('menuToggle').getAttribute('aria-expanded')`), 'true');
    await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))`);
    assert.equal(await evaluate(`document.getElementById('menuToggle').getAttribute('aria-expanded')`), 'false');
    await evaluate(`document.getElementById('themeToggle').click()`);
    assert(await evaluate(`document.body.classList.contains('light-mode')`));
    assert(requests.some(url => url === '/api/matches')); assert(requests.some(url => url.startsWith('/api/standings')));
    console.log('PASS: draft/retired exclusions and merge redirects, unknown/legacy routes, all News cards/filters, homepage cards, mobile navigation, theme toggle, mocked match/standings rendering and existing disabled Watch Live state.');
    await evaluate(`localStorage.setItem('theme', 'dark')`);
    const chromeRoutes = ['/', '/news', '/matches', '/standings', '/privacy', '/terms', '/contact', '/articles/12', '/articles/14', '/articles/32', '/about', '/watch-live'];
    const chromeMetrics = {};
    for (const width of [1440, 390, 360, 320]) {
        await viewport(width);
        for (const route of chromeRoutes) {
            await navigate(route);
            // Compare shared chrome with the same content viewport width.
            // Short unavailable pages naturally omit the desktop scrollbar.
            await evaluate(`document.documentElement.style.overflowY = 'scroll'`);
            if (route === '/' || route === '/standings') await pause(1400);
            await evaluate(`document.getElementById('installBtn').style.setProperty('display', 'none', 'important')`);
            if (await overflow()) {
                const offenders = await evaluate(`[...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed').slice(0, 12).map(e => ({tag:e.tagName, className:e.className?.baseVal || e.className, right:Math.round(e.getBoundingClientRect().right)}))`);
                throw new Error(`Horizontal overflow: ${route} at ${width}px ${JSON.stringify(offenders)}`);
            }
            const state = await evaluate(`(() => {
                const h = document.querySelector('.main-header'), f = document.querySelector('.main-footer');
                const logo = h?.querySelector('.logo img'), footerLogo = f?.querySelector('.footer-logo');
                const cols = f?.querySelectorAll('.footer-container > .footer-col');
                const box = element => element?.getBoundingClientRect();
                const style = element => element && getComputedStyle(element);
                return {
                    headerWidth: Math.round(box(h)?.width || 0), headerHeight: Math.round(box(h)?.height || 0),
                    headerBackground: style(h)?.backgroundColor, logoHeight: Math.round(box(logo)?.height || 0),
                    // A short unavailable page may have no vertical scrollbar.
                    // Compare placement inside the header, not viewport centering.
                    navLeft: Math.round((box(h.querySelector('.nav-menu'))?.left || 0) - box(h).left),
                    controlsLeft: Math.round((box(h.querySelector('.header-right'))?.left || 0) - box(h).left),
                    controlsWidth: Math.round(box(h.querySelector('.header-right'))?.width || 0),
                    installDisplay: style(h.querySelector('.header-install-btn'))?.display,
                    socialWidth: Math.round(box(h.querySelector('.social-icons'))?.width || 0),
                    socialGap: style(h.querySelector('.social-icons'))?.gap,
                    footerWidth: Math.round(box(f)?.width || 0), footerLogoHeight: Math.round(box(footerLogo)?.height || 0),
                    footerColumns: cols?.length || 0, footerGrid: style(f.querySelector('.footer-container'))?.gridTemplateColumns,
                    footerPadding: style(f)?.paddingTop, footerBackground: style(f)?.backgroundImage,
                    footerLinkMarker: getComputedStyle(f.querySelector('.links-col a'), '::before').content,
                    logoLoaded: !!logo?.naturalWidth && !!footerLogo?.naturalWidth,
                    logoPath: logo?.getAttribute('src'), footerLogoPath: footerLogo?.getAttribute('src'),
                    headerLinks: [...h.querySelectorAll('.nav-menu a')].map(a => a.pathname),
                    footerLinks: [...f.querySelectorAll('.links-col a')].map(a => a.pathname),
                    menuExists: !!document.getElementById('menuToggle'), themeExists: !!document.getElementById('themeToggle')
                };
            })()`);
            assert.equal(state.logoPath, '/logo/Logo.png', `Wrong header logo: ${route}`);
            assert.equal(state.footerLogoPath, '/logo/Logo.png', `Wrong footer logo: ${route}`);
            assert(state.logoLoaded, `Broken logo: ${route}`);
            assert.equal(state.footerColumns, 3, `Wrong footer columns: ${route}`);
            assert(state.menuExists && state.themeExists, `Missing header controls: ${route}`);
            if (route === '/') chromeMetrics[width] = state;
            else for (const key of ['headerWidth', 'headerHeight', 'headerBackground', 'logoHeight', 'navLeft', 'controlsLeft', 'footerWidth', 'footerLogoHeight', 'footerColumns', 'footerGrid', 'footerPadding', 'footerBackground', 'footerLinkMarker', 'headerLinks', 'footerLinks'])
                assert.deepEqual(state[key], chromeMetrics[width][key], `Site chrome differs from Home: ${route} ${width}px ${key}`);
            if (width <= 390) {
                await evaluate(`document.getElementById('menuToggle').click()`);
                assert.equal(await evaluate(`document.getElementById('menuToggle').getAttribute('aria-expanded')`), 'true', `Mobile menu failed: ${route}`);
                await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape'}))`);
                assert.equal(await evaluate(`document.getElementById('menuToggle').getAttribute('aria-expanded')`), 'false', `Mobile menu close failed: ${route}`);
            }
            if ([1440, 360].includes(width) && ['/', '/privacy', '/news', '/articles/32'].includes(route)) {
                const name = route === '/' ? 'home' : route.replace(/\W+/g, '-').replace(/^-|-$/g, '');
                await screenshot(`chrome-${name}-${width}-header`);
                await evaluate(`document.querySelector('.main-footer').scrollIntoView({block:'end', behavior:'instant'})`);
                await pause(250);
                await screenshot(`chrome-${name}-${width}-footer`);
            }
        }
    }
    await viewport(360);
    let lightChrome;
    for (const route of ['/', '/privacy', '/news', '/articles/32']) {
        await navigate(route);
        await evaluate(`document.getElementById('themeToggle').click()`);
        assert(await evaluate(`document.body.classList.contains('light-mode')`), `Theme toggle failed: ${route}`);
        const state = await evaluate(`({ header: getComputedStyle(document.querySelector('.main-header')).backgroundColor, footer: getComputedStyle(document.querySelector('.main-footer')).backgroundImage })`);
        if (route === '/') lightChrome = state;
        else assert.deepEqual(state, lightChrome, `Light-mode site chrome differs: ${route}`);
        await evaluate(`document.getElementById('themeToggle').click()`);
    }
    console.log('PASS: homepage-equivalent header/footer on 12 routes at 1440px, 390px, 360px and 320px; logos, menu, links and overflow checked.');
    console.log('Screenshots: ' + temp);
    fs.writeFileSync(path.join(root, '.editorial', 'browser-results.json'), JSON.stringify({ checkedAt: new Date().toISOString(), mode: 'Local Chromium; mocked football responses and external scripts; no production requests', articles: results, article9HistoricalExample:{status:'pass',javascriptDisabled:true,exactParagraphs:true,sourceLinks:5,viewportWidths:[320,360,390,1440],themes:['dark','light']}, draftsAndRetiredExcluded: draftRecords.length, mergeRedirects: retirements.merged, newsFilters: filters, viewportWidths: [320,360,390,768,1440], screenshots: temp }, null, 2) + '\n');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
    if (socket) socket.close();
    if (chrome) chrome.kill();
    server.closeAllConnections(); server.close();
});
