import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { sessionService, type SessionResponse } from '@/services/sessionService'
import { wsService } from '@/services/websocket'

interface Participant {
  id: number
  pseudonyme: string
  scoreTotal?: number
}

function LiveSession() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [session, setSession] = useState<SessionResponse | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const sessionId = Number(id)

  const loadSession = useCallback(async () => {
    try {
      const data = await sessionService.getById(sessionId)
      setSession(data)
    } catch {
      setError('Impossible de charger la session')
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  const loadParticipants = useCallback(async () => {
    try {
      const data = await sessionService.getParticipants(sessionId)
      setParticipants(Array.isArray(data) ? data : [])
    } catch {
      // silencieux
    }
  }, [sessionId])

  // Chargement initial + WebSocket
  useEffect(() => {
    loadSession()
    loadParticipants()

    wsService.connect(
      () => {
        console.log('WS prêt pour la session', sessionId)

        wsService.subscribe(
          `/topic/session/${sessionId}/participants`,
          (data) => {
            if (Array.isArray(data)) {
              setParticipants(data as Participant[])
            }
          }
        )

        wsService.subscribe(
          `/topic/session/${sessionId}/leaderboard`,
          (data) => {
            if (Array.isArray(data)) {
              setParticipants(data as Participant[])
            }
          }
        )
      },
      (err) => {
        console.error('Erreur WS:', err)
      }
    )

    return () => {
      wsService.disconnect()
    }
  }, [sessionId, loadSession, loadParticipants])

  const handleStart = async () => {
    if (!session) return
    setStarting(true)
    try {
      const updated = await sessionService.start(session.id)
      setSession(updated)
      wsService.send(`/app/session/${session.id}/start`, {})
    } catch {
      setError('Impossible de démarrer la session')
    } finally {
      setStarting(false)
    }
  }

  const handleNextQuestion = async () => {
    if (!session) return
    try {
      const updated = await sessionService.nextQuestion(session.id)
      setSession(updated)
      wsService.send(`/app/session/${session.id}/next-question`, {})
    } catch {
      setError('Impossible de passer à la question suivante')
    }
  }

  const handleFinish = async () => {
    if (!session) return
    try {
      const updated = await sessionService.finish(session.id)
      setSession(updated)
      navigate(`/results/${session.id}`)
    } catch {
      setError('Impossible de terminer la session')
    }
  }

  const handleCopyPin = () => {
    if (!session) return
    navigator.clipboard.writeText(session.codePIN)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="layout-desktop">
        <div
          className="main-content"
          style={{
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="skeleton" style={{ width: 200, height: 40 }} />
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="layout-desktop">
        <div className="main-content" style={{ padding: '2rem' }}>
          <p style={{ color: 'var(--error)' }}>{error || 'Session introuvable'}</p>
          <button className="btn-secondary" onClick={() => navigate('/teacher/quizzes')}>
            Retour
          </button>
        </div>
      </div>
    )
  }

  const joinUrl = `${window.location.origin}/join/${session.codePIN}`

  const sortedParticipants = [...participants].sort(
    (a, b) => (b.scoreTotal ?? 0) - (a.scoreTotal ?? 0)
  )

  return (
    <div className="layout-desktop">
      <div className="main-content" style={{ padding: 0 }}>
        {/* Header */}
        <div className="topbar" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem' }}
              onClick={() => navigate('/teacher/quizzes')}
            >
              ← Retour
            </button>
            <span className="badge-live">
              {session.statut === 'EN_COURS'
                ? 'EN COURS'
                : session.statut === 'TERMINEE'
                ? 'TERMINÉE'
                : 'LOBBY'}
            </span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Session #{session.id}
          </div>
        </div>

        {/* Contenu */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            padding: '2rem',
            minHeight: 'calc(100vh - var(--header-height))',
          }}
        >
          {/* Colonne gauche */}
          <div
            className="animate-fade-in"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            {/* PIN */}
            <div
              className="card"
              onClick={handleCopyPin}
              title="Cliquer pour copier le PIN"
              style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                background:
                  'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.1))',
                border: '1px solid rgba(79,70,229,0.3)',
                cursor: 'pointer',
              }}
            >
              <p
                style={{
                  color: 'var(--text-muted)',
                  marginBottom: '0.75rem',
                  fontSize: '0.9375rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {copied ? '✓ PIN copié !' : 'Code PIN — cliquer pour copier'}
              </p>
              <h1
                style={{
                  fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
                  letterSpacing: '0.2em',
                  background: 'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'var(--font-display)',
                  marginBottom: '0.5rem',
                }}
              >
                {session.codePIN}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                Les joueurs rejoignent sur{' '}
                <strong style={{ color: 'var(--accent-cyan)' }}>/join</strong>
              </p>
            </div>

            {/* QR */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '2rem',
              }}
            >
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Scanner pour rejoindre
              </p>
              <div
                style={{
                  background: 'white',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                <QRCodeSVG
                  value={joinUrl}
                  size={200}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#0a0e1a"
                />
              </div>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.8125rem',
                  wordBreak: 'break-all',
                  textAlign: 'center',
                }}
              >
                {joinUrl}
              </p>
            </div>

            {/* Actions */}
            {session.statut === 'PLANIFIEE' && (
              <button
                className="btn-primary"
                onClick={handleStart}
                disabled={starting}
                style={{ padding: '1.25rem 2rem', fontSize: '1.125rem' }}
              >
                {starting
                  ? 'Démarrage...'
                  : `🚀 Lancer la session (${participants.length} joueur${
                      participants.length > 1 ? 's' : ''
                    })`}
              </button>
            )}

            {session.statut === 'EN_COURS' && (
              <div
                className="card"
                style={{ textAlign: 'center', borderColor: 'var(--accent-cyan)' }}
              >
                <span className="badge-live">EN COURS</span>
                <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>
                  Question {(session.currentQuestionIndex ?? 0) + 1}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <button className="btn-primary" onClick={handleNextQuestion}>
                    Question suivante →
                  </button>
                  <button className="btn-secondary" onClick={handleFinish}>
                    Terminer
                  </button>
                </div>
              </div>
            )}

            {session.statut === 'TERMINEE' && (
              <div className="card" style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Session terminée
                </p>
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/results/${session.id}`)}
                >
                  Voir le podium 🏆
                </button>
              </div>
            )}
          </div>

          {/* Classement */}
          <div
            className="card animate-slide-in"
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100vh - var(--header-height) - 4rem)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <h3 style={{ fontSize: '1.125rem' }}>Classement</h3>
              <span
                style={{
                  background: 'rgba(6,182,212,0.15)',
                  color: 'var(--accent-cyan)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                {participants.length}
              </span>
            </div>

            {sortedParticipants.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  gap: '0.75rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem' }}>👀</div>
                <p>En attente de joueurs...</p>
                <p style={{ fontSize: '0.8125rem' }}>Partage le PIN ou le QR code</p>
              </div>
            ) : (
              <div
                style={{
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {sortedParticipants.map((p, index) => (
                  <div
                    key={p.id}
                    className="animate-scale-in"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        textAlign: 'center',
                        fontWeight: 800,
                        color:
                          index === 0
                            ? '#fbbf24'
                            : index === 1
                            ? '#94a3b8'
                            : index === 2
                            ? '#cd7c3a'
                            : 'var(--text-muted)',
                      }}
                    >
                      {index + 1}
                    </span>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'var(--accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                      }}
                    >
                      {p.pseudonyme.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500, flex: 1 }}>{p.pseudonyme}</span>
                    <span
                      style={{
                        color: 'var(--accent-cyan)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                      }}
                    >
                      {Math.round(p.scoreTotal ?? 0)} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveSession