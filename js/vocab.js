/* CLI Vocabulary: searchable science dictionary with live-update support and user-added words. */
(function () {
  'use strict';
  var CLI = window.CLI, esc = CLI.esc;

  function norm(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function letterOf(w) { var c = norm(w).replace(/[^a-z]/g, '').charAt(0); return c ? c.toUpperCase() : '#'; }
  function slug(w) { return norm(w).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function subjName(id) { var s = CLI.subject(id); return s ? s.name : id; }

  CLI.views.vocabulary = {
    mount: function (el, p) {
      var all = CLI.allVocab().slice().sort(function (a, b) { return norm(a.w).localeCompare(norm(b.w)); });
      var byKey = {}; all.forEach(function (v) { byKey[v.w.toLowerCase()] = v; });
      var st = { q: '', subj: 'all', letter: 'all' };
      var want = p.rest[0] ? decodeURIComponent(p.rest[0]) : '';
      var wod = CLI.wordOfDay();

      el.innerHTML = '<div class="page-head"><h1>Scientific Vocabulary</h1><p>Hard science words, names and terms explained twice: once precisely, and once in plain words. Search, filter by subject, or jump by letter.</p></div>' +
        (wod ? '<div class="card wotd vocab-wotd"><span class="badge plain">Word of the day</span> <strong class="word">' + esc(wod.w) + '</strong> <span class="pron">' + esc(wod.pron || '') + '</span><p>' + esc(wod.simple || wod.def) + '</p><a class="btn sm" href="#/vocabulary/' + encodeURIComponent(wod.w) + '">Read the full entry</a></div>' : '') +
        '<div class="v-tools"><label class="sr-only" for="v-q">Search the dictionary</label><input id="v-q" type="search" placeholder="Search words and meanings…" autocomplete="off">' +
        '<div class="chips" id="v-subj" role="group" aria-label="Filter by subject"></div>' +
        '<div class="az" id="v-az" role="group" aria-label="Jump to letter"></div>' +
        '<p class="muted small" id="v-count" aria-live="polite"></p></div>' +
        '<div id="v-list"></div>' +
        '<details class="card add-word"><summary>Add your own word</summary><form id="v-add" autocomplete="off">' +
        '<label class="field"><span>Word</span><input name="w" required maxlength="80"></label>' +
        '<label class="field"><span>Subject</span><select name="subj">' + CLI.SUBJECTS.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join('') + '</select></label>' +
        '<label class="field"><span>Meaning</span><textarea name="def" required maxlength="600"></textarea></label>' +
        '<label class="field"><span>In plain words (optional)</span><textarea name="simple" maxlength="400"></textarea></label>' +
        '<label class="field"><span>Example sentence (optional)</span><input name="ex" maxlength="300"></label>' +
        '<button class="btn primary" type="submit">Save word</button><p class="muted small">Saved only in this browser. To add words for everyone, edit <code>data/vocab-updates.json</code> on the server.</p></form></details>';

      var list = el.querySelector('#v-list'), count = el.querySelector('#v-count');
      var subjBox = el.querySelector('#v-subj'), az = el.querySelector('#v-az'), q = el.querySelector('#v-q');

      function visible() {
        var toks = norm(st.q).split(/\s+/).filter(Boolean);
        return all.filter(function (v) {
          if (st.subj !== 'all' && v.subj !== st.subj) return false;
          if (st.letter !== 'all' && letterOf(v.w) !== st.letter) return false;
          if (!toks.length) return true;
          var x = norm(v.w + ' ' + v.def + ' ' + (v.simple || '') + ' ' + (v.origin || ''));
          return toks.every(function (t) { return x.indexOf(t) >= 0; });
        });
      }
      function entry(v, open) {
        var rel = (v.related || []).map(function (r) {
          var t = byKey[r.toLowerCase()];
          return t ? '<a class="chip" href="#/vocabulary/' + encodeURIComponent(t.w) + '">' + esc(r) + '</a>' : '<span class="chip plain">' + esc(r) + '</span>';
        }).join('');
        var sc = (CLI.subject(v.subj) || {}).c || 1;
        return '<details class="term sc' + sc + '" id="term-' + slug(v.w) + '"' + (open ? ' open' : '') + '><summary><span class="t-word">' + esc(v.w) + '</span>' +
          (v.pron ? '<span class="t-pron">' + esc(v.pron) + '</span>' : '') + (v.pos ? '<span class="t-pos">' + esc(v.pos) + '</span>' : '') +
          '<span class="badge">' + esc(subjName(v.subj)) + '</span>' + (v.custom ? '<span class="badge plain">My word</span>' : '') + (v.updated ? '<span class="badge plain">Updated</span>' : '') + '</summary>' +
          '<div class="t-body"><p class="t-def">' + esc(v.def) + '</p>' +
          (v.simple ? '<p><strong>In plain words:</strong> ' + esc(v.simple) + '</p>' : '') +
          (v.ex ? '<p class="t-ex"><strong>Example:</strong> <em>' + esc(v.ex) + '</em></p>' : '') +
          (v.origin ? '<p class="muted"><strong>Origin:</strong> ' + esc(v.origin) + '</p>' : '') +
          (rel ? '<div class="chips"><span class="muted">Related:</span> ' + rel + '</div>' : '') +
          (v.custom ? '<button class="btn sm ghost" type="button" data-del="' + esc(v.w) + '">Delete this word</button>' : '') + '</div></details>';
      }
      function draw() {
        var v = visible();
        count.textContent = v.length === all.length ? all.length + ' terms' : 'Showing ' + v.length + ' of ' + all.length + ' terms';
        if (!v.length) { list.innerHTML = '<div class="card empty">No words match. Try fewer letters, or clear the filters.</div>'; return; }
        var html = '', cur = '';
        v.forEach(function (x) {
          var L = letterOf(x.w);
          if (L !== cur) { if (cur) html += '</div>'; cur = L; html += '<h2 class="v-letter">' + L + '</h2><div class="v-group">'; }
          html += entry(x, want && x.w.toLowerCase() === want.toLowerCase());
        });
        list.innerHTML = html + '</div>';
      }
      function drawChips() {
        subjBox.innerHTML = [{ id: 'all', name: 'All subjects' }].concat(CLI.SUBJECTS).map(function (s) { return '<button type="button" class="chip" data-s="' + s.id + '" aria-pressed="' + (st.subj === s.id) + '">' + esc(s.name) + '</button>'; }).join('');
        var have = {}; all.forEach(function (v) { if (st.subj === 'all' || v.subj === st.subj) have[letterOf(v.w)] = 1; });
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
        az.innerHTML = '<button type="button" class="az-b" data-l="all" aria-pressed="' + (st.letter === 'all') + '">All</button>' + letters.map(function (l) { return '<button type="button" class="az-b" data-l="' + l + '" aria-pressed="' + (st.letter === l) + '"' + (have[l] ? '' : ' disabled') + '>' + l + '</button>'; }).join('');
      }
      q.addEventListener('input', function () { st.q = q.value; draw(); });
      subjBox.addEventListener('click', function (e) { var b = e.target.closest('[data-s]'); if (!b) return; st.subj = b.dataset.s; st.letter = 'all'; drawChips(); draw(); });
      az.addEventListener('click', function (e) { var b = e.target.closest('[data-l]'); if (!b || b.disabled) return; st.letter = b.dataset.l; drawChips(); draw(); });
      list.addEventListener('click', function (e) {
        var d = e.target.closest('[data-del]'); if (!d) return;
        var c = CLI.store.get('customVocab', []).filter(function (x) { return x.w !== d.dataset.del; }); CLI.store.set('customVocab', c); CLI.toast('Word deleted'); CLI.route();
      });
      el.querySelector('#v-add').addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target, w = f.w.value.trim(), def = f.def.value.trim(); if (!w || !def) return;
        var c = CLI.store.get('customVocab', []).filter(function (x) { return x.w.toLowerCase() !== w.toLowerCase(); });
        c.push({ w: w, subj: f.subj.value, pos: '', pron: '', def: def, simple: f.simple.value.trim(), ex: f.ex.value.trim() });
        CLI.store.set('customVocab', c); CLI.toast('Saved “' + w + '”'); CLI.route();
      });
      drawChips(); draw();
      if (want) { var t = byKey[want.toLowerCase()]; if (t) { var n = el.querySelector('#term-' + slug(t.w)); if (n) setTimeout(function () { n.scrollIntoView({ block: 'center' }); n.classList.add('flash'); }, 60); } }
    },
    unmount: function () { }
  };
})();
