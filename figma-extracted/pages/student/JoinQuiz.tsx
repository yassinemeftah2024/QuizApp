import { useState } from 'react'

interface Props {
  onJoin: (pin: string) => void
}

export default function StudentJoinQuiz({ onJoin }: Props) {
  const [pin, setPin] = useState('')
  const [phase, setPhase] = useState<'input' | 'found' | 'waiting'>('input')
  const [error, setError] = useState('')

  const handleJoin = () => {
    if (pin.length < 4) { setError('Enter a valid 4-digit PIN'); return }
    setError('')
    setPhase('found')
  }

  const handleConfirm = () => {
    setPhase('waiting')
    setTimeout(() => onJoin(pin), 1500)
  }

  return (
    <div style={{ padding: '24px 16px 84px', minHeight: '100vh', background: '#F8FAFC' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 24, margin: '0 0 6px', color: '#0F172A' }}>Join a Quiz</h1>
      <p style={{ color: '#64748B', margin: '0 0 28px', fontSize: 14 }}>Enter the PIN shared by your teacher</p>

      {phase === 'input' && (
        <div className="animate-fade-in">
          <div style={{ background: '#fff', borderRadius: 18, padding: '24px', border: '1px solid #E2E8F0', marginBottom: 16 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>Session PIN</label>
            <input
              value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
              placeholder="e.g. 4729"
              maxLength={6}
              style={{
                width: '100%', padding: '16px', border: `2px solid ${error ? '#DC2626' : '#E2E8F0'}`,
                borderRadius: 14, fontSize: 32, outline: 'none', boxSizing: 'border-box',
                textAlign: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                letterSpacing: 12, background: '#F8FAFC', transition: 'border 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = '#7C3AED')}
              onBlur={e => (e.target.style.borderColor = error ? '#DC2626' : '#E2E8F0')}
            />
            {error && <p style={{ fontSize: 13, color: '#DC2626', margin: '8px 0 0', textAlign: 'center' }}>{error}</p>}

            <button onClick={handleJoin} style={{
              width: '100%', marginTop: 16, padding: '15px', background: 'linear-gradient(90deg,#7C3AED,#6D28D9)',
              color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16,
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            }}>Join Session →</button>
          </div>

          <div style={{ textAlign: 'center', color: '#94A3B8', margin: '20px 0', fontSize: 14 }}>— or —</div>

          <div style={{ background: '#fff', borderRadius: 18, padding: '24px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17, margin: '0 0 8px', color: '#0F172A' }}>Scan QR Code</h3>
            <p style={{ color: '#64748B', fontSize: 13, margin: '0 0 16px' }}>Point your camera at the QR code displayed by your teacher</p>
            <button style={{ padding: '12px 28px', background: '#F5F3FF', color: '#7C3AED', border: '2px solid #EDE9FE', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Open Camera
            </button>
          </div>

          {/* Quick PIN demo */}
          <div style={{ marginTop: 20, background: '#FFFBEB', borderRadius: 14, padding: '14px 18px', border: '1px solid #FEF3C7' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: '#92400E', fontWeight: 600 }}>💡 Try demo: use PIN</p>
            <button onClick={() => { setPin('4729'); setTimeout(handleJoin, 100) }} style={{
              padding: '8px 16px', background: '#D97706', color: '#fff', border: 'none',
              borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', letterSpacing: 4,
            }}>4729</button>
          </div>
        </div>
      )}

      {phase === 'found' && (
        <div className="animate-bounce-in" style={{ background: '#fff', borderRadius: 18, padding: '28px 24px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F0FDF4', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>✓</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, margin: '0 0 8px', color: '#0F172A' }}>Session found!</h2>
          <div style={{ background: '#F8FAFC', borderRadius: 14, padding: '16px', margin: '16px 0 24px' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18, color: '#0F172A', marginBottom: 4 }}>Algèbre Linéaire – Ch.3</div>
            <div style={{ fontSize: 13, color: '#64748B' }}>Prof. Sarah Benali</div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>15 questions · Exam mode · 27 players connected</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setPhase('input')} style={{ flex: 1, padding: '13px', background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleConfirm} style={{ flex: 2, padding: '13px', background: 'linear-gradient(90deg,#7C3AED,#6D28D9)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              Join Now! 🚀
            </button>
          </div>
        </div>
      )}

      {phase === 'waiting' && (
        <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⏳</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 24, margin: '0 0 8px', color: '#0F172A' }}>Joining session…</h2>
          <p style={{ color: '#64748B', fontSize: 15 }}>Waiting for the teacher to start</p>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: '#7C3AED', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-12px)} }`}</style>
        </div>
      )}
    </div>
  )
}
