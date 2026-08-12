import { useState } from 'react'

const quizzes = [
  { id: 1, title: 'Algèbre Linéaire – Ch.3', subject: 'Mathematics', level: 'L2', questions: 15, status: 'published', mode: 'Exam', modified: 'Today', sessions: 8 },
  { id: 2, title: 'POO Java – Héritage & Polymorphisme', subject: 'Computer Science', level: 'L2', questions: 12, status: 'published', mode: 'Training', modified: 'Yesterday', sessions: 12 },
  { id: 3, title: 'Thermodynamique Ch.2 – Cycles', subject: 'Physics', level: 'L1', questions: 18, status: 'draft', mode: 'Training', modified: '3 days ago', sessions: 0 },
  { id: 4, title: 'Circuits Logiques – Exam Final', subject: 'Electronics', level: 'L3', questions: 25, status: 'published', mode: 'Exam', modified: '1 week ago', sessions: 3 },
  { id: 5, title: 'Bases de Données – SQL Avancé', subject: 'Computer Science', level: 'L2', questions: 20, status: 'archived', mode: 'Challenge', modified: '2 weeks ago', sessions: 5 },
  { id: 6, title: 'Analyse Numérique – Méthodes', subject: 'Mathematics', level: 'L3', questions: 10, status: 'draft', mode: 'Training', modified: '2 days ago', sessions: 0 },
  { id: 7, title: 'Réseaux Informatiques – OSI', subject: 'Networks', level: 'L2', questions: 16, status: 'published', mode: 'Training', modified: '4 days ago', sessions: 6 },
]

const statusColors: Record<string, { bg: string; color: string }> = {
  published: { bg: '#F0FDF4', color: '#16A34A' },
  draft: { bg: '#FEF3C7', color: '#D97706' },
  archived: { bg: '#F1F5F9', color: '#94A3B8' },
  live: { bg: '#EFF6FF', color: '#2563EB' },
}

const modeColors: Record<string, { bg: string; color: string }> = {
  Exam: { bg: '#FEE2E2', color: '#DC2626' },
  Training: { bg: '#F0FDF4', color: '#16A34A' },
  Challenge: { bg: '#F5F3FF', color: '#7C3AED' },
}

interface Props {
  onNav: (page: string) => void
  onToast: (msg: string, type?: string) => void
}

export default function TeacherQuizList({ onNav, onToast }: Props) {
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [statusFilter, setStatusFilter] = useState('All')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const subjects = ['All', ...Array.from(new Set(quizzes.map(q => q.subject)))]

  const filtered = quizzes.filter(q =>
    (statusFilter === 'All' || q.status === statusFilter.toLowerCase()) &&
    (subjectFilter === 'All' || q.subject === subjectFilter)
  )

  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>{filtered.length} quizzes found</p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 8, padding: 3 }}>
            {(['grid', 'table'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '6px 12px', borderRadius: 6, border: 'none',
                background: view === v ? '#fff' : 'transparent',
                color: view === v ? '#0F172A' : '#64748B', fontSize: 13, cursor: 'pointer',
                boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}>{v === 'grid' ? '⊞ Grid' : '☰ Table'}</button>
            ))}
          </div>
          <button onClick={() => onNav('teacher-quiz-create')} style={{
            background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff',
            border: 'none', borderRadius: 10, padding: '10px 20px',
            fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>+</span> Create Quiz
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>Status:</span>
          {['All', 'Published', 'Draft', 'Archived'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{
              padding: '5px 14px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: statusFilter === f ? '#0F172A' : '#F1F5F9',
              color: statusFilter === f ? '#fff' : '#64748B',
            }}>{f}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>Subject:</span>
          {subjects.slice(0, 5).map(s => (
            <button key={s} onClick={() => setSubjectFilter(s)} style={{
              padding: '5px 14px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: subjectFilter === s ? '#2563EB' : '#F1F5F9',
              color: subjectFilter === s ? '#fff' : '#64748B',
            }}>{s}</button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {filtered.map(q => (
            <div key={q.id} className="card-hover" style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ ...statusColors[q.status], borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{q.status}</span>
                  <span style={{ ...modeColors[q.mode], borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{q.mode}</span>
                </div>
                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, margin: '0 0 4px', color: '#0F172A', lineHeight: 1.3 }}>{q.title}</h4>
                <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>{q.subject} · {q.level}</p>
              </div>
              <div style={{ padding: '12px 18px' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>{q.questions}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>questions</div>
                  </div>
                  <div style={{ width: 1, background: '#F1F5F9' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>{q.sessions}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>sessions</div>
                  </div>
                  <div style={{ width: 1, background: '#F1F5F9' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>Modified</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>{q.modified}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => onNav('teacher-live')} style={{
                    flex: 1, padding: '8px', background: '#EFF6FF', color: '#2563EB',
                    border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  }}>▶ Start</button>
                  <button onClick={() => onNav('teacher-quiz-create')} style={{
                    flex: 1, padding: '8px', background: '#F8FAFC', color: '#64748B',
                    border: '1px solid #E2E8F0', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer',
                  }}>✏️ Edit</button>
                  <button style={{ padding: '8px 10px', background: '#F8FAFC', color: '#94A3B8', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>⋯</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['Title', 'Subject', 'Level', 'Questions', 'Mode', 'Status', 'Sessions', 'Modified', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', fontSize: 12, fontWeight: 600, color: '#64748B', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => (
                <tr key={q.id} style={{ borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 14px', fontWeight: 500, fontSize: 13, color: '#0F172A', maxWidth: 220 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.title}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B' }}>{q.subject}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B' }}>{q.level}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{q.questions}</td>
                  <td style={{ padding: '12px 14px' }}><span style={{ ...modeColors[q.mode], borderRadius: 20, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>{q.mode}</span></td>
                  <td style={{ padding: '12px 14px' }}><span style={{ ...statusColors[q.status], borderRadius: 20, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>{q.status}</span></td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#64748B' }}>{q.sessions}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#94A3B8' }}>{q.modified}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => onNav('teacher-live')} style={{ background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>▶</button>
                      <button style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: 6, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>✏️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 20, color: '#0F172A', margin: '0 0 8px' }}>No quizzes found</h3>
          <p style={{ color: '#64748B', margin: '0 0 20px' }}>Create your first quiz or adjust the filters</p>
          <button onClick={() => onNav('teacher-quiz-create')} style={{ background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ Create Quiz</button>
        </div>
      )}
    </div>
  )
}
