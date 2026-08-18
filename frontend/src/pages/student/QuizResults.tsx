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
  const [copied, setCopied] = useState(false)

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

  const podium = [
    participants[1] || null, // 2e place à gauche
    participants[0] || null, // 1ère place au centre
    participants[2] || null, // 3e place à droite
  ]
  const rest = participants.slice(3)

  const topScore = participants[0]?.scoreTotal ? Math.round(participants[0].scoreTotal) : 0
  const avgScore = participants.length > 0
    ? Math.round(participants.reduce((acc, p) => acc + (p.scoreTotal ?? 0), 0) / participants.length)
    : 0

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'bounce 1s infinite' }}>🏆</div>
          <p style={{ fontSize: 18, fontWeight: 700, opacity: 0.8 }}>Calcul du podium en cours…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B0F19 0%, #1E1B4B 40%, #0F172A 100%)',
      color: '#fff',
      padding: '2.5rem 1.25rem 4rem',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dynamic confetti sparkles background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.25) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
      }} />

      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Header */}
        <div className="animate-fade-in" style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 30,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: 13, fontWeight: 700, color: '#F59E0B',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12,
          }}>
            <span>✨ Résultats de la Session</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 3.25rem)',
            fontWeight: 900,
            margin: 0,
            fontFamily: 'Outfit, sans-serif',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}>
            Le Podium Gagnant 🏆
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 15, marginTop: 8 }}>
            Bravo aux {participants.length} participant{participants.length > 1 ? 's' : ''} pour cette session !
          </p>
        </div>

        {/* Quick Stats Summary */}
        <div className="animate-fade-in" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '3rem',
          background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: 16,
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Joueurs</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#38BDF8', marginTop: 2 }}>{participants.length}</div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Top Score</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#F59E0B', marginTop: 2 }}>{topScore} pts</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Moyenne</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#A855F7', marginTop: 2 }}>{avgScore} pts</div>
          </div>
        </div>

        {/* 3D Animated Podium */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          gap: 14, marginBottom: '3.5rem', minHeight: 310, padding: '0 10px',
        }}>
          {/* 2nd Place (Silver) */}
          {podium[0] && (
            <div style={{ flex: 1, maxWidth: 140, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 4, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))' }}>🥈</div>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #94A3B8, #475569)',
                border: '3px solid #E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 8,
                boxShadow: '0 0 16px rgba(148, 163, 184, 0.4)',
              }}>
                {podium[0].pseudonyme.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#F1F5F9', marginBottom: 4, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                {podium[0].pseudonyme}
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', marginBottom: 8 }}>
                {Math.round(podium[0].scoreTotal ?? 0)} pts
              </div>
              <div style={{
                width: '100%', height: 145,
                background: 'linear-gradient(180deg, #64748B 0%, #334155 100%)',
                borderRadius: '16px 16px 0 0',
                border: '1px solid rgba(255,255,255,0.15)', borderBottom: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 900, color: 'rgba(255,255,255,0.3)',
                boxShadow: '0 -4px 20px rgba(148, 163, 184, 0.2)',
              }}>
                2
              </div>
            </div>
          )}

          {/* 1st Place (Gold) */}
          {podium[1] && (
            <div style={{ flex: 1.1, maxWidth: 160, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 2, filter: 'drop-shadow(0 6px 14px rgba(245, 158, 11, 0.6))', animation: 'bounce 2s infinite' }}>👑</div>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B, #B45309)',
                border: '3px solid #FCD34D',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 22, color: '#fff', marginBottom: 8,
                boxShadow: '0 0 24px rgba(245, 158, 11, 0.7)',
              }}>
                {podium[1].pseudonyme.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#FCD34D', marginBottom: 4, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                {podium[1].pseudonyme}
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#F59E0B', marginBottom: 8, background: 'rgba(245, 158, 11, 0.15)', padding: '2px 10px', borderRadius: 12 }}>
                {Math.round(podium[1].scoreTotal ?? 0)} pts
              </div>
              <div style={{
                width: '100%', height: 195,
                background: 'linear-gradient(180deg, #F59E0B 0%, #B45309 100%)',
                borderRadius: '18px 18px 0 0',
                border: '1px solid rgba(253, 224, 71, 0.4)', borderBottom: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, fontWeight: 900, color: 'rgba(255,255,255,0.35)',
                boxShadow: '0 -6px 30px rgba(245, 158, 11, 0.4)',
              }}>
                1
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze) */}
          {podium[2] && (
            <div style={{ flex: 1, maxWidth: 140, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 4, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))' }}>🥉</div>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #D97706, #78350F)',
                border: '3px solid #FDBA74',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 8,
                boxShadow: '0 0 16px rgba(217, 119, 6, 0.4)',
              }}>
                {podium[2].pseudonyme.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#F1F5F9', marginBottom: 4, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                {podium[2].pseudonyme}
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#FDBA74', marginBottom: 8 }}>
                {Math.round(podium[2].scoreTotal ?? 0)} pts
              </div>
              <div style={{
                width: '100%', height: 115,
                background: 'linear-gradient(180deg, #B45309 0%, #451A03 100%)',
                borderRadius: '16px 16px 0 0',
                border: '1px solid rgba(255,255,255,0.12)', borderBottom: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 900, color: 'rgba(255,255,255,0.25)',
                boxShadow: '0 -4px 20px rgba(180, 83, 9, 0.2)',
              }}>
                3
              </div>
            </div>
          )}
        </div>

        {/* Rest of Leaderboard */}
        {rest.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 24,
            padding: '1.25rem', marginBottom: '2.5rem', textAlign: 'left',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 8px' }}>
              Suite du Classement
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rest.map((p, i) => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 14,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'transform 0.15s, background 0.15s',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: 'rgba(255,255,255,0.08)', color: '#CBD5E1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 13, flexShrink: 0,
                  }}>
                    {i + 4}
                  </div>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0,
                  }}>
                    {p.pseudonyme.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, fontWeight: 600, fontSize: 15, color: '#F8FAFC' }}>
                    {p.pseudonyme}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#38BDF8', background: 'rgba(56,189,248,0.1)', padding: '4px 10px', borderRadius: 12 }}>
                    {Math.round(p.scoreTotal ?? 0)} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/')} style={{
            background: 'linear-gradient(90deg, #2563EB, #7C3AED)',
            color: '#fff', border: 'none', borderRadius: 14,
            padding: '14px 28px', fontWeight: 800, fontSize: 15,
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
            transition: 'transform 0.15s',
          }}>
            Retour au Tableau de Bord 🏠
          </button>

          <button onClick={handleShare} style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#fff', border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: 14,
            padding: '14px 22px', fontWeight: 700, fontSize: 15,
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          }}>
            {copied ? 'Lien copié ! 📋' : 'Partager les résultats 🚀'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizResults