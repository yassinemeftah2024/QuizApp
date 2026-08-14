
import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sessionService, type SessionResponse } from '@/services/sessionService'
import api from '@/services/api'
import { wsService } from '@/services/websocket'

// ─── Questions de démo (en attendant l'API QCM de dev-a) ───────────────
const DEMO_QUESTIONS = [
  {
    id: 1,
    texte: 'Quelle est la capitale de la France ?',
    dureeSecondes: 20,
    reponses: [
      { id: 1, texte: 'Londres', correcte: false, option: 'A' },
      { id: 2, texte: 'Paris', correcte: true, option: 'B' },
      { id: 3, texte: 'Berlin', correcte: false, option: 'C' },
      { id: 4, texte: 'Madrid', correcte: false, option: 'D' },
    ],
  },
  {
    id: 2,
    texte: 'Combien font 2 + 2 ?',
    dureeSecondes: 15,
    reponses: [
      { id: 5, texte: '3', correcte: false, option: 'A' },
      { id: 6, texte: '4', correcte: true, option: 'B' },
      { id: 7, texte: '5', correcte: false, option: 'C' },
      { id: 8, texte: '22', correcte: false, option: 'D' },
    ],
  },
  {
    id: 3,
    texte: 'Quel langage tourne sur la JVM ?',
    dureeSecondes: 20,
    reponses: [
      { id: 9, texte: 'Python', correcte: false, option: 'A' },
      { id: 10, texte: 'Java', correcte: true, option: 'B' },
      { id: 11, texte: 'Ruby', correcte: false, option: 'C' },
      { id: 12, texte: 'PHP', correcte: false, option: 'D' },
    ],
  },
]

const KAHoot_COLORS = [
  { bg: '#e21b3c', hover: '#c41030' }, // Rouge
  { bg: '#1368ce', hover: '#0f5bb0' }, // Bleu
  { bg: '#d89e00', hover: '#b88400' }, // Jaune
  { bg: '#26890c', hover: '#1e6e09' }, // Vert
]

type Phase = 'waiting' | 'question' | 'answered' | 'finished'

