import { useState } from 'react'
import Logo from '../../components/Logo'

interface Props {
  onLogin: (name: string) => void
  onBack: () => void
  onSwitchRole: (role: 'admin' | 'student') => void
}

const features = [
  { icon: '📄', label: 'Import quizzes from PDF' },
  { icon: '🤖', label: 'AI question generation' },
  { icon: '📊', label: 'Real-time student analytics' },
]

export default function TeacherLogin({ onLogin, onBack, onSwitchRole }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin('Prof. Sarah Benali') }, 900)
  }

  return (
    <div
      className="auth-layout"
      style={{ background: 'radial-gradient(ellipse 140% 80% at 20% 50%, #001B40 0%, #0D0221 60%)' }}
    >
      {/* Left panel */}
      <div
        className="auth-left"
        style={{
          background: 'rgba(0,229,255,0.04)',
          borderRight: '1px solid rgba(0,229,255,0.15)',
        }}
      >
        {/* Rings */}
        {[260, 420, 580].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(0,229,255,${0.08 - i * 0.02})`,
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          }} />
        ))}
        {/* Glow orb */}
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 340 }}>
          <Logo size={50} showText />
          <h2 style={{
            fontFamily: 'Fredoka, sans-serif', color: '#F0E6FF',
            fontSize: 32, fontWeight: 700, margin: '32px 0 14px', lineHeight: 1.2,
          }}>
            Your classroom,{' '}
            <span style={{
              background: 'linear-gradient(90deg,#00E5FF,#9D00FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>supercharged</span>
          </h2>
          <p style={{ color: 'rgba(240,230,255,0.55)', fontSize: 15, lineHeight: 1.7, fontFamily: 'Nunito' }}>
            Launch live quiz battles, track every answer, and watch engagement skyrocket.
          </p>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {features.map(f => (
              <div key={f.label} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)',
                borderRadius: 12, padding: '11px 18px',
              }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <span style={{ color: '#F0E6FF', fontWeight: 600, fontSize: 14, fontFamily: 'Nunito' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
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

        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)',
            borderRadius: 100, padding: '4px 14px', fontSize: 12,
            color: '#00E5FF', fontWeight: 800, marginBottom: 18,
            fontFamily: 'Fredoka', letterSpacing: '0.08em',
          }}>
            🎓 TEACHER PORTAL
          </div>
          <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: 30, fontWeight: 700, margin: '0 0 8px', color: '#F0E6FF' }}>
            Sign in to teach
          </h1>
          <p style={{ color: 'rgba(240,230,255,0.45)', margin: 0, fontSize: 14, fontFamily: 'Nunito' }}>
            Access your dashboard and live sessions
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.4)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              color: '#FF6B9D', fontSize: 14, fontFamily: 'Nunito',
            }}>⚠️ {error}</div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,230,255,0.7)', display: 'block', marginBottom: 7, fontFamily: 'Nunito' }}>Email address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="teacher@school.edu"
              style={{ width: '100%', padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,230,255,0.7)', display: 'block', marginBottom: 7, fontFamily: 'Nunito' }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="btn-neon"
            style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: loading
                ? 'rgba(0,229,255,0.2)'
                : 'linear-gradient(135deg, #00E5FF 0%, #0080FF 50%, #9D00FF 100%)',
              color: loading ? '#00E5FF' : '#0D0221',
              fontWeight: 800, fontSize: 16, border: 'none', cursor: loading ? 'wait' : 'pointer',
              fontFamily: 'Fredoka', letterSpacing: '0.05em',
              boxShadow: loading ? 'none' : '0 0 30px rgba(0,229,255,0.4), 0 8px 24px rgba(0,229,255,0.25)',
            }}
          >
            {loading ? '⚡ Connecting…' : '⚡ Enter Dashboard'}
          </button>
        </form>

        <div style={{
          marginTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 20, textAlign: 'center',
        }}>
          <p style={{ fontSize: 12, color: 'rgba(240,230,255,0.3)', marginBottom: 10, fontFamily: 'Nunito' }}>Wrong portal?</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => onSwitchRole('admin')} style={{
              padding: '7px 16px', borderRadius: 10,
              border: '1px solid rgba(157,0,255,0.3)', background: 'rgba(157,0,255,0.08)',
              color: '#9D00FF', fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700,
            }}>Admin</button>
            <button onClick={() => onSwitchRole('student')} style={{
              padding: '7px 16px', borderRadius: 10,
              border: '1px solid rgba(255,0,110,0.3)', background: 'rgba(255,0,110,0.08)',
              color: '#FF006E', fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700,
            }}>Student</button>
          </div>
        </div>
      </div>
    </div>
  )
}
