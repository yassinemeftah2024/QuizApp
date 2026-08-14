import { useState, useEffect } from 'react'
import Logo from '../components/Logo'

interface Props {
  onSelect: (role: 'admin' | 'teacher' | 'student' | 'guest') => void
}

const roles = [
  {
    key: 'admin' as const,
    label: 'Admin',
    emoji: '⚡',
    desc: 'Manage users & platform',
    color: '#9D00FF',
    glow: 'rgba(157,0,255,0.5)',
    border: 'rgba(157,0,255,0.6)',
    bg: 'linear-gradient(135deg, rgba(157,0,255,0.18) 0%, rgba(157,0,255,0.06) 100%)',
    badge: 'MASTER',
    badgeColor: '#9D00FF',
  },
  {
    key: 'teacher' as const,
    label: 'Teacher',
    emoji: '🎓',
    desc: 'Create quizzes & sessions',
    color: '#00E5FF',
    glow: 'rgba(0,229,255,0.5)',
    border: 'rgba(0,229,255,0.6)',
    bg: 'linear-gradient(135deg, rgba(0,229,255,0.18) 0%, rgba(0,229,255,0.06) 100%)',
    badge: 'PRO',
    badgeColor: '#00E5FF',
  },
  {
    key: 'student' as const,
    label: 'Student',
    emoji: '🚀',
    desc: 'Join quizzes & earn XP',
    color: '#FF006E',
    glow: 'rgba(255,0,110,0.5)',
    border: 'rgba(255,0,110,0.6)',
    bg: 'linear-gradient(135deg, rgba(255,0,110,0.18) 0%, rgba(255,0,110,0.06) 100%)',
    badge: 'PLAYER',
    badgeColor: '#FF006E',
  },
  {
    key: 'guest' as const,
    label: 'Guest',
    emoji: '👾',
    desc: 'Join without an account',
    color: '#AAFF00',
    glow: 'rgba(170,255,0,0.5)',
    border: 'rgba(170,255,0,0.6)',
    bg: 'linear-gradient(135deg, rgba(170,255,0,0.18) 0%, rgba(170,255,0,0.06) 100%)',
    badge: 'FREE',
    badgeColor: '#AAFF00',
  },
]

const stats = [
  { val: '12,400+', label: 'Active Students', icon: '🎮' },
  { val: '840+',   label: 'Teachers',        icon: '🏆' },
  { val: '58K+',   label: 'Quizzes Played',  icon: '⚡' },
  { val: '99%',    label: 'Fun Guaranteed',  icon: '🔥' },
]

const floatingEmojis = ['⭐','💥','🎯','🔥','💎','⚡','🌟','🏆','🎲','✨']

