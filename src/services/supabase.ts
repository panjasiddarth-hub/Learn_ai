import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// ============================================================
// AUTH FUNCTIONS
// ============================================================

export async function signUpUser(
  email: string,
  password: string,
  userData: {
    name: string;
    role: 'student' | 'teacher' | 'parent' | 'admin';
    phone?: string;
    grade?: string;
  }
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          phone: userData.phone,
          grade: userData.grade,
        },
      },
    });
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true, session: data.session, error: null };
  } catch (error: any) {
    return { success: false, session: null, error: error.message };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function getProfileByLoginId(loginId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('login_id', loginId.toUpperCase())
      .single();
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function getProfileByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function getAllStudents() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function getAllTeachers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'teacher')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

// ============================================================
// QUIZ RESULTS
// ============================================================

export async function saveQuizResult(result: {
  student_id: string;
  subject: string;
  chapter: string;
  score: number;
  total_questions: number;
  time_taken?: number;
  difficulty?: string;
  weak_topics?: string[];
}) {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert(result)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function getQuizResults(studentId?: string) {
  try {
    let query = supabase
      .from('quiz_results')
      .select('*')
      .order('created_at', { ascending: false });
    if (studentId) query = query.eq('student_id', studentId);
    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

// ============================================================
// CLASSROOMS
// ============================================================

export async function createClassroomDB(classroom: {
  name: string;
  subject: string;
  teacher_id: string;
  teacher_name: string;
  schedule: string;
  code: string;
}) {
  try {
    const { data, error } = await supabase
      .from('classrooms')
      .insert(classroom)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function getClassrooms() {
  try {
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function toggleClassroomLive(classroomId: string, isLive: boolean) {
  try {
    const { data, error } = await supabase
      .from('classrooms')
      .update({ is_live: isLive })
      .eq('id', classroomId)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function joinClassroomByCode(studentId: string, code: string) {
  try {
    const { data: classroom, error: findError } = await supabase
      .from('classrooms')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();
    if (findError || !classroom) throw new Error('Classroom not found');

    await supabase
      .from('enrollments')
      .insert({ student_id: studentId, classroom_id: classroom.id });

    return { success: true, data: classroom, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

// ============================================================
// ASSIGNMENTS
// ============================================================

export async function createAssignmentDB(assignment: {
  title: string;
  subject: string;
  grade?: string;
  description?: string;
  due_date: string;
  created_by: string;
}) {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .insert(assignment)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function getAssignments() {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

// ============================================================
// NOTES
// ============================================================

export async function createNoteDB(note: {
  title: string;
  subject?: string;
  grade?: string;
  content?: string;
  type?: string;
  created_by: string;
}) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function getNotes() {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function deleteNoteDB(noteId: string) {
  try {
    const { error } = await supabase.from('notes').delete().eq('id', noteId);
    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================
// FEES
// ============================================================

export async function getFees(studentId?: string) {
  try {
    let query = supabase.from('fees').select('*').order('created_at', { ascending: false });
    if (studentId) query = query.eq('student_id', studentId);
    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function updateFeeStatus(
  studentId: string,
  month: string,
  status: 'paid' | 'pending' | 'overdue'
) {
  try {
    const { data, error } = await supabase
      .from('fees')
      .update({ status })
      .eq('student_id', studentId)
      .eq('month', month)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

// ============================================================
// DOUBTS / AI HISTORY
// ============================================================

export async function saveDoubt(doubt: {
  user_id: string;
  question: string;
  answer: string;
  subject?: string;
  explanation_type?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('doubts')
      .insert(doubt)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
}

export async function getDoubtHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('doubts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

console.log('🔌 Supabase:', isSupabaseConfigured() ? '✅ Connected' : '❌ Not configured');