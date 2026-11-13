/* CLI — local-first learning tools. No AI or remote API calls are used. */
'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const state = { view: 'overview', angle: 'DEG', subject: 'All subjects', selectedTerm: null, selectedTopic: null };
function storageGet(key, fallback = null) { try { const value = localStorage.getItem(key); return value === null ? fallback : value; } catch { return fallback; } }
function storageSet(key, value) { try { localStorage.setItem(key, value); } catch { /* Storage may be disabled; the app still works for this session. */ } }
function storageRemove(key) { try { localStorage.removeItem(key); } catch { /* Storage may be disabled. */ } }

const scienceTopics = [
  {
    id: 'measurement', subject: 'Physics', title: 'Scientific measurement and SI units', level: 'foundation', duration: '10 min',
    summary: 'Learn why measurements need units, how the SI system is organised and how prefixes express very large or very small quantities.',
    simple: 'A number by itself does not always tell us enough. Saying “the table is 2” is unclear. Saying “the table is 2 metres long” gives the number and the unit, so the measurement has a clear meaning.',
    explanation: 'A physical measurement is expressed as a numerical value multiplied by a unit. The International System of Units (SI) defines seven base units: metre (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol) and candela (cd). Many other units are derived from these. For example, speed is measured in metres per second (m/s), while force is measured in newtons (N), equivalent to kg·m/s².',
    deeper: 'Measurements have resolution, uncertainty and significant figures. Accuracy describes closeness to an accepted reference value; precision describes the agreement among repeated measurements. Prefixes such as kilo (10³), milli (10⁻³), micro (10⁻⁶) and nano (10⁻⁹) make it easier to express values across many scales. Dimensional analysis can be used to check whether an equation is dimensionally consistent.',
    points: ['Always include a unit with a measured quantity.', 'The kilogram is the SI base unit of mass.', 'Derived units can be expressed using SI base units.', 'A measured value should be considered together with its uncertainty.'],
    diagram: 'motion'
  },
  {
    id: 'motion', subject: 'Physics', title: 'Motion and its description', level: 'secondary', duration: '12 min',
    summary: 'Describe how an object changes position over time using distance, displacement, speed, velocity and acceleration.',
    simple: 'Imagine watching a bicycle move along a road. Motion is simply a change in the bicycle’s position as time passes. We can describe how far it travels, which direction it moves and whether it speeds up or slows down.',
    explanation: 'In physics, motion is described relative to a reference point. <strong>Distance</strong> is the total length of the path travelled, while <strong>displacement</strong> is the straight-line change from the starting position to the final position, including direction. <strong>Speed</strong> measures distance travelled per unit time. <strong>Velocity</strong> measures displacement per unit time, so it includes direction. <strong>Acceleration</strong> describes the rate at which velocity changes.',
    deeper: 'For constant velocity, displacement is proportional to elapsed time. For constant acceleration, the kinematic equations connect initial velocity (u), final velocity (v), acceleration (a), displacement (s) and time (t): v = u + at; s = ut + ½at²; v² = u² + 2as. These equations assume motion along a straight line with constant acceleration. In more advanced mechanics, motion is represented with vector functions and derivatives, where velocity is the time derivative of position and acceleration is the time derivative of velocity.',
    points: ['A reference point is needed before motion can be described.', 'Distance is a scalar; displacement is a vector.', 'Speed and velocity have units such as metres per second (m/s).', 'Acceleration is measured in metres per second squared (m/s²).'],
    diagram: 'motion'
  },
  {
    id: 'newton-laws', subject: 'Physics', title: 'Newton’s laws of motion', level: 'secondary', duration: '14 min',
    summary: 'Understand inertia, the relationship between force and acceleration, and why forces occur in pairs.',
    simple: 'Think about pushing an empty shopping trolley and then pushing a loaded one. The empty trolley changes its motion more easily. Newton’s laws help explain why objects keep moving, why pushes change motion and why interactions involve two objects.',
    explanation: '<strong>First law — inertia:</strong> an object remains at rest or continues moving at constant velocity unless acted on by a resultant external force. <strong>Second law:</strong> the resultant force equals the rate of change of momentum; for constant mass, this becomes F = ma. <strong>Third law:</strong> when object A exerts a force on object B, object B exerts an equal-magnitude force in the opposite direction on object A. The paired forces act on different objects.',
    deeper: 'The first law identifies inertial frames of reference. The second law in its general form is F = dp/dt, where p = mv is momentum. The familiar F = ma follows when mass is constant. Newton’s third-law pairs do not cancel each other on one free-body diagram because they act on separate bodies. Correctly identifying the system under study is essential when analysing forces.',
    points: ['Resultant force is the vector sum of all forces on the chosen object.', 'Mass measures inertia; weight is the gravitational force on a body.', 'For constant mass, a larger net force produces a larger acceleration.', 'Action–reaction forces act on different objects.'],
    diagram: 'forces'
  },
  {
    id: 'energy', subject: 'Physics', title: 'Work, energy and power', level: 'college', duration: '13 min',
    summary: 'Explore how forces transfer energy, how energy is stored and transferred, and how quickly work is done.',
    simple: 'When you lift a book onto a shelf, you transfer energy to it. When you lift the same book quickly, you may use the same amount of work but do it in less time. Physics gives these ideas precise meanings.',
    explanation: '<strong>Work</strong> is energy transferred when a force causes displacement. For a constant force, W = Fs cos θ, where θ is the angle between force and displacement. <strong>Kinetic energy</strong> is energy associated with motion: Ek = ½mv². Near Earth’s surface, gravitational potential energy relative to a chosen level is Ep = mgh. <strong>Power</strong> is the rate of doing work or transferring energy: P = W/t.',
    deeper: 'The work–energy theorem states that the net work done on a particle equals its change in kinetic energy. In a system where only conservative forces do work, mechanical energy (kinetic plus potential) is conserved. Real systems may transfer energy to thermal stores through friction or other dissipative effects. The SI unit of work and energy is the joule (J); power is measured in watts (W).',
    points: ['Work is measured in joules (J).', 'No displacement means no mechanical work by that force.', 'Kinetic energy depends on the square of speed.', 'Power is measured in watts (W), where 1 W = 1 J/s.'],
    diagram: 'energy'
  },
  {
    id: 'atomic-structure', subject: 'Chemistry', title: 'Atomic structure', level: 'secondary', duration: '15 min',
    summary: 'Learn how protons, neutrons and electrons are arranged and how atomic number and mass number are defined.',
    simple: 'An atom is an extremely tiny building block of ordinary matter. Picture a tiny central nucleus with electrons occupying regions around it. The nucleus contains protons and usually neutrons.',
    explanation: 'A <strong>proton</strong> has a positive electric charge, a <strong>neutron</strong> has no net electric charge, and an <strong>electron</strong> has a negative charge. Almost all the mass of an atom is concentrated in its nucleus. The <strong>atomic number</strong> (Z) is the number of protons. The <strong>mass number</strong> (A) is the total number of protons and neutrons. A neutral atom has equal numbers of protons and electrons.',
    deeper: 'Atoms of the same element share the same proton number. Isotopes are atoms of the same element with different neutron numbers. Electrons are described by quantum-mechanical orbitals rather than classical circular paths. Electron configurations help explain chemical behaviour and periodic trends. Nuclear stability depends on the balance of nuclear forces and electrostatic repulsion among protons.',
    points: ['Proton: charge +1; neutron: charge 0; electron: charge −1 (in elementary-charge units).', 'Atomic number identifies the element.', 'Isotopes have the same number of protons but different numbers of neutrons.', 'A common symbol is ᴬ_ZX, where X is the element symbol.'],
    diagram: 'atom'
  },
  {
    id: 'bonding', subject: 'Chemistry', title: 'Chemical bonding', level: 'secondary', duration: '14 min',
    summary: 'Compare ionic, covalent and metallic bonding by looking at how particles interact.',
    simple: 'Atoms can join together because the arrangement of their electrons and nuclei can become more stable. A chemical bond is an attractive interaction that holds particles together.',
    explanation: '<strong>Ionic bonding</strong> involves electrostatic attraction between oppositely charged ions, commonly formed after electron transfer. <strong>Covalent bonding</strong> involves shared pairs of electrons between atoms. <strong>Metallic bonding</strong> is the attraction between positive metal ions and delocalised electrons. The type of bonding influences melting point, electrical conductivity, hardness and solubility.',
    deeper: 'Ionic solids form extended lattices; their high melting points reflect strong electrostatic attractions throughout the lattice. Covalent bonding can produce discrete molecules or giant covalent networks such as diamond and silicon dioxide. Metallic bonding is non-directional, allowing layers of metal ions to move while remaining attracted to the delocalised electron cloud. Real bonding can have mixed ionic and covalent character.',
    points: ['Ionic bonding: attraction between positive and negative ions.', 'Covalent bonding: shared electron pairs.', 'Metallic bonding: positive metal ions attracted to delocalised electrons.', 'Structure as well as bonding determines a substance’s properties.'],
    diagram: 'bonding'
  },
  {
    id: 'reaction-rates', subject: 'Chemistry', title: 'Rates of chemical reaction', level: 'college', duration: '16 min',
    summary: 'Explain how concentration, temperature, surface area and catalysts influence reaction rate.',
    simple: 'Imagine people trying to shake hands in a room. If more people are in the same space, handshakes may happen more often. Particles in a chemical reaction also need successful encounters before products can form.',
    explanation: 'Reaction rate measures how quickly reactants are used up or products are formed. Collision theory states that reacting particles must collide with sufficient energy and a suitable orientation. Increasing concentration or gas pressure generally increases collision frequency. Increasing temperature raises particle kinetic energy and the fraction of collisions with energy at least equal to the activation energy. Increasing the surface area of a solid reactant exposes more particles. A catalyst provides an alternative pathway with a lower activation energy and is regenerated overall.',
    deeper: 'For a reaction aA + bB → products, a rate expression may be written rate = k[A]^m[B]^n, where k is the rate constant and m and n are experimentally determined reaction orders. The overall order is m+n. Reaction mechanisms and the rate-determining step explain why observed orders need not match stoichiometric coefficients. Temperature dependence is often modelled with the Arrhenius equation k = A exp(−Ea/RT).',
    points: ['Rate can be measured as change in concentration per unit time.', 'A catalyst changes reaction pathway, not the overall equilibrium position.', 'Activation energy is the minimum energy threshold in the collision model.', 'Reaction order is determined experimentally.'],
    diagram: 'reaction'
  },
  {
    id: 'cell-structure', subject: 'Biology', title: 'Cell structure and function', level: 'secondary', duration: '14 min',
    summary: 'Identify major cell structures and connect each organelle with its role.',
    simple: 'A cell is a basic unit of life. Think of it as a tiny organised workspace: different parts do different jobs, and the cell membrane controls what enters and leaves.',
    explanation: 'The <strong>cell membrane</strong> forms a selectively permeable boundary. The <strong>cytoplasm</strong> is where many reactions occur. In eukaryotic cells, the <strong>nucleus</strong> contains most of the genetic material. <strong>Mitochondria</strong> are important sites of aerobic respiration and ATP production. Plant cells typically also contain a cellulose cell wall, a large permanent vacuole and chloroplasts for photosynthesis.',
    deeper: 'Cell structure is linked to function through compartmentalisation. Membrane-bound organelles maintain specialised chemical environments. Ribosomes translate messenger RNA into polypeptides. The endoplasmic reticulum and Golgi apparatus help process and transport proteins and lipids. Prokaryotic cells lack a membrane-bound nucleus and generally have a simpler internal organisation.',
    points: ['All cells have a cell membrane, cytoplasm and genetic material.', 'Eukaryotic cells contain a membrane-bound nucleus.', 'Plant cells have structures such as a cellulose cell wall and chloroplasts.', 'Ribosomes are the sites of protein synthesis.'],
    diagram: 'cell'
  },
  {
    id: 'photosynthesis', subject: 'Biology', title: 'Photosynthesis', level: 'secondary', duration: '12 min',
    summary: 'Understand how light energy is converted into chemical energy stored in organic molecules.',
    simple: 'Green plants use energy from sunlight to help make sugars from water and carbon dioxide. The sugar stores chemical energy that the plant can use to grow and carry out life processes.',
    explanation: 'The overall simplified equation is 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂, with light energy and chlorophyll involved. Photosynthesis takes place in chloroplasts. Light-dependent reactions use light energy to produce ATP and reduced electron carriers, while the Calvin cycle uses these products to help fix carbon dioxide into carbohydrate molecules.',
    deeper: 'The light-dependent reactions occur in the thylakoid membranes and include photosystem II, an electron transport chain, and photosystem I. Water is oxidised, releasing oxygen. A proton gradient drives ATP synthesis. In the Calvin cycle, the enzyme RuBisCO catalyses carbon fixation. The rate of photosynthesis can be limited by light intensity, carbon dioxide concentration or temperature, depending on conditions.',
    points: ['Chlorophyll absorbs light energy.', 'Carbon dioxide supplies carbon for carbohydrate synthesis.', 'Oxygen released comes from the splitting of water.', 'Light, CO₂ and temperature can limit the rate.'],
    diagram: 'photosynthesis'
  },
  {
    id: 'functions', subject: 'Mathematics', title: 'Functions and mappings', level: 'college', duration: '13 min',
    summary: 'Treat a function as a rule that maps each permitted input to exactly one output.',
    simple: 'Imagine a machine that takes a number, follows a fixed rule and gives back an answer. If the rule is “multiply by 2”, putting in 3 gives 6. A function is a precise version of that input-output idea.',
    explanation: 'A function f maps each element of its domain to exactly one element of its codomain. We write y = f(x). The <strong>domain</strong> is the set of allowed inputs, the <strong>codomain</strong> is the declared target set, and the <strong>range</strong> is the set of outputs actually produced. A function can be represented by a formula, table, graph or mapping diagram.',
    deeper: 'A function is injective if distinct inputs produce distinct outputs, surjective if every element of the codomain is attained, and bijective if it is both. A bijection has an inverse function. Composite functions are formed by applying one function after another: (g ∘ f)(x) = g(f(x)), where the output of f lies in the domain of g. Domain restrictions are essential when working with rational, logarithmic and even-root expressions.',
    points: ['Every input in the domain has exactly one output.', 'The range is a subset of the codomain.', 'A vertical line test checks whether a plotted curve represents y as a function of x.', 'An inverse function exists on the full domain when the function is bijective.'],
    diagram: 'function'
  },
  {
    id: 'derivatives', subject: 'Mathematics', title: 'Differentiation and derivatives', level: 'advanced', duration: '18 min',
    summary: 'Interpret a derivative as an instantaneous rate of change and the slope of a tangent line.',
    simple: 'If a car’s position changes over time, its average speed describes a whole time interval. Its speed at one exact instant is an instantaneous rate. Differentiation gives mathematics a way to describe that instant.',
    explanation: 'The derivative of y = f(x) describes how quickly f changes as x changes. It is defined by the limit f′(x) = lim(h→0)[f(x+h) − f(x)]/h, when the limit exists. Geometrically, f′(a) is the gradient of the tangent to the curve at x = a. For example, if f(x) = x², then f′(x) = 2x.',
    deeper: 'Differentiability at a point implies continuity there, but continuity does not guarantee differentiability. Common rules include the power rule, product rule, quotient rule and chain rule. Higher derivatives describe further rates of change; in mechanics, the derivative of position is velocity and the derivative of velocity is acceleration. Differentiation is also central to optimisation, modelling and differential equations.',
    points: ['The derivative is a limit of average rates of change.', 'At a differentiable point, it gives the tangent gradient.', 'The power rule: d(xⁿ)/dx = nxⁿ⁻¹.', 'A function can be continuous but not differentiable at a sharp corner.'],
    diagram: 'derivative'
  },
  {
    id: 'quantum-states', subject: 'Physics', title: 'Quantum states and observables', level: 'graduate', duration: '20 min',
    summary: 'An introduction to state vectors, probability amplitudes, operators and the meaning of measurement in quantum theory.',
    simple: 'At very small scales, physics does not usually predict one definite result for every measurement in advance. Instead, the mathematical state of a system lets us calculate the probabilities of different possible outcomes.',
    explanation: 'In the standard mathematical formulation, a pure quantum state is represented by a normalised vector |ψ⟩ in a complex Hilbert space. A measurable physical quantity is represented by a self-adjoint operator. The possible measurement outcomes are associated with the operator’s eigenvalues. The Born rule connects the state’s probability amplitudes to the probabilities of measurement outcomes.',
    deeper: 'For an observable A with spectral projectors Pᵢ, the probability of outcome aᵢ in state |ψ⟩ is ⟨ψ|Pᵢ|ψ⟩. The expectation value is ⟨A⟩ = ⟨ψ|A|ψ⟩ for a normalised state when the relevant expectation exists. Unitary evolution is generated by the Hamiltonian through the Schrödinger equation. This short overview omits important mathematical and interpretive subtleties; a full treatment requires linear algebra, complex analysis and differential equations.',
    points: ['A quantum state encodes the information used to predict measurement probabilities.', 'Observables are represented by self-adjoint operators.', 'The Born rule converts probability amplitudes into probabilities.', 'The Hamiltonian represents the total energy observable in the usual formulation.'],
    diagram: 'atom'
  },
  {
    id: 'binary', subject: 'Computer Science', title: 'Binary numbers and data', level: 'college', duration: '12 min',
    summary: 'Understand why digital systems use two-state representations and how binary place values work.',
    simple: 'A computer stores and processes information using tiny electronic states that can be represented as 0 and 1. A bit is one binary digit. Groups of bits can represent numbers, letters, images and instructions.',
    explanation: 'Binary is a base-2 positional number system. Each place represents a power of two: from right to left, 2⁰, 2¹, 2², and so on. For example, 1011₂ = 1×8 + 0×4 + 1×2 + 1×1 = 11₁₀. Eight bits make one byte. Text and other data are encoded through defined conventions that assign bit patterns to symbols or values.',
    deeper: 'Digital hardware uses voltage ranges to distinguish logical states, not perfectly ideal abstract values. Unsigned n-bit binary represents integers from 0 to 2ⁿ−1. Two’s-complement representation is commonly used for signed integers. Floating-point formats represent a sign, exponent and significand, introducing finite precision and rounding behaviour.',
    points: ['Binary uses only the digits 0 and 1.', 'Each binary position is a power of two.', 'A bit is one binary digit; a byte is commonly eight bits.', 'Representation rules determine how a bit pattern is interpreted.'],
    diagram: 'binary'
  }
];

