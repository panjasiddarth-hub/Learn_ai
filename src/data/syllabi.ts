export type ExamTarget = 'cbse_10' | 'state_10' | 'iit_jee' | 'neet';

export interface ExamDetails {
  id: ExamTarget;
  name: string;
  shortName: string;
  description: string;
  badgeColor: string;
  bgGradient: string;
  subjects: string[];
  chapters: Record<string, string[]>;
  paperBlueprint: string;
}

export const examTargets: Record<ExamTarget, ExamDetails> = {
  cbse_10: {
    id: 'cbse_10',
    name: 'CBSE Class 10th Board',
    shortName: 'CBSE Class 10',
    description: 'NCERT aligned curriculum with Section A-E boards questions, Case-studies, and board marking guidelines.',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    bgGradient: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    chapters: {
      Mathematics: ['Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Trigonometry', 'Circles', 'Surface Areas and Volumes', 'Statistics', 'Probability'],
      Physics: ['Light - Reflection and Refraction', 'Human Eye and Colourful World', 'Electricity', 'Magnetic Effects of Electric Current', 'Sources of Energy'],
      Chemistry: ['Chemical Reactions and Equations', 'Acids Bases and Salts', 'Metals and Non-metals', 'Carbon and its Compounds', 'Periodic Classification of Elements'],
      Biology: ['Life Processes', 'Control and Coordination', 'How do Organisms Reproduce', 'Heredity and Evolution', 'Our Environment'],
      English: ['Letter Writing', 'Essay Writing', 'Comprehension', 'Grammar', 'Literature']
    },
    paperBlueprint: `CBSE Section A-E Pattern:
- Section A: 5 MCQs (1 mark each)
- Section B: 3 Short Answers (2 marks each)
- Section C: 2 Long Answers (5 marks each)`
  },
  state_10: {
    id: 'state_10',
    name: 'State Board Class 10th',
    shortName: 'State Board 10',
    description: 'State board curriculum focusing on textbook definitions, state board paper pattern with multiple objectives.',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    bgGradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
    subjects: ['Mathematics', 'Science & Technology', 'Social Science', 'English', 'Second Language'],
    chapters: {
      Mathematics: ['Algebra (Quadratic Equations, AP, Financial Planning, Probability)', 'Geometry (Similarity, Pythagoras, Circle, Coordinate, Trigonometry, Mensuration)'],
      'Science & Technology': ['Gravitation', 'Periodic Classification', 'Chemical Reactions', 'Effects of Electric Current', 'Heat', 'Refraction of Light', 'Lenses', 'Metallurgy', 'Carbon Compounds', 'Space Missions'],
      'Social Science': ['History & Political Science', 'Geography & Economics'],
      English: ['Grammar & Vocabulary', 'Writing Skills', 'Prose & Poetry'],
      'Second Language': ['Hindi/Regional Grammar', 'Regional Literature & Prose']
    },
    paperBlueprint: `State Board Objective-Heavy Pattern:
- Objective Section: MCQs & Fill-in-the-blanks (1 mark each)
- Short Answer Section: Explain definitions (2 marks each)
- Long Answer Section: Essay / Proof type questions (5 marks each)`
  },
  iit_jee: {
    id: 'iit_jee',
    name: 'IIT-JEE Prep (Main & Advanced)',
    shortName: 'IIT-JEE',
    description: 'Rigorous Engineering entrance preparation focusing on advanced concepts, analytical problem solving, and multi-concept questions.',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    bgGradient: 'from-violet-500/10 to-fuchsia-500/10 border-violet-500/20',
    subjects: ['Mathematics (JEE)', 'Physics (JEE)', 'Chemistry (JEE)'],
    chapters: {
      'Mathematics (JEE)': ['Sets, Relations & Functions', 'Complex Numbers & Quadratic Equations', 'Matrices & Determinants', 'Permutations & Combinations', 'Mathematical Induction', 'Binomial Theorem', 'Sequences & Series', 'Limits, Continuity & Differentiability', 'Integral Calculus', 'Differential Equations', 'Coordinate Geometry', 'Three Dimensional Geometry', 'Vector Algebra', 'Statistics & Probability', 'Trigonometry'],
      'Physics (JEE)': ['Units & Measurements', 'Kinematics (1D & 2D)', 'Laws of Motion', 'Work, Energy & Power', 'Rotational Motion', 'Gravitation', 'Properties of Solids & Fluids', 'Thermodynamics', 'Kinetic Theory of Gases', 'Oscillations & Waves', 'Electrostatics', 'Current Electricity', 'Magnetic Effects of Current', 'Electromagnetic Induction & AC', 'Electromagnetic Waves', 'Optics (Ray & Wave)', 'Dual Nature of Matter', 'Atoms & Nuclei', 'Electronic Devices'],
      'Chemistry (JEE)': ['Some Basic Concepts in Chemistry', 'States of Matter', 'Atomic Structure', 'Chemical Bonding & Molecular Structure', 'Chemical Thermodynamics', 'Solutions', 'Equilibrium', 'Redox Reactions & Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'Classification of Elements & Periodicity', 'General Principles & Processes of Isolation of Metals', 'Hydrogen & s-Block Elements', 'p-Block Elements', 'd- and f-Block Elements', 'Coordination Compounds', 'Environmental Chemistry', 'Organic Purification & Characterization', 'Hydrocarbons', 'Organic Compounds containing Halogens/Oxygen/Nitrogen', 'Polymers & Biomolecules', 'Chemistry in Everyday Life']
    },
    paperBlueprint: `IIT-JEE Entrance Pattern:
- Section A: Single Correct Option MCQs (3 marks, -1 negative mark)
- Section B: Multiple Correct Options MCQs (4 marks, partial marking)
- Section C: Numerical Value / Integer Type Questions (3 marks, no negative marking)`
  },
  neet: {
    id: 'neet',
    name: 'NEET Prep (Medical Entrance)',
    shortName: 'NEET',
    description: 'Medical entrance prep focusing on high-retention biology, analytical NCERT statement-based questions, and physics/chemistry applications.',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    bgGradient: 'from-rose-500/10 to-red-500/10 border-rose-500/20',
    subjects: ['Biology (NEET)', 'Physics (NEET)', 'Chemistry (NEET)'],
    chapters: {
      'Biology (NEET)': ['Diversity in Living World', 'Structural Organisation in Plants & Animals', 'Cell Structure and Function', 'Plant Physiology', 'Human Physiology', 'Reproduction', 'Genetics and Evolution', 'Biology and Human Welfare', 'Biotechnology and its Applications', 'Ecology and Environment'],
      'Physics (NEET)': ['Physical World & Measurement', 'Kinematics', 'Laws of Motion', 'Work, Energy & Power', 'Motion of System of Particles & Rigid Body', 'Gravitation', 'Properties of Bulk Matter', 'Thermodynamics', 'Oscillations & Waves', 'Electrostatics', 'Current Electricity', 'Magnetic Effects of Current & Magnetism', 'Electromagnetic Induction & AC', 'Electromagnetic Waves', 'Optics', 'Dual Nature of Matter & Radiation', 'Atoms & Nuclei', 'Electronic Devices'],
      'Chemistry (NEET)': ['Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 's-Block, p-Block, d- & f-Block Elements', 'Coordination Compounds', 'Organic Chemistry Principles', 'Hydrocarbons', 'Environmental Chemistry', 'Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'Haloalkanes & Haloarenes', 'Alcohols, Phenols & Ethers', 'Aldehydes, Ketones & Carboxylic Acids', 'Amines, Biomolecules & Polymers']
    },
    paperBlueprint: `NEET Medical Entrance Pattern:
- Section A: Single Correct Objective MCQs (4 marks, -1 negative mark)
- Statement & Assertion-Reason Questions (NCERT biology focused)
- Total paper marks: 180 Marks (Physics, Chemistry, Biology)`
  }
};
