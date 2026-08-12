import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { getAdminStats, type AdminStatsDTO } from '@/services/adminService'

const subjectData = [
  { name: 'Mathematics', value: 34, color: '#2563EB' },
  { name: 'Physics', value: 24, color: '#7C3AED' },
  { name: 'Computer Science', value: 28, color: '#16A34A' },
  { name: 'French', value: 14, color: '#D97706' },
]

const weekData = [
  { day: 'Mon', sessions: 8 }, { day: 'Tue', sessions: 14 },
  { day: 'Wed', sessions: 11 }, { day: 'Thu', sessions: 18 },
  { day: 'Fri', sessions: 22 }, { day: 'Sat', sessions: 5 }, { day: 'Sun', sessions: 3 },
]

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('This Week')
  const [stats, setStats] = useState<AdminStatsDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminStats()
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => { setError('Backend offline — demo data shown'); setLoading(false) })
  }, [])

  const kpis = [
    { label: 'Total Teachers', value: loading ? '…' : (stats?.totalTeachers ?? 48).toString(), color: '#2563EB', bg: '#EFF6FF', icon: '👨‍🏫' },
    { label: 'Total Students', value: loading ? '…' : (stats?.totalStudents ?? 1284).toLocaleString(), color: '#7C3AED', bg: '#F5F3FF', icon: '📚' },
    { label: 'Active Sessions', value: loading ? '…' : (stats?.activeSessToday ?? 0).toString(), color: '#16A34A', bg: '#F0FDF4', icon: '⚡' },
    { label: 'Quizzes Created', value: loading ? '…' : (stats?.totalQuizzes ?? 347).toString(), color: '#D97706', bg: '#FFFBEB', icon: '📝' },
  ]

  return (
    <div className="animate-fade-in dashboard-shell" style={{ padding: 28, minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 420px', minWidth: 320 }} className="dashboard-hero">
          <div style={{ padding: '28px 28px 24px' }}>
            <p style={{ margin: 0, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.8 }}>Administrative overview</p>
            <h2 style={{ margin: '12px 0 8px', fontSize: 28, fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>Welcome back, administrator</h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, opacity: 0.9 }}>Review school activity, track class adoption and manage the platform from one central dashboard.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: '0 28px 28px', flexWrap: 'wrap' }}>
            <span className="stat-pill">48 teachers</span>
            <span className="stat-pill">1,284 students</span>
            <span className="stat-pill">347 quizzes</span>
          </div>
        </div>

        <div style={{ flex: '0 0 240px', minWidth: 240, display: 'grid', gap: 12 }}>
          {['Today', 'This Week', 'This Month'].map(r => (
            <button key={r} onClick={() => setDateRange(r)} className="action-button" style={{ width: '100%', border: '1px solid #E2E8F0', background: dateRange === r ? '#2563EB' : '#fff', color: dateRange === r ? '#fff' : '#64748B' }}>{r}</button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E', borderRadius: 14, padding: '14px 18px', marginBottom: 20, fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      <div className="dashboard-grid dashboard-grid-4" style={{ marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} className="dashboard-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 10px', fontSize: 13, color: '#64748B', fontWeight: 600 }}>{k.label}</p>
                <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: '#0F172A' }}>{k.value}</p>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{k.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid dashboard-grid-2" style={{ gap: 16 }}>
        <div className="dashboard-card" style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Sessions This Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 13 }} />
              <Bar dataKey="sessions" fill="#2563EB" radius={[6, 6, 0, 0]} name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card" style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Quizzes by Subject</h3>
          <p style={{ margin: '0 0 14px', fontSize: 12, color: '#64748B' }}>Distribution across departments</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={subjectData} cx="50%" cy="50%" innerRadius={44} outerRadius={70} dataKey="value" paddingAngle={4}>
                {subjectData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
            {subjectData.map(s => (
              <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 9999, background: s.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 13, color: '#475569' }}>{s.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
