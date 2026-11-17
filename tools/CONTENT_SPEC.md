# CLI content spec (for data authors)

Project root `/mnt/user-data/outputs/cli-site`. CLI = "Cognitive Learning Interface": a static, offline science learning site (no AI, no network, no external libraries).
Everything you write is a plain `.js` data file in `js/data/` that calls a registry function. **Edit only the files assigned to you.**

## Audience and voice
* Readers are anyone from **age 6–12 upward**, but the library covers **High School → College → Advanced/Graduate → PhD/Research**.
  Every topic is explained so a curious 10-year-old can follow the *idea*, yet it still contains **all the real criteria** a student at that level needs (definitions, mechanisms, laws, key equations, worked reasoning, limits; for PhD level also open questions / research frontiers).
* Short sentences. Define every technical word at first use. Use everyday analogies (kitchen, playground, football, phone, school bus). Never talk down; never hide the real science behind vagueness.
* **Accuracy is the top priority** (as of 2026; SI 2019 definitions; Pluto = dwarf planet; 118 elements). Say plainly when something is uncertain/debated. No invented numbers; say "about" when approximate. No emojis, no external URLs/images.
* In any string you may use `**bold**` and inline formulas `$...$` (mini-LaTeX). Nothing else (no HTML, no markdown lists inside strings).

## JS gotchas
* Plain script, no modules: `CLI.addTopics([ ... ]);` at top level.
* **Backslashes must be doubled** in normal quotes: `'\\frac{a}{b}'`, `'\\ce{H2O}'` (a single `\f \t \b \n \r` becomes a control character; the validator flags it). Escape apostrophes in single-quoted strings (`'Newton\'s'`) or use double quotes/backticks.

## Mini-LaTeX (`tex` fields and `$...$`)
`\\frac{a}{b}` `\\sqrt{x}` `\\sqrt[3]{x}` `x^2` `x_i` `x_i^2` `x^{n+1}` Greek `\\alpha \\beta \\Delta \\theta \\lambda \\mu \\pi \\rho \\sigma \\tau \\phi \\omega \\Omega …`
symbols `\\cdot \\times \\div \\pm \\to \\rightleftharpoons \\approx \\neq \\leq \\geq \\infty \\partial \\nabla \\hbar \\propto \\sum \\int \\oint \\prod \\Rightarrow \\degree`
accents `\\vec{F} \\hat{x} \\bar{x} \\dot{x} \\overline{AB}`, text `\\text{words}` `\\mathrm{m/s}` `\\mathbf{F}` `\\mathbb{R}` `\\binom{n}{k}` `\\left( … \\right)`, functions `\\sin \\cos \\tan \\ln \\log \\exp \\lim \\det \\max \\min`, spacing `\\,` `\\quad`.
Chemistry: `\\ce{H2SO4}`, `\\ce{SO4^{2-}}`, `\\ce{Fe^{3+}}`, `\\ce{CH4 + 2O2 -> CO2 + 2H2O}`, `\\ce{N2 + 3H2 <=> 2NH3}` (auto sub-scripts and arrows).

---
## 1. Topics — `CLI.addTopics([...])`
Subjects: `physics | chemistry | biology | math | earth | computing`. Levels: `hs | college | advanced | phd`.
```js
{
  id: 'newtons-laws',                 // kebab-case, unique across all files
  subject: 'physics', level: 'hs',
  title: 'Newton\'s Three Laws of Motion',
  tagline: 'Why things start moving, keep moving, speed up and stop.',   // <= 100 chars
  simple: '2–4 short sentences in the plainest words (age 6–12): the big idea.',
  analogy: 'One relatable comparison (optional, encouraged).',
  diagram: { ...spec },                // HERO diagram, required
  sections: [                          // 4–6 sections, in teaching order
    { h: 'Heading', p: ['paragraph', ...], list: ['bullet', ...], steps: ['numbered step', ...], diagram: { ...spec } },
    // each section needs at least one of p / list / steps; diagram optional (2–3 diagrams per topic in total)
  ],
  keywords: [ { w: 'Inertia', d: 'One-sentence kid-friendly definition.' }, ... ],   // 4–7
  formulas: [ { name: 'Second law', tex: 'F = m a', note: 'Force equals mass times acceleration.' } ],  // [] for none
  key: ['3–5 one-line takeaways'],
  check: [ { q: 'Question?', a: 'Answer + one-line reason.' }, ... ],   // 3–4 self-check Q&A
  fun: 'optional surprising true fact'
}
```
Length: **450–800 words** of section text (the validator counts). Order: *what is it → how it works → the rules/math → examples → limits / where it goes next*. Higher levels can be denser and use more math but keep the plain-language `simple` and analogies. PhD topics must include a section on **open questions / research frontier**.

