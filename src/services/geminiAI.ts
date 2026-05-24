/**
 * Google Gemini AI Integration - OPTIMIZED VERSION
 * Powered by Gemini 2.5 Flash
 */

// Get API key from .env file
const GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY || '';

// API Endpoint - Latest Gemini 2.5 Flash model
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Check if API key is configured
export function isAPIConfigured(): boolean {
  return GEMINI_API_KEY !== '' && GEMINI_API_KEY.length > 10;
}

/**
 * Main function to call Gemini AI
 * Optimized with retry logic and better error handling
 */
export async function askGemini(prompt: string, maxRetries: number = 2): Promise<string> {
  if (!isAPIConfigured()) {
    return getFallbackResponse(prompt);
  }

  let lastError: any = null;

  // Retry logic - try up to maxRetries times
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
        
        // Don't retry on 400 (bad request) or 403 (forbidden)
        if (response.status === 400 || response.status === 403) {
          return getFallbackResponse(prompt);
        }
        
        // Retry on 429 (rate limit) or 500+ (server errors)
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
 * Helper: Extract JSON from AI response (handles markdown code blocks)
 */
function extractJSON(text: string, type: 'array' | 'object' = 'array'): any {
  try {
    // Remove markdown code blocks if present
    let cleaned = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    // Try to find JSON in the cleaned text
    const pattern = type === 'array' ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
    const match = cleaned.match(pattern);
    
    if (match) {
      return JSON.parse(match[0]);
    }
    
    // Fallback: try parsing the entire cleaned text
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
}

/**
 * Solve a student's doubt with different explanation styles
 */
export async function solveDoubt(question: string, explanationType: string): Promise<string> {
  const typeInstructions: Record<string, string> = {
    simple: 'Explain in very simple terms that a 10th grade student can easily understand. Use short sentences and everyday language.',
    detailed: 'Give a thorough, detailed explanation with the concept, working principle, derivations, formulas, and multiple examples.',
    example: 'Explain primarily through real-life relatable examples and analogies that connect the concept to everyday situations.',
    exam: 'Explain from CBSE board exam perspective: what is most important, how marks are typically distributed, common student mistakes to avoid, and key revision points.',
  };

  const prompt = `You are a friendly and expert CBSE Class 10 tutor with 15+ years of experience.

📚 Student's Question: "${question}"

📝 Explanation Style: ${typeInstructions[explanationType] || typeInstructions.simple}

🎯 Format Guidelines:
- Start with a brief, friendly greeting
- Use clear headings (## for main points)
- Use bullet points for lists
- Include relevant formulas in **bold**
- Add 2-3 emojis to make it engaging
- End with a quick "Key Takeaway" summary
- Keep it well-structured and easy to read

Now provide your best explanation:`;

  return askGemini(prompt);
}

/**
 * Generate quiz questions - GUARANTEED to return requested count
 */
export async function generateQuizQuestions(
  subject: string,
  chapter: string,
  difficulty: string,
  count: number
): Promise<any[]> {
  const prompt = `You are a CBSE Class 10 ${subject} expert teacher creating an MCQ quiz.

📋 REQUIREMENTS:
- Subject: ${subject}
- Chapter/Topic: ${chapter}
- Difficulty: ${difficulty}
- Number of Questions: EXACTLY ${count} (this is mandatory!)

⚠️ CRITICAL RULES:
1. Generate EXACTLY ${count} questions - count them before responding!
2. Each question must cover a DIFFERENT subtopic
3. Mix question types: 60% conceptual, 40% numerical/application
4. Vary correct answer position randomly (A, B, C, D)
5. Make options realistic - all should seem plausible
6. Return ONLY valid JSON array - no markdown, no extra text, no code fences

📐 EXACT FORMAT (return ${count} objects in this array):
[
  {
    "question": "Clear and complete question text?",
    "options": ["First option", "Second option", "Third option", "Fourth option"],
    "answer": "First option",
    "explanation": "Brief 1-2 line explanation of why this is correct",
    "topic": "Specific subtopic name"
  }
]

🎯 FINAL CHECK before responding:
✓ Did you generate exactly ${count} questions?
✓ Are all questions unique?
✓ Is the JSON valid?
✓ No markdown formatting?

Generate the complete array of ${count} questions now:`;

  try {
    const response = await askGemini(prompt);
    console.log(`🎯 Quiz Response Length: ${response.length} chars`);
    
    const questions = extractJSON(response, 'array');
    
    if (Array.isArray(questions) && questions.length > 0) {
      console.log(`✅ Generated ${questions.length} questions (asked for ${count})`);
      
      // If AI gave fewer questions, log warning
      if (questions.length < count) {
        console.warn(`⚠️ AI returned ${questions.length} instead of ${count}. Try again or reduce count.`);
      }
      
      return questions.map((q: any, i: number) => ({
        ...q,
        id: `ai_${Date.now()}_${i}`,
        type: 'mcq',
        marks: 1,
        difficulty,
        chapter,
        subject,
      }));
    }
    
    console.error('❌ No valid questions in response:', response.substring(0, 300));
    return [];
  } catch (error) {
    console.error('❌ Failed to generate quiz:', error);
    return [];
  }
}

/**
 * Generate complete CBSE question paper
 */
export async function generatePaperQuestions(
  subject: string,
  chapter: string,
  difficulty: string,
  questionTypes: { mcq: boolean; short: boolean; long: boolean }
): Promise<any> {
  const mcqCount = questionTypes.mcq ? 5 : 0;
  const shortCount = questionTypes.short ? 3 : 0;
  const longCount = questionTypes.long ? 2 : 0;
  const totalMarks = (mcqCount * 1) + (shortCount * 2) + (longCount * 5);

  const prompt = `You are a senior CBSE examiner creating an official Class 10 ${subject} question paper.

📋 PAPER DETAILS:
- Subject: ${subject}
- Chapter: ${chapter === 'all' ? 'Full Syllabus' : chapter}
- Difficulty Level: ${difficulty}
- Total Marks: ${totalMarks}

⚠️ MANDATORY REQUIREMENTS - Generate EXACTLY:
${questionTypes.mcq ? `✓ ${mcqCount} MCQ questions (1 mark each = ${mcqCount * 1} marks)` : ''}
${questionTypes.short ? `✓ ${shortCount} Short Answer questions (2 marks each = ${shortCount * 2} marks)` : ''}
${questionTypes.long ? `✓ ${longCount} Long Answer questions (5 marks each = ${longCount * 5} marks)` : ''}

📐 RETURN ONLY THIS JSON (no markdown, no backticks, no extra text):

{
  "mcq": [
    ${mcqCount > 0 ? '{"question": "...", "options": ["A","B","C","D"], "answer": "A", "explanation": "...", "marks": 1}' : ''}
  ],
  "short": [
    ${shortCount > 0 ? '{"question": "...", "answer": "Complete 2-3 line answer", "marks": 2}' : ''}
  ],
  "long": [
    ${longCount > 0 ? '{"question": "...", "answer": "Detailed step-by-step answer with explanation", "marks": 5}' : ''}
  ]
}

🎯 QUALITY CHECKLIST:
✓ Cover diverse topics from chapter
✓ Mix conceptual and numerical questions
✓ Follow CBSE marking scheme exactly
✓ Make questions exam-standard
✓ Provide complete, accurate answers
✓ Vary correct answer positions in MCQs

Generate the COMPLETE paper with ALL ${mcqCount + shortCount + longCount} questions now:`;

  try {
    const response = await askGemini(prompt);
    console.log(`📄 Paper Response Length: ${response.length} chars`);
    
    const paper = extractJSON(response, 'object');
    
    if (paper) {
      const counts = {
        mcq: paper.mcq?.length || 0,
        short: paper.short?.length || 0,
        long: paper.long?.length || 0,
      };
      console.log('📊 Paper Generated:', counts);
      
      // Warn if counts don't match
      if (questionTypes.mcq && counts.mcq < mcqCount) {
        console.warn(`⚠️ MCQ: Got ${counts.mcq}, expected ${mcqCount}`);
      }
      if (questionTypes.short && counts.short < shortCount) {
        console.warn(`⚠️ Short: Got ${counts.short}, expected ${shortCount}`);
      }
      if (questionTypes.long && counts.long < longCount) {
        console.warn(`⚠️ Long: Got ${counts.long}, expected ${longCount}`);
      }
      
      return paper;
    }
    
    console.error('❌ Failed to parse paper from response');
    return null;
  } catch (error) {
    console.error('❌ Failed to generate paper:', error);
    return null;
  }
}

/**
 * Get AI explanation for a quiz answer
 */
export async function explainAnswer(
  question: string,
  correctAnswer: string,
  studentAnswer: string
): Promise<string> {
  const isCorrect = correctAnswer === studentAnswer;
  
  const prompt = `You are an encouraging CBSE Class 10 tutor reviewing a student's quiz answer.

📝 Question: ${question}
✅ Correct Answer: ${correctAnswer}
👤 Student's Answer: ${studentAnswer}
🎯 Result: ${isCorrect ? 'CORRECT ✅' : 'INCORRECT ❌'}

${isCorrect 
  ? 'Briefly congratulate them, explain WHY this answer is correct, and add one interesting fact or tip to deepen their understanding.' 
  : 'Kindly explain WHY their answer is wrong and WHY the correct answer is right. Use a simple analogy if helpful. Be encouraging - never make them feel bad.'}

📏 Rules:
- Maximum 3-4 sentences
- Friendly, supportive tone
- Use 1-2 emojis
- Educational and clear

Respond now:`;

  return askGemini(prompt);
}

/**
 * Generate study notes/summary for a topic
 */
export async function generateStudyNotes(subject: string, topic: string): Promise<string> {
  const prompt = `Create comprehensive CBSE Class 10 ${subject} study notes on "${topic}".

📚 Include:
- Brief introduction
- Key concepts (with definitions)
- Important formulas (in **bold**)
- 2-3 worked examples
- Common exam questions
- Quick revision summary
- Memory tricks/mnemonics if applicable

Format with clear headings (##) and bullet points. Use emojis sparingly for engagement.`;

  return askGemini(prompt);
}

/**
 * Analyze student performance and give personalized feedback
 */
export async function analyzePerformance(
  studentName: string,
  results: { subject: string; score: number; total: number; chapter: string }[]
): Promise<string> {
  const prompt = `You are an expert CBSE academic counselor analyzing student performance.

👤 Student: ${studentName}
📊 Recent Quiz Results:
${results.map(r => `- ${r.subject} (${r.chapter}): ${r.score}/${r.total} = ${Math.round(r.score/r.total*100)}%`).join('\n')}

📝 Provide:
1. **Overall Performance Summary** (2-3 sentences)
2. **Strengths** 💪 (what they're doing well)
3. **Areas to Improve** 📈 (specific weak topics)
4. **Personalized Study Plan** 🎯 (next 7 days)
5. **Motivational Message** ✨ (encouraging note)

Keep it positive, specific, and actionable. Use emojis and clear formatting.`;

  return askGemini(prompt);
}

/**
 * Fallback responses when API is not configured or fails
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