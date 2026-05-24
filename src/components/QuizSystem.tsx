import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, CheckCircle, XCircle, Trophy, Target, ChevronRight, RotateCcw, Lightbulb, Award } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { examTargets } from '../data/syllabi';
import { questionBank } from '../data/questions';
import { generateQuizQuestions, isAPIConfigured } from '../services/geminiAI';

export default function QuizSystem() {
  const { theme, addQuizResult, user, examTarget } = useApp();
  const isDark = theme === 'dark';

  const activeExam = examTargets[examTarget];
  const subjects = activeExam.subjects;
  const chapters = activeExam.chapters;

  const [stage, setStage] = useState<'setup' | 'quiz' | 'result'>('setup');
  const [config, setConfig] = useState({ subject: '', chapter: '', difficulty: 'medium', questionCount: 10 });
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timer, setTimer] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Reset config when syllabus shifts
  useEffect(() => {
    setConfig({
      subject: '',
      chapter: '',
      difficulty: 'medium',
      questionCount: 10
    });
    setStage('setup');
    setQuestions([]);
    setCurrentQ(0);
    setAnswers({});
  }, [examTarget]);

  // Timer
  useEffect(() => {
    if (stage === 'quiz') {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const aiConnected = isAPIConfigured();

  const startQuiz = async () => {
    setIsLoadingQuestions(true);
    
    let quizQuestions: any[] = [];
    
    // Try AI generation first if API is configured
    if (aiConnected) {
      try {
        quizQuestions = await generateQuizQuestions(
          config.subject,
          config.chapter,
          config.difficulty,
          config.questionCount,
          examTarget
        );
      } catch (error) {
        console.error('AI generation failed, using fallback');
      }
    }
    
    // Fallback to question bank
    if (quizQuestions.length === 0) {
      const filtered = questionBank.filter(q =>
        q.subject === config.subject &&
        (config.chapter === 'all' || q.chapter === config.chapter) &&
        (config.difficulty === 'mixed' || q.difficulty === config.difficulty) &&
        q.type === 'mcq'
      );
      quizQuestions = filtered.sort(() => Math.random() - 0.5).slice(0, config.questionCount);
    }
    
    setQuestions(quizQuestions);
    setCurrentQ(0);
    setAnswers({});
    setTimer(0);
    setIsLoadingQuestions(false);
    setStage('quiz');
  };

  const selectAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQ]: answer });
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setShowHint(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let correct = 0;
    const weakTopics: string[] = [];
    
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) {
        correct++;
      } else {
        if (q.topic && !weakTopics.includes(q.topic)) weakTopics.push(q.topic);
      }
    });

    const res = {
      id: String(Date.now()),
      quizId: String(Date.now()),
      studentId: user?.id || 's1',
      subject: config.subject,
      chapter: config.chapter,
      score: correct,
      totalQuestions: questions.length,
      date: new Date().toISOString().split('T')[0],
      timeTaken: timer,
      weakTopics: weakTopics.slice(0, 3),
    };

    setResult(res);
    addQuizResult(res);
    setStage('result');
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {stage === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {/* Header */}
            <div className={`${isDark ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'} border rounded-2xl p-6 mb-6`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/25">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display">Syllabus-Bound AI Quiz</h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Test your depth in {activeExam.name} with instant conceptual tracking</p>
                </div>
              </div>
            </div>

            {/* Quiz Config */}
            <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
              <h3 className="font-bold font-display text-lg mb-6">Configure Your Quiz</h3>
              
              <div className="space-y-5">
                <div>
                  <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1.5 block`}>Subject</label>
                  <select value={config.subject} onChange={e => setConfig({ ...config, subject: e.target.value, chapter: '' })}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm cursor-pointer focus:border-amber-500`}>
                    <option value="" className={isDark ? 'bg-[#12122a]' : ''}>Select Subject</option>
                    {subjects.map(s => <option key={s} value={s} className={isDark ? 'bg-[#12122a]' : ''}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1.5 block`}>Chapter / Topic</label>
                  <select value={config.chapter} onChange={e => setConfig({ ...config, chapter: e.target.value })} disabled={!config.subject}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm cursor-pointer focus:border-amber-500 disabled:opacity-50`}>
                    <option value="" className={isDark ? 'bg-[#12122a]' : ''}>Select Chapter</option>
                    <option value="all" className={isDark ? 'bg-[#12122a]' : ''}>All Chapters</option>
                    {config.subject && chapters[config.subject]?.map(c => <option key={c} value={c} className={isDark ? 'bg-[#12122a]' : ''}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-2 block`}>Difficulty</label>
                  <div className="flex flex-wrap gap-2">
                    {['easy', 'medium', 'hard', 'mixed'].map(d => (
                      <button key={d} onClick={() => setConfig({ ...config, difficulty: d })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer capitalize ${config.difficulty === d ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' : `${isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-2 block`}>Number of Questions</label>
                  <div className="flex gap-2">
                    {[5, 10, 15, 20].map(n => (
                      <button key={n} onClick={() => setConfig({ ...config, questionCount: n })}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${config.questionCount === n ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' : `${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={startQuiz} disabled={!config.subject || !config.chapter || isLoadingQuestions}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoadingQuestions ? (
                    <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {aiConnected ? 'AI Assembling Exam Questions...' : 'Loading...'}</>
                  ) : (
                    <><Zap className="h-5 w-5" /> Assemble Exam Quiz {aiConnected && <span className="text-xs opacity-80">(AI Powered)</span>}</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'quiz' && questions.length > 0 && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {/* Progress Bar */}
            <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-4 mb-6`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Question {currentQ + 1} of {questions.length}</span>
                <div className="flex items-center gap-4">
                  <span className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><Clock className="h-4 w-4" /> {formatTime(timer)}</span>
                  <span className={`px-3 py-1 ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'} rounded-full text-xs font-medium capitalize`}>{questions[currentQ].difficulty}</span>
                </div>
              </div>
              <div className={`h-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>

            {/* Question Card */}
            <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-2`}>{questions[currentQ].chapter} • {questions[currentQ].topic || 'Topic'}</p>
              <h3 className="text-lg font-bold mb-6">{questions[currentQ].question}</h3>

              <div className="space-y-3">
                {questions[currentQ].options?.map((opt: string, i: number) => (
                  <button key={i} onClick={() => selectAnswer(opt)}
                    className={`w-full p-4 rounded-xl text-left transition cursor-pointer flex items-center gap-3 ${
                      answers[currentQ] === opt 
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 border-2' 
                        : `${isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} border`
                    }`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      answers[currentQ] === opt ? 'bg-amber-500 text-white' : `${isDark ? 'bg-white/10' : 'bg-gray-200'}`
                    }`}>{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </button>
                ))}
              </div>

              {/* Hint */}
              {showHint && (
                <div className={`mt-4 p-4 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border rounded-xl`}>
                  <p className="text-sm flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className={isDark ? 'text-blue-300' : 'text-blue-700'}>{questions[currentQ].explanation || 'Try solving using core syllabus concepts.'}</span>
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowHint(!showHint)}
                  className={`px-4 py-3 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl text-sm font-medium transition cursor-pointer flex items-center gap-2`}>
                  <Lightbulb className="h-4 w-4" /> {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button onClick={nextQuestion} disabled={!answers[currentQ]}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                  {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'result' && result && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            {/* Score Card */}
            <div className={`${isDark ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'} border rounded-3xl p-8 text-center mb-6`}>
              <div className="inline-flex p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-lg shadow-amber-500/30 mb-4">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold font-display mb-2">Quiz Complete! 🎉</h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Here's how you performed</p>
              
              <div className="mt-6 text-6xl font-extrabold gradient-text">
                {result.score}/{result.totalQuestions}
              </div>
              <p className="text-lg mt-2">{Math.round((result.score / result.totalQuestions) * 100)}% Correct</p>

              <div className="flex justify-center gap-6 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatTime(result.timeTaken)}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Time Taken</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-500">+{result.score * 10}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>XP Earned</p>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                <h3 className="font-bold font-display mb-4">Question Review</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {questions.map((q, i) => (
                    <div key={i} className={`p-3 ${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'} rounded-lg flex items-center gap-3`}>
                      {answers[i] === q.answer ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="text-sm truncate flex-1">Q{i + 1}: {q.question.substring(0, 40)}...</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                <h3 className="font-bold font-display mb-4">Areas to Improve</h3>
                {result.weakTopics.length > 0 ? (
                  <div className="space-y-3">
                    {result.weakTopics.map((topic: string, i: number) => (
                      <div key={i} className={`p-3 ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'} border rounded-lg flex items-center gap-3`}>
                        <Target className="h-5 w-5 text-amber-500" />
                        <span className="text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Award className="h-10 w-10 mx-auto mb-2" />
                    <p>Perfect score! No weak areas.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <button onClick={() => { setStage('setup'); setResult(null); }}
                className={`flex-1 py-4 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl font-medium transition cursor-pointer flex items-center justify-center gap-2`}>
                <RotateCcw className="h-5 w-5" /> Take Another Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}