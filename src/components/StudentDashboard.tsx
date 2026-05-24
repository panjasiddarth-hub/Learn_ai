import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Brain, FileText, MessageCircle, Video, BarChart3, 
  LogOut, Moon, Sun, Menu, Zap, Trophy, Target, ChevronRight, Play, Calendar, Award, Bell
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useApp } from '../store/AppContext';
import QuestionPaperGenerator from './QuestionPaperGenerator';
import QuizSystem from './QuizSystem';
import DoubtSolver from './DoubtSolver';
import LiveClassroom from './LiveClassroom';

export default function StudentDashboard() {
  const { user, logout, theme, toggleTheme, quizResults, classrooms } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'paper-generator', label: 'Question Paper', icon: FileText },
    { id: 'quiz', label: 'AI Quiz', icon: Zap },
    { id: 'doubt-solver', label: 'Doubt Solver', icon: MessageCircle },
    { id: 'classroom', label: 'Live Classes', icon: Video },
    { id: 'analytics', label: 'My Progress', icon: BarChart3 },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a1a] text-white' : 'bg-gray-50 text-gray-900'} flex`}>
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 ${isDark ? 'bg-[#0d0d22] border-white/5' : 'bg-white border-gray-200'} border-r flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className={`p-6 flex items-center gap-3 border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-2 shadow-lg shadow-indigo-500/20">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-bold font-display">LearnAI</span>
            <p className={`text-[10px] ${isDark ? 'text-indigo-400/60' : 'text-indigo-600'} tracking-widest uppercase`}>Student Portal</p>
          </div>
        </div>

        {/* User Info */}
        <div className={`p-4 mx-4 mt-4 ${isDark ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} border rounded-2xl`}>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{user?.avatar}</div>
            <div>
              <div className="font-semibold text-sm">{user?.name}</div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Class {user?.grade}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className={`flex-1 h-1.5 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <span className="text-xs text-indigo-500 font-medium">Level 12</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
          {sidebarItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === item.id 
                  ? `bg-gradient-to-r ${isDark ? 'from-indigo-600/20 to-purple-600/20 text-indigo-300 border-indigo-500/20' : 'from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200'} border shadow-lg shadow-indigo-500/5` 
                  : `${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Theme</span>
            <button onClick={toggleTheme} className={`p-2 rounded-lg ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition cursor-pointer`}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
          <button onClick={logout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'} transition cursor-pointer`}>
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <header className={`sticky top-0 z-30 ${isDark ? 'bg-[#0a0a1a]/80 border-white/5' : 'bg-white/80 border-gray-200'} backdrop-blur-xl border-b px-6 h-16 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} rounded-lg cursor-pointer`}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold font-display">
              {activeTab === 'dashboard' ? `Welcome back, ${user?.name?.split(' ')[0]}! 👋` : sidebarItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className={`relative p-2 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} rounded-lg cursor-pointer`}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className={`hidden sm:flex items-center gap-2 text-xs ${isDark ? 'text-gray-500 bg-white/5' : 'text-gray-500 bg-gray-100'} px-3 py-1.5 rounded-lg`}>
              <Trophy className="h-3.5 w-3.5 text-amber-500" /> 1,250 XP
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'dashboard' && <DashboardHome theme={theme} quizResults={quizResults} classrooms={classrooms} setActiveTab={setActiveTab} />}
          {activeTab === 'paper-generator' && <QuestionPaperGenerator />}
          {activeTab === 'quiz' && <QuizSystem />}
          {activeTab === 'doubt-solver' && <DoubtSolver />}
          {activeTab === 'classroom' && <LiveClassroom />}
          {activeTab === 'analytics' && <ProgressAnalytics theme={theme} quizResults={quizResults} />}
        </div>
      </main>
    </div>
  );
}

