/* CLI Arithmetic & Logic Unit: tab shell + scientific calculator.
   Other tabs live in logic.js (CLI.alu.logic, CLI.alu.bases) and solver.js (CLI.alu.solver). */
(function () {
  'use strict';
  var CLI = window.CLI, M = CLI.math, esc = CLI.esc;
  CLI.alu = CLI.alu || {};
  var TABS = [['sci', 'Scientific'], ['logic', 'Logic'], ['bases', 'Bases & Bitwise'], ['solver', 'Solver']];
  var active = null;

  /* ---------- scientific calculator ---------- */
  function sci(el) {
    var S = CLI.store.get('calcState', null) || {};
    S = { mode: S.mode || 'deg', fmt: S.fmt || 'norm', digits: typeof S.digits === 'number' ? S.digits : 4, x: S.x == null ? '0' : String(S.x), mem: +S.mem || 0, ans: +S.ans || 0 };
    var hist = CLI.store.get('calcHist', []); if (!Array.isArray(hist)) hist = [];
    var st = { second: false, hyp: false, view: 'dec', last: null, more: false };
    var MODES = ['deg', 'rad', 'grad'];

    el.innerHTML =
      '<div class="cs-layout">' +
      '<section class="cs-main" aria-label="Calculator">' +
      '<div class="cs-display card">' +
      '<div class="cs-status" aria-hidden="true"><span id="s-mode"></span><span id="s-2nd">2nd</span><span id="s-hyp">Hyp</span><span id="s-mem">M</span><span id="s-fmt"></span></div>' +
      '<label class="sr-only" for="cs-expr">Expression</label>' +
      '<input id="cs-expr" class="cs-expr" type="text" inputmode="none" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="0" enterkeyhint="done">' +
      '<div class="cs-result" id="cs-result" aria-live="polite">0</div>' +
      '<div class="cs-varrow hidden" id="cs-varrow"><label for="cs-x">x =</label><input id="cs-x" type="text" inputmode="decimal" autocomplete="off"></div>' +
      '</div>' +
      '<div class="cs-tools">' +
      '<button type="button" class="chip" data-a="mode" title="Angle mode"></button>' +
      '<label class="cs-sel"><span class="sr-only">Number format</span><select id="cs-fmt"><option value="norm">Norm</option><option value="fix">Fix</option><option value="sci">Sci</option></select></label>' +
      '<label class="cs-sel hidden" id="cs-dwrap"><span class="sr-only">Digits</span><select id="cs-digits"></select></label>' +
      '<button type="button" class="chip" data-a="sd" title="Toggle decimal / fraction result">S⇔D</button>' +
      '<button type="button" class="chip" data-a="copy">Copy</button>' +
      '<button type="button" class="chip" data-a="graph">Graph it</button>' +
      '<button type="button" class="chip cs-moretoggle" data-a="more" aria-pressed="false">More functions</button>' +
      '</div>' +
      '<div class="cs-keys"><div class="cs-sci" id="cs-sci"></div><div class="cs-pad" id="cs-pad"></div></div>' +
      '<details class="cs-help card flat"><summary>How this calculator works</summary><ul>' +
      '<li>Type with the keys or your keyboard. <b>Enter</b> gives the answer, <b>Esc</b> clears.</li>' +
      '<li>You can leave out the × sign: <code>2π</code>, <code>3(4+5)</code>, <code>2sin(30)</code>.</li>' +
      '<li><code>1/2π</code> means 1 ÷ (2π), like a Casio. Brackets you forget to close are closed for you.</li>' +
      '<li>Angle modes are DEG, RAD and GRAD. Type <code>30°</code> to force degrees. <b>2nd</b> gives inverse trig and <b>Hyp</b> gives hyperbolic functions.</li>' +
      '<li>Use <b>x</b> in an expression, set its value under the display, then press <b>Graph it</b>.</li>' +
      '<li><b>S⇔D</b> switches the answer between decimal and fraction. <b>Ans</b> is your last answer. <b>M+</b>, <b>M−</b>, <b>MR</b> and <b>MC</b> use the memory.</li></ul></details>' +
      '</section>' +
      '<aside class="cs-hist card" aria-label="History"><div class="cs-hist-head"><h2>History</h2><button type="button" class="btn sm ghost" data-a="clearhist">Clear</button></div><ol id="cs-hlist" class="cs-hlist"></ol><p class="muted" id="cs-hempty">Your calculations will appear here.</p></aside>' +
      '</div>';

    var expr = el.querySelector('#cs-expr'), res = el.querySelector('#cs-result'), xin = el.querySelector('#cs-x');
    var sciBox = el.querySelector('#cs-sci'), pad = el.querySelector('#cs-pad');
    var fmtSel = el.querySelector('#cs-fmt'), digSel = el.querySelector('#cs-digits');
    var d; for (d = 0; d <= 9; d++) digSel.innerHTML += '<option value="' + d + '">' + d + ' digits</option>';
    var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    function sciKeys() {
      var h = st.hyp ? 'h' : '', a = st.second ? 'a' : '', sup = (st.hyp ? 'h' : '') + (st.second ? '⁻¹' : '');
      return [
        { l: '2nd', a: 'second', cls: 'fn tog', on: st.second }, { l: 'Hyp', a: 'hyp', cls: 'fn tog', on: st.hyp }, { l: 'x', ins: 'x', cls: 'fn' }, { l: 'M+', a: 'm+', cls: 'mem' }, { l: 'M−', a: 'm-', cls: 'mem' },
        { l: 'sin' + sup, ins: a + 'sin' + h + '(' }, { l: 'cos' + sup, ins: a + 'cos' + h + '(' }, { l: 'tan' + sup, ins: a + 'tan' + h + '(' }, { l: 'ln', ins: 'ln(' }, { l: 'log', ins: 'log(' },
        { l: '√', ins: '√(' }, { l: 'x²', ins: '^2' }, { l: 'xʸ', ins: '^' }, { l: '1/x', ins: '^(-1)' }, { l: 'x!', ins: '!' },
        { l: 'π', ins: 'π' }, { l: 'e', ins: 'e' }, { l: 'nPr', ins: 'nPr(' }, { l: 'nCr', ins: 'nCr(' }, { l: 'Abs', ins: 'abs(' },
        { l: 'eˣ', ins: 'e^(' }, { l: '10ˣ', ins: '10^(' }, { l: '∛', ins: '∛(' }, { l: 'mod', ins: ' mod ' }, { l: '%', ins: '%' },
        { l: 'MR', a: 'mr', cls: 'mem' }, { l: 'MC', a: 'mc', cls: 'mem' }, { l: 'Ran#', ins: 'rand()' }, { l: 'log₂', ins: 'log2(' }, { l: 'ʸ√x', ins: 'root(' }
      ];
    }
    var PAD = [
      { l: '7', ins: '7', cls: 'num' }, { l: '8', ins: '8', cls: 'num' }, { l: '9', ins: '9', cls: 'num' }, { l: 'DEL', a: 'del', cls: 'del' }, { l: 'AC', a: 'ac', cls: 'del' },
      { l: '4', ins: '4', cls: 'num' }, { l: '5', ins: '5', cls: 'num' }, { l: '6', ins: '6', cls: 'num' }, { l: '×', ins: '×', cls: 'op' }, { l: '÷', ins: '÷', cls: 'op' },
      { l: '1', ins: '1', cls: 'num' }, { l: '2', ins: '2', cls: 'num' }, { l: '3', ins: '3', cls: 'num' }, { l: '+', ins: '+', cls: 'op' }, { l: '−', ins: '−', cls: 'op' },
      { l: '0', ins: '0', cls: 'num' }, { l: '.', ins: '.', cls: 'num' }, { l: 'EXP', ins: 'E', cls: 'fn' }, { l: '(−)', ins: '−', cls: 'op' }, { l: 'Ans', ins: 'Ans', cls: 'fn' },
      { l: '(', ins: '(', cls: 'fn' }, { l: ')', ins: ')', cls: 'fn' }, { l: '◀', a: 'left', cls: 'fn', al: 'Cursor left' }, { l: '▶', a: 'right', cls: 'fn', al: 'Cursor right' }, { l: '=', a: 'eq', cls: 'eq', al: 'Equals' }
    ];
    var SK = [];
    function keyHTML(k, i, grp) {
      var tog = (k.a === 'second' || k.a === 'hyp') ? ' aria-pressed="' + !!k.on + '"' : '';
      return '<button type="button" class="ck ' + (k.cls || '') + (k.on ? ' on' : '') + '" data-g="' + grp + '" data-i="' + i + '" aria-label="' + esc(k.al || k.l) + '"' + tog + '>' + esc(k.l) + '</button>';
    }
    function drawKeys() {
      SK = sciKeys();
      sciBox.innerHTML = SK.map(function (k, i) { return keyHTML(k, i, 'sci'); }).join('');
      pad.innerHTML = PAD.map(function (k, i) { return keyHTML(k, i, 'pad'); }).join('');
    }

    function show(v) {
      if (typeof v !== 'number' || !isFinite(v)) return 'Math Error';
      if (st.view === 'frac') { var f = M.toFraction(v, 10000, 1e-12); if (f && f.d !== 1) return (f.n < 0 ? '−' : '') + Math.abs(f.n) + '/' + f.d; }
      return M.fmt(v, { mode: S.fmt, digits: S.digits }).replace(/^-/, '−');
    }
    function evalNow(src) {
      try { return { v: M.evaluate(src, { x: parseFloat(S.x) || 0, ans: S.ans, M: S.mem }, S.mode) }; }
      catch (e) { return { err: e && e.name === 'MathErr' ? (e.kind === 'syntax' ? 'Syntax Error' : e.kind === 'var' ? e.message : 'Math Error') : 'Syntax Error' }; }
    }
    function save() { CLI.store.set('calcState', S); }
    function status() {
      el.querySelector('#s-mode').textContent = S.mode.toUpperCase();
      el.querySelector('#s-2nd').classList.toggle('on', st.second);
      el.querySelector('#s-hyp').classList.toggle('on', st.hyp);
      el.querySelector('#s-mem').classList.toggle('on', !!S.mem);
      el.querySelector('#s-fmt').textContent = S.fmt === 'norm' ? '' : (S.fmt === 'fix' ? 'Fix ' : 'Sci ') + S.digits;
      el.querySelector('[data-a="mode"]').textContent = S.mode.toUpperCase();
      var sd = el.querySelector('[data-a="sd"]'); sd.setAttribute('aria-pressed', st.view === 'frac'); sd.classList.toggle('active', st.view === 'frac');
      fmtSel.value = S.fmt; digSel.value = String(S.digits);
      el.querySelector('#cs-dwrap').classList.toggle('hidden', S.fmt === 'norm');
    }
    function varsRow() {
      var need;
      try { need = !!M.freeVars(M.parse(expr.value, { names: ['x', 'ans', 'M'] })).x; } catch (e) { need = /(^|[^a-zA-Z])x([^a-zA-Z]|$)/.test(expr.value); }
      el.querySelector('#cs-varrow').classList.toggle('hidden', !need);
    }
    function preview() {
      var s = expr.value.trim(); varsRow();
      res.classList.remove('err');
      if (!s) { res.textContent = st.last == null ? '0' : show(st.last); res.classList.remove('faint'); return; }
      var r = evalNow(s);
      if (r.err) { res.textContent = st.last == null ? '' : show(st.last); res.classList.add('faint'); return; }
      res.textContent = show(r.v); res.classList.add('faint');
    }
    function equals() {
      var s = expr.value.trim(); if (!s) return;
      var r = evalNow(s);
      if (r.err) { res.textContent = r.err; res.classList.add('err'); res.classList.remove('faint'); return; }
      st.last = r.v; S.ans = r.v; save();
      res.classList.remove('err', 'faint'); res.textContent = show(r.v);
      hist.unshift({ e: s, r: M.fmt(r.v, { mode: 'norm' }), v: r.v }); hist = hist.slice(0, 50); CLI.store.set('calcHist', hist); drawHist();
    }
    function drawHist() {
      var ol = el.querySelector('#cs-hlist'); ol.innerHTML = '';
      el.querySelector('#cs-hempty').classList.toggle('hidden', hist.length > 0);
      hist.forEach(function (h, i) {
        var li = document.createElement('li');
        var a = document.createElement('button'); a.type = 'button'; a.className = 'h-expr'; a.textContent = h.e; a.dataset.use = 'e'; a.dataset.i = i; a.title = 'Reuse expression';
        var b = document.createElement('button'); b.type = 'button'; b.className = 'h-res'; b.textContent = '= ' + String(h.r).replace(/^-/, '−'); b.dataset.use = 'r'; b.dataset.i = i; b.title = 'Use result';
        li.appendChild(a); li.appendChild(b); ol.appendChild(li);
      });
    }

    function insert(txt) {
      var a = expr.selectionStart == null ? expr.value.length : expr.selectionStart, b = expr.selectionEnd == null ? a : expr.selectionEnd;
      expr.value = expr.value.slice(0, a) + txt + expr.value.slice(b);
      var p = a + txt.length; expr.setSelectionRange(p, p); preview();
    }
    function del() {
      var a = expr.selectionStart, b = expr.selectionEnd;
      if (a !== b) { expr.value = expr.value.slice(0, a) + expr.value.slice(b); expr.setSelectionRange(a, a); }
      else if (a > 0) { expr.value = expr.value.slice(0, a - 1) + expr.value.slice(a); expr.setSelectionRange(a - 1, a - 1); }
      preview();
    }
    function move(dx) { var p = Math.max(0, Math.min(expr.value.length, (expr.selectionStart || 0) + dx)); expr.setSelectionRange(p, p); }
    function memAdd(sign) {
      var s = expr.value.trim(), v = st.last;
      if (s) { var r = evalNow(s); if (r.err) { res.textContent = r.err; res.classList.add('err'); return; } v = r.v; }
      if (v == null) return;
      S.mem += sign * v; save(); status(); CLI.toast('Memory = ' + M.fmt(S.mem));
    }
    function act(a) {
      switch (a) {
        case 'second': st.second = !st.second; drawKeys(); status(); break;
        case 'hyp': st.hyp = !st.hyp; drawKeys(); status(); break;
        case 'del': del(); break;
        case 'ac': expr.value = ''; res.classList.remove('err'); st.view = 'dec'; status(); preview(); break;
        case 'left': move(-1); break;
        case 'right': move(1); break;
        case 'eq': equals(); break;
        case 'm+': memAdd(1); break;
        case 'm-': memAdd(-1); break;
        case 'mr': insert('M'); break;
        case 'mc': S.mem = 0; save(); status(); CLI.toast('Memory cleared'); break;
      }
    }
    function press(e) {
      var b = e.target.closest('.ck'); if (!b) return;
      var k = (b.dataset.g === 'sci' ? SK : PAD)[+b.dataset.i]; if (!k) return;
      if (k.a) act(k.a);
      else if (k.ins != null) {
        insert(k.ins);
        if (st.second || st.hyp) { st.second = false; st.hyp = false; drawKeys(); status(); }
      }
      if (!coarse && document.activeElement !== expr) expr.focus();
    }
    sciBox.addEventListener('click', press); pad.addEventListener('click', press);
    [sciBox, pad].forEach(function (b) { b.addEventListener('mousedown', function (e) { if (e.target.closest('.ck')) e.preventDefault(); }); });

    expr.addEventListener('input', function () {
      var a = expr.selectionStart, v = expr.value, n = v.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
      if (n !== v) { expr.value = n; expr.setSelectionRange(a, a); }
      res.classList.remove('err'); preview();
    });
    expr.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); equals(); }
      else if (e.key === 'Escape') { e.preventDefault(); act('ac'); }
    });
    xin.value = S.x;
    xin.addEventListener('input', function () { S.x = xin.value; save(); preview(); });

    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]'); if (!b || b.classList.contains('ck')) return;
      var a = b.dataset.a;
      if (a === 'mode') { S.mode = MODES[(MODES.indexOf(S.mode) + 1) % 3]; save(); status(); preview(); }
      else if (a === 'sd') {
        st.view = st.view === 'dec' ? 'frac' : 'dec'; status();
        if (expr.value.trim()) { var r = evalNow(expr.value); if (!r.err) res.textContent = show(r.v); }
        else if (st.last != null) res.textContent = show(st.last);
      }
      else if (a === 'copy') {
        var t = res.textContent.replace('−', '-');
        var ok = function () { CLI.toast('Copied ' + t); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, ok); else ok();
      }
      else if (a === 'graph') { var f = expr.value.trim(); if (!f) { CLI.toast('Type an expression first'); return; } CLI.go('graphics', { fn: f, mode: S.mode }); if (S.mode !== 'rad' && /sin|cos|tan|sec|csc|cot/i.test(f)) CLI.toast('Graphing in ' + (S.mode === 'deg' ? 'degrees' : 'gradians') + ' like your calculator. Change it in the graph settings.'); }
      else if (a === 'more') {
        st.more = !st.more; el.querySelector('.cs-keys').classList.toggle('show-more', st.more);
        b.setAttribute('aria-pressed', st.more); b.textContent = st.more ? 'Fewer functions' : 'More functions';
      }
      else if (a === 'clearhist') { hist = []; CLI.store.set('calcHist', hist); drawHist(); }
    });
    el.querySelector('#cs-hlist').addEventListener('click', function (e) {
      var b = e.target.closest('[data-use]'); if (!b) return;
      var h = hist[+b.dataset.i]; if (!h) return;
      if (b.dataset.use === 'e') { expr.value = h.e; expr.setSelectionRange(h.e.length, h.e.length); preview(); }
      else insert(String(h.r));
      if (!coarse) expr.focus();
    });
    fmtSel.addEventListener('change', function () { S.fmt = fmtSel.value; save(); status(); preview(); });
    digSel.addEventListener('change', function () { S.digits = +digSel.value; save(); status(); preview(); });

    drawKeys(); drawHist(); status(); preview();
    if (!coarse) expr.focus();
    return function () {};
  }

  /* ---------- tab shell ---------- */
  CLI.views.calculator = {
    mount: function (el) {
      var tab = CLI.store.get('aluTab', 'sci');
      if (!TABS.some(function (t) { return t[0] === tab; })) tab = 'sci';
      el.innerHTML = '<div class="v-calc"><div class="page-head"><h1>Arithmetic &amp; Logic Unit</h1><p>A scientific calculator that works like the real thing, plus logic tables, number bases and an equation solver.</p></div>' +
        '<div class="tabs" role="tablist" aria-label="Calculator sections">' + TABS.map(function (t) { return '<button class="tab" role="tab" type="button" data-t="' + t[0] + '" aria-selected="false">' + t[1] + '</button>'; }).join('') + '</div>' +
        '<div class="calc-pane" id="calc-pane" role="tabpanel"></div></div>';
      var pane = el.querySelector('#calc-pane');
      function open(t) {
        if (active && active.unmount) { try { active.unmount(); } catch (e) { console.error(e); } }
        active = null; pane.innerHTML = ''; tab = t; CLI.store.set('aluTab', t);
        el.querySelectorAll('.tab').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.t === t); });
        var box = document.createElement('div'); box.className = 'calc-' + t; pane.appendChild(box);
        if (t === 'sci') { active = { unmount: sci(box) }; }
        else { var mod = CLI.alu[t]; if (mod) { mod.mount(box); active = mod; } else box.innerHTML = '<div class="card empty">This section is on its way.</div>'; }
      }
      el.querySelector('.tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) open(b.dataset.t); });
      open(tab);
    },
    unmount: function () { if (active && active.unmount) { try { active.unmount(); } catch (e) { /* ignore */ } } active = null; }
  };
})();
