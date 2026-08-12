import { useState } from 'react'
import Logo from '../../components/Logo'

interface Props {
  onLogin: (email: string, pass: string) => Promise<void>
  onBack: () => void
  onSwitchRole: (role: 'teacher' | 'student') => void
  authError?: string
}

export default function AdminLogin({ onLogin, onBack, onSwitchRole, authError }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 4) { setError('Incorrect password. Please try again.'); return }
    setLoading(true)
    try {
      await onLogin(email, password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="auth-layout"
      style={{ background: 'radial-gradient(ellipse 140% 80% at 80% 50%, #1a004d 0%, #0D0221 60%)' }}
    >
      {/* Left panel */}
      <div
        className="auth-left"
        style={{
          background: 'rgba(157,0,255,0.04)',
          borderRight: '1px solid rgba(157,0,255,0.15)',
        }}
      >
        {[280, 450, 620].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(157,0,255,${0.1 - i * 0.02})`,
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          }} />
        ))}
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(157,0,255,0.15) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 340 }}>
          <Logo size={50} showText />
          <h2 style={{
            fontFamily: 'Fredoka, sans-serif', color: '#F0E6FF',
            fontSize: 32, fontWeight: 700, margin: '32px 0 14px', lineHeight: 1.2,
          }}>
            Platform{' '}
            <span style={{
              background: 'linear-gradient(90deg,#9D00FF,#FF006E)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>command center</span>
          </h2>
          <p style={{ color: 'rgba(240,230,255,0.5)', fontSize: 15, lineHeight: 1.7, fontFamily: 'Nunito' }}>
            Manage the entire QuizPulse ecosystem — users, schools, analytics, and platform configuration.
          </p>

          <div style={{ display: 'flex', gap: 10, marginTop: 36, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['12K+ Students', '840 Teachers', '99.9% Uptime'].map(s => (
              <div key={s} style={{
                background: 'rgba(157,0,255,0.1)', border: '1px solid rgba(157,0,255,0.3)',
                borderRadius: 100, padding: '6px 16px', fontSize: 13,
                color: '#C084FC', fontWeight: 700, fontFamily: 'Fredoka',
              }}>{s}</div>
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
          width: 'fit-content',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>

        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(157,0,255,0.12)', border: '1px solid rgba(157,0,255,0.4)',
            borderRadius: 100, padding: '4px 16px', fontSize: 12,
            color: '#C084FC', fontWeight: 800, marginBottom: 18,
            fontFamily: 'Fredoka', letterSpacing: '0.1em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9D00FF', display: 'inline-block', boxShadow: '0 0 6px #9D00FF' }} />
            ADMIN PORTAL
          </div>
          <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: 30, fontWeight: 700, margin: '0 0 8px', color: '#F0E6FF' }}>
            Welcome back
          </h1>
          <p style={{ color: 'rgba(240,230,255,0.45)', margin: 0, fontSize: 14, fontFamily: 'Nunito' }}>
            Sign in to your administrator account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {(error || authError) && (
            <div style={{
              background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.4)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              color: '#FF6B9D', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Nunito',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error || authError}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,230,255,0.7)', display: 'block', marginBottom: 7, fontFamily: 'Nunito' }}>Email address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@school.edu"
              style={{ width: '100%', padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,230,255,0.7)', display: 'block', marginBottom: 7, fontFamily: 'Nunito' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 44px 12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(240,230,255,0.4)', fontSize: 16,
              }}>
                {showPass ? '👁' : '👁‍🗨'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'rgba(240,230,255,0.5)', fontFamily: 'Nunito' }}>
              <input
                type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#9D00FF', background: 'transparent' }}
              />
              Remember me
            </label>
            <button type="button" style={{ background: 'none', border: 'none', color: '#9D00FF', fontSize: 13, cursor: 'pointer', fontWeight: 700, fontFamily: 'Nunito' }}>
              Forgot password?
            </button>
          </div>

          <button
            type="submit" disabled={loading}
            className="btn-neon"
            style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: loading
                ? 'rgba(157,0,255,0.2)'
                : 'linear-gradient(135deg, #9D00FF 0%, #FF006E 100%)',
              color: '#fff', fontWeight: 800, fontSize: 16,
              border: 'none', cursor: loading ? 'wait' : 'pointer',
              fontFamily: 'Fredoka', letterSpacing: '0.05em',
              boxShadow: loading ? 'none' : '0 0 30px rgba(157,0,255,0.4), 0 8px 24px rgba(157,0,255,0.3)',
            }}
          >
            {loading ? '⚡ Authenticating…' : '⚡ Access Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'rgba(240,230,255,0.3)', marginBottom: 10, fontFamily: 'Nunito' }}>Not an admin?</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => onSwitchRole('teacher')} style={{
              padding: '7px 16px', borderRadius: 10,
              border: '1px solid rgba(0,229,255,0.3)', background: 'rgba(0,229,255,0.08)',
              color: '#00E5FF', fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700,
            }}>Teacher</button>
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