## 2. Diagrams — every `diagram` field
`CLI.diagram(spec)` draws theme-aware SVG (light/dark). Canvas is **600 px wide**. Types:
| type | spec |
|---|---|
| `flow` | `{type:'flow', steps:['Text' or {t,s,c}], cols:3}` boxes + arrows (snake layout) |
| `cycle` | `{type:'cycle', nodes:[{t,s,c}], center:'Title', h:380}` 3–8 nodes round an ellipse |
| `layers` | `{type:'layers', layers:[{t,s,c}], reverse?:true}` stacked bands |
| `plot` | `{type:'plot', x:[min,max], y:[min,max]?, curves:[{fn:'sin(x)', label:'y = sin x', c:1, dash:false, domain:[a,b], at:0.8}], points:[{x,y,t,c,dx,dy}], vlines:[{x,t}], hlines:[{y,t}], shade:{curve:0,from,to,c}, xlabel, ylabel, params:{a:2}, h:320}` — `fn` uses CLI math syntax (`x^2`, `sin(x)`, `exp(-x)`, `sqrt(x)`, `ln(x)`, `abs(x)`, `a*x`); give each curve a different `at` so labels don't collide |
| `bars` | `{type:'bars', items:[{l,v,c,t?}], unit:'km', max?}` |
| `compare` | `{type:'compare', left:{t,c,items:[...]}, right:{t,c,items:[...]}}` |
| `scale` | `{type:'scale', min,max, segments:[{from,to,t,c}], ticks:[...], marks:[{v,t,c,lvl}], label}` (pH, EM spectrum…) |
| `tree` | `{type:'tree', root:{t, kids:[...]}}` depth <= 4, <= ~14 leaves |
| `grid` | `{type:'grid', title, head:[...], side:[...], cells:[[...]], colors:{AA:2}}` tables, Punnett squares |
| `atom` | `{type:'atom', p, n, shells:[2,8,1], label}` Bohr model |
| `timeline` | `{type:'timeline', events:[{w:'when', t:'what', c}]}` 3–7 events |
| raw | `{svg:'<circle …/>…', h:340, caption, alt}` your own SVG markup **inside a 600-wide viewBox**. Use for anything the generators can't draw (circuits, rays, waves, cells, DNA, orbits, force diagrams, molecules…) |
All specs accept `caption` (one line) and `alt` (screen-reader text; write one for raw svg). Colours `c`: 1 blue, 2 green, 3 amber, 4 rose, 5 violet, 6 teal.
**Raw SVG classes (no inline colours — they must work in dark mode):** `ln` (neutral 2px stroke, no fill) · `ln1…ln6` coloured strokes · `thin` · `thick` · `dash` · `nofill` · `f0` (neutral fill+border) · `f1…f6` (soft coloured fill + border) · `s0…s6` (solid fill) · `sh1…sh6` (translucent fill) · `grid` · `axis`; text: `tx` (14px bold) · `tm` (centre) · `te` (end) · `tsm` (small muted 12px) · `tlg` (17px) · `tn` (normal weight) · `ti` (italic) · `tc1…tc6` (coloured text) · `tw` (text on solid fill); arrows: `class="ln4" marker-end="url(#ah4)"` (`url(#ah)` neutral, `#ah1…#ah6` coloured). Never invent ids.
Text must fit the 600-px width at 14px (≈ 7.5 px per character): short labels, split long ones into several `<text>` lines. Prefer **teaching diagrams** (labelled parts, cause→effect arrows, values on axes) over decoration.

