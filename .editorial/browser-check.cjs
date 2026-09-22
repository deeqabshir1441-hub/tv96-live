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
const draftRecords = require('./content-model.cjs').articles.filter(article => !article.isPublished);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'tv96-editorial-'));
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const requests = [];
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Nairobi' }).format(new Date());
const fixture = { id: 'editorial-test-1', home: 'Arsenal', away: 'Liverpool', homeScore: 2, awayScore: 1, league: 'Premier League', status: 'Finished', statusClass: 'status-finished', displayTime: '15:00', matchDate: date, shouldDisplay: true, isApiMatch: true, homeLogo: '/icon-192.png', awayLogo: '/icon-192.png' };
const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    requests.push(url.pathname + url.search);
    if (url.pathname === '/api/matches') {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ dates: { maanta: date }, matchesData: { shalay: [], maanta: [fixture], berri: [] } }));
    }
    if (url.pathname === '/api/standings') {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ competition: { name: 'Premier League' }, season: { startDate: '2026-08-01', endDate: '2027-05-31' }, standings: [
            { position: 1, name: 'Arsenal', played: 1, win: 1, draw: 0, lose: 0, goalsFor: 2, goalsAgainst: 1, goalDifference: 1, points: 3, form: 'W' },
            { position: 2, name: 'Liverpool', played: 1, win: 0, draw: 0, lose: 1, goalsFor: 1, goalsAgainst: 2, goalDifference: -1, points: 0, form: 'L' }
        ] }));
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
    await viewport(360);
    await navigate('/articles/32');
    assert.equal(await evaluate(`document.querySelectorAll('h1').length`), 1);
    assert(await evaluate(`document.getElementById('articleBody').innerText.length > 3000`));
    assert(!await overflow(), 'No-JavaScript article overflow');
    await screenshot('article-no-js-mobile');
    await navigate('/news');
    assert.equal(await evaluate(`document.querySelectorAll('#news-container > a').length`), published.length);
    assert(!await overflow(), 'No-JavaScript News overflow');
    await screenshot('news-no-js-mobile');
    await send('Emulation.setScriptExecutionDisabled', { value: false });
    console.log(`PASS: article body and all ${published.length} News cards visible with JavaScript disabled at 360px.`);

    for (const article of draftRecords) {
        await navigate('/articles/' + article.id);
        assert.equal(await evaluate(`document.getElementById('article-robots').content`), 'noindex, follow');
        assert(await evaluate(`document.getElementById('articleContent').innerText.includes('Page not found')`));
    }
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
    assert(await evaluate(`document.getElementById('articleCount').textContent.startsWith('8 articles')`));
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
    await navigate('/standings');
    for (let i = 0; i < 100 && !await evaluate(`document.getElementById('standingsBody').innerText.includes('Arsenal')`); i++) await pause(50);
    assert.equal(await evaluate(`document.querySelectorAll('#standingsBody tr').length`), 2);
    assert(await evaluate(`document.getElementById('standingsBody').innerText.includes('Arsenal')`));
    await navigate('/watch-live'); assert(await evaluate(`document.body.innerText.includes('Live viewing is currently unavailable')`));
    await navigate('/news');
    await evaluate(`document.getElementById('menuToggle').click()`);
    assert.equal(await evaluate(`document.getElementById('menuToggle').getAttribute('aria-expanded')`), 'true');
    await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))`);
    assert.equal(await evaluate(`document.getElementById('menuToggle').getAttribute('aria-expanded')`), 'false');
    await evaluate(`document.getElementById('themeToggle').click()`);
    assert(await evaluate(`document.body.classList.contains('light-mode')`));
    assert(requests.some(url => url === '/api/matches')); assert(requests.some(url => url.startsWith('/api/standings')));
    console.log('PASS: eight draft exclusions, unknown/legacy routes, all News cards/filters, homepage cards, mobile navigation, theme toggle, mocked match/standings rendering and existing disabled Watch Live state.');
    await evaluate(`localStorage.setItem('theme', 'dark')`);
    const chromeRoutes = ['/', '/news', '/matches', '/standings', '/privacy', '/terms', '/contact', '/articles/12', '/articles/14', '/articles/32', '/about', '/watch-live'];
    const chromeMetrics = {};
    for (const width of [1440, 390, 360, 320]) {
        await viewport(width);
        for (const route of chromeRoutes) {
            await navigate(route);
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
                    navLeft: Math.round(box(h.querySelector('.nav-menu'))?.left || 0),
                    controlsLeft: Math.round(box(h.querySelector('.header-right'))?.left || 0),
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
    fs.writeFileSync(path.join(root, '.editorial', 'browser-results.json'), JSON.stringify({ checkedAt: new Date().toISOString(), mode: 'Local Chromium; mocked football responses and external scripts; no production requests', articles: results, draftsExcluded: 8, newsFilters: filters, viewportWidths: [320,360,768,1440], screenshots: temp }, null, 2) + '\n');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
    if (socket) socket.close();
    if (chrome) chrome.kill();
    server.closeAllConnections(); server.close();
});
