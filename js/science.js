/* CLI Science Library: subjects -> topics -> lesson pages. */
(function () {
  'use strict';
  var CLI = window.CLI, esc = CLI.esc, rich = CLI.rich;
  var LV = { hs: 0, college: 1, advanced: 2, phd: 3 };

  function arr(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }
  function learned() { return CLI.store.get('learned', {}); }
  function topicsOf(sid) {
    return CLI.topics.map(function (t, i) { return { t: t, i: i }; })
      .filter(function (o) { return o.t.subject === sid; })
      .sort(function (a, b) { return (LV[a.t.level] - LV[b.t.level]) || (a.i - b.i); })
      .map(function (o) { return o.t; });
  }
  function words(t) {
    if (t._w) return t._w;
    var s = [t.simple || '', t.analogy || ''];
    arr(t.sections).forEach(function (x) { s.push(x.h || ''); arr(x.p).forEach(function (p) { s.push(p); }); arr(x.list).forEach(function (p) { s.push(p); }); arr(x.steps).forEach(function (p) { s.push(p); }); });
    return (t._w = s.join(' ').split(/\s+/).length);
  }
  function mins(t) { return Math.max(3, Math.round(words(t) / 190)); }
  function heroOf(t) { return t.diagram || arr(t.diagrams)[0] || null; }
  function diagramHTML(d) { try { return CLI.diagram(d); } catch (e) { console.error(e); return ''; } }
  function lvName(id) { var l = CLI.level(id); return l ? l.short : id; }
  function crumbs(parts) {
    return '<nav class="crumbs" aria-label="Breadcrumb">' + parts.map(function (p, i) {
      return (i ? '<span class="sep">/</span>' : '') + (p.h ? '<a href="' + p.h + '">' + esc(p.t) + '</a>' : '<span aria-current="page">' + esc(p.t) + '</span>');
    }).join('') + '</nav>';
  }
  function card(t) {
    var s = CLI.subject(t.subject), done = learned()[t.id];
    return '<a class="topic-card sc' + s.c + '" href="#/science/' + t.subject + '/' + t.id + '">' +
      '<div class="tc-top"><span class="badge">' + esc(lvName(t.level)) + '</span>' + (done ? '<span class="tick" title="Marked as learned">✓ Learned</span>' : '') + '</div>' +
      '<h3>' + esc(t.title) + '</h3><p>' + esc(t.tagline || '') + '</p><span class="muted tc-min">' + mins(t) + ' min read</span></a>';
  }
  function match(t, q) {
    var x = (t.title + ' ' + (t.tagline || '') + ' ' + arr(t.keywords).map(function (k) { return k.w; }).join(' ')).toLowerCase();
    return q.toLowerCase().split(/\s+/).every(function (w) { return x.indexOf(w) >= 0; });
  }

  /* ---------- overview ---------- */
  function overview(el) {
    var L = learned();
    el.innerHTML = '<div class="page-head"><h1>Science Library</h1><p>Pick a subject, then a lesson. Every lesson starts with the big idea in plain words, then builds up the full picture with diagrams, key words, formulas and a quick self-check.</p></div>' +
      '<div class="sci-bar"><label class="sr-only" for="sci-q">Search lessons</label><input id="sci-q" type="search" placeholder="Search lessons, e.g. gravity, DNA, derivative…" autocomplete="off"></div>' +
      '<div id="sci-out"></div>';
    var out = el.querySelector('#sci-out'), inp = el.querySelector('#sci-q');
    function draw() {
      var q = inp.value.trim();
      if (q) {
        var m = CLI.topics.filter(function (t) { return match(t, q); });
        out.innerHTML = m.length ? '<p class="muted">' + m.length + ' lesson' + (m.length > 1 ? 's' : '') + ' found</p><div class="grid-auto">' + m.map(card).join('') + '</div>' : '<div class="empty card">No lessons match “' + esc(q) + '”. Try the search in the top bar to look through words and formulas too.</div>';
        return;
      }
      out.innerHTML = '<div class="subj-grid">' + CLI.SUBJECTS.map(function (s) {
        var ts = topicsOf(s.id), done = ts.filter(function (t) { return L[t.id]; }).length, pct = ts.length ? Math.round(done / ts.length * 100) : 0;
        var byLv = CLI.LEVELS.map(function (l) { var n = ts.filter(function (t) { return t.level === l.id; }).length; return n ? '<span class="badge plain">' + l.short + ' · ' + n + '</span>' : ''; }).join('');
        return '<a class="subj-card sc' + s.c + '" href="#/science/' + s.id + '"><span class="subj-mark">' + esc(s.name.charAt(0)) + '</span><h2>' + esc(s.name) + '</h2><p>' + esc(s.blurb) + '</p>' +
          '<div class="chips">' + (byLv || '<span class="muted">Lessons coming soon</span>') + '</div>' +
          '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="' + esc(s.name) + ' progress"><i style="width:' + pct + '%"></i></div>' +
          '<span class="muted small">' + done + ' of ' + ts.length + ' lessons learned</span></a>';
      }).join('') + '</div>';
    }
    inp.addEventListener('input', draw); draw();
  }

  /* ---------- subject ---------- */
  function subjectPage(el, sid) {
    var s = CLI.subject(sid);
    if (!s) { el.innerHTML = '<div class="card empty"><h2>Subject not found</h2><a class="btn primary" href="#/science">Back to the library</a></div>'; return; }
    var ts = topicsOf(sid), filter = CLI.store.get('sciLevel', 'all');
    el.innerHTML = crumbs([{ t: 'Science', h: '#/science' }, { t: s.name }]) +
      '<div class="page-head sc' + s.c + '"><h1><span class="subj-dot"></span>' + esc(s.name) + '</h1><p>' + esc(s.blurb) + '</p></div>' +
      '<div class="chips lv-chips" role="group" aria-label="Filter by level"></div><div id="sub-out"></div>';
    var chips = el.querySelector('.lv-chips'), out = el.querySelector('#sub-out');
    function draw() {
      chips.innerHTML = [{ id: 'all', short: 'All levels' }].concat(CLI.LEVELS).map(function (l) {
        var n = l.id === 'all' ? ts.length : ts.filter(function (t) { return t.level === l.id; }).length;
        return '<button type="button" class="chip" data-lv="' + l.id + '" aria-pressed="' + (filter === l.id) + '"' + (n ? '' : ' disabled') + '>' + l.short + ' <span class="muted">' + n + '</span></button>';
      }).join('');
      if (!ts.length) { out.innerHTML = '<div class="card empty">Lessons for this subject are on their way.</div>'; return; }
      out.innerHTML = CLI.LEVELS.map(function (l) {
        if (filter !== 'all' && filter !== l.id) return '';
        var list = ts.filter(function (t) { return t.level === l.id; });
        return list.length ? '<section class="lv-group"><h2>' + esc(l.name) + '</h2><div class="grid-auto sc' + s.c + '">' + list.map(card).join('') + '</div></section>' : '';
      }).join('');
    }
    chips.addEventListener('click', function (e) { var b = e.target.closest('button[data-lv]'); if (!b || b.disabled) return; filter = b.dataset.lv; CLI.store.set('sciLevel', filter); draw(); });
    draw();
  }

  /* ---------- lesson ---------- */
  function lesson(el, sid, id) {
    var t = CLI.topics.filter(function (x) { return x.id === id && x.subject === sid; })[0], s = CLI.subject(sid);
    if (!t || !s) { el.innerHTML = '<div class="card empty"><h2>Lesson not found</h2><a class="btn primary" href="#/science">Back to the library</a></div>'; return; }
    CLI.store.set('last', { subject: sid, id: id, title: t.title });
    document.title = t.title + ' — CLI';
    var list = topicsOf(sid), ix = list.indexOf(t), prev = list[ix - 1], next = list[ix + 1];
    var vocab = CLI.allVocab(), vmap = {}; vocab.forEach(function (v) { vmap[v.w.toLowerCase()] = v; });
    var hero = heroOf(t), extraHero = !t.diagram && arr(t.diagrams).length > 1 ? arr(t.diagrams).slice(1) : [];
    var secDiagrams = 0;
    var body = arr(t.sections).map(function (sec, i) {
      var h = '<section class="les-sec" id="sec-' + i + '"><h2>' + esc(sec.h) + '</h2>';
      arr(sec.p).forEach(function (p) { h += '<p>' + rich(p) + '</p>'; });
      if (sec.list) h += '<ul>' + arr(sec.list).map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ul>';
      if (sec.steps) h += '<ol>' + arr(sec.steps).map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ol>';
      if (sec.diagram) h += '<div class="card flat diagram-card">' + diagramHTML(sec.diagram) + '</div>';
      else if (extraHero[secDiagrams] && i > 0) { h += '<div class="card flat diagram-card">' + diagramHTML(extraHero[secDiagrams]) + '</div>'; secDiagrams++; }
      return h + '</section>';
    }).join('');
    while (extraHero[secDiagrams]) { body += '<div class="card flat diagram-card">' + diagramHTML(extraHero[secDiagrams]) + '</div>'; secDiagrams++; }
    var kws = arr(t.keywords), fs = arr(t.formulas);
    el.innerHTML = crumbs([{ t: 'Science', h: '#/science' }, { t: s.name, h: '#/science/' + sid }, { t: t.title }]) +
      '<article class="lesson sc' + s.c + '">' +
      '<header class="les-head"><div class="chips"><span class="badge">' + esc(s.name) + '</span><span class="badge plain">' + esc((CLI.level(t.level) || {}).name || t.level) + '</span><span class="badge plain">' + mins(t) + ' min read</span></div>' +
      '<h1>' + esc(t.title) + '</h1><p class="lead">' + esc(t.tagline || '') + '</p>' +
      '<button type="button" class="btn sm learned-btn" aria-pressed="false"></button></header>' +
      '<div class="les-grid"><div class="les-main">' +
      '<div class="simple-box"><span class="badge">In simple words</span><p>' + rich(t.simple) + '</p>' + (t.analogy ? '<p class="analogy"><strong>Think of it like this:</strong> ' + rich(t.analogy) + '</p>' : '') + '</div>' +
      (hero ? '<div class="card flat diagram-card hero-diagram">' + diagramHTML(hero) + '</div>' : '') +
      body +
      (kws.length ? '<section class="les-sec" id="sec-kw"><h2>Key words</h2><div class="chips" id="kw-chips">' + kws.map(function (k, i) { return '<button type="button" class="chip" data-k="' + i + '" aria-expanded="false">' + esc(k.w) + '</button>'; }).join('') + '</div><div class="kw-panel" id="kw-panel" aria-live="polite">Tap a word to see what it means.</div></section>' : '') +
      (fs.length ? '<section class="les-sec" id="sec-f"><h2>Formulas</h2><div class="f-list">' + fs.map(function (f) { return '<div class="f-item"><div class="f-name">' + esc(f.name) + '</div><div class="f-tex">' + CLI.tex(f.tex) + '</div>' + (f.note ? '<div class="muted">' + rich(f.note) + '</div>' : '') + '</div>'; }).join('') + '</div></section>' : '') +
      (arr(t.key).length ? '<section class="les-sec callout" id="sec-key"><h2>Remember</h2><ul>' + arr(t.key).map(function (k) { return '<li>' + rich(k) + '</li>'; }).join('') + '</ul></section>' : '') +
      (arr(t.check).length ? '<section class="les-sec" id="sec-check"><h2>Check yourself</h2>' + arr(t.check).map(function (c) { return '<details class="qa"><summary>' + rich(c.q) + '</summary><p>' + rich(c.a) + '</p></details>'; }).join('') + '</section>' : '') +
      (t.fun ? '<section class="les-sec fun"><span class="badge">Did you know?</span><p>' + rich(t.fun) + '</p></section>' : '') +
      '<nav class="les-nav" aria-label="Lessons">' + (prev ? '<a class="btn" href="#/science/' + sid + '/' + prev.id + '">← ' + esc(prev.title) + '</a>' : '<span></span>') + (next ? '<a class="btn primary" href="#/science/' + sid + '/' + next.id + '">' + esc(next.title) + ' →</a>' : '<a class="btn" href="#/science/' + sid + '">All ' + esc(s.name) + ' lessons</a>') + '</nav>' +
      '</div>' +
      '<aside class="les-toc" aria-label="On this page"><div class="card flat"><h3>On this page</h3><ul>' +
      arr(t.sections).map(function (sec, i) { return '<li><button type="button" class="toc-link" data-t="sec-' + i + '">' + esc(sec.h) + '</button></li>'; }).join('') +
      (kws.length ? '<li><button type="button" class="toc-link" data-t="sec-kw">Key words</button></li>' : '') + (fs.length ? '<li><button type="button" class="toc-link" data-t="sec-f">Formulas</button></li>' : '') + (arr(t.check).length ? '<li><button type="button" class="toc-link" data-t="sec-check">Check yourself</button></li>' : '') +
      '</ul></div></aside></div></article>';

    var lb = el.querySelector('.learned-btn');
    function paintLearned() { var on = !!learned()[id]; lb.setAttribute('aria-pressed', on); lb.textContent = on ? '✓ Marked as learned' : 'Mark as learned'; lb.classList.toggle('primary', on); }
    lb.addEventListener('click', function () { var L = learned(); if (L[id]) delete L[id]; else L[id] = 1; CLI.store.set('learned', L); paintLearned(); });
    paintLearned();
    el.querySelectorAll('.toc-link').forEach(function (b) { b.addEventListener('click', function () { var x = el.querySelector('#' + b.dataset.t); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });
    var panel = el.querySelector('#kw-panel');
    if (panel) el.querySelector('#kw-chips').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-k]'); if (!b) return;
      el.querySelectorAll('#kw-chips .chip').forEach(function (c) { c.setAttribute('aria-pressed', c === b); c.setAttribute('aria-expanded', c === b); });
      var k = kws[+b.dataset.k], v = vmap[k.w.toLowerCase()];
      panel.innerHTML = '<strong>' + esc(k.w) + '</strong> — ' + rich(k.d) + (v ? ' <a href="#/vocabulary/' + encodeURIComponent(v.w) + '">Open in the dictionary →</a>' : '');
    });
  }

  CLI.views.science = {
    mount: function (el, p) {
      var sid = p.rest[0], id = p.rest[1];
      if (!sid) overview(el); else if (!id) subjectPage(el, sid); else lesson(el, sid, id);
    },
    unmount: function () { }
  };
})();
