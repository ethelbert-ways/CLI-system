/* CLI expanded academic content pack. Curated offline reference material. */
window.CLI_CONTENT = window.CLI_CONTENT || {};
window.CLI_CONTENT.topics = [
  {
    "subject": "Physics",
    "title": "Vectors and scalars",
    "level": "foundation",
    "summary": "A vector has magnitude and direction; a scalar has magnitude only.",
    "simple": "Scalars describe how much; vectors describe how much and which way.",
    "explanation": "A scalar quantity is fully specified by a magnitude and unit. Examples include mass, time, temperature, energy and speed. A vector quantity requires both magnitude and direction. Examples include displacement, velocity, acceleration and force. Vectors may be represented by directed line segments and resolved into perpendicular components.",
    "deeper": "In Cartesian coordinates, a vector in two dimensions can be written A = Aₓi + Aᵧj. Its magnitude is √(Aₓ² + Aᵧ²), and its direction is found from atan2(Aᵧ, Aₓ). Vector addition follows the parallelogram or tip-to-tail rule. Dot products connect vectors to projections and work; cross products connect vectors to area, torque and angular momentum.",
    "diagram": "motion"
  },
  {
    "subject": "Physics",
    "title": "Projectile motion",
    "level": "secondary",
    "summary": "Projectile motion combines horizontal motion with vertical motion under gravity.",
    "simple": "A ball thrown forward keeps moving sideways while gravity changes its up-and-down motion.",
    "explanation": "Ignoring air resistance, horizontal acceleration is zero and vertical acceleration is approximately −g near Earth. The horizontal and vertical motions can be analysed independently, using the same elapsed time. For launch speed u at angle θ: uₓ = u cos θ and uᵧ = u sin θ.",
    "deeper": "For launch and landing at the same height, time of flight T = 2u sinθ/g, maximum height H = u²sin²θ/(2g), and horizontal range R = u²sin(2θ)/g. These results assume a uniform gravitational field, a level landing surface and negligible drag. A more realistic model includes air resistance and may require numerical integration.",
    "diagram": "motion"
  },
  {
    "subject": "Physics",
    "title": "Circular motion",
    "level": "college",
    "summary": "An object moving along a circular path continually changes direction, so its velocity changes even at constant speed.",
    "simple": "A turning car can keep the same speed but still be accelerating because its direction changes.",
    "explanation": "For uniform circular motion of radius r and speed v, the period is the time for one revolution and the frequency is revolutions per second. Angular speed ω = 2π/T = 2πf, while linear speed v = rω. The acceleration points toward the centre.",
    "deeper": "Centripetal acceleration is aᶜ = v²/r = rω². The required resultant inward force is Fᶜ = mv²/r. “Centripetal force” is not a new interaction; it is the name for the net inward force supplied by tension, friction, gravity or a combination. Non-uniform circular motion also has tangential acceleration.",
    "diagram": "forces"
  },
  {
    "subject": "Physics",
    "title": "Momentum and impulse",
    "level": "college",
    "summary": "Momentum measures motion as mass multiplied by velocity; impulse describes the change in momentum.",
    "simple": "A heavier moving object or a faster object is harder to bring to rest.",
    "explanation": "Linear momentum p = mv is a vector. Impulse J is the product of a constant force and the time it acts, or more generally the integral of force over time. The impulse–momentum theorem states J = Δp.",
    "deeper": "For an isolated system, total momentum is conserved. In a collision, momentum conservation applies to the system even when kinetic energy is not conserved. Elastic collisions conserve both momentum and kinetic energy; inelastic collisions conserve momentum but convert some organised kinetic energy into other forms. Always define the system and account for external impulses.",
    "diagram": "forces"
  },
  {
    "subject": "Physics",
    "title": "Gravitation and orbital motion",
    "level": "advanced",
    "summary": "Gravity is an attractive interaction between masses and governs falling objects and orbits.",
    "simple": "Earth pulls objects toward it; the same interaction keeps moons and satellites in orbit.",
    "explanation": "Newton’s law of universal gravitation gives F = Gm₁m₂/r² for two point masses separated by distance r. Near a planet’s surface, the field is approximately uniform and weight is W = mg. An orbiting object is continually falling around the body it orbits.",
    "deeper": "For a circular orbit around mass M, equating gravitational and centripetal force gives v = √(GM/r), T = 2π√(r³/GM). Gravitational potential per unit mass is −GM/r when zero is defined at infinity. Kepler’s laws describe orbital geometry and period relationships; general relativity gives a deeper description in terms of spacetime curvature.",
    "diagram": "energy"
  },
  {
    "subject": "Physics",
    "title": "Simple harmonic motion",
    "level": "college",
    "summary": "Simple harmonic motion occurs when acceleration is proportional to displacement from equilibrium and directed back toward equilibrium.",
    "simple": "A spring pulled and released moves back and forth in a repeating pattern.",
    "explanation": "The defining relation is a = −ω²x. The negative sign means acceleration points opposite to displacement. For an ideal mass–spring system, ω = √(k/m); for a small-angle simple pendulum, ω = √(g/L).",
    "deeper": "Displacement may be written x = A cos(ωt + φ). Velocity and acceleration are phase-shifted relative to displacement. The period is T = 2π/ω. Energy alternates between kinetic and potential forms. Damping reduces amplitude; driven oscillations can show resonance near a natural frequency.",
    "diagram": "energy"
  },
  {
    "subject": "Physics",
    "title": "Waves and superposition",
    "level": "secondary",
    "summary": "A wave transfers energy and information without requiring a net transport of matter over the whole medium.",
    "simple": "A ripple travels across water while the water mostly moves around its position.",
    "explanation": "A wave is described by amplitude, wavelength λ, frequency f, period T and speed v. The basic relation is v = fλ. Mechanical waves require a medium; electromagnetic waves can travel through a vacuum. Transverse waves oscillate perpendicular to propagation, while longitudinal waves oscillate parallel to it.",
    "deeper": "Superposition states that overlapping wave displacements add algebraically in a linear medium. This produces constructive and destructive interference. Standing waves form from opposing waves of the same frequency. Boundary conditions determine nodes, antinodes and allowed resonant frequencies.",
    "diagram": "motion"
  },
  {
    "subject": "Physics",
    "title": "Electric charge and electric fields",
    "level": "college",
    "summary": "Electric charge is a property of matter that produces electric interactions.",
    "simple": "Charged objects can attract or repel without touching.",
    "explanation": "There are two charge signs, positive and negative. Like charges repel and unlike charges attract. Charge is conserved and quantised in units of the elementary charge. Coulomb’s law describes the force between point charges: F = k|q₁q₂|/r².",
    "deeper": "The electric field E is force per unit positive test charge. For a point charge E = kq/r² radially. Electric potential is potential energy per unit charge. Fields obey superposition, and Gauss’s law relates electric flux through a closed surface to enclosed charge.",
    "diagram": "forces"
  },
  {
    "subject": "Physics",
    "title": "Electric circuits and Ohm’s law",
    "level": "secondary",
    "summary": "An electric circuit provides a closed path through which charge can move.",
    "simple": "A battery provides a push that can drive charge around a complete circuit.",
    "explanation": "Current I is charge flow per unit time; potential difference is energy transferred per unit charge. For an ohmic conductor at constant physical conditions, V = IR. In series, current is the same through each component; in parallel, voltage is the same across branches.",
    "deeper": "Kirchhoff’s current law follows charge conservation at a junction; Kirchhoff’s voltage law follows energy conservation around a loop. Electrical power can be calculated as P = VI, I²R or V²/R. Real components may be non-ohmic, and internal resistance causes terminal voltage to differ from emf under load.",
    "diagram": "energy"
  },
  {
    "subject": "Physics",
    "title": "Magnetism and electromagnetic induction",
    "level": "college",
    "summary": "Magnetic fields exert forces on moving charges and currents; changing magnetic flux can induce an emf.",
    "simple": "A magnet can affect a compass, and a moving magnet can help generate electricity in a coil.",
    "explanation": "A moving charge experiences magnetic force qvB sinθ. A straight current-carrying wire in a magnetic field experiences a force whose direction depends on current and field orientation. Magnetic field lines form closed loops.",
    "deeper": "Faraday’s law states that induced emf equals the negative rate of change of magnetic flux linkage. Lenz’s law gives the direction: the induced effect opposes the change that produces it. These principles underpin generators, transformers, induction motors and many sensors.",
    "diagram": "forces"
  },
  {
    "subject": "Chemistry",
    "title": "The periodic table and periodic trends",
    "level": "secondary",
    "summary": "The periodic table arranges elements by atomic number and recurring chemical properties.",
    "simple": "Elements are organised so that families with similar behaviour appear in columns.",
    "explanation": "Rows are periods and columns are groups. Elements in a group often share valence-electron patterns, which helps explain similar chemistry. Across a period, effective nuclear charge generally increases; down a group, additional electron shells are added.",
    "deeper": "Atomic radius, first ionisation energy, electron affinity and electronegativity show periodic patterns, with important exceptions caused by subshell structure and electron pairing. The modern table reflects quantum-mechanical electron configurations and the filling of s, p, d and f subshells.",
    "diagram": "atom"
  },
  {
    "subject": "Chemistry",
    "title": "Stoichiometry and the mole",
    "level": "college",
    "summary": "Stoichiometry uses a balanced chemical equation to relate amounts of reactants and products.",
    "simple": "A balanced recipe tells us how much of each ingredient is needed.",
    "explanation": "The mole is the SI unit for amount of substance. One mole contains exactly 6.02214076 × 10²³ specified entities. A balanced equation gives particle-number ratios, which become mole ratios in calculations. Mass can be converted to amount using n = m/M.",
    "deeper": "A typical calculation converts given quantities to moles, applies the coefficient ratio, then converts to the requested unit. Limiting reactant analysis identifies which reactant is consumed first. Theoretical yield follows from stoichiometry; percentage yield compares actual yield with theoretical yield. Purity and measurement uncertainty affect real results.",
    "diagram": "reaction"
  },
  {
    "subject": "Chemistry",
    "title": "Gas laws and kinetic molecular theory",
    "level": "college",
    "summary": "Gas laws relate pressure, volume, temperature and amount of gas.",
    "simple": "Heating a gas or squeezing it into a smaller space changes how it behaves.",
    "explanation": "For a fixed amount of ideal gas, Boyle’s law gives P ∝ 1/V at constant temperature, and Charles’s law gives V ∝ T at constant pressure. The combined ideal gas equation is PV = nRT, with temperature in kelvin.",
    "deeper": "Kinetic molecular theory models gas particles as moving randomly with negligible volume and no intermolecular forces except during elastic collisions. Real gases deviate most at high pressure and low temperature. The van der Waals equation introduces corrections for molecular size and attractions.",
    "diagram": "energy"
  },
  {
    "subject": "Chemistry",
    "title": "Chemical kinetics and reaction rates",
    "level": "college",
    "summary": "Chemical kinetics studies how fast reactions occur and what controls their rates.",
    "simple": "Some reactions happen quickly; others take a long time. Conditions can change the speed.",
    "explanation": "Reaction rate describes concentration change per unit time. Rate can depend on reactant concentration, temperature, surface area, catalysts and the reaction mechanism. A rate law such as rate = k[A]ᵐ[B]ⁿ is determined experimentally, not simply read from the balanced equation.",
    "deeper": "Reaction order is the sum of experimentally determined exponents. Integrated rate laws connect concentration and time for zero-, first- and second-order reactions. The Arrhenius equation k = Ae^(−Ea/RT) links rate constant to temperature and activation energy. Catalysts provide an alternative pathway and are regenerated overall.",
    "diagram": "reaction"
  },
  {
    "subject": "Chemistry",
    "title": "Chemical equilibrium and Le Chatelier’s principle",
    "level": "college",
    "summary": "At dynamic equilibrium, forward and reverse reaction rates are equal.",
    "simple": "Both directions continue, but at matching rates, so measured concentrations stay steady.",
    "explanation": "For a reversible reaction, equilibrium is reached in a closed system when forward and reverse rates become equal. The equilibrium constant K expresses the ratio of product and reactant activities, each raised to its stoichiometric coefficient. Pure solids and liquids are omitted from the usual equilibrium expression.",
    "deeper": "The reaction quotient Q has the same form as K and predicts the direction of net change: when Q is less than K, net change favours products; when Q is greater than K, net change favours reactants. Temperature changes K; concentration and pressure changes alter Q and the equilibrium composition. A catalyst speeds both directions and does not change K or the equilibrium position.",
    "diagram": "reaction"
  },
  {
    "subject": "Chemistry",
    "title": "Acids, bases and pH",
    "level": "secondary",
    "summary": "Acids and bases are described by several complementary models; pH measures hydrogen-ion activity.",
    "simple": "pH is a scale that helps describe how acidic or basic a solution is.",
    "explanation": "In the Arrhenius model, acids increase H₃O⁺ in water and bases increase OH⁻. Brønsted–Lowry acids donate protons and bases accept them. For dilute aqueous solutions at 25 °C, pH = −log₁₀[H₃O⁺] is a useful approximation.",
    "deeper": "The conjugate acid–base pair differs by one proton. Strong acids ionise extensively; weak acids establish equilibria described by Ka. Buffers resist pH change because they contain a weak acid/base pair. At 25 °C, pH + pOH = 14.00 for ideal dilute aqueous conditions.",
    "diagram": "reaction"
  },
  {
    "subject": "Chemistry",
    "title": "Oxidation and reduction",
    "level": "college",
    "summary": "Redox reactions involve electron transfer or changes in oxidation state.",
    "simple": "One species loses electrons while another gains them.",
    "explanation": "Oxidation is loss of electrons and reduction is gain of electrons. Oxidation numbers provide a bookkeeping method for tracking electron redistribution. The oxidising agent is reduced; the reducing agent is oxidised.",
    "deeper": "Redox equations can be balanced using half-reactions, conserving atoms and charge. In electrochemical cells, spontaneous redox reactions can produce electrical energy. Standard electrode potentials help predict cell emf under standard conditions, while the Nernst equation accounts for non-standard concentrations and pressures.",
    "diagram": "reaction"
  },
  {
    "subject": "Biology",
    "title": "Cell membrane structure and transport",
    "level": "college",
    "summary": "The cell membrane is a selectively permeable boundary that regulates exchange with the environment.",
    "simple": "A cell membrane works like a flexible security boundary, controlling what enters and leaves.",
    "explanation": "The fluid-mosaic model describes a phospholipid bilayer with embedded proteins, cholesterol and carbohydrate groups. Small non-polar molecules can diffuse through the lipid region; ions and many polar molecules need transport proteins.",
    "deeper": "Passive transport follows electrochemical gradients without direct metabolic energy input. Active transport couples movement to an energy source, such as ATP hydrolysis or an ion gradient. Endocytosis and exocytosis move larger materials using membrane vesicles. Membrane potential arises from unequal ion distributions and selective permeability.",
    "diagram": "cell"
  },
  {
    "subject": "Biology",
    "title": "Cellular respiration and ATP",
    "level": "college",
    "summary": "Cellular respiration transfers energy from fuel molecules into ATP and other usable forms.",
    "simple": "Cells break down food molecules and capture some released energy in ATP.",
    "explanation": "Aerobic respiration commonly includes glycolysis, pyruvate oxidation, the citric acid cycle and oxidative phosphorylation. Glycolysis occurs in the cytosol; in eukaryotes, later stages occur in mitochondria. Oxygen is the final electron acceptor in the mitochondrial electron-transport chain.",
    "deeper": "Electron transfer drives proton pumping across the inner mitochondrial membrane. The resulting electrochemical gradient powers ATP synthase through chemiosmosis. Actual ATP yield varies with cell type, shuttle systems, coupling efficiency and substrate. Fermentation regenerates NAD⁺ when oxidative phosphorylation is unavailable.",
    "diagram": "energy"
  },
  {
    "subject": "Biology",
    "title": "DNA, genes and chromosomes",
    "level": "college",
    "summary": "DNA stores hereditary information; genes are functional regions of DNA and chromosomes organise long DNA molecules.",
    "simple": "DNA is a molecule containing instructions that cells can copy and use.",
    "explanation": "DNA is composed of nucleotides with a sugar-phosphate backbone and nitrogenous bases A, T, C and G. In the usual double helix, A pairs with T and C pairs with G. A gene is a DNA sequence that contributes to a functional RNA or protein product.",
    "deeper": "DNA replication is semiconservative: each daughter molecule contains one parental strand and one newly synthesised strand. Gene expression includes transcription and, for protein-coding genes, translation. Regulation occurs at multiple levels, and mutations can be neutral, harmful or beneficial depending on context.",
    "diagram": "cell"
  },
  {
    "subject": "Biology",
    "title": "Mendelian genetics and inheritance",
    "level": "secondary",
    "summary": "Mendelian genetics uses alleles and inheritance patterns to predict possible offspring genotypes.",
    "simple": "You inherit versions of genes from your biological parents.",
    "explanation": "An allele is a version of a gene. In a simple diploid model, an individual carries two alleles at a locus. A dominant allele can affect phenotype in a heterozygote; a recessive phenotype generally requires two recessive alleles in a complete-dominance model.",
    "deeper": "A Punnett square organises possible gamete combinations but does not guarantee a particular outcome in a small family. Independent assortment applies to genes that assort independently, while linked genes tend to be inherited together. Real traits may be polygenic, influenced by environment, or show incomplete dominance and codominance.",
    "diagram": "cell"
  },
  {
    "subject": "Biology",
    "title": "Evolution by natural selection",
    "level": "college",
    "summary": "Evolution is change in heritable characteristics of populations across generations.",
    "simple": "Populations can change over many generations when inherited differences affect survival or reproduction.",
    "explanation": "Natural selection occurs when individuals vary, some variation is heritable, and differences influence reproductive success. Other mechanisms include mutation, genetic drift and gene flow. Individuals do not evolve during their lifetime in the population-genetic sense; populations change across generations.",
    "deeper": "Fitness is relative reproductive contribution in a particular environment, not simply strength. Selection can be directional, stabilising or disruptive. Evidence for evolution includes fossils, comparative anatomy, biogeography, observed evolutionary change and molecular similarities. Evolution does not have a predetermined goal.",
    "diagram": "cell"
  },
  {
    "subject": "Biology",
    "title": "Ecology, populations and ecosystems",
    "level": "college",
    "summary": "Ecology studies interactions among organisms and between organisms and their environments.",
    "simple": "Living things depend on one another and on the non-living conditions around them.",
    "explanation": "A population is members of one species in an area; a community includes interacting populations; an ecosystem includes the community and abiotic environment. Energy flows through trophic levels, while matter cycles through ecosystems.",
    "deeper": "Population growth depends on births, deaths, immigration and emigration. Exponential growth assumes unlimited resources; logistic models include carrying capacity. Food webs show interconnected feeding relationships. Nutrient cycles, productivity, disturbance, competition, predation and mutualism shape ecosystem structure and function.",
    "diagram": "cell"
  },
  {
    "subject": "Mathematics",
    "title": "Functions, domain and range",
    "level": "foundation",
    "summary": "A function assigns exactly one output to each allowed input.",
    "simple": "A function is a rule: give it an input and it returns one output.",
    "explanation": "A function f maps each element of a domain to exactly one element of a codomain. The range is the set of outputs actually attained. Functions can be represented by formulas, tables, graphs, mappings or verbal rules.",
    "deeper": "Domain restrictions arise from denominators, even roots, logarithms and context. Composition combines functions: (f∘g)(x)=f(g(x)). An inverse exists as a function when the original is one-to-one on the chosen domain. Transformations shift, stretch, compress or reflect graphs.",
    "diagram": "function"
  },
  {
    "subject": "Mathematics",
    "title": "Limits and continuity",
    "level": "college",
    "summary": "A limit describes the value a function approaches as its input approaches a point.",
    "simple": "A limit asks what value a graph is heading toward near a point, even if the point itself is missing.",
    "explanation": "The limit of f(x) as x approaches a is L if values of f(x) can be made arbitrarily close to L by taking x sufficiently close to a, but not necessarily equal to a. Continuity at a requires f(a) to exist, the limit to exist, and both to be equal.",
    "deeper": "Formal epsilon-delta definitions make the idea precise. One-sided limits determine whether a two-sided limit exists. Infinite limits describe unbounded behaviour; limits at infinity describe long-term behaviour. Continuity supports the intermediate value theorem and many calculus results.",
    "diagram": "derivative"
  },
  {
    "subject": "Mathematics",
    "title": "Differentiation and applications",
    "level": "college",
    "summary": "Differentiation measures instantaneous rate of change and gives the slope of a tangent line.",
    "simple": "A derivative tells how quickly a quantity is changing at a particular instant.",
    "explanation": "The derivative is defined by f′(x)=lim(h→0)[f(x+h)−f(x)]/h when the limit exists. Basic rules include the power, constant, sum, product, quotient and chain rules. Derivatives can describe velocity, marginal change and sensitivity.",
    "deeper": "Critical points occur where f′=0 or is undefined within the domain. First- and second-derivative tests help classify local extrema. Implicit differentiation handles relationships not solved explicitly for one variable. Higher derivatives describe changes in rates, such as acceleration as the derivative of velocity.",
    "diagram": "derivative"
  },
  {
    "subject": "Mathematics",
    "title": "Integration and area",
    "level": "college",
    "summary": "Integration accumulates quantities and reverses differentiation under suitable conditions.",
    "simple": "Integration adds many tiny pieces to find a total, such as area under a curve.",
    "explanation": "A definite integral is the limit of a sum of narrow contributions. The Fundamental Theorem of Calculus links differentiation and integration: if F′=f, then ∫ₐᵇ f(x)dx=F(b)−F(a). Indefinite integrals represent families of antiderivatives.",
    "deeper": "Substitution reverses the chain rule; integration by parts reverses the product rule. Definite integrals can represent signed area, displacement, accumulated mass or total change. Improper integrals extend integration to infinite intervals or unbounded integrands using limits.",
    "diagram": "derivative"
  },
  {
    "subject": "Mathematics",
    "title": "Complex numbers and the Argand plane",
    "level": "college",
    "summary": "A complex number has a real part and an imaginary part and can be represented as a point in a plane.",
    "simple": "Complex numbers extend the number system so equations such as x² = −1 have solutions.",
    "explanation": "A complex number is z=a+bi, where a and b are real and i²=−1. The real part is a and imaginary part is b. Its modulus is |z|=√(a²+b²), and its argument is the angle from the positive real axis.",
    "deeper": "Polar form is z=r(cosθ+i sinθ). Multiplication multiplies moduli and adds arguments; division divides moduli and subtracts arguments. De Moivre’s theorem gives [r(cosθ+i sinθ)]ⁿ=rⁿ(cos nθ+i sin nθ). The principal argument is commonly chosen in (−π,π] or another stated interval.",
    "diagram": "function"
  },
  {
    "subject": "Mathematics",
    "title": "Probability and distributions",
    "level": "college",
    "summary": "Probability quantifies uncertainty using values from zero to one.",
    "simple": "Probability measures how likely an event is, from impossible to certain.",
    "explanation": "For equally likely outcomes, P(A)=number of favourable outcomes/total outcomes. The complement rule is P(Aᶜ)=1−P(A). For independent events, P(A∩B)=P(A)P(B); conditional probability is P(A|B)=P(A∩B)/P(B) when P(B)>0.",
    "deeper": "Random variables map outcomes to numerical values. A probability distribution describes their possible values and probabilities. Expected value is a probability-weighted mean; variance measures spread. Binomial, geometric, Poisson and normal distributions model different settings under specific assumptions.",
    "diagram": "function"
  },
  {
    "subject": "Mathematics",
    "title": "Matrices and linear systems",
    "level": "college",
    "summary": "Matrices organise numbers and represent linear transformations and systems of equations.",
    "simple": "A matrix is a rectangular arrangement of numbers that can help solve several equations together.",
    "explanation": "A matrix has rows and columns. Matrix addition requires equal dimensions; multiplication requires compatible inner dimensions. A system of linear equations can be written Ax=b. Row operations produce an equivalent system and can be used in Gaussian elimination.",
    "deeper": "A square matrix is invertible when its determinant is nonzero. The determinant describes signed volume scaling and helps test invertibility. Eigenvectors satisfy Av=λv and identify directions preserved by a linear transformation, scaled by eigenvalue λ. Numerical conditioning matters when solving real-world systems.",
    "diagram": "function"
  },
  {
    "subject": "Computer Science",
    "title": "Algorithms and computational thinking",
    "level": "foundation",
    "summary": "An algorithm is a finite, unambiguous sequence of steps for solving a problem.",
    "simple": "An algorithm is a clear recipe that a computer or person can follow to complete a task.",
    "explanation": "Computational thinking includes decomposition, pattern recognition, abstraction and algorithm design. An algorithm needs defined inputs, outputs and steps, and should terminate. Pseudocode and flowcharts help describe logic independently of a programming language.",
    "deeper": "Correctness asks whether an algorithm returns the required result for all valid inputs. Efficiency is commonly analysed using time and space complexity. Big-O notation describes asymptotic growth, helping compare algorithms as input size increases. Testing should include normal, boundary and invalid cases.",
    "diagram": "binary"
  },
  {
    "subject": "Computer Science",
    "title": "Data structures: arrays, lists, stacks and queues",
    "level": "college",
    "summary": "Data structures organise data so operations can be performed efficiently.",
    "simple": "Different containers are useful for different kinds of jobs.",
    "explanation": "Arrays store indexed elements; linked lists connect nodes; stacks follow last-in, first-out; queues follow first-in, first-out. Choosing a structure affects access, insertion, deletion and memory behaviour.",
    "deeper": "A stack supports push and pop; a queue supports enqueue and dequeue. Hash tables map keys to buckets using a hash function and require collision handling. Trees represent hierarchical data; graphs represent general relationships. Complexity depends on the implementation and operation.",
    "diagram": "binary"
  },
  {
    "subject": "Computer Science",
    "title": "Computer networks and the internet",
    "level": "college",
    "summary": "A computer network connects devices so they can exchange data and share resources.",
    "simple": "Networks let computers communicate by sending information in agreed formats.",
    "explanation": "Networks use protocols to define addressing, formatting, transmission and error handling. The internet is a network of networks using the TCP/IP protocol suite. IP provides addressing and routing; TCP provides reliable ordered byte-stream delivery; UDP provides datagrams with lower overhead.",
    "deeper": "DNS maps domain names to records such as IP addresses. HTTP defines web request-response semantics; TLS protects communication confidentiality and integrity. Routers forward packets between networks, while switches commonly forward frames within local networks. Network performance depends on bandwidth, latency, loss and congestion.",
    "diagram": "binary"
  },
  {
    "subject": "Earth Science",
    "title": "Earth structure, plate tectonics and earthquakes",
    "level": "college",
    "summary": "Earth’s outer shell is divided into moving plates whose interactions shape the surface.",
    "simple": "The ground beneath us is made of large pieces that move slowly over geological time.",
    "explanation": "Earth has a crust, mantle and core. Lithospheric plates move over the mechanically weaker asthenosphere. Divergent boundaries create crust, convergent boundaries consume or thicken crust, and transform boundaries slide past one another.",
    "deeper": "Plate motion is driven by mantle dynamics and gravitational forces associated with slabs and elevated ridges. Earthquakes occur when accumulated stress is released along faults. Seismic waves reveal Earth’s interior; magnitude and intensity describe different aspects of an earthquake.",
    "diagram": "forces"
  },
  {
    "subject": "Earth Science",
    "title": "Weather, climate and the greenhouse effect",
    "level": "college",
    "summary": "Weather describes short-term atmospheric conditions; climate describes long-term statistical patterns.",
    "simple": "Weather is what the atmosphere is doing now; climate is the pattern over many years.",
    "explanation": "Solar energy drives atmospheric circulation and the water cycle. Greenhouse gases absorb and emit infrared radiation, affecting Earth’s energy balance. Water vapour, clouds, oceans, ice and land surfaces create feedbacks in the climate system.",
    "deeper": "The natural greenhouse effect makes Earth warmer than it would otherwise be. Human activities have increased concentrations of carbon dioxide, methane and other greenhouse gases, producing a net warming influence. Climate is assessed through long-term observations, physical theory and model ensembles, with uncertainty ranges.",
    "diagram": "energy"
  },
  {
    "subject": "Statistics",
    "title": "Descriptive statistics and data visualisation",
    "level": "foundation",
    "summary": "Descriptive statistics summarise the centre, spread and shape of a dataset.",
    "simple": "Statistics help turn a long list of numbers into a clearer summary.",
    "explanation": "The mean is the arithmetic average; the median is the middle ordered value; the mode is the most frequent value. Range, interquartile range, variance and standard deviation describe spread. Graphs such as histograms, box plots and scatter plots reveal patterns and unusual observations.",
    "deeper": "The mean is sensitive to extreme values; the median is more resistant. Sample variance uses n−1 in the denominator when estimating population variance without bias under standard assumptions. A graph should show units, labels, scale and source, and should not distort the data.",
    "diagram": "function"
  },
  {
    "subject": "Statistics",
    "title": "Sampling, estimation and confidence intervals",
    "level": "college",
    "summary": "Statistical inference uses sample data to learn about a population while accounting for uncertainty.",
    "simple": "We measure part of a group and use careful methods to estimate something about the whole group.",
    "explanation": "A population is the full group of interest; a sample is the observed subset. Random sampling can reduce selection bias. A statistic estimates a population parameter, and its sampling distribution describes how it varies across repeated samples.",
    "deeper": "A confidence interval is produced by a method that, under its assumptions, captures the true parameter in a stated proportion of repeated samples. A 95% confidence level does not mean there is a 95% probability that a fixed parameter lies in this one computed interval. Sample size, variability and design affect interval width.",
    "diagram": "function"
  }
];

