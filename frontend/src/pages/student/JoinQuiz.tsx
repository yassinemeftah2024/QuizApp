import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sessionService } from '@/services/sessionService'
import { participationService } from '@/services/participationService'

function JoinQuiz() {
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
    <div className="layout-mobile layout-mobile-gradient">
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        {/* Logo / Titre */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem',
            }}
          >
            QuizApp
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Rejoins une session en direct
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleJoin}
          className="card animate-scale-in"
          style={{
            width: '100%',
            maxWidth: 400,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* PIN */}
          <div>
            <label
              style={{
                display: 'block',
                color: 'var(--text-muted)',
                fontSize: '0.8125rem',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Code PIN
            </label>
            <input
              className="input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Ex: 433250"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              style={{
                textAlign: 'center',
                fontSize: '1.5rem',
                letterSpacing: '0.3em',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
              }}
              autoFocus={!pinFromUrl}
            />
          </div>

          {/* Pseudo */}
          <div>
            <label
              style={{
                display: 'block',
                color: 'var(--text-muted)',
                fontSize: '0.8125rem',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Ton pseudo
            </label>
            <input
              className="input"
              type="text"
              maxLength={20}
              placeholder="Ex: Alex"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              autoFocus={!!pinFromUrl}
            />
          </div>

          {/* Erreur */}
          {error && (
            <p
              style={{
                color: 'var(--error)',
                fontSize: '0.875rem',
                textAlign: 'center',
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          {/* Bouton */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.0625rem',
              marginTop: '0.5rem',
            }}
          >
            {loading ? 'Connexion...' : 'Rejoindre 🚀'}
          </button>
        </form>

        <p
          style={{
            marginTop: '2rem',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            textAlign: 'center',
          }}
        >
          Pas de compte nécessaire — joue en invité
        </p>
      </div>
    </div>
  )
}

export default JoinQuiz