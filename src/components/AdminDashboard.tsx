import { useState } from 'react';
import { LayoutDashboard, Users, BookOpen, DollarSign, LogOut, Brain, Moon, Sun, Menu, Trash2, Check, MessageSquare, ClipboardList, Phone } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function AdminDashboard() {
  const app = useApp();
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDark = app.theme === 'dark';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'fees', label: 'Fee Management', icon: DollarSign },
    { id: 'notes', label: 'Study Material', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList },
    { id: 'messages', label: 'Send Messages', icon: MessageSquare },
  ];

  const totalFees = app.allStudents.reduce((sum, s) => sum + (s.fees?.reduce((a, f) => a + f.amount, 0) || 0), 0);
  const collectedFees = app.allStudents.reduce((sum, s) => sum + (s.fees?.filter(f => f.status === 'paid').reduce((a, f) => a + f.amount, 0) || 0), 0);
  const pendingFees = totalFees - collectedFees;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a1a] text-white' : 'bg-gray-50 text-gray-900'} flex`}>
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 ${isDark ? 'bg-[#0d0d22] border-white/5' : 'bg-white border-gray-200'} border-r flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className={`p-6 flex items-center gap-3 border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-2 shadow-lg"><Brain className="h-6 w-6 text-white" /></div>
          <div><span className="font-bold font-display">LearnAI</span><p className={`text-[10px] text-red-400 tracking-widest uppercase`}>Admin Panel</p></div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${tab === t.id ? `bg-gradient-to-r ${isDark ? 'from-red-600/20 to-orange-600/20 text-red-300 border-red-500/20' : 'from-red-100 to-orange-100 text-red-700 border-red-200'} border` : `${isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'}`}`}>
              <t.icon className="h-5 w-5" />{t.label}
            </button>
          ))}
        </nav>
        <div className={`p-4 border-t ${isDark ? 'border-white/5' : 'border-gray-200'} space-y-2`}>
          <button onClick={app.toggleTheme} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm ${isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'} cursor-pointer`}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Theme
          </button>
          <button onClick={app.logout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition cursor-pointer`}><LogOut className="h-5 w-5" /> Logout</button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main */}
      <main className="flex-1 overflow-x-hidden">
        <header className={`sticky top-0 z-30 ${isDark ? 'bg-[#0a0a1a]/80 border-white/5' : 'bg-white/80 border-gray-200'} backdrop-blur-xl border-b px-6 h-16 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg cursor-pointer"><Menu className="h-5 w-5" /></button>
            <h1 className="text-lg font-bold font-display">🛡️ Admin — {tabs.find(t => t.id === tab)?.label}</h1>
          </div>
        </header>

        <div className="p-6">
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Students', value: app.allStudents.length, icon: '👨‍🎓', color: 'from-blue-500/20 to-blue-600/20' },
                  { label: 'Teachers', value: app.allTeachers.length, icon: '👨‍🏫', color: 'from-green-500/20 to-green-600/20' },
                  { label: 'Collected', value: `₹${collectedFees.toLocaleString()}`, icon: '💰', color: 'from-emerald-500/20 to-emerald-600/20' },
                  { label: 'Pending', value: `₹${pendingFees.toLocaleString()}`, icon: '⏳', color: 'from-red-500/20 to-red-600/20' },
                ].map((s, i) => (
                  <div key={i} className={`${isDark ? `bg-gradient-to-br ${s.color} border border-white/[0.06]` : 'bg-white border-gray-200 shadow-sm border'} rounded-2xl p-5`}>
                    <div className="flex items-start justify-between"><div><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</p><p className="text-2xl font-bold mt-1 font-display">{s.value}</p></div><span className="text-2xl">{s.icon}</span></div>
                  </div>
                ))}
              </div>
              <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                <h3 className="font-bold font-display text-lg mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {app.quizResults.slice(0, 5).map((r, i) => { const st = app.getStudentById(r.studentId); return (
                    <div key={i} className={`p-3 ${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'} rounded-xl flex items-center justify-between`}>
                      <span className="text-sm">{st?.name || 'Student'} scored <strong>{r.score}/{r.totalQuestions}</strong> in {r.subject}</span>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{r.date}</span>
                    </div>
                  ); })}
                </div>
              </div>
            </div>
          )}

          {tab === 'students' && (
            <div className="space-y-6">
              <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl overflow-hidden`}>
                <table className="w-full text-sm">
                  <thead><tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                    <th className="text-left py-3 px-4 font-semibold">Student</th>
                    <th className="text-center py-3 px-4 font-semibold">Class</th>
                    <th className="text-center py-3 px-4 font-semibold">Phone</th>
                    <th className="text-center py-3 px-4 font-semibold">Parent</th>
                    <th className="text-center py-3 px-4 font-semibold">Referral Code</th>
                    <th className="text-right py-3 px-4 font-semibold">WhatsApp</th>
                  </tr></thead>
                  <tbody>
                    {app.allStudents.map(s => (
                      <tr key={s.id} className={`border-b ${isDark ? 'border-white/[0.03]' : 'border-gray-100'}`}>
                        <td className="py-3 px-4 font-medium flex items-center gap-2"><span className="text-xl">{s.avatar}</span>{s.name}</td>
                        <td className="py-3 px-4 text-center">{s.grade}</td>
                        <td className="py-3 px-4 text-center">{s.phone}</td>
                        <td className="py-3 px-4 text-center">{s.parentName}</td>
                        <td className="py-3 px-4 text-center font-mono text-xs">{s.referralCode}</td>
                        <td className="py-3 px-4 text-right">
                          <a href={`https://wa.me/91${s.parentPhone}?text=Hello%20${encodeURIComponent(s.parentName || '')},%20this%20is%20regarding%20${encodeURIComponent(s.name)}'s%20studies.`} target="_blank" rel="noopener"
                            className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium cursor-pointer inline-flex items-center gap-1">
                            <Phone className="h-3 w-3" /> WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'fees' && (
            <div className="space-y-6">
              {app.allStudents.map(s => (
                <div key={s.id} className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-5`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3"><span className="text-2xl">{s.avatar}</span><div><p className="font-semibold">{s.name}</p><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Class {s.grade} • {s.parentName}</p></div></div>
                    <a href={`https://wa.me/91${s.parentPhone}?text=Fee%20reminder%20for%20${encodeURIComponent(s.name)}%20-%20Please%20pay%20pending%20fees.`} target="_blank" rel="noopener"
                      className={`px-3 py-1.5 ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'} rounded-lg text-xs font-medium cursor-pointer`}>
                      Send Reminder
                    </a>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {s.fees?.map((f, i) => (
                      <button key={i} onClick={() => app.updateStudentFee(s.id, f.month, f.status === 'paid' ? 'pending' : 'paid')}
                        className={`p-2 rounded-xl text-xs text-center cursor-pointer border transition ${
                          f.status === 'paid' ? `${isDark ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-700'}` :
                          f.status === 'overdue' ? `${isDark ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-red-100 border-red-200 text-red-700'}` :
                          `${isDark ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-700'}`
                        }`}>
                        <p className="font-medium">{f.month}</p>
                        <p>₹{f.amount}</p>
                        <p className="capitalize mt-1">{f.status}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'notes' && (
            <div className="space-y-4">
              <NotesManager />
            </div>
          )}

          {tab === 'attendance' && (
            <div className="space-y-4">
              <AttendanceManager />
            </div>
          )}

          {tab === 'messages' && (
            <div className="space-y-4">
              <MessageSender />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NotesManager() {
  const { notes, addNote, deleteNote, theme } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', subject: 'Mathematics', grade: '10th', content: '', type: 'notes' as any });
  const isDark = theme === 'dark';
  const handleAdd = () => { if (!form.title) return; addNote({ id: 'n_' + Date.now(), ...form, createdBy: 'admin', createdAt: new Date().toISOString().split('T')[0] }); setShowAdd(false); setForm({ title: '', subject: 'Mathematics', grade: '10th', content: '', type: 'notes' }); };

  return (
    <>
      <div className="flex justify-end"><button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl cursor-pointer">+ Upload Notes</button></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(n => (
          <div key={n.id} className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-5`}>
            <div className="flex justify-between mb-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>{n.type}</span><button onClick={() => deleteNote(n.id)} className="text-red-400 cursor-pointer"><Trash2 className="h-4 w-4" /></button></div>
            <h4 className="font-semibold text-sm mb-1">{n.title}</h4>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{n.subject} • {n.grade}</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2 line-clamp-3`}>{n.content}</p>
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAdd(false)}></div>
          <div className={`relative ${isDark ? 'bg-[#12122a] border-white/10' : 'bg-white border-gray-200'} border rounded-3xl p-8 w-full max-w-md`}>
            <h2 className="text-xl font-bold mb-6">Upload Study Material</h2>
            <div className="space-y-3">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className={`w-full px-4 py-2.5 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm`} />
              <div className="grid grid-cols-3 gap-2">
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className={`px-3 py-2.5 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm cursor-pointer`}>
                  {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'].map(s => <option key={s} value={s} className={isDark ? 'bg-[#12122a]' : ''}>{s}</option>)}
                </select>
                <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} className={`px-3 py-2.5 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm cursor-pointer`}>
                  {['8th', '9th', '10th', '11th', '12th'].map(g => <option key={g} value={g} className={isDark ? 'bg-[#12122a]' : ''}>{g}</option>)}
                </select>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={`px-3 py-2.5 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm cursor-pointer`}>
                  {['notes', 'important', 'pdf', 'video'].map(t => <option key={t} value={t} className={isDark ? 'bg-[#12122a]' : ''}>{t}</option>)}
                </select>
              </div>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Notes content..." rows={5} className={`w-full px-4 py-2.5 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm resize-none`} />
              <div className="flex gap-3"><button onClick={() => setShowAdd(false)} className={`flex-1 py-2.5 ${isDark ? 'bg-white/5' : 'bg-gray-100'} rounded-xl font-medium cursor-pointer`}>Cancel</button><button onClick={handleAdd} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold cursor-pointer">Upload</button></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AttendanceManager() {
  const { allStudents, classrooms, markAttendance, attendance, theme } = useApp();
  const [selectedClass, setSelectedClass] = useState(classrooms[0]?.id || '');
  const [present, setPresent] = useState<string[]>([]);
  const isDark = theme === 'dark';
  const toggleStudent = (id: string) => setPresent(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleMark = () => {
    const cls = classrooms.find(c => c.id === selectedClass);
    markAttendance({ id: 'att_' + Date.now(), date: new Date().toISOString().split('T')[0], classroomId: selectedClass, classroomName: cls?.name || '', present, absent: allStudents.map(s => s.id).filter(id => !present.includes(id)) });
    setPresent([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} block mb-1`}>Select Class</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className={`w-full px-4 py-2.5 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm cursor-pointer`}>
            {classrooms.map(c => <option key={c.id} value={c.id} className={isDark ? 'bg-[#12122a]' : ''}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={handleMark} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl cursor-pointer">Mark Attendance</button>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {allStudents.map(s => (
          <button key={s.id} onClick={() => toggleStudent(s.id)}
            className={`p-4 rounded-xl border text-left cursor-pointer transition ${present.includes(s.id) ? `${isDark ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-100 border-emerald-200'}` : `${isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-gray-50 border-gray-200'}`}`}>
            <div className="flex items-center gap-3"><span className="text-2xl">{s.avatar}</span><div><p className="font-semibold text-sm">{s.name}</p><p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{s.grade}</p></div>
              {present.includes(s.id) && <Check className="h-5 w-5 text-emerald-500 ml-auto" />}
            </div>
          </button>
        ))}
      </div>
      {attendance.length > 0 && (
        <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-5 mt-6`}>
          <h3 className="font-bold mb-3">Recent Attendance</h3>
          {attendance.slice(0, 5).map(a => (
            <div key={a.id} className={`p-3 ${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'} rounded-xl mb-2 flex justify-between`}>
              <span className="text-sm">{a.classroomName} — {a.date}</span>
              <span className="text-xs text-emerald-500">{a.present.length} present / {a.absent.length} absent</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessageSender() {
  const { allStudents, theme, addToast } = useApp();
  const [msg, setMsg] = useState('');
  const [target, setTarget] = useState('all');
  const isDark = theme === 'dark';

  const handleSend = () => {
    if (!msg.trim()) return;
    const targets = target === 'all' ? allStudents : allStudents.filter(s => s.id === target);
    targets.forEach(s => {
      const whatsappUrl = `https://wa.me/91${s.parentPhone}?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');
    });
    addToast(`Message sent via WhatsApp to ${targets.length} parent(s)! 📱`, 'success');
    setMsg('');
  };

  return (
    <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
      <h3 className="font-bold font-display text-lg mb-4">📱 Send WhatsApp Message</h3>
      <div className="space-y-4">
        <div>
          <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} block mb-1`}>Send To</label>
          <select value={target} onChange={e => setTarget(e.target.value)} className={`w-full px-4 py-2.5 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm cursor-pointer`}>
            <option value="all" className={isDark ? 'bg-[#12122a]' : ''}>All Parents</option>
            {allStudents.map(s => <option key={s.id} value={s.id} className={isDark ? 'bg-[#12122a]' : ''}>{s.name} — {s.parentName} ({s.parentPhone})</option>)}
          </select>
        </div>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type your message..." rows={4}
          className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm resize-none`} />
        <button onClick={handleSend} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2">
          <Phone className="h-5 w-5" /> Send via WhatsApp
        </button>
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} text-center`}>Opens WhatsApp Web with pre-filled message for each parent</p>
      </div>
    </div>
  );
}
