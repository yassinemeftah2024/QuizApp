import { useEffect, useState } from 'react'
import api from '@/services/api'
import { useNavigate } from 'react-router-dom'

interface Quiz { id: number; titre: string; matiere?: string; niveau?: string; nombreQuestions: number; dureeMinutes?: number }

export default function StudentTraining() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  useEffect(() => { api.get('/student/training').then(response => setQuizzes(response.data)).catch(() => setQuizzes([])) }, [])
  return <div style={{ padding: 28, background: '#F8FAFC', minHeight: '100%' }}>
    <h1 style={{ marginTop: 0, color: '#0F172A' }}>Training Mode</h1>
    <p style={{ color: '#64748B' }}>Practice with self-paced quizzes whenever you want.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
      {quizzes.map(quiz => <div key={quiz.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20 }}>
        <span style={{ color: '#7C3AED', fontWeight: 700 }}>{quiz.matiere || 'Practice'}</span><h3 style={{ color: '#0F172A' }}>{quiz.titre}</h3>
        <p style={{ color: '#64748B', fontSize: 13 }}>{quiz.nombreQuestions} questions {quiz.dureeMinutes ? `· ${quiz.dureeMinutes} min` : ''}</p>
        <button onClick={() => navigate(`/student/training/${quiz.id}`)} style={{ padding: '10px 16px', border: 0, borderRadius: 8, background: '#7C3AED', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Start training</button>
      </div>)}
      {quizzes.length === 0 && <p style={{ color: '#94A3B8' }}>No published training quizzes yet.</p>}
    </div>
  </div>
}
