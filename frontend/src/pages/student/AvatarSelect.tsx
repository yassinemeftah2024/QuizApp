import { useState } from 'react'

const avatars = [
  { id: 'fox', emoji: '🦊', name: 'Shadow Fox', color: '#FF6B35' },
  { id: 'panda', emoji: '🐼', name: 'Chill Panda', color: '#4A9B7F' },
  { id: 'lion', emoji: '🦁', name: 'King Leo', color: '#F0A500' },
  { id: 'koala', emoji: '🐨', name: 'Koala Boss', color: '#7B8FA6' },
  { id: 'unicorn', emoji: '🦄', name: 'Magic Uni', color: '#C770CF' },
  { id: 'wolf', emoji: '🐺', name: 'Night Wolf', color: '#5B6B7D' },
  { id: 'butterfly', emoji: '🦋', name: 'Flutter', color: '#4CA3DD' },
  { id: 'octopus', emoji: '🐙', name: 'Dr. Octo', color: '#C0392B' },
  { id: 'dino', emoji: '🦖', name: 'Dino Rex', color: '#2ECC71' },
  { id: 'frog', emoji: '🐸', name: 'Jump King', color: '#27AE60' },
  { id: 'tiger', emoji: '🐯', name: 'Stripe Tiger', color: '#E67E22' },
  { id: 'eagle', emoji: '🦅', name: 'Sky Eagle', color: '#2980B9' },
  { id: 'dolphin', emoji: '🐬', name: 'Wave Rider', color: '#1ABC9C' },
  { id: 'owl', emoji: '🦉', name: 'Wise Owl', color: '#8E44AD' },
  { id: 'dragon', emoji: '🐲', name: 'Fire Dragon', color: '#E74C3C' },
  { id: 'parrot', emoji: '🦜', name: 'Turbo Parrot', color: '#F39C12' },
  { id: 'bear', emoji: '🐻', name: 'Chill Bear', color: '#A0522D' },
  { id: 'flamingo', emoji: '🦩', name: 'Pink Flam', color: '#FF69B4' },
  { id: 'raccoon', emoji: '🦝', name: 'Night Raider', color: '#708090' },
  { id: 'shark', emoji: '🦈', name: 'Mega Shark', color: '#2F72B8' },
]

interface Props {
  onConfirm: (avatar: { emoji: string; name: string; color: string; nickname: string }) => void
}

export default function AvatarSelect({ onConfirm }: Props) {
  const [selected, setSelected] = useState(avatars[0])
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = () => {
    const name = nickname.trim() || selected.name
    if (name.length < 2) { setError('Name must be at least 2 characters'); return }
    if (name.length > 20) { setError('Name too long (max 20 chars)'); return }
    onConfirm({ ...selected, nickname: name })
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(160deg,#F5F3FF 0%,#EDE9FE 40%,#F8FAFC 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="animate-fade-in">
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 26, textAlign: 'center', margin: '0 0 6px', color: '#0F172A' }}>
          Choose your character!
        </h1>
        <p style={{ textAlign: 'center', color: '#64748B', margin: '0 0 24px', fontSize: 15 }}>Pick an avatar and enter your name</p>

        {/* Selected preview */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="animate-bounce-in" style={{
            width: 90, height: 90, borderRadius: '50%', margin: '0 auto 10px',
            background: `${selected.color}20`, border: `4px solid ${selected.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44,
            boxShadow: `0 0 0 8px ${selected.color}15`,
          }}>
            {selected.emoji}
          </div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17, color: '#0F172A' }}>{selected.name}</div>
        </div>

        {/* Avatar grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginBottom: 20,
          background: '#fff', borderRadius: 16, padding: 12, border: '1px solid #E2E8F0',
        }}>
          {avatars.map(av => (
            <button
              key={av.id}
              onClick={() => setSelected(av)}
              style={{
                width: '100%', aspectRatio: '1', borderRadius: 12, border: `2.5px solid ${selected.id === av.id ? av.color : 'transparent'}`,
                background: selected.id === av.id ? `${av.color}15` : '#F8FAFC',
                fontSize: 28, cursor: 'pointer', transition: 'all 0.15s',
                boxShadow: selected.id === av.id ? `0 0 0 3px ${av.color}25` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {av.emoji}
            </button>
          ))}
        </div>

        {/* Nickname input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
            Your nickname <span style={{ color: '#94A3B8', fontWeight: 400 }}>(or keep the default)</span>
          </label>
          <input
            value={nickname} onChange={e => { setNickname(e.target.value); setError('') }}
            placeholder={selected.name}
            maxLength={20}
            style={{
              width: '100%', padding: '13px 16px', border: `2px solid ${error ? '#DC2626' : '#E2E8F0'}`,
              borderRadius: 12, fontSize: 16, outline: 'none', boxSizing: 'border-box',
              textAlign: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 600,
              background: '#F8FAFC', transition: 'border 0.15s',
            }}
            onFocus={e => (e.target.style.borderColor = selected.color)}
            onBlur={e => (e.target.style.borderColor = error ? '#DC2626' : '#E2E8F0')}
          />
          {error && <p style={{ fontSize: 12, color: '#DC2626', margin: '6px 0 0' }}>{error}</p>}
        </div>

        <button onClick={handleConfirm} style={{
          width: '100%', padding: '15px', borderRadius: 14, border: 'none',
          background: `linear-gradient(90deg, ${selected.color}, ${selected.color}CC)`,
          color: '#fff', fontWeight: 800, fontSize: 17, cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif', boxShadow: `0 4px 16px ${selected.color}40`,
          transition: 'transform 0.1s', letterSpacing: '0.3px',
        }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {selected.emoji} I'm ready — Let's go!
        </button>
      </div>
    </div>
  )
}