window.CLI_CONTENT.vocabulary = [
  {
    "term": "Amplitude",
    "subject": "Physics",
    "definition": "Maximum displacement from an equilibrium position in an oscillation or wave.",
    "simple": "The greatest distance from the middle position."
  },
  {
    "term": "Angular velocity",
    "subject": "Physics",
    "definition": "Rate of change of angular displacement with time.",
    "simple": "How quickly an object turns."
  },
  {
    "term": "Anode",
    "subject": "Chemistry",
    "definition": "The electrode at which oxidation occurs.",
    "simple": "The electrode where electrons are released by oxidation."
  },
  {
    "term": "Aqueous solution",
    "subject": "Chemistry",
    "definition": "A solution in which water is the solvent.",
    "simple": "A substance dissolved in water."
  },
  {
    "term": "Base",
    "subject": "Chemistry",
    "definition": "A proton acceptor in the Brønsted–Lowry model.",
    "simple": "A substance that can accept a hydrogen ion."
  },
  {
    "term": "Biomolecule",
    "subject": "Biology",
    "definition": "A molecule produced by or found in living organisms, such as proteins, nucleic acids, carbohydrates and lipids.",
    "simple": "A molecule used in living things."
  },
  {
    "term": "Buffer",
    "subject": "Chemistry",
    "definition": "A solution that resists pH change when limited acid or base is added.",
    "simple": "A solution that helps keep pH relatively steady."
  },
  {
    "term": "Capacitance",
    "subject": "Physics",
    "definition": "Charge stored per unit potential difference across a capacitor.",
    "simple": "How much charge a capacitor stores for a given voltage."
  },
  {
    "term": "Catalysis",
    "subject": "Chemistry",
    "definition": "The change in reaction rate caused by a catalyst.",
    "simple": "A catalyst changes how quickly a reaction proceeds."
  },
  {
    "term": "Cation",
    "subject": "Chemistry",
    "definition": "A positively charged ion.",
    "simple": "An atom or group that has lost electrons overall."
  },
  {
    "term": "Chlorophyll",
    "subject": "Biology",
    "definition": "A light-absorbing pigment central to photosynthesis in plants, algae and some bacteria.",
    "simple": "A green pigment that absorbs light for photosynthesis."
  },
  {
    "term": "Chromosome",
    "subject": "Biology",
    "definition": "A DNA-protein structure carrying genetic information.",
    "simple": "A packaged structure containing DNA."
  },
  {
    "term": "Coefficient",
    "subject": "Mathematics",
    "definition": "A numerical factor multiplying a variable or term.",
    "simple": "The number in front of a variable."
  },
  {
    "term": "Concentration",
    "subject": "Chemistry",
    "definition": "Amount of a specified component per unit volume or mass of mixture.",
    "simple": "How much solute is present in a certain amount of solution."
  },
  {
    "term": "Conduction",
    "subject": "Physics",
    "definition": "Transfer of energy through a material by microscopic interactions without bulk movement of the material.",
    "simple": "Energy passing through a material."
  },
  {
    "term": "Conductor",
    "subject": "Physics",
    "definition": "A material that allows charge or heat to move relatively readily.",
    "simple": "A material through which current or heat flows easily."
  },
  {
    "term": "Conservation law",
    "subject": "Physics",
    "definition": "A principle stating that a specified physical quantity remains constant in an isolated system.",
    "simple": "A rule saying a quantity is not lost or created in an isolated system."
  },
  {
    "term": "Covalent radius",
    "subject": "Chemistry",
    "definition": "A measure related to the size of an atom when bonded covalently.",
    "simple": "An estimate of an atom’s size in a covalent bond."
  },
  {
    "term": "Critical point",
    "subject": "Mathematics",
    "definition": "An interior domain point where a derivative is zero or does not exist.",
    "simple": "A point where a graph may turn or change behaviour."
  },
  {
    "term": "Current",
    "subject": "Physics",
    "definition": "Rate of flow of electric charge through a surface.",
    "simple": "How much electric charge passes a point each second."
  },
  {
    "term": "Data structure",
    "subject": "Computer Science",
    "definition": "A way of organising and storing data to support efficient access and modification.",
    "simple": "A format for keeping data organised."
  },
  {
    "term": "Decomposition",
    "subject": "Computer Science",
    "definition": "Breaking a complex problem into smaller manageable subproblems.",
    "simple": "Splitting a large problem into smaller tasks."
  },
  {
    "term": "Density",
    "subject": "Physics",
    "definition": "Mass per unit volume.",
    "simple": "How much mass is packed into a given space."
  },
  {
    "term": "Diffraction",
    "subject": "Physics",
    "definition": "Spreading or bending of waves around obstacles or through openings.",
    "simple": "Waves spreading after passing an edge or gap."
  },
  {
    "term": "Dipole",
    "subject": "Chemistry",
    "definition": "A separation of positive and negative charge in a molecule or system.",
    "simple": "A system with two opposite charge regions."
  },
  {
    "term": "Disaccharide",
    "subject": "Biology",
    "definition": "A carbohydrate composed of two monosaccharide units joined by a glycosidic bond.",
    "simple": "A sugar made from two smaller sugar units."
  },
  {
    "term": "Domain",
    "subject": "Mathematics",
    "definition": "The set of permitted inputs of a function.",
    "simple": "All input values a function is allowed to use."
  },
  {
    "term": "Electrolysis",
    "subject": "Chemistry",
    "definition": "Use of electrical energy to drive a non-spontaneous chemical reaction.",
    "simple": "Using electricity to make a chemical change happen."
  },
  {
    "term": "Electrolyte",
    "subject": "Chemistry",
    "definition": "A substance that produces mobile ions when molten or dissolved and can conduct electricity.",
    "simple": "A liquid or solution that conducts because it contains moving ions."
  },
  {
    "term": "Electron affinity",
    "subject": "Chemistry",
    "definition": "Energy change when a gaseous atom gains an electron.",
    "simple": "How energy changes when an atom accepts an electron."
  },
  {
    "term": "Electronegativity",
    "subject": "Chemistry",
    "definition": "A relative measure of an atom’s ability to attract shared electrons in a bond.",
    "simple": "How strongly an atom pulls shared electrons."
  },
  {
    "term": "Endothermic",
    "subject": "Chemistry",
    "definition": "Describes a process that absorbs heat from its surroundings.",
    "simple": "A process that takes in heat."
  },
  {
    "term": "Entropy",
    "subject": "Physics",
    "definition": "A thermodynamic state function related to energy dispersal and the number of accessible microscopic arrangements.",
    "simple": "A measure connected to how energy and possible arrangements are spread out."
  },
  {
    "term": "Enthalpy",
    "subject": "Chemistry",
    "definition": "A thermodynamic state function H = U + pV.",
    "simple": "A quantity useful for tracking heat changes at constant pressure."
  },
  {
    "term": "Equilibrium constant",
    "subject": "Chemistry",
    "definition": "The value of the reaction quotient at equilibrium for a specified reaction and temperature.",
    "simple": "A number describing the balance of products and reactants at equilibrium."
  },
  {
    "term": "Error",
    "subject": "Statistics",
    "definition": "The difference between an observed or estimated value and a reference or true value.",
    "simple": "The gap between a measured value and the value used for comparison."
  },
  {
    "term": "Exothermic",
    "subject": "Chemistry",
    "definition": "Describes a process that releases heat to its surroundings.",
    "simple": "A process that gives out heat."
  },
  {
    "term": "Feedback",
    "subject": "Earth Science",
    "definition": "A process in which a change influences effects that either amplify or reduce the original change.",
    "simple": "A process that can strengthen or weaken an initial change."
  },
  {
    "term": "Field",
    "subject": "Physics",
    "definition": "A physical quantity assigned to points in space and time.",
    "simple": "A value describing what influence exists at each location."
  },
  {
    "term": "Frequency",
    "subject": "Physics",
    "definition": "Number of cycles or repeated events per unit time.",
    "simple": "How many cycles happen each second."
  },
  {
    "term": "Gene",
    "subject": "Biology",
    "definition": "A DNA sequence contributing to a functional RNA or protein product.",
    "simple": "A section of DNA with instructions for a functional product."
  },
  {
    "term": "Genotype",
    "subject": "Biology",
    "definition": "The genetic constitution or allele combination of an organism at one or more loci.",
    "simple": "The alleles an organism carries."
  },
  {
    "term": "Gradient",
    "subject": "Mathematics",
    "definition": "A vector of partial derivatives describing the direction and rate of greatest increase of a scalar field.",
    "simple": "A way to describe how a quantity changes in space."
  },
  {
    "term": "Half-life",
    "subject": "Chemistry",
    "definition": "Time required for the number of undecayed radioactive nuclei in a sample to fall to half its initial value.",
    "simple": "The time for half the radioactive nuclei in a sample to decay."
  },
  {
    "term": "Hypothesis",
    "subject": "Science",
    "definition": "A proposed explanation or prediction that can be tested against evidence.",
    "simple": "A testable idea about how something works."
  },
  {
    "term": "Inertia",
    "subject": "Physics",
    "definition": "Resistance of an object to changes in its state of motion.",
    "simple": "The tendency of an object to keep its current motion."
  },
  {
    "term": "Inference",
    "subject": "Statistics",
    "definition": "A conclusion about a population or process drawn from data and a model.",
    "simple": "Using sample evidence to reach a conclusion."
  },
  {
    "term": "Isomer",
    "subject": "Chemistry",
    "definition": "One of two or more compounds with the same molecular formula but different structures or arrangements.",
    "simple": "Compounds with the same formula but different structures."
  },
  {
    "term": "Isotope",
    "subject": "Chemistry",
    "definition": "Atoms of the same element with equal proton numbers and different neutron numbers.",
    "simple": "Versions of an element with different neutron counts."
  },
  {
    "term": "Kinetic theory",
    "subject": "Physics",
    "definition": "A model explaining macroscopic properties using motion and interactions of microscopic particles.",
    "simple": "Explaining what we observe by thinking about moving tiny particles."
  },
  {
    "term": "Limiting reagent",
    "subject": "Chemistry",
    "definition": "The reactant that is consumed first and therefore limits the theoretical product amount.",
    "simple": "The ingredient that runs out first in a reaction."
  },
  {
    "term": "Logarithm",
    "subject": "Mathematics",
    "definition": "The inverse operation of exponentiation.",
    "simple": "The power to which a base must be raised to produce a number."
  },
  {
    "term": "Magnitude",
    "subject": "Mathematics",
    "definition": "A numerical measure of size, often used for a vector’s length.",
    "simple": "The size of a quantity, without its direction."
  },
  {
    "term": "Mass number",
    "subject": "Chemistry",
    "definition": "Total number of protons and neutrons in an atomic nucleus.",
    "simple": "The number of particles in the nucleus that are protons or neutrons."
  },
  {
    "term": "Matrix",
    "subject": "Mathematics",
    "definition": "A rectangular array of elements arranged in rows and columns.",
    "simple": "A table of numbers arranged in rows and columns."
  },
  {
    "term": "Metabolism",
    "subject": "Biology",
    "definition": "The network of chemical reactions occurring in an organism or cell.",
    "simple": "All the chemical processes happening in living things."
  },
  {
    "term": "Molarity",
    "subject": "Chemistry",
    "definition": "Amount concentration expressed as moles of solute per litre of solution.",
    "simple": "Moles of solute in one litre of solution."
  },
  {
    "term": "Molecule",
    "subject": "Chemistry",
    "definition": "An electrically neutral group of atoms held together by chemical bonds.",
    "simple": "A group of bonded atoms with no overall electric charge."
  },
  {
    "term": "Mutation",
    "subject": "Biology",
    "definition": "A change in genetic material sequence or structure.",
    "simple": "A change in DNA."
  },
  {
    "term": "Natural selection",
    "subject": "Biology",
    "definition": "Differential reproductive success associated with heritable variation in a population.",
    "simple": "Inherited differences can make some traits more common over generations."
  },
  {
    "term": "Neutron",
    "subject": "Chemistry",
    "definition": "Electrically neutral subatomic particle found in atomic nuclei.",
    "simple": "A particle in the nucleus with no electric charge."
  },
  {
    "term": "Node",
    "subject": "Physics",
    "definition": "A point of zero displacement in a standing-wave pattern.",
    "simple": "A place on a standing wave that stays still."
  },
  {
    "term": "Nucleotide",
    "subject": "Biology",
    "definition": "A nucleic-acid building block containing a sugar, phosphate and nitrogenous base.",
    "simple": "One of the repeating building blocks of DNA or RNA."
  },
  {
    "term": "Ohm",
    "subject": "Physics",
    "definition": "The SI derived unit of electrical resistance, equal to one volt per ampere.",
    "simple": "The unit used to measure resistance."
  },
  {
    "term": "Oxidation",
    "subject": "Chemistry",
    "definition": "Loss of electrons or an increase in oxidation number.",
    "simple": "A process in which a species loses electrons."
  },
  {
    "term": "Parameter",
    "subject": "Mathematics",
    "definition": "A quantity that helps define a mathematical model or family of functions.",
    "simple": "A value that sets or controls a model."
  },
  {
    "term": "Pathogen",
    "subject": "Biology",
    "definition": "A biological agent capable of causing disease.",
    "simple": "A microorganism or agent that can cause illness."
  },
  {
    "term": "Period",
    "subject": "Physics",
    "definition": "Time taken for one complete cycle of a periodic process.",
    "simple": "The time for one full cycle."
  },
  {
    "term": "pH",
    "subject": "Chemistry",
    "definition": "A logarithmic measure related to hydrogen-ion activity in a solution.",
    "simple": "A scale used to describe acidity."
  },
  {
    "term": "Photon",
    "subject": "Physics",
    "definition": "A quantum of electromagnetic radiation.",
    "simple": "A tiny packet of light energy."
  },
  {
    "term": "Polymer",
    "subject": "Chemistry",
    "definition": "A large molecule composed of repeating structural units.",
    "simple": "A large molecule made from many repeating smaller units."
  },
  {
    "term": "Population",
    "subject": "Biology",
    "definition": "A group of individuals of the same species occupying an area at a given time.",
    "simple": "Members of one species living in an area."
  },
  {
    "term": "Potential difference",
    "subject": "Physics",
    "definition": "Energy transferred per unit charge between two points.",
    "simple": "The energy change per unit charge between two places in a circuit."
  },
  {
    "term": "Precision",
    "subject": "Statistics",
    "definition": "Closeness of agreement among repeated measurements or estimates.",
    "simple": "How consistent repeated measurements are."
  },
  {
    "term": "Probability",
    "subject": "Mathematics",
    "definition": "A numerical measure of the likelihood of an event, between zero and one.",
    "simple": "A number describing how likely an event is."
  },
  {
    "term": "Product",
    "subject": "Mathematics",
    "definition": "The result of multiplication.",
    "simple": "The answer obtained when numbers are multiplied."
  },
  {
    "term": "Protein",
    "subject": "Biology",
    "definition": "A polymer of amino acids that folds into a structure with biological function.",
    "simple": "A molecule made of amino acids that performs many jobs in cells."
  },
  {
    "term": "Reactant",
    "subject": "Chemistry",
    "definition": "A starting substance consumed or transformed in a chemical reaction.",
    "simple": "A substance present at the start of a reaction."
  },
  {
    "term": "Resistance",
    "subject": "Physics",
    "definition": "A measure of opposition to electric current.",
    "simple": "How strongly a component opposes current."
  },
  {
    "term": "Scalar",
    "subject": "Physics",
    "definition": "A quantity described by magnitude alone.",
    "simple": "A quantity with size but no direction."
  },
  {
    "term": "Selection pressure",
    "subject": "Biology",
    "definition": "An environmental factor that causes differences in reproductive success among variants.",
    "simple": "An environmental condition that favours some inherited traits over others."
  },
  {
    "term": "Solute",
    "subject": "Chemistry",
    "definition": "A substance dissolved in a solvent to form a solution.",
    "simple": "The substance that gets dissolved."
  },
  {
    "term": "Solvent",
    "subject": "Chemistry",
    "definition": "The component of a solution that dissolves the solute.",
    "simple": "The liquid or material that dissolves another substance."
  },
  {
    "term": "Standard deviation",
    "subject": "Statistics",
    "definition": "The positive square root of variance, measuring spread in the data’s units.",
    "simple": "A measure of how spread out values are around the mean."
  },
  {
    "term": "Substrate",
    "subject": "Biology",
    "definition": "A molecule on which an enzyme acts.",
    "simple": "The molecule an enzyme works on."
  },
  {
    "term": "Titration",
    "subject": "Chemistry",
    "definition": "A method for determining an analyte amount using a measured volume of standard reagent.",
    "simple": "A lab method using measured solution volumes to find concentration."
  },
  {
    "term": "Torque",
    "subject": "Physics",
    "definition": "The turning effect of a force about an axis or point.",
    "simple": "How strongly a force tends to rotate an object."
  },
  {
    "term": "Transcription",
    "subject": "Biology",
    "definition": "Synthesis of RNA using a DNA template.",
    "simple": "Making an RNA copy from DNA information."
  },
  {
    "term": "Translation",
    "subject": "Biology",
    "definition": "Synthesis of a polypeptide using the information in messenger RNA.",
    "simple": "Using RNA instructions to build a protein chain."
  },
  {
    "term": "Vector",
    "subject": "Mathematics",
    "definition": "A quantity with magnitude and direction, represented in a vector space.",
    "simple": "A quantity with both size and direction."
  },
  {
    "term": "Velocity",
    "subject": "Physics",
    "definition": "Rate of change of displacement with time.",
    "simple": "How quickly position changes and in which direction."
  },
  {
    "term": "Viscosity",
    "subject": "Physics",
    "definition": "A measure of a fluid’s resistance to flow or internal deformation.",
    "simple": "How much a fluid resists flowing."
  },
  {
    "term": "Wavelength",
    "subject": "Physics",
    "definition": "Distance between corresponding points on successive wave cycles.",
    "simple": "The distance covered by one complete wave cycle."
  },
  {
    "term": "Work",
    "subject": "Physics",
    "definition": "Energy transferred by a force acting through displacement.",
    "simple": "Energy transferred when a force moves something."
  },
  {
    "term": "Yield",
    "subject": "Chemistry",
    "definition": "Amount of product obtained from a chemical reaction.",
    "simple": "How much product a reaction produces."
  },
  {
    "term": "Allele",
    "subject": "Biology",
    "definition": "An alternative version of a gene at a particular locus.",
    "simple": "One version of a gene."
  },
  {
    "term": "Apoptosis",
    "subject": "Biology",
    "definition": "A regulated process of programmed cell death.",
    "simple": "A controlled process cells use to dismantle themselves."
  },
  {
    "term": "Biodiversity",
    "subject": "Biology",
    "definition": "Variety of life across genetic, species and ecosystem levels.",
    "simple": "The variety of living things."
  },
  {
    "term": "Carrying capacity",
    "subject": "Biology",
    "definition": "Population size an environment can sustain over time under specified conditions.",
    "simple": "The population an environment can support over time."
  },
  {
    "term": "Centripetal acceleration",
    "subject": "Physics",
    "definition": "Acceleration directed toward the centre of a curved path.",
    "simple": "The inward acceleration of an object moving in a circle."
  },
  {
    "term": "Derivative",
    "subject": "Mathematics",
    "definition": "The limit defining instantaneous rate of change of a function.",
    "simple": "The rate at which a function changes at one input."
  },
  {
    "term": "Eigenvalue",
    "subject": "Mathematics",
    "definition": "A scalar λ for which a nonzero vector v satisfies Av=λv.",
    "simple": "A scaling factor associated with a special direction of a matrix."
  },
  {
    "term": "Enzyme",
    "subject": "Biology",
    "definition": "A biological catalyst that increases reaction rate without being consumed overall.",
    "simple": "A biological molecule that speeds up a reaction."
  },
  {
    "term": "Flux",
    "subject": "Physics",
    "definition": "A measure of a field passing through a surface.",
    "simple": "How much of a field passes through a surface."
  },
  {
    "term": "Homologue",
    "subject": "Biology",
    "definition": "A chromosome or gene related by shared evolutionary ancestry.",
    "simple": "A related chromosome or gene inherited from a common ancestor."
  },
  {
    "term": "Interference",
    "subject": "Physics",
    "definition": "Combination of waves producing a resultant displacement pattern.",
    "simple": "What happens when waves overlap."
  },
  {
    "term": "Isotonic solution",
    "subject": "Biology",
    "definition": "A solution with equal effective osmotic pressure to the reference solution across a membrane.",
    "simple": "A solution that does not cause a net water shift under the stated conditions."
  },
  {
    "term": "Mitochondrion",
    "subject": "Biology",
    "definition": "A membrane-bound organelle central to aerobic energy metabolism in eukaryotic cells.",
    "simple": "A cell structure where much aerobic ATP production takes place."
  },
  {
    "term": "Osmosis",
    "subject": "Biology",
    "definition": "Net movement of water across a selectively permeable membrane down water potential.",
    "simple": "Water moving through a selective membrane."
  },
  {
    "term": "p-value",
    "subject": "Statistics",
    "definition": "Under a specified null model, probability of results at least as extreme as observed.",
    "simple": "How unusual the data would be if the null model were true."
  },
  {
    "term": "Resonance",
    "subject": "Physics",
    "definition": "Large response when a system is driven near one of its natural frequencies.",
    "simple": "A system responds strongly when driven at a suitable frequency."
  },
  {
    "term": "Standard error",
    "subject": "Statistics",
    "definition": "Standard deviation of a statistic’s sampling distribution.",
    "simple": "How much a sample estimate would vary across repeated samples."
  },
  {
    "term": "Vector field",
    "subject": "Mathematics",
    "definition": "A function assigning a vector to each point in a region.",
    "simple": "A map showing a vector at every location."
  },
  {
    "term": "Voltmeter",
    "subject": "Physics",
    "definition": "An instrument used to measure potential difference, connected in parallel with a component.",
    "simple": "A device used to measure voltage."
  }
];

