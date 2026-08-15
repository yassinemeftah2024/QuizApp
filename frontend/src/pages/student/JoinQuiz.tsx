
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sessionService } from '@/services/sessionService'
import { participationService } from '@/services/participationService'
import './JoinQuiz.css'

interface JoinQuizProps {
  onJoin?: () => void
}

function JoinQuiz({ onJoin }: JoinQuizProps) {
  const { pin: pinFromUrl } = useParams<{ pin?: string }>()
  const navigate = useNavigate()

  const [pin, setPin] = useState(pinFromUrl || '')
  const [pseudo, setPseudo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (pinFromUrl) setPin(pinFromUrl)
  }, [pinFromUrl])

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const cleanPin = pin.trim()
    const cleanPseudo = pseudo.trim()

    if (!cleanPin || cleanPin.length < 4) {
      setError('Entre un code PIN valide')
      return
    }
    if (!cleanPseudo || cleanPseudo.length < 2) {
      setError('Choisis un pseudo (min. 2 caractères)')
      return
    }

    setLoading(true)
    try {
      // 1. Récupérer la session via le PIN
      const session = await sessionService.getByPin(cleanPin)

      if (session.statut === 'TERMINEE' || session.statut === 'ANNULEE') {
        setError('Cette session est terminée')
        setLoading(false)
        return
      }

      // 2. Rejoindre
      const participation = await participationService.join({
        sessionId: session.id,
        pseudonyme: cleanPseudo,
        utilisateurId: null,
      })

      // 3. Stocker en local pour la suite
      localStorage.setItem('participationId', String(participation.id))
      localStorage.setItem('sessionId', String(session.id))
      localStorage.setItem('pseudonyme', cleanPseudo)

      onJoin?.()

      // 4. Aller vers l'écran d'attente / jeu
      // Pour l'instant on redirige vers /live/:sessionId
      navigate(`/live/${session.id}`)
    } catch (err: unknown) {
      console.error(err)
      setError('PIN invalide ou session introuvable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="join-quiz-page animate-fade-in">
      <section className="join-quiz-hero" aria-label="Rejoindre un quiz en direct">
        <div className="join-quiz-hero__content">
          <div className="join-quiz-kicker">Session live</div>
          <h1>Entre dans le quiz</h1>
          <p>
            Saisis le code affiché par ton enseignant, choisis ton pseudo et rejoins la partie.
          </p>
          <div className="join-quiz-steps" aria-label="Étapes">
            <span>1. Code PIN</span>
            <span>2. Pseudo</span>
            <span>3. Prêt à jouer</span>
          </div>
        </div>

        <form onSubmit={handleJoin} className="join-quiz-card" noValidate>
          <div className="join-quiz-card__header">
            <div className="join-quiz-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12a7 7 0 0 1 14 0" />
                <path d="M8 12a4 4 0 0 1 8 0" />
                <path d="M12 12v7" />
                <path d="M9 19h6" />
              </svg>
            </div>
            <div>
              <h2>Rejoindre maintenant</h2>
              <p>Aucun compte requis pour cette session.</p>
            </div>
          </div>

          <label className="join-quiz-field">
            <span>Code PIN</span>
            <input
              className="join-quiz-input join-quiz-input--pin"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="433250"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              autoFocus={!pinFromUrl}
              aria-invalid={!!error && pin.trim().length < 4}
              aria-describedby={error ? 'join-quiz-error' : undefined}
            />
          </label>

          <label className="join-quiz-field">
            <span>Ton pseudo</span>
            <input
              className="join-quiz-input"
              type="text"
              maxLength={20}
              placeholder="Alex"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              autoFocus={!!pinFromUrl}
              aria-invalid={!!error && pseudo.trim().length < 2}
              aria-describedby={error ? 'join-quiz-error' : undefined}
            />
          </label>

          {error && (
            <p id="join-quiz-error" className="join-quiz-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="join-quiz-submit btn-neon" disabled={loading}>
            <span>{loading ? 'Connexion...' : 'Rejoindre'}</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        </form>

        <aside className="join-quiz-panel" aria-label="Conseils pour rejoindre">
          <div className="join-quiz-panel__row">
            <span className="join-quiz-panel__badge">PIN</span>
            <p>Le code contient 4 à 6 chiffres et se trouve sur l'écran de la session.</p>
          </div>
          <div className="join-quiz-panel__row">
            <span className="join-quiz-panel__badge join-quiz-panel__badge--cyan">LIVE</span>
            <p>Une fois connecté, tu seras envoyé automatiquement vers la salle d'attente.</p>
          </div>
        </aside>
      </section>
    </div>
  )
}
export default JoinQuiz
