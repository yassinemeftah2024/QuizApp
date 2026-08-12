import { useEffect, useState } from 'react'
import Logo from '../../components/Logo'
import { getClasses, type ClasseWithStats } from '@/services/adminService'

interface Props {
  onLogin: (email: string, pass: string, name?: string, classId?: number) => Promise<void>
  onBack: () => void
  onSwitchRole: (role: 'admin' | 'teacher') => void
}

const highlights = [
  { icon: '🏆', label: 'Climb the leaderboard live' },
  { icon: '⚡', label: 'Instant feedback on answers' },
  { icon: '🎯', label: 'Track your XP and progress' },
]

export default function StudentLogin({ onLogin, onBack, onSwitchRole }: Props) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [classId, setClassId] = useState<number | undefined>(undefined)
  const [classes, setClasses] = useState<ClasseWithStats[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getClasses()
      .then(setClasses)
      .catch(() => setError('Impossible de charger les classes.'))
      .finally(() => setLoadingClasses(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (tab === 'register') {
      if (!name.trim() || !email.trim() || !password.trim() || !classId) {
        setError('Veuillez remplir tous les champs et sélectionner une classe.')
        return
      }
    }

    setLoading(true)
    try {
      await onLogin(email, password, tab === 'register' ? name : undefined, tab === 'register' && typeof classId === 'number' ? classId : undefined)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Unable to authenticate. Please verify your information.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="auth-layout"
      style={{ background: 'radial-gradient(ellipse 140% 80% at 30% 50%, #1A0040 0%, #0D0221 60%)' }}
    >
      {/* ── Left branding panel ── */}
      <div
        className="auth-left"
        style={{
          background: 'rgba(255,0,110,0.04)',
          borderRight: '1px solid rgba(255,0,110,0.15)',
        }}
      >
        {/* Decorative rings */}
        {[260, 420, 580].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(255,0,110,${0.08 - i * 0.02})`,
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
          }} />
        ))}
        <div style={{
          position: 'absolute', width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,0,110,0.12) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 340 }}>
          <Logo size={50} showText />
          <h2 style={{
            fontFamily: 'Fredoka, sans-serif', color: '#F0E6FF',
            fontSize: 32, fontWeight: 700, margin: '32px 0 14px', lineHeight: 1.2,
          }}>
            Study smarter,{' '}
            <span style={{
              background: 'linear-gradient(90deg,#FF006E,#9D00FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              score higher
            </span>
          </h2>
          <p style={{ color: 'rgba(240,230,255,0.55)', fontSize: 15, lineHeight: 1.7, fontFamily: 'Nunito' }}>
            Join live quiz sessions, earn XP, and compete with classmates in real time.
          </p>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {highlights.map(h => (
              <div key={h.label} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'rgba(255,0,110,0.08)', border: '1px solid rgba(255,0,110,0.2)',
                borderRadius: 12, padding: '11px 18px',
              }}>
                <span style={{ fontSize: 20 }}>{h.icon}</span>
                <span style={{ color: '#F0E6FF', fontWeight: 600, fontSize: 14, fontFamily: 'Nunito' }}>{h.label}</span>
              </div>
            ))}
          </div>

          {/* Avatar row teaser */}
          <div style={{ marginTop: 32, display: 'flex', gap: 8, justifyContent: 'center' }}>
            {['🦊', '🐼', '🦁', '🦄', '🐸', '🦈'].map(e => (
              <div key={e} style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>{e}</div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(240,230,255,0.3)', marginTop: 10, fontFamily: 'Nunito' }}>
            Pick your avatar after login
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div
        className="auth-right"
        style={{ background: 'rgba(13,2,33,0.95)' }}
      >
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, cursor: 'pointer', color: 'rgba(240,230,255,0.5)',
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13,
          marginBottom: 40, padding: '7px 14px', fontFamily: 'Nunito', fontWeight: 600,
          width: 'fit-content', transition: 'all 0.18s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>

        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,0,110,0.12)', border: '1px solid rgba(255,0,110,0.35)',
            borderRadius: 100, padding: '4px 14px', fontSize: 12,
            color: '#FF006E', fontWeight: 800, marginBottom: 18,
            fontFamily: 'Fredoka', letterSpacing: '0.08em',
          }}>
            🚀 STUDENT PORTAL
          </div>
          <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: 30, fontWeight: 700, margin: '0 0 8px', color: '#F0E6FF' }}>
            {tab === 'login' ? 'Welcome back!' : 'Create account'}
          </h1>
          <p style={{ color: 'rgba(240,230,255,0.45)', margin: 0, fontSize: 14, fontFamily: 'Nunito' }}>
            {tab === 'login' ? 'Sign in and rejoin the competition' : 'Join your class and start earning XP'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 14,
          padding: 4, marginBottom: 28, border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '9px', borderRadius: 11,
              background: tab === t
                ? 'linear-gradient(135deg, rgba(255,0,110,0.25), rgba(255,0,110,0.1))'
                : 'transparent',
              color: tab === t ? '#FF006E' : 'rgba(240,230,255,0.4)',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              fontFamily: 'Fredoka', letterSpacing: '0.03em',
              boxShadow: tab === t ? '0 0 16px rgba(255,0,110,0.2)' : 'none',
              border: tab === t ? '1px solid rgba(255,0,110,0.35)' : '1px solid transparent',
              transition: 'all 0.2s',
            }}>
              {t === 'login' ? '⚡ Sign In' : '🌟 Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {error && tab === 'login' && (
            <div style={{ marginBottom: 16, color: '#FF6B9D', background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.35)', borderRadius: 10, padding: '10px 12px', fontSize: 13 }}>{error}</div>
          )}
          {tab === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,230,255,0.7)', display: 'block', marginBottom: 7, fontFamily: 'Nunito' }}>Full name</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Amira Khaldi"
                style={{ width: '100%', padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,230,255,0.7)', display: 'block', marginBottom: 7, fontFamily: 'Nunito' }}>Email address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="student@school.edu"
              style={{ width: '100%', padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: tab === 'register' ? 16 : 28 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,230,255,0.7)', display: 'block', marginBottom: 7, fontFamily: 'Nunito' }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {tab === 'register' && (
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,230,255,0.7)', display: 'block', marginBottom: 7, fontFamily: 'Nunito' }}>Class</label>
              <select
                value={classId ?? ''}
                onChange={e => setClassId(e.target.value ? Number(e.target.value) : undefined)}
                disabled={loadingClasses}
                style={{ width: '100%', padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
              >
                <option value="" disabled>{loadingClasses ? 'Loading classes…' : 'Select your class'}</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{`${c.nom}${c.niveau ? ` — ${c.niveau}` : ''}${c.section ? ` (${c.section})` : ''}`}</option>
                ))}
              </select>
              {error && tab === 'register' && (
                <div style={{ marginTop: 10, color: '#FF6B9D', fontSize: 13 }}>{error}</div>
              )}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="btn-neon"
            style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: loading
                ? 'rgba(255,0,110,0.2)'
                : 'linear-gradient(135deg, #FF006E 0%, #9D00FF 100%)',
              color: '#fff', fontWeight: 800, fontSize: 16,
              border: 'none', cursor: loading ? 'wait' : 'pointer',
              fontFamily: 'Fredoka', letterSpacing: '0.05em',
              boxShadow: loading ? 'none' : '0 0 30px rgba(255,0,110,0.4), 0 8px 24px rgba(255,0,110,0.3)',
            }}
          >
            {loading
              ? (tab === 'login' ? '⚡ Entering…' : '🌟 Creating…')
              : (tab === 'login' ? '⚡ Enter the Arena' : '🌟 Join the Game')}
          </button>
        </form>

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'rgba(240,230,255,0.3)', marginBottom: 10, fontFamily: 'Nunito' }}>Wrong portal?</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => onSwitchRole('admin')} style={{
              padding: '7px 16px', borderRadius: 10,
              border: '1px solid rgba(157,0,255,0.3)', background: 'rgba(157,0,255,0.08)',
              color: '#9D00FF', fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700,
            }}>Admin</button>
            <button onClick={() => onSwitchRole('teacher')} style={{
              padding: '7px 16px', borderRadius: 10,
              border: '1px solid rgba(0,229,255,0.3)', background: 'rgba(0,229,255,0.08)',
              color: '#00E5FF', fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700,
            }}>Teacher</button>
          </div>
        </div>
      </div>
    </div>
  )
}
