#!/usr/bin/env node
/* Validate CLI content data files.
   Usage: node tools/validate.js js/data/topics-physics.js [more files...]
   Exit code 1 if there are errors. Warnings are advisory. */
const path = require('path');
const root = path.resolve(__dirname, '..');
require(path.join(root, 'js/registry.js'));
const M = require(path.join(root, 'js/math.js'));
require(path.join(root, 'js/tex.js'));
const diagram = require(path.join(root, 'js/diagrams.js'));

const files = process.argv.slice(2);
if (!files.length) { console.log('usage: node tools/validate.js <data files...>'); process.exit(2); }
files.forEach(f => require(path.resolve(f)));

const errs = [], warns = [];
const E = (m) => errs.push(m), Wn = (m) => warns.push(m);
const SUBJ = CLI.SUBJECTS.map(s => s.id), LEV = CLI.LEVELS.map(l => l.id);
const isStr = v => typeof v === 'string' && v.trim().length > 0;

function checkText(where, s) {
  if (!isStr(s)) return E(where + ': empty text');
  if (/[\f\b\v\r\t]/.test(s)) E(where + ': contains a control character - a single backslash in a JS string (e.g. \\frac written as \frac). Use double backslashes.');
  (s.match(/\$[^$]+\$/g) || []).forEach(m => { try { CLI.texCheck(m.slice(1, -1)); } catch (e) { E(where + ': ' + e.message); } });
  if ((s.match(/\*\*/g) || []).length % 2) E(where + ': unbalanced **bold**');
  if ((s.match(/\$/g) || []).length % 2) E(where + ': unbalanced $');
}
function checkTex(where, t) {
  if (/[\f\b\v\r\t\n]/.test(t)) return E(where + ': tex contains a control character - write \\\\frac with DOUBLE backslashes in JS strings');
  try { CLI.texCheck(t); } catch (e) { E(where + ': ' + e.message); }
}
function checkDiagram(where, d) {
  if (!d || typeof d !== 'object') return E(where + ': diagram must be an object');
  try {
    const html = diagram(d);
    if (/NaN|undefined|Infinity/.test(html.replace(/aria-label="[^"]*"/, ''))) E(where + ': diagram output contains NaN/undefined/Infinity');
    if (html.length < 400) Wn(where + ': diagram looks nearly empty');
  } catch (e) { E(where + ': diagram error: ' + e.message); }
}

/* ---- topics ---- */
const seen = new Set();
CLI.topics.forEach((t, i) => {
  const w = 'topic[' + (t.id || i) + ']';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.id || '')) E(w + ': bad id');
  if (seen.has(t.id)) E(w + ': duplicate id'); seen.add(t.id);
  if (!SUBJ.includes(t.subject)) E(w + ': bad subject ' + t.subject);
  if (!LEV.includes(t.level)) E(w + ': bad level ' + t.level);
  ['title', 'tagline', 'simple'].forEach(k => checkText(w + '.' + k, t[k]));
  if (t.tagline && t.tagline.length > 100) Wn(w + ': tagline long');
  if (t.analogy) checkText(w + '.analogy', t.analogy);
  if (!Array.isArray(t.sections) || t.sections.length < 4) E(w + ': needs >= 4 sections');
  let words = (t.simple || '').split(/\s+/).length;
  (t.sections || []).forEach((s, j) => {
    const sw = w + '.sections[' + j + ']';
    checkText(sw + '.h', s.h);
    if (!s.p && !s.list && !s.steps) E(sw + ': needs p, list or steps');
    [].concat(s.p || []).forEach((p, k) => { checkText(sw + '.p[' + k + ']', p); words += p.split(/\s+/).length; });
    [].concat(s.list || [], s.steps || []).forEach((p, k) => { checkText(sw + '.item[' + k + ']', p); words += p.split(/\s+/).length; });
    if (s.diagram) checkDiagram(sw + '.diagram', s.diagram);
  });
  if (words < 300) Wn(w + ': only ' + words + ' words (aim 450-800)');
  const hero = t.diagram || (t.diagrams && t.diagrams[0]);
  if (!hero) E(w + ': missing hero diagram'); else checkDiagram(w + '.diagram', hero);
  (t.diagrams || []).forEach((d, j) => checkDiagram(w + '.diagrams[' + j + ']', d));
  if (!Array.isArray(t.keywords) || t.keywords.length < 4) E(w + ': needs >= 4 keywords');
  (t.keywords || []).forEach((k, j) => { if (!isStr(k.w) || !isStr(k.d)) E(w + '.keywords[' + j + ']: needs w and d'); else checkText(w + '.keywords[' + j + '].d', k.d); });
  if (!Array.isArray(t.key) || t.key.length < 3) E(w + ': needs >= 3 key points');
  (t.key || []).forEach((k, j) => checkText(w + '.key[' + j + ']', k));
  if (!Array.isArray(t.check) || t.check.length < 3) E(w + ': needs >= 3 check questions');
  (t.check || []).forEach((c, j) => { checkText(w + '.check[' + j + '].q', c.q); checkText(w + '.check[' + j + '].a', c.a); });
  (t.formulas || []).forEach((f, j) => { if (!isStr(f.name) || !isStr(f.tex)) E(w + '.formulas[' + j + ']: needs name and tex'); else checkTex(w + '.formulas[' + j + '].tex', f.tex); });
});

