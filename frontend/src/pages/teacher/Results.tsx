import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const scoreDistribution = [
  { range: '0-20', count: 1 }, { range: '21-40', count: 2 }, { range: '41-60', count: 5 },
  { range: '61-80', count: 14 }, { range: '81-100', count: 12 },
]

const questionStats = [
  { q: 'Q1', correct: 90, wrong: 10, time: 12 },
  { q: 'Q2', correct: 68, wrong: 32, time: 18 },
  { q: 'Q3', correct: 45, wrong: 55, time: 22 },
  { q: 'Q4', correct: 78, wrong: 22, time: 14 },
  { q: 'Q5', correct: 82, wrong: 18, time: 11 },
  { q: 'Q6', correct: 55, wrong: 45, time: 19 },
]

const leaderboard = [
  { rank: 1, name: 'Amira Khaldi', score: 950, accuracy: 93, time: '4:12' },
  { rank: 2, name: 'Youssef Bensaid', score: 900, accuracy: 87, time: '4:35' },
  { rank: 3, name: 'Rania Seghiri', score: 850, accuracy: 80, time: '5:01' },
  { rank: 4, name: 'Omar Berkane', score: 800, accuracy: 73, time: '5:20' },
  { rank: 5, name: 'Lina Ramdane', score: 750, accuracy: 67, time: '5:44' },
  { rank: 6, name: 'Nassim Aouadi', score: 700, accuracy: 60, time: '6:10' },
  { rank: 7, name: 'Farid Bouziane', score: 650, accuracy: 53, time: '6:32' },
]

const pieData = [
  { name: 'Excellent (>80)', value: 12, color: '#16A34A' },
  { name: 'Good (60-80)', value: 14, color: '#2563EB' },
  { name: 'Average (40-60)', value: 5, color: '#D97706' },
  { name: 'Struggling (<40)', value: 3, color: '#DC2626' },
]

export default function TeacherResults({ onToast }: { onToast: (msg: string, type?: string) => void }) {
  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      {/* Session summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Average Score', val: '73%', icon: '📊', color: '#2563EB', bg: '#EFF6FF', trend: '+5% vs last' },
          { label: 'Participation Rate', val: '100%', icon: '👥', color: '#16A34A', bg: '#F0FDF4', trend: '34/34 students' },
          { label: 'Completion Rate', val: '94%', icon: '✅', color: '#7C3AED', bg: '#F5F3FF', trend: '32 finished' },
          { label: 'Avg Time Taken', val: '5:23', icon: '⏱', color: '#D97706', bg: '#FFFBEB', trend: 'Per student' },
        ].map(k => (
          <div key={k.label} className="card-hover" style={{ background: '#fff', borderRadius: 14, padding: '18px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 6px', fontSize: 12, color: '#64748B' }}>{k.label}</p>
                <p style={{ margin: '0 0 4px', fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, color: '#0F172A' }}>{k.val}</p>
                <p style={{ margin: 0, fontSize: 12, color: k.color, fontWeight: 500 }}>{k.trend}</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{k.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Score distribution */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Score Distribution</h3>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Number of students per score range</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={scoreDistribution} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }} />
              <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance breakdown */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Performance Breakdown</h3>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Student performance categories</p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <ResponsiveContainer width="50%" height={150}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={3}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pieData.map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color, display: 'inline-block' }} />
                    <span style={{ fontSize: 12, color: '#64748B' }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Question difficulty heatmap */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Question Analysis</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>% correct per question — identify problem areas</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {questionStats.map((qs, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', width: 28 }}>{qs.q}</span>
              <div style={{ flex: 1, height: 20, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  height: '100%', width: `${qs.correct}%`,
                  background: qs.correct >= 75 ? '#16A34A' : qs.correct >= 50 ? '#2563EB' : '#DC2626',
                  borderRadius: 10, transition: 'width 0.6s',
                }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, width: 38, textAlign: 'right', color: qs.correct >= 75 ? '#16A34A' : qs.correct >= 50 ? '#2563EB' : '#DC2626' }}>{qs.correct}%</span>
              <span style={{ fontSize: 12, color: '#94A3B8', width: 50, textAlign: 'right' }}>{qs.time}s avg</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, margin: 0 }}>🏆 Final Leaderboard</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => onToast('CSV exported!', 'success')} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>📥 CSV</button>
            <button onClick={() => onToast('PDF exported!', 'success')} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>📄 PDF</button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Rank', 'Student', 'Score', 'Accuracy', 'Time'].map(h => (
                <th key={h} style={{ padding: '11px 16px', fontSize: 12, fontWeight: 600, color: '#64748B', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((p, i) => (
              <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '13px 16px', fontSize: 20 }}>
                  {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : <span style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>#{p.rank}</span>}
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 16, color: '#2563EB' }}>{p.score}</td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden', maxWidth: 80 }}>
                      <div style={{ height: '100%', width: `${p.accuracy}%`, background: p.accuracy >= 80 ? '#16A34A' : p.accuracy >= 60 ? '#2563EB' : '#D97706', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{p.accuracy}%</span>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748B' }}>{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