function LiveQuestion() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const [session, setSession] = useState<SessionResponse | null>(null)
  const [phase, setPhase] = useState<Phase>('waiting')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const participationId = Number(localStorage.getItem('participationId') || 0)
  const pseudonyme = localStorage.getItem('pseudonyme') || 'Joueur'

  const currentQuestion = DEMO_QUESTIONS[questionIndex] || null

  const startTimer = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(seconds)
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const loadSession = useCallback(async () => {
    if (!sessionId) return
    try {
      const data = await sessionService.getById(Number(sessionId))
      setSession(data)

      if (data.statut === 'TERMINEE' || data.statut === 'ANNULEE') {
        setPhase('finished')
        return
      }

      const serverIndex = data.currentQuestionIndex ?? 0

      // Session vient de démarrer → passer en mode question
      if (data.statut === 'EN_COURS' && phase === 'waiting') {
        setQuestionIndex(serverIndex)
        setSelectedId(null)
        setPhase('question')
        startTimer(DEMO_QUESTIONS[serverIndex]?.dureeSecondes ?? 20)
        return
      }

      // L'enseignant a avancé (next-question) → nouvelle question
      if (
        data.statut === 'EN_COURS' &&
        (phase === 'question' || phase === 'answered') &&
        serverIndex > questionIndex
      ) {
        if (serverIndex >= DEMO_QUESTIONS.length) {
          setPhase('finished')
          return
        }
        setQuestionIndex(serverIndex)
        setSelectedId(null)
        setPhase('question')
        startTimer(DEMO_QUESTIONS[serverIndex]?.dureeSecondes ?? 20)
      }
    } catch {
      setError('Session introuvable')
    }
  }, [sessionId, phase, questionIndex])

  useEffect(() => {
    if (!sessionId) return
  
    // Chargement initial HTTP
    loadSession()
  
    // Connexion WebSocket
    wsService.connect(() => {
      const sid = sessionId
  
      // Session démarrée
      wsService.subscribe(`/topic/session/${sid}/status`, (data: any) => {
        console.log('[WS] status', data)
        if (data?.statut === 'EN_COURS') {
          setPhase('question')
          setQuestionIndex(0)
          setSelectedId(null)
          startTimer(DEMO_QUESTIONS[0]?.dureeSecondes ?? 20)
        }
        if (data?.statut === 'TERMINEE') {
          setPhase('finished')
        }
      })
  
      // Question suivante
      wsService.subscribe(`/topic/session/${sid}/question`, (data: any) => {
        console.log('[WS] question', data)
        const idx = data?.questionIndex ?? 0
        if (idx >= DEMO_QUESTIONS.length) {
          setPhase('finished')
          return
        }
        setQuestionIndex(idx)
        setSelectedId(null)
        setPhase('question')
        startTimer(DEMO_QUESTIONS[idx]?.dureeSecondes ?? 20)
      })
    })
  
    return () => {
      wsService.disconnect()
    }
  }, [sessionId]) // volontairement sans loadSession pour éviter reconnexions

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleAnswer = async (reponseId: number, correcte: boolean) => {
    if (phase !== 'question' || selectedId !== null) return
    if (timerRef.current) clearInterval(timerRef.current)

    setSelectedId(reponseId)
    setPhase('answered')

    const tempsReponse = Math.round((Date.now() - startTimeRef.current) / 1000)
    const points = correcte ? Math.max(100, 1000 - tempsReponse * 50) : 0
    if (correcte) setScore((s) => s + points)

    try {
      await api.post('/api/reponses', {
        participationId,
        questionId: currentQuestion?.id ?? 0,
        sessionId: Number(sessionId),
        choixSelectionnes: [reponseId],
        tempsReponse,
        scoreObtenu: points,
        estCorrecte: correcte,
      })
    } catch (err) {
      console.error('Erreur envoi réponse', err)
    }
  }

  // ─── WAITING ─────────────────────────────────────────────────────────
  if (phase === 'waiting') {
    return (
      <div className="layout-mobile layout-mobile-gradient">
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div className="animate-fade-in">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <h2 style={{ marginBottom: '0.5rem' }}>En attente...</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Salut <strong style={{ color: 'var(--accent-cyan)' }}>{pseudonyme}</strong> !<br />
              L'enseignant va bientôt démarrer.
            </p>
            <div className="badge-live">LOBBY</div>
          </div>
        </div>
      </div>
    )
  }

  // ─── FINISHED ────────────────────────────────────────────────────────
  if (phase === 'finished') {
    return (
      <div className="layout-mobile layout-mobile-gradient">
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div className="animate-scale-in card" style={{ maxWidth: 360, width: '100%', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏆</div>
            <h2 style={{ marginBottom: '0.5rem' }}>Session terminée !</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              Bravo <strong>{pseudonyme}</strong>
            </p>
            <p
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '1rem 0',
              }}
            >
              {score} pts
            </p>
            <button
  className="btn-primary"
  style={{ width: '100%' }}
  onClick={() => navigate(`/results/${sessionId}`)}
>
  Voir le classement 🏆
</button>
          </div>
        </div>
      </div>
    )
  }

  // ─── QUESTION / ANSWERED ─────────────────────────────────────────────
  if (!currentQuestion) {
    return (
      <div className="layout-mobile layout-mobile-gradient">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Plus de questions</p>
        </div>
      </div>
    )
  }

  const timerPercent = currentQuestion.dureeSecondes
    ? (timeLeft / currentQuestion.dureeSecondes) * 100
    : 0

  return (
    <div className="layout-mobile" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header timer + score */}
      <div
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Q{questionIndex + 1}/{DEMO_QUESTIONS.length}
          </span>
          <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{score} pts</div>
        </div>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: `4px solid ${timeLeft <= 5 ? 'var(--error)' : 'var(--accent-cyan)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
            fontFamily: 'var(--font-display)',
          }}
        >
          {timeLeft}
        </div>
        <div style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          {pseudonyme}
        </div>
      </div>

      {/* Barre de temps */}
      <div style={{ height: 6, background: 'var(--bg-tertiary)' }}>
        <div
          style={{
            height: '100%',
            width: `${timerPercent}%`,
            background: timeLeft <= 5 ? 'var(--error)' : 'var(--accent-gradient-h)',
            transition: 'width 1s linear',
          }}
        />
      </div>

      {/* Question */}
      <div style={{ padding: '1.5rem 1.25rem 1rem' }}>
        <div
          className="card animate-fade-in"
          style={{
            padding: '1.5rem',
            textAlign: 'center',
            minHeight: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2 style={{ fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', margin: 0 }}>
            {currentQuestion.texte}
          </h2>
        </div>
      </div>

      {/* Réponses Kahoot */}
      <div
        style={{
          padding: '0 1.25rem 2rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
        }}
      >
        {currentQuestion.reponses.map((r, i) => {
          const color = KAHoot_COLORS[i % 4]
          const isSelected = selectedId === r.id
          const showResult = phase === 'answered'
          const isCorrect = r.correcte

          let opacity = 1
          let border = 'none'
          if (showResult) {
            if (isCorrect) {
              border = '3px solid #22c55e'
            } else if (isSelected && !isCorrect) {
              border = '3px solid #ef4444'
              opacity = 0.7
            } else {
              opacity = 0.4
            }
          }

          return (
            <button
              key={r.id}
              onClick={() => handleAnswer(r.id, r.correcte)}
              disabled={phase !== 'question'}
              className="animate-scale-in"
              style={{
                background: color.bg,
                color: 'white',
                border,
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: phase === 'question' ? 'pointer' : 'default',
                minHeight: 90,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                opacity,
                transition: 'transform 0.15s ease, opacity 0.2s',
                animationDelay: `${i * 60}ms`,
                boxShadow: isSelected ? '0 0 0 3px rgba(255,255,255,0.4)' : 'none',
              }}
            >
              {r.texte}
              {showResult && isCorrect && ' ✓'}
              {showResult && isSelected && !isCorrect && ' ✗'}
            </button>
          )
        })}
      </div>

      {/* Feedback après réponse */}
      {phase === 'answered' && (
        <div
          className="animate-fade-in"
          style={{
            textAlign: 'center',
            padding: '0 1.25rem 2rem',
            color: 'var(--text-secondary)',
          }}
        >
          {selectedId &&
          currentQuestion.reponses.find((r) => r.id === selectedId)?.correcte ? (
            <p style={{ color: 'var(--success)', fontWeight: 700 }}>Bonne réponse ! 🎉</p>
          ) : (
            <p style={{ color: 'var(--error)', fontWeight: 700 }}>Mauvaise réponse</p>
          )}
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            En attente de la question suivante...
          </p>
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--error)', textAlign: 'center', padding: '1rem' }}>{error}</p>


      )}
    </div>
  )
}
export default LiveQuestion

