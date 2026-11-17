# CLI: Cognitive Learning Interface

A fully offline, dependency-free science learning site. Plain HTML, CSS and JavaScript. No build step, no AI service, no external requests.

## Deploy on Vercel
1. Put this folder in a Git repository (or drag it into the Vercel dashboard).
2. Framework preset: **Other**. Build command: none. Output directory: the folder root.
3. Deploy. `vercel.json` and `.vercelignore` are already set up.

You can also open `index.html` directly from disk and everything works.

## Replace the logo and favicon
Replace `favicon.png` (a square PNG, 512 x 512 is ideal) with your own image, keeping the same file name. The header logo and the browser tab icon both use it.

## Update the dictionary after deployment
Edit `data/vocab-updates.json` and redeploy (or push to Git). Add entries to the `words` list:
```json
{ "version": 2, "words": [
  { "w": "Term", "pron": "TUR-m", "pos": "noun", "subj": "physics",
    "def": "Precise definition.", "simple": "Plain-words version.", "ex": "Example sentence." }
] }
```
`subj` is one of: physics, chemistry, biology, math, earth, computing. Visitors get new words the next time they open the site. Visitors can also add personal words that stay in their own browser.

## Adding lessons, formulas and constants
Content lives in `js/data/`. The author guide is in `tools/CONTENT_SPEC.md`. Run `node tools/validate.js js/data/*.js` to check any changes.
