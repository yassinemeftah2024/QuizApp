import { useState, useCallback } from 'react'

// Layout components
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import MobileNav from './components/MobileNav'
import Toast, { type ToastData } from './components/Toast'

// Auth pages
import RoleSelect from './pages/RoleSelect'
import AdminLogin from './pages/auth/AdminLogin'
import TeacherLogin from './pages/auth/TeacherLogin'
import StudentLogin from './pages/auth/StudentLogin'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminClasses from './pages/admin/Classes'
import AdminSettings from './pages/admin/Settings'

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherQuizList from './pages/teacher/QuizList'
import TeacherQuizCreate from './pages/teacher/QuizCreate'
import TeacherDocuments from './pages/teacher/Documents'
import TeacherLiveSession from './pages/teacher/LiveSession'
import TeacherResults from './pages/teacher/Results'
import TeacherSettings from './pages/teacher/Settings'

// Student pages
import StudentHome from './pages/student/Home'
import StudentJoinQuiz from './pages/student/JoinQuiz'
import AvatarSelect from './pages/student/AvatarSelect'
import StudentLiveQuestion from './pages/student/LiveQuestion'
import StudentScore from './pages/student/Score'
import StudentHistory from './pages/student/History'
import StudentProfile from './pages/student/Profile'

// Guest pages
import GuestEntry from './pages/guest/Entry'
import GuestPostQuiz from './pages/guest/PostQuiz'

type Page =
  | 'role-select'
  | 'admin-login' | 'teacher-login' | 'student-login' | 'guest-entry'
  | 'admin-dashboard' | 'admin-users' | 'admin-classes' | 'admin-settings'
  | 'teacher-dashboard' | 'teacher-quizzes' | 'teacher-quiz-create' | 'teacher-documents' | 'teacher-live' | 'teacher-stats'
  | 'teacher-settings'
  | 'student-home' | 'student-join' | 'student-avatar' | 'student-live' | 'student-score' | 'student-history' | 'student-profile'
  | 'guest-live' | 'guest-score'

interface AvatarInfo {
  emoji: string
  color: string
  name: string
  nickname: string
}

