/* CLI diagrams: turns a small JSON spec into a themed inline SVG figure.
   CLI.diagram(spec) -> HTML string. See tools/CONTENT_SPEC.md for the spec format. */
(function (root) {
  'use strict';
  var CLI = root.CLI = root.CLI || {};
  var M = CLI.math;
  var W = 600, UID = 0;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function r1(n) { return Math.round(n * 10) / 10; }

  var ctx = null;
  function measure(text, size, weight) {
    if (typeof document !== 'undefined') {
      if (!ctx) ctx = document.createElement('canvas').getContext('2d');
      ctx.font = (weight || 600) + ' ' + (size || 14) + 'px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      return ctx.measureText(text).width;
    }
    return String(text).length * (size || 14) * 0.57;
  }
  function wrap(text, maxW, size, weight) {
    var words = String(text).split(/\s+/), lines = [], cur = '';
    words.forEach(function (w) {
      var t = cur ? cur + ' ' + w : w;
      if (!cur || measure(t, size, weight) <= maxW) cur = t; else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function lines(x, y, arr, cls, lh) {
    return arr.map(function (l, i) { return '<text x="' + r1(x) + '" y="' + r1(y + i * lh) + '" class="' + cls + '">' + esc(l) + '</text>'; }).join('');
  }
  function rect(x, y, w, h, c, rx) { return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="' + (rx == null ? 10 : rx) + '" class="f' + (c || 0) + '"/>'; }
  function item(x) { return typeof x === 'string' ? { t: x } : x; }
  function arrow(x1, y1, x2, y2, c) { return '<path class="ln' + (c || '') + '" d="M' + r1(x1) + ' ' + r1(y1) + 'L' + r1(x2) + ' ' + r1(y2) + '" marker-end="url(#ah' + (c || '') + ')"/>'; }
  function niceStep(range, target) {
    var raw = range / (target || 6), p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
    return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
  }
  function ticks(lo, hi, target) {
    var st = niceStep(hi - lo, target), out = [], v = Math.ceil(lo / st - 1e-9) * st;
    for (; v <= hi + st * 1e-9; v += st) out.push(Math.abs(v) < st * 1e-9 ? 0 : Number(v.toPrecision(12)));
    return out;
  }
  var D = {};

  /* ---- flow: boxes joined by arrows (snake layout) ---- */
  D.flow = function (s) {
    var steps = s.steps.map(item), n = steps.length, cols = s.cols || Math.min(n, 4), pad = 14, gap = s.gap || 34;
    var bw = (W - 2 * pad - (cols - 1) * gap) / cols;
    var its = steps.map(function (st, i) {
      return { t: st.t, c: st.c || (i % 5) + 1, L: wrap(st.t, bw - 16, 14, 700), S: st.s ? wrap(st.s, bw - 16, 12, 500) : [] };
    });
    var rows = []; for (var i = 0; i < n; i += cols) rows.push(its.slice(i, i + cols));
    var y = pad, out = '';
    rows.forEach(function (row, r) {
      var h = Math.max.apply(null, row.map(function (it) { return 18 + it.L.length * 18 + (it.S.length ? it.S.length * 15 + 4 : 0); })) + 6;
      var rev = r % 2 === 1;
      row.forEach(function (it, k) {
        var col = rev ? cols - 1 - k : k;
        it.x = pad + col * (bw + gap); it.y = y; it.h = h;
        out += rect(it.x, y, bw, h, it.c);
        var ty = y + 15 + (h - 6 - (it.L.length * 18 + (it.S.length ? it.S.length * 15 + 4 : 0))) / 2 + 3;
        out += lines(it.x + bw / 2, ty + 11, it.L, 'tx tm', 18);
        if (it.S.length) out += lines(it.x + bw / 2, ty + 11 + it.L.length * 18 + 4, it.S, 'tx tsm tm', 15);
        if (k > 0) {
          var p = row[k - 1], my = y + h / 2;
          out += rev ? arrow(p.x - 1, my, it.x + bw + 2, my) : arrow(p.x + bw + 1, my, it.x - 2, my);
        }
      });
      if (r > 0) {
        var prevRow = rows[r - 1], last = prevRow[prevRow.length - 1], first = row[0];
        out += arrow(last.x + bw / 2, last.y + last.h + 1, first.x + bw / 2, first.y - 2);
      }
      y += h + gap;
    });
    return { body: out, h: Math.round(y - gap + pad) };
  };

  /* ---- cycle: nodes around an ellipse with clockwise arrows ---- */
  D.cycle = function (s) {
    var nodes = s.nodes.map(item), n = nodes.length;
    if (n < 3) throw new Error('cycle needs >= 3 nodes');
    var H = s.h || 380, cx = W / 2, cy = H / 2, bw = n > 6 ? 130 : 150, rx = W / 2 - bw / 2 - 18, ry = H / 2 - 52, out = '';
    nodes.forEach(function (nd, i) {
      nd.c = nd.c || (i % 5) + 1;
      nd.L = wrap(nd.t, bw - 14, 14, 700); nd.S = nd.s ? wrap(nd.s, bw - 14, 12, 500) : [];
      nd.h = 18 + nd.L.length * 17 + (nd.S.length ? nd.S.length * 14 + 3 : 0) + 6; nd.w = bw;
      nd.a = -Math.PI / 2 + i * 2 * Math.PI / n;
      nd.x = cx + rx * Math.cos(nd.a); nd.y = cy + ry * Math.sin(nd.a);
    });
    function pt(a) { return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; }
    function inside(p, nd) { return Math.abs(p[0] - nd.x) < nd.w / 2 + 7 && Math.abs(p[1] - nd.y) < nd.h / 2 + 7; }
    nodes.forEach(function (nd, i) {
      var nx = nodes[(i + 1) % n], a1 = nd.a, a2 = nx.a + (i + 1 === n ? 2 * Math.PI : 0);
      var d1 = 0; while (d1 < 80 && inside(pt(a1 + d1 * Math.PI / 180), nd)) d1++;
      var d2 = 0; while (d2 < 80 && inside(pt(a2 - d2 * Math.PI / 180), nx)) d2++;
      var p1 = pt(a1 + (d1 + 1) * Math.PI / 180), p2 = pt(a2 - (d2 + 1) * Math.PI / 180);
      if (a2 - (d2 + 1) * Math.PI / 180 > a1 + (d1 + 1) * Math.PI / 180)
        out += '<path class="ln" d="M' + r1(p1[0]) + ' ' + r1(p1[1]) + 'A' + r1(rx) + ' ' + r1(ry) + ' 0 0 1 ' + r1(p2[0]) + ' ' + r1(p2[1]) + '" marker-end="url(#ah)"/>';
    });
    nodes.forEach(function (nd) {
      out += rect(nd.x - nd.w / 2, nd.y - nd.h / 2, nd.w, nd.h, nd.c);
      var inner = nd.L.length * 17 + (nd.S.length ? nd.S.length * 14 + 3 : 0), top = nd.y - inner / 2;
      out += lines(nd.x, top + 13, nd.L, 'tx tm', 17);
      if (nd.S.length) out += lines(nd.x, top + 13 + nd.L.length * 17 + 3, nd.S, 'tx tsm tm', 14);
    });
    if (s.center) {
      var cl = wrap(s.center, 150, 16, 700);
      out += lines(cx, cy - (cl.length - 1) * 10 + 5, cl, 'tx tm tlg tsm', 21);
    }
    return { body: out, h: H };
  };

  /* ---- layers: stacked bands ---- */
  D.layers = function (s) {
    var L = s.layers.map(item); if (s.reverse) L = L.slice().reverse();
    var out = '', y = 8, gap = 6;
    L.forEach(function (l, i) {
      var c = l.c || (i % 5) + 1, sub = l.s ? wrap(l.s, W - 70, 12, 500) : [];
      var h = 16 + 20 + (sub.length ? sub.length * 15 + 2 : 0) + 6;
      out += rect(14, y, W - 28, h, c, 8);
      out += '<text x="30" y="' + r1(y + 26) + '" class="tx">' + esc(l.t) + '</text>';
      if (sub.length) out += lines(30, y + 44, sub, 'tx tsm', 15);
      y += h + gap;
    });
    return { body: out, h: y + 2 };
  };

  /* ---- plot: graph of functions of x ---- */
  D.plot = function (s) {
    var H = s.h || 320, L = 54, R = 16, T = 16, B = s.xlabel ? 48 : 36, pw = W - L - R, ph = H - T - B;
    var x0 = s.x[0], x1 = s.x[1], scope = s.params || {};
    var curves = (s.curves || []).map(function (c, i) {
      return { fn: c.fn, label: c.label, c: c.c || (i % 6) + 1, dash: c.dash, domain: c.domain, at: c.at, f: M.compile(M.parse(c.fn, { names: Object.keys(scope) }), { mode: 'rad', args: ['x'], scope: scope }) };
    });
    var y0, y1;
    if (s.y) { y0 = s.y[0]; y1 = s.y[1]; }
    else {
      var mn = Infinity, mx = -Infinity;
      curves.forEach(function (c) {
        var d = c.domain || [x0, x1];
        for (var i = 0; i <= 240; i++) { var v = c.f(d[0] + (d[1] - d[0]) * i / 240); if (isFinite(v)) { mn = Math.min(mn, v); mx = Math.max(mx, v); } }
      });
      (s.points || []).forEach(function (p) { mn = Math.min(mn, p.y); mx = Math.max(mx, p.y); });
      if (!isFinite(mn)) { mn = -1; mx = 1; }
      if (mn === mx) { mn -= 1; mx += 1; }
      var pad = (mx - mn) * 0.1; y0 = mn - pad; y1 = mx + pad;
      if (mn >= 0 && mn < (mx - mn) * 0.35) y0 = 0 - (mx - mn) * 0.04;
    }
    var sx = function (x) { return L + (x - x0) / (x1 - x0) * pw; }, sy = function (y) { return T + ph - (y - y0) / (y1 - y0) * ph; };
    var out = '<defs><clipPath id="clip__U__"><rect x="' + L + '" y="' + T + '" width="' + pw + '" height="' + ph + '"/></clipPath></defs>';
    var xt = ticks(x0, x1, 7), yt = ticks(y0, y1, 6), f4 = function (v) { return M.fmt(v, { sig: 4 }); };
    xt.forEach(function (v) { out += '<path class="grid" d="M' + r1(sx(v)) + ' ' + T + 'V' + (T + ph) + '"/>'; out += '<text x="' + r1(sx(v)) + '" y="' + (T + ph + 17) + '" class="tx tsm tm">' + f4(v) + '</text>'; });
    yt.forEach(function (v) { out += '<path class="grid" d="M' + L + ' ' + r1(sy(v)) + 'H' + (L + pw) + '"/>'; out += '<text x="' + (L - 7) + '" y="' + r1(sy(v) + 4) + '" class="tx tsm te">' + f4(v) + '</text>'; });
    out += '<rect x="' + L + '" y="' + T + '" width="' + pw + '" height="' + ph + '" class="nofill ln thin"/>';
    if (y0 < 0 && y1 > 0) out += '<path class="axis" d="M' + L + ' ' + r1(sy(0)) + 'H' + (L + pw) + '"/>';
    if (x0 < 0 && x1 > 0) out += '<path class="axis" d="M' + r1(sx(0)) + ' ' + T + 'V' + (T + ph) + '"/>';
    out += '<g clip-path="url(#clip__U__)">';
    if (s.shade) {
      var sc = curves[s.shade.curve || 0], a = s.shade.from, b = s.shade.to, base = s.shade.base == null ? 0 : s.shade.base;
      var pts = '', N = 120;
      for (var i = 0; i <= N; i++) { var xv = a + (b - a) * i / N, yv = sc.f(xv); if (isFinite(yv)) pts += r1(sx(xv)) + ',' + r1(sy(yv)) + ' '; }
      pts = r1(sx(a)) + ',' + r1(sy(base)) + ' ' + pts + r1(sx(b)) + ',' + r1(sy(base));
      out += '<polygon points="' + pts + '" class="sh' + (s.shade.c || sc.c) + '"/>';
    }
    (s.vlines || []).forEach(function (v) { out += '<path class="ln thin dash" d="M' + r1(sx(v.x)) + ' ' + T + 'V' + (T + ph) + '"/>'; });
    (s.hlines || []).forEach(function (v) { out += '<path class="ln thin dash" d="M' + L + ' ' + r1(sy(v.y)) + 'H' + (L + pw) + '"/>'; });
    curves.forEach(function (c) {
      var d = c.domain || [x0, x1], N = Math.max(200, Math.round(pw)), path = '', pen = false, prev = null, big = (y1 - y0) * 3;
      for (var i = 0; i <= N; i++) {
        var xv = d[0] + (d[1] - d[0]) * i / N, yv = c.f(xv);
        if (!isFinite(yv)) { pen = false; prev = null; continue; }
        if (prev !== null && Math.abs(yv - prev) > big) pen = false;
        path += (pen ? 'L' : 'M') + r1(sx(xv)) + ' ' + r1(sy(yv)); pen = true; prev = yv;
      }
      out += '<path class="ln' + c.c + (c.dash ? ' dash' : '') + '" d="' + path + '"/>';
    });
    out += '</g>';
    (s.vlines || []).forEach(function (v) { if (v.t) out += '<text x="' + r1(sx(v.x) + 4) + '" y="' + (T + 13) + '" class="tx tsm">' + esc(v.t) + '</text>'; });
    (s.hlines || []).forEach(function (v) { if (v.t) out += '<text x="' + (L + pw - 4) + '" y="' + r1(sy(v.y) - 5) + '" class="tx tsm te">' + esc(v.t) + '</text>'; });
    curves.forEach(function (c) {
      if (!c.label) return;
      var d = c.domain || [x0, x1], xv = d[0] + (d[1] - d[0]) * (c.at == null ? 0.82 : c.at), yv = c.f(xv);
      if (!isFinite(yv)) return;
      var px = sx(xv), py = Math.max(T + 12, Math.min(T + ph - 6, sy(yv) - 9)), w = measure(c.label, 13, 700);
      var anchor = px + w + 8 > W - 4 ? 'te' : '';
      out += '<text x="' + r1(anchor ? px - 6 : px + 6) + '" y="' + r1(py) + '" class="tx tc' + c.c + ' ' + anchor + '" style="font-size:13px">' + esc(c.label) + '</text>';
    });
    (s.points || []).forEach(function (p) {
      var c = p.c || 4;
      out += '<circle cx="' + r1(sx(p.x)) + '" cy="' + r1(sy(p.y)) + '" r="5" class="s' + c + '"/>';
      if (p.t) {
        var dx = p.dx == null ? 8 : p.dx, dy = p.dy == null ? -9 : p.dy, w = measure(p.t, 13, 700), px = sx(p.x) + dx, anchor = px + w > W - 4;
        out += '<text x="' + r1(anchor ? sx(p.x) - Math.abs(dx) : px) + '" y="' + r1(sy(p.y) + dy) + '" class="tx tc' + c + (anchor ? ' te' : '') + '" style="font-size:13px">' + esc(p.t) + '</text>';
      }
    });
    if (s.xlabel) out += '<text x="' + (L + pw / 2) + '" y="' + (H - 6) + '" class="tx tsm tm">' + esc(s.xlabel) + '</text>';
    if (s.ylabel) out += '<text transform="rotate(-90 14 ' + (T + ph / 2) + ')" x="14" y="' + (T + ph / 2) + '" class="tx tsm tm">' + esc(s.ylabel) + '</text>';
    return { body: out, h: H };
  };

  /* ---- bars: horizontal bar chart ---- */
  D.bars = function (s) {
    var items = s.items, mx = s.max || Math.max.apply(null, items.map(function (i) { return i.v; })), lw = 132, out = '', y = 10, bh = 24;
    items.forEach(function (it, i) {
      var c = it.c || s.c || (i % 5) + 1, w = Math.max(2, (it.v / mx) * (W - lw - 100));
      out += '<text x="' + (lw - 10) + '" y="' + (y + 17) + '" class="tx te">' + esc(it.l) + '</text>';
      out += '<rect x="' + lw + '" y="' + y + '" width="' + r1(w) + '" height="' + bh + '" rx="6" class="f' + c + '"/>';
      out += '<text x="' + r1(lw + w + 8) + '" y="' + (y + 17) + '" class="tx tsm">' + esc(it.t != null ? it.t : (M.fmt(it.v, { sig: 5 }) + (s.unit ? ' ' + s.unit : ''))) + '</text>';
      y += bh + 10;
    });
    return { body: out, h: y + 4 };
  };

  /* ---- compare: two panels side by side ---- */
  D.compare = function (s) {
    var pad = 14, cw = (W - 3 * pad) / 2, out = '', panels = [s.left, s.right], hs = [];
    var built = panels.map(function (p, k) {
      var ls = []; (p.items || []).forEach(function (t) { var w = wrap(t, cw - 34, 14, 500); ls.push(w); });
      var h = 48 + ls.reduce(function (a, w) { return a + w.length * 18 + 8; }, 0) + 8; hs.push(h);
      return { p: p, ls: ls, k: k };
    });
    var H = Math.max.apply(null, hs);
    built.forEach(function (b) {
      var x = pad + b.k * (cw + pad), c = b.p.c || (b.k === 0 ? 1 : 4);
      out += '<rect x="' + x + '" y="8" width="' + cw + '" height="' + (H - 8) + '" rx="12" class="f0"/>';
      out += '<rect x="' + x + '" y="8" width="' + cw + '" height="36" rx="12" class="f' + c + '"/>';
      out += '<text x="' + (x + cw / 2) + '" y="32" class="tx tm tlg" style="font-size:15px">' + esc(b.p.t) + '</text>';
      var y = 66;
      b.ls.forEach(function (w) {
        out += '<circle cx="' + (x + 16) + '" cy="' + (y - 5) + '" r="3" class="s' + c + '"/>';
        out += lines(x + 28, y, w, 'tx tn', 18); y += w.length * 18 + 8;
      });
    });
    return { body: out, h: H + 6 };
  };

  /* ---- scale: coloured number line with pins ---- */
  D.scale = function (s) {
    var H = s.h || 250, bx = 24, bw = W - 48, by = 112, bh = 38, out = '';
    var pos = function (m) { return m.p != null ? m.p : (m.v - s.min) / (s.max - s.min); };
    (s.segments || []).forEach(function (sg, i) {
      var a = (sg.p0 != null ? sg.p0 : (sg.from - s.min) / (s.max - s.min)), b = (sg.p1 != null ? sg.p1 : (sg.to - s.min) / (s.max - s.min));
      var x = bx + a * bw, w = (b - a) * bw, c = sg.c || (i % 5) + 1;
      out += '<rect x="' + r1(x) + '" y="' + by + '" width="' + r1(w) + '" height="' + bh + '" class="f' + c + '" rx="0"/>';
      if (sg.t && w > 36) { var L = wrap(sg.t, w - 6, 12, 700); out += lines(x + w / 2, by + bh / 2 + 4 - (L.length - 1) * 7, L, 'tx tm', 14).replace(/class="tx tm"/g, 'class="tx tm" style="font-size:12px"'); }
    });
    (s.ticks || []).forEach(function (v) {
      var x = bx + (v - s.min) / (s.max - s.min) * bw;
      out += '<path class="ln thin" d="M' + r1(x) + ' ' + (by + bh) + 'v6"/><text x="' + r1(x) + '" y="' + (by + bh + 20) + '" class="tx tsm tm">' + esc(M.fmt(v, { sig: 5 })) + '</text>';
    });
    (s.marks || []).forEach(function (m, i) {
      var x = bx + pos(m) * bw, lvl = m.lvl != null ? m.lvl : i % 4, up = lvl % 2 === 0, far = lvl > 1, c = m.c || 0;
      var len = far ? 56 : 24;
      var y1 = up ? by : by + bh + 24, y2 = up ? by - len : by + bh + 24 + len;
      out += '<path class="ln thin" d="M' + r1(x) + ' ' + y1 + 'V' + y2 + '"/><circle cx="' + r1(x) + '" cy="' + y2 + '" r="3.5" class="s' + (c || 0) + '"/>';
      var anchor = x < 70 ? '' : x > W - 70 ? 'te' : 'tm', tx = anchor === '' ? x - 4 : anchor === 'te' ? x + 4 : x;
      var L = wrap(m.t, 120, 12, 700);
      out += lines(tx, up ? y2 - 8 - (L.length - 1) * 14 : y2 + 18, L, 'tx ' + anchor, 14).replace(/class="tx /g, 'style="font-size:12px" class="tx ');
    });
    if (s.label) out += '<text x="' + (W / 2) + '" y="' + (H - 6) + '" class="tx tsm tm">' + esc(s.label) + '</text>';
    return { body: out, h: H };
  };

  /* ---- tree: left-to-right hierarchy ---- */
  D.tree = function (s) {
    var pad = 12;
    function depthOf(n) { return 1 + (n.kids && n.kids.length ? Math.max.apply(null, n.kids.map(depthOf)) : 0); }
    var depth = depthOf(s.root), colW = (W - 2 * pad) / depth, nw = colW - 28, leafH = 46, cur = 0, boxes = '', links = '';
    function layout(n, d, c) {
      n.d = d; n.c = n.c || c;
      n.L = wrap(n.t, nw - 10, 13, 700); n.h = n.L.length > 1 ? 14 + n.L.length * 16 : 30;
      if (n.kids && n.kids.length) {
        n.kids.forEach(function (k, i) { layout(k, d + 1, d === 0 ? ((i % 5) + 1) : n.c); });
        n.y = (n.kids[0].y + n.kids[n.kids.length - 1].y) / 2;
      } else { n.y = pad + cur * leafH + leafH / 2; cur++; }
      n.x = pad + d * colW;
    }
    layout(s.root, 0, 0);
    (function draw(n) {
      boxes += rect(n.x, n.y - n.h / 2, nw, n.h, n.c, 8);
      boxes += lines(n.x + nw / 2, n.y - (n.L.length - 1) * 8 + 4.5, n.L, 'tx tm', 16).replace(/class="tx tm"/g, 'class="tx tm" style="font-size:13px"');
      (n.kids || []).forEach(function (k) {
        var x1 = n.x + nw, x2 = k.x, xm = (x1 + x2) / 2;
        links += '<path class="ln thin" d="M' + r1(x1) + ' ' + r1(n.y) + 'H' + r1(xm) + 'V' + r1(k.y) + 'H' + r1(x2) + '"/>';
        draw(k);
      });
    })(s.root);
    return { body: links + boxes, h: pad * 2 + cur * leafH };
  };

  /* ---- grid: table / Punnett square ---- */
  D.grid = function (s) {
    var cells = s.cells, nr = cells.length, nc = cells[0].length, pad = 14, hasSide = !!s.side, sw = hasSide ? 64 : 0;
    var cw = Math.min(s.cw || 120, (W - 2 * pad - sw) / nc), ch = s.ch || 46, tw = sw + nc * cw, x0 = (W - tw) / 2, y0 = s.title ? 40 : 10, out = '';
    if (s.title) out += '<text x="' + W / 2 + '" y="26" class="tx tm tlg" style="font-size:15px">' + esc(s.title) + '</text>';
    var hh = s.head ? 38 : 0;
    if (s.head) s.head.forEach(function (t, j) { out += '<rect x="' + r1(x0 + sw + j * cw) + '" y="' + y0 + '" width="' + r1(cw) + '" height="' + hh + '" class="f0"/><text x="' + r1(x0 + sw + j * cw + cw / 2) + '" y="' + (y0 + 24) + '" class="tx tm">' + esc(t) + '</text>'; });
    cells.forEach(function (row, i) {
      var y = y0 + hh + i * ch;
      if (hasSide) out += '<rect x="' + r1(x0) + '" y="' + y + '" width="' + sw + '" height="' + ch + '" class="f0"/><text x="' + r1(x0 + sw / 2) + '" y="' + (y + ch / 2 + 5) + '" class="tx tm">' + esc(s.side[i]) + '</text>';
      row.forEach(function (t, j) {
        var c = (s.colors && s.colors[t]) || 0, L = wrap(t, cw - 10, 14, 700);
        out += '<rect x="' + r1(x0 + sw + j * cw) + '" y="' + y + '" width="' + r1(cw) + '" height="' + ch + '" class="f' + c + '"/>';
        out += lines(x0 + sw + j * cw + cw / 2, y + ch / 2 + 5 - (L.length - 1) * 8, L, 'tx tm', 16);
      });
    });
    return { body: out, h: y0 + hh + nr * ch + 10 };
  };

  /* ---- atom: Bohr model ---- */
  D.atom = function (s) {
    var H = 320, cx = 230, cy = H / 2, sh = s.shells || [], step = Math.min(36, (140 - 34) / Math.max(1, sh.length - 1 || 1)), out = '';
    if (sh.length === 1) step = 36;
    var nr = 22;
    sh.forEach(function (n, i) { var r = 46 + i * step; out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="ln thin nofill"/>'; });
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + nr + '" class="f4"/>';
    out += '<text x="' + cx + '" y="' + (cy - 1) + '" class="tx tm" style="font-size:12px">' + (s.p || 0) + 'p⁺</text><text x="' + cx + '" y="' + (cy + 13) + '" class="tx tm tsm">' + (s.n || 0) + 'n</text>';
    sh.forEach(function (n, i) {
      var r = 46 + i * step;
      for (var k = 0; k < n; k++) { var a = -Math.PI / 2 + k * 2 * Math.PI / n + i * 0.5; out += '<circle cx="' + r1(cx + r * Math.cos(a)) + '" cy="' + r1(cy + r * Math.sin(a)) + '" r="5.5" class="s1"/>'; }
    });
    var lx = 410;
    out += '<circle cx="' + lx + '" cy="120" r="8" class="f4"/><text x="' + (lx + 16) + '" y="125" class="tx">Proton (+)</text>';
    out += '<circle cx="' + lx + '" cy="150" r="8" class="f0"/><text x="' + (lx + 16) + '" y="155" class="tx">Neutron (0)</text>';
    out += '<circle cx="' + lx + '" cy="180" r="6" class="s1"/><text x="' + (lx + 16) + '" y="185" class="tx">Electron (−)</text>';
    if (s.label) out += '<text x="' + lx + '" y="90" class="tx tlg">' + esc(s.label) + '</text>';
    if (sh.length) out += '<text x="' + lx + '" y="215" class="tx tsm">Shells: ' + sh.join(', ') + '</text>';
    return { body: out, h: H };
  };

  /* ---- timeline ---- */
  D.timeline = function (s) {
    var ev = s.events.map(item), n = ev.length, H = s.h || 270, y0 = H / 2, x0 = 44, sp = n > 1 ? (W - 2 * x0) / (n - 1) : 0, out = '';
    out += '<path class="ln" d="M16 ' + y0 + 'H' + (W - 16) + '" marker-end="url(#ah)"/>';
    ev.forEach(function (e, i) {
      var x = x0 + i * sp, up = i % 2 === 0, c = e.c || (i % 5) + 1, maxw = Math.min(150, Math.max(90, sp * 1.8));
      var L = wrap(e.t, maxw, 13, 700), top = up ? y0 - 34 - L.length * 16 - (e.w ? 18 : 0) : y0 + 40;
      out += '<path class="ln thin" d="M' + r1(x) + ' ' + y0 + 'V' + (up ? y0 - 30 : y0 + 30) + '"/><circle cx="' + r1(x) + '" cy="' + y0 + '" r="7" class="s' + c + '"/>';
      var anchor = x < 70 ? '' : x > W - 70 ? 'te' : 'tm', tx = anchor === '' ? x - 20 : anchor === 'te' ? x + 20 : x;
      if (e.w) out += '<text x="' + r1(tx) + '" y="' + (up ? top + 12 : top - 4) + '" class="tx tsm ' + anchor + '">' + esc(e.w) + '</text>';
      out += lines(tx, (up ? top + (e.w ? 30 : 12) : top + (e.w ? 12 : 8)), L, 'tx ' + anchor, 16).replace(/class="tx /g, 'style="font-size:13px" class="tx ');
    });
    return { body: out, h: H };
  };

  var MK = ['', 1, 2, 3, 4, 5, 6];
  function defs() {
    return '<defs>' + MK.map(function (c) {
      return '<marker id="ah' + c + '__U__" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="mk' + c + '"/></marker>';
    }).join('') + '</defs>';
  }

  CLI.diagram = function (spec) {
    var uid = ++UID, body, h;
    if (spec.svg) { body = spec.svg; h = spec.h || 340; }
    else {
      var g = D[spec.type];
      if (!g) throw new Error('Unknown diagram type: ' + spec.type);
      var r = g(spec); body = r.body; h = r.h;
    }
    body = body.replace(/url\(#(ah[1-6]?)\)/g, function (m, id) { return 'url(#' + id + '__U__)'; });
    var svg = defs() + body;
    svg = svg.replace(/__U__/g, 'u' + uid);
    var alt = spec.alt || spec.caption || 'Diagram';
    return '<figure class="diagram"><svg class="d" viewBox="0 0 ' + W + ' ' + h + '" role="img" aria-label="' + esc(alt) + '" xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>' +
      (spec.caption ? '<figcaption>' + esc(spec.caption) + '</figcaption>' : '') + '</figure>';
  };
  CLI.diagramTypes = Object.keys(D).concat(['svg']);
  if (typeof module !== 'undefined' && module.exports) module.exports = CLI.diagram;
})(typeof window !== 'undefined' ? window : globalThis);
