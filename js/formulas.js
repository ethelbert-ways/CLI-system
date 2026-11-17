/* CLI Equations & Formulas: formula sheets with a "Try it" solver, constants, periodic table, subject maps. */
(function () {
  'use strict';
  var CLI = window.CLI, M = CLI.math, esc = CLI.esc;
  var TABS = [['equations', 'Equations'], ['constants', 'Constants'], ['periodic', 'Periodic table'], ['maps', 'Subject maps']];

  function norm(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function subjName(id) { var s = CLI.subject(id); return s ? s.name : id; }
  function sciHTML(v) {
    if (v === 0) return '0';
    var s = M.fmt(v, { sig: 10 }), m = /^(-?[\d.]+)E(-?\d+)$/.exec(s);
    return m ? m[1] + ' × 10<sup>' + m[2].replace('-', '−') + '</sup>' : s;
  }
  function unitOf(desc) { var m = /\(([^()]+)\)\s*$/.exec(desc || ''); return m ? m[1] : ''; }
  function sup(cfg) { return esc(cfg).replace(/([spdf])(\d+)/g, '$1<sup>$2</sup>'); }

  /* ---------- Equations ---------- */
  function equations(el, p) {
    var st = { q: '', subj: 'all', lv: 'all' }, focus = p.rest[1] || '';
    el.innerHTML = '<div class="f-tools"><label class="sr-only" for="f-q">Search formulas</label><input id="f-q" type="search" placeholder="Search formulas, e.g. force, pH, derivative…" autocomplete="off">' +
      '<div class="chips" id="f-subj" role="group" aria-label="Subject"></div>' +
      '<label class="field inline"><span>Level</span><select id="f-lv"><option value="all">All levels</option>' + CLI.LEVELS.map(function (l) { return '<option value="' + l.id + '">' + esc(l.name) + '</option>'; }).join('') + '</select></label>' +
      '<p class="muted small" id="f-count" aria-live="polite"></p></div><div id="f-list"></div>';
    var list = el.querySelector('#f-list'), subj = el.querySelector('#f-subj'), cnt = el.querySelector('#f-count');
    function ok(f) {
      if (st.subj !== 'all' && f.subject !== st.subj) return false;
      if (st.lv !== 'all' && f.level !== st.lv) return false;
      var toks = norm(st.q).split(/\s+/).filter(Boolean), x = norm(f.name + ' ' + f.topic + ' ' + (f.about || '') + ' ' + Object.keys(f.vars || {}).map(function (k) { return f.vars[k]; }).join(' '));
      return toks.every(function (t) { return x.indexOf(t) >= 0; });
    }
    function cardHTML(f) {
      var vars = Object.keys(f.vars || {}).map(function (k) { return '<dt>' + CLI.tex(k.replace(/_(\w+)/, '_{$1}').replace(/^(Delta|theta|lambda|omega|mu|rho|sigma|alpha|beta|gamma|epsilon|phi|pi|tau|eta|nu)/, '\\$1 ')) + '</dt><dd>' + esc(f.vars[k]) + '</dd>'; }).join('');
      var solve = f.solve ? '<details class="try"><summary>Try it: calculate with numbers</summary><div class="try-body" data-id="' + f.id + '"></div></details>' : '';
      var sc = (CLI.subject(f.subject) || {}).c || 1;
      return '<article class="f-card sc' + sc + '" id="f-' + f.id + '"><header><h3>' + esc(f.name) + '</h3><span class="badge plain">' + esc((CLI.level(f.level) || {}).short || f.level) + '</span></header>' +
        '<div class="f-big">' + CLI.tex(f.tex) + '</div><p class="muted">' + esc(f.about || '') + '</p><dl class="f-vars">' + vars + '</dl>' + solve + '</article>';
    }
    function draw() {
      var fs = CLI.formulas.filter(ok);
      cnt.textContent = fs.length === CLI.formulas.length ? fs.length + ' formulas' : fs.length + ' of ' + CLI.formulas.length + ' formulas';
      if (!fs.length) { list.innerHTML = '<div class="card empty">No formulas match.</div>'; return; }
      var groups = {}, order = [];
      fs.forEach(function (f) { var k = f.subject + '|' + f.topic; if (!groups[k]) { groups[k] = []; order.push(k); } groups[k].push(f); });
      var html = '', curS = '', ids = CLI.SUBJECTS.map(function (s) { return s.id; });
      order.sort(function (a, b) { return ids.indexOf(a.split('|')[0]) - ids.indexOf(b.split('|')[0]); }).forEach(function (k) {
        var s = k.split('|')[0];
        if (s !== curS) { curS = s; html += '<h2 class="f-subj">' + esc(subjName(s)) + '</h2>'; }
        html += '<h3 class="f-topic">' + esc(k.split('|')[1]) + '</h3><div class="f-grid">' + groups[k].map(cardHTML).join('') + '</div>';
      });
      list.innerHTML = html;
      list.querySelectorAll('.try-body').forEach(function (b) { buildTry(b); });
      if (focus) { var n = list.querySelector('#f-' + focus); if (n) { setTimeout(function () { n.scrollIntoView({ block: 'center' }); n.classList.add('flash'); }, 60); } focus = ''; }
    }
    function drawChips() { subj.innerHTML = [{ id: 'all', name: 'All subjects' }].concat(CLI.SUBJECTS).map(function (s) { return '<button type="button" class="chip" data-s="' + s.id + '" aria-pressed="' + (st.subj === s.id) + '">' + esc(s.name) + '</button>'; }).join(''); }
    el.querySelector('#f-q').addEventListener('input', function (e) { st.q = e.target.value; draw(); });
    el.querySelector('#f-lv').addEventListener('change', function (e) { st.lv = e.target.value; draw(); });
    subj.addEventListener('click', function (e) { var b = e.target.closest('[data-s]'); if (b) { st.subj = b.dataset.s; drawChips(); draw(); } });
    drawChips(); draw();
  }

  function buildTry(box) {
    var f = CLI.formulas.filter(function (x) { return x.id === box.dataset.id; })[0], targets = Object.keys(f.solve);
    box.innerHTML = '<label class="field"><span>Solve for</span><select class="t-target">' + targets.map(function (t) { return '<option value="' + esc(t) + '">' + esc(t) + ' — ' + esc(f.vars[t] || '') + '</option>'; }).join('') + '</select></label>' +
      '<div class="t-inputs"></div><div class="t-out" aria-live="polite"></div>';
    var sel = box.querySelector('.t-target'), inputs = box.querySelector('.t-inputs'), out = box.querySelector('.t-out');
    function names(t) { return Object.keys(f.vars).filter(function (k) { return k !== t; }); }
    function build() {
      inputs.innerHTML = names(sel.value).map(function (k) {
        var u = unitOf(f.vars[k]);
        return '<label class="field"><span>' + esc(k) + ' — ' + esc(f.vars[k]) + '</span><input type="text" inputmode="decimal" data-v="' + esc(k) + '" placeholder="' + (u ? esc(u) : 'value') + '" autocomplete="off"></label>';
      }).join('');
      out.textContent = 'Enter the values above (you can type things like 2*3 or 1.5e3).';
    }
    function calc() {
      var t = sel.value, scope = {}, miss = false;
      inputs.querySelectorAll('input').forEach(function (i) {
        var s = i.value.trim(); if (!s) { miss = true; return; }
        try { var v = M.evaluate(s, {}, 'rad'); if (!isFinite(v)) throw 0; scope[i.dataset.v] = v; i.removeAttribute('aria-invalid'); } catch (e) { miss = true; i.setAttribute('aria-invalid', 'true'); }
      });
      if (miss) { out.textContent = 'Enter the values above (you can type things like 2*3 or 1.5e3).'; return; }
      try {
        var v = M.compile(M.parse(f.solve[t], { names: Object.keys(scope) }), { mode: 'rad', scope: scope })();
        if (typeof v !== 'number' || !isFinite(v)) throw 0;
        var u = unitOf(f.vars[t]);
        out.innerHTML = '<strong>' + esc(t) + ' = ' + sciHTML(Number(v.toPrecision(8))) + '</strong> ' + esc(u);
      } catch (e) { out.textContent = 'No real result for these values. Check the numbers (for example, no dividing by zero).'; }
    }
    sel.addEventListener('change', build); inputs.addEventListener('input', calc); build();
  }

  /* ---------- Constants ---------- */
  function constants(el, p) {
    var q = p.query.q || '';
    el.innerHTML = '<div class="f-tools"><input id="c-q" type="search" placeholder="Search constants…" aria-label="Search constants" autocomplete="off" value="' + esc(q) + '"></div><div class="const-list" id="c-list"></div>';
    var list = el.querySelector('#c-list');
    function draw(t) {
      var toks = norm(t).split(/\s+/).filter(Boolean);
      var cs = CLI.constants.filter(function (c) { var x = norm(c.name + ' ' + c.unit + ' ' + subjName(c.subj)); return toks.every(function (k) { return x.indexOf(k) >= 0; }); });
      list.innerHTML = cs.length ? cs.map(function (c) {
        return '<div class="const"><div class="c-name"><strong>' + esc(c.name) + '</strong><span class="badge plain">' + esc(subjName(c.subj)) + '</span>' + (c.exact ? '<span class="badge">exact</span>' : '') + '</div>' +
          '<div class="c-sym">' + CLI.tex(c.tex) + '</div><div class="c-val">' + sciHTML(c.val) + ' <span class="muted">' + esc(c.unit) + '</span></div>' +
          '<button type="button" class="btn sm" data-copy="' + esc(String(c.val)) + '" aria-label="Copy value of ' + esc(c.name) + '">Copy</button>' + (c.note ? '<div class="muted small c-note">' + esc(c.note) + '</div>' : '') + '</div>';
      }).join('') : '<div class="card empty">No constants match.</div>';
    }
    el.querySelector('#c-q').addEventListener('input', function (e) { draw(e.target.value); });
    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-copy]'); if (!b) return;
      var v = b.dataset.copy;
      function done() { CLI.toast('Copied ' + v); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done, done); else done();
    });
    draw(q);
  }

  /* ---------- Periodic table ---------- */
  var CATS = [['alkali', 'Alkali metals', 'var(--c4)'], ['alkaline', 'Alkaline earth', 'var(--c3)'], ['transition', 'Transition metals', 'var(--c1)'], ['post-transition', 'Post-transition metals', 'var(--c6)'],
    ['metalloid', 'Metalloids', 'var(--c2)'], ['nonmetal', 'Nonmetals', 'var(--c5)'], ['halogen', 'Halogens', 'color-mix(in srgb, var(--c2) 55%, var(--c1))'], ['noble', 'Noble gases', 'color-mix(in srgb, var(--c5) 55%, var(--c4))'],
    ['lanthanide', 'Lanthanides', 'color-mix(in srgb, var(--c1) 50%, var(--c6))'], ['actinide', 'Actinides', 'color-mix(in srgb, var(--c4) 50%, var(--c3))'], ['unknown', 'Properties unknown', 'var(--muted)']];
  function pos(e) {
    if (e.cat === 'lanthanide' && e.z >= 57 && e.z <= 71) return [9, 3 + e.z - 57];
    if (e.cat === 'actinide' && e.z >= 89 && e.z <= 103) return [10, 3 + e.z - 89];
    return [e.period, e.group];
  }
  function periodic(el, p) {
    var els = CLI.elements, cur = null, flt = '';
    if (!els.length) { el.innerHTML = '<div class="card empty">The periodic table is on its way.</div>'; return; }
    var want = (p.rest[1] || '').toLowerCase();
    cur = els.filter(function (e) { return e.sym.toLowerCase() === want || String(e.z) === want; })[0] || els[0];
    el.innerHTML = '<div class="pt-top"><label class="sr-only" for="pt-q">Find an element</label><input id="pt-q" type="search" placeholder="Find an element: name, symbol or number" autocomplete="off"></div>' +
      '<div class="chips pt-legend" id="pt-legend" role="group" aria-label="Highlight a category"></div>' +
      '<div class="pt-scroll"><div class="pt-grid" id="pt-grid"></div></div><p class="muted small pt-hint">Scroll sideways on small screens. Tap an element for details.</p><div id="pt-detail" class="card pt-detail" aria-live="polite"></div>';
    var grid = el.querySelector('#pt-grid'), det = el.querySelector('#pt-detail'), leg = el.querySelector('#pt-legend');
    function catColor(c) { for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === c) return CATS[i][2]; return 'var(--muted)'; }
    function catName(c) { for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === c) return CATS[i][1]; return c; }
    function drawGrid() {
      var h = '<div class="pt-ph" style="grid-row:6;grid-column:3">57–71</div><div class="pt-ph" style="grid-row:7;grid-column:3">89–103</div>';
      els.forEach(function (e) {
        var ps = pos(e), dim = flt && e.cat !== flt;
        h += '<button type="button" class="pt-el' + (dim ? ' dim' : '') + (cur && cur.z === e.z ? ' on' : '') + '" style="grid-row:' + ps[0] + ';grid-column:' + ps[1] + ';--pc:' + catColor(e.cat) + '" data-z="' + e.z + '" aria-label="' + esc(e.name) + ', atomic number ' + e.z + '"><small>' + e.z + '</small><b>' + esc(e.sym) + '</b></button>';
      });
      grid.innerHTML = h;
    }
    function drawLegend() { leg.innerHTML = CATS.map(function (c) { return '<button type="button" class="chip" data-c="' + c[0] + '" aria-pressed="' + (flt === c[0]) + '"><span class="dot" style="background:' + c[2] + '"></span>' + c[1] + '</button>'; }).join(''); }
    function drawDetail() {
      var e = cur, block = e.cat === 'lanthanide' || e.cat === 'actinide' ? 'f' : (e.group <= 2 || e.sym === 'He') ? 's' : e.group >= 13 ? 'p' : 'd';
      det.style.setProperty('--pc', catColor(e.cat));
      det.innerHTML = '<div class="pt-d-sym"><small>' + e.z + '</small><b>' + esc(e.sym) + '</b><span>' + (typeof e.mass === 'number' ? e.mass : '') + '</span></div><div class="pt-d-info"><h3>' + esc(e.name) + '</h3><dl>' +
        '<dt>Category</dt><dd>' + esc(catName(e.cat)) + '</dd><dt>Atomic number</dt><dd>' + e.z + '</dd><dt>Atomic mass</dt><dd>' + e.mass + (e.cat === 'unknown' ? ' (most stable isotope)' : '') + '</dd>' +
        '<dt>Period / Group</dt><dd>' + e.period + ' / ' + (e.group == null ? 'f-block' : e.group) + '</dd><dt>Block</dt><dd>' + block + '</dd>' +
        '<dt>Electron configuration</dt><dd>' + sup(e.config || '') + '</dd><dt>State at room temperature</dt><dd>' + esc(e.state) + '</dd>' +
        '<dt>Electronegativity</dt><dd>' + (e.en == null ? 'not established' : e.en) + '</dd></dl></div>';
    }
    grid.addEventListener('click', function (e) { var b = e.target.closest('[data-z]'); if (!b) return; cur = els.filter(function (x) { return x.z === +b.dataset.z; })[0]; drawGrid(); drawDetail(); });
    leg.addEventListener('click', function (e) { var b = e.target.closest('[data-c]'); if (!b) return; flt = flt === b.dataset.c ? '' : b.dataset.c; drawLegend(); drawGrid(); });
    el.querySelector('#pt-q').addEventListener('input', function (e) {
      var t = norm(e.target.value.trim()); if (!t) return;
      var m = els.filter(function (x) { return norm(x.name) === t || norm(x.sym) === t || String(x.z) === t; })[0] || els.filter(function (x) { return norm(x.name).indexOf(t) === 0; })[0];
      if (m) { cur = m; drawGrid(); drawDetail(); var b = grid.querySelector('.on'); if (b && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center' }); }
    });
    drawLegend(); drawGrid(); drawDetail();
  }

  /* ---------- Subject maps ---------- */
  function maps(el, p) {
    var sid = p.rest[1] || CLI.store.get('mapSubj', 'physics');
    el.innerHTML = '<p class="muted">Every subject is split into branches, sub-branches and topics. Open a branch to see what is inside, and tap a topic to search for it across CLI.</p>' +
      '<div class="chips" id="m-subj" role="group" aria-label="Subject">' + CLI.SUBJECTS.map(function (s) { return '<button type="button" class="chip" data-s="' + s.id + '" aria-pressed="' + (s.id === sid) + '">' + esc(s.name) + '</button>'; }).join('') + '</div>' +
      '<div class="row m-actions"><button type="button" class="btn sm" data-x="open">Expand all</button><button type="button" class="btn sm" data-x="close">Collapse all</button></div><div id="m-tree" class="card"></div>';
    var tree = el.querySelector('#m-tree');
    function node(n, depth) {
      if (typeof n === 'string') n = { t: n };
      if (n.kids && n.kids.length) return '<li><details' + (depth < 1 ? ' open' : '') + '><summary>' + esc(n.t) + '<span class="muted small"> · ' + n.kids.length + '</span></summary><ul>' + n.kids.map(function (k) { return node(k, depth + 1); }).join('') + '</ul></details></li>';
      return '<li class="leaf"><button type="button" class="leaf-btn" data-q="' + esc(n.t) + '">' + esc(n.t) + '</button></li>';
    }
    function draw() {
      var b = CLI.branches.filter(function (x) { return x.subject === sid; })[0];
      tree.className = 'card sc' + ((CLI.subject(sid) || {}).c || 1);
      tree.innerHTML = b ? '<ul class="m-tree root">' + node(b.tree, 0) + '</ul>' : '<div class="empty">This map is on its way.</div>';
    }
    el.querySelector('#m-subj').addEventListener('click', function (e) {
      var b = e.target.closest('[data-s]'); if (!b) return; sid = b.dataset.s; CLI.store.set('mapSubj', sid);
      el.querySelectorAll('#m-subj .chip').forEach(function (c) { c.setAttribute('aria-pressed', c === b); }); draw();
    });
    el.querySelector('.m-actions').addEventListener('click', function (e) { var b = e.target.closest('[data-x]'); if (!b) return; tree.querySelectorAll('details').forEach(function (d) { d.open = b.dataset.x === 'open'; }); });
    tree.addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (b) CLI.openSearch(b.dataset.q); });
    draw();
  }

  CLI.views.formulas = {
    mount: function (el, p) {
      var tab = p.rest[0] || 'equations';
      if (!TABS.some(function (t) { return t[0] === tab; })) tab = 'equations';
      el.innerHTML = '<div class="page-head"><h1>Equations &amp; Formulas</h1><p>Formula sheets you can calculate with, physical constants, the periodic table and structural maps of every science subject.</p></div>' +
        '<div class="tabs" role="tablist" aria-label="Sections">' + TABS.map(function (t) { return '<button class="tab" role="tab" type="button" data-t="' + t[0] + '" aria-selected="' + (t[0] === tab) + '">' + t[1] + '</button>'; }).join('') + '</div><div class="f-pane" id="f-pane"></div>';
      el.querySelector('.tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) CLI.go('formulas/' + b.dataset.t); });
      var pane = el.querySelector('#f-pane');
      ({ equations: equations, constants: constants, periodic: periodic, maps: maps })[tab](pane, p);
    },
    unmount: function () { }
  };
})();