const vocabulary = [
  ['Acceleration','Physics','The rate at which velocity changes with time. It is a vector quantity and is commonly measured in metres per second squared (m/s²).','A vehicle accelerating is changing its velocity; that can mean speeding up, slowing down or changing direction.'],
  ['Activation energy','Chemistry','The minimum energy threshold that reacting particles must overcome for a reaction event to occur in the collision-theory model.','It is like a small energy hill that reacting particles must get over.'],
  ['Atom','Chemistry','The smallest unit of an element that retains the chemical identity of that element. It contains a nucleus and electrons.','Atoms are tiny building blocks that make up ordinary matter.'],
  ['Catalyst','Chemistry','A substance that increases the rate of a chemical reaction by providing an alternative reaction pathway and is regenerated overall.','A catalyst helps a reaction happen faster without being used up overall.'],
  ['Cell','Biology','The basic structural and functional unit of living organisms. Cells carry out processes necessary for life.','A cell is a tiny living unit that performs jobs needed to keep an organism alive.'],
  ['Covalent bond','Chemistry','A chemical bond involving a shared pair or pairs of electrons between atoms.','Two atoms share electrons as part of the attraction holding them together.'],
  ['Displacement','Physics','The change in position of an object, expressed as a vector from initial to final position.','It tells you how far and in which direction the final position is from the start.'],
  ['Derivative','Mathematics','The limit of the difference quotient, when it exists; it gives the instantaneous rate of change of a function.','It tells us how quickly something is changing at one exact input.'],
  ['Diffusion','Biology','The net movement of particles from a region of higher concentration to a region of lower concentration due to random motion.','Particles spread out from crowded regions toward less crowded regions.'],
  ['Enzyme','Biology','A biological catalyst, usually a protein or RNA molecule, that increases the rate of a biochemical reaction.','An enzyme helps a particular reaction happen faster in a living thing.'],
  ['Equilibrium','Chemistry','A state in a reversible reaction where forward and reverse reaction rates are equal, so concentrations remain constant at fixed conditions.','Both directions continue, but at equal rates, so the amounts stay steady.'],
  ['Force','Physics','An interaction that can change an object’s momentum; it is a vector quantity measured in newtons (N).','A push or pull that can change how an object moves.'],
  ['Inertia','Physics','The tendency of an object to resist changes in its state of motion; in classical mechanics it is related to mass.','An object does not change its motion by itself; it resists a change.'],
  ['Isotope','Chemistry','Atoms of the same element with the same number of protons but different numbers of neutrons.','They are atoms of one element with different neutron counts.'],
  ['Kinetic energy','Physics','Energy associated with motion. For a non-relativistic object of mass m moving at speed v, it is ½mv².','Moving objects have kinetic energy.'],
  ['Molecule','Chemistry','An electrically neutral group of two or more atoms held together by chemical bonds, acting as a discrete unit.','A molecule is a group of atoms joined together.'],
  ['Osmosis','Biology','The net movement of water across a selectively permeable membrane from higher water potential to lower water potential.','Water moves through a special membrane toward the side with lower water potential.'],
  ['Photosynthesis','Biology','A process by which organisms convert light energy into chemical energy, commonly using carbon dioxide and water to form organic compounds.','Plants use light energy to make energy-rich food molecules.'],
  ['Scalar','Physics','A physical quantity described by magnitude only, without direction.','A scalar tells you an amount but not a direction, such as mass or temperature.'],
  ['Velocity','Physics','The rate of change of displacement with time; velocity has both magnitude and direction.','Velocity tells you how quickly something changes position and in which direction.']
].map(([term, subject, definition, simple]) => ({term, subject, definition, simple}));

