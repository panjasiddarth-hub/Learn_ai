import { AppProvider, useApp } from './store/AppContext';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import ParentDashboard from './components/ParentDashboard';
import ToastContainer from './components/Toast';

function AppRouter() {
  const { user } = useApp();
  if (!user) return <LandingPage />;
  if (user.role === 'student') return <StudentDashboard />;
  if (user.role === 'teacher') return <TeacherDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'parent') return <ParentDashboard />;
  return <LandingPage />;
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <ToastContainer />
    </AppProvider>
  );
}