function Particle({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <div style={{
      position: 'absolute',
      fontSize: 20,
      opacity: 0.25,
      pointerEvents: 'none',
      animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 3}s`,
      ...style,
    }}>
      {emoji}
    </div>
  )
}

export default function RoleSelect({ onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [particles] = useState(() =>
    floatingEmojis.map((e, i) => ({
      emoji: e,
      top: `${8 + (i * 9) % 84}%`,
      left: `${(i * 13 + 5) % 95}%`,
    }))
  )
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse 120% 80% at 50% -10%, #2A0A5E 0%, #0D0221 55%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '32px 20px', position: 'relative', overflow: 'hidden',
    }}>

      {/* Floating background particles */}
      {mounted && particles.map((p, i) => (
        <Particle key={i} emoji={p.emoji} style={{ top: p.top, left: p.left }} />
      ))}

      {/* Ambient orbs */}
      <div style={{
        position: 'fixed', top: '-10%', left: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(157,0,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '-5%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', top: '40%', right: '10%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,0,110,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(157,0,255,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(157,0,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      {/* ── Header ── */}
      <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: 40, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div className="animate-float" style={{ animationDelay: '0s' }}>
            <Logo size={52} showText />
          </div>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)',
          borderRadius: 100, padding: '4px 16px 4px 10px',
          marginBottom: 18,
        }}>
          <span style={{ fontSize: 16 }}>🎮</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#00E5FF', letterSpacing: '0.1em', fontFamily: 'Fredoka' }}>
            LIVE QUIZ PLATFORM
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Fredoka, sans-serif', fontSize: 'clamp(36px, 6vw, 62px)',
          fontWeight: 700, margin: '0 0 14px', lineHeight: 1.1, color: '#F0E6FF',
        }}>
          Learn. Compete.{' '}
          <span style={{
            background: 'linear-gradient(90deg, #00E5FF 0%, #9D00FF 40%, #FF006E 80%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}>
            Dominate.
          </span>
        </h1>
        <p style={{
          fontSize: 16, color: 'rgba(240,230,255,0.6)',
          margin: '0 auto', maxWidth: 420, lineHeight: 1.6,
          fontFamily: 'Nunito',
        }}>
          Real-time quizzes that make studying feel like a game. Join your class and climb the leaderboard!
        </p>
      </div>

      {/* ── Role cards ── */}
      <div className="role-grid" style={{ position: 'relative', zIndex: 1 }}>
        {roles.map((r, i) => (
          <div
            key={r.key}
            className="role-card animate-bounce-in"
            style={{
              animationDelay: `${i * 0.1}s`,
              background: hovered === r.key ? r.bg : 'rgba(26,10,53,0.8)',
              border: `1.5px solid ${hovered === r.key ? r.border : 'rgba(157,0,255,0.2)'}`,
              boxShadow: hovered === r.key
                ? `0 20px 60px ${r.glow}, 0 0 0 1px ${r.border}`
                : '0 4px 24px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onMouseEnter={() => setHovered(r.key)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(r.key)}
          >
            {/* Badge */}
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: `${r.badgeColor}22`,
              border: `1px solid ${r.badgeColor}66`,
              borderRadius: 6, padding: '2px 8px',
              fontSize: 10, fontWeight: 800, color: r.badgeColor,
              fontFamily: 'Fredoka', letterSpacing: '0.1em',
            }}>
              {r.badge}
            </div>

            <div style={{ padding: '24px 24px 20px' }}>
              {/* Emoji icon */}
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `${r.color}18`,
                border: `1.5px solid ${r.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, marginBottom: 16,
                boxShadow: `0 0 20px ${r.glow}`,
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                transform: hovered === r.key ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
              }}>
                {r.emoji}
              </div>

              <h3 style={{
                fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 22,
                margin: '0 0 6px', color: hovered === r.key ? r.color : '#F0E6FF',
                transition: 'color 0.2s',
              }}>
                {r.label}
              </h3>
              <p style={{
                fontSize: 13, color: 'rgba(240,230,255,0.55)',
                margin: '0 0 18px', lineHeight: 1.5, fontFamily: 'Nunito',
              }}>
                {r.desc}
              </p>

              {/* Enter CTA */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 700, color: r.color,
                fontFamily: 'Fredoka', letterSpacing: '0.05em',
                transition: 'gap 0.2s',
              }}>
                Enter portal
                <span style={{
                  transform: hovered === r.key ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                  display: 'inline-block',
                }}>
                  →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Stats bar ── */}
      <div
        className="stats-bar animate-fade-in"
        style={{ marginTop: 40, position: 'relative', zIndex: 1, animationDelay: '0.5s' }}
      >
        {stats.map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '12px 20px',
            textAlign: 'center', minWidth: 110,
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
            <div style={{
              fontFamily: 'Fredoka', fontWeight: 700, fontSize: 20,
              background: 'linear-gradient(90deg, #00E5FF, #9D00FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'rgba(240,230,255,0.4)', fontWeight: 600, fontFamily: 'Nunito' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Scan QR button ── */}
      <div style={{ marginTop: 24, position: 'relative', zIndex: 1 }}>
        <button
          className="btn-neon"
          style={{
            background: 'rgba(0,229,255,0.1)',
            border: '1.5px solid rgba(0,229,255,0.4)',
            color: '#00E5FF', borderRadius: 100,
            padding: '10px 24px', fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 0 20px rgba(0,229,255,0.2)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <path d="M14 14h1v1h-1zM18 14h1v1h-1zM14 18h1v1h-1zM18 18h1v1h-1zM16 16h1v1h-1z"/>
          </svg>
          Scan QR to join instantly
        </button>
      </div>

      <p style={{
        marginTop: 28, fontSize: 12, color: 'rgba(240,230,255,0.25)',
        fontFamily: 'Nunito', position: 'relative', zIndex: 1,
      }}>
        © 2025 QuizPulse — Making learning electric ⚡
      </p>
    </div>
  )
}
