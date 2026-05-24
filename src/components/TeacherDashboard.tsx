import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Brain, FileText, Users, Video, BarChart3, 
  LogOut, Moon, Sun, Menu, Plus, Clock, Play, Upload, Bell, MessageSquare
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useApp } from '../store/AppContext';
import QuestionPaperGenerator from './QuestionPaperGenerator';

export default function TeacherDashboard() {
  const { user, logout, theme, toggleTheme, classrooms, createClassroom } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', subject: '', schedule: '' });

  const isDark = theme === 'dark';

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes', label: 'My Classes', icon: Video },
    { id: 'paper-generator', label: 'Generate Papers', icon: FileText },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const myClasses = classrooms.filter(c => c.teacherId === 't1');

  const handleCreateClass = () => {
    if (!newClass.name || !newClass.subject) return;
    createClassroom({
      name: newClass.name,
      subject: newClass.subject,
      teacher: user?.name || 'Teacher',
      teacherId: user?.id || 't1',
      schedule: newClass.schedule,
      isLive: false,
    });
    setShowCreateClass(false);
    setNewClass({ name: '', subject: '', schedule: '' });
  };

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
            <p className={`text-[10px] ${isDark ? 'text-indigo-400/60' : 'text-indigo-600'} tracking-widest uppercase`}>Teacher Portal</p>
          </div>
        </div>

        {/* User Info */}
        <div className={`p-4 mx-4 mt-4 ${isDark ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} border rounded-2xl`}>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{user?.avatar}</div>
            <div>
              <div className="font-semibold text-sm">{user?.name}</div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user?.subjects?.join(', ')}</div>
            </div>
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
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <header className={`sticky top-0 z-30 ${isDark ? 'bg-[#0a0a1a]/80 border-white/5' : 'bg-white/80 border-gray-200'} backdrop-blur-xl border-b px-6 h-16 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} rounded-lg cursor-pointer`}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold font-display">
              {activeTab === 'dashboard' ? `Welcome, ${user?.name?.split(' ')[1] || user?.name}! 👋` : sidebarItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className={`relative p-2 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} rounded-lg cursor-pointer`}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'dashboard' && <TeacherHome theme={theme} myClasses={myClasses} setShowCreateClass={setShowCreateClass} />}
          {activeTab === 'classes' && <TeacherClasses theme={theme} myClasses={myClasses} setShowCreateClass={setShowCreateClass} />}
          {activeTab === 'paper-generator' && <QuestionPaperGenerator />}
          {activeTab === 'students' && <TeacherStudents theme={theme} />}
          {activeTab === 'analytics' && <TeacherAnalytics theme={theme} />}
        </div>
      </main>

      {/* Create Class Modal */}
      {showCreateClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateClass(false)}></div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className={`relative ${isDark ? 'bg-[#12122a] border-white/10' : 'bg-white border-gray-200'} border rounded-3xl p-8 w-full max-w-md`}>
            <h2 className="text-xl font-bold font-display mb-6">Create New Class</h2>
            <div className="space-y-4">
              <div>
                <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1.5 block`}>Class Name</label>
                <input value={newClass.name} onChange={e => setNewClass({ ...newClass, name: e.target.value })} placeholder="e.g., Mathematics - Class 10"
                  className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm focus:border-indigo-500`} />
              </div>
              <div>
                <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1.5 block`}>Subject</label>
                <select value={newClass.subject} onChange={e => setNewClass({ ...newClass, subject: e.target.value })}
                  className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm cursor-pointer focus:border-indigo-500`}>
                  <option value="" className={isDark ? 'bg-[#12122a]' : ''}>Select Subject</option>
                  {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'].map(s => (
                    <option key={s} value={s} className={isDark ? 'bg-[#12122a]' : ''}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1.5 block`}>Schedule</label>
                <input value={newClass.schedule} onChange={e => setNewClass({ ...newClass, schedule: e.target.value })} placeholder="e.g., Mon, Wed, Fri - 10:00 AM"
                  className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm focus:border-indigo-500`} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateClass(false)} className={`flex-1 py-3 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl font-medium transition cursor-pointer`}>Cancel</button>
                <button onClick={handleCreateClass} className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl cursor-pointer">Create Class</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* =================== TEACHER HOME =================== */
