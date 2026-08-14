const leaderboard = [
  { rank: 1, name: 'Amira K.', score: 950, emoji: '🦊', color: '#FF6B35' },
  { rank: 2, name: 'Youssef B.', score: 900, emoji: '🐼', color: '#4A9B7F' },
  { rank: 3, name: 'Rania S.', score: 850, emoji: '🦁', color: '#F0A500' },
  { rank: 4, name: 'Omar B.', score: 800, emoji: '🐨', color: '#7B8FA6' },
  { rank: 5, name: 'You!', score: 750, emoji: '🦄', color: '#C770CF', isMe: true },
  { rank: 6, name: 'Lina R.', score: 700, emoji: '🐺', color: '#5B6B7D' },
  { rank: 7, name: 'Nassim A.', score: 620, emoji: '🐯', color: '#E67E22' },
]

interface Props {
  avatar: { emoji: string; color: string; nickname: string }
  onHome: () => void
}

export default function StudentScore({ avatar, onHome }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '20px 16px 84px' }}>
      {/* Hero result */}
      <div style={{
        background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
        borderRadius: 20, padding: '28px 20px', textAlign: 'center', marginBottom: 20, color: '#fff', overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ fontSize: 56, marginBottom: 8 }}>{avatar.emoji}</div>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 56, lineHeight: 1 }}>75%</div>
        <div style={{ opacity: 0.8, fontSize: 16, marginBottom: 16 }}>Your final score</div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Rank', val: '#5', icon: '🏅' },
            { label: 'Score', val: '750 pts', icon: '⭐' },
            { label: 'Accuracy', val: '80%', icon: '🎯' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18 }}>{s.val}</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 16, border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Progress to next badge</span>
          <span style={{ fontSize: 13, color: '#7C3AED', fontWeight: 700 }}>75 / 100 XP</span>
        </div>
        <div style={{ height: 10, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '75%', background: 'linear-gradient(90deg,#7C3AED,#2563EB)', borderRadius: 5 }} />
        </div>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: '8px 0 0' }}>25 XP until you unlock "Sharpshooter" 🎯</p>
      </div>

      {/* Leaderboard */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, margin: 0 }}>🏆 Session Leaderboard</h3>
        </div>
        {leaderboard.map((p, i) => (
          <div key={i} style={{
            padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12,
            borderBottom: i < leaderboard.length - 1 ? '1px solid #F8FAFC' : 'none',
            background: (p as any).isMe ? '#F5F3FF' : 'transparent',
            border: (p as any).isMe ? '2px solid #EDE9FE' : 'none',
          }}>
            <span style={{ fontSize: p.rank <= 3 ? 22 : 13, fontWeight: 700, color: '#94A3B8', width: 28, textAlign: 'center', flexShrink: 0 }}>
              {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`}
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${p.color}20`, border: `2px solid ${p.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
              {p.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: (p as any).isMe ? 800 : 600, fontSize: 14, color: (p as any).isMe ? '#7C3AED' : '#0F172A' }}>
                {p.name} {(p as any).isMe && '← You'}
              </div>
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 16, color: (p as any).isMe ? '#7C3AED' : '#0F172A' }}>
              {p.score}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onHome} style={{
          flex: 1, padding: '14px', background: '#F5F3FF', color: '#7C3AED',
          border: '2px solid #EDE9FE', borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer',
        }}>← Home</button>
        <button style={{
          flex: 2, padding: '14px', background: 'linear-gradient(90deg,#7C3AED,#6D28D9)',
          color: '#fff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 15,
          cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
        }}>📊 View Details</button>
      </div>
    </div>
  )
}
