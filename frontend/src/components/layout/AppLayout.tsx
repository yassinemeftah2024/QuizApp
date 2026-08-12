import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '../Sidebar'
import TopBar from '../TopBar'
import MobileNav from '../MobileNav'

// Maps React Router paths to Figma's "current" page identifiers
const pathToPageKey = (path: string, role: string) => {
  if (role === 'ADMIN') {
    if (path === '/admin') return 'admin-dashboard'
    if (path === '/admin/users') return 'admin-users'
    if (path === '/admin/classes') return 'admin-classes'
    if (path === '/admin/settings') return 'admin-settings'
    if (path === '/admin/profile') return 'admin-profile'
    return 'admin-dashboard'
  }
  if (role === 'ENSEIGNANT') {
    if (path === '/teacher') return 'teacher-dashboard'
    if (path === '/teacher/quizzes') return 'teacher-quizzes'
    if (path === '/teacher/question-bank') return 'teacher-question-bank'
    if (path === '/teacher/classes') return 'teacher-classes'
    if (path === '/teacher/live') return 'teacher-live'
    if (path === '/teacher/documents') return 'teacher-documents'
    if (path === '/teacher/stats') return 'teacher-stats'
    if (path === '/teacher/settings') return 'teacher-settings'
    if (path === '/teacher/profile') return 'teacher-profile'
    return 'teacher-dashboard'
  }
  if (role === 'ETUDIANT') {
    if (path === '/student') return 'student-dashboard'
    if (path === '/student/subjects') return 'student-subjects'
    if (path === '/student/training') return 'student-training'
    if (path === '/student/join') return 'student-join'
    if (path === '/student/history') return 'student-history'
    if (path === '/student/profile') return 'student-profile'
    return 'student-dashboard'
  }
  return 'student-home'
}

export const AdminTeacherLayout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const role = user?.role || 'ETUDIANT'
  const isTeacher = role === 'ENSEIGNANT'
  
  const currentKey = pathToPageKey(location.pathname, role)
  
  const handleNav = (key: string) => {
    if (key === 'admin-dashboard') navigate('/admin')
    else if (key === 'admin-users') navigate('/admin/users')
    else if (key === 'admin-classes') navigate('/admin/classes')
    else if (key === 'admin-settings') navigate('/admin/settings')
    else if (key === 'admin-profile') navigate('/admin/profile')
    else if (key === 'teacher-dashboard') navigate('/teacher')
    else if (key === 'teacher-quizzes') navigate('/teacher/quizzes')
    else if (key === 'teacher-question-bank') navigate('/teacher/question-bank')
    else if (key === 'teacher-classes') navigate('/teacher/classes')
    else if (key === 'teacher-live') navigate('/teacher/live')
    else if (key === 'teacher-documents') navigate('/teacher/documents')
    else if (key === 'teacher-stats') navigate('/teacher/stats')
    else if (key === 'teacher-settings') navigate('/teacher/settings')
    else if (key === 'teacher-profile') navigate('/teacher/profile')
    else if (key === 'student-dashboard') navigate('/student')
    else if (key === 'student-subjects') navigate('/student/subjects')
    else if (key === 'student-training') navigate('/student/training')
    else if (key === 'student-join') navigate('/student/join')
    else if (key === 'student-history') navigate('/student/history')
    else if (key === 'student-profile') navigate('/student/profile')
  }

  const userName = user ? `${user.prenom} ${user.nom}` : 'User'
  const userRoleStr = isTeacher ? 'Teacher' : 'Administrator'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar
        role={isTeacher ? 'teacher' : 'admin'}
        current={currentKey}
        onNav={handleNav}
        onLogout={logout}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100vh' }} className="light-dashboard dashboard-shell">
        <TopBar
          current={currentKey}
          userName={userName}
          userRole={userRoleStr}
          onLogout={logout}
        />
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export const StudentLayout = () => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const currentKey = pathToPageKey(location.pathname, 'ETUDIANT')
  
  const handleNav = (key: string) => {
    if (key === 'student-home' || key === 'student-dashboard') navigate('/student')
    else if (key === 'student-subjects') navigate('/student/subjects')
    else if (key === 'student-training') navigate('/student/training')
    else if (key === 'student-join') navigate('/student/join')
    else if (key === 'student-history') navigate('/student/history')
    else if (key === 'student-profile') navigate('/student/profile')
  }

  const userName = user ? `${user.prenom} ${user.nom}` : 'Student'
  return <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
    <Sidebar role="student" current={currentKey} onNav={handleNav} onLogout={() => { localStorage.clear(); window.location.href = '/login/student' }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="light-dashboard dashboard-shell">
      <TopBar current={currentKey} userName={userName} userRole="Student" onLogout={() => { localStorage.clear(); window.location.href = '/login/student' }} />
      <main style={{ flex: 1, overflow: 'auto' }}><Outlet /></main>
    </div>
  </div>
}