function TeacherHome({ theme, myClasses, setShowCreateClass }: any) {
  const isDark = theme === 'dark';
  
  const weeklyEngagement = [
    { day: 'Mon', students: 42 },
    { day: 'Tue', students: 38 },
    { day: 'Wed', students: 45 },
    { day: 'Thu', students: 40 },
    { day: 'Fri', students: 48 },
    { day: 'Sat', students: 35 },
    { day: 'Sun', students: 20 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Classes', value: myClasses.length + 2, icon: '📚', change: '+2 this month' },
          { label: 'Total Students', value: '125', icon: '👨‍🎓', change: '+15 new' },
          { label: 'Papers Generated', value: '48', icon: '📝', change: '+8 this week' },
          { label: 'Avg Attendance', value: '92%', icon: '✅', change: '+3% improved' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-5`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                <p className="text-2xl font-bold mt-1 font-display">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'} mt-2`}>{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Engagement Chart */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <h3 className="font-bold font-display text-lg mb-6">Weekly Student Engagement</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyEngagement}>
              <defs>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#6b7280' : '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#6b7280' : '#9ca3af' }} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1a1a3a' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px' }} />
              <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} fill="url(#engGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <h3 className="font-bold font-display text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { icon: Video, label: 'Start Live Class', color: 'from-red-500 to-pink-500' },
              { icon: FileText, label: 'Generate Paper', color: 'from-violet-500 to-purple-500' },
              { icon: Upload, label: 'Upload Material', color: 'from-blue-500 to-cyan-500' },
              { icon: MessageSquare, label: 'Send Announcement', color: 'from-emerald-500 to-teal-500' },
            ].map((action, i) => (
              <button key={i} className={`w-full p-4 ${isDark ? 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.04]' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} border rounded-xl flex items-center gap-3 transition cursor-pointer`}>
                <div className={`p-2 bg-gradient-to-br ${action.color} rounded-lg`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* My Classes */}
      <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold font-display text-lg">My Classes</h3>
          <button onClick={() => setShowCreateClass(true)} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl cursor-pointer flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Class
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myClasses.map((c: any) => (
            <div key={c.id} className={`p-4 ${isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-gray-50 border-gray-200'} border rounded-xl`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">{c.name}</h4>
                {c.isLive && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">LIVE</span>}
              </div>
              <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                <Users className="h-3.5 w-3.5" /> {c.students} students
                <Clock className="h-3.5 w-3.5 ml-2" /> {c.schedule}
              </div>
              <div className="flex gap-2">
                <button className={`flex-1 py-2 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-100'} rounded-lg text-xs font-medium cursor-pointer`}>View</button>
                <button className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs font-medium cursor-pointer flex items-center justify-center gap-1">
                  <Play className="h-3 w-3" /> Go Live
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =================== TEACHER CLASSES =================== */
function TeacherClasses({ theme, myClasses, setShowCreateClass }: any) {
  const isDark = theme === 'dark';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your classes and start live sessions</p>
        <button onClick={() => setShowCreateClass(true)} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl cursor-pointer flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Class
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myClasses.map((c: any) => (
          <div key={c.id} className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} rounded-xl`}>
                <Video className="h-6 w-6 text-indigo-500" />
              </div>
              {c.isLive && <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg animate-pulse">LIVE</span>}
            </div>
            <h3 className="font-bold text-lg mb-1">{c.name}</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{c.schedule}</p>
            
            <div className={`flex items-center justify-between py-3 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">{c.students} Students</span>
              </div>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Code: {c.code}</span>
            </div>

            <div className="flex gap-3 mt-4">
              <button className={`flex-1 py-2.5 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl text-sm font-medium cursor-pointer`}>
                Manage
              </button>
              <button className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl text-sm font-semibold cursor-pointer flex items-center justify-center gap-2">
                <Play className="h-4 w-4" /> Start Class
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =================== TEACHER STUDENTS =================== */
function TeacherStudents({ theme }: any) {
  const isDark = theme === 'dark';
  
  const students = [
    { name: 'Aarav Sharma', class: '10A', avgScore: 85, attendance: 94, avatar: '👦' },
    { name: 'Priya Patel', class: '10A', avgScore: 92, attendance: 98, avatar: '👧' },
    { name: 'Rohan Kumar', class: '10B', avgScore: 78, attendance: 87, avatar: '👦' },
    { name: 'Sneha Gupta', class: '10A', avgScore: 88, attendance: 92, avatar: '👧' },
    { name: 'Vikram Rao', class: '10B', avgScore: 82, attendance: 90, avatar: '👦' },
  ];

  return (
    <div className="space-y-6">
      <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
              <th className={`text-left py-4 px-6 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold`}>Student</th>
              <th className={`text-center py-4 px-6 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold`}>Class</th>
              <th className={`text-center py-4 px-6 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold`}>Avg Score</th>
              <th className={`text-center py-4 px-6 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold`}>Attendance</th>
              <th className={`text-right py-4 px-6 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className={`border-b ${isDark ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-gray-100 hover:bg-gray-50'}`}>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.avatar}</span>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">{s.class}</td>
                <td className="py-4 px-6 text-center">
                  <span className={`font-bold ${s.avgScore >= 85 ? 'text-emerald-500' : s.avgScore >= 70 ? 'text-amber-500' : 'text-red-500'}`}>{s.avgScore}%</span>
                </td>
                <td className="py-4 px-6 text-center">{s.attendance}%</td>
                <td className="py-4 px-6 text-right">
                  <button className={`px-3 py-1.5 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg text-xs font-medium cursor-pointer`}>View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =================== TEACHER ANALYTICS =================== */
function TeacherAnalytics({ theme }: any) {
  const isDark = theme === 'dark';
  
  const classPerformance = [
    { class: '10A Math', avg: 82 },
    { class: '10B Math', avg: 78 },
    { class: '10A Physics', avg: 75 },
    { class: '10B Physics', avg: 80 },
  ];

  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <h3 className="font-bold font-display text-lg mb-6">Class Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classPerformance} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis dataKey="class" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#6b7280' : '#9ca3af' }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#6b7280' : '#9ca3af' }} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1a1a3a' : '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px' }} />
              <Bar dataKey="avg" radius={[8, 8, 0, 0]}>
                {classPerformance.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <h3 className="font-bold font-display text-lg mb-6">Key Metrics</h3>
          <div className="space-y-4">
            {[
              { label: 'Quiz Completion Rate', value: '87%', color: 'bg-indigo-500' },
              { label: 'Assignment Submission', value: '92%', color: 'bg-emerald-500' },
              { label: 'Class Participation', value: '78%', color: 'bg-amber-500' },
              { label: 'Doubt Resolution', value: '95%', color: 'bg-pink-500' },
            ].map((m, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{m.label}</span>
                  <span className="text-sm font-bold">{m.value}</span>
                </div>
                <div className={`h-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-full`}>
                  <div className={`h-full ${m.color} rounded-full`} style={{ width: m.value }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
