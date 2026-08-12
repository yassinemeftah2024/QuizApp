import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const kpis = [
  { label: 'Total Teachers', value: '48', change: '+3 this month', color: '#2563EB', bg: '#EFF6FF', icon: '👨‍🏫' },
  { label: 'Total Students', value: '1,284', change: '+67 this month', color: '#7C3AED', bg: '#F5F3FF', icon: '📚' },
  { label: 'Active Sessions Today', value: '12', change: '3 ongoing now', color: '#16A34A', bg: '#F0FDF4', icon: '⚡' },
  { label: 'Quizzes Created', value: '347', change: '+24 this week', color: '#D97706', bg: '#FFFBEB', icon: '📝' },
]

const weekData = [
  { day: 'Mon', sessions: 8, students: 180 },
  { day: 'Tue', sessions: 14, students: 320 },
  { day: 'Wed', sessions: 11, students: 248 },
  { day: 'Thu', sessions: 18, students: 410 },
  { day: 'Fri', sessions: 22, students: 490 },
  { day: 'Sat', sessions: 5, students: 90 },
  { day: 'Sun', sessions: 3, students: 60 },
]

const scoreData = [
  { month: 'Jan', avg: 62 }, { month: 'Feb', avg: 67 }, { month: 'Mar', avg: 71 },
  { month: 'Apr', avg: 69 }, { month: 'May', avg: 74 }, { month: 'Jun', avg: 78 },
]

const subjectData = [
  { name: 'Mathematics', value: 34, color: '#2563EB' },
  { name: 'Physics', value: 24, color: '#7C3AED' },
  { name: 'Computer Science', value: 28, color: '#16A34A' },
  { name: 'French', value: 14, color: '#D97706' },
]

const recentSessions = [
  { title: 'Algèbre Linéaire – Ch.3', teacher: 'Prof. Benali', students: 34, avg: 72, status: 'completed', date: 'Today, 10:30' },
  { title: 'Thermodynamique QCM', teacher: 'Dr. Meziane', students: 28, avg: 65, status: 'live', date: 'Now' },
  { title: 'POO Java – Héritage', teacher: 'Prof. Khaldi', students: 41, avg: 81, status: 'completed', date: 'Today, 09:00' },
  { title: 'Grammaire Avancée', teacher: 'Mme. Oukil', students: 22, avg: 68, status: 'completed', date: 'Yesterday' },
  { title: 'Circuits Logiques', teacher: 'Dr. Ramdane', students: 37, avg: 77, status: 'completed', date: 'Yesterday' },
]

const StatusPill = ({ status }: { status: string }) => {
  const cfg = status === 'live'
    ? { bg: '#F0FDF4', color: '#16A34A', label: '● Live' }
    : { bg: '#F1F5F9', color: '#64748B', label: 'Completed' }
  return (
    <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
      {cfg.label}
    </span>
  )
}

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('This Week')

  return (
    <div style={{ padding: 28, background: '#F8FAFC', minHeight: '100%' }} className="animate-fade-in">
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>Tuesday, 29 July 2025</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Today', 'This Week', 'This Month'].map(r => (
            <button key={r} onClick={() => setDateRange(r)} style={{
              padding: '7px 14px', borderRadius: 8, border: '1px solid #E2E8F0',
              background: dateRange === r ? '#2563EB' : '#fff',
              color: dateRange === r ? '#fff' : '#64748B',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} className="card-hover" style={{
            background: '#fff', borderRadius: 14, padding: '20px', border: '1px solid #E2E8F0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 13, color: '#64748B', fontWeight: 500 }}>{k.label}</p>
                <p style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>{k.value}</p>
                <p style={{ margin: 0, fontSize: 12, color: k.color, fontWeight: 500 }}>{k.change}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                {k.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Sessions per week */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#0F172A' }}>Sessions This Week</h3>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Daily active sessions & participants</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }} />
              <Bar dataKey="sessions" fill="#2563EB" radius={[4, 4, 0, 0]} name="Sessions" />
              <Bar dataKey="students" fill="#EDE9FE" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average score trend */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#0F172A' }}>Average Score Trend</h3>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Platform-wide average score per month</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={scoreData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 90]} tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }} />
              <Area type="monotone" dataKey="avg" stroke="#7C3AED" fill="url(#scoreGrad)" strokeWidth={2.5} name="Avg Score %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: sessions table + subjects pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Recent sessions */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, margin: 0 }}>Latest Sessions</h3>
            <button style={{ fontSize: 13, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Quiz', 'Teacher', 'Students', 'Avg Score', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#64748B', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((s, i) => (
                <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{s.title}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.teacher}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.students}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontWeight: 700, color: s.avg >= 75 ? '#16A34A' : s.avg >= 60 ? '#D97706' : '#DC2626', fontSize: 14 }}>{s.avg}%</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}><StatusPill status={s.status} /></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#94A3B8' }}>{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subject distribution */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Quizzes by Subject</h3>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Distribution across departments</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={subjectData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {subjectData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {subjectData.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: '#64748B' }}>{s.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
