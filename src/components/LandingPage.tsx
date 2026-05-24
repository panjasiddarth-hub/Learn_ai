import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Video, MessageCircle, Sparkles, ArrowRight, Check, Star, Zap, Moon, Sun, Bot, BarChart3, Users } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function LandingPage() {
  const { login, loginWithGoogle, signup, theme, toggleTheme } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authRole, setAuthRole] = useState<'student' | 'teacher' | 'parent' | 'admin'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isDark = theme === 'dark';

// ✅ FIXED - handleAuth (async + await)
const handleAuth = async () => {
  if (!email.trim() || !password.trim()) return;
  setIsLoading(true);
  try {
    if (authMode === 'signup') {
      const ok = await signup(name, email, password, authRole, {
        phone,
        parentEmail,
        referredBy: referralCode,
      } as any);
      if (ok) setShowAuth(false);
    } else {
      const ok = await login(email, password, authRole);
      if (ok) setShowAuth(false);
    }
  } finally {
    setIsLoading(false);
  }
};

const handleGoogleLogin = async () => {
  setIsLoading(true);
  try {
    await loginWithGoogle(authRole === 'parent' || authRole === 'admin' ? 'student' : authRole);
    setShowAuth(false);
  } finally {
    setIsLoading(false);
  }
};

  const features = [
    { icon: Brain, title: 'AI Question Paper Generator', desc: 'Generate CBSE-pattern papers instantly with marking schemes & answer keys', color: 'from-violet-500 to-purple-600' },
    { icon: Zap, title: 'Smart AI Quizzes', desc: 'Adaptive quizzes with instant evaluation, hints & detailed explanations', color: 'from-blue-500 to-cyan-500' },
    { icon: MessageCircle, title: 'AI Doubt Solver', desc: 'Powered by Google Gemini — step-by-step explanations for any doubt', color: 'from-emerald-500 to-teal-500' },
    { icon: Video, title: 'Live Classrooms', desc: 'Join live classes, interact with teachers & access recordings', color: 'from-amber-500 to-orange-500' },
    { icon: Bot, title: 'Smart Study Planner', desc: 'AI-powered study plans, progress tracking & weak area identification', color: 'from-pink-500 to-rose-500' },
    { icon: BarChart3, title: 'Performance Analytics', desc: 'Track progress with charts, identify weak areas & improve scores', color: 'from-indigo-500 to-blue-600' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a1a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'glass' : 'glass-light'} border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-2"><Brain className="h-6 w-6 text-white" /></div>
            </div>
            <span className="text-xl font-bold font-display">LearnAI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Features</a>
            <a href="#pricing" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} transition cursor-pointer`}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={() => setShowAuth(true)} className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-sm font-semibold text-white hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0">
          {isDark && (<><div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"></div><div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]"></div></>)}
          <div className="dot-pattern absolute inset-0 opacity-30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} border rounded-full`}>
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span className={`text-sm ${isDark ? 'text-indigo-300' : 'text-indigo-700'} font-medium`}>Powered by Google Gemini AI</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold font-display leading-[1.1]">
                <span className="block">Learn Smarter</span>
                <span className="gradient-text">with AI</span>
              </h1>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-lg leading-relaxed`}>
                AI question papers, live classes, instant doubt solving, quizzes & performance tracking — all in one platform for CBSE students.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => { setShowAuth(true); setAuthRole('student'); setAuthMode('signup'); }} className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold text-base text-white transition-all shadow-2xl shadow-indigo-500/30 flex items-center gap-3 cursor-pointer">
                  Start Learning Free <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => { setShowAuth(true); setAuthRole('parent'); setAuthMode('login'); }} className={`px-8 py-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border rounded-2xl font-bold transition-all flex items-center gap-3 cursor-pointer`}>
                  <Users className="h-5 w-5 text-indigo-500" /> Parent Login
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-8">
                {[{ v: '500+', l: 'Students' }, { v: '50K+', l: 'Questions' }, { v: '10K+', l: 'Classes' }, { v: '98%', l: 'Satisfaction' }].map((s, i) => (
                  <div key={i} className="text-center"><div className="text-2xl font-bold gradient-text">{s.v}</div><div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{s.l}</div></div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:block">
              <div className="relative">
                <div className={`animate-float ${isDark ? 'bg-white/[0.05] border-white/10' : 'bg-white border-gray-200'} rounded-3xl p-6 border shadow-2xl`}>
                  <div className="flex items-center gap-3 mb-6"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-amber-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div><span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} ml-2 font-mono`}>AI Learning Assistant</span></div>
                  <div className="space-y-4">
                    <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs">AI</div><div className={`flex-1 ${isDark ? 'bg-white/5' : 'bg-gray-100'} rounded-2xl rounded-tl-none p-4`}><p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>I can help you with:</p><div className="flex flex-wrap gap-2 mt-3">{['Generate Paper', 'Take Quiz', 'Solve Doubt', 'Join Class'].map((item, i) => (<span key={i} className={`text-xs px-3 py-1 ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'} rounded-full`}>{item}</span>))}</div></div></div>
                    <div className="flex gap-3 justify-end"><div className={`${isDark ? 'bg-indigo-600/20' : 'bg-indigo-100'} rounded-2xl rounded-tr-none p-4 max-w-[80%]`}><p className={`text-sm ${isDark ? 'text-indigo-200' : 'text-indigo-700'}`}>Explain photosynthesis simply</p></div><div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-sm">👨‍🎓</div></div>
                    <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs">AI</div><div className={`flex-1 ${isDark ? 'bg-white/5' : 'bg-gray-100'} rounded-2xl rounded-tl-none p-4`}><p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>🌿 Plants make food using sunlight + water + CO₂...</p></div></div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 animate-float-delayed"><div className="bg-emerald-500 rounded-2xl px-4 py-3 shadow-lg shadow-emerald-500/30"><div className="flex items-center gap-2 text-white"><Check className="h-4 w-4" /><span className="text-xs font-bold">Score: 95% ✨</span></div></div></div>
                <div className="absolute -bottom-4 -left-4 animate-float"><div className="bg-amber-500 rounded-2xl px-4 py-3 shadow-lg shadow-amber-500/30"><div className="flex items-center gap-2 text-white"><Zap className="h-4 w-4" /><span className="text-xs font-bold">Paper Ready! 📄</span></div></div></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={`py-24 ${isDark ? '' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-indigo-500 font-semibold text-sm uppercase tracking-[0.2em]">Features</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display mt-4">Everything to <span className="gradient-text">Excel</span></h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`group ${isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]' : 'bg-white border-gray-200 hover:shadow-lg'} border rounded-2xl p-6 transition-all hover:-translate-y-2`}>
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.color} shadow-lg mb-5 group-hover:scale-110 transition-transform`}><f.icon className="h-6 w-6 text-white" /></div>
                <h3 className="text-lg font-bold mb-2 font-display">{f.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={`py-24 ${isDark ? 'bg-gradient-to-b from-transparent via-indigo-500/[0.03] to-transparent' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-indigo-500 font-semibold text-sm uppercase tracking-[0.2em]">Pricing</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display mt-4">Simple <span className="gradient-text">Pricing</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Self Study', price: '₹499', period: '/month', features: ['AI Doubt Solver', 'Question Paper Generator', 'Quizzes & Practice', 'Recorded Classes', 'Progress Tracking'], color: 'from-blue-500 to-cyan-500', popular: false },
              { name: 'Live Classes', price: '₹1,499', period: '/month', features: ['Everything in Self Study', 'Live Classes with Teacher', 'Personal Attention', 'Assignments & Homework', 'Parent Dashboard', 'WhatsApp Updates'], color: 'from-indigo-500 to-purple-500', popular: true },
              { name: '1-on-1 Premium', price: '₹2,999', period: '/month', features: ['Everything in Live Classes', 'Personal Mentor', 'Daily Doubt Sessions', 'Custom Study Plan', 'Board Exam Prep', 'Certificate'], color: 'from-amber-500 to-orange-500', popular: false },
            ].map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6 ${plan.popular ? `ring-2 ${isDark ? 'ring-indigo-500' : 'ring-indigo-500'}` : ''}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full">MOST POPULAR</div>}
                <h3 className="text-lg font-bold font-display">{plan.name}</h3>
                <div className="mt-4 mb-6"><span className="text-4xl font-extrabold">{plan.price}</span><span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{plan.period}</span></div>
                <ul className="space-y-3 mb-8">{plan.features.map((f, j) => (<li key={j} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500" />{f}</li>))}</ul>
                <button onClick={() => { setShowAuth(true); setAuthMode('signup'); setAuthRole('student'); }} className={`w-full py-3 bg-gradient-to-r ${plan.color} text-white font-bold rounded-xl cursor-pointer shadow-lg transition hover:opacity-90`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16"><h2 className="text-4xl font-extrabold font-display">Loved by <span className="gradient-text">Students</span></h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', role: 'Class 10', text: 'The AI doubt solver explains things better than most textbooks. Scored 95% in Maths!', avatar: '👧' },
              { name: 'Rajesh K.', role: 'Physics Teacher', text: 'Creating quizzes and papers takes minutes. My students love the platform.', avatar: '👨‍🏫' },
              { name: 'Amit P.', role: 'Parent', text: 'I can see my son\'s progress, attendance, and scores anytime. Very transparent.', avatar: '👨' },
            ].map((t, i) => (
              <div key={i} className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(j => <Star key={j} className="h-5 w-5 text-amber-400 fill-amber-400" />)}</div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-6`}>"{t.text}"</p>
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-lg">{t.avatar}</div><div><div className="font-semibold text-sm">{t.name}</div><div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t.role}</div></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
            <div className="relative px-8 py-16 sm:px-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mb-4">Ready to Learn Smarter?</h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Join students who are improving their scores with AI. Start today!</p>
              <button onClick={() => setShowAuth(true)} className="px-10 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-2xl text-lg cursor-pointer">Get Started Free →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'border-white/5' : 'border-gray-200'} border-t py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3"><div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-2"><Brain className="h-5 w-5 text-white" /></div><span className="font-bold font-display">LearnAI</span></div>
          <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>© 2025 LearnAI. All rights reserved.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={() => setShowAuth(false)}></div>
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`relative ${isDark ? 'bg-[#12122a] border-white/10' : 'bg-white border-gray-200'} border rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4"><Brain className="h-8 w-8 text-white" /></div>
              <h2 className="text-2xl font-bold font-display">{authMode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>{authMode === 'login' ? 'Login to continue' : 'Start your learning journey'}</p>
            </div>

            {/* Role Toggle */}
            <div className={`grid grid-cols-4 ${isDark ? 'bg-white/5' : 'bg-gray-100'} rounded-xl p-1 mb-6 gap-1`}>
              {[
                { key: 'student', label: '👨‍🎓 Student' },
                { key: 'teacher', label: '👨‍🏫 Teacher' },
                { key: 'parent', label: '👨‍👩‍👦 Parent' },
                { key: 'admin', label: '🛡️ Admin' },
              ].map(r => (
                <button key={r.key} onClick={() => setAuthRole(r.key as any)}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${authRole === r.key ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}`}>
                  {r.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {/* Name — only for signup */}
              {authMode === 'signup' && (
                <div>
                  <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1 block`}>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name"
                    className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 placeholder-gray-400'} border rounded-xl text-sm focus:border-indigo-500`} />
                </div>
              )}

              {/* Login field — changes based on role & mode */}
              <div>
                <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1 block`}>
                  {authRole === 'parent' ? 'Parent Email' : authRole === 'admin' ? 'Admin Email' : authMode === 'login' && (authRole === 'student' || authRole === 'teacher') ? 'Student ID / Email / Phone' : 'Email or Phone Number'}
                </label>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={
                    authRole === 'parent' ? 'Your email linked to child' :
                    authRole === 'admin' ? 'admin@learnai.com' :
                    authMode === 'login' && authRole === 'student' ? 'STU001 or email or phone' :
                    authMode === 'login' && authRole === 'teacher' ? 'TCH001 or email' :
                    'Email or 10-digit phone number'
                  }
                  className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 placeholder-gray-400'} border rounded-xl text-sm focus:border-indigo-500`}
                  onKeyDown={e => e.key === 'Enter' && handleAuth()} />
              </div>

              {/* Password */}
              <div>
                <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1 block`}>
                  Password {authMode === 'signup' && <span className="text-gray-500">(min 4 characters)</span>}
                </label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={authMode === 'login' ? 'Enter your password' : 'Create a password'}
                  className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 placeholder-gray-400'} border rounded-xl text-sm focus:border-indigo-500`}
                  onKeyDown={e => e.key === 'Enter' && handleAuth()} />
              </div>
              {authMode === 'signup' && authRole === 'student' && (
                <>
                  <div>
                    <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1 block`}>Phone Number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210"
                      className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 placeholder-gray-400'} border rounded-xl text-sm focus:border-indigo-500`} />
                  </div>
                  <div>
                    <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1 block`}>Parent's Email (optional)</label>
                    <input type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} placeholder="parent@email.com"
                      className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 placeholder-gray-400'} border rounded-xl text-sm focus:border-indigo-500`} />
                  </div>
                  <div>
                    <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1 block`}>Referral Code (optional)</label>
                    <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value)} placeholder="Friend's referral code"
                      className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 placeholder-gray-400'} border rounded-xl text-sm focus:border-indigo-500`} />
                  </div>
                </>
              )}

              <button onClick={handleAuth} disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white transition-all shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 mt-2">
                {isLoading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Please wait...</> : <>{authMode === 'login' ? 'Login' : 'Create Account'} →</>}
              </button>

              {authRole !== 'admin' && (
                <>
                  <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}></div></div><div className="relative flex justify-center text-sm"><span className={`px-4 ${isDark ? 'bg-[#12122a] text-gray-500' : 'bg-white text-gray-500'}`}>or</span></div></div>
                  <button onClick={handleGoogleLogin} disabled={isLoading}
                    className={`w-full py-3 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-xl font-medium transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </button>
                </>
              )}

              {/* Role-specific help text */}
              {authMode === 'login' && authRole === 'student' && (
                <div className={`p-3 ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} border rounded-xl text-xs ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                  <p className="font-semibold mb-1">🔑 How to login:</p>
                  <p><strong>Offline students:</strong> Use your Student ID (e.g., STU001) + password given by admin</p>
                  <p><strong>Online students:</strong> Use your email/phone + password you set during signup</p>
                  <p className="mt-1 opacity-70">Demo: STU001 / aarav123</p>
                </div>
              )}

              {authMode === 'login' && authRole === 'teacher' && (
                <div className={`p-3 ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'} border rounded-xl text-xs ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  <p className="font-semibold mb-1">🔑 Teacher Login:</p>
                  <p>Use your Teacher ID (e.g., TCH001) or email + password given by admin</p>
                  <p className="mt-1 opacity-70">Demo: TCH001 / teach123</p>
                </div>
              )}

              {authRole === 'admin' && authMode === 'login' && (
                <div className={`p-3 ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'} border rounded-xl text-xs text-center ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                  Admin login: admin@learnai.com / any password
                </div>
              )}

              {authRole === 'parent' && authMode === 'login' && (
                <div className={`p-3 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border rounded-xl text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  <p className="font-semibold mb-1">👨‍👩‍👦 Parent Login:</p>
                  <p>Use the email that was linked to your child's account by the admin</p>
                  <p className="mt-1 opacity-70">Demo: rajesh@parent.com</p>
                </div>
              )}

              {authMode === 'signup' && (authRole === 'teacher' || authRole === 'admin' || authRole === 'parent') && (
                <div className={`p-3 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'} border rounded-xl text-xs text-center ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                  ⚠️ {authRole === 'teacher' ? 'Teachers' : authRole === 'parent' ? 'Parents' : 'Admins'} cannot self-register. Please contact admin for your login credentials.
                </div>
              )}
            </div>

            {/* Only students can self-register. Teachers/Parents/Admin get credentials from admin */}
            {authRole === 'student' && (
              <p className={`text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-6`}>
                {authMode === 'login' ? "New online student? " : "Already have an account? "}
                <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-indigo-500 font-medium hover:underline cursor-pointer">
                  {authMode === 'login' ? 'Sign Up Here' : 'Login Instead'}
                </button>
              </p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
