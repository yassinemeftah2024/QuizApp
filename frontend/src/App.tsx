import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// ─── Pages publiques ─────────────────────────────────────────────────
import LandingPage from '@/pages/public/LandingPage'

// ─── Pages Auth ──────────────────────────────────────────────────────
import LoginPage from '@/pages/auth/LoginPage'

// ─── Pages Admin ─────────────────────────────────────────────────────
import AdminDashboard from '@/pages/admin/AdminDashboard'

// ─── Pages Teacher ───────────────────────────────────────────────────
import QuizList from '@/pages/teacher/QuizList'
import QuizEditor from '@/pages/teacher/QuizEditor'
import LiveSession from '@/pages/teacher/LiveSession'

// ─── Pages Student + Guest (Mobile-first, responsive) ─────────────────
import StudentHome from '@/pages/student/StudentHome'
import JoinQuiz from '@/pages/student/JoinQuiz'
import AvatarSelection from '@/pages/student/AvatarSelection'
import LiveQuestion from '@/pages/student/LiveQuestion'
import QuizResults from '@/pages/student/QuizResults'
import HistoryBadges from '@/pages/student/HistoryBadges'
import ProfileSettings from '@/pages/student/ProfileSettings'

// ─── Guards ──────────────────────────────────────────────────────────
import ProtectedRoute from '@/components/layout/ProtectedRoute'

/**
 * App — Routeur principal QuizApp.
 *
 * Architecture responsive :
 * - Admin/Teacher → Desktop-first
 * - Student/Guest → Mobile-first (responsive 375px → 1440px)
 *
 * Student et Guest partagent les mêmes vues :
 *   /join, /avatar, /live/:sessionId, /results/:sessionId
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ═══════════════════════════════════════
            ROUTES PUBLIQUES
        ════════════════════════════════════════ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Routes partagées Etudiant + Invité (Mobile-first) */}
        <Route path="/join" element={<JoinQuiz />} />
        <Route path="/join/:pin" element={<JoinQuiz />} />
        <Route path="/avatar" element={<AvatarSelection />} />
        <Route path="/live/:sessionId" element={<LiveQuestion />} />
        <Route path="/results/:sessionId" element={<QuizResults />} />

        {/* ═══════════════════════════════════════
            ADMIN (Desktop-first)
        ════════════════════════════════════════ */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ═══════════════════════════════════════
            TEACHER (Desktop-first)
        ════════════════════════════════════════ */}
        <Route
          path="/teacher/quizzes"
          element={
            <ProtectedRoute allowedRoles={['ENSEIGNANT']}>
              <QuizList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/quizzes/new"
          element={
            <ProtectedRoute allowedRoles={['ENSEIGNANT']}>
              <QuizEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/quizzes/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['ENSEIGNANT']}>
              <QuizEditor />
            </ProtectedRoute>
          }
        />
        <Route
  path="/teacher/sessions/:id/live"
  element={<LiveSession />}
/>

        {/* ═══════════════════════════════════════
            STUDENT (Mobile-first)
        ════════════════════════════════════════ */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['ETUDIANT']}>
              <StudentHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/history"
          element={
            <ProtectedRoute allowedRoles={['ETUDIANT']}>
              <HistoryBadges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['ETUDIANT']}>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* ═══════════════════════════════════════
            FALLBACK
        ════════════════════════════════════════ */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
