/* ALU: Boolean logic (truth tables, Quine-McCluskey, K-map) and Bases & Bitwise (BigInt). */
(function () {
  'use strict';
  var CLI = window.CLI, esc = CLI.esc;
  CLI.alu = CLI.alu || {};

  /* ================= LOGIC ================= */
  var SYM = { and: '∧', or: '∨', xor: '⊕', nand: '↑', nor: '↓', xnor: '⊙', imp: '→', iff: '↔' };
  var SYMBOLS = { '&': 'and', '∧': 'and', '·': 'and', '*': 'and', '.': 'and', '|': 'or', '∨': 'or', '+': 'or', '^': 'xor', '⊕': 'xor', '→': 'imp', '⇒': 'imp', '↔': 'iff', '⇔': 'iff', '=': 'iff', '↑': 'nand', '↓': 'nor', '⊙': 'xnor' };
  var WORDS = { and: 'and', or: 'or', xor: 'xor', nand: 'nand', nor: 'nor', xnor: 'xnor', implies: 'imp', iff: 'iff', not: 'not', 'true': 'T', 'false': 'F' };

  function lex(src) {
    var t = [], i = 0, s = String(src);
    while (i < s.length) {
      var c = s[i], three = s.substr(i, 3), two = s.substr(i, 2);
      if (/\s/.test(c)) { i++; continue; }
      if (three === '<=>' || three === '<->') { t.push({ k: 'op', v: 'iff' }); i += 3; continue; }
      if (two === '=>' || two === '->') { t.push({ k: 'op', v: 'imp' }); i += 2; continue; }
      if (two === '==') { t.push({ k: 'op', v: 'iff' }); i += 2; continue; }
      if ('([{'.indexOf(c) >= 0) { t.push({ k: '(' }); i++; continue; }
      if (')]}'.indexOf(c) >= 0) { t.push({ k: ')' }); i++; continue; }
      if ('!~¬'.indexOf(c) >= 0) { t.push({ k: 'not' }); i++; continue; }
      if ("'′’".indexOf(c) >= 0) { t.push({ k: 'post' }); i++; continue; }
      if (SYMBOLS[c]) { t.push({ k: 'op', v: SYMBOLS[c] }); i++; continue; }
      if (c === '0' || c === '1') { t.push({ k: 'c', v: +c }); i++; continue; }
      if (/[A-Za-z]/.test(c)) {
        var j = i; while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
        var run = s.slice(i, j), w = WORDS[run.toLowerCase()];
        if (w) {
          if (w === 'not') t.push({ k: 'not' }); else if (w === 'T') t.push({ k: 'c', v: 1 }); else if (w === 'F') t.push({ k: 'c', v: 0 }); else t.push({ k: 'op', v: w });
        } else run.split('').forEach(function (ch) { t.push({ k: 'v', v: ch.toUpperCase() }); });
        i = j; continue;
      }
      throw new Error('I do not understand "' + c + '"');
    }
    return t;
  }
  function lparse(src) {
    var t = lex(src), p = 0;
    if (!t.length) throw new Error('Type an expression');
    function isOp(vs) { var x = t[p]; return x && x.k === 'op' && vs.indexOf(x.v) >= 0; }
    function starts(x) { return x && (x.k === 'v' || x.k === 'c' || x.k === '(' || x.k === 'not'); }
    function iff() { var a = imp(); while (isOp(['iff'])) { p++; a = { t: 'bin', op: 'iff', a: a, b: imp() }; } return a; }
    function imp() { var a = orr(); if (isOp(['imp'])) { p++; return { t: 'bin', op: 'imp', a: a, b: imp() }; } return a; }
    function orr() { var a = xo(); while (isOp(['or', 'nor'])) { var o = t[p++].v; a = { t: 'bin', op: o, a: a, b: xo() }; } return a; }
    function xo() { var a = an(); while (isOp(['xor', 'xnor'])) { var o = t[p++].v; a = { t: 'bin', op: o, a: a, b: an() }; } return a; }
    function an() {
      var a = un();
      for (;;) {
        if (isOp(['and', 'nand'])) { var o = t[p++].v; a = { t: 'bin', op: o, a: a, b: un() }; }
        else if (starts(t[p])) a = { t: 'bin', op: 'and', a: a, b: un() };
        else break;
      }
      return a;
    }
    function un() { if (t[p] && t[p].k === 'not') { p++; return { t: 'not', a: un() }; } return po(); }
    function po() { var a = pr(); while (t[p] && t[p].k === 'post') { p++; a = { t: 'not', a: a }; } return a; }
    function pr() {
      var x = t[p++];
      if (!x) throw new Error('The expression ends too early');
      if (x.k === 'v') return { t: 'v', n: x.v };
      if (x.k === 'c') return { t: 'c', v: x.v };
      if (x.k === '(') { var e = iff(); if (t[p] && t[p].k === ')') p++; else if (p < t.length) throw new Error('Missing )'); return e; }
      throw new Error('Unexpected symbol');
    }
    var ast = iff();
    if (p < t.length) throw new Error('Unexpected symbol');
    return ast;
  }
  function ev(n, env) {
    switch (n.t) {
      case 'v': return env[n.n];
      case 'c': return n.v;
      case 'not': return ev(n.a, env) ? 0 : 1;
    }
    var a = ev(n.a, env), b = ev(n.b, env);
    switch (n.op) {
      case 'and': return a & b; case 'or': return a | b; case 'xor': return a ^ b;
      case 'nand': return (a & b) ^ 1; case 'nor': return (a | b) ^ 1; case 'xnor': return (a ^ b) ^ 1;
      case 'imp': return (a ^ 1) | b; case 'iff': return (a ^ b) ^ 1;
    }
  }
  function vars(n, o) {
    o = o || {};
    if (n.t === 'v') o[n.n] = 1; else if (n.t === 'not') vars(n.a, o); else if (n.t === 'bin') { vars(n.a, o); vars(n.b, o); }
    return o;
  }
  function str(n, top) {
    if (n.t === 'v') return n.n;
    if (n.t === 'c') return String(n.v);
    if (n.t === 'not') return '¬' + (n.a.t === 'bin' ? '(' + str(n.a, true) + ')' : str(n.a));
    var s = str(n.a) + ' ' + SYM[n.op] + ' ' + str(n.b);
    return top ? s : '(' + s + ')';
  }
  function subs(n, out, seen) {
    if (n.t === 'not') subs(n.a, out, seen); else if (n.t === 'bin') { subs(n.a, out, seen); subs(n.b, out, seen); }
    if (n.t === 'not' || n.t === 'bin') { var k = str(n, true); if (!seen[k]) { seen[k] = 1; out.push(n); } }
    return out;
  }
  function bits(m, n) { var b = m.toString(2); while (b.length < n) b = '0' + b; return b; }

  /* Quine-McCluskey */
  function qm(ms, n) {
    if (!ms.length) return [];
    if (ms.length === (1 << n)) return [new Array(n + 1).join('-')];
    var cur = {}, primes = [], i, j, k;
    ms.forEach(function (m) { cur[bits(m, n)] = 1; });
    for (;;) {
      var keys = Object.keys(cur), used = {}, nxt = {};
      for (i = 0; i < keys.length; i++) for (j = i + 1; j < keys.length; j++) {
        var a = keys[i], b = keys[j], d = -1, ok = true;
        for (k = 0; k < n; k++) if (a[k] !== b[k]) { if (a[k] === '-' || b[k] === '-' || d >= 0) { ok = false; break; } d = k; }
        if (ok && d >= 0) { nxt[a.slice(0, d) + '-' + a.slice(d + 1)] = 1; used[a] = 1; used[b] = 1; }
      }
      keys.forEach(function (key) { if (!used[key]) primes.push(key); });
      if (!Object.keys(nxt).length) break;
      cur = nxt;
    }
    function cov(p, m) { for (var q = 0; q < n; q++) { var bit = (m >> (n - 1 - q)) & 1; if (p[q] !== '-' && +p[q] !== bit) return false; } return true; }
    var pc = primes.map(function (p) { return ms.filter(function (m) { return cov(p, m); }); });
    var chosen = {};
    ms.forEach(function (m) { var c = []; primes.forEach(function (p, x) { if (pc[x].indexOf(m) >= 0) c.push(x); }); if (c.length === 1) chosen[c[0]] = 1; });
    var left = ms.filter(function (m) { return !Object.keys(chosen).some(function (x) { return pc[x].indexOf(m) >= 0; }); });
    var best = null, nodes = 0;
    function lits(x) { return primes[x].replace(/-/g, '').length; }
    function rec(lf, pick) {
      if (nodes++ > 30000) return;
      if (!lf.length) { var s = pick.length * 100 + pick.reduce(function (t, x) { return t + lits(x); }, 0); if (!best || s < best.s) best = { s: s, p: pick.slice() }; return; }
      if (best && (pick.length + 1) * 100 > best.s) return;
      var bc = null;
      lf.forEach(function (m) { var c = []; primes.forEach(function (p, x) { if (pc[x].indexOf(m) >= 0) c.push(x); }); if (!bc || c.length < bc.length) bc = c; });
      bc.forEach(function (x) { rec(lf.filter(function (m) { return pc[x].indexOf(m) < 0; }), pick.concat(x)); });
    }
    rec(left, []);
    var res = Object.keys(chosen).map(Number);
    if (best) res = res.concat(best.p); else primes.forEach(function (p, x) { if (res.indexOf(x) < 0) res.push(x); });
    return res.map(function (x) { return primes[x]; }).sort();
  }
  function sop(terms, V) {
    if (!terms.length) return '0';
    return terms.map(function (t) {
      var l = []; for (var i = 0; i < t.length; i++) if (t[i] !== '-') l.push((t[i] === '0' ? '¬' : '') + V[i]);
      return l.length ? l.join('·') : '1';
    }).join(' + ');
  }
  function pos(terms, V) {
    if (!terms.length) return '1';
    return terms.map(function (t) {
      var l = []; for (var i = 0; i < t.length; i++) if (t[i] !== '-') l.push((t[i] === '1' ? '¬' : '') + V[i]);
      return l.length ? (terms.length > 1 && l.length > 1 ? '(' + l.join(' ∨ ') + ')' : l.join(' ∨ ')) : '0';
    }).join(' · ');
  }
  function kmap(n, V, tbl) {
    var rN = n === 4 ? 2 : 1, cN = n - rN, gray = [0, 1, 3, 2];
    var rO = rN === 1 ? [0, 1] : gray, cO = cN === 1 ? [0, 1] : gray;
    var h = '<div class="lg-scroll"><table class="kmap" aria-label="Karnaugh map"><thead><tr><th class="corner">' + esc(V.slice(0, rN).join('')) + ' \\ ' + esc(V.slice(rN).join('')) + '</th>';
    cO.forEach(function (c) { h += '<th>' + bits(c, cN) + '</th>'; });
    h += '</tr></thead><tbody>';
    rO.forEach(function (r) {
      h += '<tr><th>' + bits(r, rN) + '</th>';
      cO.forEach(function (c) { var v = tbl[(r << cN) | c]; h += '<td class="' + (v ? 'one' : 'zero') + '">' + v + '</td>'; });
      h += '</tr>';
    });
    return h + '</tbody></table></div>';
  }

  var EXAMPLES = [['A ∧ B', 'A and B'], ['¬(A ∨ B)', 'De Morgan'], ['A → B', 'Implication'], ['A ⊕ B ⊕ C', 'Parity'], ['AB + BC + AC', 'Majority'], ['A ∨ ¬A', 'Tautology'], ['(A → B) ∧ (B → C) → (A → C)', 'Syllogism']];
  var OPBTNS = ['∧', '∨', '¬', '⊕', '→', '↔', '↑', '↓', '(', ')'];

  function logic(el) {
    var fmt01 = CLI.store.get('lgFmt', '10');
    el.innerHTML = '<div class="lg">' +
      '<div class="card lg-in"><label for="lg-e" class="lg-label">Boolean expression</label>' +
      '<input id="lg-e" type="text" class="lg-expr" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="e.g. A ∧ (B ∨ ¬C)" value="A ∧ (B ∨ ¬C)">' +
      '<div class="lg-ops" role="group" aria-label="Insert symbol">' + ['A', 'B', 'C', 'D'].concat(OPBTNS).map(function (o) { return '<button type="button" class="chip lg-op" data-ins="' + o + '">' + o + '</button>'; }).join('') + '</div>' +
      '<div class="lg-ex"><span class="muted">Try:</span> ' + EXAMPLES.map(function (e, i) { return '<button type="button" class="chip" data-ex="' + i + '">' + esc(e[1]) + '</button>'; }).join('') + '</div>' +
      '<details class="lg-cmp"><summary>Compare with another expression</summary><label for="lg-e2" class="sr-only">Second expression</label><input id="lg-e2" type="text" class="lg-expr" autocomplete="off" spellcheck="false" placeholder="e.g. ¬A ∨ ¬B"></details>' +
      '<details class="lg-help"><summary>Which symbols can I type?</summary><p>AND: <code>∧ &amp; · *</code> or write <code>AB</code> &nbsp; OR: <code>∨ | +</code> &nbsp; NOT: <code>¬ ! ~</code> or <code>A\'</code> &nbsp; XOR: <code>⊕ ^</code> &nbsp; NAND: <code>↑</code> &nbsp; NOR: <code>↓</code> &nbsp; XNOR: <code>⊙</code> &nbsp; IF-THEN: <code>→ -&gt;</code> &nbsp; IF-AND-ONLY-IF: <code>↔ &lt;-&gt;</code>. You can also type the words <code>and or not xor nand nor xnor implies iff</code>. Use <code>0</code> and <code>1</code> as constants. Up to 8 variables (A to Z).</p></details>' +
      '</div><div id="lg-out" aria-live="polite"></div></div>';
    var inp = el.querySelector('#lg-e'), inp2 = el.querySelector('#lg-e2'), out = el.querySelector('#lg-out'), last = inp;
    inp.addEventListener('focus', function () { last = inp; }); inp2.addEventListener('focus', function () { last = inp2; });

    function render() {
      var h = '', ast, V, n, rows, i, k;
      try { ast = lparse(inp.value); } catch (e) { out.innerHTML = '<div class="card lg-err">' + esc(e.message) + '</div>'; return; }
      var ast2 = null, cmpMsg = '';
      if (inp2.value.trim()) { try { ast2 = lparse(inp2.value); } catch (e2) { cmpMsg = 'Second expression: ' + e2.message; } }
      var vs = vars(ast); if (ast2) vars(ast2, vs);
      V = Object.keys(vs).sort(); n = V.length;
      if (n > 8) { out.innerHTML = '<div class="card lg-err">That uses ' + n + ' variables. Please use 8 or fewer.</div>'; return; }
      rows = 1 << n;
      var sub = subs(ast, [], {}), root = str(ast, true);
      sub = sub.filter(function (s) { return str(s, true) !== root; }).slice(0, 10);
      var tbl = [], subv = sub.map(function () { return []; }), second = [], env = {};
      for (i = 0; i < rows; i++) {
        for (k = 0; k < n; k++) env[V[k]] = (i >> (n - 1 - k)) & 1;
        tbl.push(ev(ast, env));
        sub.forEach(function (s, x) { subv[x].push(ev(s, env)); });
        if (ast2) second.push(ev(ast2, env));
      }
      var ones = [], zeros = [];
      tbl.forEach(function (v, x) { (v ? ones : zeros).push(x); });
      var kind = ones.length === rows ? 'Tautology: always true' : ones.length === 0 ? 'Contradiction: always false' : 'Contingent: sometimes true, sometimes false';
      var show = function (v) { return fmt01 === 'TF' ? (v ? 'T' : 'F') : String(v); };

      h += '<div class="card"><div class="lg-head"><h2>Truth table</h2><label class="lg-fmt"><span class="sr-only">Show as</span><select id="lg-fmt"><option value="10"' + (fmt01 === '10' ? ' selected' : '') + '>1 / 0</option><option value="TF"' + (fmt01 === 'TF' ? ' selected' : '') + '>T / F</option></select></label></div>' +
        '<p class="lg-kind ' + (ones.length === rows ? 'taut' : ones.length === 0 ? 'contra' : '') + '">' + kind + '</p>' +
        '<div class="lg-scroll"><table class="tt"><thead><tr>' + V.map(function (v) { return '<th>' + v + '</th>'; }).join('') + sub.map(function (s) { return '<th class="sub">' + esc(str(s, true)) + '</th>'; }).join('') + '<th class="res">' + esc(root) + '</th>' + (ast2 ? '<th class="res2">' + esc(str(ast2, true)) + '</th>' : '') + '</tr></thead><tbody>';
      for (i = 0; i < rows; i++) {
        h += '<tr' + (tbl[i] ? ' class="on"' : '') + '>';
        for (k = 0; k < n; k++) h += '<td>' + show((i >> (n - 1 - k)) & 1) + '</td>';
        sub.forEach(function (s, x) { h += '<td class="sub ' + (subv[x][i] ? 'one' : 'zero') + '">' + show(subv[x][i]) + '</td>'; });
        h += '<td class="res ' + (tbl[i] ? 'one' : 'zero') + '">' + show(tbl[i]) + '</td>';
        if (ast2) h += '<td class="res2 ' + (second[i] ? 'one' : 'zero') + '">' + show(second[i]) + '</td>';
        h += '</tr>';
      }
      h += '</tbody></table></div></div>';

      if (ast2 || cmpMsg) {
        h += '<div class="card"><h2>Comparison</h2>';
        if (cmpMsg) h += '<p class="lg-err-t">' + esc(cmpMsg) + '</p>';
        else {
          var diff = []; for (i = 0; i < rows; i++) if (tbl[i] !== second[i]) diff.push(i);
          if (!diff.length) h += '<p class="lg-kind taut">Equivalent: both expressions give the same answer in every row.</p>';
          else h += '<p class="lg-kind contra">Not equivalent: they differ in ' + diff.length + ' of ' + rows + ' rows. First difference: ' + V.map(function (v, x) { return v + '=' + show((diff[0] >> (n - 1 - x)) & 1); }).join(', ') + '.</p>';
        }
        h += '</div>';
      }

      if (n >= 1) {
        var minT = qm(ones, n), maxT = qm(zeros, n);
        h += '<div class="card"><h2>Simplest forms</h2><dl class="lg-forms">' +
          '<dt>Simplified (sum of products)</dt><dd class="big">' + esc(sop(minT, V)) + '</dd>' +
          '<dt>Simplified (product of sums)</dt><dd class="big">' + esc(pos(maxT, V)) + '</dd>' +
          '<dt>Minterms Σm</dt><dd>' + (ones.length ? '(' + ones.join(', ') + ')' : 'none') + '</dd>' +
          '<dt>Maxterms ΠM</dt><dd>' + (zeros.length ? '(' + zeros.join(', ') + ')' : 'none') + '</dd>' +
          '<dt>Canonical sum of products</dt><dd>' + (ones.length ? esc(sop(ones.map(function (m) { return bits(m, n); }), V)) : '0') + '</dd>' +
          '</dl><p class="muted lg-note">Simplified with the Quine–McCluskey method. Variables are written in alphabetical order; A is the most significant bit of the row number.</p></div>';
        if (n >= 2 && n <= 4) h += '<div class="card"><h2>Karnaugh map</h2>' + kmap(n, V, tbl) + '<p class="muted lg-note">Neighbouring cells differ by one variable. Groups of 1s (in 2s, 4s, 8s, wrapping around the edges) give the simplified terms.</p></div>';
      }
      out.innerHTML = h;
    }

    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ins]');
      if (b) {
        var t = last, a = t.selectionStart == null ? t.value.length : t.selectionStart, z = t.selectionEnd == null ? a : t.selectionEnd;
        t.value = t.value.slice(0, a) + b.dataset.ins + t.value.slice(z); var p = a + b.dataset.ins.length; t.setSelectionRange(p, p); t.focus(); render(); return;
      }
      b = e.target.closest('[data-ex]');
      if (b) { inp.value = EXAMPLES[+b.dataset.ex][0]; last = inp; render(); }
    });
    el.addEventListener('change', function (e) { if (e.target.id === 'lg-fmt') { fmt01 = e.target.value; CLI.store.set('lgFmt', fmt01); render(); } });
    inp.addEventListener('input', render); inp2.addEventListener('input', render);
    render();
  }
  CLI.alu.logic = { mount: logic, unmount: function () {} };

  /* ================= BASES & BITWISE ================= */
  var DIG = '0123456789abcdefghijklmnopqrstuvwxyz';
  function parseBig(s, base) {
    s = String(s).trim().replace(/[\s_,]/g, '').toLowerCase();
    if (!s) return null;
    var neg = false;
    if (s[0] === '-') { neg = true; s = s.slice(1); } else if (s[0] === '+') s = s.slice(1);
    if (/^0x/.test(s)) { base = 16; s = s.slice(2); } else if (/^0b/.test(s)) { base = 2; s = s.slice(2); } else if (/^0o/.test(s)) { base = 8; s = s.slice(2); }
    if (!s) return null;
    var v = 0n, B = BigInt(base);
    for (var i = 0; i < s.length; i++) { var d = DIG.indexOf(s[i]); if (d < 0 || d >= base) return null; v = v * B + BigInt(d); }
    return neg ? -v : v;
  }
  function toBase(v, base) { return v.toString(base).toUpperCase(); }
  function group(s, n) { var o = '', i; for (i = s.length; i > 0; i -= n) o = s.slice(Math.max(0, i - n), i) + (o ? ' ' + o : ''); return o; }
  function padBin(u, w) { var b = u.toString(2); while (b.length < w) b = '0' + b; return b; }

  function bases(el) {
    var W = +CLI.store.get('bsW', 32) || 32, signed = CLI.store.get('bsSigned', true) !== false, u = 0n;
    var OPS = [['and', 'AND'], ['or', 'OR'], ['xor', 'XOR'], ['nand', 'NAND'], ['nor', 'NOR'], ['xnor', 'XNOR'], ['not', 'NOT A'], ['shl', 'A ≪ B'], ['shr', 'A ≫ B'], ['sar', 'A ≫ B (sign)'], ['rol', 'ROL'], ['ror', 'ROR']];
    var op = 'and';
    el.innerHTML = '<div class="bs">' +
      '<div class="card"><div class="bs-top"><h2>Number converter</h2><div class="bs-cfg"><label>Width <select id="bs-w">' + [8, 16, 32, 64].map(function (w) { return '<option value="' + w + '"' + (w === W ? ' selected' : '') + '>' + w + '-bit</option>'; }).join('') + '</select></label>' +
      '<label class="bs-chk"><input type="checkbox" id="bs-s"' + (signed ? ' checked' : '') + '> Signed (two\'s complement)</label></div></div>' +
      '<div class="bs-fields">' + [['dec', 'Decimal', 10], ['hex', 'Hexadecimal', 16], ['oct', 'Octal', 8], ['bin', 'Binary', 2]].map(function (f) { return '<label class="bs-f"><span>' + f[1] + '</span><input type="text" id="bs-' + f[0] + '" data-b="' + f[2] + '" autocomplete="off" spellcheck="false" inputmode="' + (f[2] === 16 ? 'text' : 'decimal') + '"></label>'; }).join('') + '</div>' +
      '<p class="muted bs-msg" id="bs-msg"></p><div class="bs-grid" id="bs-grid" role="group" aria-label="Bits"></div><dl class="bs-info" id="bs-info"></dl></div>' +
      '<div class="card"><h2>Bitwise operations</h2><div class="bs-ab"><label class="bs-f"><span>A</span><input type="text" id="bw-a" value="0xF0" autocomplete="off" spellcheck="false"></label><label class="bs-f"><span>B</span><input type="text" id="bw-b" value="0x3C" autocomplete="off" spellcheck="false"></label></div>' +
      '<p class="muted">Type decimal, or use the prefixes 0x (hex), 0b (binary) and 0o (octal).</p>' +
      '<div class="bs-ops" role="group" aria-label="Operation">' + OPS.map(function (o) { return '<button type="button" class="chip' + (o[0] === op ? ' active' : '') + '" data-op="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div><div id="bw-out" class="bw-out" aria-live="polite"></div></div>' +
      '<div class="card"><h2>Any base to any base</h2><div class="bs-ab"><label class="bs-f"><span>Number</span><input type="text" id="ab-n" value="255" autocomplete="off" spellcheck="false"></label>' +
      '<label class="bs-f"><span>From base</span><input type="number" id="ab-f" value="10" min="2" max="36"></label><label class="bs-f"><span>To base</span><input type="number" id="ab-t" value="16" min="2" max="36"></label></div><div class="bw-out" id="ab-out" aria-live="polite"></div><p class="muted">Bases 2 to 36 (digits 0–9 then A–Z).</p></div></div>';
    var $ = function (id) { return el.querySelector('#' + id); };
    var mask = function () { return (1n << BigInt(W)) - 1n; };
    var toS = function (x) { return (x >> BigInt(W - 1)) ? x - (1n << BigInt(W)) : x; };
    var show = function (x) { return signed ? toS(x) : x; };

    function fill(skip) {
      var vals = { dec: show(u).toString(10), hex: toBase(u, 16), oct: toBase(u, 8), bin: group(padBin(u, W), 4) };
      ['dec', 'hex', 'oct', 'bin'].forEach(function (k) { if (k !== skip) $('bs-' + k).value = vals[k]; });
      var g = '';
      for (var i = W - 1; i >= 0; i--) {
        var on = (u >> BigInt(i)) & 1n;
        g += (i % 4 === 3 ? '<span class="bs-nib">' : '') + '<button type="button" class="bit' + (on ? ' on' : '') + '" data-bit="' + i + '" aria-pressed="' + (on === 1n) + '" aria-label="Bit ' + i + '"><b>' + on + '</b><i>' + i + '</i></button>' + (i % 4 === 0 ? '</span>' : '');
      }
      $('bs-grid').innerHTML = g;
      var pop = 0, t = u; while (t) { pop += Number(t & 1n); t >>= 1n; }
      var lz = W - (u === 0n ? 0 : u.toString(2).length), ch = u >= 32n && u <= 126n ? '"' + String.fromCharCode(Number(u)) + '"' : '—';
      $('bs-info').innerHTML = '<div><dt>1-bits</dt><dd>' + pop + '</dd></div><div><dt>Leading zeros</dt><dd>' + lz + '</dd></div><div><dt>Unsigned</dt><dd>' + u.toString() + '</dd></div><div><dt>Signed</dt><dd>' + toS(u).toString() + '</dd></div><div><dt>ASCII</dt><dd>' + esc(ch) + '</dd></div>';
    }
    function fromField(k) {
      var b = +$('bs-' + k).dataset.b, v = parseBig($('bs-' + k).value, b), msg = $('bs-msg');
      if (v == null) { msg.textContent = $('bs-' + k).value.trim() ? 'That is not a valid ' + ({ dec: 'decimal', hex: 'hexadecimal', oct: 'octal', bin: 'binary' })[k] + ' number.' : ''; return; }
      var u2 = v & mask(); msg.textContent = (v !== u2 && !(v < 0n && toS(u2) === v)) ? 'Too big for ' + W + ' bits, so it was cut down to fit.' : '';
      u = u2; fill(k);
    }
    ['dec', 'hex', 'oct', 'bin'].forEach(function (k) { $('bs-' + k).addEventListener('input', function () { fromField(k); runOp(); }); });
    $('bs-w').addEventListener('change', function (e) { W = +e.target.value; CLI.store.set('bsW', W); u &= mask(); $('bs-msg').textContent = ''; fill(); runOp(); });
    $('bs-s').addEventListener('change', function (e) { signed = e.target.checked; CLI.store.set('bsSigned', signed); fill(); runOp(); });
    $('bs-grid').addEventListener('click', function (e) { var b = e.target.closest('[data-bit]'); if (!b) return; u ^= (1n << BigInt(+b.dataset.bit)); $('bs-msg').textContent = ''; fill(); });

    function row(label, x) { return '<div class="bw-row"><span class="bw-l">' + label + '</span><code>' + group(padBin(x, W), 4) + '</code><span class="bw-v">' + toBase(x, 16) + 'h &nbsp; ' + show(x).toString() + '</span></div>'; }
    function runOp() {
      var A = parseBig($('bw-a').value, 10), B = parseBig($('bw-b').value, 10), o = $('bw-out');
      var needB = op !== 'not';
      if (A == null || (needB && B == null)) { o.innerHTML = '<p class="muted">Enter ' + (needB ? 'both numbers' : 'a number for A') + ' to see the result.</p>'; return; }
      var m = mask(), a = A & m, b = (B == null ? 0n : B) & m, r, w = BigInt(W), k = Number(b), kk = k % W;
      switch (op) {
        case 'and': r = a & b; break; case 'or': r = a | b; break; case 'xor': r = a ^ b; break;
        case 'nand': r = ~(a & b) & m; break; case 'nor': r = ~(a | b) & m; break; case 'xnor': r = ~(a ^ b) & m; break;
        case 'not': r = ~a & m; break;
        case 'shl': r = k >= W ? 0n : (a << BigInt(k)) & m; break;
        case 'shr': r = k >= W ? 0n : a >> BigInt(k); break;
        case 'sar': r = (toS(a) >> BigInt(Math.min(k, W))) & m; break;
        case 'rol': r = kk === 0 ? a : ((a << BigInt(kk)) | (a >> (w - BigInt(kk)))) & m; break;
        case 'ror': r = kk === 0 ? a : ((a >> BigInt(kk)) | (a << (w - BigInt(kk)))) & m; break;
      }
      var shift = ['shl', 'shr', 'sar', 'rol', 'ror'].indexOf(op) >= 0;
      o.innerHTML = row('A', a) + (needB ? row(shift ? 'B (count ' + k + ')' : 'B', b) : '') + '<div class="bw-row res"><span class="bw-l">Result</span><code>' + group(padBin(r, W), 4) + '</code><span class="bw-v">' + toBase(r, 16) + 'h &nbsp; ' + show(r).toString() + '</span></div>';
    }
    $('bw-a').addEventListener('input', runOp); $('bw-b').addEventListener('input', runOp);
    el.querySelector('.bs-ops').addEventListener('click', function (e) {
      var b = e.target.closest('[data-op]'); if (!b) return; op = b.dataset.op;
      el.querySelectorAll('.bs-ops .chip').forEach(function (c) { c.classList.toggle('active', c === b); }); runOp();
    });
    function anyBase() {
      var f = Math.round(+$('ab-f').value), t = Math.round(+$('ab-t').value), o = $('ab-out');
      if (!(f >= 2 && f <= 36 && t >= 2 && t <= 36)) { o.innerHTML = '<p class="muted">Bases must be from 2 to 36.</p>'; return; }
      var v = parseBig($('ab-n').value, f);
      o.innerHTML = v == null ? '<p class="muted">Enter a number made of valid base-' + f + ' digits.</p>' : '<div class="bw-row res"><span class="bw-l">Base ' + t + '</span><code>' + esc(toBase(v, t)) + '</code></div>';
    }
    ['ab-n', 'ab-f', 'ab-t'].forEach(function (id) { $(id).addEventListener('input', anyBase); });
    u = 202n & mask(); fill(); runOp(); anyBase();
  }
  CLI.alu.bases = { mount: bases, unmount: function () {} };
})();
