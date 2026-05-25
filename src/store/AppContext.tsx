import { ExamTarget } from '../data/syllabi';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  isSupabaseConfigured,
  signInUser,
  signUpUser,
  signOutUser,
  getUserProfile,
  getProfileByLoginId,
  getAllStudents,
  getAllTeachers,
  getQuizResults,
  saveQuizResult as saveQuizResultDB,
  getClassrooms,
  createClassroomDB,
  toggleClassroomLive,
  joinClassroomByCode,
  getAssignments,
  createAssignmentDB,
  getNotes,
  createNoteDB,
  deleteNoteDB,
  getFees,
  updateFeeStatus,
  saveDoubt,
  signInWithGoogle,
  getCurrentSession,
} from '../services/supabase';

export type UserRole = 'none' | 'student' | 'teacher' | 'admin' | 'parent';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  grade?: string;
  subjects?: string[];
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  joinDate?: string;
  referralCode?: string;
  studentType?: 'offline' | 'online';
  loginId?: string;
  fees?: { month: string; amount: number; status: 'paid' | 'pending' | 'overdue' }[];
}

export interface QuizResult {
  id: string;
  studentId: string;
  subject: string;
  chapter: string;
  score: number;
  totalQuestions: number;
  date: string;
  timeTaken: number;
  weakTopics: string[];
}

export interface Classroom {
  id: string; name: string; subject: string; teacher: string; teacherId: string;
  students: number; code: string; schedule: string; isLive?: boolean;
}

export interface DoubtMessage {
  id: string; role: 'user' | 'ai'; content: string; timestamp: string; type?: string;
}

export interface Assignment {
  id: string; title: string; subject: string; grade: string; description: string;
  dueDate: string; createdBy: string; createdAt: string;
  submissions: { studentId: string; studentName: string; submittedAt: string; answer: string; grade?: string; feedback?: string }[];
}

export interface AttendanceRecord {
  id: string; date: string; classroomId: string; classroomName: string; present: string[]; absent: string[];
}

export interface Toast {
  id: string; message: string; type: 'success' | 'error' | 'info';
}

export interface Note {
  id: string; title: string; subject: string; grade: string; content: string;
  createdBy: string; createdAt: string; type: 'notes' | 'pdf' | 'video' | 'important';
}

function loadState<T>(key: string, fallback: T): T {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
}
function saveState(key: string, data: any) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { /* ignore */ }
}

function mapProfileToUser(profile: any): User {
  return {
    id: profile.id, name: profile.name || 'User', email: profile.email || '',
    role: profile.role || 'student', avatar: profile.avatar || '👤',
    grade: profile.grade, subjects: profile.subjects || [], phone: profile.phone,
    parentName: profile.parent_name, parentPhone: profile.parent_phone, parentEmail: profile.parent_email,
    joinDate: profile.join_date, referralCode: profile.referral_code, studentType: profile.student_type,
    loginId: profile.login_id, fees: [],
  };
}

