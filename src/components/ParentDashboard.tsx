import { useState } from 'react';
import { BarChart3, Calendar, DollarSign, LogOut, Moon, Sun, Brain, AlertTriangle, Award, Menu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../store/AppContext';

export default function ParentDashboard() {
  const app = useApp();
  const isDark = app.theme === 'dark';

  // Find child linked to this parent
  const parentEmail = app.user?.email || '';
  const child = app.allStudents.find(s => s.parentEmail === parentEmail) || app.allStudents[0];
  const childResults = app.quizResults.filter(r => r.studentId === child?.id);
  const childAttendance = app.attendance.filter(a => a.present.includes(child?.id || ''));
  const totalClasses = app.attendance.length;
  const attendedClasses = childAttendance.length;
  const attendancePercent = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;
  const avgScore = childResults.length ? Math.round(childResults.reduce((s, r) => s + (r.score / r.totalQuestions) * 100, 0) / childResults.length) : 0;

  const scoreData = childResults.map((r, i) => ({ name: `Quiz ${i + 1}`, score: Math.round((r.score / r.totalQuestions) * 100) })).reverse();

  const paidFees = child?.fees?.filter(f => f.status === 'paid').length || 0;
  const pendingFees = child?.fees?.filter(f => f.status !== 'paid').length || 0;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState('overview');

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a1a] text-white' : 'bg-gray-50 text-gray-900'} flex`}>
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 ${isDark ? 'bg-[#0d0d22] border-white/5' : 'bg-white border-gray-200'} border-r flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className={`p-6 flex items-center gap-3 border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-2 shadow-lg"><Brain className="h-6 w-6 text-white" /></div>
          <div><span className="font-bold font-display">LearnAI</span><p className={`text-[10px] text-blue-400 tracking-widest uppercase`}>Parent Portal</p></div>
        </div>

        {/* Child Info */}
        <div className={`p-4 mx-4 mt-4 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border rounded-2xl`}>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{child?.avatar || '👦'}</div>
            <div><p className="font-semibold text-sm">{child?.name}</p><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Class {child?.grade}</p></div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'scores', label: 'Test Scores', icon: Award },
            { id: 'attendance', label: 'Attendance', icon: Calendar },
            { id: 'fees', label: 'Fees', icon: DollarSign },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${tab === t.id ? `bg-gradient-to-r ${isDark ? 'from-blue-600/20 to-cyan-600/20 text-blue-300 border-blue-500/20' : 'from-blue-100 to-cyan-100 text-blue-700 border-blue-200'} border` : `${isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'}`}`}>
              <t.icon className="h-5 w-5" />{t.label}
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t ${isDark ? 'border-white/5' : 'border-gray-200'} space-y-2`}>
          <button onClick={app.toggleTheme} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm ${isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'} cursor-pointer`}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Theme
          </button>
          <button onClick={app.logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 cursor-pointer"><LogOut className="h-5 w-5" /> Logout</button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main */}
      <main className="flex-1 overflow-x-hidden">
        <header className={`sticky top-0 z-30 ${isDark ? 'bg-[#0a0a1a]/80 border-white/5' : 'bg-white/80 border-gray-200'} backdrop-blur-xl border-b px-6 h-16 flex items-center gap-4`}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg cursor-pointer"><Menu className="h-5 w-5" /></button>
          <h1 className="text-lg font-bold font-display">👨‍👩‍👦 {child?.name}'s Progress</h1>
        </header>

        <div className="p-6">
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Average Score', value: `${avgScore}%`, icon: '📊', color: avgScore >= 80 ? 'text-emerald-500' : avgScore >= 60 ? 'text-amber-500' : 'text-red-500' },
                  { label: 'Quizzes Taken', value: childResults.length, icon: '📝', color: 'text-blue-500' },
                  { label: 'Attendance', value: `${attendancePercent}%`, icon: '✅', color: attendancePercent >= 80 ? 'text-emerald-500' : 'text-amber-500' },
                  { label: 'Fees Pending', value: pendingFees, icon: pendingFees > 0 ? '⚠️' : '✅', color: pendingFees > 0 ? 'text-red-500' : 'text-emerald-500' },
                ].map((s, i) => (
                  <div key={i} className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'} border rounded-2xl p-5`}>
                    <div className="flex items-start justify-between">
                      <div><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</p><p className={`text-2xl font-bold mt-1 font-display ${s.color}`}>{s.value}</p></div>
                      <span className="text-2xl">{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Score Chart */}
              {scoreData.length > 0 && (
                <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                  <h3 className="font-bold font-display text-lg mb-4">Score Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={scoreData}>
                      <defs><linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                      <Tooltip contentStyle={{ backgroundColor: isDark ? '#1a1a3a' : '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fill="url(#pGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Weak Topics Alert */}
              {childResults.some(r => r.weakTopics.length > 0) && (
                <div className={`${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'} border rounded-2xl p-5`}>
                  <h3 className="font-bold flex items-center gap-2 mb-3"><AlertTriangle className="h-5 w-5 text-amber-500" /> Areas That Need Attention</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(childResults.flatMap(r => r.weakTopics))].map((t, i) => (
                      <span key={i} className={`px-3 py-1 ${isDark ? 'bg-white/5' : 'bg-white'} rounded-full text-sm`}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'scores' && (
            <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl overflow-hidden`}>
              <table className="w-full text-sm">
                <thead><tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                  <th className="text-left py-3 px-4 font-semibold">Subject</th>
                  <th className="text-left py-3 px-4 font-semibold">Chapter</th>
                  <th className="text-center py-3 px-4 font-semibold">Score</th>
                  <th className="text-center py-3 px-4 font-semibold">Percentage</th>
                  <th className="text-right py-3 px-4 font-semibold">Date</th>
                </tr></thead>
                <tbody>
                  {childResults.map((r, i) => (
                    <tr key={i} className={`border-b ${isDark ? 'border-white/[0.03]' : 'border-gray-100'}`}>
                      <td className="py-3 px-4 font-medium">{r.subject}</td>
                      <td className={`py-3 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{r.chapter}</td>
                      <td className="py-3 px-4 text-center font-bold">{r.score}/{r.totalQuestions}</td>
                      <td className="py-3 px-4 text-center"><span className={`font-bold ${(r.score/r.totalQuestions)*100 >= 80 ? 'text-emerald-500' : (r.score/r.totalQuestions)*100 >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{Math.round((r.score / r.totalQuestions) * 100)}%</span></td>
                      <td className={`py-3 px-4 text-right ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {childResults.length === 0 && <div className="py-12 text-center text-gray-500">No quiz results yet</div>}
            </div>
          )}

          {tab === 'attendance' && (
            <div className="space-y-4">
              <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6 text-center`}>
                <p className="text-6xl font-extrabold gradient-text">{attendancePercent}%</p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Overall Attendance</p>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{attendedClasses} of {totalClasses} classes attended</p>
              </div>
              {app.attendance.map(a => (
                <div key={a.id} className={`p-4 ${isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-xl flex justify-between items-center`}>
                  <div><p className="font-medium text-sm">{a.classroomName}</p><p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{a.date}</p></div>
                  {a.present.includes(child?.id || '') ? <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-xs font-bold rounded-lg">Present ✅</span> : <span className="px-3 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded-lg">Absent ❌</span>}
                </div>
              ))}
            </div>
          )}

          {tab === 'fees' && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className={`${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'} border rounded-2xl p-6 text-center`}>
                  <p className="text-3xl font-bold text-emerald-500">{paidFees}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Months Paid</p>
                </div>
                <div className={`${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'} border rounded-2xl p-6 text-center`}>
                  <p className="text-3xl font-bold text-red-500">{pendingFees}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Months Pending</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {child?.fees?.map((f, i) => (
                  <div key={i} className={`p-4 rounded-xl border text-center ${
                    f.status === 'paid' ? `${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}` :
                    f.status === 'overdue' ? `${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}` :
                    `${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`
                  }`}>
                    <p className="font-medium text-sm">{f.month}</p>
                    <p className="text-xl font-bold mt-1">₹{f.amount}</p>
                    <p className={`capitalize text-xs mt-1 font-semibold ${f.status === 'paid' ? 'text-emerald-500' : f.status === 'overdue' ? 'text-red-500' : 'text-amber-500'}`}>
                      {f.status === 'paid' ? '✅ Paid' : f.status === 'overdue' ? '❌ Overdue' : '⏳ Pending'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
