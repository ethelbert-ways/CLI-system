/* CLI math engine: tokenizer, parser, compiler, formatting and numeric tools.
   Runs in the browser and in Node (for tests). No dependencies. */
(function (root) {
  'use strict';
  var CLI = root.CLI = root.CLI || {};
  var PI = Math.PI;

  function MathErr(msg, kind) { this.message = msg; this.kind = kind || 'math'; this.name = 'MathErr'; }
  MathErr.prototype = Object.create(Error.prototype);
  function synErr(m) { return new MathErr(m || 'Syntax Error', 'syntax'); }

  /* ---------- special functions ---------- */
  var LG = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function gamma(z) {
    if (z < 0.5) return PI / (Math.sin(PI * z) * gamma(1 - z));
    z -= 1;
    var x = LG[0];
    for (var i = 1; i < 9; i++) x += LG[i] / (z + i);
    var t = z + 7.5;
    return Math.sqrt(2 * PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
  function fact(n) {
    if (!isFinite(n)) return NaN;
    if (Number.isInteger(n)) {
      if (n < 0) return NaN;
      if (n > 170) return Infinity;
      var r = 1; for (var i = 2; i <= n; i++) r *= i; return r;
    }
    return gamma(n + 1);
  }
  function nCr(n, r) {
    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) return NaN;
    if (r > n) return 0;
    r = Math.min(r, n - r);
    var v = 1;
    for (var i = 1; i <= r; i++) v = v * (n - r + i) / i;
    return Math.round(v);
  }
  function nPr(n, r) {
    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) return NaN;
    if (r > n) return 0;
    var v = 1; for (var i = 0; i < r; i++) v *= (n - i); return v;
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function lcm(a, b) { return (a === 0 || b === 0) ? 0 : Math.abs(a / gcd(a, b) * b); }

  function toFraction(x, maxDen, tol) {
    maxDen = maxDen || 100000; tol = tol || 1e-11;
    if (!isFinite(x)) return null;
    if (Number.isInteger(x)) return { n: x, d: 1 };
    var sign = x < 0 ? -1 : 1, a = Math.abs(x);
    var h0 = 0, h1 = 1, k0 = 1, k1 = 0, b = a;
    for (var i = 0; i < 40; i++) {
      var ai = Math.floor(b);
      var h2 = ai * h1 + h0, k2 = ai * k1 + k0;
      if (k2 > maxDen) break;
      h0 = h1; h1 = h2; k0 = k1; k1 = k2;
      if (Math.abs(a - h1 / k1) < tol * Math.max(1, a)) return { n: sign * h1, d: k1 };
      var fr = b - ai;
      if (fr < 1e-15) break;
      b = 1 / fr;
    }
    return null;
  }

  function pw(a, b) {
    if (a < 0 && !Number.isInteger(b)) {
      var f = toFraction(b, 99, 1e-9);
      if (f && f.d % 2 === 1) { var r = Math.pow(-a, b); return (Math.abs(f.n) % 2 === 1) ? -r : r; }
      return NaN;
    }
    return Math.pow(a, b);
  }

  /* ---------- angle-aware function table ---------- */
  function makeFuncs(mode) {
    var toR = function (x) { return mode === 'deg' ? x * PI / 180 : mode === 'grad' ? x * PI / 200 : x; };
    var fromR = function (r) { return mode === 'deg' ? r * 180 / PI : mode === 'grad' ? r * 200 / PI : r; };
    var quarter = function (x) { return mode === 'deg' ? x / 90 : mode === 'grad' ? x / 100 : x / (PI / 2); };
    var snap = function (x) { var q = quarter(x), k = Math.round(q); return Math.abs(q - k) <= 1e-11 * Math.max(1, Math.abs(q)) ? k : null; };
    var m4 = function (k) { return ((k % 4) + 4) % 4; };
    var F = {};
    F.sin = function (x) { var k = snap(x); return k === null ? Math.sin(toR(x)) : [0, 1, 0, -1][m4(k)]; };
    F.cos = function (x) { var k = snap(x); return k === null ? Math.cos(toR(x)) : [1, 0, -1, 0][m4(k)]; };
    F.tan = function (x) { var k = snap(x); if (k === null) return Math.tan(toR(x)); return m4(k) % 2 === 0 ? 0 : NaN; };
    F.sec = function (x) { return 1 / F.cos(x); };
    F.csc = function (x) { return 1 / F.sin(x); };
    F.cot = function (x) { var k = snap(x); if (k === null) return 1 / Math.tan(toR(x)); return m4(k) % 2 === 0 ? NaN : 0; };
    F.asin = function (x) { return fromR(Math.asin(x)); };
    F.acos = function (x) { return fromR(Math.acos(x)); };
    F.atan = function (x) { return fromR(Math.atan(x)); };
    F.atan2 = function (y, x) { return fromR(Math.atan2(y, x)); };
    F.sinh = Math.sinh; F.cosh = Math.cosh; F.tanh = Math.tanh;
    F.asinh = Math.asinh; F.acosh = Math.acosh; F.atanh = Math.atanh;
    F.sech = function (x) { return 1 / Math.cosh(x); };
    F.csch = function (x) { return 1 / Math.sinh(x); };
    F.coth = function (x) { return 1 / Math.tanh(x); };
    F.ln = Math.log;
    F.log = function (x, b) { return b === undefined ? Math.log10(x) : Math.log(x) / Math.log(b); };
    F.log2 = Math.log2;
    F.exp = Math.exp;
    F.sqrt = Math.sqrt;
    F.cbrt = Math.cbrt;
    F.root = function (x, n) { if (x < 0 && Number.isInteger(n) && n % 2 !== 0) return -Math.pow(-x, 1 / n); return pw(x, 1 / n); };
    F.abs = Math.abs;
    F.sign = Math.sign;
    F.floor = Math.floor; F.ceil = Math.ceil; F.trunc = Math.trunc;
    F.round = function (x, d) { d = d || 0; var m = Math.pow(10, d); return Math.round(x * m) / m; };
    F.frac = function (x) { return x - Math.trunc(x); };
    F.fact = fact; F.gamma = gamma;
    F.nPr = nPr; F.nCr = nCr;
    F.min = Math.min; F.max = Math.max;
    F.gcd = gcd; F.lcm = lcm;
    F.hypot = Math.hypot;
    F.mod = function (a, b) { return b === 0 ? NaN : a - b * Math.floor(a / b); };
    F.deg = function (x) { return x * 180 / PI; };
    F.rad = function (x) { return x * PI / 180; };
    F.rand = function () { return Math.random(); };
    F.randint = function (a, b) { a = Math.ceil(a); b = Math.floor(b); return a + Math.floor(Math.random() * (b - a + 1)); };
    return F;
  }
  // name -> [minArgs, maxArgs]
  var ARITY = {
    sin: [1, 1], cos: [1, 1], tan: [1, 1], sec: [1, 1], csc: [1, 1], cot: [1, 1],
    asin: [1, 1], acos: [1, 1], atan: [1, 1], atan2: [2, 2],
    sinh: [1, 1], cosh: [1, 1], tanh: [1, 1], asinh: [1, 1], acosh: [1, 1], atanh: [1, 1], sech: [1, 1], csch: [1, 1], coth: [1, 1],
    ln: [1, 1], log: [1, 2], log2: [1, 1], exp: [1, 1], sqrt: [1, 1], cbrt: [1, 1], root: [2, 2], abs: [1, 1], sign: [1, 1],
    floor: [1, 1], ceil: [1, 1], trunc: [1, 1], round: [1, 2], frac: [1, 1], fact: [1, 1], gamma: [1, 1],
    nPr: [2, 2], nCr: [2, 2], min: [1, 99], max: [1, 99], gcd: [2, 2], lcm: [2, 2], hypot: [1, 99],
    mod: [2, 2], deg: [1, 1], rad: [1, 1], rand: [0, 0], randint: [2, 2]
  };
  var CONSTS = { pi: PI, e: Math.E, tau: 2 * PI };
  var ALIAS = { arcsin: 'asin', arccos: 'acos', arctan: 'atan', arsinh: 'asinh', arcosh: 'acosh', artanh: 'atanh', lg: 'log', ncr: 'nCr', npr: 'nPr', 'sgn': 'sign', ceiling: 'ceil', 'int': 'floor' };
  var WORDVARS = ['theta', 'ans', 'Ans', 'mod'];

  /* ---------- tokenizer ---------- */
  var GREEK = { 'π': 'pi', 'τ': 'tau', 'θ': 'theta', 'φ': 'phi', 'ω': 'omega', 'λ': 'lambda', 'μ': 'mu', 'α': 'alpha', 'β': 'beta', 'γ': 'gamma_', 'δ': 'delta', 'ρ': 'rho', 'σ': 'sigma' };
  function tokenize(src, extra) {
    var names = Object.keys(ARITY).concat(Object.keys(ALIAS), Object.keys(CONSTS), WORDVARS, extra || []);
    names = names.filter(function (n) { return n.length > 1; }).sort(function (a, b) { return b.length - a.length; });
    var toks = [], i = 0, s = String(src);
    while (i < s.length) {
      var ch = s[i];
      if (/\s/.test(ch)) { i++; continue; }
      var m = /^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/.exec(s.slice(i));
      if (m) { toks.push({ t: 'num', v: parseFloat(m[0]) }); i += m[0].length; continue; }
      if (ch === '×' || ch === '·' || ch === '⋅' || ch === '∗' || ch === '*') { toks.push({ t: 'op', v: '*' }); i++; continue; }
      if (ch === '÷' || ch === '∕' || ch === '⁄' || ch === '/') { toks.push({ t: 'op', v: '/' }); i++; continue; }
      if (ch === '−' || ch === '–' || ch === '-') { toks.push({ t: 'op', v: '-' }); i++; continue; }
      if (ch === '+' || ch === '^' || ch === '!' || ch === '%' || ch === ',') { toks.push({ t: 'op', v: ch }); i++; continue; }
      if (ch === '°') { toks.push({ t: 'op', v: '°' }); i++; continue; }
      if (ch === '(' || ch === '[' || ch === '{') { toks.push({ t: 'op', v: '(' }); i++; continue; }
      if (ch === ')' || ch === ']' || ch === '}') { toks.push({ t: 'op', v: ')' }); i++; continue; }
      if (ch === '²' || ch === '³') { toks.push({ t: 'op', v: '^' }, { t: 'num', v: ch === '²' ? 2 : 3 }); i++; continue; }
      if (ch === '√') { toks.push({ t: 'id', v: 'sqrt' }); i++; continue; }
      if (ch === '∛') { toks.push({ t: 'id', v: 'cbrt' }); i++; continue; }
      if (GREEK[ch]) { toks.push({ t: 'id', v: GREEK[ch] }); i++; continue; }
      if (/[A-Za-z_]/.test(ch)) {
        var j = i; while (j < s.length && /[A-Za-z_]/.test(s[j])) j++;
        var run = s.slice(i, j), k = 0;
        while (k < run.length) {
          var hit = null;
          for (var q = 0; q < names.length; q++) { if (run.substr(k, names[q].length) === names[q]) { hit = names[q]; break; } }
          if (hit) { k += hit.length; } else { hit = run[k]; k++; }
          if (hit === 'mod') toks.push({ t: 'op', v: 'mod' });
          else { hit = ALIAS[hit] || hit; if (hit === 'Ans') hit = 'ans'; toks.push({ t: 'id', v: hit }); }
        }
        i = j; continue;
      }
      throw synErr('Syntax Error');
    }
    return toks;
  }

  /* ---------- parser ---------- */
  function parse(src, opts) {
    var toks = tokenize(src, opts && opts.names), p = 0;
    if (!toks.length) throw synErr('Empty expression');
    function peek() { return toks[p]; }
    function isOp(v) { var t = toks[p]; return t && t.t === 'op' && t.v === v; }
    function startsPrimary(t) { return t && (t.t === 'num' || t.t === 'id' || (t.t === 'op' && t.v === '(')); }
    function expr() {
      var a = term();
      while (isOp('+') || isOp('-')) { var op = toks[p++].v; a = { n: 'bin', op: op, a: a, b: term() }; }
      return a;
    }
    function term() {
      var a = implicit();
      while (isOp('*') || isOp('/') || isOp('mod')) { var op = toks[p++].v; a = { n: 'bin', op: op, a: a, b: implicit() }; }
      return a;
    }
    function implicit() {
      var a = unary();
      while (startsPrimary(peek())) {
        if (a.n === 'num' && peek().t === 'num') throw synErr();
        a = { n: 'bin', op: '*', a: a, b: power() };
      }
      return a;
    }
    function unary() {
      if (isOp('-')) { p++; return { n: 'neg', a: unary() }; }
      if (isOp('+')) { p++; return unary(); }
      return power();
    }
    function power() {
      var base = postfix();
      if (isOp('^')) { p++; return { n: 'bin', op: '^', a: base, b: unary() }; }
      return base;
    }
    function postfix() {
      var a = primary();
      while (isOp('!') || isOp('%') || isOp('°')) a = { n: 'post', op: toks[p++].v, a: a };
      return a;
    }
    function primary() {
      var t = toks[p++];
      if (!t) throw synErr();
      if (t.t === 'num') return { n: 'num', v: t.v };
      if (t.t === 'op' && t.v === '(') {
        var e = expr();
        if (isOp(')')) p++; else if (p < toks.length) throw synErr();
        return e;
      }
      if (t.t === 'id') {
        var ar = ARITY[t.v];
        if (ar) {
          var args = [];
          if (isOp('(')) {
            p++;
            if (!isOp(')')) { args.push(expr()); while (isOp(',')) { p++; args.push(expr()); } }
            if (isOp(')')) p++; else if (p < toks.length) throw synErr();
          } else if (ar[0] > 0) {
            args.push(unary());
          }
          if (args.length < ar[0] || args.length > ar[1]) throw synErr('Wrong number of arguments for ' + t.v);
          return { n: 'call', name: t.v, args: args };
        }
        return { n: 'id', name: t.v };
      }
      throw synErr();
    }
    var ast = expr();
    if (p < toks.length) throw synErr();
    return ast;
  }

  /* ---------- compiler ---------- */
  function compile(ast, opts) {
    opts = opts || {};
    var mode = opts.mode || 'rad', args = opts.args || [], scope = opts.scope || {};
    var F = makeFuncs(mode);
    var K = mode === 'deg' ? 1 : mode === 'grad' ? 200 / 180 : PI / 180;
    var has = Object.prototype.hasOwnProperty;
    function g(n) {
      switch (n.n) {
        case 'num': return '(' + n.v + ')';
        case 'id':
          if (args.indexOf(n.name) >= 0) return '$' + n.name;
          if (has.call(scope, n.name)) return 'S[' + JSON.stringify(n.name) + ']';
          if (has.call(CONSTS, n.name)) return '(' + CONSTS[n.name] + ')';
          throw new MathErr('Undefined variable ' + n.name, 'var');
        case 'neg': return '(-' + g(n.a) + ')';
        case 'bin':
          var a = g(n.a), b = g(n.b);
          if (n.op === '^') return 'P(' + a + ',' + b + ')';
          if (n.op === 'mod') return 'F.mod(' + a + ',' + b + ')';
          return '(' + a + n.op + b + ')';
        case 'post':
          if (n.op === '!') return 'F.fact(' + g(n.a) + ')';
          if (n.op === '%') return '(' + g(n.a) + '/100)';
          return '(' + g(n.a) + '*' + K + ')';
        case 'call': return 'F.' + n.name + '(' + n.args.map(g).join(',') + ')';
      }
      throw synErr();
    }
    var body = g(ast);
    var params = args.map(function (a) { return '$' + a; }).join(',');
    /* generated only from validated AST nodes above (numbers, whitelisted functions, scope lookups) */
    return new Function('F', 'S', 'P', 'return function(' + params + '){return ' + body + ';}')(F, scope, pw);
  }

  function freeVars(ast, out) {
    out = out || {};
    (function walk(n) {
      if (!n) return;
      if (n.n === 'id') { if (!Object.prototype.hasOwnProperty.call(CONSTS, n.name)) out[n.name] = true; }
      else if (n.n === 'call') n.args.forEach(walk);
      else { walk(n.a); walk(n.b); }
    })(ast);
    return out;
  }

  function evaluate(src, scope, mode) {
    scope = scope || {};
    var ast = parse(src, { names: Object.keys(scope) });
    return compile(ast, { mode: mode || 'rad', scope: scope })();
  }

  /* ---------- formatting ---------- */
  function stripZeros(s) { return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s; }
  function sci(x, d) {
    var s = d == null ? stripZeros(x.toExponential(9).replace(/e.*/, '')) + x.toExponential(9).replace(/^[^e]*/, '') : x.toExponential(d);
    var parts = s.split('e');
    return parts[0] + 'E' + parseInt(parts[1], 10);
  }
  function fmt(x, o) {
    o = o || {};
    if (typeof x !== 'number' || !isFinite(x)) return 'Math Error';
    if (x === 0) return '0';
    var mode = o.mode || 'norm', a = Math.abs(x);
    if (mode === 'sci') return sci(x, o.digits == null ? 4 : o.digits);
    if (mode === 'fix') {
      if (a >= 1e21) return sci(x);
      var s = x.toFixed(o.digits == null ? 2 : o.digits);
      return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s;
    }
    var sig = o.sig || 10;
    if (a >= Math.pow(10, sig) || a < 1e-9) return sci(x, null);
    var rounded = Number(x.toPrecision(sig));
    var e = Math.floor(Math.log10(Math.abs(rounded)));
    var dec = Math.max(0, Math.min(100, sig - 1 - e));
    return stripZeros(rounded.toFixed(dec));
  }

  /* ---------- numeric tools ---------- */
  var num = {};
  num.derivative = function (f, x) {
    var h = 1e-4 * Math.max(1, Math.abs(x));
    return (8 * (f(x + h) - f(x - h)) - (f(x + 2 * h) - f(x - 2 * h))) / (12 * h);
  };
  num.integrate = function (f, a, b) {
    if (a === b) return 0;
    var sign = 1; if (a > b) { var t = a; a = b; b = t; sign = -1; }
    function simpson(fa, fm, fb, h) { return h / 6 * (fa + 4 * fm + fb); }
    function rec(a, b, fa, fm, fb, whole, tol, depth) {
      var m = (a + b) / 2, lm = (a + m) / 2, rm = (m + b) / 2;
      var flm = f(lm), frm = f(rm);
      var left = simpson(fa, flm, fm, m - a), right = simpson(fm, frm, fb, b - m);
      if (depth <= 0 || Math.abs(left + right - whole) <= 15 * tol) return left + right + (left + right - whole) / 15;
      return rec(a, m, fa, flm, fm, left, tol / 2, depth - 1) + rec(m, b, fm, frm, fb, right, tol / 2, depth - 1);
    }
    var fa = f(a), fb = f(b), fm = f((a + b) / 2);
    var r = rec(a, b, fa, fm, fb, simpson(fa, fm, fb, b - a), 1e-10, 22);
    return sign * r;
  };
  function bisect(f, a, b, fa, fb) {
    for (var i = 0; i < 80; i++) {
      var m = (a + b) / 2, fm = f(m);
      if (fm === 0) return m;
      if ((fa < 0) === (fm < 0)) { a = m; fa = fm; } else { b = m; fb = fm; }
    }
    return (a + b) / 2;
  }
  function dedupe(arr, tol) {
    arr.sort(function (p, q) { return p - q; });
    var out = [];
    arr.forEach(function (v) { if (!out.length || Math.abs(v - out[out.length - 1]) > tol) out.push(v); });
    return out;
  }
  num.extrema = function (f, a, b, n) {
    n = n || 1500;
    var d = function (x) { return num.derivative(f, x); };
    var out = [], step = (b - a) / n, px = a, pd = d(a);
    for (var i = 1; i <= n; i++) {
      var x = a + i * step, dx = d(x);
      if (isFinite(pd) && isFinite(dx) && pd !== 0 && ((pd < 0) !== (dx < 0))) {
        var r = bisect(d, px, x, pd, dx), y = f(r);
        if (isFinite(y) && Math.abs(y) < 1e12) out.push({ x: r, y: y, kind: pd > 0 ? 'max' : 'min' });
      }
      px = x; pd = dx;
    }
    return out;
  };
  num.roots = function (f, a, b, n) {
    n = n || 2000;
    var out = [], step = (b - a) / n, px = a, pv = f(a);
    var scale = 0;
    for (var i = 0; i <= n; i++) { var v = f(a + i * step); if (isFinite(v)) scale = Math.max(scale, Math.abs(v)); }
    scale = scale || 1;
    if (pv === 0) out.push(a);
    for (i = 1; i <= n; i++) {
      var x = a + i * step, v2 = f(x);
      if (v2 === 0) out.push(x);
      else if (isFinite(pv) && isFinite(v2) && pv !== 0 && ((pv < 0) !== (v2 < 0))) {
        var r = bisect(f, px, x, pv, v2), fr = f(r);
        if (Math.abs(fr) < 1e-6 * scale + 1e-9 || Math.abs(fr) < 1e-4) out.push(r);
      }
      px = x; pv = v2;
    }
    num.extrema(f, a, b, n).forEach(function (e) { if (Math.abs(e.y) < 1e-9 * scale + 1e-12) out.push(e.x); });
    return dedupe(out, 1e-7 * Math.max(1, Math.abs(b - a)));
  };

  /* ---------- polynomial roots (Durand-Kerner) ---------- */
  function cmul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
  function csub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function cdiv(a, b) { var d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; }
  num.polyRoots = function (coef) {
    coef = coef.slice(); while (coef.length && coef[0] === 0) coef.shift();
    var n = coef.length - 1;
    if (n < 1) return [];
    var lead = coef[0], c = coef.map(function (v) { return v / lead; });
    var radius = 1 + Math.max.apply(null, c.slice(1).map(Math.abs));
    var z = []; for (var i = 0; i < n; i++) { var ang = 2 * PI * i / n + 0.4; z.push([radius * 0.6 * Math.cos(ang), radius * 0.6 * Math.sin(ang)]); }
    function ev(x) { var r = [c[0], 0]; for (var k = 1; k <= n; k++) { r = cmul(r, x); r[0] += c[k]; } return r; }
    for (var it = 0; it < 800; it++) {
      var delta = 0;
      for (i = 0; i < n; i++) {
        var den = [1, 0];
        for (var j = 0; j < n; j++) if (j !== i) den = cmul(den, csub(z[i], z[j]));
        var step = cdiv(ev(z[i]), den);
        z[i] = csub(z[i], step);
        delta = Math.max(delta, Math.abs(step[0]) + Math.abs(step[1]));
      }
      if (delta < 1e-15) break;
    }
    return z.map(function (r) {
      var re = r[0], im = r[1];
      if (Math.abs(im) < 1e-9 * (1 + Math.abs(re))) im = 0;
      if (Math.abs(re) < 1e-12) re = 0;
      return { re: re, im: im };
    }).sort(function (p, q) { return p.re - q.re || p.im - q.im; });
  };

  /* ---------- linear systems (Gaussian elimination) ---------- */
  num.solveLinear = function (A, b) {
    var n = A.length, M = A.map(function (row, i) { return row.slice().concat([b[i]]); });
    var rank = 0, piv = [];
    for (var col = 0; col < n && rank < n; col++) {
      var best = rank;
      for (var r = rank + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[best][col])) best = r;
      if (Math.abs(M[best][col]) < 1e-12) continue;
      var tmp = M[rank]; M[rank] = M[best]; M[best] = tmp;
      for (r = 0; r < n; r++) {
        if (r === rank) continue;
        var f = M[r][col] / M[rank][col];
        for (var c = col; c <= n; c++) M[r][c] -= f * M[rank][c];
      }
      piv.push(col); rank++;
    }
    for (var i = rank; i < n; i++) if (Math.abs(M[i][n]) > 1e-9) return { type: 'none' };
    if (rank < n) return { type: 'infinite', rank: rank };
    var x = new Array(n);
    for (i = 0; i < n; i++) x[piv[i]] = M[i][n] / M[i][piv[i]];
    return { type: 'unique', x: x };
  };

  CLI.math = {
    MathErr: MathErr, parse: parse, compile: compile, evaluate: evaluate, freeVars: freeVars,
    fmt: fmt, toFraction: toFraction, num: num, makeFuncs: makeFuncs, CONSTS: CONSTS, ARITY: ARITY,
    gamma: gamma, fact: fact, nCr: nCr, nPr: nPr, gcd: gcd, lcm: lcm, pow: pw
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = CLI.math;
})(typeof window !== 'undefined' ? window : globalThis);
