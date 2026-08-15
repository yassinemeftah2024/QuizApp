import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { sessionService, type SessionResponse } from '@/services/sessionService'
import { wsService } from '@/services/websocket'
import './LiveSession.css'

interface Participant {
  id: number
  pseudonyme: string
  scoreTotal?: number
}

const getStatusLabel = (status: SessionResponse['statut']) => {
  if (status === 'EN_COURS') return 'En cours'
  if (status === 'TERMINEE') return 'Terminée'
  if (status === 'ANNULEE') return 'Annulée'
  return 'Lobby'
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
      // Silencieux: le WebSocket peut mettre la liste à jour ensuite.
    }
  }, [sessionId])

  useEffect(() => {
    loadSession()
    loadParticipants()

    wsService.connect(
      () => {
        console.log('WS prêt pour la session', sessionId)

        wsService.subscribe(`/topic/session/${sessionId}/participants`, (data) => {
          if (Array.isArray(data)) {
            setParticipants(data as Participant[])
          }
        })

        wsService.subscribe(`/topic/session/${sessionId}/leaderboard`, (data) => {
          if (Array.isArray(data)) {
            setParticipants(data as Participant[])
          }
        })
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
      <div className="teacher-live-page teacher-live-page--center">
        <div className="teacher-live-loader" aria-label="Chargement de la session" />
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="teacher-live-page teacher-live-page--center">
        <div className="teacher-live-empty">
          <div className="teacher-live-empty__icon" aria-hidden="true">!</div>
          <h1>Session indisponible</h1>
          <p>{error || 'Session introuvable'}</p>
          <button className="teacher-live-secondary" onClick={() => navigate('/teacher/quizzes')}>
            Retour aux quiz
          </button>
        </div>
      </div>
    )
  }

  const joinUrl = `${window.location.origin}/join/${session.codePIN}`
  const sortedParticipants = [...participants].sort(
    (a, b) => (b.scoreTotal ?? 0) - (a.scoreTotal ?? 0)
  )
  const isLobby = session.statut === 'PLANIFIEE'
  const isLive = session.statut === 'EN_COURS'
  const isDone = session.statut === 'TERMINEE'
  const currentQuestion = (session.currentQuestionIndex ?? 0) + 1

  return (
    <div className="teacher-live-page animate-fade-in">
      <header className="teacher-live-header">
        <button className="teacher-live-back" onClick={() => navigate('/teacher/quizzes')}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18 9 12l6-6" />
          </svg>
          <span>Retour</span>
        </button>

        <div className="teacher-live-title">
          <span className={`teacher-live-status teacher-live-status--${session.statut.toLowerCase()}`}>
            {getStatusLabel(session.statut)}
          </span>
          <h1>Session live #{session.id}</h1>
        </div>

        <div className="teacher-live-count">
          <span>{participants.length}</span>
          joueur{participants.length > 1 ? 's' : ''}
        </div>
      </header>

      <main className="teacher-live-grid">
        <section className="teacher-live-stage">
          <div className="teacher-live-pin-card" onClick={handleCopyPin} title="Cliquer pour copier le PIN">
            <div className="teacher-live-pin-card__top">
              <span>{copied ? 'PIN copié' : 'Code PIN'}</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </div>
            <strong>{session.codePIN}</strong>
            <p>Les élèves rejoignent sur <span>/join</span> ou via le QR code.</p>
          </div>

          <div className="teacher-live-controls">
            {isLobby && (
              <button className="teacher-live-primary" onClick={handleStart} disabled={starting}>
                <span>{starting ? 'Démarrage...' : 'Lancer la session'}</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m8 5 11 7-11 7V5Z" />
                </svg>
              </button>
            )}

            {isLive && (
              <>
                <div className="teacher-live-question">
                  <span>Question active</span>
                  <strong>{currentQuestion}</strong>
                </div>
                <button className="teacher-live-primary" onClick={handleNextQuestion}>
                  Question suivante
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
                <button className="teacher-live-secondary teacher-live-secondary--danger" onClick={handleFinish}>
                  Terminer
                </button>
              </>
            )}

            {isDone && (
              <button className="teacher-live-primary" onClick={() => navigate(`/results/${session.id}`)}>
                Voir le podium
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                  <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
                  <path d="M17 5h3a2 2 0 0 1-2 2h-1" />
                  <path d="M7 5H4a2 2 0 0 0 2 2h1" />
                </svg>
              </button>
            )}
          </div>

          <div className="teacher-live-qr-card">
            <div>
              <span>Accès rapide</span>
              <h2>QR code de la session</h2>
              <p>{joinUrl}</p>
            </div>
            <div className="teacher-live-qr">
              <QRCodeSVG value={joinUrl} size={178} level="M" bgColor="#ffffff" fgColor="#0d0221" />
            </div>
          </div>
        </section>

        <aside className="teacher-live-leaderboard">
          <div className="teacher-live-leaderboard__head">
            <div>
              <span>Temps réel</span>
              <h2>Classement</h2>
            </div>
            <strong>{participants.length}</strong>
          </div>

          {sortedParticipants.length === 0 ? (
            <div className="teacher-live-waiting">
              <div aria-hidden="true">...</div>
              <h3>En attente de joueurs</h3>
              <p>Projette le PIN ou le QR code pour remplir le lobby.</p>
            </div>
          ) : (
            <div className="teacher-live-player-list">
              {sortedParticipants.map((participant, index) => (
                <div className="teacher-live-player" key={participant.id} style={{ animationDelay: `${index * 45}ms` }}>
                  <span className="teacher-live-rank">{index + 1}</span>
                  <span className="teacher-live-avatar">{participant.pseudonyme.charAt(0).toUpperCase()}</span>
                  <span className="teacher-live-name">{participant.pseudonyme}</span>
                  <strong>{Math.round(participant.scoreTotal ?? 0)} pts</strong>
                </div>
              ))}
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}

export default LiveSession
