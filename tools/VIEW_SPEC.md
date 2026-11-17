# CLI view spec (for UI module authors)

Project root: `/mnt/user-data/outputs/cli-site` (a **static, dependency-free, offline** web app: plain HTML/CSS/JS, no build step, no CDN, no network calls, no frameworks, no ES modules — classic `<script>` files, ES2015+ allowed; must work when `index.html` is opened from disk).
`js/core.js` provides a hash router that mounts "views". You build ONE view (JS + CSS). **Edit only the files assigned to you.**

## Contract
```js
CLI.views.<name> = {
  mount(el, params) { /* build DOM inside el (empty <div class="wrap page">); params = {rest: ['a','b'], query:{}} */ },
  unmount() { /* remove document/window listeners, observers, timers, animation frames */ }
};
```
mount may be called many times; persistent state goes in `CLI.store`. Everything you add lives inside `el` (plus document/window listeners removed in unmount).

### Globals already loaded
* `CLI.math` (js/math.js — READ IT FIRST, reuse it, never write another parser): `parse(src,{names})`, `compile(ast,{mode:'deg'|'rad'|'grad', args:['x'], scope:{...}})` -> JS function (args positional), `evaluate(src,scope,mode)`, `freeVars(ast)`, `fmt(x,{mode:'norm'|'fix'|'sci',digits,sig})`, `toFraction(x,maxDen,tol)`, `num.{derivative,integrate,roots,extrema,polyRoots,solveLinear}`, `MathErr` (`.kind` 'syntax'|'math'|'var'). Syntax: implicit multiplication (`2x`, `2π`, `3(4+5)`), `^` right-assoc, postfix `! % °`, unclosed `(` auto-close, functions sin cos tan sec csc cot asin acos atan atan2 sinh cosh tanh asinh acosh atanh ln log(x[,base]) log2 exp sqrt cbrt root(x,n) abs sign floor ceil trunc round frac fact gamma nPr nCr min max gcd lcm hypot mod rand randint deg rad; constants `pi e tau`; unicode `× ÷ − √ π ² ³ θ`. `1/2π` = `1/(2π)` (Casio convention; mention in a short help note).
* `CLI.store.get(key, default)` / `.set(key, value)`, `CLI.toast(msg)`, `CLI.esc(s)`, `CLI.go(route, state)` (navigate, e.g. `CLI.go('graphics', {fn:'x^2', mode:'deg'})`), `CLI.takeHandoff(route)` (read+clear state sent to you), `CLI.tex(str)`, `CLI.diagram(spec)`.
* Theme: `<html data-theme="light|dark">`; CSS variables in `css/tokens.css` (`--bg --surface --surface-2 --surface-3 --text --muted --line --line-strong --accent --accent-ink --accent-soft --danger --ok --c1…--c6 --c1s…--c6s --radius --radius-sm --shadow --focus`). **Never hard-code colours.** On theme change the document fires `CustomEvent('cli:theme')` — redraw canvases then (read colours via getComputedStyle).
* Shared CSS in `css/styles.css` (read it): `.card`, `.btn` (`.primary`, `.ghost`, `.sm`), `.chip` (`aria-pressed`), `.chips`, `.tabs` + `.tab[aria-selected]`, `.badge`, `.row`, `.muted`, `.kbd`, `.page-head`, input/select/textarea styling, `.hidden`, `.sr-only`.
Your own CSS goes in your assigned CSS file with **every selector prefixed by your view's root class** (e.g. `.v-calc …`).

## Quality bar ("no flaws")
* **Responsive on all common screens**: 320 px phones (portrait + landscape), 360–430 px phones, 600–820 px tablets, 1024–1440 px laptops, >=1920 px desktops. No horizontal page scroll at any width, no overlapped/clipped controls, touch targets >= 44 px on touch devices, text >= 14 px. Use grid/flex + clamp(); the real site has a 60 px sticky header and, below 900 px, a fixed 58 px bottom tab bar (the page has bottom padding for it) and a footer.
* Mouse, touch and keyboard all work; aria-labels on icon buttons; visible focus; honour prefers-reduced-motion.
* Never throw: wrap user-input evaluation in try/catch; friendly inline errors (never `alert`). Never `innerHTML` with unescaped user text.
* TEST for real with Playwright (Chromium + `require('playwright')` are installed; do not reinstall): `node tools/view-page.js <viewName> <scratchDir>` writes a harness page; open via `file://`, drive the UI, check results numerically, check **no console errors**, screenshot at 360×740, 768×1024, 1280×800 (light and dark; keep screenshots in a scratch dir, not the project) and LOOK at them with the Read tool. Fix every flaw found. Run `node --check` on your JS.