const formulas = [
  ['Physics','Average speed','speed = distance / time','Total path length divided by elapsed time.','distance · time'],
  ['Physics','Velocity','v = displacement / time','Average velocity is displacement divided by elapsed time.','displacement · time'],
  ['Physics','Acceleration','a = (v − u) / t','Change in velocity divided by elapsed time for average acceleration.','v · u · t'],
  ['Physics','Newton’s second law','F = ma','For constant mass, resultant force equals mass multiplied by acceleration.','force · mass · acceleration'],
  ['Physics','Weight','W = mg','Gravitational force near a planetary surface; g is gravitational field strength.','weight · mass · g'],
  ['Physics','Kinetic energy','Eₖ = ½mv²','Energy associated with the motion of an object at non-relativistic speeds.','energy · mass · velocity'],
  ['Physics','Gravitational potential energy','Eₚ = mgh','Change in gravitational potential energy near a uniform gravitational field.','energy · mass · height'],
  ['Physics','Work done','W = Fs cos θ','Work done by a constant force over a displacement.','work · force · displacement'],
  ['Physics','Electrical power','P = VI','Power transferred in an electrical component; V is potential difference and I is current.','power · voltage · current'],
  ['Mathematics','Quadratic formula','x = (−b ± √(b² − 4ac)) / 2a','Solutions of ax² + bx + c = 0, where a ≠ 0.','roots · coefficients · discriminant'],
  ['Mathematics','Pythagorean theorem','a² + b² = c²','For a right-angled triangle, c is the hypotenuse.','right triangle · sides'],
  ['Mathematics','Circle area','A = πr²','Area of a circle with radius r.','area · radius · pi'],
  ['Mathematics','Derivative of a power','d(xⁿ)/dx = nxⁿ⁻¹','Power rule for differentiation with respect to x.','derivative · power · variable'],
  ['Chemistry','Density','ρ = m / V','Mass per unit volume.','density · mass · volume'],
  ['Chemistry','Moles','n = m / M','Amount of substance equals sample mass divided by molar mass.','moles · mass · molar mass'],
  ['Chemistry','Concentration','c = n / V','Amount of solute, in moles, per volume of solution.','concentration · moles · volume'],
  ['Chemistry','Ideal gas equation','pV = nRT','Relates pressure, volume, amount, temperature and the gas constant for an ideal gas.','pressure · volume · temperature'],
  ['Chemistry','Arrhenius equation','k = A e^(−Eₐ/RT)','Describes the temperature dependence of a reaction rate constant in the Arrhenius model.','rate constant · activation energy · temperature'],
  ['Biology','Magnification','magnification = image size / actual size','Ratio of image size to actual specimen size; units must match.','image · actual size'],
  ['Biology','Photosynthesis (summary)','6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂','Simplified overall equation for oxygenic photosynthesis, with light energy.','carbon dioxide · water · glucose · oxygen']
].map(([category, title, expression, description, symbols]) => ({category, title, expression, description, symbols: symbols.split(' · ')}));

