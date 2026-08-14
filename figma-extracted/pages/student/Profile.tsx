import { useState } from 'react'

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? '#7C3AED' : '#CBD5E1', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
  </div>
)

interface Props {
  userName: string
  avatar: { emoji: string; color: string; nickname: string }
  onLogout: () => void
}

export default function StudentProfile({ userName, avatar, onLogout }: Props) {
  const [settings, setSettings] = useState({ sound: true, haptic: true, notifications: true, darkMode: false })
  const set = (k: string, v: boolean) => setSettings(prev => ({ ...prev, [k]: v }))

  return (
    <div style={{ padding: '20px 16px 84px', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Avatar header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 12px' }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: `${avatar.color}20`, border: `4px solid ${avatar.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>
            {avatar.emoji}
          </div>
          <button style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: '#7C3AED', border: '2px solid #fff', cursor: 'pointer', fontSize: 13, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
        </div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, margin: '0 0 4px', color: '#0F172A' }}>{userName}</h2>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>2ème A Info · Student</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
          <span style={{ background: '#F5F3FF', color: '#7C3AED', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>🎓 2024-2025</span>
          <span style={{ background: '#F0FDF4', color: '#16A34A', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>✓ Active</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { val: '12', label: 'Quizzes', color: '#2563EB' },
          { val: '75%', label: 'Avg Score', color: '#7C3AED' },
          { val: '4', label: 'Badges', color: '#F0A500' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '14px 8px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Edit profile */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '18px', marginBottom: 16 }}>
        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, margin: '0 0 14px', color: '#0F172A' }}>Profile Information</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Full Name', val: userName },
            { label: 'Email', val: 'amira.khaldi@etud.edu' },
            { label: 'Class', val: '2ème A Info' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input defaultValue={f.val} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#F8FAFC' }}
                onFocus={e => (e.target.style.borderColor = '#7C3AED')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
            </div>
          ))}
        </div>
        <button style={{ marginTop: 14, padding: '10px', width: '100%', background: 'linear-gradient(90deg,#7C3AED,#6D28D9)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          Save Changes
        </button>
      </div>

      {/* Preferences */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '18px', marginBottom: 16 }}>
        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, margin: '0 0 14px', color: '#0F172A' }}>Preferences</h4>
        {[
          { key: 'sound', label: 'Sound Effects', desc: 'Play sounds during quiz sessions' },
          { key: 'haptic', label: 'Haptic Feedback', desc: 'Vibration on answer submission' },
          { key: 'notifications', label: 'Notifications', desc: 'Get notified for new sessions' },
          { key: 'darkMode', label: 'Dark Mode', desc: 'Use dark theme' },
        ].map(item => (
          <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #F8FAFC' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{item.desc}</div>
            </div>
            <Toggle value={settings[item.key as keyof typeof settings]} onChange={v => set(item.key, v)} />
          </div>
        ))}
      </div>

      {/* Language */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '18px', marginBottom: 16 }}>
        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, margin: '0 0 12px', color: '#0F172A' }}>Language</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ code: 'fr', flag: '🇫🇷', name: 'Français' }, { code: 'ar', flag: '🇩🇿', name: 'العربية' }, { code: 'en', flag: '🇬🇧', name: 'English' }].map(l => (
            <button key={l.code} style={{
              flex: 1, padding: '10px 6px', borderRadius: 10, border: `2px solid ${l.code === 'fr' ? '#7C3AED' : '#E2E8F0'}`,
              background: l.code === 'fr' ? '#F5F3FF' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: l.code === 'fr' ? 700 : 400, color: l.code === 'fr' ? '#7C3AED' : '#64748B',
            }}>
              {l.flag} {l.name}
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button onClick={onLogout} style={{
        width: '100%', padding: '14px', background: '#FFF5F5', color: '#DC2626',
        border: '1.5px solid #FEE2E2', borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        🚪 Logout
      </button>
    </div>
  )
}