## 3. Vocabulary — `CLI.addVocab([...])`
```js
{ w: 'Photosynthesis', pron: 'foh-toh-SIN-thuh-sis', pos: 'noun', subj: 'biology',
  def: 'Precise scientific definition, 1–2 sentences.',
  simple: 'Same idea in plain words a 10-year-old gets, with an analogy.',
  ex: 'One example sentence using the word.',
  origin: 'Greek phōs "light" + synthesis "putting together"',   // optional (etymology)
  related: ['Chlorophyll', 'Respiration'] }                       // optional, exact `w` of other entries
```
Cover confusing/commonly misunderstood words, look-alikes (mitosis/meiosis, weight/mass, speed/velocity, element/compound, accuracy/precision), eponyms and names (Avogadro's number, Doppler effect, Krebs cycle), prefixes/units/instruments, particles, processes, classifications, math and computing terms, high school to research level. No duplicates (case-insensitive, across files).

## 4. Formulas — `CLI.addFormulas([...])`
```js
{ id: 'newton-second-law', subject: 'physics', topic: 'Mechanics', level: 'hs',
  name: 'Newton\'s second law', tex: 'F = m a',
  vars: { F: 'net force (N)', m: 'mass (kg)', a: 'acceleration (m/s²)' },   // keys = plain identifiers; units in trailing parentheses
  about: '1–2 sentences: when to use it, conditions.',
  solve: { F: 'm*a', m: 'F/a', a: 'F/m' } }    // optional "Try it" calculator: expression per solvable variable
```
`solve` uses CLI math syntax with the *other* variable names; trig in **radians**; numeric literals for constants (`6.674e-11`, mention in `about`). Include `solve` for every single algebraic equation; omit it for calculus/definition-only formulas. `topic` = sub-group label (Mechanics, Electricity, Stoichiometry, Genetics, Calculus…), keep spelling consistent.

## 5. Constants — `CLI.addConstants([...])`
`{ name: 'Speed of light in vacuum', tex: 'c', val: 299792458, unit: 'm/s', subj: 'physics', exact: true, note: 'optional' }` — CODATA 2022 / SI-2019 values; `val` a JS number (`6.62607015e-34`).

## 6. Periodic table — `CLI.addElements([...])` (118 entries)
`{ z: 6, sym: 'C', name: 'Carbon', mass: 12.011, cat: 'nonmetal', group: 14, period: 2, config: '[He] 2s² 2p²', state: 'solid', en: 2.55 }`
`cat`: `alkali | alkaline | transition | post-transition | metalloid | nonmetal | halogen | noble | lanthanide | actinide | unknown` (H is nonmetal; Z = 104–108 transition; Z = 109–118 `unknown`; Lu and Lr count as lanthanide/actinide). `group` 1–18, and **`null` for La–Lu (57–71) and Ac–Lr (89–103)** (the UI draws them in separate f-block rows). `state` at room temperature: solid | liquid | gas | unknown. `en` = Pauling electronegativity or `null`. `mass` = standard atomic weight (conventional); for no stable isotope the mass number of the longest-lived isotope. `config` with noble-gas core and Unicode superscripts; get the known exceptions right (Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, La, Ce, Gd, Pt, Au, Ac, Th, Pa, U, Np, Cm, Lr).

## 7. Branch maps — `CLI.addBranches([...])`
`{ subject: 'physics', tree: { t: 'Physics', kids: [ { t: 'Classical Mechanics', kids: ['Kinematics', 'Dynamics', {t:'Statics'}] }, … ] } }` — structural map of all subdivisions (branches → sub-branches → topics; depth <= 4; 45–70 nodes per subject; high school to research frontiers). Kids are strings or `{t,kids}`.

---
## Tools (run from the project root)
* `node tools/validate.js js/data/<file>.js [...]` — schema + tex + diagram checks. **Must end `OK — 0 errors`.**
* `node tools/preview.js <scratchDir> js/data/<file>.js` — renders each topic's diagrams + formulas to `<scratchDir>/preview-N.png` (+ `preview-dark.png`). **Open the PNGs with the Read tool and look**: fix overlapping labels, clipped text, empty areas, wrong science in a picture; max two rounds per file. Keep scratch output outside the project.
* `tools/sample-topics.js` shows one example of every diagram type and the topic format.