window.CLI_CONTENT.formulas = [
  {
    "category": "Physics",
    "name": "Displacement at constant velocity",
    "equation": "s = vt",
    "description": "Displacement equals velocity multiplied by elapsed time.",
    "keywords": "displacement · velocity · time"
  },
  {
    "category": "Physics",
    "name": "Uniform acceleration: velocity",
    "equation": "v = u + at",
    "description": "Final velocity after constant acceleration.",
    "keywords": "final velocity · initial velocity · acceleration · time"
  },
  {
    "category": "Physics",
    "name": "Uniform acceleration: displacement",
    "equation": "s = ut + ½at²",
    "description": "Displacement under constant acceleration.",
    "keywords": "displacement · initial velocity · acceleration · time"
  },
  {
    "category": "Physics",
    "name": "Velocity-displacement relation",
    "equation": "v² = u² + 2as",
    "description": "Kinematic relation when time is not given.",
    "keywords": "velocity · acceleration · displacement"
  },
  {
    "category": "Physics",
    "name": "Newton’s second law",
    "equation": "ΣF = ma",
    "description": "Net force equals mass times acceleration for constant mass.",
    "keywords": "force · mass · acceleration"
  },
  {
    "category": "Physics",
    "name": "Momentum",
    "equation": "p = mv",
    "description": "Linear momentum of a body.",
    "keywords": "momentum · mass · velocity"
  },
  {
    "category": "Physics",
    "name": "Impulse",
    "equation": "J = FΔt = Δp",
    "description": "Impulse equals change in momentum.",
    "keywords": "impulse · force · time · momentum"
  },
  {
    "category": "Physics",
    "name": "Centripetal acceleration",
    "equation": "aᶜ = v²/r = ω²r",
    "description": "Inward acceleration in circular motion.",
    "keywords": "acceleration · speed · radius · angular speed"
  },
  {
    "category": "Physics",
    "name": "Angular speed",
    "equation": "ω = 2πf = 2π/T",
    "description": "Angular frequency for periodic rotation.",
    "keywords": "angular speed · frequency · period"
  },
  {
    "category": "Physics",
    "name": "Gravitational force",
    "equation": "F = Gm₁m₂/r²",
    "description": "Newtonian gravitational force between point masses.",
    "keywords": "force · masses · separation"
  },
  {
    "category": "Physics",
    "name": "Gravitational field strength",
    "equation": "g = GM/r²",
    "description": "Field strength around a spherical mass outside it.",
    "keywords": "field strength · mass · radius"
  },
  {
    "category": "Physics",
    "name": "Kinetic energy",
    "equation": "Eₖ = ½mv²",
    "description": "Translational kinetic energy at non-relativistic speed.",
    "keywords": "energy · mass · speed"
  },
  {
    "category": "Physics",
    "name": "Gravitational potential energy",
    "equation": "ΔEₚ = mgΔh",
    "description": "Near-Earth change in gravitational potential energy.",
    "keywords": "energy · mass · gravity · height"
  },
  {
    "category": "Physics",
    "name": "Work by constant force",
    "equation": "W = Fs cos θ",
    "description": "Work done by a constant force over displacement.",
    "keywords": "work · force · displacement · angle"
  },
  {
    "category": "Physics",
    "name": "Power",
    "equation": "P = W/t",
    "description": "Average power is work transferred per time.",
    "keywords": "power · work · time"
  },
  {
    "category": "Physics",
    "name": "Hooke’s law",
    "equation": "F = −kx",
    "description": "Restoring force of an ideal spring within its linear range.",
    "keywords": "force · spring constant · extension"
  },
  {
    "category": "Physics",
    "name": "Spring period",
    "equation": "T = 2π√(m/k)",
    "description": "Period of an ideal mass-spring oscillator.",
    "keywords": "period · mass · spring constant"
  },
  {
    "category": "Physics",
    "name": "Wave speed",
    "equation": "v = fλ",
    "description": "Wave speed equals frequency times wavelength.",
    "keywords": "speed · frequency · wavelength"
  },
  {
    "category": "Physics",
    "name": "Refractive index",
    "equation": "n = c/v",
    "description": "Refractive index in terms of light speed in vacuum and medium.",
    "keywords": "index · light speed"
  },
  {
    "category": "Physics",
    "name": "Snell’s law",
    "equation": "n₁ sin θ₁ = n₂ sin θ₂",
    "description": "Refraction at an interface between two media.",
    "keywords": "refractive indices · angles"
  },
  {
    "category": "Physics",
    "name": "Coulomb’s law",
    "equation": "F = k|q₁q₂|/r²",
    "description": "Magnitude of electrostatic force between point charges.",
    "keywords": "force · charges · distance"
  },
  {
    "category": "Physics",
    "name": "Electric field",
    "equation": "E = F/q",
    "description": "Electric force per unit positive test charge.",
    "keywords": "field · force · charge"
  },
  {
    "category": "Physics",
    "name": "Potential difference",
    "equation": "V = W/q",
    "description": "Energy transferred per unit charge.",
    "keywords": "voltage · work · charge"
  },
  {
    "category": "Physics",
    "name": "Ohm’s law",
    "equation": "V = IR",
    "description": "For an ohmic conductor at constant physical conditions.",
    "keywords": "voltage · current · resistance"
  },
  {
    "category": "Physics",
    "name": "Electrical power",
    "equation": "P = VI = I²R = V²/R",
    "description": "Power in a resistive component.",
    "keywords": "power · voltage · current · resistance"
  },
  {
    "category": "Physics",
    "name": "Resistance of a uniform wire",
    "equation": "R = ρL/A",
    "description": "Resistance from resistivity, length and cross-sectional area.",
    "keywords": "resistance · resistivity · length · area"
  },
  {
    "category": "Physics",
    "name": "Capacitance",
    "equation": "C = Q/V",
    "description": "Charge stored per potential difference.",
    "keywords": "capacitance · charge · voltage"
  },
  {
    "category": "Physics",
    "name": "Capacitor energy",
    "equation": "E = ½CV²",
    "description": "Energy stored in an ideal capacitor.",
    "keywords": "energy · capacitance · voltage"
  },
  {
    "category": "Physics",
    "name": "Magnetic force on a wire",
    "equation": "F = BIL sin θ",
    "description": "Force on a straight current-carrying conductor in a magnetic field.",
    "keywords": "force · field · current · length"
  },
  {
    "category": "Physics",
    "name": "Magnetic flux",
    "equation": "Φ = BA cos θ",
    "description": "Flux through a flat area in a uniform magnetic field.",
    "keywords": "flux · field · area · angle"
  },
  {
    "category": "Physics",
    "name": "Faraday’s law",
    "equation": "ε = −N(dΦ/dt)",
    "description": "Induced emf from changing magnetic flux linkage.",
    "keywords": "emf · turns · flux · time"
  },
  {
    "category": "Physics",
    "name": "Heat transfer",
    "equation": "Q = mcΔT",
    "description": "Thermal energy change for a substance with constant specific heat capacity.",
    "keywords": "heat · mass · specific heat · temperature"
  },
  {
    "category": "Physics",
    "name": "Latent heat",
    "equation": "Q = mL",
    "description": "Energy transferred during a phase change at constant temperature.",
    "keywords": "heat · mass · specific latent heat"
  },
  {
    "category": "Physics",
    "name": "Ideal gas equation",
    "equation": "PV = nRT",
    "description": "Equation of state for an ideal gas.",
    "keywords": "pressure · volume · moles · gas constant · temperature"
  },
  {
    "category": "Physics",
    "name": "First law of thermodynamics",
    "equation": "ΔU = Q − W",
    "description": "Using the convention that W is work done by the system.",
    "keywords": "internal energy · heat · work"
  },
  {
    "category": "Chemistry",
    "name": "Amount of substance",
    "equation": "n = m/M",
    "description": "Moles equal mass divided by molar mass.",
    "keywords": "moles · mass · molar mass"
  },
  {
    "category": "Chemistry",
    "name": "Number of entities",
    "equation": "N = nNₐ",
    "description": "Number of entities from amount in moles.",
    "keywords": "entities · moles · Avogadro constant"
  },
  {
    "category": "Chemistry",
    "name": "Molar concentration",
    "equation": "c = n/V",
    "description": "Amount concentration in moles per unit volume.",
    "keywords": "concentration · moles · volume"
  },
  {
    "category": "Chemistry",
    "name": "Dilution equation",
    "equation": "C₁V₁ = C₂V₂",
    "description": "Dilution relation when solute amount is conserved.",
    "keywords": "concentration · volume"
  },
  {
    "category": "Chemistry",
    "name": "Ideal gas equation",
    "equation": "PV = nRT",
    "description": "Relates pressure, volume, amount and absolute temperature.",
    "keywords": "pressure · volume · moles · temperature"
  },
  {
    "category": "Chemistry",
    "name": "pH",
    "equation": "pH = −log₁₀ a(H₃O⁺)",
    "description": "pH in terms of hydrogen-ion activity.",
    "keywords": "pH · activity"
  },
  {
    "category": "Chemistry",
    "name": "Water ion product",
    "equation": "Kᵥ = [H₃O⁺][OH⁻]",
    "description": "Ion product for water at a specified temperature.",
    "keywords": "equilibrium constant · concentrations"
  },
  {
    "category": "Chemistry",
    "name": "Equilibrium constant",
    "equation": "Kc = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ",
    "description": "For aA+bB ⇌ cC+dD, using equilibrium concentrations.",
    "keywords": "equilibrium · concentrations · coefficients"
  },
  {
    "category": "Chemistry",
    "name": "Reaction quotient",
    "equation": "Q = products/reactants",
    "description": "Same algebraic form as K but evaluated at current composition.",
    "keywords": "reaction quotient · composition"
  },
  {
    "category": "Chemistry",
    "name": "Arrhenius equation",
    "equation": "k = Ae^(−Ea/RT)",
    "description": "Temperature dependence of a reaction rate constant.",
    "keywords": "rate constant · activation energy · temperature"
  },
  {
    "category": "Chemistry",
    "name": "Rate of reaction",
    "equation": "rate = −Δ[reactant]/Δt",
    "description": "Average disappearance rate of a reactant, with stoichiometric adjustment when needed.",
    "keywords": "rate · concentration · time"
  },
  {
    "category": "Chemistry",
    "name": "Percentage yield",
    "equation": "% yield = actual/theoretical × 100%",
    "description": "Compares actual product with theoretical maximum.",
    "keywords": "yield · actual · theoretical"
  },
  {
    "category": "Chemistry",
    "name": "Percentage purity",
    "equation": "% purity = pure mass/sample mass × 100%",
    "description": "Mass fraction expressed as a percentage.",
    "keywords": "purity · mass"
  },
  {
    "category": "Chemistry",
    "name": "Density",
    "equation": "ρ = m/V",
    "description": "Mass per unit volume.",
    "keywords": "density · mass · volume"
  },
  {
    "category": "Chemistry",
    "name": "Heat change",
    "equation": "q = mcΔT",
    "description": "Heat absorbed or released for a temperature change.",
    "keywords": "heat · mass · specific heat · temperature"
  },
  {
    "category": "Chemistry",
    "name": "Gibbs free energy",
    "equation": "ΔG = ΔH − TΔS",
    "description": "At constant temperature and pressure, indicates spontaneity through sign of ΔG.",
    "keywords": "free energy · enthalpy · entropy · temperature"
  },
  {
    "category": "Chemistry",
    "name": "Nernst equation",
    "equation": "E = E° − (RT/nF)ln Q",
    "description": "Cell potential under non-standard conditions.",
    "keywords": "potential · temperature · electrons · reaction quotient"
  },
  {
    "category": "Chemistry",
    "name": "Faraday electrolysis",
    "equation": "Q = It",
    "description": "Charge passed equals current times time.",
    "keywords": "charge · current · time"
  },
  {
    "category": "Chemistry",
    "name": "Electrolysis mass",
    "equation": "m = MIt/(zF)",
    "description": "Ideal deposited mass from charge and electron stoichiometry.",
    "keywords": "mass · molar mass · current · time · charge number"
  },
  {
    "category": "Biology",
    "name": "Magnification",
    "equation": "magnification = image size/object size",
    "description": "Ratio of image size to actual object size.",
    "keywords": "magnification · image · actual size"
  },
  {
    "category": "Biology",
    "name": "Population growth (exponential)",
    "equation": "dN/dt = rN",
    "description": "Continuous exponential growth with per-capita rate r.",
    "keywords": "population · growth rate · time"
  },
  {
    "category": "Biology",
    "name": "Logistic population growth",
    "equation": "dN/dt = rN(1−N/K)",
    "description": "Growth with carrying capacity K.",
    "keywords": "population · growth rate · carrying capacity"
  },
  {
    "category": "Biology",
    "name": "Hardy–Weinberg relation",
    "equation": "p² + 2pq + q² = 1",
    "description": "Genotype frequencies for two alleles under ideal equilibrium assumptions.",
    "keywords": "allele frequencies · genotype frequencies"
  },
  {
    "category": "Biology",
    "name": "Photosynthesis (simplified)",
    "equation": "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
    "description": "Simplified overall representation of oxygenic photosynthesis.",
    "keywords": "carbon dioxide · water · glucose · oxygen"
  },
  {
    "category": "Biology",
    "name": "Aerobic respiration (simplified)",
    "equation": "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy",
    "description": "Simplified overall oxidation of glucose.",
    "keywords": "glucose · oxygen · carbon dioxide · water"
  },
  {
    "category": "Biology",
    "name": "Allele frequency",
    "equation": "p = (2AA + Aa)/(2N)",
    "description": "Frequency of allele A in a diploid population sample.",
    "keywords": "allele count · genotype count · population"
  },
  {
    "category": "Mathematics",
    "name": "Quadratic formula",
    "equation": "x = (−b ± √(b²−4ac))/(2a)",
    "description": "Solutions of ax²+bx+c=0, a≠0.",
    "keywords": "roots · coefficients · discriminant"
  },
  {
    "category": "Mathematics",
    "name": "Pythagorean theorem",
    "equation": "a² + b² = c²",
    "description": "For a right-angled triangle with hypotenuse c.",
    "keywords": "triangle · sides"
  },
  {
    "category": "Mathematics",
    "name": "Circle circumference",
    "equation": "C = 2πr",
    "description": "Perimeter of a circle.",
    "keywords": "circumference · radius"
  },
  {
    "category": "Mathematics",
    "name": "Circle area",
    "equation": "A = πr²",
    "description": "Area enclosed by a circle.",
    "keywords": "area · radius"
  },
  {
    "category": "Mathematics",
    "name": "Distance formula",
    "equation": "d = √((x₂−x₁)²+(y₂−y₁)²)",
    "description": "Euclidean distance between two points in a plane.",
    "keywords": "distance · coordinates"
  },
  {
    "category": "Mathematics",
    "name": "Slope of a line",
    "equation": "m = (y₂−y₁)/(x₂−x₁)",
    "description": "Gradient between two distinct points with unequal x-coordinates.",
    "keywords": "slope · coordinates"
  },
  {
    "category": "Mathematics",
    "name": "Arithmetic sequence",
    "equation": "aₙ = a₁ + (n−1)d",
    "description": "Nth term of an arithmetic sequence.",
    "keywords": "term · first term · difference"
  },
  {
    "category": "Mathematics",
    "name": "Geometric sequence",
    "equation": "aₙ = a₁rⁿ⁻¹",
    "description": "Nth term of a geometric sequence.",
    "keywords": "term · first term · ratio"
  },
  {
    "category": "Mathematics",
    "name": "Arithmetic series sum",
    "equation": "Sₙ = n(a₁+aₙ)/2",
    "description": "Sum of the first n terms of an arithmetic sequence.",
    "keywords": "sum · terms"
  },
  {
    "category": "Mathematics",
    "name": "Geometric series sum",
    "equation": "Sₙ = a₁(1−rⁿ)/(1−r)",
    "description": "Finite geometric sum for r≠1.",
    "keywords": "sum · first term · ratio"
  },
  {
    "category": "Mathematics",
    "name": "Binomial theorem",
    "equation": "(x+y)ⁿ = Σ C(n,k)xⁿ⁻ᵏyᵏ",
    "description": "Expansion for a non-negative integer n.",
    "keywords": "binomial · coefficients"
  },
  {
    "category": "Mathematics",
    "name": "Sine rule",
    "equation": "a/sin A = b/sin B = c/sin C",
    "description": "Relates sides and opposite angles in any triangle.",
    "keywords": "sides · angles"
  },
  {
    "category": "Mathematics",
    "name": "Cosine rule",
    "equation": "c² = a²+b²−2ab cos C",
    "description": "Generalises Pythagoras to any triangle.",
    "keywords": "sides · included angle"
  },
  {
    "category": "Mathematics",
    "name": "De Moivre’s theorem",
    "equation": "[r(cosθ+i sinθ)]ⁿ = rⁿ(cos nθ+i sin nθ)",
    "description": "Raises a complex number in polar form to an integer power.",
    "keywords": "complex number · modulus · argument"
  },
  {
    "category": "Mathematics",
    "name": "Euler’s formula",
    "equation": "eⁱθ = cos θ + i sin θ",
    "description": "Connects complex exponentials with trigonometric functions.",
    "keywords": "exponential · cosine · sine"
  },
  {
    "category": "Mathematics",
    "name": "Derivative power rule",
    "equation": "d(xⁿ)/dx = nxⁿ⁻¹",
    "description": "Differentiate a power of x.",
    "keywords": "derivative · exponent"
  },
  {
    "category": "Mathematics",
    "name": "Product rule",
    "equation": "(uv)′ = u′v + uv′",
    "description": "Derivative of a product of differentiable functions.",
    "keywords": "derivative · product"
  },
  {
    "category": "Mathematics",
    "name": "Quotient rule",
    "equation": "(u/v)′ = (u′v−uv′)/v²",
    "description": "Derivative of a quotient where v≠0.",
    "keywords": "derivative · quotient"
  },
  {
    "category": "Mathematics",
    "name": "Chain rule",
    "equation": "dy/dx = (dy/du)(du/dx)",
    "description": "Derivative of a composite function.",
    "keywords": "derivative · composite"
  },
  {
    "category": "Mathematics",
    "name": "Power integral",
    "equation": "∫xⁿdx = xⁿ⁺¹/(n+1)+C",
    "description": "For n≠−1.",
    "keywords": "integral · power"
  },
  {
    "category": "Mathematics",
    "name": "Integration by parts",
    "equation": "∫u dv = uv − ∫v du",
    "description": "Integration identity derived from the product rule.",
    "keywords": "integral · product"
  },
  {
    "category": "Mathematics",
    "name": "Mean",
    "equation": "x̄ = Σxᵢ/n",
    "description": "Arithmetic mean of n observations.",
    "keywords": "mean · observations"
  },
  {
    "category": "Mathematics",
    "name": "Population variance",
    "equation": "σ² = Σ(xᵢ−μ)²/N",
    "description": "Mean squared deviation from population mean.",
    "keywords": "variance · observations"
  },
  {
    "category": "Mathematics",
    "name": "Standard deviation",
    "equation": "σ = √σ²",
    "description": "Square root of population variance.",
    "keywords": "standard deviation · variance"
  },
  {
    "category": "Mathematics",
    "name": "Permutation",
    "equation": "P(n,r) = n!/(n−r)!",
    "description": "Ordered selections of r objects from n distinct objects.",
    "keywords": "permutation · factorial"
  },
  {
    "category": "Mathematics",
    "name": "Combination",
    "equation": "C(n,r) = n!/[r!(n−r)!]",
    "description": "Unordered selections of r objects from n distinct objects.",
    "keywords": "combination · factorial"
  },
  {
    "category": "Mathematics",
    "name": "Conditional probability",
    "equation": "P(A|B) = P(A∩B)/P(B)",
    "description": "For P(B)>0.",
    "keywords": "conditional probability · events"
  },
  {
    "category": "Mathematics",
    "name": "Bayes’ theorem",
    "equation": "P(A|B)=P(B|A)P(A)/P(B)",
    "description": "Updates probability using evidence.",
    "keywords": "prior · likelihood · evidence"
  },
  {
    "category": "Mathematics",
    "name": "Normal distribution standardisation",
    "equation": "z = (x−μ)/σ",
    "description": "Converts a normal variable to standard-score units.",
    "keywords": "z-score · mean · standard deviation"
  },
  {
    "category": "Computer Science",
    "name": "Binary place-value expansion",
    "equation": "N = Σ bᵢ2ⁱ",
    "description": "Unsigned binary number as a sum of powers of two.",
    "keywords": "binary · bits · place values"
  },
  {
    "category": "Computer Science",
    "name": "Storage units",
    "equation": "1 byte = 8 bits",
    "description": "A byte is conventionally eight bits.",
    "keywords": "byte · bit"
  },
  {
    "category": "Computer Science",
    "name": "Amdahl’s law",
    "equation": "Speedup = 1/((1−P)+P/S)",
    "description": "Ideal speedup for a fraction P parallelised by factor S.",
    "keywords": "parallel fraction · speedup"
  },
  {
    "category": "Computer Science",
    "name": "Shannon entropy",
    "equation": "H(X)=−Σp(x)log₂p(x)",
    "description": "Information entropy for a discrete random variable.",
    "keywords": "probability · information"
  }
];