/* ---- vocab ---- */
const vseen = new Set();
CLI.vocab.forEach((v, i) => {
  const w = 'vocab[' + (v.w || i) + ']';
  if (!isStr(v.w)) return E(w + ': missing w');
  const key = v.w.toLowerCase();
  if (vseen.has(key)) E(w + ': duplicate word'); vseen.add(key);
  if (!SUBJ.includes(v.subj)) E(w + ': bad subj ' + v.subj);
  ['def', 'simple', 'ex'].forEach(k => checkText(w + '.' + k, v[k]));
  if (!isStr(v.pos)) Wn(w + ': missing pos');
  if (!isStr(v.pron)) Wn(w + ': missing pron');
  if (v.def && v.def.length > 420) Wn(w + ': def long');
});

/* ---- formulas ---- */
const fseen = new Set();
CLI.formulas.forEach((f, i) => {
  const w = 'formula[' + (f.id || i) + ']';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.id || '')) E(w + ': bad id');
  if (fseen.has(f.id)) E(w + ': duplicate id'); fseen.add(f.id);
  if (!SUBJ.includes(f.subject)) E(w + ': bad subject');
  if (!LEV.includes(f.level)) E(w + ': bad level');
  if (!isStr(f.topic)) E(w + ': missing topic group');
  if (!isStr(f.name)) E(w + ': missing name');
  if (!isStr(f.tex)) E(w + ': missing tex'); else checkTex(w + '.tex', f.tex);
  if (!f.vars || !Object.keys(f.vars).length) E(w + ': missing vars');
  checkText(w + '.about', f.about);
  if (f.solve) {
    const names = Object.keys(f.vars || {});
    Object.keys(f.solve).forEach(target => {
      if (!names.includes(target)) E(w + '.solve.' + target + ': target not in vars');
      const scope = {}; names.forEach(n => { if (n !== target) scope[n] = 1.7; });
      try {
        const ast = M.parse(f.solve[target], { names: names });
        const fn = M.compile(ast, { mode: 'rad', scope });
        const v = fn();
        if (typeof v !== 'number' || Number.isNaN(v)) Wn(w + '.solve.' + target + ': NaN for sample inputs (ok only if domain-limited)');
      } catch (e) { E(w + '.solve.' + target + ': ' + e.message + ' [' + f.solve[target] + ']'); }
    });
    if (Object.keys(f.solve).length < 1) E(w + ': empty solve');
  }
  Object.keys(f.vars || {}).forEach(k => { if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(k)) E(w + '.vars.' + k + ': variable keys must be plain identifiers (letters/digits/_)'); });
});

