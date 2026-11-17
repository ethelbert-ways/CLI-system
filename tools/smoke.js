/* Smoke test: loads every route at phone / desktop / dark-phone sizes, reports console errors + horizontal overflow, saves screenshots.
   Usage: node tools/smoke.js <outDir> [route1,route2,...] */
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const out = process.argv[2]; const routes = (process.argv[3] || '').split(',').filter(Boolean);
fs.mkdirSync(out, { recursive: true });
const R = routes.length ? routes : ['', 'science', 'science/physics', 'calculator', 'graphics', 'vocabulary', 'formulas/equations', 'formulas/constants', 'formulas/periodic', 'formulas/maps'];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vp, theme] of [['m', { width: 360, height: 740 }, 'light'], ['d', { width: 1280, height: 800 }, 'light'], ['dk', { width: 390, height: 800 }, 'dark']]) {
    const ctx = await b.newContext({ viewport: vp, hasTouch: name !== 'd', deviceScaleFactor: 1 }); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ' pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ' console: ' + m.text()); });
    await p.addInitScript(t => { try { localStorage.setItem('cli.theme', JSON.stringify(t)); } catch (e) {} }, theme);
    for (const r of R) {
      await p.goto('file://' + path.resolve(__dirname, '../index.html') + '#/' + r); await p.waitForTimeout(350);
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ov > 0) errs.push(`${name} /${r}: horizontal overflow ${ov}px`);
      await p.screenshot({ path: `${out}/${name}-${r.replace(/\//g, '_') || 'home'}.png`, fullPage: false });
    }
    await ctx.close();
  }
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
