import { useState, useEffect } from 'react'
import Modal from '../../components/Modal'
import { getClasses, createClasse, deleteClasse, type ClasseWithStats } from '@/services/adminService'

const levelColors: Record<string, { bg: string; color: string }> = {
  L1: { bg: '#F0FDF4', color: '#16A34A' },
  L2: { bg: '#EFF6FF', color: '#2563EB' },
  L3: { bg: '#F5F3FF', color: '#7C3AED' },
  M1: { bg: '#FFFBEB', color: '#D97706' },
  M2: { bg: '#FEF2F2', color: '#DC2626' },
}

export default function AdminClasses({ onToast }: { onToast: (msg: string, type?: string) => void }) {
  const [classes, setClasses] = useState<ClasseWithStats[]>([])
  const [selected, setSelected] = useState<ClasseWithStats | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nom: '', niveau: 'L1', anneeAcademique: '2024-2025' })

  const loadClasses = () => {
    setLoading(true)
    getClasses()
      .then(data => { setClasses(data); setLoading(false) })
      .catch(() => { onToast('Failed to load classes', 'error'); setLoading(false) })
  }

  useEffect(() => { loadClasses() }, [])

  const handleCreate = async () => {
    if (!form.nom) return
    setSaving(true)
    try {
      const created = await createClasse(form)
      setClasses(prev => [...prev, created])
      setShowCreate(false); setForm({ nom: '', niveau: 'L1', anneeAcademique: '2024-2025' })
      onToast('Class created successfully!', 'success')
    } catch {
      onToast('Failed to create class', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    try {
      await deleteClasse(id)
      setClasses(prev => prev.filter(c => c.id !== id))
      if (selected?.id === id) setSelected(null)
      onToast('Class deleted', 'success')
    } catch {
      onToast('Failed to delete class', 'error')
    }
  }

  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>
          {loading ? 'Loading classes…' : `${classes.length} classes across ${new Set(classes.map(c => c.niveau)).size} levels`}
        </p>
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
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {Array.from({ length: 3 }).map((_, i) => <div key={i} style={{ height: 180, background: '#fff', borderRadius: 14, opacity: 0.5, border: '1px solid #E2E8F0' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
          {classes.map(cls => (
            <div key={cls.id} className="card-hover" onClick={() => setSelected(cls)} style={{
              background: '#fff', borderRadius: 14, padding: 20, border: '1.5px solid #E2E8F0',
              cursor: 'pointer', transition: 'all 0.18s', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 22 }}>🏫</span>
                </div>
                <span style={{ ...(levelColors[cls.niveau || 'L1'] || levelColors['L1']), borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                  {cls.niveau || 'N/A'}
                </span>
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17, margin: '0 0 4px', color: '#0F172A' }}>{cls.nom}</h3>
              <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Academic year {cls.anneeAcademique || '2024-2025'}</p>

              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { icon: '👥', val: cls.nombreEtudiants || 0, label: 'students' },
                  { icon: '📝', val: '-', label: 'quizzes' }, // Dev B will implement stats
                  { icon: '📊', val: `- %`, label: 'avg score' }, // Dev B will implement stats
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, textAlign: 'center', background: '#F8FAFC', borderRadius: 8, padding: '8px 4px' }}>
                    <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {classes.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: '#94A3B8', background: '#fff', borderRadius: 14, border: '2px dashed #E2E8F0' }}>
              No classes found. Create one to get started.
            </div>
          )}
        </div>
      )}

      {/* Class detail modal */}
      {selected && (
        <Modal title={selected.nom} onClose={() => setSelected(null)} width={560}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Students', val: selected.nombreEtudiants || 0, icon: '👥', color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Quizzes', val: '-', icon: '📝', color: '#7C3AED', bg: '#F5F3FF' },
              { label: 'Avg Score', val: `- %`, icon: '📊', color: '#16A34A', bg: '#F0FDF4' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{s.label}</div>
              </div>
            ))}
          </div>
          
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24, textAlign: 'center' }}>
            Detailed statistics and subject lists will be available in Sprint 2 (Live Sessions & Reports).
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => handleDelete(selected.id)} style={{ padding: '9px 16px', borderRadius: 10, border: '1.5px solid #FEE2E2', background: '#FFF5F5', color: '#DC2626', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Delete Class
            </button>
            <button onClick={() => setSelected(null)} style={{ padding: '9px 16px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Create class modal */}
      {showCreate && (
        <Modal title="Create New Class" onClose={() => setShowCreate(false)} width={440}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Class Name</label>
              <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="e.g. 1ère A Info"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Level</label>
              <select value={form.niveau} onChange={e => setForm({ ...form, niveau: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                {['L1', 'L2', 'L3', 'M1', 'M2'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Academic Year</label>
              <select value={form.anneeAcademique} onChange={e => setForm({ ...form, anneeAcademique: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                {['2024-2025', '2025-2026'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={() => setShowCreate(false)} style={{ flex: 1, padding: '11px', border: '1px solid #E2E8F0', borderRadius: 10, background: '#fff', color: '#64748B', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleCreate} disabled={saving} style={{ flex: 2, padding: '11px', border: 'none', borderRadius: 10, background: saving ? '#94A3B8' : 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: saving ? 'default' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              {saving ? 'Creating…' : 'Create Class'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
