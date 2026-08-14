import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '@/services/api'

type Answer = { id: number; texte: string; option?: string }
type Question = { id: number; texte: string; type: string; mediaUrl?: string; mediaType?: string; explication?: string; reponses: Answer[] }
type Quiz = { id: number; titre: string; description?: string; matiere?: string; questions: Question[] }

export default function TrainingQuiz() {
  const { quizId } = useParams(); const navigate = useNavigate()
  const [quiz, setQuiz] = useState<Quiz | null>(null); const [answers, setAnswers] = useState<Record<number, number[]>>({}); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  useEffect(() => { api.get(`/student/training/${quizId}`).then(r => setQuiz(r.data)).catch(e => setError(e.response?.data?.message || 'Unable to load quiz')).finally(() => setLoading(false)) }, [quizId])
  const toggle = (questionId: number, answerId: number, multiple: boolean) => setAnswers(prev => { const current = prev[questionId] || []; const next = multiple ? (current.includes(answerId) ? current.filter(id => id !== answerId) : [...current, answerId]) : [answerId]; return { ...prev, [questionId]: next } })
  const submit = async () => { if (!quiz) return; try { const result = await api.post(`/student/training/${quiz.id}/attempts`, { reponses: quiz.questions.map(q => ({ questionId: q.id, reponseIds: answers[q.id] || [] })) }); navigate('/student/training/result', { state: { result: result.data } }) } catch (e: any) { setError(e.response?.data?.message || 'Unable to submit') } }
  if (loading) return <div style={{ padding: 32 }}>Loading training quiz…</div>
  if (!quiz) return <div style={{ padding: 32, color: '#DC2626' }}>{error || 'Quiz not found'}</div>
  return <div style={{ padding: 28, maxWidth: 900, margin: '0 auto' }}>
    <button onClick={() => navigate('/student/training')} style={{ border: 0, background: 'none', color: '#2563EB', cursor: 'pointer' }}>← Back to training</button>
    <h1 style={{ color: '#0F172A' }}>{quiz.titre}</h1><p style={{ color: '#64748B' }}>{quiz.matiere || 'Practice'} · {quiz.questions.length} questions</p>
    {error && <p style={{ color: '#DC2626' }}>{error}</p>}
    {quiz.questions.map((q, index) => <section key={q.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, margin: '16px 0' }}>
      <h3 style={{ color: '#0F172A' }}>{index + 1}. {q.texte}</h3>
      {q.mediaUrl && (q.mediaType === 'VIDEO' ? <video src={q.mediaUrl} controls style={{ maxWidth: '100%', maxHeight: 280 }} /> : <img src={q.mediaUrl} alt="Question media" style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain' }} />)}
      <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>{q.reponses.map(a => <button key={a.id} onClick={() => toggle(q.id, a.id, q.type === 'CHOIX_MULTIPLE')} style={{ textAlign: 'left', padding: 12, borderRadius: 9, border: `2px solid ${(answers[q.id] || []).includes(a.id) ? '#2563EB' : '#E2E8F0'}`, background: (answers[q.id] || []).includes(a.id) ? '#EFF6FF' : '#fff', cursor: 'pointer' }}>{a.option && `${a.option}. `}{a.texte}</button>)}</div>
    </section>)}
    <button onClick={submit} style={{ width: '100%', padding: 14, border: 0, borderRadius: 10, background: '#16A34A', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Submit training quiz</button>
  </div>
}
