interface Props {
  nickname: string
  avatar: { emoji: string; color: string }
  onRegister: () => void
  onPlayAgain: () => void
}

export default function GuestPostQuiz({ nickname, avatar, onRegister, onPlayAgain }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }} className="animate-fade-in">
        {/* Score hero */}
        <div style={{
          background: 'linear-gradient(135deg,#0F172A,#1E293B)', borderRadius: 20, padding: '28px 20px',
          textAlign: 'center', marginBottom: 16, color: '#fff', overflow: 'hidden', position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(37,99,235,0.1)' }} />
          <div style={{ fontSize: 56, marginBottom: 8 }}>{avatar.emoji}</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, margin: '0 0 4px' }}>{nickname}</h2>
          <p style={{ opacity: 0.7, fontSize: 13, margin: '0 0 16px' }}>Guest Player</p>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 54, lineHeight: 1 }}>68%</div>
          <div style={{ opacity: 0.75, fontSize: 15 }}>Final Score</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18 }}>#7</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>Rank</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18 }}>680 pts</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>Score</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18 }}>7/10</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>Correct</div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
            <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, margin: 0 }}>🏆 Final Standings</h4>
          </div>
          {[
            { rank: 1, name: 'Amira K.', score: 950, emoji: '🦊' },
            { rank: 2, name: 'Youssef B.', score: 900, emoji: '🐼' },
            { rank: 3, name: 'Rania S.', score: 850, emoji: '🦁' },
            { rank: 7, name: nickname + ' (you)', score: 680, emoji: avatar.emoji, isMe: true },
          ].map((p, i) => (
            <div key={i} style={{
              padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: i < 3 ? '1px solid #F8FAFC' : 'none',
              background: (p as any).isMe ? '#EFF6FF' : 'transparent',
            }}>
              <span style={{ fontSize: p.rank <= 3 ? 18 : 12, fontWeight: 700, color: '#94A3B8', width: 24, flexShrink: 0 }}>
                {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`}
              </span>
              <span style={{ fontSize: 20 }}>{p.emoji}</span>
              <span style={{ flex: 1, fontWeight: (p as any).isMe ? 700 : 500, fontSize: 14, color: (p as any).isMe ? '#2563EB' : '#0F172A' }}>{p.name}</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 15, color: (p as any).isMe ? '#2563EB' : '#0F172A' }}>{p.score}</span>
            </div>
          ))}
        </div>

        {/* Account prompt */}
        <div style={{
          background: 'linear-gradient(135deg,#EFF6FF,#F5F3FF)', borderRadius: 16, padding: '20px 18px',
          border: '1px solid #DBEAFE', marginBottom: 16,
        }}>
          <div style={{ fontSize: 28, textAlign: 'center', marginBottom: 8 }}>💾</div>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, margin: '0 0 6px', color: '#0F172A', textAlign: 'center' }}>Save your progress!</h3>
          <p style={{ fontSize: 13, color: '#64748B', textAlign: 'center', margin: '0 0 14px' }}>
            Create a free account to track your scores, earn badges, and compete on the leaderboard
          </p>
          <button onClick={onRegister} style={{
            width: '100%', padding: '13px', background: 'linear-gradient(90deg,#2563EB,#7C3AED)',
            color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15,
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          }}>
            🚀 Create Free Account
          </button>
        </div>

        <button onClick={onPlayAgain} style={{
          width: '100%', padding: '13px', background: '#F8FAFC', color: '#64748B',
          border: '1px solid #E2E8F0', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer',
        }}>
          Join another quiz
        </button>
      </div>
    </div>
  )
}
