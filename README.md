# CLI — Cognitive Learning Interface (expanded edition)

A responsive, local-first scientific learning workspace built with plain HTML, CSS and JavaScript. It uses no AI model, external AI API, remote database or paid service. All five systems run in the browser.

## Start locally
1. Extract the project folder.
2. Open `index.html` in a modern browser, or open the folder in VS Code and use Live Server.
3. No package installation or build step is required.

## Deploy to Vercel
Import the folder/repository as a static project. Leave the build command and output directory empty/default. `vercel.json` supplies the static fallback configuration.

## Project structure
- `index.html` — semantic application shell and module views.
- `styles.css` — design system, layouts, responsive states and dark theme.
- `app.js` — navigation, topic rendering, calculator parser, graph plotter, dictionary, formula search and local persistence.
- `content-library.js` — separately maintained offline learning topics, glossary and formula references.
- `favicon.svg` — replaceable temporary brand mark.
- `vercel.json` — static deployment configuration.

## Five connected systems
1. **Science library:** multi-subject topics across foundation, secondary, college and advanced levels; each entry includes a plain-language explanation, technical treatment, deeper context and key learning points.
2. **Arithmetic & logic:** scientific expression parser, degree/radian trigonometry, common functions, constants, factorials, Boolean logic and calculation history.
3. **Graphics system:** plots functions of `x` on a responsive Cartesian plane with adjustable bounds and example functions.
4. **Scientific vocabulary:** searchable glossary with formal definitions and plain-language explanations.
5. **Equations & formulae:** searchable subject-filtered reference with descriptions and copy actions.

## Content scope
The current offline content pack contains **106 learning topics, 126 unique glossary entries and 139 unique formula references** across physics, chemistry, biology, mathematics, computer science, earth science and statistics. Content is intentionally structured as a growing academic reference, not claimed to be an exhaustive substitute for textbooks, laboratory instruction, peer-reviewed sources or specialist review. Advanced and research-level material should be checked against authoritative course references before formal academic use.

## Privacy and storage
The application does not send calculations, searches or learning activity to a remote service. Theme and supported local preferences/history use browser local storage. Clearing browser storage removes those local preferences.

## Customisation
Replace `favicon.svg` with your own mark. The creator portfolio link is in the footer: https://ethel-devs-portfolio-new.vercel.app/

## Testing
Run `node --check app.js`. This checks JavaScript syntax, not every browser interaction. Manually test the calculator, graph controls, search/filter controls, navigation, copy buttons, theme persistence and phone/tablet layouts before public launch.

## Content integrity check
With Node.js installed, run `node tests/validate-content.cjs` from the project folder to validate the expanded content pack's structure and expected inventory.