/* Merge the separately maintained expanded content pack into the core collections. */
if (window.CLI_CONTENT) {
  const extraTopics = (window.CLI_CONTENT.topics || []).map((item, index) => ({
    id: 'library-' + index + '-' + item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    subject: item.subject, title: item.title, level: item.level,
    duration: '12 min', summary: item.simple, simple: item.simple,
    explanation: item.explanation, deeper: item.deeper,
    points: ['Identify the key quantities and definitions before applying a model.', 'State the assumptions under which the relationship is valid.', 'Check units, direction and limiting cases when solving problems.', 'Connect the concept to evidence, measurement or a practical application.'],
    diagram: item.diagram || 'function'
  }));
  scienceTopics.push(...extraTopics);
  vocabulary.push(...(window.CLI_CONTENT.vocabulary || []));
  formulas.push(...(window.CLI_CONTENT.formulas || []).map(f => ({category:f.category, title:f.name, expression:f.equation, description:f.description, symbols:f.keywords.split(' · ')})));
  const uniqueTerms = [...new Map(vocabulary.map(item => [`${item.subject}|${item.term.toLowerCase()}`, item])).values()];
  vocabulary.splice(0, vocabulary.length, ...uniqueTerms);
  const uniqueFormulae = [...new Map(formulas.map(item => [`${item.category}|${item.title.toLowerCase()}`, item])).values()];
  formulas.splice(0, formulas.length, ...uniqueFormulae);
}

