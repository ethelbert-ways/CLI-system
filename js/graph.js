/* CLI Graphics: canvas plotter. y=f(x), polar r=f(θ), parametric (x(t), y(t)), implicit F(x,y)=0, sliders, trace, points of interest. */
(function () {
  'use strict';
  var CLI = window.CLI, M = CLI.math, esc = CLI.esc;
  var COLORS = ['#2a8fa3', '#d9534f', '#7b5ea7', '#e08a1e', '#2e9b62', '#c2467d'];
  var EXAMPLES = [['y = x²', 'x^2'], ['Sine wave', 'sin(x)'], ['Circle', 'x^2+y^2=25'], ['Cardioid', 'r = 1+cos(θ)'], ['Parametric', '(cos(t), sin(t))'], ['Sliders', 'a*sin(b*x)'], ['Tangent', 'tan(x)']];
  var MAXROWS = 6, cleanup = null;

  function nice(range, target) {
    var raw = range / target, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
  }
  function lab(v, step) {
    if (Math.abs(v) < step * 1e-6) return '0';
    if (Math.abs(v) >= 1e6 || Math.abs(v) < 1e-4) return v.toExponential(1).replace('e+', 'e');
    var d = Math.min(10, Math.max(0, -Math.floor(Math.log10(step)))), s = v.toFixed(d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s;
  }
  function splitTop(s) {
    var out = [], depth = 0, cur = '', i;
    for (i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '(' || c === '[' || c === '{') depth++; else if (c === ')' || c === ']' || c === '}') depth--;
      if (c === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += c;
    }
    out.push(cur); return out;
  }
  var sub = function (n) { return String.fromCharCode(8320 + n); };

  CLI.views.graphics = {
    mount: function (el) {
      var hand = CLI.takeHandoff('graphics');
      var mode = (hand && hand.mode) || CLI.store.get('gfMode', 'rad');
      var rows = [], nextId = 1, P = {}, view = { cx: 0, cy: 0, kx: 30, ky: 30 }, lock = true, grid = true, tmin = -10, tmax = 10;
      var trace = null, focus = null, pois = [], poiTimer = null, raf = 0, W = 0, H = 0, dpr = 1, disposed = false;
      var saved = CLI.store.get('gfRows', null);
      var initial = hand && hand.fn ? String(hand.fn).split('\n').filter(function (s) { return s.trim(); }) : (Array.isArray(saved) && saved.length ? saved : ['x^2/5', 'sin(x)']);
      initial.slice(0, MAXROWS).forEach(function (s) { rows.push({ id: nextId++, src: String(s), on: true }); });

      el.innerHTML = '<div class="v-graph"><div class="page-head"><h1>Graphing</h1><p>Plot equations to see what they mean. Drag to move, scroll or pinch to zoom, tap the graph to trace.</p></div>' +
        '<div class="gf-layout"><section class="gf-stage" aria-label="Graph">' +
        '<div class="gf-canvaswrap" id="gf-wrap"><canvas id="gf-cv" tabindex="0" role="img" aria-label="Graph of the functions you entered. Use arrow keys to move and plus or minus to zoom."></canvas>' +
        '<div class="gf-zoom"><button type="button" class="gf-zb" data-z="in" aria-label="Zoom in">+</button><button type="button" class="gf-zb" data-z="out" aria-label="Zoom out">−</button><button type="button" class="gf-zb" data-z="home" aria-label="Reset view">⌂</button></div></div>' +
        '<div class="gf-read card flat" id="gf-read" aria-live="polite">Tap or hover the graph to read values.</div></section>' +
        '<section class="gf-side"><div class="card gf-fns"><div class="gf-h"><h2>Equations</h2><button type="button" class="btn sm" id="gf-add">Add</button></div><div id="gf-rows"></div>' +
        '<div class="gf-ex"><span class="muted">Try:</span> ' + EXAMPLES.map(function (e, i) { return '<button type="button" class="chip" data-ex="' + i + '">' + esc(e[0]) + '</button>'; }).join('') + '</div>' +
        '<details class="gf-help"><summary>What can I type?</summary><ul><li><b>y = f(x)</b>: <code>x^2 - 3</code>, <code>sin(x)/x</code>, <code>y = 2x + 1</code></li><li><b>Circles and curves</b>: <code>x^2 + y^2 = 25</code></li><li><b>Polar</b>: <code>r = 2 sin(3θ)</code> (type θ or <code>theta</code>)</li><li><b>Parametric</b>: <code>(cos(t), sin(t))</code></li><li><b>Sliders</b>: use any other letter, like <code>a*x^2 + b</code>, and sliders appear.</li></ul></details></div>' +
        '<div class="card gf-par hidden" id="gf-par"><h2>Sliders</h2><div id="gf-sl"></div></div>' +
        '<div class="card gf-poi"><h2>Points of interest</h2><div id="gf-poi" class="gf-chips" aria-live="polite"></div><p class="muted" id="gf-poi-note"></p></div>' +
        '<details class="card gf-set"><summary>Settings and window</summary><div class="gf-setgrid">' +
        '<label class="sv-lab">Angle mode<select id="gf-mode"><option value="rad">Radians</option><option value="deg">Degrees</option><option value="grad">Gradians</option></select></label>' +
        '<label class="gf-chk"><input type="checkbox" id="gf-lock" checked> Equal x and y scale</label><label class="gf-chk"><input type="checkbox" id="gf-grid" checked> Show grid</label>' +
        '<label class="sv-lab">t from<input type="text" id="gf-t0" value="-10" inputmode="decimal"></label><label class="sv-lab">t to<input type="text" id="gf-t1" value="10" inputmode="decimal"></label>' +
        '<label class="sv-lab">x min<input type="text" id="gf-x0" inputmode="decimal"></label><label class="sv-lab">x max<input type="text" id="gf-x1" inputmode="decimal"></label>' +
        '<label class="sv-lab">y min<input type="text" id="gf-y0" inputmode="decimal"></label><label class="sv-lab">y max<input type="text" id="gf-y1" inputmode="decimal"></label></div>' +
        '<div class="gf-btns"><button type="button" class="btn" id="gf-apply">Apply window</button><button type="button" class="btn ghost" id="gf-reset">Reset view</button><button type="button" class="btn ghost" id="gf-png">Save as image</button></div></details>' +
        '</section></div></div>';

      var $ = function (id) { return el.querySelector('#' + id); };
      var cv = $('gf-cv'), ctx = cv.getContext('2d'), wrap = $('gf-wrap');
      $('gf-mode').value = mode;

      /* ---------- compile ---------- */
      function compileRow(r) {
        r.err = null; r.kind = null; r.fns = null; r.names = [];
        var src = r.src.trim();
        if (!src) { r.empty = true; return; }
        r.empty = false;
        try {
          var asts = [], args, kind, m, parts, sp;
          if (/^\(.*\)$/.test(src) && (parts = splitTop(src.slice(1, -1))).length === 2) { kind = 'param'; args = ['t']; asts = parts.map(function (p) { return M.parse(p); }); }
          else if ((m = src.match(/^\s*r\s*=(.*)$/i)) && src.indexOf('=') === src.search(/=/)) { kind = 'polar'; args = ['theta']; asts = [M.parse(m[1])]; }
          else if (src.indexOf('=') >= 0) {
            var k = src.indexOf('='); if (src.indexOf('=', k + 1) >= 0) throw new Error('Use just one = sign.');
            var L = src.slice(0, k).trim(), R = src.slice(k + 1).trim();
            if (!L || !R) throw new Error('Write something on both sides of the = sign.');
            if (/^(y|[a-z]\s*\(\s*x\s*\))$/i.test(L) && !M.freeVars(M.parse(R)).y) { kind = 'explicit'; args = ['x']; asts = [M.parse(R)]; }
            else if (/^y$/i.test(R) && !M.freeVars(M.parse(L)).y) { kind = 'explicit'; args = ['x']; asts = [M.parse(L)]; }
            else { kind = 'implicit'; args = ['x', 'y']; asts = [{ n: 'bin', op: '-', a: M.parse(L), b: M.parse(R) }]; }
          } else {
            var a0 = M.parse(src);
            if (M.freeVars(a0).y) { kind = 'implicit'; args = ['x', 'y']; asts = [a0]; } else { kind = 'explicit'; args = ['x']; asts = [a0]; }
          }
          var names = {};
          asts.forEach(function (a) { M.freeVars(a, names); });
          args.forEach(function (a) { delete names[a]; });
          var nm = Object.keys(names);
          if (nm.length > 4) throw new Error('Too many unknown letters: ' + nm.join(', '));
          nm.forEach(function (n) { if (!(n in P)) P[n] = 1; });
          r.fns = asts.map(function (a) { return M.compile(a, { mode: mode, args: args, scope: P }); });
          r.kind = kind; r.names = nm;
        } catch (e) {
          r.err = e && e.name === 'MathErr' ? (e.kind === 'syntax' ? 'Check the brackets and symbols.' : e.message) : (e && e.message) || 'Could not read this.';
        }
      }
      function compileAll() { rows.forEach(compileRow); }

      /* ---------- UI: rows and sliders ---------- */
      function drawRows() {
        $('gf-rows').innerHTML = rows.map(function (r, i) {
          return '<div class="gf-row" data-id="' + r.id + '"><button type="button" class="gf-sw' + (r.on ? '' : ' off') + '" style="--c:' + COLORS[i % 6] + '" data-act="vis" aria-pressed="' + r.on + '" aria-label="Show or hide f' + (i + 1) + '"></button>' +
            '<input type="text" class="gf-in" value="' + esc(r.src) + '" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Equation ' + (i + 1) + '" placeholder="e.g. x^2 - 3">' +
            '<button type="button" class="gf-x" data-act="del" aria-label="Remove equation ' + (i + 1) + '">×</button><div class="gf-err">' + (r.err ? esc(r.err) : '') + '</div></div>';
        }).join('');
        $('gf-add').disabled = rows.length >= MAXROWS;
      }
      function drawSliders() {
        var names = {}; rows.forEach(function (r) { if (r.on && !r.err) r.names.forEach(function (n) { names[n] = 1; }); });
        var list = Object.keys(names).sort();
        $('gf-par').classList.toggle('hidden', !list.length);
        $('gf-sl').innerHTML = list.map(function (n) {
          return '<div class="gf-sl"><label for="sl-' + n + '">' + esc(n) + ' =</label><input type="range" id="sl-' + n + '" data-n="' + esc(n) + '" min="-10" max="10" step="0.1" value="' + Math.max(-10, Math.min(10, P[n])) + '"><input type="text" class="gf-sn" data-n="' + esc(n) + '" value="' + M.fmt(P[n]) + '" inputmode="decimal" aria-label="Value of ' + esc(n) + '"></div>';
        }).join('');
      }
      function saveRows() { CLI.store.set('gfRows', rows.map(function (r) { return r.src; })); }
      function rebuild(keepFocus) { compileAll(); if (!keepFocus) drawRows(); else rows.forEach(function (r) { var e = el.querySelector('.gf-row[data-id="' + r.id + '"] .gf-err'); if (e) e.textContent = r.err || ''; }); drawSliders(); schedule(); queueAnalysis(); }

      $('gf-rows').addEventListener('input', function (e) {
        var row = e.target.closest('.gf-row'); if (!row) return;
        var r = rows.filter(function (x) { return x.id === +row.dataset.id; })[0]; r.src = e.target.value; saveRows();
        compileRow(r); row.querySelector('.gf-err').textContent = r.err || ''; drawSliders(); schedule(); queueAnalysis();
      });
      $('gf-rows').addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]'); if (!b) return; var id = +b.closest('.gf-row').dataset.id, i;
        for (i = 0; i < rows.length; i++) if (rows[i].id === id) break;
        if (b.dataset.act === 'vis') { rows[i].on = !rows[i].on; drawRows(); drawSliders(); schedule(); queueAnalysis(); }
        else { rows.splice(i, 1); saveRows(); drawRows(); drawSliders(); schedule(); queueAnalysis(); }
      });
      $('gf-add').addEventListener('click', function () { if (rows.length >= MAXROWS) return; rows.push({ id: nextId++, src: '', on: true }); drawRows(); var ins = el.querySelectorAll('.gf-in'); ins[ins.length - 1].focus(); });
      el.querySelector('.gf-ex').addEventListener('click', function (e) {
        var b = e.target.closest('[data-ex]'); if (!b) return; var s = EXAMPLES[+b.dataset.ex][1];
        var empty = rows.filter(function (r) { return !r.src.trim(); })[0];
        if (empty) empty.src = s; else if (rows.length < MAXROWS) rows.push({ id: nextId++, src: s, on: true }); else rows[rows.length - 1].src = s;
        saveRows(); rebuild(false);
      });
      $('gf-sl').addEventListener('input', function (e) {
        var n = e.target.dataset.n; if (!n) return;
        var v = +e.target.value;
        if (e.target.type === 'text') { v = M.evaluate(e.target.value || '0', {}, 'rad'); if (!isFinite(v)) return; var rg = el.querySelector('#sl-' + n); if (rg) rg.value = Math.max(-10, Math.min(10, v)); }
        else { var tx = el.querySelector('.gf-sn[data-n="' + n + '"]'); if (tx) tx.value = M.fmt(v); }
        P[n] = v; schedule(); queueAnalysis();
      });
      $('gf-mode').addEventListener('change', function (e) { mode = e.target.value; CLI.store.set('gfMode', mode); rebuild(true); });
      $('gf-lock').addEventListener('change', function (e) { lock = e.target.checked; if (lock) view.ky = view.kx; schedule(); syncWindow(); });
      $('gf-grid').addEventListener('change', function (e) { grid = e.target.checked; schedule(); });
      function readT() { try { var a = M.evaluate($('gf-t0').value, {}, 'rad'), b = M.evaluate($('gf-t1').value, {}, 'rad'); if (isFinite(a) && isFinite(b) && b > a) { tmin = a; tmax = b; schedule(); } } catch (e) { /* ignore */ } }
      $('gf-t0').addEventListener('input', readT); $('gf-t1').addEventListener('input', readT);

      /* ---------- view helpers ---------- */
      var toX = function (x) { return W / 2 + (x - view.cx) * view.kx; };
      var toY = function (y) { return H / 2 - (y - view.cy) * view.ky; };
      var wx = function (px) { return view.cx + (px - W / 2) / view.kx; };
      var wy = function (py) { return view.cy - (py - H / 2) / view.ky; };
      function clampK() { view.kx = Math.max(1e-5, Math.min(1e8, view.kx)); view.ky = Math.max(1e-5, Math.min(1e8, view.ky)); }
      function home() { view.cx = 0; view.cy = 0; view.kx = view.ky = Math.max(8, Math.min(W, H) / 20); lock = true; $('gf-lock').checked = true; schedule(); syncWindow(); queueAnalysis(); }
      function zoomAt(f, px, py) {
        var ax = wx(px), ay = wy(py);
        view.kx *= f; view.ky = lock ? view.kx : view.ky * f; clampK(); if (lock) view.ky = view.kx;
        view.cx = ax - (px - W / 2) / view.kx; view.cy = ay + (py - H / 2) / view.ky;
        schedule(); syncWindow(); queueAnalysis();
      }
      function syncWindow() {
        if (!W) return; var set = function (id, v) { var i = $(id); if (i && document.activeElement !== i) i.value = M.fmt(v, { sig: 5 }); };
        set('gf-x0', wx(0)); set('gf-x1', wx(W)); set('gf-y0', wy(H)); set('gf-y1', wy(0));
      }
      $('gf-apply').addEventListener('click', function () {
        try {
          var a = M.evaluate($('gf-x0').value, {}, 'rad'), b = M.evaluate($('gf-x1').value, {}, 'rad'), c = M.evaluate($('gf-y0').value, {}, 'rad'), d = M.evaluate($('gf-y1').value, {}, 'rad');
          if (![a, b, c, d].every(isFinite) || b <= a || d <= c) { CLI.toast('Max must be bigger than min'); return; }
          view.kx = W / (b - a); view.ky = H / (d - c); view.cx = (a + b) / 2; view.cy = (c + d) / 2; clampK();
          lock = Math.abs(view.kx / view.ky - 1) < 1e-6; $('gf-lock').checked = lock; schedule(); queueAnalysis();
        } catch (e) { CLI.toast('Check the window numbers'); }
      });
      $('gf-reset').addEventListener('click', home);
      $('gf-png').addEventListener('click', function () {
        draw(true);
        cv.toBlob(function (blob) { if (!blob) return; var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cli-graph.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000); });
      });
      wrap.querySelector('.gf-zoom').addEventListener('click', function (e) {
        var b = e.target.closest('[data-z]'); if (!b) return;
        if (b.dataset.z === 'home') home(); else zoomAt(b.dataset.z === 'in' ? 1.4 : 1 / 1.4, W / 2, H / 2);
      });

      /* ---------- drawing ---------- */
      function schedule() { if (!raf && !disposed) raf = requestAnimationFrame(function () { raf = 0; draw(); }); }
      function visibleRows() { var out = []; rows.forEach(function (r, i) { if (r.on && !r.err && r.fns) out.push({ r: r, i: i }); }); return out; }
      function draw() {
        if (!W) return;
        var cs = getComputedStyle(cv), col = function (n, f) { return cs.getPropertyValue(n).trim() || f; };
        var bg = col('--surface', '#fff'), line = col('--line', '#ddd'), strong = col('--line-strong', '#bbb'), txt = col('--muted', '#666'), fg = col('--text', '#111');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        var xs = nice(W / view.kx, W / 90), ys = nice(H / view.ky, H / 70);
        var x0 = wx(0), x1 = wx(W), y1 = wy(0), y0 = wy(H), v;
        ctx.lineWidth = 1; ctx.font = '12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
        if (grid) {
          ctx.strokeStyle = line; ctx.beginPath();
          for (v = Math.ceil(x0 / xs) * xs; v <= x1; v += xs) { var gx = Math.round(toX(v)) + .5; ctx.moveTo(gx, 0); ctx.lineTo(gx, H); }
          for (v = Math.ceil(y0 / ys) * ys; v <= y1; v += ys) { var gy = Math.round(toY(v)) + .5; ctx.moveTo(0, gy); ctx.lineTo(W, gy); }
          ctx.stroke();
        }
        var ax = toX(0), ay = toY(0);
        ctx.strokeStyle = strong; ctx.lineWidth = 1.5; ctx.beginPath();
        if (ax >= 0 && ax <= W) { ctx.moveTo(Math.round(ax) + .5, 0); ctx.lineTo(Math.round(ax) + .5, H); }
        if (ay >= 0 && ay <= H) { ctx.moveTo(0, Math.round(ay) + .5); ctx.lineTo(W, Math.round(ay) + .5); }
        ctx.stroke();
        ctx.fillStyle = txt; ctx.textBaseline = 'top';
        var ly = Math.max(4, Math.min(H - 18, ay + 5)); ctx.textAlign = 'center';
        for (v = Math.ceil(x0 / xs) * xs; v <= x1; v += xs) { if (Math.abs(v) < xs * 1e-6) continue; var tx = toX(v); if (tx > 14 && tx < W - 14) ctx.fillText(lab(v, xs), tx, ly); }
        var lx = Math.max(4, Math.min(W - 6, ax + 6)), right = lx > W - 50; ctx.textAlign = right ? 'right' : 'left'; if (right) lx = Math.min(W - 6, ax - 6); ctx.textBaseline = 'middle';
        for (v = Math.ceil(y0 / ys) * ys; v <= y1; v += ys) { if (Math.abs(v) < ys * 1e-6) continue; var ty = toY(v); if (ty > 10 && ty < H - 10) ctx.fillText(lab(v, ys), lx, ty - 0); }
        if (ax > 0 && ax < W && ay > 0 && ay < H) { ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText('0', ax + 4, ay + 4); }

        ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 2.4;
        visibleRows().forEach(function (o) { ctx.strokeStyle = COLORS[o.i % 6]; plot(o.r); });
        // trace + points
        var vis = visibleRows().filter(function (o) { return o.r.kind === 'explicit'; });
        if (trace != null) {
          var txp = toX(trace); ctx.strokeStyle = fg; ctx.globalAlpha = .35; ctx.setLineDash([5, 5]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(txp, 0); ctx.lineTo(txp, H); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
          vis.forEach(function (o) { var y = o.r.fns[0](trace); if (isFinite(y)) dot(txp, toY(y), COLORS[o.i % 6], 5); });
        }
        pois.forEach(function (p) { var px = toX(p.x), py = toY(p.y); if (px > -10 && px < W + 10 && py > -10 && py < H + 10) dot(px, py, p.color, 4); });
        if (focus) { var fx = toX(focus.x), fy = toY(focus.y); ctx.strokeStyle = fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(fx, fy, 9, 0, 6.2832); ctx.stroke(); }
      }
      function dot(x, y, c, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fillStyle = getComputedStyle(cv).getPropertyValue('--surface').trim() || '#fff'; ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 2.4; ctx.stroke(); }
      function plot(r) {
        var i, n, px, py, y, x, pen, sy, prev = 0;
        if (r.kind === 'explicit') {
          var f = r.fns[0]; ctx.beginPath(); pen = false;
          for (px = 0; px <= W; px += 1) {
            y = f(wx(px));
            if (!isFinite(y)) { pen = false; continue; }
            sy = toY(y); if (Math.abs(sy) > 1e6) { pen = false; continue; }
            if (pen && Math.abs(sy - prev) > H * 1.5) pen = false;
            if (pen) ctx.lineTo(px, sy); else ctx.moveTo(px, sy);
            pen = true; prev = sy;
          }
          ctx.stroke();
        } else if (r.kind === 'polar') {
          var g = r.fns[0], N = 3200, tmaxP = 8 * Math.PI, u = mode === 'deg' ? 180 / Math.PI : mode === 'grad' ? 200 / Math.PI : 1;
          ctx.beginPath(); pen = false;
          for (i = 0; i <= N; i++) {
            var th = i * tmaxP / N, rr = g(th * u);
            if (!isFinite(rr)) { pen = false; continue; }
            var qx = toX(rr * Math.cos(th)), qy = toY(rr * Math.sin(th)); if (Math.abs(qx) > 1e6 || Math.abs(qy) > 1e6) { pen = false; continue; }
            if (pen) ctx.lineTo(qx, qy); else ctx.moveTo(qx, qy); pen = true;
          }
          ctx.stroke();
        } else if (r.kind === 'param') {
          var fx = r.fns[0], fy = r.fns[1]; n = 3000; ctx.beginPath(); pen = false;
          for (i = 0; i <= n; i++) {
            var t = tmin + (tmax - tmin) * i / n, a = fx(t), b = fy(t);
            if (!isFinite(a) || !isFinite(b)) { pen = false; continue; }
            var sx = toX(a), sy2 = toY(b); if (Math.abs(sx) > 1e6 || Math.abs(sy2) > 1e6) { pen = false; continue; }
            if (pen) ctx.lineTo(sx, sy2); else ctx.moveTo(sx, sy2); pen = true;
          }
          ctx.stroke();
        } else if (r.kind === 'implicit') implicit(r.fns[0]);
      }
      function implicit(F) {
        var cell = W * H > 600000 ? 6 : 5, nx = Math.ceil(W / cell), ny = Math.ceil(H / cell), vals = new Float64Array((nx + 1) * (ny + 1)), i, j;
        for (j = 0; j <= ny; j++) for (i = 0; i <= nx; i++) vals[j * (nx + 1) + i] = F(wx(i * cell), wy(j * cell));
        var T = [null, [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], 5, [[0, 2]], [[0, 3]], [[0, 3]], [[0, 2]], 10, [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], null];
        ctx.beginPath();
        for (j = 0; j < ny; j++) for (i = 0; i < nx; i++) {
          var va = vals[j * (nx + 1) + i], vb = vals[j * (nx + 1) + i + 1], vc = vals[(j + 1) * (nx + 1) + i + 1], vd = vals[(j + 1) * (nx + 1) + i];
          if (!isFinite(va + vb + vc + vd)) continue;
          var idx = (va > 0 ? 8 : 0) | (vb > 0 ? 4 : 0) | (vc > 0 ? 2 : 0) | (vd > 0 ? 1 : 0), segs = T[idx];
          if (!segs) continue;
          if (segs === 5) segs = (va + vb + vc + vd) > 0 ? [[0, 3], [1, 2]] : [[0, 1], [2, 3]];
          else if (segs === 10) segs = (va + vb + vc + vd) > 0 ? [[0, 1], [2, 3]] : [[0, 3], [1, 2]];
          var X0 = i * cell, Y0 = j * cell;
          var pt = function (e) {
            var t;
            if (e === 0) { t = va / (va - vb); return [X0 + t * cell, Y0]; }
            if (e === 1) { t = vb / (vb - vc); return [X0 + cell, Y0 + t * cell]; }
            if (e === 2) { t = vd / (vd - vc); return [X0 + t * cell, Y0 + cell]; }
            t = va / (va - vd); return [X0, Y0 + t * cell];
          };
          segs.forEach(function (s) { var p = pt(s[0]), q = pt(s[1]); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); });
        }
        ctx.stroke();
      }

      /* ---------- points of interest ---------- */
      function queueAnalysis() { clearTimeout(poiTimer); poiTimer = setTimeout(analyse, 160); }
      function analyse() {
        if (disposed || !W) return;
        var vis = visibleRows().filter(function (o) { return o.r.kind === 'explicit'; }), out = [], a = wx(0), b = wx(W), note = '';
        vis.forEach(function (o) {
          var f = o.r.fns[0], c = COLORS[o.i % 6], nm = 'f' + sub(o.i + 1) + ' ';
          try {
            var rs = M.num.roots(f, a, b, 1500); if (rs.length > 12) { note = 'Some curves have too many roots to list.'; rs = []; }
            rs.forEach(function (x) { out.push({ x: x, y: 0, t: nm + 'root', c: c, color: c }); });
            M.num.extrema(f, a, b, 1200).slice(0, 10).forEach(function (e) { out.push({ x: e.x, y: e.y, t: nm + e.kind, color: c }); });
            if (a < 0 && b > 0) { var y = f(0); if (isFinite(y) && Math.abs(y) > 1e-9) out.push({ x: 0, y: y, t: nm + 'y-intercept', color: c }); }
          } catch (e) { /* skip */ }
        });
        vis.forEach(function (o, i) { vis.slice(i + 1).forEach(function (p) {
          try { var f = o.r.fns[0], g = p.r.fns[0], rs = M.num.roots(function (x) { return f(x) - g(x); }, a, b, 1500); if (rs.length > 8) return;
            rs.forEach(function (x) { var y = f(x); if (isFinite(y)) out.push({ x: x, y: y, t: 'f' + sub(o.i + 1) + ' meets f' + sub(p.i + 1), color: '#888' }); }); } catch (e) { /* skip */ }
        }); });
        var eps = 1e-9 * Math.max(1, Math.abs(b - a));
        out.forEach(function (p) { if (Math.abs(p.x) < eps) p.x = 0; if (Math.abs(p.y) < eps) p.y = 0; });
        pois = out.slice(0, 40);
        $('gf-poi').innerHTML = pois.length ? pois.map(function (p, i) { return '<button type="button" class="chip" data-p="' + i + '"><i style="background:' + p.color + '"></i>' + esc(p.t) + ' (' + M.fmt(p.x, { sig: 5 }) + ', ' + M.fmt(Math.abs(p.y) < 1e-9 ? 0 : p.y, { sig: 5 }) + ')</button>'; }).join('') : '<span class="muted">' + (vis.length ? 'None in the visible window.' : 'Roots, peaks, dips and crossing points of y = f(x) curves show up here.') + '</span>';
        $('gf-poi-note').textContent = note; schedule();
      }
      $('gf-poi').addEventListener('click', function (e) {
        var b = e.target.closest('[data-p]'); if (!b) return; var p = pois[+b.dataset.p]; if (!p) return;
        focus = p; trace = null; view.cx = p.x; view.cy = p.y; schedule(); syncWindow();
        $('gf-read').innerHTML = '<b>' + esc(p.t) + '</b> at x = ' + M.fmt(p.x, { sig: 8 }) + ', y = ' + M.fmt(Math.abs(p.y) < 1e-9 ? 0 : p.y, { sig: 8 });
      });

      /* ---------- trace readout ---------- */
      function readout() {
        if (trace == null) return;
        var vis = visibleRows().filter(function (o) { return o.r.kind === 'explicit'; });
        if (!vis.length) { $('gf-read').textContent = 'Trace works on y = f(x) curves.'; return; }
        $('gf-read').innerHTML = 'x = <b>' + M.fmt(trace, { sig: 6 }) + '</b>' + vis.map(function (o) {
          var f = o.r.fns[0], y = f(trace), d = M.num.derivative(f, trace);
          return ' &nbsp;·&nbsp; <span style="color:' + COLORS[o.i % 6] + '">f' + sub(o.i + 1) + '</span> = <b>' + (isFinite(y) ? M.fmt(Math.abs(y) < 1e-12 ? 0 : y, { sig: 6 }) : 'undefined') + '</b>' + (isFinite(d) && isFinite(y) ? ' <span class="muted">(slope ' + M.fmt(Math.abs(d) < 1e-9 ? 0 : d, { sig: 4 }) + ')</span>' : '');
        }).join('');
      }

      /* ---------- pointer interaction ---------- */
      var ptrs = new Map(), down = null, pinch = null;
      function pos(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
      cv.addEventListener('pointerdown', function (e) {
        cv.setPointerCapture(e.pointerId); var p = pos(e); ptrs.set(e.pointerId, p);
        if (ptrs.size === 1) down = { x: p.x, y: p.y, moved: false }; else { down = null; var a = Array.from(ptrs.values()); pinch = { d: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) }; }
      });
      cv.addEventListener('pointermove', function (e) {
        var p = pos(e), last = ptrs.get(e.pointerId);
        if (!last) { if (e.pointerType === 'mouse') { trace = wx(p.x); focus = null; readout(); schedule(); } return; }
        ptrs.set(e.pointerId, p);
        if (ptrs.size >= 2 && pinch) {
          var a = Array.from(ptrs.values()), d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
          if (pinch.d > 0 && d > 0) zoomAt(d / pinch.d, (a[0].x + a[1].x) / 2, (a[0].y + a[1].y) / 2); pinch.d = d; return;
        }
        if (down) {
          if (!down.moved && Math.hypot(p.x - down.x, p.y - down.y) > 5) down.moved = true;
          if (down.moved) { view.cx -= (p.x - last.x) / view.kx; view.cy += (p.y - last.y) / view.ky; schedule(); syncWindow(); queueAnalysis(); }
        }
      });
      function up(e) {
        var p = ptrs.get(e.pointerId); ptrs.delete(e.pointerId);
        if (down && !down.moved && p && e.type === 'pointerup') { trace = wx(p.x); focus = null; readout(); schedule(); }
        if (ptrs.size < 2) pinch = null; if (!ptrs.size) down = null;
      }
      cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
      cv.addEventListener('wheel', function (e) { e.preventDefault(); var p = pos(e); zoomAt(Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0015)), p.x, p.y); }, { passive: false });
      cv.addEventListener('keydown', function (e) {
        var s = 40, k = e.key;
        if (k === 'ArrowLeft') view.cx -= s / view.kx; else if (k === 'ArrowRight') view.cx += s / view.kx; else if (k === 'ArrowUp') view.cy += s / view.ky; else if (k === 'ArrowDown') view.cy -= s / view.ky;
        else if (k === '+' || k === '=') zoomAt(1.25, W / 2, H / 2); else if (k === '-' || k === '_') zoomAt(0.8, W / 2, H / 2); else if (k === '0') home();
        else if (k === 'Escape') { trace = null; focus = null; $('gf-read').textContent = 'Tap or hover the graph to read values.'; } else return;
        e.preventDefault(); schedule(); syncWindow(); queueAnalysis();
      });

      /* ---------- sizing / theme ---------- */
      var firstSize = true;
      function resize() {
        var r = wrap.getBoundingClientRect(); if (r.width < 10 || r.height < 10) return;
        var oW = W, oH = H; W = Math.round(r.width); H = Math.round(r.height); dpr = Math.min(3, window.devicePixelRatio || 1);
        cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
        if (firstSize) { firstSize = false; view.kx = view.ky = Math.max(8, Math.min(W, H) / 20); }
        else if (oW && lock) { /* keep scale and centre */ }
        syncWindow(); schedule(); queueAnalysis();
      }
      var ro = window.ResizeObserver ? new ResizeObserver(resize) : null; if (ro) ro.observe(wrap);
      var onWin = function () { resize(); }; window.addEventListener('resize', onWin);
      var onTheme = function () { schedule(); }; document.addEventListener('cli:theme', onTheme);
      cleanup = function () { disposed = true; clearTimeout(poiTimer); if (raf) cancelAnimationFrame(raf); if (ro) ro.disconnect(); window.removeEventListener('resize', onWin); document.removeEventListener('cli:theme', onTheme); };

      compileAll(); drawRows(); drawSliders(); resize(); if (hand && hand.fn) saveRows();
    },
    unmount: function () { if (cleanup) { cleanup(); cleanup = null; } }
  };
})();
