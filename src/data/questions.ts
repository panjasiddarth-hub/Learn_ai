// CBSE Class 10 Question Bank
export interface Question {
  id: string;
  question: string;
  type: 'mcq' | 'fill' | 'short' | 'long' | 'assertion';
  options?: string[];
  answer: string;
  explanation: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  chapter: string;
  subject: string;
  topic: string;
}

export const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];

export const chapters: Record<string, string[]> = {
  Mathematics: ['Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Trigonometry', 'Circles', 'Surface Areas and Volumes', 'Statistics', 'Probability'],
  Physics: ['Light - Reflection and Refraction', 'Human Eye and Colourful World', 'Electricity', 'Magnetic Effects of Electric Current', 'Sources of Energy'],
  Chemistry: ['Chemical Reactions and Equations', 'Acids Bases and Salts', 'Metals and Non-metals', 'Carbon and its Compounds', 'Periodic Classification of Elements'],
  Biology: ['Life Processes', 'Control and Coordination', 'How do Organisms Reproduce', 'Heredity and Evolution', 'Our Environment'],
  English: ['Letter Writing', 'Essay Writing', 'Comprehension', 'Grammar', 'Literature']
};

export const questionBank: Question[] = [
  // Mathematics - Quadratic Equations
  {
    id: 'math_qe_1',
    question: 'Which of the following is a quadratic equation?',
    type: 'mcq',
    options: ['x² + 2x + 1 = 0', 'x³ + x = 0', '2x + 3 = 0', 'x + 1/x = 2'],
    answer: 'x² + 2x + 1 = 0',
    explanation: 'A quadratic equation is of the form ax² + bx + c = 0 where a ≠ 0. Only x² + 2x + 1 = 0 fits this form.',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Quadratic Equations',
    subject: 'Mathematics',
    topic: 'Definition'
  },
  {
    id: 'math_qe_2',
    question: 'Find the roots of the equation x² - 5x + 6 = 0',
    type: 'mcq',
    options: ['2 and 3', '1 and 6', '-2 and -3', '2 and -3'],
    answer: '2 and 3',
    explanation: 'x² - 5x + 6 = 0 can be factored as (x-2)(x-3) = 0. Therefore x = 2 or x = 3.',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Quadratic Equations',
    subject: 'Mathematics',
    topic: 'Factorization'
  },
  {
    id: 'math_qe_3',
    question: 'The discriminant of x² + 4x + 4 = 0 is:',
    type: 'mcq',
    options: ['0', '8', '16', '-8'],
    answer: '0',
    explanation: 'Discriminant D = b² - 4ac = 16 - 16 = 0. When D = 0, the equation has two equal real roots.',
    marks: 1,
    difficulty: 'medium',
    chapter: 'Quadratic Equations',
    subject: 'Mathematics',
    topic: 'Discriminant'
  },
  {
    id: 'math_qe_4',
    question: 'If the roots of ax² + bx + c = 0 are equal, then:',
    type: 'mcq',
    options: ['b² = 4ac', 'b² > 4ac', 'b² < 4ac', 'b = 4ac'],
    answer: 'b² = 4ac',
    explanation: 'For equal roots, discriminant D = b² - 4ac = 0, which means b² = 4ac.',
    marks: 1,
    difficulty: 'medium',
    chapter: 'Quadratic Equations',
    subject: 'Mathematics',
    topic: 'Nature of Roots'
  },
  {
    id: 'math_qe_5',
    question: 'Solve the quadratic equation 2x² - 7x + 3 = 0 using the quadratic formula and find the sum of roots.',
    type: 'short',
    answer: 'Using quadratic formula x = (7 ± √(49-24))/4 = (7 ± 5)/4. Roots are 3 and 0.5. Sum = 3.5',
    explanation: 'The sum of roots of ax² + bx + c = 0 is -b/a = 7/2 = 3.5',
    marks: 2,
    difficulty: 'medium',
    chapter: 'Quadratic Equations',
    subject: 'Mathematics',
    topic: 'Quadratic Formula'
  },

  // Physics - Light
  {
    id: 'phy_light_1',
    question: 'The image formed by a plane mirror is:',
    type: 'mcq',
    options: ['Virtual and erect', 'Real and erect', 'Virtual and inverted', 'Real and inverted'],
    answer: 'Virtual and erect',
    explanation: 'A plane mirror always forms a virtual, erect image of the same size as the object.',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Light - Reflection and Refraction',
    subject: 'Physics',
    topic: 'Plane Mirror'
  },
  {
    id: 'phy_light_2',
    question: 'The mirror formula is:',
    type: 'mcq',
    options: ['1/f = 1/v + 1/u', '1/f = 1/v - 1/u', 'f = v + u', 'f = v - u'],
    answer: '1/f = 1/v + 1/u',
    explanation: 'The mirror formula relates focal length (f), image distance (v), and object distance (u).',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Light - Reflection and Refraction',
    subject: 'Physics',
    topic: 'Mirror Formula'
  },
  {
    id: 'phy_light_3',
    question: 'Refractive index of a medium is defined as the ratio of:',
    type: 'mcq',
    options: ['Speed of light in vacuum to speed of light in medium', 'Speed of light in medium to speed of light in vacuum', 'Wavelength in vacuum to wavelength in medium', 'Frequency in vacuum to frequency in medium'],
    answer: 'Speed of light in vacuum to speed of light in medium',
    explanation: 'Refractive index n = c/v, where c is speed of light in vacuum and v is speed in the medium.',
    marks: 1,
    difficulty: 'medium',
    chapter: 'Light - Reflection and Refraction',
    subject: 'Physics',
    topic: 'Refraction'
  },
  {
    id: 'phy_light_4',
    question: 'A concave mirror produces a real and inverted image. The object must be placed:',
    type: 'mcq',
    options: ['Beyond C', 'Between F and C', 'At F', 'Between P and F'],
    answer: 'Beyond C',
    explanation: 'When object is beyond C, concave mirror produces real, inverted, and diminished image between F and C.',
    marks: 1,
    difficulty: 'medium',
    chapter: 'Light - Reflection and Refraction',
    subject: 'Physics',
    topic: 'Concave Mirror'
  },

  // Chemistry - Chemical Reactions
  {
    id: 'chem_cr_1',
    question: 'Which of the following is an example of a combination reaction?',
    type: 'mcq',
    options: ['2Mg + O₂ → 2MgO', 'CaCO₃ → CaO + CO₂', 'Zn + CuSO₄ → ZnSO₄ + Cu', 'NaOH + HCl → NaCl + H₂O'],
    answer: '2Mg + O₂ → 2MgO',
    explanation: 'In a combination reaction, two or more substances combine to form a single product.',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Chemical Reactions and Equations',
    subject: 'Chemistry',
    topic: 'Types of Reactions'
  },
  {
    id: 'chem_cr_2',
    question: 'The process of reduction involves:',
    type: 'mcq',
    options: ['Gain of electrons', 'Loss of electrons', 'Gain of oxygen', 'Loss of hydrogen'],
    answer: 'Gain of electrons',
    explanation: 'Reduction is the gain of electrons or decrease in oxidation state. OIL RIG: Oxidation Is Loss, Reduction Is Gain.',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Chemical Reactions and Equations',
    subject: 'Chemistry',
    topic: 'Redox Reactions'
  },
  {
    id: 'chem_cr_3',
    question: 'Balance the equation: Fe + H₂O → Fe₃O₄ + H₂',
    type: 'short',
    answer: '3Fe + 4H₂O → Fe₃O₄ + 4H₂',
    explanation: 'Count atoms on both sides and balance: 3 Fe atoms, 4 O atoms, and 8 H atoms on each side.',
    marks: 2,
    difficulty: 'medium',
    chapter: 'Chemical Reactions and Equations',
    subject: 'Chemistry',
    topic: 'Balancing Equations'
  },

  // Biology - Life Processes
  {
    id: 'bio_lp_1',
    question: 'Which of the following is the site of photosynthesis?',
    type: 'mcq',
    options: ['Chloroplast', 'Mitochondria', 'Ribosome', 'Nucleus'],
    answer: 'Chloroplast',
    explanation: 'Chloroplasts contain chlorophyll, the green pigment that captures light energy for photosynthesis.',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Life Processes',
    subject: 'Biology',
    topic: 'Photosynthesis'
  },
  {
    id: 'bio_lp_2',
    question: 'The correct equation for photosynthesis is:',
    type: 'mcq',
    options: ['6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6H₂', 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O', '6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O'],
    answer: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
    explanation: 'In photosynthesis, carbon dioxide and water are converted to glucose and oxygen using light energy.',
    marks: 1,
    difficulty: 'medium',
    chapter: 'Life Processes',
    subject: 'Biology',
    topic: 'Photosynthesis'
  },
  {
    id: 'bio_lp_3',
    question: 'The blood vessel that carries deoxygenated blood from the heart to the lungs is:',
    type: 'mcq',
    options: ['Pulmonary artery', 'Pulmonary vein', 'Aorta', 'Vena cava'],
    answer: 'Pulmonary artery',
    explanation: 'The pulmonary artery is the only artery that carries deoxygenated blood, from the right ventricle to the lungs.',
    marks: 1,
    difficulty: 'medium',
    chapter: 'Life Processes',
    subject: 'Biology',
    topic: 'Circulation'
  },

  // More questions for variety
  {
    id: 'math_ap_1',
    question: 'The 10th term of AP: 2, 7, 12, ... is:',
    type: 'mcq',
    options: ['47', '52', '42', '57'],
    answer: '47',
    explanation: 'Here a = 2, d = 5. Using aₙ = a + (n-1)d, a₁₀ = 2 + 9(5) = 47.',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Arithmetic Progressions',
    subject: 'Mathematics',
    topic: 'nth Term'
  },
  {
    id: 'math_tri_1',
    question: 'In a triangle ABC, if AB = AC and ∠B = 50°, find ∠A.',
    type: 'mcq',
    options: ['80°', '50°', '100°', '65°'],
    answer: '80°',
    explanation: 'Since AB = AC, ∠B = ∠C = 50°. Therefore ∠A = 180° - 50° - 50° = 80°.',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Triangles',
    subject: 'Mathematics',
    topic: 'Properties'
  },
  {
    id: 'phy_elec_1',
    question: 'The SI unit of electric current is:',
    type: 'mcq',
    options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
    answer: 'Ampere',
    explanation: 'Electric current is measured in Amperes (A). 1 Ampere = 1 Coulomb per second.',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Electricity',
    subject: 'Physics',
    topic: 'Current'
  },
  {
    id: 'phy_elec_2',
    question: 'According to Ohm\'s law, V = IR. If V = 12V and R = 4Ω, find I.',
    type: 'mcq',
    options: ['3A', '48A', '0.33A', '8A'],
    answer: '3A',
    explanation: 'Using Ohm\'s law I = V/R = 12/4 = 3 Amperes.',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Electricity',
    subject: 'Physics',
    topic: 'Ohm\'s Law'
  },
  {
    id: 'chem_acid_1',
    question: 'The pH of a neutral solution is:',
    type: 'mcq',
    options: ['7', '0', '14', '1'],
    answer: '7',
    explanation: 'Neutral solutions have pH = 7. Acidic solutions have pH < 7, basic solutions have pH > 7.',
    marks: 1,
    difficulty: 'easy',
    chapter: 'Acids Bases and Salts',
    subject: 'Chemistry',
    topic: 'pH Scale'
  },
  {
    id: 'chem_acid_2',
    question: 'Which indicator turns pink in basic solution?',
    type: 'mcq',
    options: ['Phenolphthalein', 'Methyl orange', 'Litmus', 'Universal indicator'],
    answer: 'Phenolphthalein',
    explanation: 'Phenolphthalein is colorless in acidic solutions and turns pink in basic solutions.',
    marks: 1,
    difficulty: 'medium',
    chapter: 'Acids Bases and Salts',
    subject: 'Chemistry',
    topic: 'Indicators'
  },
];

// AI Response templates for doubt solver
export const aiResponseTemplates = {
  simple: "Let me explain this in a simple way:\n\n{explanation}\n\nIn simple terms: {summary}",
  detailed: "Here's a detailed explanation:\n\n**Concept:**\n{concept}\n\n**Working:**\n{working}\n\n**Key Points:**\n{keyPoints}\n\n**Summary:**\n{summary}",
  example: "Let me explain with a real-life example:\n\n**Example:**\n{example}\n\n**Connection to concept:**\n{connection}\n\n**How it applies:**\n{application}",
  examOriented: "📝 **Exam-oriented explanation:**\n\n**Important for exams:**\n{important}\n\n**Common questions:**\n{questions}\n\n**Marking scheme tips:**\n{tips}\n\n**Remember:**\n{remember}"
};

export const doubtResponses: Record<string, string> = {
  'quadratic': `Great question about Quadratic Equations! 📐

**What is a Quadratic Equation?**
A quadratic equation is any equation that can be written in the form:
ax² + bx + c = 0, where a ≠ 0

**Key Methods to Solve:**

1️⃣ **Factorization**
   - Split the middle term
   - Find two numbers whose product = ac and sum = b

2️⃣ **Quadratic Formula**
   x = (-b ± √(b² - 4ac)) / 2a

3️⃣ **Completing the Square**
   - Make the equation a perfect square

**The Discriminant (D = b² - 4ac):**
- D > 0: Two distinct real roots
- D = 0: Two equal real roots  
- D < 0: No real roots (imaginary)

💡 **Exam Tip:** Always check the discriminant first to know the nature of roots!`,

  'photosynthesis': `Let me explain Photosynthesis in detail! 🌿

**What is Photosynthesis?**
The process by which green plants make their own food using sunlight, carbon dioxide, and water.

**The Equation:**
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂

**Where it happens:**
- Chloroplasts (contain chlorophyll - the green pigment)
- Mainly in leaves (but any green part can do it)

**Two Stages:**

1️⃣ **Light Reaction (Light-dependent)**
   - Occurs in thylakoid membranes
   - Captures light energy
   - Produces ATP and NADPH
   - Releases oxygen

2️⃣ **Dark Reaction (Calvin Cycle)**
   - Occurs in stroma
   - Uses ATP and NADPH
   - Fixes CO₂ into glucose

**Factors Affecting Photosynthesis:**
- Light intensity ☀️
- CO₂ concentration 💨
- Temperature 🌡️
- Water availability 💧

💡 **Real-life example:** Just like how we need food for energy, plants make their own energy through photosynthesis!`,

  'electricity': `Let's understand Electricity! ⚡

**What is Electric Current?**
The flow of electric charge (electrons) through a conductor.

**Ohm's Law:** V = IR
- V = Voltage (potential difference) in Volts
- I = Current in Amperes
- R = Resistance in Ohms

**Important Formulas:**

1️⃣ **Resistance in Series:**
   R_total = R₁ + R₂ + R₃...

2️⃣ **Resistance in Parallel:**
   1/R_total = 1/R₁ + 1/R₂ + 1/R₃...

3️⃣ **Power:**
   P = VI = I²R = V²/R

4️⃣ **Energy:**
   E = Pt = VIt

**Key Concepts:**
- Current flows from +ve to -ve terminal
- Electrons flow from -ve to +ve terminal
- Resistance opposes current flow

💡 **Think of it like water:**
- Voltage = Water pressure
- Current = Water flow rate
- Resistance = Pipe thickness`,

  'default': `I'll help you understand this concept! 📚

**Breaking it down:**

Let me analyze your question step by step...

**Key Points:**
1. First, let's understand the basics
2. Then we'll look at how it applies
3. Finally, we'll see examples

**Remember:** Every complex topic can be broken into simpler parts.

Would you like me to:
- Explain with a real-life example? 🌍
- Give you step-by-step solution? 📝
- Focus on exam-important points? 📖

Just ask and I'll help you master this!`
};
