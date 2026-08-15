import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getMyQuizzes, type TeacherStatsDTO } from '@/services/quizService'
import type { QCMDTO } from '@/types'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { sessionService } from '@/services/sessionService'

const fallbackWeekData = [
  { day: 'Mon', sessions: 2 }, { day: 'Tue', sessions: 3 },
  { day: 'Wed', sessions: 1 }, { day: 'Thu', sessions: 4 },
  { day: 'Fri', sessions: 3 }, { day: 'Sat', sessions: 0 }, { day: 'Sun', sessions: 0 },
]

interface Props {
  userName: string
  onNav: (page: string) => void
}

export default function TeacherDashboard({ userName, onNav }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [launchingId, setLaunchingId] = useState<number | null>(null)

const handleStartLive = async (quizId?: number) => {
  // Si aucun quizId : prendre le premier quiz publié
  const targetId = quizId ?? quizzes.find(q => q.publie)?.id
  if (!targetId) {
    alert('Publie d\'abord un quiz, ou choisis-en un dans Quizzes.')
    navigate('/teacher/quizzes')
    return
  }
  setLaunchingId(targetId)
  try {
    const session = await sessionService.create({
      qcmId: targetId,
      createdBy: user?.id ?? 1,
      mode: 'LIVE',
      nombreMaxParticipants: 30,
    })
    navigate(`/teacher/sessions/${session.id}/live`)
  } catch {
    alert('Impossible de lancer la session live')
  } finally {
    setLaunchingId(null)
  }
}
  const [quizzes, setQuizzes] = useState<QCMDTO[]>([])
  const [loading, setLoading] = useState(true)

  const displayName = user ? `${user.prenom} ${user.nom}` : userName

  useEffect(() => {
    getMyQuizzes()
      .then(data => { setQuizzes(data); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [])

  const published = quizzes.filter(q => q.publie).length
  const totalQuestions = quizzes.reduce((acc, q) => acc + (q.nombreQuestions || 0), 0)

  const kpis = [
    { label: 'Active Quizzes', val: loading ? '…' : published.toString(), icon: '📝', color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Total Quizzes', val: loading ? '…' : quizzes.length.toString(), icon: '📚', color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Total Questions', val: loading ? '…' : totalQuestions.toString(), icon: '❓', color: '#16A34A', bg: '#F0FDF4' },
    { label: 'Students Reached', val: '—', icon: '👥', color: '#D97706', bg: '#FFFBEB' },
  ]

  return (
    <div className="animate-fade-in dashboard-shell" style={{ padding: 28, minHeight: '100%' }}>
      <div className="dashboard-hero" style={{ padding: '24px 30px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 280 }}>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Teacher dashboard</p>
            <h2 style={{ margin: '12px 0 8px', fontFamily: 'Outfit, sans-serif', fontSize: 30, fontWeight: 800 }}>{displayName} 👋</h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.88)', fontSize: 14, lineHeight: 1.75 }}>Manage your quizzes, start live sessions, and monitor student progress from a clean, focused workspace.</p>
          </div>
          <button
  onClick={() => handleStartLive()}
  disabled={launchingId !== null}
  className="action-button"
  style={{ border: 'none', background: '#fff', color: '#2563EB', minWidth: 190, fontSize: 15 }}
>
  {launchingId !== null ? 'Lancement…' : '🚀 Start Live Session'}
</button>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-4" style={{ marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} className="dashboard-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 12, color: '#64748B', fontWeight: 700 }}>{k.label}</p>
                <p style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, color: '#0F172A' }}>{k.val}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{k.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid dashboard-grid-2" style={{ gap: 16, marginBottom: 24 }}>
        <div className="dashboard-card" style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Sessions This Week</h3>
          <p style={{ margin: '0 0 18px', color: '#64748B', fontSize: 13 }}>Live session trend and attendance preview.</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={fallbackWeekData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 13 }} />
              <Bar dataKey="sessions" fill="#2563EB" radius={[6, 6, 0, 0]} name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Quick Actions</h3>
            <span style={{ color: '#64748B', fontSize: 13 }}>Access teaching tools fast.</span>
          </div>
          {[
            { icon: '➕', label: 'Create New Quiz', desc: 'Build a quiz from scratch', action: () => navigate('/teacher/quiz-create'), bg: '#EFF6FF' },
            { icon: '🤖', label: 'AI Generation', desc: 'Generate quiz from PDF/document', action: () => navigate('/teacher/documents'), bg: '#F5F3FF' },
            { icon: '📊', label: 'View Statistics', desc: 'Analyse student performance', action: () => navigate('/teacher/stats'), bg: '#ECFDF5' },
          ].map(a => (
            <button key={a.label} onClick={a.action} className="action-button" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{a.icon}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{a.label}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{a.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Recent Quizzes — Quick Start</h3>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748B' }}>Access your latest drafts and published activities.</p>
          </div>
          <button onClick={() => navigate('/teacher/quizzes')} className="action-button" style={{ border: 'none', background: '#EFF6FF', color: '#2563EB', minWidth: 130 }}>View all</button>
        </div>
        <div style={{ padding: 16, display: 'grid', gap: 12 }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#64748B' }}>Loading quizzes…</div>
          ) : quizzes.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#64748B' }}>
              No quizzes yet.
              <button onClick={() => navigate('/teacher/quiz-create')} style={{ marginLeft: 8, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Create your first quiz →</button>
            </div>
          ) : (
            quizzes.slice(0, 4).map((q, i) => (
              <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#F8FAFC', borderRadius: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{'📝'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{q.titre}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{q.matiere || 'No subject'} · {q.nombreQuestions} questions · {q.mode}</div>
                </div>
                <span style={{ background: q.publie ? '#ECFDF5' : '#FEF3C7', color: q.publie ? '#16A34A' : '#D97706', borderRadius: 999, padding: '6px 12px', fontSize: 12, fontWeight: 700 }}>{q.publie ? 'Published' : 'Draft'}</span>
                <button
  onClick={() => handleStartLive(q.id)}
  disabled={launchingId === q.id || !q.publie}
  className="action-button"
  style={{
    border: 'none',
    background: q.publie ? '#2563EB' : '#94A3B8',
    color: '#fff',
    borderRadius: 12,
    padding: '10px 18px',
    fontWeight: 700,
    cursor: q.publie ? 'pointer' : 'not-allowed',
  }}
>
  {launchingId === q.id ? '…' : '▶ Start'}
</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
