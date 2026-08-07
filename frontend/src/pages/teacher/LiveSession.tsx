import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { sessionService, type SessionResponse } from '@/services/sessionService'

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

  useEffect(() => {
    loadSession()
    loadParticipants()
    const interval = setInterval(loadParticipants, 2000)
    return () => clearInterval(interval)
  }, [loadSession, loadParticipants])

  const handleStart = async () => {
    if (!session) return
    setStarting(true)
    try {
      const updated = await sessionService.start(session.id)
      setSession(updated)
    } catch {
      setError('Impossible de démarrer la session')
    } finally {
      setStarting(false)
    }
  }

  const handleFinish = async () => {
    if (!session) return
    try {
      const updated = await sessionService.finish(session.id)
      setSession(updated)
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
              {session.statut === 'EN_COURS' ? 'EN COURS' : 'LOBBY'}
            </span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Session #{session.id}
          </div>
        </div>

        {/* Contenu principal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            padding: '2rem',
            minHeight: 'calc(100vh - var(--header-height))',
          }}
        >
          {/* Colonne gauche : PIN + QR */}
          <div
            className="animate-fade-in"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            {/* Carte PIN (cliquable pour copier) */}
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

            {/* QR Code */}
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

            {/* Actions selon le statut */}
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
                  La session est démarrée — question{' '}
                  {(session.currentQuestionIndex ?? 0) + 1}
                </p>
                <button
                  className="btn-secondary"
                  style={{ marginTop: '1rem' }}
                  onClick={handleFinish}
                >
                  Terminer la session
                </button>
              </div>
            )}

            {session.statut === 'TERMINEE' && (
              <div className="card" style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Session terminée
                </p>
                <button
                  className="btn-primary"
                  style={{ marginTop: '1rem' }}
                  onClick={() => navigate('/teacher/quizzes')}
                >
                  Retour aux quiz
                </button>
              </div>
            )}
          </div>

          {/* Colonne droite : Participants */}
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
              <h3 style={{ fontSize: '1.125rem' }}>Participants</h3>
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

            {participants.length === 0 ? (
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
                {participants.map((p, index) => (
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
                    <span style={{ fontWeight: 500 }}>{p.pseudonyme}</span>
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