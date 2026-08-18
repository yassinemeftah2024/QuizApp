
import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sessionService, type SessionResponse } from '@/services/sessionService'
import api from '@/services/api'
import { wsService } from '@/services/websocket'
import type { QuestionDTO } from '@/types'

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
  const [questions, setQuestions] = useState<QuestionDTO[]>([])
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

  const currentQuestion = questions[questionIndex] || null

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
      const sid = Number(sessionId)
      const data = await sessionService.getById(sid)
      setSession(data)

      const questionList = await sessionService.getQuestions(sid)
      setQuestions(questionList)

      if (data.statut === 'TERMINEE' || data.statut === 'ANNULEE') {
        setPhase('finished')
        return
      }

      const serverIndex = data.currentQuestionIndex ?? 0

      if (data.statut === 'EN_COURS') {
        if (serverIndex >= questionList.length) {
          setPhase('finished')
        } else {
          setQuestionIndex(serverIndex)
          setSelectedId(null)
          setPhase('question')
          startTimer(questionList[serverIndex]?.dureeSecondes ?? 20)
        }
      }
    } catch {
      setError('Session ou questions introuvables')
    }
  }, [sessionId])

  useEffect(() => {
    if (!sessionId) return

    const sid = Number(sessionId)

    loadSession()

    wsService.connect(() => {
      wsService.subscribe(`/topic/session/${sid}/status`, async (data: any) => {
        console.log('[WS] status', data)
        if (data?.statut === 'EN_COURS') {
          const loadedQuestions = await sessionService.getQuestions(sid)
          setQuestions(loadedQuestions)
          const idx = data?.questionIndex ?? 0
          if (idx >= loadedQuestions.length) {
            setPhase('finished')
          } else {
            setQuestionIndex(idx)
            setSelectedId(null)
            setPhase('question')
            startTimer(loadedQuestions[idx]?.dureeSecondes ?? 20)
          }
        } else if (data?.statut === 'TERMINEE' || data?.statut === 'ANNULEE') {
          setPhase('finished')
        }
      })

      wsService.subscribe(`/topic/session/${sid}/question`, async (data: any) => {
        console.log('[WS] question', data)
        const loadedQuestions = await sessionService.getQuestions(sid)
        setQuestions(loadedQuestions)
        const idx = data?.questionIndex ?? 0
        if (idx >= loadedQuestions.length) {
          setPhase('finished')
        } else {
          setQuestionIndex(idx)
          setSelectedId(null)
          setPhase('question')
          startTimer(loadedQuestions[idx]?.dureeSecondes ?? 20)
        }
      })
    })

    return () => {
      wsService.disconnect()
    }
  }, [sessionId, loadSession])

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
      await api.post('/reponses', {
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
            Q{questionIndex + 1}/{questions.length}
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <h2 style={{ fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', margin: 0 }}>
            {currentQuestion.texte}
          </h2>
          {currentQuestion.mediaUrl && (
            currentQuestion.mediaType === 'VIDEO' ? (
              <video src={currentQuestion.mediaUrl} controls style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 'var(--radius-md)' }} />
            ) : (
              <img src={currentQuestion.mediaUrl} alt={currentQuestion.mediaAlt || 'Question image'} style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
            )
          )}
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