// Demo accounts for offline mode
const DEMO_ACCOUNTS: Record<string, { password: string; userData: Omit<User, 'fees'> }> = {
  'STU001': { password: 'aarav123', userData: { id: 'stu001', name: 'Aarav Sharma', email: 'aarav@learnai.com', role: 'student', avatar: '👦', grade: '10th', subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'], phone: '9876543210', parentName: 'Rajesh Sharma', parentPhone: '9876543211', parentEmail: 'rajesh@parent.com', joinDate: '2026-01-15', referralCode: 'REF001', studentType: 'online', loginId: 'STU001' } },
  'stu001': { password: 'aarav123', userData: { id: 'stu001', name: 'Aarav Sharma', email: 'aarav@learnai.com', role: 'student', avatar: '👦', grade: '10th', subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'], phone: '9876543210', parentName: 'Rajesh Sharma', parentPhone: '9876543211', parentEmail: 'rajesh@parent.com', joinDate: '2026-01-15', referralCode: 'REF001', studentType: 'online', loginId: 'STU001' } },
  'aarav@learnai.com': { password: 'aarav123', userData: { id: 'stu001', name: 'Aarav Sharma', email: 'aarav@learnai.com', role: 'student', avatar: '👦', grade: '10th', subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'], phone: '9876543210', parentName: 'Rajesh Sharma', parentPhone: '9876543211', parentEmail: 'rajesh@parent.com', joinDate: '2026-01-15', referralCode: 'REF001', studentType: 'online', loginId: 'STU001' } },
  'TCH001': { password: 'teach123', userData: { id: 'tch001', name: 'Ramesh Sir', email: 'ramesh@learnai.com', role: 'teacher', avatar: '👨‍🏫', grade: '10th', subjects: ['Mathematics'], phone: '9988776655', loginId: 'TCH001', joinDate: '2025-06-01' } },
  'tch001': { password: 'teach123', userData: { id: 'tch001', name: 'Ramesh Sir', email: 'ramesh@learnai.com', role: 'teacher', avatar: '👨‍🏫', grade: '10th', subjects: ['Mathematics'], phone: '9988776655', loginId: 'TCH001', joinDate: '2025-06-01' } },
  'admin@learnai.com': { password: 'admin123', userData: { id: 'admin001', name: 'Admin', email: 'admin@learnai.com', role: 'admin', avatar: '🛡️', grade: '10th' } },
  'rajesh@parent.com': { password: 'parent123', userData: { id: 'par001', name: 'Rajesh Sharma (Parent)', email: 'rajesh@parent.com', role: 'parent', avatar: '👨‍👩‍👦', grade: '10th', parentName: 'Rajesh Sharma', parentPhone: '9876543211', parentEmail: 'rajesh@parent.com' } },
};

interface AppState {
  examTarget: ExamTarget; setExamTarget: (target: ExamTarget) => void;
  theme: Theme; toggleTheme: () => void;
  user: User | null; allStudents: User[]; allTeachers: User[]; loading: boolean; onlineMode: boolean;
  login: (identifier: string, password: string, role: UserRole) => Promise<boolean>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, extra?: Partial<User>) => Promise<boolean>;
  logout: () => void;
  refreshUsers: () => Promise<void>;
  quizResults: QuizResult[]; addQuizResult: (r: QuizResult) => Promise<void>;
  classrooms: Classroom[]; joinClassroom: (code: string) => Promise<boolean>;
  createClassroom: (c: Omit<Classroom, 'id' | 'code' | 'students'>) => Promise<Classroom | null>;
  toggleClassLive: (id: string) => Promise<void>;
  doubtHistory: DoubtMessage[]; addDoubtMessage: (m: DoubtMessage) => void; clearDoubtHistory: () => void;
  assignments: Assignment[]; addAssignment: (a: Assignment) => Promise<void>;
  submitAssignment: (aId: string, sId: string, sName: string, answer: string) => void;
  gradeAssignment: (aId: string, sId: string, grade: string, feedback: string) => void;
  attendance: AttendanceRecord[]; markAttendance: (r: AttendanceRecord) => void;
  notes: Note[]; addNote: (n: Note) => Promise<void>; deleteNote: (id: string) => Promise<void>;
  toasts: Toast[]; addToast: (message: string, type: Toast['type']) => void; removeToast: (id: string) => void;
  addStudent: (s: User) => void;
  updateStudentFee: (studentId: string, month: string, status: 'paid' | 'pending' | 'overdue') => Promise<void>;
  getStudentById: (id: string) => User | undefined;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [examTarget, setExamTargetState] = useState<ExamTarget>(loadState('examTarget', 'cbse_10'));
  const setExamTarget = useCallback((target: ExamTarget) => {
    setExamTargetState(target); saveState('examTarget', target);
  }, []);
  const [theme, setTheme] = useState<Theme>(loadState('theme', 'dark'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlineMode, setOnlineMode] = useState(false);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [allTeachers, setAllTeachers] = useState<User[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [doubtHistory, setDoubtHistory] = useState<DoubtMessage[]>(loadState('doubtHistory', []));
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(loadState('attendance', []));
  const [notes, setNotes] = useState<Note[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const online = isSupabaseConfigured();

  useEffect(() => {
    saveState('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);
  useEffect(() => { saveState('doubtHistory', doubtHistory); }, [doubtHistory]);
  useEffect(() => { saveState('attendance', attendance); }, [attendance]);
  useEffect(() => { setOnlineMode(online); }, [online]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = String(Date.now());
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  const removeToast = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  const toggleTheme = useCallback(() => setTheme(prev => prev === 'dark' ? 'light' : 'dark'), []);

  const refreshUsers = useCallback(async () => {
    const [s, t] = await Promise.all([getAllStudents(), getAllTeachers()]);
    if (s.success) setAllStudents(s.data.map(mapProfileToUser));
    if (t.success) setAllTeachers(t.data.map(mapProfileToUser));
  }, []);

  const loadAllData = useCallback(async () => {
    const [studentsRes, teachersRes, quizRes, classRes, assignRes, notesRes] = await Promise.all([
      getAllStudents(), getAllTeachers(), getQuizResults(), getClassrooms(), getAssignments(), getNotes(),
    ]);

    if (studentsRes.success) {
      const students = studentsRes.data.map(mapProfileToUser);
      for (const s of students) {
        const feeRes = await getFees(s.id);
        if (feeRes.success) s.fees = feeRes.data;
      }
      setAllStudents(students);
    }
    if (teachersRes.success) setAllTeachers(teachersRes.data.map(mapProfileToUser));
    if (quizRes.success) setQuizResults(quizRes.data.map((q: any) => ({
      id: q.id, studentId: q.student_id, subject: q.subject, chapter: q.chapter || '',
      score: q.score, totalQuestions: q.total_questions, date: q.created_at?.split('T')[0] || '',
      timeTaken: q.time_taken || 0, weakTopics: q.weak_topics || [],
    })));
    if (classRes.success) setClassrooms(classRes.data.map((c: any) => ({
      id: c.id, name: c.name, subject: c.subject, teacher: c.teacher_name || '',
      teacherId: c.teacher_id || '', students: 0, code: c.code,
      schedule: c.schedule || '', isLive: c.is_live || false,
    })));
    if (assignRes.success) setAssignments(assignRes.data.map((a: any) => ({
      id: a.id, title: a.title, subject: a.subject, grade: a.grade || '',
      description: a.description || '', dueDate: a.due_date || '',
      createdBy: a.created_by || '', createdAt: a.created_at?.split('T')[0] || '', submissions: [],
    })));
    if (notesRes.success) setNotes(notesRes.data.map((n: any) => ({
      id: n.id, title: n.title, subject: n.subject || '', grade: n.grade || '',
      content: n.content || '', createdBy: n.created_by || '',
      createdAt: n.created_at?.split('T')[0] || '', type: n.type || 'notes',
    })));
  }, []);

  // Auto-login on mount
  useEffect(() => {
    let cancelled = false;

    async function autoLogin() {
      if (!online) {
        // Offline: restore saved user from localStorage
        const savedUser = loadState<User | null>('currentUser', null);
        if (cancelled) return;
        if (savedUser) { setUser(savedUser); await loadAllData(); }
        setLoading(false);
        return;
      }

      // Online: check Supabase session
      try {
        const sessionRes = await getCurrentSession();
        if (cancelled) return;
        if (sessionRes.success && sessionRes.session?.user) {
          const profileRes = await getUserProfile(sessionRes.session.user.id);
          if (cancelled) return;
          if (profileRes.success && profileRes.data) {
            const u = mapProfileToUser(profileRes.data);
            const feeRes = await getFees(u.id);
            if (feeRes.success) u.fees = feeRes.data;
            setUser(u);
            await loadAllData();
          }
        }
      } catch (err) { console.error('Auto-login failed:', err); }
      if (!cancelled) setLoading(false);
    }

    autoLogin();
    return () => { cancelled = true; };
  }, [online, loadAllData]);

  // LOGIN
  const login = useCallback(async (identifier: string, password: string, role: UserRole): Promise<boolean> => {
    if (!identifier.trim() || !password.trim()) {
      addToast('Please enter ID/email and password', 'error'); return false;
    }

    // OFFLINE MODE: Check demo accounts
    if (!online) {
      const demo = DEMO_ACCOUNTS[identifier.toUpperCase()] || DEMO_ACCOUNTS[identifier.toLowerCase()];
      if (demo && demo.password === password) {
        const u = { ...demo.userData, fees: [] } as User;
        if (role !== 'none' && u.role !== role && role !== 'student') {
          addToast(`This account is registered as ${u.role}`, 'error'); return false;
        }
        await loadAllData();
        const feeRes = await getFees(u.id);
        if (feeRes.success) u.fees = feeRes.data;
        setUser(u);
        saveState('currentUser', u);
        // Load demo quiz results for students
        if (u.role === 'student') {
          const demoResults = await getQuizResults(u.id);
          if (demoResults.success) setQuizResults(demoResults.data.map((q: any) => ({
            id: q.id, studentId: q.student_id, subject: q.subject, chapter: q.chapter || '',
            score: q.score, totalQuestions: q.total_questions, date: q.created_at?.split('T')[0] || '',
            timeTaken: q.time_taken || 0, weakTopics: q.weak_topics || [],
          })));
        }
        addToast(`Welcome, ${u.name}! 🎉 (Demo Mode)`, 'success');
        return true;
      }
      addToast('Invalid credentials. Try demo accounts on the login page.', 'error');
      return false;
    }

    // ONLINE MODE: Supabase login
    try {
      let loginEmail = identifier;
      const upperId = identifier.toUpperCase();
      const isLoginId = /^[A-Z]{2,4}\d{3,6}$/i.test(upperId) || /^[A-Z]{3,}$/i.test(upperId);
      if (isLoginId) {
        const profRes = await getProfileByLoginId(upperId);
        if (!profRes.success || !profRes.data) { addToast('User ID not found ❌', 'error'); return false; }
        loginEmail = profRes.data.email;
      }
      const result = await signInUser(loginEmail, password);
      if (!result.success || !result.data?.user) { addToast(result.error || 'Wrong password ❌', 'error'); return false; }
      const profileRes = await getUserProfile(result.data.user.id);
      if (profileRes.success && profileRes.data) {
        const profile = profileRes.data;
        if (profile.role !== role) { await signOutUser(); addToast(`This account is registered as ${profile.role}, not ${role}`, 'error'); return false; }
        const u = mapProfileToUser(profile);
        const feeRes = await getFees(u.id);
        if (feeRes.success) u.fees = feeRes.data;
        setUser(u); saveState('currentUser', u); await loadAllData();
        addToast(`Welcome back, ${u.name}! 🎉`, 'success');
        return true;
      }
      addToast('Profile not found', 'error'); return false;
    } catch (err: any) { addToast(err.message || 'Login failed', 'error'); return false; }
  }, [online, addToast, loadAllData]);

  const loginWithGoogle = useCallback(async (_role: UserRole): Promise<void> => {
    if (!online) { addToast('Google login requires Supabase', 'error'); return; }
    try {
      const { error } = await signInWithGoogle();
      if (error) addToast(error.message || error, 'error');
    } catch (err: any) { addToast(err.message || 'Google login failed', 'error'); }
  }, [online, addToast]);

  const signup = async (name: string, emailOrPhone: string, password: string, role: UserRole, extra?: Partial<User>): Promise<boolean> => {
    if (!name || !emailOrPhone) { addToast('Please fill all fields', 'error'); return false; }
    if (!online) { addToast('Sign up requires Supabase', 'error'); return false; }
    if (!password || password.length < 6) { addToast('Password must be 6+ characters', 'error'); return false; }
    try {
      const isPhone = /^\d{10}$/.test(emailOrPhone);
      const email = isPhone ? `${emailOrPhone}@learnai.com` : emailOrPhone;
      const result = await signUpUser(email, password, { name, role: role as any, phone: isPhone ? emailOrPhone : extra?.phone, grade: extra?.grade || '10th' });
      if (!result.success) { addToast(result.error || 'Signup failed', 'error'); return false; }
      addToast(`Account created! 🎉 Now login.`, 'success'); return true;
    } catch (err: any) { addToast(err.message || 'Signup failed', 'error'); return false; }
  };

  // LOGOUT — simple synchronous, no await
  const logout = useCallback(() => {
    if (online) signOutUser().catch(console.error);
    setUser(null);
    saveState('currentUser', null);
    setAllStudents([]); setAllTeachers([]); setQuizResults([]);
    setClassrooms([]); setAssignments([]); setNotes([]);
    setDoubtHistory([]); setAttendance([]);
    const toastId = String(Date.now());
    setToasts(prev => [...prev, { id: toastId, message: 'Logged out 👋', type: 'info' as const }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toastId)), 3500);
  }, [online]);

  const addQuizResult = useCallback(async (r: QuizResult) => {
    const res = await saveQuizResultDB({ student_id: r.studentId, subject: r.subject, chapter: r.chapter, score: r.score, total_questions: r.totalQuestions, time_taken: r.timeTaken, weak_topics: r.weakTopics });
    if (res.success) setQuizResults(prev => [r, ...prev]);
  }, []);

  const joinClassroom = useCallback(async (code: string): Promise<boolean> => {
    if (!user) return false;
    const res = await joinClassroomByCode(user.id, code);
    if (res.success && res.data) { addToast(`Joined "${res.data.name}"! 🎓`, 'success'); return true; }
    addToast('Invalid code or already enrolled', 'error'); return false;
  }, [user, addToast]);

  const createClassroom = useCallback(async (data: Omit<Classroom, 'id' | 'code' | 'students'>): Promise<Classroom | null> => {
    if (!user) return null;
    const code = data.name.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6);
    const res = await createClassroomDB({ name: data.name, subject: data.subject, teacher_id: user.id, teacher_name: user.name, schedule: data.schedule, code });
    if (res.success && res.data) {
      const nc: Classroom = { id: res.data.id, name: res.data.name, subject: res.data.subject, teacher: res.data.teacher_name, teacherId: res.data.teacher_id, students: 0, code: res.data.code, schedule: res.data.schedule, isLive: false };
      setClassrooms(prev => [nc, ...prev]);
      addToast(`Class created! Code: ${nc.code}`, 'success');
      return nc;
    }
    addToast('Failed to create classroom', 'error'); return null;
  }, [user, addToast]);

  const toggleClassLive = useCallback(async (id: string) => {
    const cls = classrooms.find(c => c.id === id);
    if (!cls) return;
    const res = await toggleClassroomLive(id, !cls.isLive);
    if (res.success) setClassrooms(prev => prev.map(c => c.id === id ? { ...c, isLive: !c.isLive } : c));
  }, [classrooms]);

  const addDoubtMessage = useCallback((m: DoubtMessage) => {
    setDoubtHistory(prev => [...prev, m]);
    if (user && m.role === 'ai') {
      const lastUser = [...doubtHistory].reverse().find(d => d.role === 'user');
      if (lastUser) saveDoubt({ user_id: user.id, question: lastUser.content, answer: m.content, explanation_type: m.type });
    }
  }, [user, doubtHistory]);

  const clearDoubtHistory = useCallback(() => { setDoubtHistory([]); addToast('Chat cleared', 'info'); }, [addToast]);

  const addAssignment = useCallback(async (a: Assignment) => {
    if (!user) return;
    const res = await createAssignmentDB({ title: a.title, subject: a.subject, grade: a.grade, description: a.description, due_date: a.dueDate, created_by: user.id });
    if (res.success && res.data) { setAssignments(prev => [{ ...a, id: res.data.id }, ...prev]); addToast('Assignment created! 📝', 'success'); }
  }, [user, addToast]);

  const submitAssignment = useCallback((aId: string, sId: string, sName: string, answer: string) => {
    setAssignments(prev => prev.map(a => a.id === aId ? { ...a, submissions: [...a.submissions, { studentId: sId, studentName: sName, submittedAt: new Date().toISOString().split('T')[0], answer }] } : a));
    addToast('Assignment submitted! ✅', 'success');
  }, [addToast]);

  const gradeAssignment = useCallback((aId: string, sId: string, grade: string, feedback: string) => {
    setAssignments(prev => prev.map(a => a.id === aId ? { ...a, submissions: a.submissions.map(s => s.studentId === sId ? { ...s, grade, feedback } : s) } : a));
    addToast('Graded! ✅', 'success');
  }, [addToast]);

  const markAttendance = useCallback((r: AttendanceRecord) => { setAttendance(prev => [r, ...prev]); addToast('Attendance marked! ✅', 'success'); }, [addToast]);

  const addNote = useCallback(async (n: Note) => {
    if (!user) return;
    const res = await createNoteDB({ title: n.title, subject: n.subject, grade: n.grade, content: n.content, type: n.type, created_by: user.id });
    if (res.success && res.data) { setNotes(prev => [{ ...n, id: res.data.id }, ...prev]); addToast('Notes uploaded! 📚', 'success'); }
  }, [user, addToast]);

  const deleteNote = useCallback(async (id: string) => {
    const res = await deleteNoteDB(id);
    if (res.success) setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const addStudent = useCallback((s: User) => { setAllStudents(prev => [...prev, s]); addToast(`Student ${s.name} added!`, 'success'); }, [addToast]);

  const updateStudentFee = useCallback(async (studentId: string, month: string, status: 'paid' | 'pending' | 'overdue') => {
    const res = await updateFeeStatus(studentId, month, status);
    if (res.success) { setAllStudents(prev => prev.map(s => s.id === studentId ? { ...s, fees: s.fees?.map(f => f.month === month ? { ...f, status } : f) } : s)); addToast('Fee updated ✅', 'success'); }
  }, [addToast]);

  const getStudentById = useCallback((id: string) => allStudents.find(s => s.id === id), [allStudents]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">{online ? 'Loading LearnAI...' : 'Loading LearnAI (Demo Mode)...'}</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, user, examTarget, setExamTarget, allStudents, allTeachers, loading, onlineMode,
      login, loginWithGoogle, signup, logout, refreshUsers,
      quizResults, addQuizResult, classrooms, joinClassroom, createClassroom, toggleClassLive,
      doubtHistory, addDoubtMessage, clearDoubtHistory,
      assignments, addAssignment, submitAssignment, gradeAssignment,
      attendance, markAttendance, notes, addNote, deleteNote,
      toasts, addToast, removeToast, addStudent, updateStudentFee, getStudentById,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}