/* =================== DASHBOARD HOME =================== */
function DashboardHome({ theme, quizResults, classrooms, setActiveTab }: any) {
  const isDark = theme === 'dark';

  const weeklyProgress = [
    { day: 'Mon', score: 75 },
    { day: 'Tue', score: 82 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 85 },
    { day: 'Fri', score: 90 },
    { day: 'Sat', score: 88 },
    { day: 'Sun', score: 92 },
  ];

  const subjectProgress = [
    { subject: 'Math', progress: 78, fullMark: 100 },
    { subject: 'Physics', progress: 65, fullMark: 100 },
    { subject: 'Chemistry', progress: 82, fullMark: 100 },
    { subject: 'Biology', progress: 70, fullMark: 100 },
    { subject: 'English', progress: 88, fullMark: 100 },
  ];

  const quickActions = [
    { icon: FileText, label: 'Generate Paper', color: 'from-violet-500 to-purple-600', action: 'paper-generator' },
    { icon: Zap, label: 'Take Quiz', color: 'from-amber-500 to-orange-500', action: 'quiz' },
    { icon: MessageCircle, label: 'Ask Doubt', color: 'from-emerald-500 to-teal-500', action: 'doubt-solver' },
    { icon: Video, label: 'Join Class', color: 'from-blue-500 to-cyan-500', action: 'classroom' },
  ];

  const upcomingClasses = classrooms.filter((c: any) => c.nextClass).slice(0, 3);
  const liveClasses = classrooms.filter((c: any) => c.isLive);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Quizzes Taken', value: quizResults.length, icon: '📝', change: '+3 this week', color: 'from-violet-500/20 to-violet-600/20', border: 'border-violet-500/20' },
          { label: 'Average Score', value: '82%', icon: '📊', change: '+5% improvement', color: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/20' },
          { label: 'Study Streak', value: '7 days', icon: '🔥', change: 'Keep it up!', color: 'from-amber-500/20 to-amber-600/20', border: 'border-amber-500/20' },
          { label: 'Classes Attended', value: '12', icon: '📚', change: '95% attendance', color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/20' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }}
            className={`${isDark ? `bg-gradient-to-br ${stat.color} border ${stat.border}` : 'bg-white border-gray-200 shadow-sm'} border rounded-2xl p-5 card-3d`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>{stat.label}</p>
                <p className="text-2xl font-bold mt-1 font-display">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'} mt-2`}>{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
        <h3 className="font-bold font-display text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <button 
              key={i}
              onClick={() => setActiveTab(action.action)}
              className={`group p-4 ${isDark ? 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06]' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} border rounded-2xl text-center transition-all hover:-translate-y-1 cursor-pointer`}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm font-medium">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Progress */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <h3 className="font-bold font-display text-lg mb-1">Weekly Progress</h3>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-6`}>Your quiz performance this week</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyProgress}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#6b7280' : '#9ca3af' }} />
              <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#6b7280' : '#9ca3af' }} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1a1a3a' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px', color: isDark ? '#fff' : '#000' }} />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Radar */}
        <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <h3 className="font-bold font-display text-lg mb-1">Subject Mastery</h3>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-4`}>Your progress across subjects</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={subjectProgress}>
              <PolarGrid stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: isDark ? '#9ca3af' : '#6b7280' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: isDark ? '#6b7280' : '#9ca3af' }} />
              <Radar name="Progress" dataKey="progress" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live & Upcoming Classes */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Live Classes */}
        <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live Now
            </h3>
          </div>
          {liveClasses.length > 0 ? (
            <div className="space-y-3">
              {liveClasses.map((c: any) => (
                <div key={c.id} className={`p-4 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'} border rounded-xl flex items-center justify-between`}>
                  <div>
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{c.teacher} • {c.students} students</p>
                  </div>
                  <button onClick={() => setActiveTab('classroom')} className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition cursor-pointer flex items-center gap-2">
                    <Play className="h-4 w-4" /> Join
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <Video className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No live classes right now</p>
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display text-lg">Upcoming Classes</h3>
            <button onClick={() => setActiveTab('classroom')} className={`text-xs ${isDark ? 'text-indigo-400' : 'text-indigo-600'} font-medium cursor-pointer`}>View All →</button>
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((c: any) => (
              <div key={c.id} className={`p-4 ${isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-gray-50 border-gray-200'} border rounded-xl flex items-center gap-4`}>
                <div className={`p-3 ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} rounded-xl`}>
                  <Calendar className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{c.schedule}</p>
                </div>
                <ChevronRight className={`h-5 w-5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Quiz Results */}
      <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold font-display text-lg">Recent Quiz Results</h3>
          <button onClick={() => setActiveTab('analytics')} className={`text-xs ${isDark ? 'text-indigo-400' : 'text-indigo-600'} font-medium cursor-pointer`}>View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold`}>Subject</th>
                <th className={`text-left py-3 px-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold`}>Chapter</th>
                <th className={`text-center py-3 px-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold`}>Score</th>
                <th className={`text-center py-3 px-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold`}>Time</th>
                <th className={`text-right py-3 px-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold`}>Date</th>
              </tr>
            </thead>
            <tbody>
              {quizResults.slice(0, 5).map((result: any) => (
                <tr key={result.id} className={`border-b ${isDark ? 'border-white/[0.03]' : 'border-gray-100'} hover:${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'}`}>
                  <td className="py-3 px-4 font-medium">{result.subject}</td>
                  <td className={`py-3 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{result.chapter}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-bold ${result.score >= 8 ? 'text-emerald-500' : result.score >= 6 ? 'text-amber-500' : 'text-red-500'}`}>
                      {result.score}/{result.totalQuestions}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {Math.floor(result.timeTaken / 60)}:{String(result.timeTaken % 60).padStart(2, '0')}
                  </td>
                  <td className={`py-3 px-4 text-right ${isDark ? 'text-gray-500' : 'text-gray-500'} text-xs`}>
                    {new Date(result.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =================== PROGRESS ANALYTICS =================== */
function ProgressAnalytics({ theme, quizResults }: any) {
  const isDark = theme === 'dark';

  const subjectStats = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'].map(subject => {
    const results = quizResults.filter((r: any) => r.subject === subject);
    const avgScore = results.length ? Math.round(results.reduce((sum: number, r: any) => sum + (r.score / r.totalQuestions) * 100, 0) / results.length) : 0;
    return { subject, avgScore, quizzes: results.length };
  });

  const weakTopics = quizResults.flatMap((r: any) => r.weakTopics).reduce((acc: any, topic: string) => {
    acc[topic] = (acc[topic] || 0) + 1;
    return acc;
  }, {});
  const sortedWeakTopics = Object.entries(weakTopics).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);

  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Quizzes', value: quizResults.length, icon: '📝' },
          { label: 'Average Score', value: `${Math.round(quizResults.reduce((sum: number, r: any) => sum + (r.score / r.totalQuestions) * 100, 0) / quizResults.length || 0)}%`, icon: '📊' },
          { label: 'Best Subject', value: subjectStats.sort((a, b) => b.avgScore - a.avgScore)[0]?.subject || '-', icon: '🏆' },
          { label: 'Total Time', value: `${Math.round(quizResults.reduce((sum: number, r: any) => sum + r.timeTaken, 0) / 60)} min`, icon: '⏱️' },
        ].map((stat, i) => (
          <div key={i} className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-5`}>
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{stat.label}</span>
            </div>
            <p className="text-2xl font-bold mt-2 font-display">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Subject Performance */}
      <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
        <h3 className="font-bold font-display text-lg mb-6">Subject Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectStats} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
            <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#6b7280' : '#9ca3af' }} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#6b7280' : '#9ca3af' }} />
            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1a1a3a' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px', color: isDark ? '#fff' : '#000' }} />
            <Bar dataKey="avgScore" radius={[8, 8, 0, 0]}>
              {subjectStats.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weak Topics */}
      <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
        <h3 className="font-bold font-display text-lg mb-4">Areas to Improve</h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>Based on your quiz performance, focus on these topics:</p>
        <div className="space-y-3">
          {sortedWeakTopics.map(([topic, count]: any, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'} flex items-center justify-center`}>
                <Target className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{topic}</p>
                <div className={`h-1.5 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-full mt-1`}>
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(count * 20, 100)}%` }}></div>
                </div>
              </div>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Appeared {count}x</span>
            </div>
          ))}
          {sortedWeakTopics.length === 0 && (
            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <Award className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Great job! No weak topics identified yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
