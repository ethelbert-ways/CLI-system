/* CLI tex: tiny LaTeX-subset -> HTML renderer (no external libraries).
   Supports: \frac{}{} \sqrt{} \sqrt[n]{} ^ _ \vec \hat \bar \overline \text \mathrm \mathbf \mathbb \ce{} \binom \left \right,
   Greek letters, common symbols, function names (\sin, \ln, \lim ...). */
(function (root) {
  'use strict';
  var CLI = root.CLI = root.CLI || {};

  var GREEK = {
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ', iota: 'ι',
    kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'φ', varphi: 'φ',
    chi: 'χ', psi: 'ψ', omega: 'ω', Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω'
  };
  var SYM = {
    cdot: '·', times: '×', div: '÷', pm: '±', mp: '∓', to: '→', rightarrow: '→', leftarrow: '←', leftrightarrow: '↔', uparrow: '↑', downarrow: '↓',
    Rightarrow: '⇒', Leftrightarrow: '⇔', rightleftharpoons: '⇌', approx: '≈', neq: '≠', ne: '≠', leq: '≤', le: '≤', geq: '≥', ge: '≥',
    infty: '∞', partial: '∂', nabla: '∇', hbar: 'ℏ', ell: 'ℓ', propto: '∝', sim: '∼', equiv: '≡', in: '∈', notin: '∉', subset: '⊂', subseteq: '⊆',
    cup: '∪', cap: '∩', forall: '∀', exists: '∃', degree: '°', circ: '°', ldots: '…', dots: '…', cdots: '⋯', angle: '∠', perp: '⊥', parallel: '∥',
    oplus: '⊕', otimes: '⊗', langle: '⟨', rangle: '⟩', prime: '′', dagger: '†', sum: '∑', prod: '∏', int: '∫', oint: '∮', iint: '∬',
    ll: '≪', gg: '≫', neg: '¬', land: '∧', lor: '∨', emptyset: '∅', star: '⋆', ast: '∗', mid: '∣', setminus: '∖', therefore: '∴', because: '∵',
    Re: 'ℜ', Im: 'ℑ', aleph: 'ℵ', wp: '℘', lceil: '⌈', rceil: '⌉', lfloor: '⌊', rfloor: '⌋', vert: '|', Vert: '‖'
  };
  var OPS = '=<>+-±∓→←↔⇒⇔⇌≈≠≤≥∝∼≡∈∉⊂⊆∪∩×÷·≪≫∧∨⊕⊗∖';
  var FUNCS = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'sinh', 'cosh', 'tanh', 'arcsin', 'arccos', 'arctan', 'log', 'ln', 'exp', 'lim', 'det', 'max', 'min', 'mod', 'deg', 'rad', 'Pr', 'gcd', 'dim', 'ker', 'tr', 'rank', 'sup', 'inf', 'arg', 'sgn'];
  var BB = { R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ', P: 'ℙ', E: '𝔼' };
  var CAL = { L: 'ℒ', F: 'ℱ', H: 'ℋ', B: 'ℬ', E: 'ℰ', M: 'ℳ', N: '𝒩', O: '𝒪', P: '𝒫', S: '𝒮', R: 'ℛ', I: 'ℐ' };
  var SPACE = { ',': 'thin', ';': 'med', ':': 'med', '!': 'neg', ' ': 'med', quad: 'quad', qquad: 'qquad' };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var RADICAL = '<svg class="rsg" viewBox="0 0 10 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0.5 12.5L2.6 10.8L5.2 18.6L9.6 0.8" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="miter"/></svg>';

  function render(src, opts) {
    opts = opts || {};
    var s = String(src), i = 0, strict = !!opts.strict;

    function fail(msg) { if (strict) throw new Error('tex: ' + msg + ' in "' + s + '"'); }

    function readGroup() { // after skipping spaces: {...} or single token
      while (s[i] === ' ') i++;
      if (i >= s.length) { fail('missing argument'); return ''; }
      if (s[i] === '{') {
        var depth = 0, start = i + 1;
        for (; i < s.length; i++) {
          if (s[i] === '\\') { i++; continue; }
          if (s[i] === '{') depth++;
          else if (s[i] === '}') { depth--; if (depth === 0) { var inner = s.slice(start, i); i++; return inner; } }
        }
        fail('unbalanced braces'); return s.slice(start);
      }
      if (s[i] === '\\') { var m = /^\\([A-Za-z]+|.)/.exec(s.slice(i)); i += m[0].length; return m[0]; }
      return s[i++];
    }
    function sub(str) { return render(str, opts); }

    function ce(str) {
      var out = '', k = 0, prevSub = false;
      while (k < str.length) {
        var ch = str[k];
        if (ch === '^') {
          k++; var g;
          if (str[k] === '{') { var e = str.indexOf('}', k); g = str.slice(k + 1, e); k = e + 1; } else { g = str[k]; k++; }
          out += '<sup>' + esc(g.replace(/-/g, '−')) + '</sup>'; prevSub = false; continue;
        }
        if (ch === '_') {
          k++; var g2;
          if (str[k] === '{') { var e2 = str.indexOf('}', k); g2 = str.slice(k + 1, e2); k = e2 + 1; } else { g2 = str[k]; k++; }
          out += '<sub>' + esc(g2) + '</sub>'; prevSub = true; continue;
        }
        if (str.substr(k, 3) === '<=>') { out += '<span class="op">⇌</span>'; k += 3; prevSub = false; continue; }
        if (str.substr(k, 2) === '->') { out += '<span class="op">→</span>'; k += 2; prevSub = false; continue; }
        if (/\d/.test(ch)) {
          var prev = k > 0 ? str[k - 1] : '';
          if (/[A-Za-z)\]]/.test(prev) || (prevSub && /\d/.test(prev))) { out += '<sub>' + ch + '</sub>'; prevSub = true; }
          else { out += ch; prevSub = false; }
          k++; continue;
        }
        prevSub = false;
        if (ch === '+') { out += '<span class="op">+</span>'; k++; continue; }
        out += esc(ch === '-' ? '−' : ch); k++;
      }
      return '<span class="rm">' + out + '</span>';
    }

    var out = '', prevOp = true; // prevOp: true at start / after an operator (unary context)
    function emitOp(ch) { out += (prevOp && (ch === '-' || ch === '+' || ch === '±' || ch === '∓')) ? '<span class="un">' + (ch === '-' ? '−' : ch) + '</span>' : '<span class="op">' + (ch === '-' ? '−' : ch) + '</span>'; prevOp = true; }
    function emit(h) { out += h; prevOp = false; }

    while (i < s.length) {
      var ch = s[i];
      if (ch === ' ' || ch === '\n') { i++; continue; }
      if (ch === '{') { var g = readGroup(); emit(sub(g)); continue; }
      if (ch === '}') { fail('stray }'); i++; continue; }
      if (ch === '^' || ch === '_') {
        i++; var arg = readGroup();
        var first = (ch === '^' ? '<sup>' : '<sub>') + sub(arg) + (ch === '^' ? '</sup>' : '</sub>');
        var j = i; while (s[j] === ' ') j++;
        var other = ch === '^' ? '_' : '^';
        if (s[j] === other) {
          i = j + 1; var arg2 = readGroup();
          var second = (other === '^' ? '<sup>' : '<sub>') + sub(arg2) + (other === '^' ? '</sup>' : '</sub>');
          out += '<span class="supsub">' + (ch === '^' ? first + second : second + first) + '</span>';
        } else out += first;
        continue;
      }
      if (ch === '~') { out += '<span class="sp med"></span>'; i++; continue; }
      if (ch === '\\') {
        var m = /^\\([A-Za-z]+|.)/.exec(s.slice(i));
        if (!m) { i++; continue; }
        var cmd = m[1]; i += m[0].length;
        if (cmd === 'frac' || cmd === 'dfrac' || cmd === 'tfrac') {
          var n = readGroup(), d = readGroup();
          emit('<span class="frac"><span class="num">' + sub(n) + '</span><span class="den">' + sub(d) + '</span></span>'); continue;
        }
        if (cmd === 'binom') {
          var bn = readGroup(), bk = readGroup();
          emit('<span class="par">(</span><span class="frac nobar"><span class="num">' + sub(bn) + '</span><span class="den">' + sub(bk) + '</span></span><span class="par">)</span>'); continue;
        }
        if (cmd === 'sqrt') {
          var idx = '';
          if (s[i] === '[') { var e = s.indexOf(']', i); idx = s.slice(i + 1, e); i = e + 1; }
          var rad = readGroup();
          emit('<span class="sqrt">' + (idx ? '<sup class="idx">' + sub(idx) + '</sup>' : '') + RADICAL + '<span class="rc">' + sub(rad) + '</span></span>'); continue;
        }
        if (cmd === 'vec' || cmd === 'hat' || cmd === 'bar' || cmd === 'dot' || cmd === 'ddot' || cmd === 'tilde') {
          emit('<span class="acc ' + cmd + '">' + sub(readGroup()) + '</span>'); continue;
        }
        if (cmd === 'overline') { emit('<span class="acc bar">' + sub(readGroup()) + '</span>'); continue; }
        if (cmd === 'underline') { emit('<span class="ul">' + sub(readGroup()) + '</span>'); continue; }
        if (cmd === 'text' || cmd === 'mathrm' || cmd === 'textrm' || cmd === 'operatorname') { emit('<span class="rm">' + esc(readGroup()).replace(/ /g, '&nbsp;') + '</span>'); continue; }
        if (cmd === 'mathbf' || cmd === 'boldsymbol' || cmd === 'bm') { emit('<b class="mb">' + sub(readGroup()) + '</b>'); continue; }
        if (cmd === 'mathbb') { var bb = readGroup(); emit(BB[bb] || esc(bb)); continue; }
        if (cmd === 'mathcal') { var cc = readGroup(); emit(CAL[cc] || '<i>' + esc(cc) + '</i>'); continue; }
        if (cmd === 'ce') { emit(ce(readGroup())); continue; }
        if (cmd === 'left' || cmd === 'right') {
          var dl = s[i] === '\\' ? (function () { var mm = /^\\([A-Za-z]+|.)/.exec(s.slice(i)); i += mm[0].length; return mm[1] === '{' ? '{' : mm[1] === '}' ? '}' : mm[1] === '|' ? '‖' : (SYM[mm[1]] || ''); })() : s[i++];
          if (dl && dl !== '.') emit('<span class="par">' + esc(dl) + '</span>');
          continue;
        }
        if (cmd === 'big' || cmd === 'Big' || cmd === 'bigg' || cmd === 'Bigg') { continue; }
        if (SPACE[cmd]) { out += '<span class="sp ' + SPACE[cmd] + '"></span>'; continue; }
        if (cmd === '{' || cmd === '}' || cmd === '%' || cmd === '$' || cmd === '&' || cmd === '_' || cmd === '#') { emit(esc(cmd)); continue; }
        if (cmd === '|') { emit('‖'); continue; }
        if (cmd === '\\') { out += '<br>'; prevOp = true; continue; }
        if (GREEK[cmd]) { emit(/^[A-Z]/.test(cmd) ? GREEK[cmd] : '<i>' + GREEK[cmd] + '</i>'); continue; }
        if (FUNCS.indexOf(cmd) >= 0) { emit('<span class="fn">' + cmd + '</span>'); continue; }
        if (SYM[cmd] !== undefined) {
          var sy = SYM[cmd];
          if (OPS.indexOf(sy) >= 0) emitOp(sy);
          else if (cmd === 'sum' || cmd === 'prod' || cmd === 'int' || cmd === 'oint' || cmd === 'iint') emit('<span class="big">' + sy + '</span>');
          else emit(sy);
          continue;
        }
        fail('unknown command \\' + cmd);
        emit(esc('\\' + cmd));
        continue;
      }
      if (/[A-Za-z]/.test(ch)) {
        var w = /^[A-Za-z]+/.exec(s.slice(i))[0], matched = false;
        if (w.length > 1) {
          for (var q = 0; q < FUNCS.length; q++) {
            if (w === FUNCS[q]) { emit('<span class="fn">' + w + '</span>'); i += w.length; matched = true; break; }
          }
        }
        if (matched) continue;
        emit('<i>' + ch + '</i>'); i++; continue;
      }
      if (/[0-9.]/.test(ch)) { var nm = /^[0-9.]+/.exec(s.slice(i))[0]; emit(nm); i += nm.length; continue; }
      if (ch === '-' || ch === '+' || ch === '=' || ch === '<' || ch === '>') { emitOp(ch); i++; continue; }
      if (OPS.indexOf(ch) >= 0) { emitOp(ch); i++; continue; }
      if (ch === '(' || ch === '[') { out += esc(ch); prevOp = true; i++; continue; }
      if (ch === ',' ) { out += ',<span class="sp thin"></span>'; prevOp = true; i++; continue; }
      if (ch === "'") { emit('′'); i++; continue; }
      emit(esc(ch)); i++;
    }
    return out;
  }

  CLI.tex = function (src, opts) { return '<span class="tex">' + render(src, opts) + '</span>'; };
  CLI.texCheck = function (src) { render(src, { strict: true }); return true; };
  if (typeof module !== 'undefined' && module.exports) module.exports = CLI.tex;
})(typeof window !== 'undefined' ? window : globalThis);
