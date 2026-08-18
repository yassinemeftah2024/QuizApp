import { useState, useEffect } from 'react'
import { getMyQuizzes, deleteQuiz, publishQuiz } from '@/services/quizService'
import type { QCMDTO } from '@/types'
import { useNavigate } from 'react-router-dom'
import { sessionService } from '@/services/sessionService'
import { useAuth } from '@/context/AuthContext'

interface Props {
  onNav: (page: string) => void
  onToast: (msg: string, type?: string) => void
}

export default function TeacherQuizList({ onNav, onToast }: Props) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState<QCMDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [search, setSearch] = useState('')
  const [launchingId, setLaunchingId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    getMyQuizzes()
      .then((data) => {
        setQuizzes(data)
        setLoading(false)
      })
      .catch(() => {
        onToast('Failed to load quizzes', 'error')
        setLoading(false)
      })
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = quizzes.filter((q) => {
    const matchFilter =
      filter === 'all' || (filter === 'published' ? q.publie : !q.publie)
    const matchSearch =
      q.titre.toLowerCase().includes(search.toLowerCase()) ||
      (q.matiere || '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this quiz permanently?')) return
    try {
      await deleteQuiz(id)
      setQuizzes((prev) => prev.filter((q) => q.id !== id))
      onToast('Quiz deleted', 'success')
    } catch {
      onToast('Failed to delete', 'error')
    }
  }

  const handlePublish = async (id: number) => {
    try {
      const updated = await publishQuiz(id)
      setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
      onToast('Quiz published! 🎉', 'success')
    } catch {
      onToast('Failed to publish', 'error')
    }
  }

  const handleStartLive = async (quizId: number) => {
    setLaunchingId(quizId)
    try {
      const targetQuiz = quizzes.find((q) => q.id === quizId)
      if (targetQuiz && !targetQuiz.publie) {
        await publishQuiz(quizId)
      }
      const session = await sessionService.create({
        qcmId: quizId,
        createdBy: user?.id ?? 1,
        mode: 'LIVE',
        nombreMaxParticipants: 30,
      })
      navigate(`/teacher/sessions/${session.id}/live`)
    } catch {
      onToast('Impossible de lancer la session live', 'error')
    } finally {
      setLaunchingId(null)
    }
  }

  const modeColor: Record<string, string> = {
    LIVE: '#2563EB',
    ENTRAINEMENT: '#16A34A',
    EXAMEN: '#DC2626',
    CHALLENGE: '#7C3AED',
    NORMAL: '#64748B',
  }

  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>
          {loading ? 'Loading…' : `${quizzes.length} quizzes in your library`}
        </p>
        <button
          onClick={() => navigate('/teacher/quiz-create')}
          style={{
            background: 'linear-gradient(90deg,#2563EB,#1D4ED8)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'Outfit, sans-serif',
          }}
        >
          <span style={{ fontSize: 18 }}>+</span> New Quiz
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {(
          [
            { v: 'all', l: 'All' },
            { v: 'published', l: 'Published' },
            { v: 'draft', l: 'Drafts' },
          ] as const
        ).map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            style={{
              padding: '7px 16px',
              borderRadius: 20,
              border: 'none',
              background: filter === f.v ? '#2563EB' : '#F1F5F9',
              color: filter === f.v ? '#fff' : '#64748B',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {f.l}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quizzes…"
          style={{
            flex: 1,
            minWidth: 200,
            padding: '8px 14px',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            fontSize: 13,
            outline: 'none',
            background: '#F8FAFC',
          }}
        />
      </div>

      {/* Quiz grid */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
            gap: 16,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: 20,
                border: '1px solid #E2E8F0',
                height: 160,
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            border: '2px dashed #DBEAFE',
            padding: 60,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <h3
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              margin: '0 0 8px',
              color: '#0F172A',
            }}
          >
            {search ? 'No quizzes found' : 'No quizzes yet'}
          </h3>
          <p style={{ color: '#64748B', margin: '0 0 20px' }}>
            {search
              ? 'Try a different search term'
              : 'Create your first quiz to get started'}
          </p>
          {!search && (
            <button
              onClick={() => navigate('/teacher/quiz-create')}
              style={{
                background: 'linear-gradient(90deg,#2563EB,#1D4ED8)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '10px 24px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              + Create Quiz
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
            gap: 16,
          }}
        >
          {filtered.map((q) => (
            <div
              key={q.id}
              className="card-hover"
              style={{
                background: '#fff',
                borderRadius: 14,
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  padding: '18px 18px 14px',
                  borderBottom: '1px solid #F1F5F9',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}
                  >
                    📝
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span
                      style={{
                        background: q.publie ? '#F0FDF4' : '#FFFBEB',
                        color: q.publie ? '#16A34A' : '#D97706',
                        borderRadius: 20,
                        padding: '2px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {q.publie ? '● Published' : '○ Draft'}
                    </span>
                    <span
                      style={{
                        background: `${modeColor[q.mode] || '#64748B'}15`,
                        color: modeColor[q.mode] || '#64748B',
                        borderRadius: 20,
                        padding: '2px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {q.mode}
                    </span>
                  </div>
                </div>
                <h3
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: 16,
                    margin: '8px 0 4px',
                    color: '#0F172A',
                    lineHeight: 1.3,
                  }}
                >
                  {q.titre}
                </h3>
                <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B' }}>
                  {q.matiere || 'No subject'} · {q.nombreQuestions} questions ·{' '}
                  {q.dureeMinutes || '—'}min
                </p>
                {q.description && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: '#94A3B8',
                      lineHeight: 1.4,
                    }}
                  >
                    {q.description}
                  </p>
                )}
              </div>

              {/* Card Actions */}
              <div
                style={{
                  padding: '12px 18px',
                  display: 'flex',
                  gap: 8,
                  background: '#FAFBFC',
                }}
              >
                <button
                  onClick={() => navigate(`/teacher/quiz-create/${q.id}`)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    background: '#fff',
                    color: '#2563EB',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                {!q.publie && (
                  <button
                    onClick={() => handlePublish(q.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      background: '#fff',
                      color: '#2563EB',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Publish ✓
                  </button>
                )}
                <button
                  onClick={() => handleStartLive(q.id)}
                  disabled={launchingId === q.id}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(90deg,#16A34A,#15803D)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: launchingId === q.id ? 'wait' : 'pointer',
                    fontFamily: 'Outfit, sans-serif',
                    opacity: launchingId === q.id ? 0.7 : 1,
                  }}
                >
                  {launchingId === q.id ? 'Lancement…' : '▶ Start Live'}
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    background: '#fff',
                    color: '#DC2626',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