/* Higher-level and research-oriented extensions: conceptual overviews, not substitutes for specialist texts. */
window.CLI_CONTENT.topics.push(
  {subject:'Physics',title:'Special relativity and spacetime',level:'advanced',simple:'Measurements of time and distance depend on the relative motion of observers, while the speed of light in vacuum is invariant.',explanation:'Special relativity is built from two postulates: the laws of physics have the same form in all inertial frames, and light in vacuum has the same speed c for all inertial observers. Consequences include time dilation, length contraction and relativity of simultaneity. The Lorentz factor is γ = 1/√(1−v²/c²).',deeper:'Spacetime events are related by Lorentz transformations, which preserve the spacetime interval. Energy and momentum form a four-vector, with E² = (pc)² + (mc²)². The theory reduces to Newtonian mechanics when speeds are much smaller than c. General relativity extends the framework to gravitation.',diagram:'motion'},
  {subject:'Physics',title:'Quantum mechanics: states and measurement',level:'graduate',simple:'At very small scales, physical systems are described by states that predict probabilities for measurement outcomes.',explanation:'A quantum state is represented by a vector in a complex Hilbert space. Observables are represented by Hermitian operators; possible measurement outcomes correspond to eigenvalues. The Born rule connects amplitudes to probabilities. Superposition means a state can be a linear combination of basis states.',deeper:'Time evolution of a closed non-relativistic system is governed by the Schrödinger equation. Commutators encode compatibility of observables, and uncertainty relations constrain simultaneous spreads. Interpretations differ in how they understand measurement, but experimentally tested predictions are shared across standard formulations.',diagram:'atom'},
  {subject:'Physics',title:'Thermodynamics and statistical mechanics',level:'advanced',simple:'Thermodynamics describes large-scale energy and entropy; statistical mechanics explains these properties using microscopic states.',explanation:'The first law expresses energy conservation. The second law constrains spontaneous processes through entropy. Statistical mechanics connects macroscopic quantities to ensembles of microscopic configurations. In the canonical ensemble, state probabilities depend on Boltzmann factors exp(−Eᵢ/kBT).',deeper:'The partition function Z = Σᵢ exp(−βEᵢ) generates thermodynamic information; β = 1/(kBT). Free energies connect microscopic state counts to macroscopic work and equilibrium. Ensemble choice depends on constraints such as fixed energy, particle number or temperature.',diagram:'energy'},
  {subject:'Chemistry',title:'Quantum chemistry and molecular orbitals',level:'advanced',simple:'Quantum chemistry applies quantum mechanics to explain molecular structure, bonding and chemical properties.',explanation:'Molecular orbitals extend over a molecule and arise from combinations of atomic orbitals. Electrons occupy orbitals subject to quantum rules, and the electronic structure influences bond order, geometry, spectra and reactivity. The Born–Oppenheimer approximation separates electronic and nuclear motion as a useful first step.',deeper:'The electronic Schrödinger equation is generally too complex for exact solutions beyond simple systems. Methods include Hartree–Fock, configuration interaction, coupled-cluster theory and density-functional theory. Each method balances computational cost and accuracy, and results depend on basis sets and approximations.',diagram:'bonding'},
  {subject:'Chemistry',title:'Spectroscopy and molecular structure',level:'advanced',simple:'Spectroscopy studies how matter interacts with electromagnetic radiation to reveal structure and composition.',explanation:'Molecules absorb or emit radiation when transitions occur between allowed energy states. Infrared spectroscopy probes vibrational transitions, UV-visible spectroscopy probes electronic transitions, and nuclear magnetic resonance probes nuclear spin transitions in a magnetic field.',deeper:'Spectral interpretation combines selection rules, energy-level models, coupling, line shapes and instrument response. Beer–Lambert law relates absorbance to concentration for suitable dilute systems. NMR chemical shifts and coupling patterns provide information about molecular environments and connectivity.',diagram:'function'},
  {subject:'Biology',title:'Gene regulation and molecular expression',level:'advanced',simple:'Cells control when and how strongly genes are used, allowing different cell types to perform different jobs.',explanation:'Gene expression can be regulated during transcription, RNA processing, translation and protein modification. Transcription factors bind regulatory DNA sequences, while chromatin structure and epigenetic marks influence access to genes. In bacteria, operons coordinate expression of related genes.',deeper:'Gene regulatory networks are dynamic systems with feedback, feedforward control and context-dependent interactions. Single-cell methods reveal cell-to-cell variation that bulk measurements can hide. Regulatory models integrate sequence, chromatin, transcription-factor occupancy and expression data, while distinguishing correlation from causation.',diagram:'cell'},
  {subject:'Biology',title:'Immunology: innate and adaptive responses',level:'college',simple:'The immune system detects potential threats and coordinates responses that help protect the body.',explanation:'Innate immunity provides rapid responses through barriers, phagocytes, complement and pattern-recognition receptors. Adaptive immunity uses B and T lymphocytes, antigen receptors and immunological memory. Antigen presentation links innate detection to adaptive responses.',deeper:'Clonal selection expands lymphocytes with receptors that recognise particular antigens. B cells can differentiate into antibody-secreting plasma cells and memory cells. T cells coordinate responses or destroy infected cells. Immune tolerance helps prevent damaging responses to the body’s own components.',diagram:'cell'},
  {subject:'Mathematics',title:'Real analysis and rigorous limits',level:'graduate',simple:'Real analysis builds calculus on precise definitions of real numbers, limits, continuity and convergence.',explanation:'A sequence converges to L if for every ε>0 there is an index N such that n≥N implies the distance between aₙ and L is less than ε. Function limits use a similar quantified definition. These definitions turn intuitive ideas about closeness into statements that can be proved.',deeper:'Completeness of the real numbers underpins key theorems such as Bolzano–Weierstrass and the least upper bound property. Uniform convergence is stronger than pointwise convergence and supports interchange of limits with continuity, integration or differentiation under appropriate hypotheses.',diagram:'derivative'},
  {subject:'Mathematics',title:'Differential equations and dynamical systems',level:'advanced',simple:'A differential equation describes how an unknown function changes in relation to its current value or other variables.',explanation:'An ordinary differential equation involves derivatives with respect to one independent variable. Initial conditions select a particular solution from a family. Linear first-order equations, separable equations and constant-coefficient linear equations have standard solution methods.',deeper:'Dynamical systems study trajectories, equilibria, stability and long-term behaviour. Nonlinear systems may exhibit bifurcations, limit cycles or deterministic chaos. Existence and uniqueness theorems specify conditions under which an initial-value problem has a solution and whether it is unique.',diagram:'derivative'},
  {subject:'Mathematics',title:'Linear algebra: vector spaces and eigenstructure',level:'advanced',simple:'Linear algebra studies vector spaces and linear maps, which are central to geometry, equations, data and physical models.',explanation:'A vector space is a set with vector addition and scalar multiplication satisfying defined axioms. A basis is a linearly independent spanning set. A linear transformation preserves addition and scalar multiplication and can be represented by a matrix after choosing bases.',deeper:'Eigenvectors and eigenvalues describe invariant directions and scaling under a linear map. Diagonalisation simplifies repeated transformations when a suitable eigenbasis exists. Orthogonality, inner products, singular-value decomposition and spectral theorems support numerical analysis, statistics, quantum mechanics and data compression.',diagram:'function'},
  {subject:'Computer Science',title:'Computational complexity and P versus NP',level:'graduate',simple:'Computational complexity asks how resource requirements grow as problem size increases.',explanation:'Complexity classes group decision problems by resources such as time and memory. P contains problems solvable in polynomial time by a deterministic model; NP contains problems whose proposed solutions can be verified in polynomial time. Polynomial reductions compare problem difficulty.',deeper:'The P versus NP question asks whether every problem whose solution can be verified efficiently can also be solved efficiently. It remains open. NP-completeness identifies problems at least as hard as every problem in NP under polynomial-time reductions. Complexity theory distinguishes worst-case, average-case and parameterised analyses.',diagram:'binary'},
  {subject:'Computer Science',title:'Operating systems and process scheduling',level:'college',simple:'An operating system manages hardware resources and provides services that applications use.',explanation:'The operating system coordinates processes, memory, files, devices and security. A process is a running program with its execution state and resources. Scheduling decides which ready process receives processor time. Context switching saves one process state and restores another.',deeper:'Scheduling policies include first-come-first-served, shortest-job-first, priority and round-robin, each with trade-offs in response time, throughput and fairness. Virtual memory maps process address spaces to physical memory and storage. Concurrency introduces race conditions, deadlocks and synchronisation requirements.',diagram:'binary'},
  {subject:'Earth Science',title:'Geochemistry and the Earth system',level:'advanced',simple:'Geochemistry uses chemical principles to understand Earth materials and the movement of elements through the planet.',explanation:'Element distributions reflect planetary differentiation, mineral stability, fluid-rock interaction and biological processes. Isotope ratios can trace sources, ages and processes. Chemical weathering transfers elements from rocks to soils, waters and sediments.',deeper:'Geochemical models combine thermodynamics, kinetics, transport and mass balance. Stable isotopes can reveal temperature or source information, while radiogenic isotope systems support geochronology and provenance analysis. Interpretation requires attention to fractionation, open-system behaviour and analytical uncertainty.',diagram:'reaction'},
  {subject:'Statistics',title:'Regression, model fit and residual analysis',level:'advanced',simple:'Regression models describe relationships between variables and help estimate or predict an outcome.',explanation:'In simple linear regression, the model is Y = β₀ + β₁X + ε. Least squares chooses coefficients that minimise the sum of squared residuals. A residual is observed minus predicted response. Association alone does not establish causation.',deeper:'Model assessment includes residual patterns, leverage, influence, uncertainty intervals and validation on data not used for fitting. Violations of linearity, independence, constant variance or error-distribution assumptions can make standard inference unreliable. More complex models require attention to overfitting and interpretability.',diagram:'function'}
);