const diagramTemplates = {
  motion: `<svg viewBox="0 0 320 130" role="img" aria-label="A moving object changes position along a line"><path d="M22 94H296" stroke="#a9b9ad" stroke-width="2"/><path d="M282 88l14 6-14 6" fill="none" stroke="#a9b9ad" stroke-width="2"/><circle cx="64" cy="78" r="12" fill="#9bc7a8"/><circle cx="196" cy="78" r="12" fill="#3f8060"/><path d="M79 52H181m-9-7 9 7-9 7" stroke="#639578" stroke-width="2" fill="none"/><text x="64" y="115" text-anchor="middle" fill="#6f8376" font-size="10">Start</text><text x="196" y="115" text-anchor="middle" fill="#6f8376" font-size="10">Later position</text><text x="130" y="41" text-anchor="middle" fill="#6f8376" font-size="10">change in position</text></svg>`,
  forces: `<svg viewBox="0 0 320 150" role="img" aria-label="Forces acting on an object"><rect x="126" y="54" width="68" height="48" rx="8" fill="#dcebe0" stroke="#8eb39a"/><path d="M160 54V20m-6 8 6-8 6 8M126 78H52m8-6-8 6 8 6M194 78h74m-8-6 8 6-8 6M160 102v29m-6-8 6 8 6-8" stroke="#4b8564" stroke-width="2" fill="none"/><text x="160" y="83" text-anchor="middle" fill="#365d47" font-size="12">object</text><text x="160" y="13" text-anchor="middle" fill="#75877a" font-size="10">Normal force</text><text x="46" y="69" text-anchor="middle" fill="#75877a" font-size="10">Push</text><text x="276" y="69" text-anchor="middle" fill="#75877a" font-size="10">Friction</text><text x="160" y="146" text-anchor="middle" fill="#75877a" font-size="10">Weight</text></svg>`,
  energy: `<svg viewBox="0 0 320 145" role="img" aria-label="Energy transfer from a raised object"><path d="M25 119H293" stroke="#a9b9ad" stroke-width="2"/><rect x="66" y="26" width="52" height="15" rx="4" fill="#8fbd9c"/><path d="M92 42V112m-6-8 6 8 6-8" stroke="#548568" stroke-width="2" fill="none"/><path d="M145 32h115" stroke="#d0ddd2" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="220" y="96" width="44" height="22" rx="4" fill="#d7e9db" stroke="#85ad91"/><text x="92" y="17" text-anchor="middle" fill="#718477" font-size="10">Stored energy</text><text x="242" y="88" text-anchor="middle" fill="#718477" font-size="10">Motion</text><text x="92" y="136" text-anchor="middle" fill="#718477" font-size="9">Height</text></svg>`,
  atom: `<svg viewBox="0 0 320 160" role="img" aria-label="Simplified atom model with nucleus and electrons"><ellipse cx="160" cy="79" rx="112" ry="38" fill="none" stroke="#8db59a" stroke-width="2" transform="rotate(-28 160 79)"/><ellipse cx="160" cy="79" rx="112" ry="38" fill="none" stroke="#8db59a" stroke-width="2" transform="rotate(28 160 79)"/><circle cx="160" cy="79" r="24" fill="#dcebe0" stroke="#84ad91"/><circle cx="151" cy="74" r="6" fill="#4e8768"/><circle cx="169" cy="84" r="6" fill="#c6a66e"/><circle cx="60" cy="41" r="6" fill="#4e8768"/><circle cx="260" cy="43" r="6" fill="#4e8768"/><text x="160" y="126" text-anchor="middle" fill="#718477" font-size="10">Nucleus: protons + neutrons</text><text x="160" y="148" text-anchor="middle" fill="#718477" font-size="9">Simplified illustration, not to scale</text></svg>`,
  bonding: `<svg viewBox="0 0 320 135" role="img" aria-label="Two atoms sharing electrons in a covalent bond"><circle cx="116" cy="65" r="35" fill="#e5f0e7" stroke="#8fb59a"/><circle cx="204" cy="65" r="35" fill="#e5f0e7" stroke="#8fb59a"/><circle cx="160" cy="65" r="6" fill="#477b5e"/><circle cx="147" cy="65" r="5" fill="#477b5e"/><text x="116" y="70" text-anchor="middle" fill="#42634f" font-size="12">A</text><text x="204" y="70" text-anchor="middle" fill="#42634f" font-size="12">B</text><text x="160" y="119" text-anchor="middle" fill="#718477" font-size="10">shared electron pair</text></svg>`,
  reaction: `<svg viewBox="0 0 320 145" role="img" aria-label="Energy profile of a reaction with activation energy"><path d="M27 115H297M27 115V18" stroke="#aab9ae" stroke-width="1.5"/><path d="M30 99C75 99 83 30 137 30S193 83 291 83" fill="none" stroke="#4b8564" stroke-width="3"/><path d="M105 93V36m-5 7 5-7 5 7" stroke="#c39e60" stroke-width="2" fill="none"/><text x="103" y="27" text-anchor="middle" fill="#a27d43" font-size="9">Ea</text><text x="45" y="91" fill="#718477" font-size="9">Reactants</text><text x="253" y="76" fill="#718477" font-size="9">Products</text><text x="170" y="139" text-anchor="middle" fill="#718477" font-size="9">Reaction progress</text></svg>`,
  cell: `<svg viewBox="0 0 320 150" role="img" aria-label="Simplified plant cell with organelles"><rect x="48" y="22" width="224" height="105" rx="27" fill="#e3f0df" stroke="#83ad8d" stroke-width="3"/><rect x="57" y="30" width="206" height="89" rx="21" fill="#f4f8ee" stroke="#b3cbb5"/><circle cx="117" cy="73" r="20" fill="#d2e5d6" stroke="#78a487"/><circle cx="117" cy="73" r="8" fill="#6c9a78"/><rect x="164" y="48" width="46" height="17" rx="8" fill="#b8d5a8"/><rect x="166" y="83" width="42" height="17" rx="8" fill="#b8d5a8"/><text x="117" y="108" text-anchor="middle" fill="#718477" font-size="8">Nucleus</text><text x="187" y="43" text-anchor="middle" fill="#718477" font-size="8">Chloroplast</text><text x="187" y="114" text-anchor="middle" fill="#718477" font-size="8">Vacuole</text></svg>`,
  photosynthesis: `<svg viewBox="0 0 320 140" role="img" aria-label="Inputs and outputs of photosynthesis"><rect x="113" y="38" width="94" height="62" rx="12" fill="#e3f0df" stroke="#8db59a"/><text x="160" y="64" text-anchor="middle" fill="#42634f" font-size="12">PLANT</text><text x="160" y="80" text-anchor="middle" fill="#718477" font-size="8">chloroplast</text><path d="M72 24l24 26m-24-26 0 15m0-15 15 0M64 24l-8 8m16-8 8 8" stroke="#c59d56" stroke-width="2" fill="none"/><path d="M98 70H112m-5-5 5 5-5 5M208 70h35m-7-5 7 5-7 5" stroke="#5f9975" stroke-width="2" fill="none"/><text x="42" y="73" text-anchor="middle" fill="#718477" font-size="9">Light + H₂O</text><text x="273" y="61" text-anchor="middle" fill="#718477" font-size="9">Sugar</text><text x="273" y="74" text-anchor="middle" fill="#718477" font-size="9">+ O₂</text><text x="160" y="124" text-anchor="middle" fill="#718477" font-size="9">CO₂ is also used</text></svg>`,
  function: `<svg viewBox="0 0 320 145" role="img" aria-label="Input output mapping for a function"><rect x="23" y="24" width="85" height="94" rx="9" fill="#eff5ef" stroke="#b5cbb9"/><rect x="212" y="24" width="85" height="94" rx="9" fill="#eff5ef" stroke="#b5cbb9"/><text x="65" y="17" text-anchor="middle" fill="#718477" font-size="9">INPUT x</text><text x="254" y="17" text-anchor="middle" fill="#718477" font-size="9">OUTPUT f(x)</text><g fill="#4a7559" font-size="11" text-anchor="middle"><text x="65" y="48">1</text><text x="65" y="76">2</text><text x="65" y="104">3</text><text x="254" y="48">2</text><text x="254" y="76">4</text><text x="254" y="104">6</text></g><g stroke="#8cad94" stroke-width="1.5"><path d="M109 43H211M109 71H211M109 99H211"/></g><text x="160" y="132" text-anchor="middle" fill="#718477" font-size="9">Rule: f(x) = 2x</text></svg>`,
  derivative: `<svg viewBox="0 0 320 150" role="img" aria-label="A tangent line touching a curve"><path d="M26 120H296M49 133V17" stroke="#aab9ae" stroke-width="1.3"/><path d="M50 112Q104 106 140 81T282 20" stroke="#4b8564" stroke-width="3" fill="none"/><path d="M72 114L263 27" stroke="#c5a66b" stroke-width="2"/><circle cx="171" cy="67" r="4" fill="#346b4e"/><text x="223" y="51" fill="#a17b3f" font-size="10">tangent</text><text x="185" y="84" fill="#718477" font-size="9">point (a, f(a))</text><text x="286" y="139" fill="#718477" font-size="9">x</text><text x="38" y="21" fill="#718477" font-size="9">y</text></svg>`,
  binary: `<svg viewBox="0 0 320 125" role="img" aria-label="Binary place values"><g fill="#eff5ef" stroke="#b9d0bf"><rect x="16" y="22" width="51" height="52" rx="7"/><rect x="78" y="22" width="51" height="52" rx="7"/><rect x="140" y="22" width="51" height="52" rx="7"/><rect x="202" y="22" width="51" height="52" rx="7"/></g><g fill="#47765a" font-size="17" text-anchor="middle"><text x="41" y="54">1</text><text x="103" y="54">0</text><text x="165" y="54">1</text><text x="227" y="54">1</text></g><g fill="#7a8b80" font-size="9" text-anchor="middle"><text x="41" y="91">2³ = 8</text><text x="103" y="91">2² = 4</text><text x="165" y="91">2¹ = 2</text><text x="227" y="91">2⁰ = 1</text></g><text x="160" y="116" text-anchor="middle" fill="#718477" font-size="9">1011₂ = 8 + 0 + 2 + 1 = 11₁₀</text></svg>`
};

