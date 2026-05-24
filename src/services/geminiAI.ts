/**
 * Google Gemini AI Integration - MULTI-SYLLABUS & HIGH-FIDELITY VERSION
 * Powered by Gemini 2.5 Flash
 * Dynamic support for CBSE, State Board, IIT-JEE, and NEET
 */

// Get API key from env
const GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY || '';

// API Endpoint - Latest Gemini 2.5 Flash model
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Check if API key is configured
export function isAPIConfigured(): boolean {
  return GEMINI_API_KEY !== '' && GEMINI_API_KEY.length > 10;
}

/**
 * Main function to call Gemini AI with retry logic
 */
export async function askGemini(prompt: string, maxRetries: number = 2): Promise<string> {
  if (!isAPIConfigured()) {
    return getFallbackResponse(prompt);
  }

  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            topP: 0.95,
            topK: 40,
            responseMimeType: 'text/plain',
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Gemini API Error (attempt ${attempt + 1}):`, response.status, errorText);
        
        if (response.status === 400 || response.status === 403) {
          return getFallbackResponse(prompt);
        }
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        return getFallbackResponse(prompt);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        console.warn('⚠️ Empty response from Gemini');
        return getFallbackResponse(prompt);
      }

      return text;
    } catch (error) {
      lastError = error;
      console.error(`❌ Network Error (attempt ${attempt + 1}):`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  console.error('All retries failed:', lastError);
  return getFallbackResponse(prompt);
}

/**
 * Helper: Extract JSON from AI response
 */
function extractJSON(text: string, type: 'array' | 'object' = 'array'): any {
  try {
    let cleaned = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    const pattern = type === 'array' ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
    const match = cleaned.match(pattern);
    
    if (match) {
      return JSON.parse(match[0]);
    }
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
}

/**
 * Solve a student's doubt dynamically adapting to their target exam and explanation style
 */
export async function solveDoubt(question: string, explanationType: string, examTarget: string = 'cbse_10'): Promise<string> {
  const roleInstructions: Record<string, string> = {
    cbse_10: 'You are a friendly and expert CBSE Class 10 tutor with 15+ years of experience. Strictly align your answer with NCERT textbooks and official CBSE guidelines. Support LaTeX formatting ($...$) for equations.',
    state_10: 'You are an expert Class 10 State Board tutor. Explain definitions exactly as they are defined in standard state textbook boards. Be very objective, straightforward, and emphasize points that score high marks.',
    iit_jee: 'You are an elite IIT-JEE (Main & Advanced) Coach. Your student has a deep scientific query. Focus on highly rigorous concepts, core mathematical derivations, advanced physics/chemistry, and high-level analytical tricks. Support LaTeX formatting ($...$) for mathematical equations.',
    neet: 'You are a senior pre-medical tutor specializing in NEET Prep. Answer the question using precise botanical/zoological NCERT statement-based concepts, and provide analytical biological explanations, chemical reaction mechanisms, or high-yield physics shortcuts.',
  };

  const styleInstructions: Record<string, string> = {
    simple: 'Explain in very simple terms. Use short sentences, everyday language, and bullet points.',
    detailed: 'Give a thorough, detailed academic explanation with concepts, core mechanisms, mathematical derivations/formulas, and practical applications.',
    example: 'Explain primarily through real-life analogies, relatable scenarios, and practical examples.',
    exam: 'Explain strictly from an exam scoring perspective: outline key points, marking scheme traps to avoid, most important keywords to include, and a quick scoring tip.',
  };

  const prompt = `${roleInstructions[examTarget] || roleInstructions.cbse_10}

📚 Student's Question: "${question}"

📝 Explanation Style: ${styleInstructions[explanationType] || styleInstructions.simple}

🎯 Formatting Guidelines:
- Start with an encouraging, friendly greeting
- Support clean markdown formatting
- Use **bold** for key keywords and formulas
- Support LaTeX formatting for math/science equations using single dollars like $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ or chemical elements so they look beautiful!
- End with a clean summary titled "## Key Takeaway"

Now write your expert response:`;

  return askGemini(prompt);
}

/**
 * Generate quiz questions - dynamic for CBSE, IIT-JEE, or NEET
 */
export async function generateQuizQuestions(
  subject: string,
  chapter: string,
  difficulty: string,
  count: number,
  examTarget: string = 'cbse_10'
): Promise<any[]> {
  const targetGuidelines: Record<string, string> = {
    cbse_10: 'CBSE Class 10 Board Exam level. Straightforward concept checking. Questions should align with standard NCERT.',
    state_10: 'State Board Class 10 level. Definition-based and direct factual textbook checking.',
    iit_jee: 'IIT-JEE level (advanced engineering). Questions must be mathematically demanding, multi-conceptual, analytical, and test core mechanics/physics/chemistry at a competitive level.',
    neet: 'NEET level (medical entrance). Biology questions must be high-yield NCERT line statement-based. Physics/Chemistry must focus on core clinical application or analytical numericals.',
  };

  const prompt = `You are an elite expert content creator specialized in ${examTarget.toUpperCase()} creating an interactive MCQ quiz.

📋 REQUIREMENTS:
- Subject: ${subject}
- Chapter/Topic: ${chapter}
- Difficulty Level: ${difficulty} (Adjust conceptual complexity exactly for this target difficulty)
- Number of Questions: EXACTLY ${count} (Mandatory!)
- targetExam: ${targetGuidelines[examTarget] || targetGuidelines.cbse_10}

⚠️ CRITICAL RULES:
1. Generate EXACTLY ${count} questions - double check before responding.
2. Formulate correct answers and realistic distractors suitable for the entrance level.
3. Use clean, clear mathematical or scientific text. Use standard inline LaTeX formulas if applicable (like $y = mx+c$ or $H_2SO_4$).
4. Return ONLY valid JSON array - no markdown, no extra explanation text, no code fences.

📐 EXACT JSON FORMAT (array of objects):
[
  {
    "question": "Question statement?",
    "options": ["First option", "Second option", "Third option", "Fourth option"],
    "answer": "First option",
    "explanation": "Brief explanation of why this is correct and why others are incorrect",
    "topic": "Specific subtopic name"
  }
]

Now generate the complete JSON array of ${count} questions:`;

  try {
    const response = await askGemini(prompt);
    const questions = extractJSON(response, 'array');
    
    if (Array.isArray(questions) && questions.length > 0) {
      return questions.map((q: any, i: number) => ({
        ...q,
        id: `ai_${Date.now()}_${i}`,
        type: 'mcq',
        marks: examTarget === 'iit_jee' ? 3 : (examTarget === 'neet' ? 4 : 1),
        difficulty,
        chapter,
        subject,
      }));
    }
    return [];
  } catch (error) {
    console.error('Quiz generation error:', error);
    return [];
  }
}

/**
 * Generate official question paper aligning strictly to selected board/target pattern
 */
export async function generatePaperQuestions(
  subject: string,
  chapter: string,
  difficulty: string,
  questionTypes: { mcq: boolean; short: boolean; long: boolean },
  examTarget: string = 'cbse_10'
): Promise<any> {
  const mcqCount = questionTypes.mcq ? 5 : 0;
  const shortCount = questionTypes.short ? 3 : 0;
  const longCount = questionTypes.long ? 2 : 0;

  let patternInstructions = '';
  let jsonFormatTemplate = '';

  if (examTarget === 'iit_jee') {
    patternInstructions = `IIT-JEE Paper Pattern:
- MCQs (Single Correct Option, 3 Marks each)
- Multiple Correct Option Questions (4 Marks each, options have more than one right answer)
- Numerical / Integer type questions where answers are numbers (3 Marks each)`;

    jsonFormatTemplate = `{
  "mcq": [
    {"question": "Advanced single correct question?", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": "Option A", "explanation": "Step-by-step JEE derivation", "marks": 3}
  ],
  "short": [
    {"question": "Multiple correct options question (explain which are correct in options)?", "options": ["A & B", "B & C", "A & D", "All are correct"], "answer": "A & B", "explanation": "Detailed multiple choice derivation", "marks": 4}
  ],
  "long": [
    {"question": "Numerical Value / Integer Type Question (solve for an integer value)?", "answer": "42", "explanation": "Step-by-step mathematical working yielding integer 42", "marks": 3}
  ]
}`;
  } else if (examTarget === 'neet') {
    patternInstructions = `NEET Medical Pattern:
- Section A: Single Correct Biology/Physics/Chemistry MCQs (4 Marks each)
- Assertion-Reason Statement Questions (4 Marks each)
- Match the following columns questions (4 Marks each)`;

    jsonFormatTemplate = `{
  "mcq": [
    {"question": "Factual NCERT statement biological MCQ?", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "Line referenced from NCERT Biology", "marks": 4}
  ],
  "short": [
    {"question": "Assertion (A): ... Reason (R): ...", "options": ["Both A and R are true and R is correct explanation of A", "Both A and R are true but R is not correct", "A is true but R is false", "Both are false"], "answer": "Both A and R are true and R is correct explanation of A", "explanation": "Analytical proof", "marks": 4}
  ],
  "long": [
    {"question": "Match Column I with Column II... (structured matching)?", "answer": "A-r, B-p, C-s, D-q", "explanation": "Comprehensive matching definition", "marks": 4}
  ]
}`;
  } else if (examTarget === 'state_10') {
    patternInstructions = `State Board pattern focusing heavily on Textbook definitions, standard subjective questions:
- MCQs (1 Mark each)
- Short Answer / Define Term subjective questions (2 Marks each)
- Long subjective descriptive / proof questions (5 Marks each)`;

    jsonFormatTemplate = `{
  "mcq": [
    {"question": "Textbook definition MCQ?", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "Textbook source proof", "marks": 1}
  ],
  "short": [
    {"question": "Define the term or state law subjective question?", "answer": "Clear textbook definition and statements", "marks": 2}
  ],
  "long": [
    {"question": "Describe the process or solve theorem proof?", "answer": "Fully formulated step-by-step description with points", "marks": 5}
  ]
}`;
  } else {
    // CBSE 10
    patternInstructions = `Official CBSE Board Pattern:
- Multiple Choice Questions (1 Mark each)
- Short Answer Questions (2 Marks each)
- Long Answer step-by-step Questions (5 Marks each)`;

    jsonFormatTemplate = `{
  "mcq": [
    {"question": "CBSE MCQ?", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "CBSE board grading proof", "marks": 1}
  ],
  "short": [
    {"question": "CBSE short answer subjective?", "answer": "2-3 lines grading answers", "marks": 2}
  ],
  "long": [
    {"question": "CBSE long answer subjective?", "answer": "Step-by-step detailed marking scheme answer", "marks": 5}
  ]
}`;
  }

  const prompt = `You are a senior board examiner creating an official exam paper for ${examTarget.toUpperCase()}.

📋 PAPER DETAILS:
- Subject: ${subject}
- Chapter/Topic: ${chapter === 'all' ? 'Full Syllabus' : chapter}
- Difficulty Level: ${difficulty}
- targetExam: ${examTarget.toUpperCase()}

⚠️ PAPER STRUCTURE TO FOLLOW:
${patternInstructions}

Generate EXACTLY:
${questionTypes.mcq ? `✓ ${mcqCount} MCQ questions` : ''}
${questionTypes.short ? `✓ ${shortCount} Short/Section B questions` : ''}
${questionTypes.long ? `✓ ${longCount} Long/Section C questions` : ''}

Use elegant, clear math notation. Support LaTeX formatting ($...$) inside text for formulas.

📐 RETURN ONLY THIS VALID JSON (no markdown code blocks, no backticks, no extra text):
${jsonFormatTemplate}

Now generate the complete paper JSON structure:`;

  try {
    const response = await askGemini(prompt);
    return extractJSON(response, 'object');
  } catch (error) {
    console.error('Paper generation error:', error);
    return null;
  }
}

/**
 * Get AI explanation for quiz answers
 */
export async function explainAnswer(
  question: string,
  correctAnswer: string,
  studentAnswer: string
): Promise<string> {
  const isCorrect = correctAnswer === studentAnswer;
  
  const prompt = `You are an encouraging tutor reviewing a student's quiz answer.

📝 Question: ${question}
✅ Correct Answer: ${correctAnswer}
👤 Student's Answer: ${studentAnswer}
Result: ${isCorrect ? 'CORRECT ✅' : 'INCORRECT ❌'}

Provide a friendly 3-sentence explanation of why the correct answer is right. Use LaTeX formatting ($...$) for any scientific/mathematical formula if appropriate.`;

  return askGemini(prompt);
}

/**
 * Generate study notes/summary for a topic
 */
export async function generateStudyNotes(subject: string, topic: string): Promise<string> {
  const prompt = `Create comprehensive study notes on "${topic}" for ${subject}.
Include definitions, mathematical formulas (using $...$ LaTeX), bullet points, and common exam questions.`;

  return askGemini(prompt);
}

/**
 * Analyze performance
 */
export async function analyzePerformance(
  studentName: string,
  results: { subject: string; score: number; total: number; chapter: string }[]
): Promise<string> {
  const prompt = `Analyze recent test results for student ${studentName}:
${results.map(r => `- ${r.subject} (${r.chapter}): ${r.score}/${r.total}`).join('\n')}
Provide overall analysis, strengths, weaknesses, and a 7-day study plan.`;

  return askGemini(prompt);
}

/**
 * Fallback responses
 */
function getFallbackResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('quadratic')) {
    return `📐 **Quadratic Equations**

A quadratic equation has the form: **ax² + bx + c = 0** (where a ≠ 0)

**Methods to Solve:**
1. **Factorization** - Split middle term
2. **Quadratic Formula:** x = (-b ± √(b²-4ac)) / 2a
3. **Completing the Square**

**Discriminant (D = b² - 4ac):**
- D > 0 → Two distinct real roots
- D = 0 → Two equal roots
- D < 0 → No real roots

⚠️ AI is currently in fallback mode. Please check your API connection.`;
  }
  
  if (lower.includes('photosynthesis')) {
    return `🌿 **Photosynthesis**

Process by which plants make food using sunlight!

**Equation:** 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂

**Where:** Chloroplasts (contain chlorophyll)
**Two Stages:**
1. Light Reaction (produces ATP)
2. Calvin Cycle (makes glucose)

⚠️ AI is currently in fallback mode. Please check your API connection.`;
  }

  return `🤖 **AI Service Unavailable**

The AI is currently in fallback mode. This usually means:
- API key not configured in .env file
- Network connection issue  
- API quota exceeded (try again in a minute)

Please check the browser console for details.`;
}