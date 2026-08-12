import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import { AdminTeacherLayout, StudentLayout } from '@/components/layout/AppLayout'

// Figma Pages
import RoleSelect from '@/pages/RoleSelect'
import { AdminLoginWrapper, TeacherLoginWrapper, StudentLoginWrapper } from '@/pages/auth/AuthWrappers'

import AdminDashboard from '@/pages/admin/Dashboard'
import AdminUsers from '@/pages/admin/Users'
import AdminAcademicStructure from '@/pages/admin/AdminDashboard'
import AdminSettings from '@/pages/admin/Settings'

import TeacherDashboard from '@/pages/teacher/Dashboard'
import TeacherQuizList from '@/pages/teacher/QuizList'
import TeacherQuizCreate from '@/pages/teacher/QuizCreate'
import TeacherDocuments from '@/pages/teacher/Documents'
import TeacherLiveSession from '@/pages/teacher/LiveSession'
import TeacherResults from '@/pages/teacher/Results'
import TeacherSettings from '@/pages/teacher/Settings'
import TeacherClasses from '@/pages/teacher/Classes'
import TeacherQuestionBank from '@/pages/teacher/QuestionBank'

import StudentHome from '@/pages/student/Home'
import StudentHistory from '@/pages/student/History'
import ProfilePage from '@/pages/profile/ProfilePage'
import StudentJoinQuiz from '@/pages/student/JoinQuiz'
import AvatarSelect from '@/pages/student/AvatarSelect'
import LiveQuestion from '@/pages/student/LiveQuestion'
import StudentScore from '@/pages/student/Score'
import StudentSubjects from '@/pages/student/Subjects'
import StudentTraining from '@/pages/student/Training'
import StudentTrainingQuiz from '@/pages/student/TrainingQuiz'
import StudentTrainingResult from '@/pages/student/TrainingResult'

import GuestEntry from '@/pages/guest/Entry'
import GuestPostQuiz from '@/pages/guest/PostQuiz'

// Simple Wrapper to pass navigate down
const RoleSelectWrapper = () => {
  const navigate = useNavigate()
  return <RoleSelect onSelect={(role) => {
    if (role === 'guest') navigate('/guest')
    else navigate(`/login/${role}`)
  }} />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RoleSelectWrapper />} />
          <Route path="/guest" element={<GuestEntry onJoin={() => {}} onBack={() => {}} onRegister={() => {}} />} />
          <Route path="/login/admin" element={<AdminLoginWrapper />} />
          <Route path="/login/teacher" element={<TeacherLoginWrapper />} />
          <Route path="/login/student" element={<StudentLoginWrapper />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTeacherLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers onToast={() => {}} />} />
            <Route path="classes" element={<AdminAcademicStructure />} />
            <Route path="settings" element={<AdminSettings onToast={() => {}} />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Teacher Routes */}
          <Route path="/teacher" element={<ProtectedRoute allowedRoles={['ENSEIGNANT']}><AdminTeacherLayout /></ProtectedRoute>}>
            <Route index element={<TeacherDashboard userName="Teacher" onNav={() => {}} />} />
            <Route path="quizzes" element={<TeacherQuizList onNav={() => {}} onToast={() => {}} />} />
            <Route path="question-bank" element={<TeacherQuestionBank />} />
            <Route path="quiz-create" element={<TeacherQuizCreate onBack={() => {}} onToast={() => {}} />} />
            <Route path="quiz-create/:quizId" element={<TeacherQuizCreate onBack={() => {}} onToast={() => {}} />} />
            <Route path="documents" element={<TeacherDocuments onToast={() => {}} />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="live" element={<TeacherLiveSession onNav={() => {}} onToast={() => {}} />} />
            <Route path="stats" element={<TeacherResults onToast={() => {}} />} />
            <Route path="settings" element={<TeacherSettings onToast={() => {}} />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['ETUDIANT']}><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentHome onNav={() => {}} />} />
            <Route path="join" element={<StudentJoinQuiz onJoin={() => {}} />} />
            <Route path="subjects" element={<StudentSubjects />} />
            <Route path="training" element={<StudentTraining />} />
            <Route path="training/:quizId" element={<StudentTrainingQuiz />} />
            <Route path="training/result" element={<StudentTrainingResult />} />
            <Route path="history" element={<StudentHistory />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Fullscreen Student Routes */}
          <Route path="/student/avatar" element={<ProtectedRoute allowedRoles={['ETUDIANT']}><AvatarSelect onConfirm={() => {}} /></ProtectedRoute>} />
          <Route path="/student/live" element={<ProtectedRoute allowedRoles={['ETUDIANT']}><LiveQuestion avatar={{emoji:'🦊', color:'#f00', name:'', nickname:''} as any} onFinish={() => {}} /></ProtectedRoute>} />
          <Route path="/student/score" element={<ProtectedRoute allowedRoles={['ETUDIANT']}><StudentScore avatar={{emoji:'🦊', color:'#f00', name:'', nickname:''} as any} onHome={() => {}} /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