/* Navigation */
function switchView(view) {
  if (!$('#view-' + view)) return;
  state.view = view;
  $$('.view').forEach(section => section.classList.toggle('active', section.id === 'view-' + view));
  $$('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  const label = ({overview:'Overview',science:'Science library',calculator:'Arithmetic & logic',graphs:'Graphics system',vocabulary:'Vocabulary',formulas:'Equations & formulae'})[view];
  $('#currentSection').textContent = label;
  document.title = `CLI — ${label}`;
  closeMobileNav();
  if (view === 'graphs') plotGraph();
  window.scrollTo({top: 0, behavior: 'smooth'});
}
function openMobileNav() { $('#sidebar').classList.add('open'); $('#mobileScrim').classList.add('visible'); $('#menuToggle').setAttribute('aria-expanded','true'); }
function closeMobileNav() { $('#sidebar').classList.remove('open'); $('#mobileScrim').classList.remove('visible'); $('#menuToggle').setAttribute('aria-expanded','false'); }
$$('[data-view]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
$$('[data-go]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.go)));
$('#menuToggle').addEventListener('click', () => $('#sidebar').classList.contains('open') ? closeMobileNav() : openMobileNav());
$('#mobileScrim').addEventListener('click', closeMobileNav);

/* Theme */
const savedTheme = storageGet('cli-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
$('#themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  storageSet('cli-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

/* Science library */
const subjects = ['All subjects', ...new Set(scienceTopics.map(item => item.subject))];
function renderSubjectTabs() {
  $('#subjectTabs').innerHTML = subjects.map(subject => `<button class="subject-tab ${state.subject === subject ? 'active' : ''}" data-subject="${escapeHTML(subject)}">${escapeHTML(subject)}</button>`).join('');
  $$('.subject-tab').forEach(button => button.addEventListener('click', () => { state.subject = button.dataset.subject; renderSubjectTabs(); renderScienceTopics(); }));
}
function renderScienceTopics() {
  const query = $('#scienceSearch').value.trim().toLowerCase();
  const level = $('#levelFilter').value;
  const filtered = scienceTopics.filter(topic => {
    const matchesSubject = state.subject === 'All subjects' || topic.subject === state.subject;
    const matchesLevel = level === 'all' || topic.level === level;
    const matchesQuery = !query || `${topic.subject} ${topic.title} ${topic.summary} ${topic.simple} ${topic.explanation} ${topic.deeper}`.toLowerCase().includes(query);
    return matchesSubject && matchesLevel && matchesQuery;
  });
  $('#topicCount').textContent = `${String(filtered.length).padStart(2,'0')} TOPICS`;
  $('#topicGrid').innerHTML = filtered.length ? filtered.map(topic => `<button class="topic-card" data-topic="${topic.id}"><span class="topic-subject">${escapeHTML(topic.subject)}</span><strong>${escapeHTML(topic.title)}</strong><p>${escapeHTML(topic.summary)}</p><span class="topic-bottom"><span>${levelName(topic.level)} · ${topic.duration}</span><b>↗</b></span></button>`).join('') : '<div class="empty-state">No topics match that search. Try another word or subject.</div>';
  $$('.topic-card').forEach(button => button.addEventListener('click', () => showTopic(button.dataset.topic)));
}
function showTopic(id) {
  const topic = scienceTopics.find(item => item.id === id);
  if (!topic) return;
  state.selectedTopic = id;
  const detail = $('#topicDetail');
  detail.hidden = false;
  detail.innerHTML = `<div class="detail-top"><div><div class="eyebrow">${escapeHTML(topic.subject)} / ${levelName(topic.level).toUpperCase()}</div><h2>${escapeHTML(topic.title)}</h2></div><button class="detail-close" id="closeTopic" aria-label="Close topic">×</button></div>
    <div class="detail-grid"><div>
      <section class="detail-section simple-explain"><h3>Start with the simple idea</h3><p>${topic.simple}</p></section>
      <section class="detail-section"><h3>Scientific explanation</h3><p>${topic.explanation}</p></section>
      <section class="detail-section"><h3>Key points to remember</h3><ul>${topic.points.map(point => `<li>${point}</li>`).join('')}</ul></section>
      <section class="detail-section"><h3>Deeper understanding</h3><p>${topic.deeper}</p></section>
    </div><aside><div class="diagram-box">${diagramTemplates[topic.diagram] || ''}</div><p class="diagram-caption">Conceptual learning diagram — simplified, not to scale.</p><section class="detail-section" style="margin-top:22px"><h3>Study connection</h3><p>Use the calculator for related numerical work, the graphing tool for relationships and the formula reference to review equations connected to this topic.</p></section></aside></div>`;
  $('#closeTopic').addEventListener('click', () => { detail.hidden = true; state.selectedTopic = null; });
  detail.scrollIntoView({behavior:'smooth', block:'start'});
}
$('#scienceSearch').addEventListener('input', renderScienceTopics);
$('#levelFilter').addEventListener('change', renderScienceTopics);
function levelName(level) { return ({foundation:'Foundation',secondary:'Secondary',college:'College',advanced:'Advanced',graduate:'Higher / research'})[level] || level; }

/* Scientific expression parser — deliberately does not use eval() or Function(). */
const FUNCTION_NAMES = new Set(['sin','cos','tan','asin','acos','atan','sqrt','cbrt','abs','ln','log','exp','floor','ceil','round','min','max','sinh','cosh','tanh','pow','and','or','xor','not']);
function tokenize(expression) {
  const input = expression.replace(/[×]/g,'*').replace(/[÷]/g,'/').replace(/[−]/g,'-').replace(/√/g,'sqrt');
  const tokens = [];
  let i = 0;
  while (i < input.length) {
    const rest = input.slice(i);
    if (/^\s+/.test(rest)) { i += rest.match(/^\s+/)[0].length; continue; }
    const number = rest.match(/^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/);
    if (number) { tokens.push({type:'number', value:Number(number[0])}); i += number[0].length; continue; }
    const identifier = rest.match(/^[A-Za-z]+/);
    if (identifier) { tokens.push({type:'identifier', value:identifier[0].toLowerCase()}); i += identifier[0].length; continue; }
    const char = input[i];
    if ('+-*/^%(),!'.includes(char)) { tokens.push({type:char, value:char}); i++; continue; }
    throw new Error(`Unrecognised character: “${char}”.`);
  }
  const expanded = [];
  for (let index = 0; index < tokens.length; index++) {
    const current = tokens[index];
    const previous = expanded[expanded.length - 1];
    if (previous) {
      const previousCanEnd = previous.type === 'number' || previous.type === ')' || previous.type === '!'
        || (previous.type === 'identifier' && !FUNCTION_NAMES.has(previous.value));
      const currentCanStart = current.type === 'number' || current.type === 'identifier' || current.type === '(';
      const isFunctionCall = previous.type === 'identifier' && FUNCTION_NAMES.has(previous.value) && current.type === '(';
      if (previousCanEnd && currentCanStart && !isFunctionCall) expanded.push({type:'*',value:'*'});
    }
    expanded.push(current);
  }
  return expanded;
}
class ExpressionParser {
  constructor(expression, options = {}) {
    this.tokens = tokenize(expression);
    this.position = 0;
    this.angle = options.angle || 'DEG';
    this.variable = options.variable;
  }
  peek() { return this.tokens[this.position]; }
  take(type) { if (this.peek()?.type === type) return this.tokens[this.position++]; return null; }
  expect(type, description = type) { if (!this.take(type)) throw new Error(`Expected ${description}.`); }
  parse() {
    if (!this.tokens.length) throw new Error('Enter an expression first.');
    const value = this.addSub();
    if (this.position < this.tokens.length) throw new Error(`Unexpected “${this.peek().value}”.`);
    return value;
  }
  addSub() {
    let value = this.multiply();
    while (this.peek()?.type === '+' || this.peek()?.type === '-') {
      const op = this.tokens[this.position++].type;
      const right = this.multiply();
      value = op === '+' ? value + right : value - right;
    }
    return value;
  }
  multiply() {
    let value = this.unary();
    while (['*','/','%'].includes(this.peek()?.type)) {
      const op = this.tokens[this.position++].type;
      const right = this.unary();
      if (op === '*') value *= right;
      if (op === '/') value /= right;
      if (op === '%') value %= right;
    }
    return value;
  }
  unary() {
    if (this.take('+')) return this.unary();
    if (this.take('-')) return -this.unary();
    return this.power();
  }
  power() {
    const value = this.postfix();
    if (this.take('^')) return Math.pow(value, this.unary());
    return value;
  }
  postfix() {
    let value = this.primary();
    while (this.take('!')) {
      if (!Number.isInteger(value) || value < 0 || value > 170) throw new Error('Factorial requires a whole number from 0 to 170.');
      let result = 1;
      for (let n = 2; n <= value; n++) result *= n;
      value = result;
    }
    return value;
  }
  primary() {
    const token = this.peek();
    if (!token) throw new Error('The expression is incomplete.');
    if (this.take('number')) return token.value;
    if (this.take('(')) {
      const value = this.addSub();
      this.expect(')', 'a closing parenthesis )');
      return value;
    }
    if (this.take('identifier')) {
      const name = token.value;
      if (name === 'pi') return Math.PI;
      if (name === 'e') return Math.E;
      if (name === 'x') {
        if (this.variable === undefined) throw new Error('The variable x is only available in the graphing tool.');
        return this.variable;
      }
      if (!FUNCTION_NAMES.has(name)) throw new Error(`Unknown name “${name}”.`);
      this.expect('(', `an opening parenthesis after ${name}`);
      const args = [];
      if (!this.take(')')) {
        args.push(this.addSub());
        while (this.take(',')) args.push(this.addSub());
        this.expect(')', 'a closing parenthesis )');
      }
      return applyFunction(name, args, this.angle);
    }
    throw new Error(`Unexpected “${token.value}”.`);
  }
}
function applyFunction(name, args, angle) {
  const one = () => { if (args.length !== 1) throw new Error(`${name}() requires one argument.`); return args[0]; };
  const twoOrMore = () => { if (args.length < 2) throw new Error(`${name}() requires at least two arguments.`); };
  const radians = value => angle === 'DEG' ? value * Math.PI / 180 : value;
  const degrees = value => angle === 'DEG' ? value * 180 / Math.PI : value;
  switch (name) {
    case 'sin': return Math.sin(radians(one()));
    case 'cos': return Math.cos(radians(one()));
    case 'tan': return Math.tan(radians(one()));
    case 'asin': return degrees(Math.asin(one()));
    case 'acos': return degrees(Math.acos(one()));
    case 'atan': return degrees(Math.atan(one()));
    case 'sqrt': return Math.sqrt(one());
    case 'cbrt': return Math.cbrt(one());
    case 'abs': return Math.abs(one());
    case 'ln': return Math.log(one());
    case 'log': return Math.log10(one());
    case 'exp': return Math.exp(one());
    case 'floor': return Math.floor(one());
    case 'ceil': return Math.ceil(one());
    case 'round': return Math.round(one());
    case 'sinh': return Math.sinh(one());
    case 'cosh': return Math.cosh(one());
    case 'tanh': return Math.tanh(one());
    case 'min': twoOrMore(); return Math.min(...args);
    case 'max': twoOrMore(); return Math.max(...args);
    case 'pow': if (args.length !== 2) throw new Error('pow() requires two arguments.'); return Math.pow(args[0], args[1]);
    case 'and': case 'or': case 'xor':
      twoOrMore();
      if (args.some(value => value !== 0 && value !== 1)) throw new Error(`${name.toUpperCase()}() accepts only 0 or 1.`);
      return args.slice(1).reduce((result, value) => name === 'and' ? (result && value ? 1 : 0) : name === 'or' ? (result || value ? 1 : 0) : (result !== value ? 1 : 0), args[0]);
    case 'not': if (one() !== 0 && args[0] !== 1) throw new Error('NOT() accepts only 0 or 1.'); return args[0] === 1 ? 0 : 1;
    default: throw new Error(`Function “${name}” is not supported.`);
  }
}
function evaluateExpression(expression, options = {}) { return new ExpressionParser(expression, options).parse(); }
function formatNumber(value) {
  if (Number.isNaN(value)) return 'Not a real number';
  if (!Number.isFinite(value)) return value > 0 ? 'Infinity' : '−Infinity';
  if (Object.is(value, -0)) value = 0;
  return Number(value.toPrecision(11)).toString();
}

/* Calculator */
let calculationHistory = [];
try { calculationHistory = JSON.parse(storageGet('cli-calculation-history', '[]')).slice(0,12); } catch { calculationHistory = []; }
function setAngle(angle) {
  state.angle = angle;
  $$('[data-angle]').forEach(button => button.classList.toggle('active', button.dataset.angle === angle));
  if (state.view === 'graphs') plotGraph();
}
$$('[data-angle]').forEach(button => button.addEventListener('click', () => setAngle(button.dataset.angle)));
function renderHistory() {
  const container = $('#calcHistory');
  if (!calculationHistory.length) { container.innerHTML = '<div class="empty-state">Your calculations will appear here.</div>'; return; }
  container.innerHTML = calculationHistory.map((item, index) => `<button class="history-item" data-history="${index}"><span class="history-expression">${escapeHTML(item.expression)}</span><span class="history-value">${escapeHTML(item.result)}</span></button>`).join('');
  $$('.history-item').forEach(button => button.addEventListener('click', () => { $('#calcExpression').value = calculationHistory[Number(button.dataset.history)].expression; calculate(); $('#calcExpression').focus(); }));
}
function calculate() {
  const expression = $('#calcExpression').value.trim();
  try {
    const value = evaluateExpression(expression, {angle: state.angle});
    const formatted = formatNumber(value);
    $('#calcResult').textContent = formatted;
    $('#calcHint').textContent = 'Calculation complete';
    if (expression) {
      calculationHistory.unshift({expression, result: formatted});
      calculationHistory = calculationHistory.slice(0,12);
      storageSet('cli-calculation-history', JSON.stringify(calculationHistory));
      renderHistory();
    }
  } catch (error) {
    $('#calcResult').textContent = '—';
    $('#calcHint').textContent = error.message;
  }
}
function insertAtCursor(text) {
  const input = $('#calcExpression');
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  input.setRangeText(text, start, end, 'end');
  input.focus();
}
$('#keypad').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.insert !== undefined) insertAtCursor(button.dataset.insert);
  if (button.dataset.action === 'clear') { $('#calcExpression').value = ''; $('#calcResult').textContent = '0'; $('#calcHint').textContent = 'Use sin, cos, tan, log, ln, √, π and e'; $('#calcExpression').focus(); }
  if (button.dataset.action === 'delete') {
    const input = $('#calcExpression'); const start = input.selectionStart ?? input.value.length; const end = input.selectionEnd ?? input.value.length;
    if (start !== end) input.setRangeText('', start, end, 'end'); else if (start > 0) input.setRangeText('', start - 1, start, 'end');
    input.focus();
  }
  if (button.dataset.action === 'evaluate') calculate();
});
$('#calcExpression').addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); calculate(); }
  if (event.key === 'Escape') { $('#calcExpression').value = ''; $('#calcResult').textContent = '0'; $('#calcHint').textContent = 'Cleared'; }
});
$('#clearHistory').addEventListener('click', () => { calculationHistory = []; storageRemove('cli-calculation-history'); renderHistory(); });

