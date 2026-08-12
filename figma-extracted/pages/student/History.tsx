const history = [
  { title: 'Algèbre Linéaire Ch.3', subject: 'Mathematics', date: 'Jul 29, 2025', score: 85, rank: 2, total: 34, mode: 'Exam', difficulty: 'Medium', emoji: '📐' },
  { title: 'POO Java – Héritage', subject: 'CS', date: 'Jul 28, 2025', score: 72, rank: 5, total: 41, mode: 'Training', difficulty: 'Easy', emoji: '💻' },
  { title: 'Thermodynamique QCM', subject: 'Physics', date: 'Jul 25, 2025', score: 91, rank: 1, total: 28, mode: 'Challenge', difficulty: 'Hard', emoji: '🔥' },
  { title: 'Circuits Logiques', subject: 'Electronics', date: 'Jul 22, 2025', score: 68, rank: 8, total: 37, mode: 'Exam', difficulty: 'Hard', emoji: '⚡' },
  { title: 'Bases SQL Avancées', subject: 'CS', date: 'Jul 18, 2025', score: 79, rank: 4, total: 30, mode: 'Training', difficulty: 'Medium', emoji: '🗄️' },
  { title: 'Analyse Mathématique', subject: 'Mathematics', date: 'Jul 15, 2025', score: 55, rank: 12, total: 34, mode: 'Exam', difficulty: 'Hard', emoji: '∫' },
]

const badges = [
  { icon: '🏆', name: 'Top Scorer', desc: '1st place in class', date: 'Jul 25, 2025', color: '#F0A500' },
  { icon: '⚡', name: 'Speed Demon', desc: 'Fastest answer', date: 'Jul 28, 2025', color: '#2563EB' },
  { icon: '🔥', name: '5 Streak', desc: '5 correct in a row', date: 'Jul 22, 2025', color: '#DC2626' },
  { icon: '🎯', name: 'Sharpshooter', desc: '90%+ accuracy', date: 'Jul 25, 2025', color: '#0891B2' },
  { icon: '🌟', name: 'Perfect', desc: '100% score', date: '—', color: '#94A3B8', locked: true },
  { icon: '📚', name: 'Scholar', desc: '20 quizzes done', date: '—', color: '#94A3B8', locked: true },
]

const diffColors: Record<string, { bg: string; color: string }> = {
  Easy: { bg: '#F0FDF4', color: '#16A34A' },
  Medium: { bg: '#FFFBEB', color: '#D97706' },
  Hard: { bg: '#FFF5F5', color: '#DC2626' },
}

export default function StudentHistory() {
  return (
    <div style={{ padding: '20px 16px 84px', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Quizzes', val: '12', icon: '📝', color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Avg Score', val: '75%', icon: '📊', color: '#7C3AED', bg: '#F5F3FF' },
          { label: 'Best Rank', val: '#1', icon: '🏅', color: '#F0A500', bg: '#FFFBEB' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '14px 10px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges section */}
      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, margin: '0 0 12px', color: '#0F172A' }}>🏅 Your Badges</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
        {badges.map(b => (
          <div key={b.name} style={{
            background: '#fff', borderRadius: 14, padding: '14px 8px', textAlign: 'center',
            border: `1.5px solid ${(b as any).locked ? '#F1F5F9' : b.color + '40'}`,
            opacity: (b as any).locked ? 0.45 : 1,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', margin: '0 auto 8px',
              background: (b as any).locked ? '#F1F5F9' : `${b.color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              border: `2px solid ${(b as any).locked ? '#E2E8F0' : b.color + '60'}`,
            }}>{b.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#0F172A', marginBottom: 2 }}>{b.name}</div>
            <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: (b as any).locked ? 0 : 4 }}>{b.desc}</div>
            {!(b as any).locked && <div style={{ fontSize: 10, color: b.color, fontWeight: 600 }}>{b.date}</div>}
            {(b as any).locked && <div style={{ fontSize: 10, color: '#CBD5E1' }}>🔒 Locked</div>}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, margin: '0 0 12px', color: '#0F172A' }}>📋 Quiz History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {history.map((h, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {h.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{h.date}</span>
                <span style={{ ...diffColors[h.difficulty], borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 600 }}>{h.difficulty}</span>
                <span style={{ background: '#F1F5F9', color: '#64748B', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 500 }}>{h.mode}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18, color: h.score >= 80 ? '#16A34A' : h.score >= 60 ? '#D97706' : '#DC2626' }}>{h.score}%</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>#{h.rank}/{h.total}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
