import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Sparkles, Check, Loader2, Printer, Eye } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { examTargets } from '../data/syllabi';
import { generatePaperQuestions } from '../services/geminiAI';

function downloadPaperAsText(paper: any) {
  let text = '';
  text += `${'='.repeat(60)}\n`;
  text += `${paper.board} EXAM PRACTICE PAPER\n`;
  text += `Class ${paper.class} - ${paper.subject}\n`;
  text += `${paper.chapter === 'all' ? 'Full Syllabus' : paper.chapter}\n`;
  text += `${'='.repeat(60)}\n\n`;
  text += `Time: 3 Hours                    Max Marks: ${paper.totalMarks}\n\n`;
  text += `General Instructions:\n`;
  text += `(i) All questions are compulsory.\n`;
  text += `(ii) This question paper contains multiple sections.\n`;
  text += `(iii) Read each question carefully before answering.\n\n`;
  text += `${'─'.repeat(60)}\n\n`;

  let qNum = 1;
  const sectionNames: Record<string, string> = {
    mcq: 'SECTION A: OBJECTIVE / MULTIPLE CHOICE QUESTIONS',
    short: 'SECTION B: SHORT / MULTI-OPTION QUESTIONS',
    long: 'SECTION C: LONG / SUBJECTIVE / INT-TYPE QUESTIONS',
  };

  for (const [type, questions] of Object.entries(paper.sections) as any) {
    if (!questions || questions.length === 0) continue;
    text += `${sectionNames[type] || type}\n`;
    text += `${'─'.repeat(60)}\n\n`;
    for (const q of questions) {
      text += `Q${qNum}. ${q.question}  [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n`;
      if (q.options) {
        q.options.forEach((opt: string, j: number) => {
          text += `    (${String.fromCharCode(97 + j)}) ${opt}\n`;
        });
      }
      text += '\n';
      qNum++;
    }
    text += '\n';
  }

  text += `${'='.repeat(60)}\n`;
  text += `ANSWER KEY\n`;
  text += `${'='.repeat(60)}\n\n`;
  
  let ansNum = 1;
  for (const [, questions] of Object.entries(paper.sections) as any) {
    if (!questions) continue;
    for (const q of questions) {
      text += `Q${ansNum}: ${q.answer}\n`;
      if (q.explanation) {
        text += `   Explanation: ${q.explanation}\n`;
      }
      ansNum++;
    }
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${paper.board}_${paper.subject}_Paper.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function QuestionPaperGenerator() {
  const { theme, addToast, examTarget } = useApp();
  const isDark = theme === 'dark';

  const activeExam = examTargets[examTarget];
  const subjects = activeExam.subjects;
  const chapters = activeExam.chapters;

  const [formData, setFormData] = useState({
    board: 'CBSE',
    class: '10',
    subject: '',
    chapter: '',
    difficulty: 'medium',
    totalMarks: 80,
    questionTypes: {
      mcq: true,
      short: true,
      long: true,
    },
  });

  // Reset selected subjects/chapters on exam target change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      board: examTarget === 'cbse_10' ? 'CBSE' : examTarget === 'state_10' ? 'State Board' : examTarget === 'iit_jee' ? 'IIT-JEE' : 'NEET',
      class: examTarget.includes('10') ? '10' : 'Competitive Prep',
      subject: '',
      chapter: '',
    }));
  }, [examTarget]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');

  const difficulties = ['easy', 'medium', 'hard', 'mixed'];

  const handleGenerate = async () => {
    if (!formData.subject || !formData.chapter) {
      addToast('Please select subject and chapter first!', 'error');
      return;
    }

    const hasAnyType = Object.values(formData.questionTypes).some(v => v);
    if (!hasAnyType) {
      addToast('Select at least one question type!', 'error');
      return;
    }
    
    setIsGenerating(true);
    setGenerationStatus('🤖 Connecting to Gemini AI...');
    
    try {
      setTimeout(() => setGenerationStatus(`📝 AI is analyzing ${activeExam.shortName} pattern...`), 800);
      setTimeout(() => setGenerationStatus('✨ Formulating syllabus-bound questions...'), 2000);
      
      const aiResponse = await generatePaperQuestions(
        formData.subject,
        formData.chapter,
        formData.difficulty,
        formData.questionTypes,
        examTarget
      );

      if (!aiResponse) {
        throw new Error('AI failed to generate paper');
      }

      const mcqMark = examTarget === 'iit_jee' ? 3 : (examTarget === 'neet' ? 4 : 1);
      const shortMark = examTarget === 'iit_jee' ? 4 : (examTarget === 'neet' ? 4 : 2);
      const longMark = examTarget === 'iit_jee' ? 3 : (examTarget === 'neet' ? 4 : 5);

      const sections = {
        mcq: (aiResponse.mcq || []).map((q: any, i: number) => ({
          ...q,
          id: `mcq_${Date.now()}_${i}`,
          type: 'mcq',
          marks: q.marks || mcqMark,
        })),
        short: (aiResponse.short || []).map((q: any, i: number) => ({
          ...q,
          id: `short_${Date.now()}_${i}`,
          type: 'short',
          marks: q.marks || shortMark,
        })),
        long: (aiResponse.long || []).map((q: any, i: number) => ({
          ...q,
          id: `long_${Date.now()}_${i}`,
          type: 'long',
          marks: q.marks || longMark,
        })),
      };

      const totalQuestions = sections.mcq.length + sections.short.length + sections.long.length;
      const calculatedMarks = (sections.mcq.length * mcqMark) + (sections.short.length * shortMark) + (sections.long.length * longMark);

      const paper = {
        id: String(Date.now()),
        board: formData.board,
        class: formData.class,
        subject: formData.subject,
        chapter: formData.chapter,
        difficulty: formData.difficulty,
        totalMarks: calculatedMarks || formData.totalMarks,
        date: new Date().toISOString().split('T')[0],
        sections,
        generatedAt: new Date().toISOString(),
      };

      setGeneratedPaper(paper);
      setIsGenerating(false);
      setGenerationStatus('');
      
      addToast(`Paper generated! ${totalQuestions} questions created 🎉`, 'success');
    } catch (error) {
      console.error('Paper generation error:', error);
      setIsGenerating(false);
      setGenerationStatus('');
      addToast('Failed to generate paper. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${isDark ? 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20' : 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200'} border rounded-2xl p-6`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg shadow-violet-500/25">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">AI Question Paper Generator</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Generate standard exam papers for {activeExam.name} with Gemini AI ✨</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <h3 className="font-bold font-display text-lg mb-4">Syllabus Configuration</h3>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6 bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/10`}>
            <strong>Blueprint Details:</strong> {activeExam.paperBlueprint}
          </p>
          
          <div className="space-y-5">
            {/* Subject */}
            <div>
              <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1.5 block`}>Subject</label>
              <select 
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value, chapter: '' })}
                className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-xl text-sm cursor-pointer focus:border-indigo-500`}
              >
                <option value="" className={isDark ? 'bg-[#12122a]' : ''}>Select Subject</option>
                {subjects.map(s => (
                  <option key={s} value={s} className={isDark ? 'bg-[#12122a]' : ''}>{s}</option>
                ))}
              </select>
            </div>

            {/* Chapter */}
            <div>
              <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1.5 block`}>Chapter / Topic</label>
              <select 
                value={formData.chapter}
                onChange={e => setFormData({ ...formData, chapter: e.target.value })}
                disabled={!formData.subject}
                className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-xl text-sm cursor-pointer focus:border-indigo-500 disabled:opacity-50`}
              >
                <option value="" className={isDark ? 'bg-[#12122a]' : ''}>Select Chapter</option>
                <option value="all" className={isDark ? 'bg-[#12122a]' : ''}>All Chapters (Full Syllabus)</option>
                {formData.subject && chapters[formData.subject]?.map(c => (
                  <option key={c} value={c} className={isDark ? 'bg-[#12122a]' : ''}>{c}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-2 block`}>Difficulty Level</label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map(d => (
                  <button
                    key={d}
                    onClick={() => setFormData({ ...formData, difficulty: d })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer capitalize ${
                      formData.difficulty === d 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
                        : `${isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Marks */}
            <div>
              <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1.5 block`}>Target Marks (will auto-adjust)</label>
              <input 
                type="number"
                value={formData.totalMarks}
                onChange={e => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                min={10}
                max={180}
                className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-xl text-sm focus:border-indigo-500`}
              />
            </div>

            {/* Question Types */}
            <div>
              <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-2 block`}>Include Sections</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'mcq', label: examTarget === 'iit_jee' ? 'Single Choice MCQs' : 'Section A (Objective)' },
                  { key: 'short', label: examTarget === 'iit_jee' ? 'Multi-Choice MCQs' : 'Section B (Short)' },
                  { key: 'long', label: examTarget === 'iit_jee' ? 'Numerical Integers' : 'Section C (Long)' },
                ].map(type => (
                  <button
                    key={type.key}
                    onClick={() => setFormData({ 
                      ...formData, 
                      questionTypes: { 
                        ...formData.questionTypes, 
                        [type.key]: !formData.questionTypes[type.key as keyof typeof formData.questionTypes] 
                      } 
                    })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
                      formData.questionTypes[type.key as keyof typeof formData.questionTypes]
                        ? `${isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'} border` 
                        : `${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`
                    }`}
                  >
                    {formData.questionTypes[type.key as keyof typeof formData.questionTypes] && <Check className="h-3 w-3" />}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!formData.subject || !formData.chapter || isGenerating}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Syllabus-Bound Generation...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Exam Paper
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <h3 className="font-bold font-display text-lg mb-4">Paper Preview</h3>
          
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-500/30 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className={`mt-6 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{generationStatus || '🤖 AI is compiling your paper...'}</p>
              <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Grounding strictly to {activeExam.shortName} guidelines</p>
            </div>
          )}

          {!isGenerating && !generatedPaper && (
            <div className={`flex flex-col items-center justify-center py-20 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <FileText className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-center">Select your subject details and click<br/>"Generate Exam Paper"</p>
            </div>
          )}

          {!isGenerating && generatedPaper && (
            <div className="space-y-4">
              {/* Paper Header */}
              <div className={`p-4 ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} border rounded-xl text-center`}>
                <p className="font-bold">{generatedPaper.board} - {generatedPaper.subject}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {generatedPaper.chapter === 'all' ? 'Full Syllabus' : generatedPaper.chapter}
                </p>
                <p className="text-xs mt-1">Class level: {generatedPaper.class} | Max Marks: {generatedPaper.totalMarks}</p>
              </div>

              {/* Sections Summary */}
              <div className="space-y-3">
                {Object.entries(generatedPaper.sections).map(([type, questions]: any) => (
                  questions.length > 0 && (
                    <div key={type} className={`p-3 ${isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-gray-50 border-gray-200'} border rounded-lg`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm capitalize text-indigo-400">
                          {type === 'mcq' ? (examTarget === 'iit_jee' ? 'Section A: Single MCQs' : 'Section A: Objective MCQs') : 
                           type === 'short' ? (examTarget === 'iit_jee' ? 'Section B: Multiple Choice' : 'Section B: Short Subjective') :
                           (examTarget === 'iit_jee' ? 'Section C: Integer Types' : 'Section C: Long Subjective')}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{questions.length} Questions</span>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowPreview(true)}
                  className={`flex-1 py-3 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2`}
                >
                  <Eye className="h-4 w-4" /> View Full Paper
                </button>
                <button 
                  onClick={() => { downloadPaperAsText(generatedPaper); addToast('Paper downloaded! 📄', 'success'); }}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition cursor-pointer flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Paper Preview Modal */}
      <AnimatePresence>
        {showPreview && generatedPaper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPreview(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative ${isDark ? 'bg-[#12122a]' : 'bg-white'} rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl`}
            >
              {/* Header */}
              <div className={`sticky top-0 ${isDark ? 'bg-[#12122a] border-white/10' : 'bg-white border-gray-200'} border-b p-4 flex items-center justify-between z-10`}>
                <h3 className="font-bold font-display">Question Paper Preview</h3>
                <div className="flex gap-2">
                  <button onClick={() => window.print()} className={`p-2 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg cursor-pointer`}>
                    <Printer className="h-4 w-4" />
                  </button>
                  <button onClick={() => { downloadPaperAsText(generatedPaper); addToast('Paper downloaded! 📄', 'success'); }} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg cursor-pointer flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download
                  </button>
                </div>
              </div>

              {/* Paper Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Paper Header */}
                <div className="text-center mb-8">
                  <p className="text-sm font-medium">{generatedPaper.board} TEST PAPER</p>
                  <h2 className="text-xl font-bold mt-1">{generatedPaper.subject}</h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {generatedPaper.chapter === 'all' ? 'Full Syllabus Test' : generatedPaper.chapter}
                  </p>
                  <div className="flex justify-center gap-6 mt-4 text-sm">
                    <span>Time: 3 Hours</span>
                    <span>Max Marks: {generatedPaper.totalMarks}</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                    General Instructions: All questions are compulsory. Match mathematical expressions carefully.
                  </p>
                </div>

                {/* Sections */}
                {Object.entries(generatedPaper.sections).map(([type, questions]: any, sectionIndex) => (
                  questions.length > 0 && (
                    <div key={type} className="mb-8">
                      <h3 className={`font-bold text-lg mb-4 pb-2 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} text-indigo-400`}>
                        Section {String.fromCharCode(65 + sectionIndex)}: {
                          type === 'mcq' ? (examTarget === 'iit_jee' ? 'Single Choice MCQs (3 marks, -1 negative)' : 'Section A: Objective MCQs (1 mark)') :
                          type === 'short' ? (examTarget === 'iit_jee' ? 'Multiple Choice Questions (4 marks, partial markings)' : 'Section B: Short Subjective') :
                          (examTarget === 'iit_jee' ? 'Numerical / Integer Entry Questions (3 marks, no negative)' : 'Section C: Long Subjective')
                        }
                      </h3>
                      <div className="space-y-4">
                        {questions.map((q: any, qIndex: number) => (
                          <div key={q.id} className={`p-4 ${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'} rounded-xl`}>
                            <p className="font-medium">
                              <span className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Q{qIndex + 1}.</span> {q.question}
                            </p>
                            {q.options && (
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                {q.options.map((opt: string, optIndex: number) => (
                                  <p key={optIndex} className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    ({String.fromCharCode(97 + optIndex)}) {opt}
                                  </p>
                                ))}
                              </div>
                            )}
                            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>[{q.marks} Mark{q.marks > 1 ? 's' : ''}]</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}

                {/* Answer Key */}
                <div className={`mt-8 p-6 ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'} border rounded-xl`}>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-500" /> Complete Solutions & Marking Key
                  </h3>
                  <div className="space-y-3">
                    {Object.values(generatedPaper.sections).flat().map((q: any, index: number) => (
                      <div key={q.id} className={`p-3 ${isDark ? 'bg-white/5' : 'bg-white'} rounded-lg text-sm`}>
                        <p><span className="font-bold">Q{index + 1}:</span> {q.answer}</p>
                        {q.explanation && (
                          <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} whitespace-pre-wrap`}>
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}