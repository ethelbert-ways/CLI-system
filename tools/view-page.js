#!/usr/bin/env node
/* Usage: node tools/view-page.js <viewName> <outDir>
   Writes <outDir>/<viewName>.html that mounts CLI.views.<viewName> (js/<file>.js + css/<file>.css via the map below). */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const [view, out] = process.argv.slice(2);
if (!view || !out) { console.log('usage: node tools/view-page.js <viewName> <outDir>'); process.exit(2); }
const MAP = { calculator: ['calculator', ['js/calculator.js', 'js/logic.js', 'js/solver.js']], graphics: ['graph', ['js/graph.js']] };
const [cssName, jsList] = MAP[view] || [view, ['js/' + view + '.js']];
fs.mkdirSync(out, { recursive: true });
const scripts = ['js/registry.js', 'js/math.js', 'js/tex.js', 'js/diagrams.js'].concat(jsList).filter(f => fs.existsSync(path.join(root, f)));
const cssFiles = ['css/tokens.css', 'css/styles.css', 'css/content.css', 'css/' + cssName + '.css'].filter(f => fs.existsSync(path.join(root, f)));
const html = `<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${view} harness</title>${cssFiles.map(f => `<link rel="stylesheet" href="file://${root}/${f}">`).join('')}</head>
<body><div id="app"><div class="wrap page" id="view"></div></div>
${scripts.map(s => `<script src="file://${root}/${s}"></script>`).join('\n')}
<script>CLI.views.${view}.mount(document.getElementById('view'), {rest: [], query: {}});</script></body></html>`;
const p = path.join(out, view + '.html'); fs.writeFileSync(p, html); console.log(p);
