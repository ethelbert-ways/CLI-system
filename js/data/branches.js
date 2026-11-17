/* Structural maps of the sciences: branches, sub-branches and topics. */
CLI.addBranches([
{ subject: 'physics', tree: { t: 'Physics', kids: [
  { t: 'Classical Mechanics', kids: [{ t: 'Kinematics', kids: ['Displacement and velocity', 'Acceleration', 'Projectile motion'] }, { t: 'Dynamics', kids: ['Newton\'s laws', 'Friction and drag', 'Circular motion'] }, { t: 'Work and Energy', kids: ['Kinetic and potential energy', 'Conservation of energy', 'Power'] }, { t: 'Momentum', kids: ['Impulse', 'Collisions'] }, 'Gravitation', 'Rotational motion', 'Lagrangian and Hamiltonian mechanics'] },
  { t: 'Thermodynamics', kids: ['Temperature and heat', 'Laws of thermodynamics', 'Heat engines', 'Entropy', { t: 'Statistical Mechanics', kids: ['Boltzmann distribution', 'Phase transitions'] }] },
  { t: 'Waves and Optics', kids: ['Wave properties', 'Sound', { t: 'Light', kids: ['Reflection and refraction', 'Lenses and mirrors', 'Interference and diffraction', 'Polarisation'] }, 'Lasers'] },
  { t: 'Electricity and Magnetism', kids: [{ t: 'Electrostatics', kids: ['Coulomb\'s law', 'Electric field', 'Potential'] }, { t: 'Circuits', kids: ['Ohm\'s law', 'Series and parallel', 'Capacitors and inductors'] }, { t: 'Magnetism', kids: ['Magnetic fields', 'Induction'] }, 'Maxwell\'s equations', 'Electromagnetic waves'] },
  { t: 'Modern Physics', kids: [{ t: 'Relativity', kids: ['Special relativity', 'General relativity'] }, { t: 'Quantum Mechanics', kids: ['Wave-particle duality', 'Schrödinger equation', 'Uncertainty principle', 'Entanglement'] }, { t: 'Atomic and Nuclear', kids: ['Atomic structure', 'Radioactivity', 'Fission and fusion'] }] },
  { t: 'Particle Physics', kids: ['Standard Model', 'Quarks and leptons', 'Fundamental forces', 'Higgs boson'] },
  { t: 'Condensed Matter', kids: ['Crystals and bands', 'Semiconductors', 'Superconductivity', 'Topological phases'] },
  { t: 'Astrophysics and Cosmology', kids: ['Stars and their life cycles', 'Black holes', 'Big Bang', 'Dark matter and dark energy', 'Gravitational waves'] }
] } },
{ subject: 'chemistry', tree: { t: 'Chemistry', kids: [
  { t: 'General Chemistry', kids: [{ t: 'Atomic Structure', kids: ['Subatomic particles', 'Isotopes', 'Electron configuration'] }, { t: 'Periodic Table', kids: ['Groups and periods', 'Periodic trends'] }, { t: 'Bonding', kids: ['Ionic bonds', 'Covalent bonds', 'Metallic bonds', 'Intermolecular forces'] }, 'States of matter', 'Stoichiometry and the mole', 'Gas laws', 'Solutions'] },
  { t: 'Physical Chemistry', kids: [{ t: 'Thermochemistry', kids: ['Enthalpy', 'Entropy', 'Gibbs free energy'] }, { t: 'Kinetics', kids: ['Rate laws', 'Activation energy', 'Catalysis'] }, { t: 'Equilibrium', kids: ['Equilibrium constant', 'Le Chatelier\'s principle'] }, 'Electrochemistry', 'Quantum chemistry', 'Spectroscopy'] },
  { t: 'Inorganic Chemistry', kids: ['Acids and bases', 'Transition metals', 'Coordination compounds', 'Solid-state chemistry', 'Organometallics'] },
  { t: 'Organic Chemistry', kids: [{ t: 'Functional Groups', kids: ['Alkanes and alkenes', 'Alcohols', 'Carbonyls', 'Amines and amides'] }, { t: 'Reaction Mechanisms', kids: ['Substitution', 'Elimination', 'Addition'] }, 'Stereochemistry', 'Aromatic compounds', 'Polymers', 'Synthesis'] },
  { t: 'Analytical Chemistry', kids: ['Titration', 'Chromatography', 'Mass spectrometry', 'NMR spectroscopy'] },
  { t: 'Biochemistry', kids: ['Proteins and enzymes', 'Carbohydrates', 'Lipids', 'Nucleic acids', 'Metabolism'] },
  { t: 'Materials and Environmental', kids: ['Battery materials', 'Nanomaterials', 'Green chemistry', 'Atmospheric chemistry'] }
] } },
{ subject: 'biology', tree: { t: 'Biology', kids: [
  { t: 'Cell Biology', kids: ['Cell theory', { t: 'Organelles', kids: ['Nucleus', 'Mitochondria', 'Chloroplasts', 'Ribosomes'] }, 'Membranes and transport', 'Cell cycle and division', 'Cell signalling'] },
  { t: 'Genetics', kids: [{ t: 'Classical Genetics', kids: ['Mendel\'s laws', 'Inheritance patterns'] }, { t: 'Molecular Genetics', kids: ['DNA replication', 'Transcription', 'Translation', 'Gene regulation'] }, 'Genomics', 'Epigenetics', 'Gene editing'] },
  { t: 'Biochemistry and Metabolism', kids: ['Enzymes', 'Cellular respiration', 'Photosynthesis', 'Protein folding'] },
  { t: 'Evolution', kids: ['Natural selection', 'Speciation', 'Phylogenetics', 'Origin of life', 'Human evolution'] },
  { t: 'Physiology', kids: ['Nervous system', 'Circulatory system', 'Respiratory system', 'Digestive system', 'Endocrine system', 'Immune system'] },
  { t: 'Ecology', kids: ['Populations', 'Communities', 'Ecosystems and energy flow', 'Biomes', 'Conservation biology'] },
  { t: 'Microbiology', kids: ['Bacteria', 'Viruses', 'Fungi', 'Antibiotics and resistance'] },
  { t: 'Developmental and Neuroscience', kids: ['Embryology', 'Stem cells', 'Brain and behaviour', 'Learning and memory'] },
  { t: 'Plant Biology', kids: ['Plant structure', 'Transport in plants', 'Plant hormones'] }
] } },
{ subject: 'math', tree: { t: 'Mathematics', kids: [
  { t: 'Arithmetic and Number Theory', kids: ['Whole numbers and fractions', 'Primes and factors', 'Modular arithmetic', 'Riemann hypothesis', 'Cryptography'] },
  { t: 'Algebra', kids: [{ t: 'Elementary Algebra', kids: ['Linear equations', 'Quadratics', 'Polynomials', 'Exponentials and logarithms'] }, { t: 'Linear Algebra', kids: ['Vectors', 'Matrices', 'Determinants', 'Eigenvalues'] }, { t: 'Abstract Algebra', kids: ['Groups', 'Rings and fields', 'Galois theory'] }] },
  { t: 'Geometry and Trigonometry', kids: ['Euclidean geometry', 'Trigonometry', 'Coordinate geometry', 'Differential geometry', 'Topology'] },
  { t: 'Calculus and Analysis', kids: [{ t: 'Differential Calculus', kids: ['Limits', 'Derivatives', 'Optimisation'] }, { t: 'Integral Calculus', kids: ['Integrals', 'Fundamental theorem'] }, 'Sequences and series', 'Multivariable calculus', 'Real analysis', 'Complex analysis'] },
  { t: 'Differential Equations', kids: ['Ordinary equations', 'Partial equations', 'Dynamical systems', 'Chaos'] },
  { t: 'Probability and Statistics', kids: ['Probability rules', 'Distributions', 'Hypothesis testing', 'Regression', 'Bayesian inference'] },
  { t: 'Discrete Mathematics', kids: ['Logic and proof', 'Sets', 'Combinatorics', 'Graph theory'] },
  { t: 'Numerical Methods', kids: ['Root finding', 'Numerical integration', 'Optimisation algorithms'] }
] } },
{ subject: 'earth', tree: { t: 'Earth and Space Science', kids: [
  { t: 'Geology', kids: [{ t: 'Minerals and Rocks', kids: ['Igneous', 'Sedimentary', 'Metamorphic', 'The rock cycle'] }, { t: 'Plate Tectonics', kids: ['Plate boundaries', 'Volcanoes', 'Earthquakes', 'Mountain building'] }, 'Geologic time and fossils', 'Surface processes', 'Seismology and Earth\'s interior'] },
  { t: 'Atmospheric Science', kids: [{ t: 'Atmosphere', kids: ['Layers', 'Composition'] }, { t: 'Weather', kids: ['Air pressure and wind', 'Clouds and precipitation', 'Storms'] }, { t: 'Climate', kids: ['Greenhouse effect', 'Climate change', 'Tipping points', 'Ice ages'] }] },
  { t: 'Oceanography', kids: ['Ocean currents', 'Tides', 'Waves', 'Sea-floor features', 'Ocean chemistry'] },
  { t: 'Hydrology', kids: ['Water cycle', 'Rivers and lakes', 'Groundwater', 'Glaciers'] },
  { t: 'Astronomy', kids: [{ t: 'Solar System', kids: ['The Sun', 'Planets', 'Moons', 'Comets and asteroids'] }, { t: 'Stars and Galaxies', kids: ['Star life cycles', 'Galaxies', 'Black holes'] }, 'Cosmology', 'Exoplanets', 'Astrobiology'] },
  { t: 'Environmental Science', kids: ['Resources', 'Pollution', 'Soil science', 'Sustainability'] }
] } },
{ subject: 'computing', tree: { t: 'Computing and Information Science', kids: [
  { t: 'Foundations', kids: [{ t: 'Number Systems', kids: ['Binary and hexadecimal', 'Representing text and images'] }, { t: 'Digital Logic', kids: ['Logic gates', 'Boolean algebra', 'Adders and memory'] }, 'Computer architecture', 'Operating systems'] },
  { t: 'Programming', kids: ['Variables and control flow', 'Functions and recursion', 'Object-oriented programming', 'Testing and debugging'] },
  { t: 'Algorithms and Data Structures', kids: ['Searching and sorting', 'Big-O complexity', 'Graphs and trees', 'Dynamic programming', 'Hash tables'] },
  { t: 'Theory of Computation', kids: ['Automata', 'Computability', { t: 'Complexity', kids: ['P and NP', 'NP-completeness', 'Approximation'] }, 'Cryptography theory'] },
  { t: 'Systems and Networks', kids: ['Databases', 'Networking', 'Distributed systems', 'Security'] },
  { t: 'Artificial Intelligence', kids: [{ t: 'Machine Learning', kids: ['Regression and classification', 'Neural networks', 'Overfitting'] }, 'Search and planning', 'Language and vision'] },
  { t: 'Frontiers', kids: ['Quantum computing', 'Information theory', 'Bioinformatics', 'Scientific computing'] }
] } }
]);
