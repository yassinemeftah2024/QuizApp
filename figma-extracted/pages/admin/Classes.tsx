import { useState } from 'react'
import Modal from '../../components/Modal'

const classesData = [
  { id: 1, name: '1ère A Info', level: 'L1', year: '2024-2025', students: 38, quizzes: 24, avgScore: 74, subjects: ['Algorithmique', 'Mathématiques', 'Réseaux'] },
  { id: 2, name: '1ère B Info', level: 'L1', year: '2024-2025', students: 35, quizzes: 19, avgScore: 71, subjects: ['Algorithmique', 'Mathématiques', 'Physique'] },
  { id: 3, name: '2ème A Maths', level: 'L2', year: '2024-2025', students: 30, quizzes: 31, avgScore: 78, subjects: ['Algèbre', 'Analyse', 'Probabilités'] },
  { id: 4, name: '2ème B Physique', level: 'L2', year: '2024-2025', students: 28, quizzes: 27, avgScore: 69, subjects: ['Thermodynamique', 'Mécanique', 'Optique'] },
  { id: 5, name: '3ème Génie Civil', level: 'L3', year: '2024-2025', students: 22, quizzes: 15, avgScore: 81, subjects: ['Résistance des Matériaux', 'Béton Armé', 'Topographie'] },
  { id: 6, name: '2ème A Info', level: 'L2', year: '2024-2025', students: 33, quizzes: 28, avgScore: 76, subjects: ['POO Java', 'Base de Données', 'Systèmes'] },
]

const levelColors: Record<string, { bg: string; color: string }> = {
  L1: { bg: '#F0FDF4', color: '#16A34A' },
  L2: { bg: '#EFF6FF', color: '#2563EB' },
  L3: { bg: '#F5F3FF', color: '#7C3AED' },
}

export default function AdminClasses({ onToast }: { onToast: (msg: string, type?: string) => void }) {
  const [classes, setClasses] = useState(classesData)
  const [selected, setSelected] = useState<typeof classesData[0] | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', level: 'L1', year: '2024-2025' })

  const handleCreate = () => {
    if (!form.name) return
    setClasses(prev => [...prev, { id: Date.now(), ...form, students: 0, quizzes: 0, avgScore: 0, subjects: [] }])
    setShowCreate(false); setForm({ name: '', level: 'L1', year: '2024-2025' })
    onToast('Class created successfully!', 'success')
  }

  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>{classes.length} classes across {new Set(classes.map(c => c.level)).size} levels</p>
        <button onClick={() => setShowCreate(true)} style={{
          background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff',
          border: 'none', borderRadius: 10, padding: '10px 20px',
          fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>+</span> Create Class
        </button>
      </div>

      {/* Class cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {classes.map(cls => (
          <div key={cls.id} className="card-hover" onClick={() => setSelected(cls)} style={{
            background: '#fff', borderRadius: 14, padding: 20, border: '1.5px solid #E2E8F0',
            cursor: 'pointer', transition: 'all 0.18s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 22 }}>🏫</span>
              </div>
              <span style={{ ...levelColors[cls.level], borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{cls.level}</span>
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17, margin: '0 0 4px', color: '#0F172A' }}>{cls.name}</h3>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Academic year {cls.year}</p>

            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { icon: '👥', val: cls.students, label: 'students' },
                { icon: '📝', val: cls.quizzes, label: 'quizzes' },
                { icon: '📊', val: `${cls.avgScore}%`, label: 'avg score' },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, textAlign: 'center', background: '#F8FAFC', borderRadius: 8, padding: '8px 4px' }}>
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {cls.subjects.slice(0, 2).map(s => (
                <span key={s} style={{ background: '#F1F5F9', color: '#64748B', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 500 }}>{s}</span>
              ))}
              {cls.subjects.length > 2 && (
                <span style={{ background: '#F1F5F9', color: '#94A3B8', borderRadius: 20, padding: '3px 10px', fontSize: 11 }}>+{cls.subjects.length - 2} more</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Class detail modal */}
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)} width={560}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Students', val: selected.students, icon: '👥', color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Quizzes', val: selected.quizzes, icon: '📝', color: '#7C3AED', bg: '#F5F3FF' },
              { label: 'Avg Score', val: `${selected.avgScore}%`, icon: '📊', color: '#16A34A', bg: '#F0FDF4' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, margin: '0 0 10px', color: '#0F172A' }}>Subjects</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {selected.subjects.map(s => (
              <span key={s} style={{ background: '#EFF6FF', color: '#2563EB', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 500 }}>{s}</span>
            ))}
            {selected.subjects.length === 0 && <span style={{ color: '#94A3B8', fontSize: 14 }}>No subjects assigned yet</span>}
          </div>

          <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, margin: '0 0 10px', color: '#0F172A' }}>Recent Students</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Amira K.', 'Youssef B.', 'Rania S.', 'Omar B.', 'Nassim A.', 'Lina R.'].slice(0, selected.students > 5 ? 6 : selected.students).map(s => (
              <span key={s} style={{
                background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 20,
                padding: '5px 12px', fontSize: 13, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>
                  {s[0]}
                </span>
                {s}
              </span>
            ))}
          </div>
        </Modal>
      )}

      {/* Create class modal */}
      {showCreate && (
        <Modal title="Create New Class" onClose={() => setShowCreate(false)} width={440}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Class Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. 1ère A Info"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Level</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                {['L1', 'L2', 'L3', 'M1', 'M2'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Academic Year</label>
              <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                {['2024-2025', '2025-2026'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={() => setShowCreate(false)} style={{ flex: 1, padding: '11px', border: '1px solid #E2E8F0', borderRadius: 10, background: '#fff', color: '#64748B', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleCreate} style={{ flex: 2, padding: '11px', border: 'none', borderRadius: 10, background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Create Class</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
