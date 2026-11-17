#!/usr/bin/env node
/* Render topic diagrams + formulas to PNG so you can LOOK at them (use the Read tool on the PNGs).
   Usage: node tools/preview.js <outDir> js/data/topics-x.js [more files...]
   Produces <outDir>/preview-1.png, preview-2.png ... (6 topics per image, light theme) and preview-dark.png (first 3 topics). */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const [out, ...files] = process.argv.slice(2);
if (!out || !files.length) { console.log('usage: node tools/preview.js <outDir> <data files...>'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const { chromium } = require('playwright');
const scripts = ['js/registry.js', 'js/math.js', 'js/tex.js', 'js/diagrams.js'].concat(files).map(f => path.resolve(root, f));

const html = `<!doctype html><html data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="file://${root}/css/tokens.css"><link rel="stylesheet" href="file://${root}/css/content.css">
<style>body{margin:0;padding:16px;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px;margin:0 0 18px;max-width:760px}
h3{margin:0 0 6px;font-size:15px}.meta{color:var(--muted);font-size:12px;margin-bottom:8px}.f{padding:4px 0;font-size:15px}.f small{color:var(--muted);font-size:12px;margin-left:8px}</style></head><body><div id="app"></div>
${scripts.map(s => `<script src="file://${s}"></script>`).join('\n')}
<script>
const app=document.getElementById('app');
const items=(CLI.topics||[]);
items.forEach((t,i)=>{
  const c=document.createElement('div');c.className='card';c.dataset.i=i;
  let h='<h3>'+t.title+'</h3><div class="meta">'+t.id+' · '+t.subject+' · '+t.level+'</div>';
  const hero=t.diagram||(t.diagrams&&t.diagrams[0]);
  try{h+=CLI.diagram(hero);}catch(e){h+='<pre style="color:red">'+e.message+'</pre>';}
  (t.sections||[]).forEach(s=>{if(s.diagram){try{h+='<div style="margin-top:10px">'+CLI.diagram(s.diagram)+'</div>';}catch(e){h+='<pre style="color:red">'+e.message+'</pre>';}}});
  (t.diagrams||[]).slice(1).forEach(d=>{try{h+='<div style="margin-top:10px">'+CLI.diagram(d)+'</div>';}catch(e){h+='<pre style="color:red">'+e.message+'</pre>';}});
  (t.formulas||[]).forEach(f=>{h+='<div class="f">'+CLI.tex(f.tex)+'<small>'+f.name+'</small></div>';});
  c.innerHTML=h;app.appendChild(c);
});
(CLI.formulas||[]).forEach((f,i)=>{const c=document.createElement('div');c.className='card';c.dataset.i='f'+i;c.innerHTML='<h3>'+f.name+'</h3><div class="f">'+CLI.tex(f.tex)+'</div>';app.appendChild(c);});
</script></body></html>`;
(async () => {
  const htmlPath = path.join(out, 'preview.html'); fs.writeFileSync(htmlPath, html);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 820, height: 900 }, deviceScaleFactor: 1 });
  const errors = []; p.on('pageerror', e => errors.push(e.message)); p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto('file://' + htmlPath); await p.waitForTimeout(300);
  const n = await p.$$eval('.card', els => els.length);
  for (let i = 0, k = 1; i < n; i += 6, k++) {
    const els = (await p.$$('.card')).slice(i, i + 6);
    const box0 = await els[0].boundingBox(), boxN = await els[els.length - 1].boundingBox();
    await p.screenshot({ path: path.join(out, `preview-${k}.png`), fullPage: true, clip: { x: 0, y: box0.y - 8, width: 800, height: boxN.y + boxN.height - box0.y + 16 } });
  }
  await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  const els = (await p.$$('.card')).slice(0, 3);
  if (els.length) { const a = await els[0].boundingBox(), z = await els[els.length - 1].boundingBox(); await p.screenshot({ path: path.join(out, 'preview-dark.png'), fullPage: true, clip: { x: 0, y: a.y - 8, width: 800, height: z.y + z.height - a.y + 16 } }); }
  console.log('cards:', n, ' errors:', errors.length ? errors.join(' | ') : 'none'); console.log('images in', out);
  await b.close();
})();