/* Additional breadth pack: core-to-specialist coverage across further disciplines. */
window.CLI_CONTENT.topics.push(
  {subject:'Physics',title:'Rotational dynamics and angular momentum',level:'advanced',simple:'Rotational dynamics describes how torques change the rotational motion of an object.',explanation:'Angular displacement, angular velocity and angular acceleration describe rotation. For a rigid body about a fixed axis, τ = Iα, where τ is net torque and I is moment of inertia. Angular momentum for a rigid body rotating about a principal axis is L = Iω.',deeper:'The moment of inertia depends on mass distribution relative to the axis. The parallel-axis theorem relates moments about parallel axes. In an isolated system with no external torque, angular momentum is conserved. The vector form is τ = dL/dt, and gyroscopic behaviour follows from the directional nature of angular momentum.',diagram:'forces'},
  {subject:'Physics',title:'Fluid mechanics: pressure and buoyancy',level:'college',simple:'Fluid mechanics studies liquids and gases at rest or in motion.',explanation:'Pressure is force per unit area. In a static fluid, pressure increases with depth according to p = p₀ + ρgh. Buoyant force equals the weight of displaced fluid in the Archimedes model.',deeper:'Continuity expresses mass conservation in flow. For incompressible flow through a tube, A₁v₁=A₂v₂. Bernoulli’s equation relates pressure, speed and height along a streamline for ideal steady flow. Viscosity, turbulence and boundary layers require more complete models.',diagram:'energy'},
  {subject:'Physics',title:'Optics: lenses and image formation',level:'secondary',simple:'Lenses bend light and can form images that are real or virtual.',explanation:'A converging lens brings parallel rays toward a focal point; a diverging lens spreads them as if from a focal point. For a thin lens in air, 1/f = 1/u + 1/v under the usual sign convention. Magnification relates image height to object height.',deeper:'Ray diagrams use principal rays to locate images. Lens power is measured in dioptres and equals reciprocal focal length in metres. Aberrations arise because real lenses do not focus every wavelength and ray identically. Optical systems combine lenses, apertures and detectors.',diagram:'function'},
  {subject:'Physics',title:'Nuclear physics and radioactive decay',level:'advanced',simple:'Nuclear physics studies atomic nuclei, their stability and transformations.',explanation:'Unstable nuclei can transform by emitting alpha particles, beta particles or gamma radiation. Radioactive decay is probabilistic for individual nuclei, while large samples follow an exponential decay law N=N₀e^(−λt). The half-life is ln2/λ.',deeper:'Nuclear binding energy reflects the mass defect and energy equivalence. Fission splits heavy nuclei; fusion combines light nuclei. Nuclear models explain shell structure and collective behaviour. Radiation interactions depend on type, energy and material, and applications include medical imaging, treatment, dating and energy generation.',diagram:'atom'},
  {subject:'Physics',title:'Dimensional analysis and physical modelling',level:'college',simple:'Dimensional analysis checks equations by comparing the physical dimensions on both sides.',explanation:'Base dimensions such as mass M, length L and time T can be combined to express derived quantities. A physically meaningful equation must be dimensionally homogeneous. Unit conversion is handled by multiplying by conversion factors equal to one.',deeper:'The Buckingham π theorem reduces dimensional problems to dimensionless groups when the relevant variables and dimensions are known. Dimensional analysis can guide experiments, reveal scaling laws and identify likely functional dependencies, but it cannot determine dimensionless constants or replace a complete physical derivation.',diagram:'function'},
  {subject:'Chemistry',title:'Organic chemistry: functional groups',level:'secondary',simple:'Functional groups are recurring atom arrangements that help predict how organic molecules react.',explanation:'Common functional groups include alkanes, alkenes, alcohols, aldehydes, ketones, carboxylic acids, esters, amines and amides. Their bonding patterns influence polarity, intermolecular forces, acidity, basicity and characteristic reactions.',deeper:'Organic mechanisms describe electron movement using curved-arrow notation. Nucleophiles donate electron pairs and electrophiles accept them. Reaction pathways may involve substitution, addition, elimination, oxidation, reduction or rearrangement. Stereochemistry and reaction conditions often determine product identity.',diagram:'bonding'},
  {subject:'Chemistry',title:'Stereochemistry and chirality',level:'advanced',simple:'Stereochemistry studies the three-dimensional arrangement of atoms and how it affects molecular properties.',explanation:'Constitutional isomers differ in connectivity; stereoisomers share connectivity but differ in spatial arrangement. Enantiomers are non-superimposable mirror images, while diastereomers are stereoisomers that are not mirror images. A tetrahedral carbon with four different substituents can be a stereogenic centre.',deeper:'The Cahn–Ingold–Prelog system assigns R/S configurations using priority rules. Optical activity and interactions with chiral environments can distinguish enantiomers. Conformation, configuration and stereoselective reaction pathways are central to pharmaceutical and biochemical chemistry.',diagram:'bonding'},
  {subject:'Chemistry',title:'Chemical thermodynamics and spontaneity',level:'advanced',simple:'Chemical thermodynamics uses energy and entropy to determine whether a process is thermodynamically favoured.',explanation:'Enthalpy change describes heat transfer at constant pressure. Entropy change is associated with the number and distribution of accessible microscopic states. Gibbs free energy change ΔG=ΔH−TΔS predicts spontaneity at constant temperature and pressure: negative ΔG indicates a thermodynamically favourable direction.',deeper:'At equilibrium, ΔG=0 for the reaction as written and ΔG°=−RT ln K. A favourable process may still be slow because kinetics and activation barriers determine rate. Thermodynamic state functions depend on state, not the path taken between states.',diagram:'energy'},
  {subject:'Chemistry',title:'Analytical chemistry and calibration',level:'college',simple:'Analytical chemistry identifies substances and measures how much of them is present.',explanation:'Qualitative analysis asks what is present; quantitative analysis asks how much. Calibration relates instrument response to known standards. A calibration curve is often fitted over a validated working range, and unknown concentrations are inferred from measured response.',deeper:'Method validation examines selectivity, linearity, accuracy, precision, detection and quantification limits, robustness and recovery. Blanks, standards, replicates and control samples help identify contamination, drift and systematic error. Significant figures and uncertainty should accompany reported measurements.',diagram:'function'},
  {subject:'Biology',title:'Enzymes and enzyme kinetics',level:'college',simple:'Enzymes are biological catalysts that make specific reactions proceed faster.',explanation:'Enzymes bind substrates at active sites and stabilise reaction pathways with lower activation barriers. Activity depends on factors such as substrate concentration, temperature, pH, inhibitors and enzyme concentration. The Michaelis–Menten model describes many simple enzyme systems.',deeper:'For a simple one-substrate model, v=Vmax[S]/(Km+[S]). Km is the substrate concentration at half Vmax under the model assumptions, not always a direct binding constant. Competitive, uncompetitive and noncompetitive inhibition alter kinetic parameters in characteristic ways.',diagram:'reaction'},
  {subject:'Biology',title:'Evolutionary genetics and genetic drift',level:'advanced',simple:'Evolutionary genetics studies how genetic variation changes within and between populations.',explanation:'Mutation introduces new variants; selection changes their frequencies according to fitness differences; migration moves alleles between populations; genetic drift causes random frequency changes. Drift is especially influential in small populations.',deeper:'Coalescent theory traces sampled gene copies backward to common ancestors. Effective population size can differ substantially from census size. Bottlenecks, founder events, linkage and recombination shape genomic variation and influence how selection signatures are detected.',diagram:'cell'},
  {subject:'Biology',title:'Neurobiology: neurons and synapses',level:'college',simple:'Neurons communicate using electrical signals and chemical or electrical synapses.',explanation:'A neuron receives input through dendrites, integrates signals near the cell body and may generate an action potential along its axon. Voltage-gated ion channels produce changes in membrane potential. At chemical synapses, neurotransmitters cross a synaptic cleft and bind receptors.',deeper:'Action potentials depend on coordinated sodium and potassium conductances and refractory periods. Synaptic strength can change through plasticity, contributing to learning and memory. Neural circuits integrate excitation and inhibition across many cells and timescales.',diagram:'cell'},
  {subject:'Biology',title:'Plant physiology: water transport and transpiration',level:'college',simple:'Plants move water from roots to leaves through vascular tissue, with evaporation from leaves helping drive the flow.',explanation:'Xylem transports water and dissolved minerals. Transpiration occurs as water evaporates from leaf surfaces and diffuses through stomata. Cohesion between water molecules and adhesion to xylem walls help maintain continuous water columns.',deeper:'Water potential combines pressure and solute effects and predicts water movement. Stomatal opening balances carbon dioxide uptake against water loss. Environmental factors such as humidity, temperature, light and soil water availability influence transpiration and photosynthetic performance.',diagram:'photosynthesis'},
  {subject:'Mathematics',title:'Trigonometric identities and equations',level:'secondary',simple:'Trigonometric identities are relationships among sine, cosine and tangent that hold wherever both sides are defined.',explanation:'The fundamental identity is sin²θ+cos²θ=1. Other identities include tanθ=sinθ/cosθ, angle-sum formulas and double-angle formulas. Trigonometric equations require attention to periodicity and the specified domain.',deeper:'The unit circle provides a geometric interpretation of trigonometric functions for all real angles. In complex analysis, sine and cosine extend through exponential definitions. Fourier analysis uses trigonometric functions as basis components for periodic signals.',diagram:'function'},
  {subject:'Mathematics',title:'Differential equations: second-order systems',level:'advanced',simple:'Second-order differential equations describe systems whose acceleration or curvature depends on state.',explanation:'A linear constant-coefficient equation ay″+by′+cy=f(x) can be studied using its characteristic equation for the homogeneous part. Initial conditions specify a unique solution when existence and uniqueness conditions hold.',deeper:'Damped oscillators have underdamped, critically damped and overdamped regimes determined by parameter relationships. Forced systems show transient and steady-state responses. Green’s functions and Laplace transforms provide systematic tools for linear problems.',diagram:'derivative'},
  {subject:'Mathematics',title:'Fourier series and signal decomposition',level:'advanced',simple:'Fourier series represent suitable periodic functions as sums of sine and cosine waves.',explanation:'A periodic function can be decomposed into a constant term and harmonics with coefficients determined by integrals over a period. The representation helps analyse sound, heat flow, vibration and repeating signals.',deeper:'Convergence depends on function regularity and the chosen interpretation of the series. Fourier transforms extend the idea to non-periodic signals. Sampling theory explains how continuous signals can be represented digitally without losing information under appropriate band-limit and sampling conditions.',diagram:'function'},
  {subject:'Mathematics',title:'Numerical methods and approximation error',level:'college',simple:'Numerical methods find approximate solutions when exact algebraic solutions are unavailable or impractical.',explanation:'Methods include bisection and Newton iteration for roots, numerical quadrature for integrals, and finite differences for derivatives. Approximation error arises from truncation, rounding and measurement uncertainty.',deeper:'Stability concerns how errors propagate through an algorithm; convergence concerns whether approximations approach the true solution as resolution improves. Conditioning describes sensitivity of the mathematical problem itself. A reliable computation considers all three.',diagram:'function'},
  {subject:'Mathematics',title:'Topology: continuity and connectedness',level:'graduate',simple:'Topology studies properties of spaces that remain unchanged under continuous deformation.',explanation:'A topology specifies which subsets are open and thereby defines continuity, convergence and neighbourhoods in general spaces. Connectedness captures whether a space can be separated into disjoint nonempty open sets; compactness generalises important finite-cover properties.',deeper:'Topological ideas underpin analysis, geometry and modern physics. Continuous maps preserve topological structure in defined ways, while homeomorphisms identify spaces with the same topology. Compactness and connectedness support powerful existence theorems.',diagram:'function'},
  {subject:'Computer Science',title:'Databases and relational modelling',level:'college',simple:'A database stores organised information so it can be searched, updated and related consistently.',explanation:'Relational databases organise data into tables with rows and columns. Primary keys identify records; foreign keys represent relationships. SQL supports querying and data modification. Normalisation reduces certain forms of redundancy and update anomalies.',deeper:'Transactions are commonly described by ACID properties: atomicity, consistency, isolation and durability. Indexes accelerate retrieval with storage and update trade-offs. Query planners choose execution strategies, and database design balances integrity, performance and evolving application requirements.',diagram:'binary'},
  {subject:'Computer Science',title:'Cybersecurity principles and cryptography',level:'college',simple:'Cybersecurity protects systems and information from unauthorised access, alteration and disruption.',explanation:'The CIA triad describes confidentiality, integrity and availability. Authentication verifies identity; authorisation determines permitted actions. Cryptography uses mathematical techniques for encryption, digital signatures, hashing and key exchange.',deeper:'Symmetric encryption uses shared secret keys; public-key systems use related key pairs. Secure systems also require key management, secure defaults, patching, least privilege, backups and threat modelling. A strong algorithm cannot compensate for poor implementation or leaked keys.',diagram:'binary'},
  {subject:'Computer Science',title:'Programming language paradigms',level:'college',simple:'Programming paradigms are different ways of organising computation and expressing solutions.',explanation:'Imperative programming describes sequences of state-changing instructions. Functional programming emphasises expressions and function composition. Object-oriented programming organises data and behaviour around objects. Declarative approaches specify desired results rather than every operational step.',deeper:'Languages often mix paradigms. Type systems can detect classes of errors; static and dynamic typing offer different trade-offs. Memory management may be manual, reference-counted or garbage-collected. Paradigm choice affects modularity, testability and maintainability.',diagram:'binary'},
  {subject:'Computer Science',title:'Computer architecture and processor design',level:'college',simple:'Computer architecture describes how processors, memory and input/output systems work together.',explanation:'A processor executes instructions using registers, arithmetic and logic units, control logic and data paths. The instruction set architecture defines the programmer-visible machine model. Cache memory reduces average access time by exploiting locality.',deeper:'Pipelining overlaps instruction stages but introduces data, control and structural hazards. Branch prediction and out-of-order execution improve throughput. Performance depends on instruction count, cycles per instruction and clock frequency, alongside memory and parallelism constraints.',diagram:'binary'},
  {subject:'Earth Science',title:'The rock cycle and mineral formation',level:'secondary',simple:'The rock cycle describes how rocks form, change and recycle through geological processes.',explanation:'Igneous rocks form as magma or lava cools; sedimentary rocks form through deposition, compaction and cementation; metamorphic rocks change under heat, pressure and chemically active fluids without fully melting.',deeper:'Mineral stability depends on pressure, temperature, composition and fluid conditions. Plate tectonics drives many transformations. The rock cycle is not a single fixed sequence; multiple pathways connect weathering, transport, burial, melting and uplift.',diagram:'reaction'},
  {subject:'Earth Science',title:'Ocean circulation and the water cycle',level:'college',simple:'Oceans redistribute heat and water around the planet, influencing weather and climate.',explanation:'Surface currents are driven mainly by winds, Earth’s rotation and basin geometry. Deep circulation is influenced by density differences caused by temperature and salinity. Evaporation, condensation, precipitation, runoff and infiltration connect ocean, atmosphere and land.',deeper:'Thermohaline circulation links water-mass formation and deep-ocean transport over long timescales. Ocean heat content, sea ice, freshwater inputs and winds influence circulation. The water cycle also moves energy through latent heat and affects ecosystems and human water resources.',diagram:'energy'},
  {subject:'Earth Science',title:'Geological time and radiometric dating',level:'college',simple:'Geological time organises Earth history, while radiometric dating estimates ages using radioactive decay.',explanation:'The geological time scale is divided into eons, eras, periods and epochs based on major events and evidence in rocks and fossils. Radiometric dating uses known decay rates and parent-daughter isotope ratios in suitable minerals.',deeper:'An isochron method can reduce dependence on initial daughter-isotope assumptions. A reliable age requires a suitable closed system and careful analytical work. Relative dating principles such as superposition and cross-cutting relationships complement numerical ages.',diagram:'atom'},
  {subject:'Astronomy',title:'Stars: formation, structure and evolution',level:'college',simple:'Stars form from collapsing clouds of gas and change over time as they use nuclear fuel.',explanation:'Gravity compresses a molecular cloud until a protostar forms. A stable main-sequence star balances inward gravitational pressure with energy transport and pressure generated by hot plasma. Hydrogen fusion supplies energy for much of a star’s lifetime.',deeper:'Stellar evolution depends strongly on initial mass and composition. Low- and intermediate-mass stars can become red giants and leave white dwarfs; massive stars may undergo core collapse and form neutron stars or black holes. Stellar spectra reveal temperature, composition and motion.',diagram:'energy'},
  {subject:'Astronomy',title:'Galaxies and the expanding universe',level:'advanced',simple:'Galaxies are large gravitationally bound systems, and observations show that the universe is expanding.',explanation:'Galaxies contain stars, gas, dust, dark matter and often central supermassive black holes. Their shapes and histories reflect formation, mergers and internal processes. The redshift-distance relation for sufficiently distant galaxies supports cosmic expansion.',deeper:'Modern cosmology uses general relativity and observational constraints from the cosmic microwave background, large-scale structure, supernovae and baryon acoustic oscillations. The standard model includes dark matter and dark energy, whose underlying nature remains an active research question.',diagram:'function'},
  {subject:'Astronomy',title:'Exoplanets and planetary detection',level:'advanced',simple:'Exoplanets are planets orbiting stars beyond our Solar System.',explanation:'The transit method detects small dips in stellar brightness when a planet passes in front of its star. Radial-velocity measurements detect the star’s reflex motion. Direct imaging, microlensing and timing methods reveal other classes of systems.',deeper:'Detection biases favour certain planet sizes, orbital periods and host-star properties. Combining methods constrains mass, radius and density. Atmospheric spectroscopy can identify absorption features, but interpretation must account for clouds, stellar activity and instrument systematics.',diagram:'function'},
  {subject:'Statistics',title:'Hypothesis testing and statistical power',level:'college',simple:'Hypothesis testing evaluates how compatible observed data are with a specified null model.',explanation:'A test begins with null and alternative hypotheses, a test statistic and a decision rule. A p-value measures how extreme the observed statistic or a more extreme one would be under the null model. Type I error is a false positive; Type II error is a false negative.',deeper:'Power is the probability of rejecting a false null under a specified alternative. It depends on effect size, sample size, variability and significance threshold. Statistical significance does not measure practical importance, and repeated unplanned testing increases false-positive risk.',diagram:'function'},
  {subject:'Statistics',title:'Bayesian inference and posterior distributions',level:'advanced',simple:'Bayesian inference updates beliefs about unknown quantities using evidence and a probability model.',explanation:'Bayes’ theorem combines a prior distribution with a likelihood to produce a posterior distribution. The posterior represents uncertainty about parameters after observing data, conditional on the model and prior assumptions.',deeper:'Conjugate priors provide analytically convenient updates in selected models. Markov chain Monte Carlo methods approximate complex posterior distributions. Prior predictive checks, posterior predictive checks and sensitivity analysis help assess whether modelling assumptions are reasonable.',diagram:'function'},
  {subject:'Statistics',title:'Experimental design and causal inference',level:'advanced',simple:'Experimental design plans data collection so that comparisons can answer a question with minimal bias.',explanation:'Random assignment helps balance measured and unmeasured confounders on average. Replication estimates variability; blocking controls known sources of variation; blinding can reduce measurement and observer bias. Observational studies require additional assumptions for causal interpretation.',deeper:'Causal diagrams represent assumptions about relationships among variables. Potential-outcomes frameworks define treatment effects by comparing counterfactual outcomes. Methods such as matching, instrumental variables and difference-in-differences can support causal analysis only when their identifying assumptions are credible.',diagram:'function'},
  {subject:'Environmental Science',title:'Biodiversity and conservation science',level:'college',simple:'Conservation science studies how to protect species, genetic diversity and ecosystems.',explanation:'Biodiversity includes variation within species, among species and across ecosystems. Major pressures include habitat loss, invasive species, pollution, overexploitation and climate change. Conservation approaches include protected areas, restoration and sustainable resource management.',deeper:'Population viability analysis estimates extinction risk under model assumptions. Conservation planning considers habitat connectivity, representation, resilience, local communities and governance. Monitoring helps distinguish intervention effects from natural variability and wider environmental change.',diagram:'cell'},
  {subject:'Environmental Science',title:'Sustainable energy systems and efficiency',level:'college',simple:'Energy systems convert resources into useful services while producing environmental and economic trade-offs.',explanation:'Energy sources include fossil fuels, nuclear, hydro, wind, solar and geothermal. Efficiency measures compare useful output with input. Electricity systems must balance supply and demand while maintaining reliability and power quality.',deeper:'Lifecycle assessment examines impacts from resource extraction through manufacture, operation and disposal. Storage, transmission, demand response and flexible generation help integrate variable renewables. No energy technology is impact-free; comparisons depend on system boundaries and assumptions.',diagram:'energy'},
  {subject:'Earth Science',title:'Remote sensing and geographic information systems',level:'college',simple:'Remote sensing measures Earth from a distance, while GIS organises and analyses spatial information.',explanation:'Satellites and aircraft record reflected or emitted electromagnetic energy across spectral bands. GIS combines spatial layers such as elevation, land cover, roads and boundaries to support mapping and analysis.',deeper:'Image classification, spectral indices and change detection turn observations into derived information. Spatial resolution, temporal resolution, spectral response, atmospheric correction and ground validation influence accuracy. GIS analysis must account for coordinate systems and scale.',diagram:'function'},
  {subject:'Mathematics',title:'Partial derivatives and multivariable calculus',level:'advanced',simple:'Partial derivatives measure how a multivariable function changes when one input changes while others are held fixed.',explanation:'For f(x,y), the partial derivatives ∂f/∂x and ∂f/∂y describe local rates of change along coordinate directions. The gradient collects these derivatives and points in the direction of steepest increase for a differentiable scalar field.',deeper:'The chain rule extends to vector-valued mappings through Jacobian matrices. Hessian matrices describe second-order curvature. Multiple integrals accumulate quantities over regions, while line and surface integrals support vector calculus and physical field theories.',diagram:'derivative'},
  {subject:'Computer Science',title:'Human-computer interaction and accessibility',level:'college',simple:'Human-computer interaction studies how people use digital systems and how interfaces can make tasks clearer and more accessible.',explanation:'Good interfaces support clear feedback, predictable navigation, readable information and error recovery. Accessibility includes keyboard operation, semantic structure, sufficient contrast, meaningful labels and compatibility with assistive technologies.',deeper:'Usability evaluation combines task analysis, user testing and heuristic inspection. Inclusive design considers different abilities, devices, contexts and levels of experience. Performance and cognitive load influence whether an interface feels understandable and responsive.',diagram:'function'},
  {subject:'Chemistry',title:'Materials chemistry and polymers',level:'college',simple:'Materials chemistry connects composition and structure to the properties and uses of solids, liquids and polymers.',explanation:'Material behaviour depends on bonding, crystal structure, defects, microstructure and processing. Polymers consist of repeating molecular units and may be thermoplastics, thermosets or elastomers depending on structure and network formation.',deeper:'Structure-property relationships guide the design of materials for conductivity, strength, flexibility, optical response and chemical resistance. Characterisation techniques include diffraction, microscopy, spectroscopy and thermal analysis. Processing history can strongly alter final properties.',diagram:'bonding'},
  {subject:'Biology',title:'Microbiology: microbial growth and diversity',level:'college',simple:'Microbiology studies microscopic organisms and their roles in health, ecosystems and industry.',explanation:'Microorganisms include bacteria, archaea, microscopic fungi, protists and viruses. Microbial growth depends on nutrients, temperature, pH, water availability and environmental conditions. Bacteria reproduce commonly by binary fission.',deeper:'Microbial communities interact through competition, cooperation and chemical signalling. Culture-based methods reveal only organisms that grow under chosen conditions; sequencing and metagenomics broaden observation. Sterile technique, controls and biosafety are essential in laboratory work.',diagram:'cell'},
  {subject:'Physics',title:'Electromagnetic spectrum and photon energy',level:'secondary',simple:'Electromagnetic radiation ranges from radio waves to gamma rays and travels at the speed of light in vacuum.',explanation:'The spectrum includes radio, microwave, infrared, visible, ultraviolet, X-ray and gamma radiation. In vacuum, wavelength and frequency satisfy c=fλ. Photon energy is E=hf, so higher-frequency radiation has higher energy per photon.',deeper:'Wave and quantum descriptions are complementary. Interaction with matter depends on photon energy and material structure. Spectroscopy uses absorption, emission and scattering to infer energy levels, composition and physical conditions.',diagram:'motion'},
  {subject:'Physics',title:'Relativity: mass-energy and four-momentum',level:'advanced',simple:'Relativity connects mass, energy and momentum in a way that remains consistent at all speeds below light speed.',explanation:'Rest energy is E₀=mc². Total energy and momentum satisfy E²=(pc)²+(mc²)². For speeds much smaller than c, classical kinetic energy and momentum provide excellent approximations.',deeper:'Four-momentum is conserved in relativistic interactions. Invariant mass is a property of a system independent of inertial frame. Particle reactions, accelerator physics and astrophysical processes require relativistic energy-momentum accounting.',diagram:'energy'},
  {subject:'Mathematics',title:'Complex analysis: analytic functions',level:'graduate',simple:'Complex analysis studies functions of complex variables and their differentiability.',explanation:'A complex function is differentiable in a neighbourhood when its complex derivative exists there. Analytic functions satisfy the Cauchy–Riemann equations under suitable smoothness assumptions and have powerful integral properties.',deeper:'Cauchy’s integral theorem and formula lead to residue methods for evaluating integrals. Power series, singularities and contour integration provide tools across pure mathematics, fluid mechanics, electromagnetism and applied analysis.',diagram:'function'},
  {subject:'Computer Science',title:'Distributed systems and consistency',level:'advanced',simple:'Distributed systems coordinate multiple computers that communicate over a network to provide a shared service.',explanation:'Distributed components face latency, partial failure, message reordering and concurrent updates. Replication improves availability and performance but introduces consistency challenges. Consensus protocols coordinate agreement under defined fault assumptions.',deeper:'Consistency models range from strong linearizability to eventual consistency. CAP-style trade-offs clarify behaviour during network partitions, but do not reduce system design to a simple universal two-choice rule. Idempotency, retries, observability and recovery procedures are central engineering concerns.',diagram:'binary'}
);

