import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sessionService } from '@/services/sessionService'

interface Participant {
  id: number
  pseudonyme: string
  scoreTotal?: number
}

function QuizResults() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await sessionService.getLeaderboard(Number(sessionId))
        const list = Array.isArray(data) ? data : []
        list.sort((a: Participant, b: Participant) => (b.scoreTotal ?? 0) - (a.scoreTotal ?? 0))
        setParticipants(list)
      } catch {
        // fallback
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [sessionId])

  const podium = participants.slice(0, 3)
  const rest = participants.slice(3)
  const medals = ['🥇', '🥈', '🥉']
  const heights = [140, 110, 90]

  if (loading) {
    return (
      <div className="layout-mobile layout-mobile-gradient">
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="skeleton" style={{ width: 200, height: 40 }} />
        </div>
      </div>
    )
  }

  return (
    <div className="layout-mobile layout-mobile-gradient">
      <div style={{ minHeight: '100vh', padding: '2rem 1.25rem', textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            marginBottom: '0.5rem',
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Classement final
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Bravo à tous les joueurs !</p>

        {/* Podium */}
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
            minHeight: 180,
          }}
        >
          {/* 2e */}
          {podium[1] && (
            <div style={{ flex: 1, maxWidth: 110 }}>
              <div style={{ fontSize: '1.75rem' }}>{medals[1]}</div>
              <div style={{
                fontWeight: 700,
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {podium[1].pseudonyme}
              </div>
              <div style={{
                height: heights[1],
                background: 'linear-gradient(180deg, #94a3b8, #64748b)',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '0.75rem',
                fontWeight: 800,
                color: 'white',
              }}>
                {Math.round(podium[1].scoreTotal ?? 0)}
              </div>
            </div>
          )}

          {/* 1er */}
          {podium[0] && (
            <div style={{ flex: 1, maxWidth: 120 }}>
              <div style={{ fontSize: '2.25rem' }}>{medals[0]}</div>
              <div style={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                marginBottom: '0.5rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {podium[0].pseudonyme}
              </div>
              <div style={{
                height: heights[0],
                background: 'linear-gradient(180deg, #fbbf24, #d97706)',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '0.75rem',
                fontWeight: 800,
                color: 'white',
                boxShadow: '0 0 24px rgba(251, 191, 36, 0.4)',
              }}>
                {Math.round(podium[0].scoreTotal ?? 0)}
              </div>
            </div>
          )}

          {/* 3e */}
          {podium[2] && (
            <div style={{ flex: 1, maxWidth: 110 }}>
              <div style={{ fontSize: '1.75rem' }}>{medals[2]}</div>
              <div style={{
                fontWeight: 700,
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {podium[2].pseudonyme}
              </div>
              <div style={{
                height: heights[2],
                background: 'linear-gradient(180deg, #cd7c3a, #9a5c28)',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '0.75rem',
                fontWeight: 800,
                color: 'white',
              }}>
                {Math.round(podium[2].scoreTotal ?? 0)}
              </div>
            </div>
          )}
        </div>

        {/* Reste du classement */}
        {rest.length > 0 && (
          <div className="card" style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
            {rest.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0',
                  borderBottom: i < rest.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <span style={{ width: 28, color: 'var(--text-muted)', fontWeight: 700 }}>{i + 4}</span>
                <span style={{ flex: 1, fontWeight: 500 }}>{p.pseudonyme}</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  {Math.round(p.scoreTotal ?? 0)} pts
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          className="btn-primary"
          style={{ marginTop: '2rem', minWidth: 200 }}
          onClick={() => navigate('/')}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}

export default QuizResults