/* ---- constants ---- */
CLI.constants.forEach((c, i) => {
  const w = 'constant[' + (c.name || i) + ']';
  if (!isStr(c.name)) E(w + ': name'); if (!isStr(c.tex)) E(w + ': tex'); else checkTex(w + '.tex', c.tex);
  if (typeof c.val !== 'number' || !isFinite(c.val)) E(w + ': val must be a finite number');
  if (typeof c.unit !== 'string') E(w + ': unit must be a string (use "" if dimensionless)');
  if (!SUBJ.includes(c.subj)) E(w + ': bad subj');
});

/* ---- elements: { z, sym, name, mass, cat, group, period, config, state, en } ---- */
if (CLI.elements.length) {
  const CATS = ['alkali', 'alkaline', 'transition', 'post-transition', 'metalloid', 'nonmetal', 'halogen', 'noble', 'lanthanide', 'actinide', 'unknown'];
  const pos = new Set(), zs = new Set();
  if (CLI.elements.length !== 118) E('elements: expected 118, got ' + CLI.elements.length);
  CLI.elements.forEach(e => {
    const w = 'element[' + e.z + ' ' + e.sym + ']';
    if (zs.has(e.z)) E(w + ': dup z'); zs.add(e.z);
    if (!isStr(e.sym) || !isStr(e.name) || !isStr(e.config)) E(w + ': sym/name/config');
    if (typeof e.mass !== 'number') E(w + ': mass');
    if (!CATS.includes(e.cat)) E(w + ': bad cat ' + e.cat);
    if (!['solid', 'liquid', 'gas', 'unknown'].includes(e.state)) E(w + ': bad state');
    if (!(e.period >= 1 && e.period <= 7)) E(w + ': bad period');
    const fblock = (e.z >= 57 && e.z <= 71) || (e.z >= 89 && e.z <= 103);
    if (fblock) { if (e.group !== null) E(w + ': f-block elements need group: null'); if (e.cat !== (e.z <= 71 ? 'lanthanide' : 'actinide')) E(w + ': f-block cat must be lanthanide/actinide'); }
    else {
      if (!(e.group >= 1 && e.group <= 18)) E(w + ': bad group');
      const p = e.period + ',' + e.group; if (pos.has(p)) E(w + ': position clash ' + p); pos.add(p);
    }
    if (e.en !== null && typeof e.en !== 'number') E(w + ': en must be number or null');
  });
  for (let z = 1; z <= 118; z++) if (!zs.has(z)) E('elements: missing z=' + z);
}

/* ---- branches ---- */
CLI.branches.forEach(b => {
  if (!SUBJ.includes(b.subject)) E('branches: bad subject ' + b.subject);
  let count = 0;
  (function walk(n, d) { count++; if (d > 5) E('branches[' + b.subject + ']: too deep'); (n.kids || []).forEach(k => walk(typeof k === 'string' ? { t: k } : k, d + 1)); })(b.tree, 0);
  if (count < 15) Wn('branches[' + b.subject + ']: only ' + count + ' nodes');
});

const counts = { topics: CLI.topics.length, vocab: CLI.vocab.length, formulas: CLI.formulas.length, constants: CLI.constants.length, elements: CLI.elements.length, branches: CLI.branches.length };
console.log('Loaded:', JSON.stringify(counts));
warns.slice(0, 60).forEach(m => console.log('WARN ', m));
errs.slice(0, 80).forEach(m => console.log('ERROR', m));
console.log(errs.length ? ('\n' + errs.length + ' error(s), ' + warns.length + ' warning(s)') : ('\nOK — 0 errors, ' + warns.length + ' warning(s)'));
process.exit(errs.length ? 1 : 0);
