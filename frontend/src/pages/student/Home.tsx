import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import api from '@/services/api'

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
  onNav: (page: string) => void
}

export default function StudentHome({ onNav }: Props) {
  const { user } = useAuth()
  const first = user ? user.prenom : 'Student'
  
  // Mapping of animal to emoji (this can be expanded or we can just use a default)
  const getAvatarEmoji = (animal?: string) => {
    const map: Record<string, string> = {
      Lion: '🦁', Tiger: '🐯', Eagle: '🦅', Dolphin: '🐬',
      Fox: '🦊', Panda: '🐼', Dragon: '🐉', Unicorn: '🦄'
    }
    return map[animal || ''] || '🦊'
  }
  
  const getAvatarColor = (animal?: string) => {
    const map: Record<string, string> = {
      Lion: '#F59E0B', Tiger: '#F97316', Eagle: '#3B82F6', Dolphin: '#06B6D4',
      Fox: '#EF4444', Panda: '#10B981', Dragon: '#EF4444', Unicorn: '#8B5CF6'
    }
    return map[animal || ''] || '#EF4444'
  }

  const emoji = getAvatarEmoji(user?.avatarAnimal)
  const color = getAvatarColor(user?.avatarAnimal)
  const [profile, setProfile] = useState<any>(null)
  useEffect(() => { api.get('/profile/me').then(response => setProfile(response.data)).catch(() => {}) }, [])

  return (
    <div className="animate-fade-in dashboard-shell" style={{ padding: '24px 20px 84px', minHeight: '100vh' }}>
      <div className="dashboard-hero" style={{ padding: '26px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: `${color}20`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{emoji}</div>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.8 }}>Welcome back</p>
            <h2 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800 }}>Hello, {first} 👋</h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
          <div className="dashboard-card" style={{ flex: '1 1 160px', minWidth: 140, padding: 16 }}>
            <p style={{ margin: 0, color: '#64748B', fontSize: 12, fontWeight: 700 }}>Quizzes done</p>
            <p style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 800, color: '#0F172A' }}>12</p>
          </div>
          <div className="dashboard-card" style={{ flex: '1 1 160px', minWidth: 140, padding: 16 }}>
            <p style={{ margin: 0, color: '#64748B', fontSize: 12, fontWeight: 700 }}>Average score</p>
            <p style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 800, color: '#0F172A' }}>78%</p>
          </div>
          <div className="dashboard-card" style={{ flex: '1 1 160px', minWidth: 140, padding: 16 }}>
            <p style={{ margin: 0, color: '#64748B', fontSize: 12, fontWeight: 700 }}>Badges earned</p>
            <p style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 800, color: '#0F172A' }}>4</p>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>My class</p>
            <h3 style={{ margin: '8px 0 4px', fontSize: 20, color: '#0F172A' }}>{profile?.classeNom || 'No class assigned yet'}</h3>
            <p style={{ margin: 0, color: '#64748B', fontSize: 13 }}>{profile?.classeNiveau || ''}{profile?.classeSection ? ` · Section ${profile.classeSection}` : ''}</p>
          </div>
          <span className="profile-chip">Student</span>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: 22, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Join a quiz now</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => onNav('student-join')} className="action-button" style={{ flex: '1 1 260px', background: 'linear-gradient(90deg,#7C3AED,#6D28D9)', color: '#fff', border: 'none' }}>Enter PIN</button>
          <button className="action-button" style={{ flex: '1 1 160px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#2563EB' }}>📷 Scan QR</button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0F172A' }}>🏅 Your Badges</h3>
          <span style={{ color: '#64748B', fontSize: 13 }}>Keep it up — 4 more to unlock!</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 14 }}>
          {badges.map(b => (
            <div key={b.name} className="dashboard-card" style={{ padding: 14, textAlign: 'center', opacity: b.earned ? 1 : 0.65 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, background: b.earned ? `${b.color}20` : '#F1F5F9' }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{b.name}</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0F172A' }}>📋 Recent Sessions</h3>
          <span style={{ color: '#64748B', fontSize: 13 }}>Your latest quiz activity at a glance.</span>
        </div>
        <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
          {recentQuizzes.map((q, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: '#F8FAFC', borderRadius: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{q.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{q.title}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{q.subject} · {q.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: 17, color: q.score >= 80 ? '#16A34A' : q.score >= 60 ? '#D97706' : '#DC2626' }}>{q.score}%</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>#{q.rank}/{q.total}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
