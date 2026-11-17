/* CLI core: shell (nav, theme, global search), hash router, home view. */
(function () {
  'use strict';
  var CLI = window.CLI, M = CLI.math, esc = CLI.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var svg = function (inner) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>'; };
  var ICON = {
    science: svg('<path d="M9 3h6M10 3v6.2L4.6 18.3A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.7-2.7L14 9.2V3"/><path d="M7.5 15h9"/>'),
    calculator: svg('<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8.5 7h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>'),
    graphics: svg('<path d="M3.5 3.5v17h17"/><path d="M7 15l3.5-4.5 3 2.5L19 7"/>'),
    vocabulary: svg('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21a2 2 0 0 1 2-2h13M9 8h6"/>'),
    formulas: svg('<path d="M18 5H7l6 7-6 7h11"/>'),
    sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon: svg('<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>')
  };
  CLI.icon = ICON;
  var NAV = [
    { r: 'science', label: 'Science', tab: 'Science', cls: 'sc1', title: 'Science Library', desc: 'A library of science subjects from high school to PhD level, explained simply with diagrams.' },
    { r: 'calculator', label: 'Arithmetic & Logic', tab: 'Calculator', cls: 'sc6', title: 'Arithmetic & Logic Unit', desc: 'A natural scientific calculator, truth tables, number bases and an equation solver.' },
    { r: 'graphics', label: 'Graphics', tab: 'Graphs', cls: 'sc5', title: 'Graphics System', desc: 'Plot functions, curves and equations to see what a problem really looks like.' },
    { r: 'vocabulary', label: 'Vocabulary', tab: 'Words', cls: 'sc3', title: 'Scientific Vocabulary', desc: 'A science dictionary with plain-language explanations, origins and examples.' },
    { r: 'formulas', label: 'Equations & Formulas', tab: 'Formulas', cls: 'sc4', title: 'Equations & Formulas', desc: 'Formula sheets with a Try-it solver, constants, a periodic table and subject maps.' }
  ];
  CLI.NAV = NAV;

  /* ---------- vocabulary helpers (built-in + live updates + user words) ---------- */
  CLI.allVocab = function () {
    var map = {}, order = [];
    CLI.vocab.concat(CLI.store.get('customVocab', []).map(function (c) { c.custom = true; return c; })).forEach(function (v) {
      var k = v.w.toLowerCase(); if (!(k in map)) order.push(k); map[k] = v;
    });
    return order.map(function (k) { return map[k]; });
  };
  CLI.wordOfDay = function () {
    var all = CLI.vocab; if (!all.length) return null;
    var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    return all[day % all.length];
  };

  /* ---------- shell ---------- */
  function buildNav() {
    $('#nav').innerHTML = NAV.map(function (n) { return '<a href="#/' + n.r + '" data-r="' + n.r + '">' + n.label + '</a>'; }).join('');
    $('#tabbar').innerHTML = NAV.map(function (n) { return '<a href="#/' + n.r + '" data-r="' + n.r + '">' + ICON[n.r] + '<span>' + n.tab + '</span></a>'; }).join('');
  }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    CLI.store.set('theme', t);
    var b = $('#theme-toggle');
    b.innerHTML = t === 'dark' ? ICON.sun : ICON.moon;
    b.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', t === 'dark' ? '#0e171c' : '#1d7480');
    document.dispatchEvent(new CustomEvent('cli:theme'));
  }

  /* ---------- router ---------- */
  var current = null, currentRoute = '';
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, ''), q = {}, i = h.indexOf('?');
    if (i >= 0) { h.slice(i + 1).split('&').forEach(function (p) { if (!p) return; var kv = p.split('='); try { q[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' ')); } catch (e) { /* ignore bad escapes */ } }); h = h.slice(0, i); }
    var parts = h.split('/').filter(Boolean).map(function (s) { try { return decodeURIComponent(s); } catch (e) { return s; } });
    return { route: parts[0] || 'home', rest: parts.slice(1), query: q };
  }
  function route() {
    var p = parseHash(), view = CLI.views[p.route];
    if (current && current.unmount) { try { current.unmount(); } catch (e) { console.error(e); } }
    current = null; currentRoute = p.route;
    var el = $('#view'); el.innerHTML = '';
    document.querySelectorAll('[data-r]').forEach(function (a) { if (a.dataset.r === p.route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (!view) { el.innerHTML = '<div class="card empty"><h2>Page not found</h2><p>That page does not exist.</p><a class="btn primary" href="#/">Back to home</a></div>'; document.title = 'Not found — CLI'; return; }
    var nav = NAV.filter(function (n) { return n.r === p.route; })[0];
    document.title = (nav ? nav.title : 'CLI') + ' — CLI';
    try { view.mount(el, p); current = view; }
    catch (e) { console.error(e); el.innerHTML = '<div class="card empty"><h2>Something went wrong</h2><p>This page could not be displayed. Please reload.</p><a class="btn primary" href="#/">Back to home</a></div>'; }
    if (!p.query.keep) window.scrollTo(0, 0);
    el.focus({ preventScroll: true });
  }
  CLI.route = route;
  CLI.go = function (r, state) {
    CLI.handoff = state ? { to: r.split('/')[0], state: state } : null;
    var target = '#/' + r;
    if (location.hash === target) route(); else location.hash = target;
  };

  /* ---------- global search ---------- */
  var idx = null, sel = 0, lastFocus = null, results = [];
  function buildIndex() {
    idx = [];
    CLI.topics.forEach(function (t) { idx.push({ k: 'Topic', t: t.title, s: (CLI.subject(t.subject) || {}).name + ' · ' + (CLI.level(t.level) || {}).short, h: '#/science/' + t.subject + '/' + t.id, x: (t.title + ' ' + t.tagline + ' ' + (t.keywords || []).map(function (k) { return k.w; }).join(' ')).toLowerCase(), w: 0 }); });
    CLI.allVocab().forEach(function (v) { idx.push({ k: 'Word', t: v.w, s: v.def.length > 90 ? v.def.slice(0, 88) + '…' : v.def, h: '#/vocabulary/' + encodeURIComponent(v.w), x: (v.w + ' ' + v.def + ' ' + (v.simple || '')).toLowerCase(), w: 1 }); });
    CLI.formulas.forEach(function (f) { idx.push({ k: 'Formula', t: f.name, s: (CLI.subject(f.subject) || {}).name + ' · ' + f.topic, h: '#/formulas/equations/' + f.id, x: (f.name + ' ' + f.topic).toLowerCase(), w: 2 }); });
    CLI.elements.forEach(function (e) { idx.push({ k: 'Element', t: e.name + ' (' + e.sym + ')', s: 'Atomic number ' + e.z, h: '#/formulas/periodic/' + e.sym, x: (e.name + ' ' + e.sym + ' ' + e.z).toLowerCase(), w: 3 }); });
    CLI.constants.forEach(function (c) { idx.push({ k: 'Constant', t: c.name, s: c.unit, h: '#/formulas/constants?q=' + encodeURIComponent(c.name), x: c.name.toLowerCase(), w: 4 }); });
  }
  function doSearch(q) {
    q = q.trim().toLowerCase(); if (!q) return [];
    var toks = q.split(/\s+/);
    return idx.filter(function (e) { return toks.every(function (t) { return e.x.indexOf(t) >= 0; }); }).map(function (e) {
      var tl = e.t.toLowerCase(); return { e: e, sc: (tl === q ? 0 : tl.indexOf(q) === 0 ? 1 : tl.indexOf(q) > 0 ? 2 : 3) * 10 + e.w };
    }).sort(function (a, b) { return a.sc - b.sc; }).slice(0, 40).map(function (r) { return r.e; });
  }
  function renderResults() {
    var box = $('#search-results'), q = $('#search-input').value;
    results = doSearch(q); sel = 0;
    if (!q.trim()) { box.innerHTML = '<div class="empty">Type to search lessons, words, formulas, constants and elements.</div>'; return; }
    if (!results.length) { box.innerHTML = '<div class="empty">No matches for “' + esc(q) + '”.</div>'; return; }
    box.innerHTML = results.map(function (r, i) { return '<a href="' + r.h + '" role="option" data-i="' + i + '"' + (i === 0 ? ' class="sel"' : '') + '><span class="kind">' + r.k + '</span><span><span class="t">' + esc(r.t) + '</span><span class="s">' + esc(r.s) + '</span></span></a>'; }).join('');
  }
  function openSearch(q) {
    if (!idx) buildIndex();
    lastFocus = document.activeElement;
    $('#search').classList.add('open');
    var inp = $('#search-input'); inp.value = q || ''; renderResults(); inp.focus(); inp.select();
  }
  function closeSearch() { $('#search').classList.remove('open'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  CLI.openSearch = openSearch;
  function moveSel(d) {
    var items = $('#search-results').querySelectorAll('a'); if (!items.length) return;
    items[sel].classList.remove('sel'); sel = (sel + d + items.length) % items.length;
    items[sel].classList.add('sel'); items[sel].scrollIntoView({ block: 'nearest' });
  }
  function bindSearch() {
    $('#search-open').addEventListener('click', function () { openSearch(''); });
    $('#search-input').addEventListener('input', renderResults);
    $('#search').addEventListener('click', function (e) { if (e.target === this || e.target.closest('a')) closeSearch(); });
    document.addEventListener('keydown', function (e) {
      var open = $('#search').classList.contains('open');
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open ? closeSearch() : openSearch(''); return; }
      if (!open) {
        var tag = (e.target.tagName || '').toLowerCase();
        if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && tag !== 'select' && !e.target.isContentEditable) { e.preventDefault(); openSearch(''); }
        return;
      }
      if (e.key === 'Escape') { e.preventDefault(); closeSearch(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); }
      else if (e.key === 'Enter') { var a = $('#search-results a.sel'); if (a) { e.preventDefault(); location.hash = a.getAttribute('href'); closeSearch(); } }
      else if (e.key === 'Tab') { e.preventDefault(); $('#search-input').focus(); }
    });
  }

  /* ---------- home ---------- */
  CLI.views.home = {
    mount: function (el) {
      var wod = CLI.wordOfDay(), last = CLI.store.get('last', null);
      var stats = [[CLI.topics.length, 'lessons'], [CLI.vocab.length, 'science words'], [CLI.formulas.length, 'formulas'], [CLI.elements.length || 118, 'elements']];
      el.innerHTML =
        '<section class="hero"><div class="hero-card"><div>' +
        '<h1><span>C</span>ognitive <span>L</span>earning <span>I</span>nterface</h1>' +
        '<p class="lead">Learn science, calculate, plot graphs and look things up in one calm place. Every lesson, word and formula is built right into this site: no accounts, no AI, nothing to install.</p>' +
        '<div class="cta"><a class="btn primary" href="#/science">Start learning</a><a class="btn" href="#/calculator">Open the calculator</a></div></div>' +
        '<div class="stats">' + stats.map(function (s) { return '<div class="stat"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('') + '</div></div></section>' +
        '<section class="features" aria-label="Features">' + NAV.map(function (n) {
          return '<a class="feature ' + n.cls + '" href="#/' + n.r + '"><span class="ico">' + ICON[n.r] + '</span><h3>' + n.title + '</h3><p>' + n.desc + '</p><span class="go">Open →</span></a>';
        }).join('') + '</section>' +
        '<section class="home-split">' +
        (wod ? '<div class="card wotd"><span class="badge plain">Word of the day</span><div class="word">' + esc(wod.w) + '</div><div class="pron">' + esc(wod.pron || '') + ' · ' + esc(wod.pos || '') + '</div><p>' + esc(wod.simple || wod.def) + '</p><a class="btn sm" href="#/vocabulary/' + encodeURIComponent(wod.w) + '">Read the full entry</a></div>' : '') +
        '<div class="card"><span class="badge plain">Keep going</span><h3 style="margin-top:8px">' + (last ? esc(last.title) : 'Pick a subject') + '</h3><p class="muted">' + (last ? 'Continue the lesson you were reading.' : 'Physics, chemistry, biology, mathematics, earth &amp; space and computing are waiting.') + '</p>' +
        (last ? '<a class="btn sm primary" href="#/science/' + last.subject + '/' + last.id + '">Continue</a> ' : '') + '<a class="btn sm" href="#/science">Browse the library</a></div>' +
        '</section>';
    }
  };

  /* ---------- boot (called by boot.js after all scripts) ---------- */
  CLI.start = function () {
    buildNav(); bindSearch();
    $('#year').textContent = new Date().getFullYear();
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    $('#theme-toggle').addEventListener('click', function () { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });
    window.addEventListener('hashchange', route);
    route();
    /* optional live dictionary updates: edit data/vocab-updates.json on the server and every visitor gets them */
    if (location.protocol.indexOf('http') === 0 && window.fetch) {
      fetch('data/vocab-updates.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (!j || !Array.isArray(j.words) || !j.words.length) return;
        var have = {}; CLI.vocab.forEach(function (v, i) { have[v.w.toLowerCase()] = i; });
        j.words.forEach(function (w) { if (!w || !w.w || !w.def) return; w.updated = true; var k = w.w.toLowerCase(); if (k in have) CLI.vocab[have[k]] = w; else { have[k] = CLI.vocab.length; CLI.vocab.push(w); } });
        idx = null; if (currentRoute === 'vocabulary' || currentRoute === 'home') route();
      }).catch(function () { /* offline or file:// — built-in dictionary is used */ });
    }
  };
})();