/* Graph plotter */
function plotGraph() {
  const expression = $('#graphExpression').value.trim();
  const xMin = Number($('#xMin').value), xMax = Number($('#xMax').value), yMin = Number($('#yMin').value), yMax = Number($('#yMax').value);
  const message = $('#graphMessage');
  if (!expression) { message.textContent = 'Enter a function before plotting.'; message.classList.add('error'); return; }
  if (![xMin,xMax,yMin,yMax].every(Number.isFinite) || xMin >= xMax || yMin >= yMax) { message.textContent = 'Each minimum must be smaller than its maximum, and all bounds must be valid numbers.'; message.classList.add('error'); return; }
  if (Math.max(Math.abs(xMin),Math.abs(xMax),Math.abs(yMin),Math.abs(yMax)) > 1e9) { message.textContent = 'Please choose a smaller viewing range.'; message.classList.add('error'); return; }
  try { evaluateExpression(expression, {angle:state.angle, variable:0}); }
  catch (error) { message.textContent = error.message; message.classList.add('error'); return; }
  const svg = $('#graphSvg');
  const width = 800, height = 500, pad = {left:58,right:24,top:20,bottom:42};
  const plotW = width-pad.left-pad.right, plotH = height-pad.top-pad.bottom;
  const sx = x => pad.left + (x-xMin)/(xMax-xMin)*plotW;
  const sy = y => pad.top + (yMax-y)/(yMax-yMin)*plotH;
  let markup = '';
  const divisions = 10;
  for (let i=0;i<=divisions;i++) {
    const x = pad.left + i/divisions*plotW; const value = xMin + i/divisions*(xMax-xMin);
    markup += `<line class="graph-gridline" x1="${x}" y1="${pad.top}" x2="${x}" y2="${pad.top+plotH}"/><text class="graph-tick-label" x="${x}" y="${height-17}" text-anchor="middle">${shortTick(value)}</text>`;
    const y = pad.top + i/divisions*plotH; const yValue = yMax - i/divisions*(yMax-yMin);
    markup += `<line class="graph-gridline" x1="${pad.left}" y1="${y}" x2="${pad.left+plotW}" y2="${y}"/><text class="graph-tick-label" x="${pad.left-9}" y="${y+3}" text-anchor="end">${shortTick(yValue)}</text>`;
  }
  if (xMin <= 0 && xMax >= 0) markup += `<line class="graph-axis" x1="${sx(0)}" y1="${pad.top}" x2="${sx(0)}" y2="${pad.top+plotH}"/>`;
  if (yMin <= 0 && yMax >= 0) markup += `<line class="graph-axis" x1="${pad.left}" y1="${sy(0)}" x2="${pad.left+plotW}" y2="${sy(0)}"/>`;
  let path = '', drawing = false, validSamples = 0;
  const samples = 800;
  for (let i=0;i<=samples;i++) {
    const x = xMin + i/samples*(xMax-xMin);
    let y;
    try { y = evaluateExpression(expression, {angle:state.angle, variable:x}); } catch { y = NaN; }
    const inView = Number.isFinite(y) && y >= yMin-(yMax-yMin)*2 && y <= yMax+(yMax-yMin)*2;
    if (!inView) { drawing = false; continue; }
    const px = sx(x), py = sy(y);
    if (!Number.isFinite(px) || !Number.isFinite(py)) { drawing = false; continue; }
    path += `${drawing ? 'L' : 'M'}${px.toFixed(2)},${py.toFixed(2)} `;
    drawing = true; validSamples++;
  }
  if (!validSamples) { message.textContent = 'No real plotted values were found in this range. Adjust the function or viewing bounds.'; message.classList.add('error'); return; }
  markup += `<defs><clipPath id="plotClip"><rect x="${pad.left}" y="${pad.top}" width="${plotW}" height="${plotH}"/></clipPath></defs><path class="graph-curve" clip-path="url(#plotClip)" d="${path}"/>`;
  markup += `<text class="graph-tick-label" x="${width-15}" y="${height-17}" text-anchor="end">x</text><text class="graph-tick-label" x="${pad.left+8}" y="${pad.top+12}">y</text>`;
  svg.innerHTML = markup;
  svg.setAttribute('aria-label', `Graph of y equals ${expression}, with x from ${xMin} to ${xMax} and y from ${yMin} to ${yMax}`);
  $('#graphDomain').textContent = `X: ${formatNumber(xMin)} to ${formatNumber(xMax)}`;
  $('#graphRange').textContent = `Y: ${formatNumber(yMin)} to ${formatNumber(yMax)}`;
  message.textContent = `Plotted y = ${expression}`;
  message.classList.remove('error');
}
function shortTick(value) { if (Math.abs(value) < 1e-9) return '0'; return Number(value.toPrecision(3)).toString(); }
$('#plotButton').addEventListener('click', plotGraph);
$('#graphExpression').addEventListener('keydown', event => { if (event.key === 'Enter') plotGraph(); });
$$('[data-function]').forEach(button => button.addEventListener('click', () => { $('#graphExpression').value = button.dataset.function; plotGraph(); }));
$('#resetGraph').addEventListener('click', () => { $('#graphExpression').value = 'x^2'; $('#xMin').value = '-10'; $('#xMax').value = '10'; $('#yMin').value = '-5'; $('#yMax').value = '15'; plotGraph(); });

