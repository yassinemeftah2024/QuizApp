import { useState } from 'react'
import Logo from '../../components/Logo'

const avatars = [
  { id: 'fox',     emoji: '🦊', color: '#FF6B35' },
  { id: 'panda',   emoji: '🐼', color: '#4ADE80' },
  { id: 'lion',    emoji: '🦁', color: '#FFB800' },
  { id: 'koala',   emoji: '🐨', color: '#00E5FF' },
  { id: 'unicorn', emoji: '🦄', color: '#FF006E' },
  { id: 'wolf',    emoji: '🐺', color: '#9D00FF' },
  { id: 'frog',    emoji: '🐸', color: '#AAFF00' },
  { id: 'tiger',   emoji: '🐯', color: '#FF8C00' },
  { id: 'eagle',   emoji: '🦅', color: '#00BFFF' },
  { id: 'dino',    emoji: '🦖', color: '#39FF14' },
  { id: 'dragon',  emoji: '🐲', color: '#FF2D55' },
  { id: 'shark',   emoji: '🦈', color: '#007AFF' },
]

interface Props {
  onJoin: (nickname: string, avatar: { emoji: string; color: string }) => void
  onBack: () => void
  onRegister: () => void
}

export default function GuestEntry({ onJoin, onBack, onRegister }: Props) {
  const [step, setStep] = useState<'pin' | 'avatar'>('pin')
  const [pin, setPin] = useState('')
  const [nickname, setNickname] = useState('')
  const [selected, setSelected] = useState(avatars[0])
  const [pinError, setPinError] = useState('')

  const handlePinNext = () => {
    if (pin.length < 4) { setPinError('Enter a 4–6 digit PIN'); return }
    setStep('avatar')
  }

  const handleJoin = () => {
    onJoin(nickname.trim() || `${selected.emoji} ${selected.id}`, selected)
  }

  return (
    <div
      className="auth-layout"
      style={{ background: 'radial-gradient(ellipse 140% 80% at 70% 50%, #001A00 0%, #0D0221 60%)' }}
    >
      {/* ── Left branding panel ── */}
      <div
        className="auth-left"
        style={{
          background: 'rgba(170,255,0,0.03)',
          borderRight: '1px solid rgba(170,255,0,0.12)',
        }}
      >
        {/* Decorative rings */}
        {[260, 420, 580].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(170,255,0,${0.07 - i * 0.02})`,
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
          }} />
        ))}
        <div style={{
          position: 'absolute', width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(170,255,0,0.1) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 340 }}>
          <Logo size={50} showText />
          <h2 style={{
            fontFamily: 'Fredoka, sans-serif', color: '#F0E6FF',
            fontSize: 32, fontWeight: 700, margin: '32px 0 14px', lineHeight: 1.2,
          }}>
            Jump in,{' '}
            <span style={{
              background: 'linear-gradient(90deg,#AAFF00,#00E5FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              no signup needed
            </span>
          </h2>
          <p style={{ color: 'rgba(240,230,255,0.55)', fontSize: 15, lineHeight: 1.7, fontFamily: 'Nunito' }}>
            Got a PIN from your teacher? That's all you need. Pick your avatar and start playing instantly.
          </p>

          {/* Steps */}
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { n: '1', label: 'Enter the session PIN', color: '#AAFF00' },
              { n: '2', label: 'Pick your animal avatar', color: '#00E5FF' },
              { n: '3', label: 'Play and compete live!', color: '#FF006E' },
            ].map(s => (
              <div key={s.n} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '12px 18px', textAlign: 'left',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: `${s.color}22`, border: `1.5px solid ${s.color}66`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, color: s.color, fontFamily: 'Fredoka',
                }}>{s.n}</div>
                <span style={{ color: '#F0E6FF', fontWeight: 600, fontSize: 14, fontFamily: 'Nunito' }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Avatar preview strip */}
          <div style={{ marginTop: 32, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            {avatars.slice(0, 8).map(av => (
              <div key={av.id} style={{
                width: 40, height: 40, borderRadius: '50%',
                background: `${av.color}18`, border: `1px solid ${av.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{av.emoji}</div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(240,230,255,0.3)', marginTop: 10, fontFamily: 'Nunito' }}>
            12 avatars to choose from
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
          marginBottom: 36, padding: '7px 14px', fontFamily: 'Nunito', fontWeight: 600,
          width: 'fit-content', transition: 'all 0.18s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>

        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)',
            borderRadius: 100, padding: '4px 16px', fontSize: 12,
            color: '#AAFF00', fontWeight: 800, marginBottom: 18,
            fontFamily: 'Fredoka', letterSpacing: '0.08em',
          }}>
            👾 GUEST MODE
          </div>
          <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: 30, fontWeight: 700, margin: '0 0 8px', color: '#F0E6FF' }}>
            {step === 'pin' ? 'Join a session' : 'Pick your character!'}
          </h1>
          <p style={{ color: 'rgba(240,230,255,0.45)', margin: 0, fontSize: 14, fontFamily: 'Nunito' }}>
            {step === 'pin'
              ? 'Enter the PIN shown on your teacher\'s screen'
              : 'Choose your avatar and enter a nickname'}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {(['pin', 'avatar'] as const).map((s, i) => (
            <div key={s} style={{
              height: 4, flex: 1, borderRadius: 2,
              background: step === s || (s === 'pin' && step === 'avatar')
                ? 'linear-gradient(90deg, #AAFF00, #00E5FF)'
                : 'rgba(255,255,255,0.1)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* ── PIN step ── */}
        {step === 'pin' && (
          <div>
            <input
              value={pin}
              onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setPinError('') }}
              placeholder="PIN CODE"
              inputMode="numeric"
              style={{
                width: '100%', padding: '20px', fontSize: 36,
                fontFamily: 'Fredoka, sans-serif', fontWeight: 700,
                textAlign: 'center', letterSpacing: '16px',
                marginBottom: 8, boxSizing: 'border-box',
              }}
            />
            {pinError && (
              <p style={{ fontSize: 13, color: '#FF006E', margin: '0 0 14px', textAlign: 'center', fontFamily: 'Nunito', fontWeight: 600 }}>
                ⚠️ {pinError}
              </p>
            )}

            <button
              onClick={handlePinNext}
              className="btn-neon"
              style={{
                width: '100%', padding: '14px', marginTop: 8,
                background: 'linear-gradient(135deg, #AAFF00 0%, #00E5FF 100%)',
                color: '#0D0221', border: 'none', borderRadius: 14,
                fontWeight: 800, fontSize: 16, cursor: 'pointer',
                fontFamily: 'Fredoka', letterSpacing: '0.05em',
                boxShadow: '0 0 30px rgba(170,255,0,0.4), 0 8px 24px rgba(170,255,0,0.2)',
              }}
            >
              Continue →
            </button>

            <button
              onClick={() => { setPin('4729'); setTimeout(handlePinNext, 120) }}
              style={{
                width: '100%', marginTop: 10, padding: '12px',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(240,230,255,0.45)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito',
              }}
            >
              💡 Use demo PIN (4729)
            </button>
          </div>
        )}

        {/* ── Avatar step ── */}
        {step === 'avatar' && (
          <div>
            {/* Selected preview */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto',
                background: `${selected.color}18`, border: `3px solid ${selected.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 44,
                boxShadow: `0 0 28px ${selected.color}55, 0 0 70px ${selected.color}22`,
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}>
                {selected.emoji}
              </div>
            </div>

            {/* Avatar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8, marginBottom: 20 }}>
              {avatars.map(av => (
                <button
                  key={av.id}
                  onClick={() => setSelected(av)}
                  style={{
                    aspectRatio: '1', borderRadius: 12,
                    border: `2px solid ${selected.id === av.id ? av.color : 'rgba(255,255,255,0.08)'}`,
                    background: selected.id === av.id ? `${av.color}22` : 'rgba(255,255,255,0.03)',
                    fontSize: 22, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                    transform: selected.id === av.id ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: selected.id === av.id ? `0 0 12px ${av.color}55` : 'none',
                  }}
                >
                  {av.emoji}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,230,255,0.7)', display: 'block', marginBottom: 7, fontFamily: 'Nunito' }}>Nickname (optional)</label>
              <input
                value={nickname} onChange={e => setNickname(e.target.value)}
                placeholder="SuperPlayer42" maxLength={20}
                style={{
                  width: '100%', padding: '12px 16px', fontSize: 15,
                  fontFamily: 'Fredoka, sans-serif', fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              onClick={handleJoin}
              className="btn-neon"
              style={{
                width: '100%', padding: '14px',
                background: `linear-gradient(135deg, ${selected.color} 0%, ${selected.color}BB 100%)`,
                color: '#fff', border: 'none', borderRadius: 14,
                fontWeight: 800, fontSize: 16, cursor: 'pointer',
                fontFamily: 'Fredoka', letterSpacing: '0.05em',
                boxShadow: `0 0 30px ${selected.color}55, 0 8px 24px ${selected.color}33`,
              }}
            >
              {selected.emoji} Join the Game!
            </button>

            <button
              onClick={() => setStep('pin')}
              style={{
                width: '100%', marginTop: 10, padding: '10px',
                background: 'transparent', color: 'rgba(240,230,255,0.35)',
                border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito',
              }}
            >
              ← Change PIN
            </button>
          </div>
        )}

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'rgba(240,230,255,0.3)', margin: '0 0 8px', fontFamily: 'Nunito' }}>
            Want to save your scores?
          </p>
          <button onClick={onRegister} style={{
            background: 'none', border: 'none', color: '#AAFF00',
            fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Nunito',
          }}>
            Create a free account →
          </button>
        </div>
      </div>
    </div>
  )
}
