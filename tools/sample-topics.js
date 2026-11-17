/* Reference example of the topic format + one use of every diagram type. Not shipped with the site. */
CLI.addTopics([{
  id: 'sample-everything', subject: 'physics', level: 'hs',
  title: 'Sample: every diagram type',
  tagline: 'A reference topic used to test the diagram engine.',
  simple: 'This is a sample. **Bold words** matter and $E = mc^2$ is a formula inside a sentence.',
  analogy: 'Like a menu that shows every dish once.',
  sections: [
    { h: 'Flow', p: ['A paragraph of text with **bold** and $v = \\frac{d}{t}$.'], diagram: { type: 'flow', steps: [{ t: 'Sunlight', s: 'energy in' }, { t: 'Leaf', s: 'makes sugar' }, { t: 'Animal eats leaf' }, { t: 'Energy for moving' }, { t: 'Heat released' }], cols: 3, caption: 'A flow diagram (snake layout).' } },
    { h: 'Cycle', list: ['one', 'two'], diagram: { type: 'cycle', center: 'Water cycle', nodes: [{ t: 'Evaporation', s: 'sun heats water' }, { t: 'Condensation', s: 'clouds form' }, { t: 'Precipitation', s: 'rain and snow' }, { t: 'Collection', s: 'rivers and seas' }], caption: 'A cycle.' } },
    { h: 'Layers', steps: ['a', 'b'], diagram: { type: 'layers', layers: [{ t: 'Crust', s: '5–70 km thick, solid rock' }, { t: 'Mantle', s: 'hot, slowly flowing rock, 2,900 km thick' }, { t: 'Outer core', s: 'liquid iron and nickel' }, { t: 'Inner core', s: 'solid metal ball' }], caption: 'Layers.' } },
    { h: 'Plot', p: ['plot'], diagram: { type: 'plot', x: [-3, 3], curves: [{ fn: 'x^2', label: 'y = x²' }, { fn: '2x+1', label: 'y = 2x + 1', c: 4 }], points: [{ x: 1, y: 1, t: '(1, 1)' }], vlines: [{ x: 0, t: 'axis' }], xlabel: 'x', ylabel: 'y', caption: 'Plot with curves and a point.' } },
    { h: 'Plot shade', p: ['plot'], diagram: { type: 'plot', x: [0, 6.3], y: [-1.3, 1.3], curves: [{ fn: 'sin(x)', label: 'sin x', at: 0.7 }], shade: { from: 0, to: 3.14159 }, caption: 'Shaded area.' } },
    { h: 'Bars', p: ['bars'], diagram: { type: 'bars', items: [{ l: 'Mercury', v: 58 }, { l: 'Earth', v: 150 }, { l: 'Jupiter', v: 778 }], unit: 'million km', caption: 'Bars.' } },
    { h: 'Compare', p: ['compare'], diagram: { type: 'compare', left: { t: 'Mitosis', items: ['One division', 'Two identical cells', 'Used for growth and repair'] }, right: { t: 'Meiosis', items: ['Two divisions', 'Four different cells', 'Makes eggs and sperm'] }, caption: 'Compare.' } },
    { h: 'Scale', p: ['scale'], diagram: { type: 'scale', min: 0, max: 14, segments: [{ from: 0, to: 7, t: 'Acidic', c: 4 }, { from: 7, to: 14, t: 'Basic', c: 1 }], ticks: [0, 2, 4, 6, 7, 8, 10, 12, 14], marks: [{ v: 1, t: 'Stomach acid' }, { v: 7, t: 'Pure water' }, { v: 11, t: 'Soap' }, { v: 13, t: 'Bleach' }], label: 'pH scale', caption: 'Scale.' } },
    { h: 'Tree', p: ['tree'], diagram: { type: 'tree', root: { t: 'Living things', kids: [{ t: 'Animals', kids: [{ t: 'Mammals' }, { t: 'Birds' }] }, { t: 'Plants', kids: [{ t: 'Flowering' }, { t: 'Mosses and ferns' }] }, { t: 'Fungi' }] }, caption: 'Tree.' } },
    { h: 'Grid', p: ['grid'], diagram: { type: 'grid', title: 'Punnett square: Bb × Bb', head: ['B', 'b'], side: ['B', 'b'], cells: [['BB', 'Bb'], ['Bb', 'bb']], colors: { BB: 2, Bb: 2, bb: 4 }, caption: 'Grid.' } },
    { h: 'Atom', p: ['atom'], diagram: { type: 'atom', p: 6, n: 6, shells: [2, 4], label: 'Carbon-12', caption: 'Atom.' } },
    { h: 'Timeline', p: ['timeline'], diagram: { type: 'timeline', events: [{ w: '13.8 billion yrs ago', t: 'Big Bang' }, { w: '13.6 bya', t: 'First stars' }, { w: '4.6 bya', t: 'Earth forms' }, { w: '3.8 bya', t: 'First life' }, { w: 'Today', t: 'You are here' }], caption: 'Timeline.' } },
    { h: 'Raw svg', p: ['raw'], diagram: { svg: '<circle cx="150" cy="120" r="50" class="f1"/><path class="ln4" d="M210 120H420" marker-end="url(#ah4)"/><rect x="430" y="90" width="120" height="60" rx="10" class="f3"/><text x="490" y="126" class="tx tm">Raw SVG</text>', h: 240, caption: 'Raw svg (viewBox 600 wide).' } }
  ],
  diagram: { type: 'flow', steps: ['Start', 'Middle', 'End'], caption: 'Hero diagram.' },
  keywords: [{ w: 'Alpha', d: 'First.' }, { w: 'Beta', d: 'Second.' }, { w: 'Gamma', d: 'Third.' }, { w: 'Delta', d: 'Fourth.' }],
  formulas: [{ name: 'Quadratic formula', tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', note: 'Solves ax²+bx+c=0' }, { name: 'Water', tex: '2\\ce{H2} + \\ce{O2} \\to 2\\ce{H2O}' }, { name: 'Integral', tex: '\\int_0^{\\infty} e^{-x}\\,dx = 1' }, { name: 'Vector', tex: '\\vec{F} = m\\vec{a}, \\quad E_k = \\tfrac{1}{2}mv^2' }],
  key: ['a', 'b', 'c'],
  check: [{ q: 'Q1?', a: 'A1' }, { q: 'Q2?', a: 'A2' }, { q: 'Q3?', a: 'A3' }]
}]);