export default function App() {
  const [page, setPage] = useState<Page>('role-select')
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState<'admin' | 'teacher' | 'student' | 'guest'>('student')
  const [avatar, setAvatar] = useState<AvatarInfo>({ emoji: '🦊', color: '#FF6B35', name: 'Shadow Fox', nickname: 'Shadow Fox' })
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((message: string, type: string = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type: type as ToastData['type'] }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const nav = useCallback((p: string) => setPage(p as Page), [])
  const logout = useCallback(() => { setPage('role-select'); setUserName('') }, [])

  // Admin layout wrapper
  const AdminLayout = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar role="admin" current={page} onNav={nav} onLogout={logout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <TopBar current={page} userName={userName} userRole="Administrator" onLogout={logout} />
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  )

  // Teacher layout wrapper
  const TeacherLayout = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar role="teacher" current={page} onNav={nav} onLogout={logout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <TopBar current={page} userName={userName} userRole="Teacher" onLogout={logout} />
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  )

  // Student layout wrapper
  const StudentLayout = ({ children }: { children: React.ReactNode }) => (
    <div style={{ maxWidth: 480, margin: '0 auto', background: '#F8FAFC', minHeight: '100vh', position: 'relative' }}>
      {children}
      <MobileNav current={page} onNav={nav} />
    </div>
  )

  // Render
  if (page === 'role-select') {
    return (
      <>
        <RoleSelect onSelect={role => {
          setUserRole(role)
          if (role === 'admin') setPage('admin-login')
          else if (role === 'teacher') setPage('teacher-login')
          else if (role === 'student') setPage('student-login')
          else setPage('guest-entry')
        }} />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    )
  }

  if (page === 'admin-login') {
    return (
      <>
        <AdminLogin
          onLogin={name => { setUserName(name); setPage('admin-dashboard') }}
          onBack={() => setPage('role-select')}
          onSwitchRole={role => setPage(`${role}-login` as Page)}
        />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    )
  }

  if (page === 'teacher-login') {
    return (
      <>
        <TeacherLogin
          onLogin={name => { setUserName(name); setPage('teacher-dashboard') }}
          onBack={() => setPage('role-select')}
          onSwitchRole={role => setPage(`${role}-login` as Page)}
        />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    )
  }

  if (page === 'student-login') {
    return (
      <>
        <StudentLogin
          onLogin={name => { setUserName(name); setPage('student-home') }}
          onBack={() => setPage('role-select')}
          onSwitchRole={role => setPage(`${role}-login` as Page)}
        />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    )
  }

  if (page === 'guest-entry') {
    return (
      <>
        <GuestEntry
          onJoin={(nickname, av) => {
            setUserName(nickname)
            setAvatar({ ...av, name: nickname, nickname })
            setPage('guest-live')
          }}
          onBack={() => setPage('role-select')}
          onRegister={() => setPage('student-login')}
        />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    )
  }

  // Admin pages
  if (page.startsWith('admin-')) {
    return (
      <>
        <AdminLayout>
          {page === 'admin-dashboard' && <AdminDashboard />}
          {page === 'admin-users' && <AdminUsers onToast={addToast} />}
          {page === 'admin-classes' && <AdminClasses onToast={addToast} />}
          {page === 'admin-settings' && <AdminSettings onToast={addToast} />}
        </AdminLayout>
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    )
  }

  // Teacher pages
  if (page.startsWith('teacher-')) {
    return (
      <>
        <TeacherLayout>
          {page === 'teacher-dashboard' && <TeacherDashboard userName={userName} onNav={nav} />}
          {page === 'teacher-quizzes' && <TeacherQuizList onNav={nav} onToast={addToast} />}
          {page === 'teacher-quiz-create' && <TeacherQuizCreate onToast={addToast} onBack={() => setPage('teacher-quizzes')} />}
          {page === 'teacher-documents' && <TeacherDocuments onToast={addToast} />}
          {page === 'teacher-live' && <TeacherLiveSession onToast={addToast} onNav={nav} />}
          {page === 'teacher-stats' && <TeacherResults onToast={addToast} />}
          {page === 'teacher-settings' && <TeacherSettings onToast={addToast} />}
        </TeacherLayout>
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    )
  }

  // Student pages
  if (page.startsWith('student-')) {
    // Full-screen pages (no mobile nav)
    if (page === 'student-avatar') {
      return (
        <>
          <AvatarSelect onConfirm={av => { setAvatar({ ...av, nickname: av.nickname || av.name }); setPage('student-live') }} />
          <Toast toasts={toasts} onRemove={removeToast} />
        </>
      )
    }
    if (page === 'student-live') {
      return (
        <>
          <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
            <StudentLiveQuestion avatar={avatar} onFinish={() => setPage('student-score')} />
          </div>
          <Toast toasts={toasts} onRemove={removeToast} />
        </>
      )
    }
    if (page === 'student-score') {
      return (
        <>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <StudentScore avatar={avatar} onHome={() => setPage('student-home')} />
          </div>
          <Toast toasts={toasts} onRemove={removeToast} />
        </>
      )
    }

    return (
      <>
        <StudentLayout>
          {page === 'student-home' && <StudentHome userName={userName || 'Student'} avatar={avatar} onNav={nav} />}
          {page === 'student-join' && <StudentJoinQuiz onJoin={() => setPage('student-avatar')} />}
          {page === 'student-history' && <StudentHistory />}
          {page === 'student-profile' && <StudentProfile userName={userName || 'Student'} avatar={avatar} onLogout={logout} />}
        </StudentLayout>
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    )
  }

  // Guest pages
  if (page === 'guest-live') {
    return (
      <>
        <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
          <StudentLiveQuestion avatar={avatar} onFinish={() => setPage('guest-score')} />
        </div>
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    )
  }

  if (page === 'guest-score') {
    return (
      <>
        <GuestPostQuiz
          nickname={userName || 'Guest'}
          avatar={avatar}
          onRegister={() => setPage('student-login')}
          onPlayAgain={() => setPage('guest-entry')}
        />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    )
  }

  return <RoleSelect onSelect={() => setPage('role-select')} />
}