/* Additional cross-disciplinary formula references. */
window.CLI_CONTENT.formulas.push(
  {category:'Physics',name:'Torque',equation:'τ = rF sin θ',description:'Magnitude of torque from a force applied at lever arm r.',keywords:'torque · force · lever arm · angle'},
  {category:'Physics',name:'Angular momentum',equation:'L = Iω',description:'Angular momentum for a rigid body rotating about a principal axis.',keywords:'angular momentum · inertia · angular speed'},
  {category:'Physics',name:'Rotational kinetic energy',equation:'Eᵣ = ½Iω²',description:'Kinetic energy of a rigid body rotating about a fixed axis.',keywords:'energy · moment of inertia · angular speed'},
  {category:'Physics',name:'Fluid pressure with depth',equation:'p = p₀ + ρgh',description:'Pressure in a static fluid at depth h below a reference surface.',keywords:'pressure · density · gravity · depth'},
  {category:'Physics',name:'Continuity for incompressible flow',equation:'A₁v₁ = A₂v₂',description:'Volume flow conservation for steady incompressible flow in a tube.',keywords:'area · velocity · flow'},
  {category:'Physics',name:'Bernoulli equation',equation:'p + ½ρv² + ρgh = constant',description:'Mechanical energy relation along a streamline for ideal steady flow.',keywords:'pressure · density · velocity · height'},
  {category:'Physics',name:'Thin lens equation',equation:'1/f = 1/u + 1/v',description:'Thin-lens image relation under a consistent sign convention.',keywords:'lens · focal length · object distance · image distance'},
  {category:'Physics',name:'Lens power',equation:'P = 1/f',description:'Optical power in dioptres when focal length f is in metres.',keywords:'lens power · focal length · dioptre'},
  {category:'Physics',name:'Radioactive decay',equation:'N = N₀e^(−λt)',description:'Number of undecayed nuclei in an ideal exponential decay model.',keywords:'radioactivity · nuclei · decay constant · time'},
  {category:'Physics',name:'Half-life',equation:'t½ = ln 2 / λ',description:'Time for the expected number of undecayed nuclei to halve.',keywords:'half-life · decay constant'},
  {category:'Physics',name:'Photon energy',equation:'E = hf = hc/λ',description:'Energy of a photon in terms of frequency or wavelength.',keywords:'photon · Planck constant · frequency · wavelength'},
  {category:'Physics',name:'Mass-energy equivalence',equation:'E₀ = mc²',description:'Rest energy associated with invariant mass m.',keywords:'energy · mass · speed of light · relativity'},
  {category:'Physics',name:'Relativistic Lorentz factor',equation:'γ = 1/√(1−v²/c²)',description:'Factor appearing in special-relativistic transformations.',keywords:'Lorentz factor · speed · light'},
  {category:'Physics',name:'Simple harmonic motion',equation:'a = −ω²x',description:'Acceleration-displacement relation defining ideal simple harmonic motion.',keywords:'acceleration · angular frequency · displacement'},
  {category:'Chemistry',name:'Gibbs relation for equilibrium',equation:'ΔG° = −RT ln K',description:'Connects standard Gibbs energy change with the equilibrium constant.',keywords:'Gibbs energy · gas constant · temperature · equilibrium'},
  {category:'Chemistry',name:'Beer–Lambert law',equation:'A = εlc',description:'Absorbance relation for suitable solutions and optical conditions.',keywords:'absorbance · molar absorptivity · path length · concentration'},
  {category:'Chemistry',name:'First-order integrated rate law',equation:'ln([A]ₜ/[A]₀) = −kt',description:'Concentration-time relation for a first-order reaction.',keywords:'first order · concentration · rate constant · time'},
  {category:'Chemistry',name:'Second-order integrated rate law',equation:'1/[A]ₜ = 1/[A]₀ + kt',description:'Integrated form for a simple second-order reaction in one reactant.',keywords:'second order · concentration · rate constant · time'},
  {category:'Chemistry',name:'Michaelis–Menten equation',equation:'v = Vmax[S]/(Km+[S])',description:'Initial-rate model for a simple enzyme-substrate mechanism.',keywords:'enzyme · rate · substrate · Km · Vmax'},
  {category:'Chemistry',name:'Nernst equation at 25 °C',equation:'E = E° − (0.05916 V/n)log₁₀Q',description:'Common base-10 form at 298.15 K for a cell reaction.',keywords:'electrochemistry · cell potential · reaction quotient'},
  {category:'Biology',name:'Exponential population doubling time',equation:'t₂ = ln 2 / r',description:'Doubling time for continuous exponential population growth.',keywords:'population · doubling time · growth rate'},
  {category:'Biology',name:'Hardy–Weinberg allele relation',equation:'p + q = 1',description:'Allele frequencies at a locus with two alleles.',keywords:'genetics · allele frequency'},
  {category:'Mathematics',name:'Taylor series',equation:'f(x)=Σ f⁽ⁿ⁾(a)(x−a)ⁿ/n!',description:'Local power-series representation when suitable smoothness and convergence conditions hold.',keywords:'Taylor · series · derivatives'},
  {category:'Mathematics',name:'Maclaurin series',equation:'f(x)=Σ f⁽ⁿ⁾(0)xⁿ/n!',description:'Taylor series centred at zero.',keywords:'Maclaurin · series · derivatives'},
  {category:'Mathematics',name:'Gradient of a scalar field',equation:'∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z)',description:'Vector of partial derivatives in Cartesian coordinates.',keywords:'gradient · partial derivatives · vector calculus'},
  {category:'Mathematics',name:'Divergence',equation:'∇·F = ∂Fₓ/∂x + ∂Fᵧ/∂y + ∂F_z/∂z',description:'Scalar measure of local source or sink strength of a vector field.',keywords:'divergence · vector field · vector calculus'},
  {category:'Mathematics',name:'Curl',equation:'∇×F',description:'Vector measure of local rotational tendency of a vector field.',keywords:'curl · vector field · rotation'},
  {category:'Mathematics',name:'Euler’s identity',equation:'e^(iπ) + 1 = 0',description:'A special case of Euler’s formula connecting five fundamental constants.',keywords:'complex numbers · exponential · pi'},
  {category:'Mathematics',name:'Determinant of a 2×2 matrix',equation:'det(A) = ad − bc',description:'For A = [[a,b],[c,d]].',keywords:'matrix · determinant · linear algebra'},
  {category:'Statistics',name:'Standard error of the sample mean',equation:'SE(x̄) = s/√n',description:'Estimated standard deviation of the sample mean under independent sampling assumptions.',keywords:'standard error · sample mean · standard deviation · sample size'},
  {category:'Statistics',name:'Z statistic for a mean',equation:'z = (x̄−μ₀)/(σ/√n)',description:'Standardised sample-mean statistic when population standard deviation is known and model assumptions hold.',keywords:'z test · mean · standard deviation · sample size'},
  {category:'Statistics',name:'Pearson correlation',equation:'r = cov(X,Y)/(sₓsᵧ)',description:'Standardised measure of linear association between two variables.',keywords:'correlation · covariance · standard deviation'},
  {category:'Computer Science',name:'Little’s law',equation:'L = λW',description:'Average number in a stable system equals arrival rate times average time in system.',keywords:'queueing · throughput · waiting time'},
  {category:'Computer Science',name:'Binary-to-decimal conversion',equation:'N₁₀ = Σ bᵢ2ⁱ',description:'Weighted sum of binary digits by their positional powers of two.',keywords:'binary · decimal · number systems'},
  {category:'Earth Science',name:'Hydrostatic pressure gradient',equation:'dp/dz = −ρg',description:'Pressure gradient in a fluid at rest with vertical coordinate z positive upward.',keywords:'fluid · pressure · density · gravity'},
  {category:'Astronomy',name:'Kepler’s third law (Newtonian form)',equation:'T² = 4π²a³/[G(M+m)]',description:'Orbital period relation for two gravitating bodies with semi-major axis a.',keywords:'orbit · period · semi-major axis · gravity'}
);
