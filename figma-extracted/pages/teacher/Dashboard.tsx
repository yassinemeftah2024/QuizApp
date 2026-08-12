import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const weekData = [
  { day: 'Mon', sessions: 2 }, { day: 'Tue', sessions: 3 },
  { day: 'Wed', sessions: 1 }, { day: 'Thu', sessions: 4 },
  { day: 'Fri', sessions: 3 }, { day: 'Sat', sessions: 0 }, { day: 'Sun', sessions: 0 },
]

const recentQuizzes = [
  { title: 'Algèbre Linéaire – Ch.3', subject: 'Mathematics', questions: 15, status: 'published', lastUsed: 'Today' },
  { title: 'POO Java – Héritage', subject: 'Computer Science', questions: 12, status: 'published', lastUsed: 'Yesterday' },
  { title: 'Thermodynamique Ch.2', subject: 'Physics', questions: 18, status: 'draft', lastUsed: '3 days ago' },
  { title: 'Circuits Logiques – Exam', subject: 'Electronics', questions: 25, status: 'published', lastUsed: '1 week ago' },
]

const activity = [
  { icon: '🚀', text: 'Session started: Algèbre QCM', sub: '34 students joined', time: '10:30 AM', color: '#16A34A' },
  { icon: '🤖', text: 'AI quiz generated from PDF', sub: 'Thermodynamique Ch.4 – 14 questions', time: 'Yesterday', color: '#7C3AED' },
  { icon: '✅', text: 'Quiz published', sub: 'POO Java – Héritage', time: '2 days ago', color: '#2563EB' },
]

interface Props {
  userName: string
  onNav: (page: string) => void
}

export default function TeacherDashboard({ userName, onNav }: Props) {
  const first = userName.split(' ').slice(-1)[0]

  return (
    <div style={{ padding: 28, background: '#F8FAFC', minHeight: '100%' }} className="animate-fade-in">
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg,#1D4ED8 0%,#2563EB 50%,#7C3AED 100%)',
        borderRadius: 16, padding: '24px 28px', marginBottom: 24, color: '#fff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative' }}>
          <p style={{ margin: '0 0 6px', fontSize: 14, opacity: 0.75 }}>Welcome back,</p>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 26, margin: '0 0 8px' }}>
            {userName} 👋
          </h2>
          <p style={{ margin: 0, opacity: 0.75, fontSize: 14 }}>You have 3 sessions scheduled this week. Ready to teach?</p>
        </div>
        <button onClick={() => onNav('teacher-live')} style={{
          background: '#fff', color: '#2563EB', border: 'none', borderRadius: 12,
          padding: '12px 24px', fontWeight: 800, fontSize: 15, cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif', position: 'relative',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)', whiteSpace: 'nowrap',
        }}>
          🚀 Start Live Session
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Active Quizzes', val: '12', icon: '📝', color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Sessions This Week', val: '7', icon: '⚡', color: '#16A34A', bg: '#F0FDF4' },
          { label: 'Avg Student Score', val: '73%', icon: '📊', color: '#7C3AED', bg: '#F5F3FF' },
          { label: 'Students Reached', val: '284', icon: '👥', color: '#D97706', bg: '#FFFBEB' },
        ].map(k => (
          <div key={k.label} className="card-hover" style={{ background: '#fff', borderRadius: 14, padding: '18px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 6px', fontSize: 12, color: '#64748B', fontWeight: 500 }}>{k.label}</p>
                <p style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, color: '#0F172A' }}>{k.val}</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{k.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Sessions chart */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Sessions This Week</h3>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Daily session count</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }} />
              <Bar dataKey="sessions" fill="#2563EB" radius={[4, 4, 0, 0]} name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>{a.text}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{a.sub}</div>
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap' }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick start quizzes */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, margin: 0 }}>Recent Quizzes — Quick Start</h3>
          <button onClick={() => onNav('teacher-quizzes')} style={{ fontSize: 13, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recentQuizzes.map((q, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
              background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#DBEAFE'; (e.currentTarget as HTMLElement).style.background = '#EFF6FF' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#F1F5F9'; (e.currentTarget as HTMLElement).style.background = '#F8FAFC' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18 }}>📝</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{q.title}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{q.subject} · {q.questions} questions · Last used: {q.lastUsed}</div>
              </div>
              <span style={{
                background: q.status === 'published' ? '#F0FDF4' : '#FEF3C7',
                color: q.status === 'published' ? '#16A34A' : '#D97706',
                borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600,
              }}>{q.status}</span>
              <button onClick={() => onNav('teacher-live')} style={{
                background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff',
                border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 700,
                fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Outfit, sans-serif',
              }}>▶ Start</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
