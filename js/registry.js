/* CLI registry: shared namespace, content registries and small shared helpers.
   Data files call CLI.addTopics(...), CLI.addVocab(...), etc. */
(function (root) {
  'use strict';
  var CLI = root.CLI = root.CLI || {};

  CLI.SUBJECTS = [
    { id: 'physics',   name: 'Physics',            c: 1, blurb: 'Motion, energy, waves, light, matter and the universe.' },
    { id: 'chemistry', name: 'Chemistry',          c: 2, blurb: 'Atoms, molecules, reactions and the stuff everything is made of.' },
    { id: 'biology',   name: 'Biology',            c: 4, blurb: 'Cells, genes, bodies, evolution and living ecosystems.' },
    { id: 'math',      name: 'Mathematics',        c: 5, blurb: 'The language of science: numbers, shapes, change and chance.' },
    { id: 'earth',     name: 'Earth & Space',      c: 3, blurb: 'Our planet, the weather, the stars and the cosmos.' },
    { id: 'computing', name: 'Computing & Logic',  c: 6, blurb: 'Bits, logic, algorithms and how machines compute.' }
  ];

  CLI.LEVELS = [
    { id: 'hs',       name: 'High School',          short: 'High School' },
    { id: 'college',  name: 'College',              short: 'College' },
    { id: 'advanced', name: 'Advanced / Graduate',  short: 'Advanced' },
    { id: 'phd',      name: 'PhD / Research',       short: 'PhD' }
  ];

  CLI.topics = [];
  CLI.vocab = [];
  CLI.formulas = [];
  CLI.constants = [];
  CLI.elements = [];
  CLI.branches = [];

  function adder(key) { return function (arr) { for (var i = 0; i < arr.length; i++) CLI[key].push(arr[i]); }; }
  CLI.addTopics = adder('topics');
  CLI.addVocab = adder('vocab');
  CLI.addFormulas = adder('formulas');
  CLI.addConstants = adder('constants');
  CLI.addElements = adder('elements');
  CLI.addBranches = adder('branches');

  /* ---- shared helpers (safe storage, toast, handoff between views) ---- */
  CLI.views = CLI.views || {};
  CLI.store = {
    get: function (k, d) { try { var v = root.localStorage.getItem('cli.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { root.localStorage.setItem('cli.' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  CLI.toast = function (msg) {
    if (typeof document === 'undefined') return;
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(CLI._tt); CLI._tt = setTimeout(function () { t.classList.remove('show'); }, 2200);
  };
  CLI.handoff = null;
  CLI.go = function (route, state) { CLI.handoff = state ? { to: route.split('/')[0], state: state } : null; root.location.hash = '#/' + route; };
  CLI.takeHandoff = function (route) { var h = CLI.handoff; if (h && h.to === route) { CLI.handoff = null; return h.state; } return null; };
  CLI.esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  /* inline text markup used in content: **bold** and $tex$ */
  CLI.rich = function (s) {
    var parts = String(s).split(/(\$[^$]+\$)/g);
    return parts.map(function (p) {
      if (p.length > 2 && p[0] === '$' && p[p.length - 1] === '$') return CLI.tex ? CLI.tex(p.slice(1, -1)) : CLI.esc(p);
      return CLI.esc(p).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    }).join('');
  };

  CLI.subject = function (id) { for (var i = 0; i < CLI.SUBJECTS.length; i++) if (CLI.SUBJECTS[i].id === id) return CLI.SUBJECTS[i]; return null; };
  CLI.level = function (id) { for (var i = 0; i < CLI.LEVELS.length; i++) if (CLI.LEVELS[i].id === id) return CLI.LEVELS[i]; return null; };
})(typeof window !== 'undefined' ? window : globalThis);