/* Vocabulary */
function renderVocabulary() {
  const query = $('#vocabSearch').value.trim().toLowerCase();
  const filtered = vocabulary.filter(item => `${item.term} ${item.subject} ${item.definition} ${item.simple}`.toLowerCase().includes(query));
  $('#vocabCount').textContent = `${String(filtered.length).padStart(2,'0')} TERMS`;
  $('#vocabResults').innerHTML = filtered.length ? filtered.map(item => `<button class="vocab-item ${state.selectedTerm === item.term ? 'active' : ''}" data-term="${escapeHTML(item.term)}"><span><strong>${escapeHTML(item.term)}</strong><small>${escapeHTML(item.subject)}</small></span><span>↗</span></button>`).join('') : '<div class="empty-state">No matching terms found. Try a broader search.</div>';
  $$('.vocab-item').forEach(button => button.addEventListener('click', () => selectVocabulary(button.dataset.term)));
}
function selectVocabulary(term) {
  const item = vocabulary.find(entry => entry.term === term);
  if (!item) return;
  state.selectedTerm = term;
  $('#definitionCard').innerHTML = `<div class="definition-symbol">Aa</div><div class="eyebrow">${escapeHTML(item.subject.toUpperCase())} / DEFINITION</div><h2>${escapeHTML(item.term)}</h2><p class="definition-main">${escapeHTML(item.definition)}</p><div class="definition-example"><strong>IN SIMPLE TERMS</strong>${escapeHTML(item.simple)}</div>`;
  renderVocabulary();
}
$('#vocabSearch').addEventListener('input', renderVocabulary);
document.addEventListener('keydown', event => {
  const target = event.target;
  const typing = target && (['INPUT','TEXTAREA','SELECT'].includes(target.tagName) || target.isContentEditable);
  if (event.key === '/' && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); switchView('vocabulary'); $('#vocabSearch').focus(); }
});

/* Formula reference */
const formulaCategories = ['All subjects', ...new Set(formulas.map(item => item.category))];
$('#formulaCategory').innerHTML = formulaCategories.map(category => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join('');
function renderFormulas() {
  const query = $('#formulaSearch').value.trim().toLowerCase();
  const category = $('#formulaCategory').value;
  const filtered = formulas.filter(item => (category === 'All subjects' || item.category === category) && `${item.category} ${item.title} ${item.expression} ${item.description} ${item.symbols.join(' ')}`.toLowerCase().includes(query));
  $('#formulaGrid').innerHTML = filtered.length ? filtered.map((item,index) => `<article class="formula-card"><div class="formula-card-top"><span class="formula-category-tag">${escapeHTML(item.category)}</span><button class="formula-copy" data-copy-formula="${index}" title="Copy formula" aria-label="Copy ${escapeHTML(item.title)} formula">⧉</button></div><h3>${escapeHTML(item.title)}</h3><code class="formula-expression">${escapeHTML(item.expression)}</code><p>${escapeHTML(item.description)}</p><div class="formula-symbols">${item.symbols.map(symbol => `<span>${escapeHTML(symbol)}</span>`).join('')}</div></article>`).join('') : '<div class="empty-state">No formulae match your search.</div>';
  $$('.formula-copy').forEach(button => button.addEventListener('click', async () => {
    const item = filtered[Number(button.dataset.copyFormula)];
    const copied = await copyText(item.expression);
    button.textContent = copied ? '✓' : '×';
    setTimeout(() => { button.textContent = '⧉'; }, 1200);
  }));
}
$('#formulaSearch').addEventListener('input', renderFormulas);
$('#formulaCategory').addEventListener('change', renderFormulas);
async function copyText(value) {
  try { await navigator.clipboard.writeText(value); return true; }
  catch {
    const textArea = document.createElement('textarea'); textArea.value = value; textArea.style.position = 'fixed'; textArea.style.opacity = '0'; document.body.appendChild(textArea); textArea.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch { ok = false; } textArea.remove(); return ok;
  }
}

function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }

/* Initial render */
$('#year').textContent = new Date().getFullYear();
renderSubjectTabs();
renderScienceTopics();
renderHistory();
renderVocabulary();
renderFormulas();
plotGraph();

/* Live content inventory on the overview dashboard. */
const countNode = id => document.getElementById(id);
if (countNode('topicTotal')) countNode('topicTotal').textContent = String(scienceTopics.length).padStart(2,'0');
if (countNode('termTotal')) countNode('termTotal').textContent = String(vocabulary.length).padStart(2,'0');
if (countNode('formulaTotal')) countNode('formulaTotal').textContent = String(formulas.length).padStart(2,'0');
