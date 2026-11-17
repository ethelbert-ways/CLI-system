/* ALU: Solver — polynomial roots, linear systems, f(x)=g(x), and calculus helpers. */
(function () {
  'use strict';
  var CLI = window.CLI, M = CLI.math, esc = CLI.esc;
  CLI.alu = CLI.alu || {};
  var f = function (v) { return M.fmt(v).replace(/^-/, '−'); };
  function frac(v) { var q = M.toFraction(v, 1000, 1e-10); return q && q.d !== 1 && q.d <= 1000 ? ' ≈ ' + (q.n < 0 ? '−' : '') + Math.abs(q.n) + '/' + q.d : ''; }
  function cplx(r) {
    if (!r.im) return f(r.re);
    var re = r.re ? f(r.re) + ' ' : '', sign = r.im < 0 ? '− ' : (r.re ? '+ ' : '');
    var im = Math.abs(r.im), ims = im === 1 ? '' : M.fmt(im);
    return re + sign + ims + 'i';
  }

  /* ----- polynomial from expression (exact arithmetic on coefficient arrays, ascending powers) ----- */
  function padd(a, b, s) { var n = Math.max(a.length, b.length), r = [], i; for (i = 0; i < n; i++) r.push((a[i] || 0) + s * (b[i] || 0)); return r; }
  function pmul(a, b) { var r = new Array(a.length + b.length - 1).fill(0), i, j; for (i = 0; i < a.length; i++) for (j = 0; j < b.length; j++) r[i + j] += a[i] * b[j]; return r; }
  function polyOf(n) {
    var BAD = new Error('Use only numbers, x, + − × ÷ and ^ with whole-number powers.');
    switch (n.n) {
      case 'num': return [n.v];
      case 'id': if (n.name === 'x') return [0, 1]; if (Object.prototype.hasOwnProperty.call(M.CONSTS, n.name)) return [M.CONSTS[n.name]]; throw BAD;
      case 'neg': return polyOf(n.a).map(function (c) { return -c; });
      case 'post': if (n.op === '%') return polyOf(n.a).map(function (c) { return c / 100; }); throw BAD;
      case 'bin': {
        var a = polyOf(n.a), b = polyOf(n.b);
        if (n.op === '+') return padd(a, b, 1);
        if (n.op === '-') return padd(a, b, -1);
        if (n.op === '*') return pmul(a, b);
        if (n.op === '/') { if (b.length !== 1 || b[0] === 0) throw new Error('You can only divide by a number.'); return a.map(function (c) { return c / b[0]; }); }
        if (n.op === '^') {
          if (b.length !== 1 || !Number.isInteger(b[0]) || b[0] < 0 || b[0] > 12) throw new Error('Powers must be whole numbers from 0 to 12.');
          var r = [1], i; for (i = 0; i < b[0]; i++) r = pmul(r, a); return r;
        }
        throw BAD;
      }
    }
    throw BAD;
  }
  function parsePoly(src) {
    src = String(src).trim();
    if (!src) throw new Error('Enter a polynomial or its coefficients.');
    if (!/[xX^]/.test(src)) {
      var m = src.replace(/−/g, '-').match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
      if (!m) throw new Error('Could not read the coefficients.');
      return m.map(Number).reverse();
    }
    var ast = M.parse(src.replace(/X/g, 'x'), { names: ['x'] });
    return polyOf(ast);
  }
  function polyStr(c) {
    var s = '', i;
    for (i = c.length - 1; i >= 0; i--) {
      var v = c[i]; if (!v) continue;
      var a = Math.abs(v), t = (a === 1 && i > 0) ? '' : M.fmt(a);
      t += i === 0 ? '' : i === 1 ? 'x' : 'x^' + i;
      s += (s ? (v < 0 ? ' - ' : ' + ') : (v < 0 ? '-' : '')) + t;
    }
    return s || '0';
  }

  function card(title, body) { return '<section class="card"><h2>' + title + '</h2>' + body + '</section>'; }

  function solver(el) {
    var mode = CLI.store.get('svMode', 'rad');
    el.innerHTML = '<div class="sv-grid">' +
      '<div class="sv-top muted">Angle mode for trig functions in sections 3 and 4: <select id="sv-mode" aria-label="Angle mode"><option value="rad">Radians</option><option value="deg">Degrees</option><option value="grad">Gradians</option></select></div>' +

      card('1 · Polynomial roots', '<label class="sv-lab" for="pl-in">Polynomial (like x^3 - 6x^2 + 11x - 6) or coefficients from the highest power (like 1 -6 11 -6)</label>' +
        '<input id="pl-in" class="sv-in" type="text" autocomplete="off" spellcheck="false" value="x^3 - 6x^2 + 11x - 6"><div class="sv-btns"><button type="button" class="btn" id="pl-go">Find roots</button><button type="button" class="btn ghost" id="pl-gr">Graph it</button></div><div class="sv-out" id="pl-out" aria-live="polite"></div>') +

      card('2 · Simultaneous linear equations', '<div class="sv-row two"><label class="sv-lab">Number of unknowns <select id="ls-n"><option>2</option><option>3</option><option>4</option><option>5</option></select></label></div>' +
        '<div class="sv-scroll"><div class="sv-matrix" id="ls-m"></div></div><div class="sv-btns"><button type="button" class="btn" id="ls-go">Solve</button></div><div class="sv-out" id="ls-out" aria-live="polite"></div>') +

      card('3 · Solve f(x) = g(x)', '<label class="sv-lab" for="eq-in">Equation in x</label><input id="eq-in" class="sv-in" type="text" autocomplete="off" spellcheck="false" value="cos(x) = x">' +
        '<div class="sv-row two" style="margin-top:10px"><label class="sv-lab">Search from x = <input id="eq-a" class="sv-in" type="text" inputmode="decimal" value="-10"></label><label class="sv-lab">to x = <input id="eq-b" class="sv-in" type="text" inputmode="decimal" value="10"></label></div>' +
        '<div class="sv-btns"><button type="button" class="btn" id="eq-go">Solve</button><button type="button" class="btn ghost" id="eq-gr">Graph it</button></div><div class="sv-out" id="eq-out" aria-live="polite"></div>') +

      card('4 · Calculus helper', '<label class="sv-lab" for="ca-f">f(x)</label><input id="ca-f" class="sv-in" type="text" autocomplete="off" spellcheck="false" value="x^3 - 3x">' +
        '<div class="sv-row three" style="margin-top:10px"><label class="sv-lab">Slope at x = <input id="ca-x" class="sv-in" type="text" inputmode="decimal" value="2"></label><label class="sv-lab">Area from a = <input id="ca-a" class="sv-in" type="text" inputmode="decimal" value="0"></label><label class="sv-lab">to b = <input id="ca-b" class="sv-in" type="text" inputmode="decimal" value="3"></label></div>' +
        '<div class="sv-btns"><button type="button" class="btn" id="ca-go">Calculate</button><button type="button" class="btn ghost" id="ca-gr">Graph it</button></div><div class="sv-out" id="ca-out" aria-live="polite"></div>') +
      '</div>';
    var $ = function (id) { return el.querySelector('#' + id); };
    var num = function (id) { var v = M.evaluate($(id).value, {}, 'rad'); if (!isFinite(v)) throw new Error('Check the number in the box.'); return v; };
    var err = function (id, e) { $(id).innerHTML = '<p class="err">' + esc(e && e.message ? (e.name === 'MathErr' && e.kind === 'syntax' ? 'I could not read that. Check the brackets and symbols.' : e.message) : 'Something went wrong.') + '</p>'; };
    $('sv-mode').value = mode;
    $('sv-mode').addEventListener('change', function (e) { mode = e.target.value; CLI.store.set('svMode', mode); });

    /* ---- 1 polynomial ---- */
    function polyRun() {
      try {
        var c = parsePoly($('pl-in').value);
        while (c.length && Math.abs(c[c.length - 1]) < 1e-14) c.pop();
        if (c.length < 2) throw new Error(c.length ? 'That is just a number, so there is no x to solve for.' : 'That polynomial is zero everywhere.');
        if (c.length > 13) throw new Error('Degree 12 is the highest I can solve.');
        var deg = c.length - 1, desc = c.slice().reverse(), roots = M.num.polyRoots(desc), h = '';
        h += '<p><b>' + esc(polyStr(c)) + ' = 0</b> &nbsp;<span class="muted">degree ' + deg + '</span></p>';
        if (deg === 2) {
          var A = c[2], B = c[1], C = c[0], D = B * B - 4 * A * C;
          h += '<p class="steps">a = ' + f(A) + ', b = ' + f(B) + ', c = ' + f(C) + '<br>Discriminant Δ = b² − 4ac = ' + f(D) + (D > 0 ? ' → two different real roots' : D === 0 ? ' → one repeated real root' : ' → two complex roots') + '<br>x = (−b ± √Δ) ÷ 2a<br>Vertex at x = ' + f(-B / (2 * A)) + ', y = ' + f(C - B * B / (4 * A)) + '<br>Sum of roots = ' + f(-B / A) + ', product of roots = ' + f(C / A) + '</p>';
        }
        h += '<ul>' + roots.map(function (r, i) { return '<li>x<sub>' + (i + 1) + '</sub> = ' + esc(cplx(r)) + (r.im ? '<small>complex</small>' : '<small>' + frac(r.re).replace(' ≈ ', '≈ ') + '</small>') + '</li>'; }).join('') + '</ul>';
        $('pl-out').innerHTML = h;
        return c;
      } catch (e) { err('pl-out', e); return null; }
    }
    $('pl-go').addEventListener('click', polyRun);
    $('pl-in').addEventListener('keydown', function (e) { if (e.key === 'Enter') polyRun(); });
    $('pl-gr').addEventListener('click', function () { try { var c = parsePoly($('pl-in').value); CLI.go('graphics', { fn: polyStr(c).replace(/−/g, '-'), mode: 'rad' }); } catch (e) { err('pl-out', e); } });

    /* ---- 2 linear system ---- */
    function drawMatrix() {
      var n = +$('ls-n').value, h = '', i, j;
      $('ls-m').style.gridTemplateColumns = 'repeat(' + (n + 1) + ', minmax(64px, 84px))';
      for (j = 0; j < n; j++) h += '<span>x<sub>' + (j + 1) + '</sub></span>'; h += '<span>= c</span>';
      var def = [[2, 1, 5], [1, 3, 10]];
      for (i = 0; i < n; i++) for (j = 0; j <= n; j++) h += '<input type="text" inputmode="decimal" autocomplete="off" aria-label="Row ' + (i + 1) + ', ' + (j < n ? 'x' + (j + 1) : 'constant') + '" data-i="' + i + '" data-j="' + j + '" value="' + (n === 2 ? (j < 2 ? def[i][j] : def[i][2]) : (j === i ? 1 : j === n ? 0 : 0)) + '">';
      $('ls-m').innerHTML = h;
    }
    function linRun() {
      try {
        var n = +$('ls-n').value, A = [], b = [], i, j;
        for (i = 0; i < n; i++) { A.push([]); for (j = 0; j < n; j++) A[i].push(M.evaluate($('ls-m').querySelector('[data-i="' + i + '"][data-j="' + j + '"]').value, {}, 'rad')); b.push(M.evaluate($('ls-m').querySelector('[data-i="' + i + '"][data-j="' + n + '"]').value, {}, 'rad')); }
        if (A.concat([b]).some(function (r) { return r.some(function (v) { return !isFinite(v); }); })) throw new Error('Fill every box with a number.');
        var r = M.num.solveLinear(A, b), h;
        if (r.type === 'unique') h = '<ul>' + r.x.map(function (v, k) { return '<li>x<sub>' + (k + 1) + '</sub> = ' + f(Math.abs(v) < 1e-12 ? 0 : v) + '<small>' + frac(v).replace(' ≈ ', '≈ ') + '</small></li>'; }).join('') + '</ul>';
        else if (r.type === 'none') h = '<p class="err">No solution: the equations contradict each other.</p>';
        else h = '<p>Infinitely many solutions: only ' + r.rank + ' of the ' + n + ' equations are independent.</p>';
        $('ls-out').innerHTML = h;
      } catch (e) { err('ls-out', e); }
    }
    $('ls-n').addEventListener('change', function () { drawMatrix(); $('ls-out').innerHTML = ''; });
    $('ls-go').addEventListener('click', linRun);
    $('ls-m').addEventListener('keydown', function (e) { if (e.key === 'Enter') linRun(); });
    drawMatrix();

    /* ---- 3 f(x) = g(x) ---- */
    function split(s) {
      var k = s.indexOf('='); if (k < 0) return [s, '0'];
      if (s.indexOf('=', k + 1) >= 0) throw new Error('Use just one = sign.');
      return [s.slice(0, k), s.slice(k + 1)];
    }
    function eqFn() {
      var p = split($('eq-in').value);
      if (!p[0].trim() || !p[1].trim()) throw new Error('Write something on both sides of the = sign.');
      var l = M.parse(p[0], { names: ['x'] }), r = M.parse(p[1], { names: ['x'] });
      return { f: M.compile({ n: 'bin', op: '-', a: l, b: r }, { mode: mode, args: ['x'] }), l: p[0].trim(), r: p[1].trim() };
    }
    $('eq-go').addEventListener('click', eqRun);
    $('eq-in').addEventListener('keydown', function (e) { if (e.key === 'Enter') eqRun(); });
    function eqRun() {
      try {
        var q = eqFn(), a = num('eq-a'), b = num('eq-b');
        if (!(b > a)) throw new Error('The "to" value must be bigger than the "from" value.');
        var rs = M.num.roots(q.f, a, b);
        $('eq-out').innerHTML = rs.length ? '<p>' + rs.length + ' solution' + (rs.length > 1 ? 's' : '') + ' between ' + f(a) + ' and ' + f(b) + ':</p><ul>' + rs.map(function (x, i) { return '<li>x<sub>' + (i + 1) + '</sub> = ' + f(x) + '<small>check: left − right = ' + (Math.abs(q.f(x)) < 1e-9 ? '0' : M.fmt(q.f(x))) + '</small></li>'; }).join('') + '</ul>' : '<p>No solutions found between ' + f(a) + ' and ' + f(b) + '. Try a wider range, or graph it to see.</p>';
      } catch (e) { err('eq-out', e); }
    }
    $('eq-gr').addEventListener('click', function () { try { var q = eqFn(); CLI.go('graphics', { fn: q.r === '0' ? q.l : q.l + '\n' + q.r, mode: mode }); } catch (e) { err('eq-out', e); } });

    /* ---- 4 calculus ---- */
    function fx() { var s = $('ca-f').value; if (!s.trim()) throw new Error('Enter f(x).'); return M.compile(M.parse(s, { names: ['x'] }), { mode: mode, args: ['x'] }); }
    $('ca-go').addEventListener('click', caRun);
    $('ca-f').addEventListener('keydown', function (e) { if (e.key === 'Enter') caRun(); });
    function caRun() {
      try {
        var g = fx(), x0 = num('ca-x'), a = num('ca-a'), b = num('ca-b'), h = '<ul>';
        var y0 = g(x0), d = M.num.derivative(g, x0);
        h += '<li>f(' + f(x0) + ') = ' + (isFinite(y0) ? f(y0) : 'not defined') + '</li>';
        h += '<li>Slope f′(' + f(x0) + ') ≈ ' + (isFinite(d) ? f(Math.abs(d) < 1e-9 ? 0 : d) : 'not defined') + '</li>';
        if (a !== b) { var I = M.num.integrate(g, a, b); h += '<li>Area ∫ f dx from ' + f(a) + ' to ' + f(b) + ' ≈ ' + (isFinite(I) ? f(Math.abs(I) < 1e-9 ? 0 : I) : 'not defined') + '</li>'; }
        var lo = Math.min(a, b), hi = Math.max(a, b);
        if (hi > lo) {
          var ex = M.num.extrema(g, lo, hi);
          h += ex.length ? ex.map(function (e) { return '<li>Local ' + e.kind + 'imum at x = ' + f(e.x) + ', y = ' + f(e.y) + '</li>'; }).join('') : '<li>No turning points between ' + f(lo) + ' and ' + f(hi) + '</li>';
        }
        $('ca-out').innerHTML = h + '</ul><p class="muted">Numerical answers, accurate to many digits for smooth functions.</p>';
      } catch (e) { err('ca-out', e); }
    }
    $('ca-gr').addEventListener('click', function () { var s = $('ca-f').value.trim(); if (!s) { err('ca-out', new Error('Enter f(x).')); return; } CLI.go('graphics', { fn: s, mode: mode }); });

    polyRun(); eqRun(); caRun();
  }
  CLI.alu.solver = { mount: solver, unmount: function () {} };
})();
