const recentQuizzes = [
  { title: 'Algèbre Linéaire Ch.3', subject: 'Mathematics', score: 85, date: 'Today', rank: 2, total: 34, emoji: '📐' },
  { title: 'POO Java – Héritage', subject: 'CS', score: 72, date: 'Yesterday', rank: 5, total: 41, emoji: '💻' },
  { title: 'Thermodynamique QCM', subject: 'Physics', score: 91, date: '3 days ago', rank: 1, total: 28, emoji: '🔥' },
]

const badges = [
  { icon: '🏆', name: 'Top Scorer', desc: 'First place', color: '#F0A500', earned: true },
  { icon: '⚡', name: 'Speed Demon', desc: 'Fastest answer', color: '#2563EB', earned: true },
  { icon: '🔥', name: '5 Streak', desc: '5 correct in a row', color: '#DC2626', earned: true },
  { icon: '🌟', name: 'Perfect', desc: '100% score', color: '#7C3AED', earned: false },
  { icon: '📚', name: 'Scholar', desc: '20 quizzes done', color: '#16A34A', earned: false },
  { icon: '🎯', name: 'Sharpshooter', desc: '90%+ accuracy', color: '#0891B2', earned: true },
]

interface Props {
  userName: string
  avatar: { emoji: string; color: string }
  onNav: (page: string) => void
}

export default function StudentHome({ userName, avatar, onNav }: Props) {
  const first = userName.split(' ')[0]

  return (
    <div style={{ padding: '20px 16px 84px', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Greeting */}
      <div style={{
        background: 'linear-gradient(135deg,#7C3AED,#6D28D9)',
        borderRadius: 18, padding: '20px 18px', marginBottom: 20, color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', right: 20, bottom: -30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${avatar.color}30`, border: `2px solid ${avatar.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            {avatar.emoji}
          </div>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: 13, opacity: 0.8 }}>Hey there!</p>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, margin: 0 }}>Hello, {first} 👋</h2>
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 12, position: 'relative' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22 }}>12</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Quizzes done</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22 }}>78%</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Avg score</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22 }}>4</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Badges</div>
          </div>
        </div>
      </div>

      {/* Join quiz CTA */}
      <div style={{
        background: '#fff', borderRadius: 18, padding: '18px', marginBottom: 20,
        border: '2px solid #EDE9FE', boxShadow: '0 4px 16px rgba(124,58,237,0.08)',
      }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 17, margin: '0 0 12px', color: '#0F172A' }}>
          🎮 Join a quiz now
        </h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onNav('student-join')} style={{
            flex: 1, padding: '13px', background: 'linear-gradient(90deg,#7C3AED,#6D28D9)',
            color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15,
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          }}>
            Enter PIN
          </button>
          <button style={{
            padding: '13px 16px', background: '#F5F3FF', color: '#7C3AED',
            border: '2px solid #EDE9FE', borderRadius: 12, fontWeight: 700, fontSize: 14,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            📷 Scan QR
          </button>
        </div>
      </div>

      {/* Badges */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, margin: '0 0 12px', color: '#0F172A' }}>
          🏅 Your Badges
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {badges.map(b => (
            <div key={b.name} style={{
              background: b.earned ? '#fff' : '#F8FAFC', borderRadius: 12, padding: '12px 8px', textAlign: 'center',
              border: `1.5px solid ${b.earned ? b.color + '40' : '#F1F5F9'}`,
              opacity: b.earned ? 1 : 0.5, transition: 'transform 0.15s',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', margin: '0 auto 6px',
                background: b.earned ? `${b.color}20` : '#F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 11, color: '#0F172A' }}>{b.name}</div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent quizzes */}
      <div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, margin: '0 0 12px', color: '#0F172A' }}>
          📋 Recent Sessions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recentQuizzes.map((q, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '14px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {q.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{q.title}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{q.subject} · {q.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18, color: q.score >= 80 ? '#16A34A' : q.score >= 60 ? '#D97706' : '#DC2626' }}>{q.score}%</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>#{q.rank}/{q.total}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
