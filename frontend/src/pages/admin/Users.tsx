import { useState, useEffect, useRef } from 'react'
import Modal from '../../components/Modal'
import { getAllUsers, toggleUserStatus, deleteUser, createUser, getMatieres, getClasses, updateTeacherAssignments, importUsers, downloadImportTemplate, type MatiereDTO, type ClasseWithStats, type UserImportResultDTO } from '@/services/adminService'
import type { UtilisateurDTO } from '@/types'

const roleColors: Record<string, { bg: string; color: string }> = {
  ADMIN: { bg: '#0F172A', color: '#fff' },
  ENSEIGNANT: { bg: '#EFF6FF', color: '#2563EB' },
  ETUDIANT: { bg: '#F5F3FF', color: '#7C3AED' },
}

const roleLabelMap: Record<string, string> = {
  ADMIN: 'Admin', ENSEIGNANT: 'Teacher', ETUDIANT: 'Student',
}

export default function AdminUsers({ onToast }: { onToast: (msg: string, type?: string) => void }) {
  const [users, setUsers] = useState<UtilisateurDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<UtilisateurDTO | null>(null)
  const [editMatiereIds, setEditMatiereIds] = useState<number[]>([])
  const [editClasseIds, setEditClasseIds] = useState<number[]>([])
  const [matieres, setMatieres] = useState<MatiereDTO[]>([])
  const [classes, setClasses] = useState<ClasseWithStats[]>([])
  const [newUser, setNewUser] = useState({
    nom: '', prenom: '', email: '', motDePasse: '',
    role: 'ETUDIANT' as 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT',
    matiereIds: [] as number[], classeIds: [] as number[], etablissement: '', departement: '',
  })
  const [importModal, setImportModal] = useState(false)
  const [importResult, setImportResult] = useState<UserImportResultDTO | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadUsers = () => {
    setLoading(true)
    getAllUsers()
      .then(data => { setUsers(data); setLoading(false) })
      .catch(() => { onToast('Failed to load users', 'error'); setLoading(false) })
  }

  useEffect(() => { loadUsers() }, [])
  useEffect(() => {
    Promise.all([getMatieres(), getClasses()])
      .then(([subjectData, classData]) => { setMatieres(subjectData); setClasses(classData) })
      .catch(() => onToast('Failed to load subjects or classes', 'error'))
  }, [])

  const toggleSelection = (field: 'matiereIds' | 'classeIds', id: number) => {
    setNewUser(previous => ({
      ...previous,
      [field]: previous[field].includes(id)
        ? previous[field].filter(value => value !== id)
        : [...previous[field], id],
    }))
  }

  const filtered = users.filter(u => {
    const matchRole = filter === 'All' || u.role === filter
    const fullName = `${u.prenom} ${u.nom}`.toLowerCase()
    const matchSearch = fullName.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const handleToggle = async (id: number) => {
    try {
      const updated = await toggleUserStatus(id)
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
      onToast('User status updated', 'success')
    } catch {
      onToast('Failed to update status', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user permanently?')) return
    try {
      await deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      onToast('User deleted', 'success')
    } catch {
      onToast('Failed to delete user', 'error')
    }
  }

  const openTeacherAssignments = (teacher: UtilisateurDTO) => {
    setEditingTeacher(teacher)
    setEditMatiereIds(teacher.matiereIds || [])
    setEditClasseIds(teacher.classeIds || [])
  }

  const saveTeacherAssignments = async () => {
    if (!editingTeacher || editMatiereIds.length === 0 || editClasseIds.length === 0) {
      onToast('Select at least one subject and one class', 'error'); return
    }
    setSaving(true)
    try {
      const updated = await updateTeacherAssignments(editingTeacher.id, { matiereIds: editMatiereIds, classeIds: editClasseIds })
      setUsers(previous => previous.map(user => user.id === updated.id ? updated : user))
      setEditingTeacher(null)
      onToast('Teacher assignments updated', 'success')
    } catch (err: any) {
      onToast(err?.response?.data?.message || 'Failed to update teacher assignments', 'error')
    } finally { setSaving(false) }
  }

  const handleAddUser = async () => {
    if (step < 3) { setStep(step + 1); return }
    if (!newUser.nom || !newUser.prenom || !newUser.email || !newUser.motDePasse) {
      onToast('Please fill in all required fields', 'error'); return
    }
    if (newUser.motDePasse.length < 6) {
      onToast('The initial password must contain at least 6 characters', 'error'); return
    }
    if (newUser.role === 'ENSEIGNANT' && newUser.matiereIds.length === 0) {
      onToast('Select at least one subject for the teacher', 'error'); return
    }
    if (newUser.role === 'ENSEIGNANT' && newUser.classeIds.length === 0) {
      onToast('Select at least one class for the teacher', 'error'); return
    }
    setSaving(true)
    try {
      const created = await createUser({
        nom: newUser.nom, prenom: newUser.prenom,
        email: newUser.email, motDePasse: newUser.motDePasse,
        role: newUser.role, matiereIds: newUser.matiereIds, classeIds: newUser.classeIds,
        etablissement: newUser.etablissement, departement: newUser.departement,
      })
      setUsers(prev => [created, ...prev])
      setShowModal(false); setStep(1)
      setNewUser({ nom: '', prenom: '', email: '', motDePasse: '', role: 'ETUDIANT', matiereIds: [], classeIds: [], etablissement: '', departement: '' })
      onToast('User created successfully! 🎉', 'success')
    } catch (err: any) {
      onToast(err?.response?.data?.message || 'Failed to create user', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setImportResult(null)
    try {
      const result = await importUsers(file)
      setImportResult(result)
      if (result.created > 0) loadUsers()
      onToast(`Import complete: ${result.created} created, ${result.failed} failed`, result.failed > 0 ? 'error' : 'success')
    } catch (err: any) {
      onToast(err?.response?.data?.message || 'Failed to import file', 'error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadImportTemplate()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'modele-import-utilisateurs.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      onToast('Failed to download template', 'error')
    }
  }

  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>{loading ? 'Loading…' : `${users.length} total users registered`}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setImportModal(true)} style={{
            background: '#F8FAFC', color: '#475569', border: '1.5px solid #E2E8F0',
            borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Outfit, sans-serif',
          }}>
            📊 Import Excel
          </button>
          <button onClick={() => setShowModal(true)} style={{
            background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff', border: 'none',
            borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Outfit, sans-serif',
          }}>
            <span style={{ fontSize: 18 }}>+</span> Add New User
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {['All', 'ADMIN', 'ENSEIGNANT', 'ETUDIANT'].map(r => (
          <button key={r} onClick={() => setFilter(r)} style={{
            padding: '7px 16px', borderRadius: 20, border: 'none',
            background: filter === r ? '#0F172A' : '#F1F5F9',
            color: filter === r ? '#fff' : '#64748B',
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}>{r === 'All' ? 'All' : roleLabelMap[r]}</button>
        ))}
        <div style={{ flex: 1, minWidth: 200 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…"
            style={{ width: '100%', padding: '8px 14px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>Loading users…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#64748B', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: u.role === 'ADMIN' ? 'linear-gradient(135deg,#1E293B,#334155)' : u.role === 'ENSEIGNANT' ? 'linear-gradient(135deg,#2563EB,#1D4ED8)' : 'linear-gradient(135deg,#7C3AED,#6D28D9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700,
                      }}>
                        {(u.prenom[0] + u.nom[0]).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500, fontSize: 14, color: '#0F172A' }}>{u.prenom} {u.nom}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748B' }}>{u.email}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ ...(roleColors[u.role] || { bg: '#F1F5F9', color: '#64748B' }), borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
                      {roleLabelMap[u.role] || u.role}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ background: u.actif ? '#F0FDF4' : '#F8FAFC', color: u.actif ? '#16A34A' : '#94A3B8', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
                      {u.actif ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: '#94A3B8' }}>
                    {u.dateCreation ? new Date(u.dateCreation).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleToggle(u.id)} title={u.actif ? 'Deactivate' : 'Activate'}
                        style={{ background: '#F1F5F9', border: 'none', borderRadius: 7, padding: '6px', cursor: 'pointer', fontSize: 14 }}>
                        {u.actif ? '🔒' : '🔓'}
                      </button>
                      {u.role === 'ENSEIGNANT' && <button onClick={() => openTeacherAssignments(u)} title="Edit subjects and classes"
                        style={{ background: '#EFF6FF', border: 'none', borderRadius: 7, padding: '6px', cursor: 'pointer', fontSize: 14 }}>✏️</button>}
                      <button onClick={() => handleDelete(u.id)} title="Delete"
                        style={{ background: '#FEF2F2', border: 'none', borderRadius: 7, padding: '6px', cursor: 'pointer', fontSize: 14 }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#94A3B8' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title="Add New User" onClose={() => { setShowModal(false); setStep(1) }} width={520}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {['Basic Info', 'Role & Dept', 'Confirm'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i + 1 <= step ? '#2563EB' : '#E2E8F0', color: i + 1 <= step ? '#fff' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 12, color: i + 1 <= step ? '#2563EB' : '#94A3B8', fontWeight: i + 1 === step ? 600 : 400 }}>{s}</span>
                {i < 2 && <div style={{ flex: 1, height: 1, background: i + 1 < step ? '#2563EB' : '#E2E8F0' }} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'prenom', label: 'First Name', ph: 'Amira' },
                { key: 'nom', label: 'Last Name', ph: 'Khaldi' },
                { key: 'email', label: 'Email', ph: 'user@school.edu', type: 'email' },
                { key: 'motDePasse', label: 'Initial Password', ph: 'Choose at least 6 characters', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type || 'text'} value={(newUser as any)[f.key]} onChange={e => setNewUser({ ...newUser, [f.key]: e.target.value })} placeholder={f.ph}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 8px' }}>Select the user's role:</p>
              {[
                { v: 'ADMIN', label: 'Administrator', desc: 'Full platform management' },
                { v: 'ENSEIGNANT', label: 'Teacher', desc: 'Create and manage quizzes' },
                { v: 'ETUDIANT', label: 'Student', desc: 'Join sessions and track progress' },
              ].map(r => (
                <div key={r.v} onClick={() => setNewUser({ ...newUser, role: r.v as any })} style={{ padding: '14px 18px', borderRadius: 12, border: `2px solid ${newUser.role === r.v ? '#2563EB' : '#E2E8F0'}`, background: newUser.role === r.v ? '#EFF6FF' : '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{r.desc}</div>
                  </div>
                  {newUser.role === r.v && <span style={{ color: '#2563EB', fontSize: 20 }}>✓</span>}
                </div>
              ))}
              {newUser.role === 'ENSEIGNANT' && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>Subjects taught</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {matieres.map(subject => (
                        <button key={subject.id} type="button" onClick={() => toggleSelection('matiereIds', subject.id!)} style={{
                          padding: '8px 12px', borderRadius: 9, cursor: 'pointer', fontSize: 13,
                          border: `1.5px solid ${newUser.matiereIds.includes(subject.id!) ? '#2563EB' : '#E2E8F0'}`,
                          background: newUser.matiereIds.includes(subject.id!) ? '#EFF6FF' : '#fff',
                          color: newUser.matiereIds.includes(subject.id!) ? '#1D4ED8' : '#475569',
                        }}>{newUser.matiereIds.includes(subject.id!) ? '✓ ' : ''}{subject.nom}</button>
                      ))}
                      {matieres.length === 0 && <span style={{ fontSize: 13, color: '#94A3B8' }}>Create subjects in Academic Structure first.</span>}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>Assigned classes</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {classes.map(classItem => (
                        <button key={classItem.id} type="button" onClick={() => toggleSelection('classeIds', classItem.id)} style={{
                          padding: '8px 12px', borderRadius: 9, cursor: 'pointer', fontSize: 13,
                          border: `1.5px solid ${newUser.classeIds.includes(classItem.id) ? '#7C3AED' : '#E2E8F0'}`,
                          background: newUser.classeIds.includes(classItem.id) ? '#F5F3FF' : '#fff',
                          color: newUser.classeIds.includes(classItem.id) ? '#6D28D9' : '#475569',
                        }}>{newUser.classeIds.includes(classItem.id) ? '✓ ' : ''}{classItem.nom}</button>
                      ))}
                      {classes.length === 0 && <span style={{ fontSize: 13, color: '#94A3B8' }}>Create classes in Academic Structure first.</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 20 }}>
              <h4 style={{ fontFamily: 'Outfit, sans-serif', margin: '0 0 12px', color: '#0F172A' }}>Confirm User Details</h4>
              {[
                { label: 'Name', value: `${newUser.prenom} ${newUser.nom}` },
                { label: 'Email', value: newUser.email },
                { label: 'Role', value: roleLabelMap[newUser.role] || newUser.role },
                { label: 'Initial password', value: newUser.motDePasse },
                ...(newUser.role === 'ENSEIGNANT' ? [
                  { label: 'Subjects', value: matieres.filter(subject => newUser.matiereIds.includes(subject.id!)).map(subject => subject.nom).join(', ') || 'Not selected' },
                  { label: 'Classes', value: classes.filter(classItem => newUser.classeIds.includes(classItem.id)).map(classItem => classItem.nom).join(', ') || 'Not selected' },
                ] : []),
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
            <button onClick={() => step > 1 ? setStep(step - 1) : setShowModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              {step === 1 ? 'Cancel' : '← Back'}
            </button>
            <button onClick={handleAddUser} disabled={saving} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: saving ? '#94A3B8' : 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: saving ? 'default' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              {saving ? 'Creating…' : step < 3 ? 'Next →' : 'Create User ✓'}
            </button>
          </div>
        </Modal>
      )}

      {editingTeacher && (
        <Modal title={`Edit assignments — ${editingTeacher.prenom} ${editingTeacher.nom}`} onClose={() => setEditingTeacher(null)} width={560}>
          <p style={{ color: '#64748B', fontSize: 13 }}>Select all subjects taught and all classes assigned to this teacher.</p>
          <h4 style={{ marginBottom: 8 }}>Subjects</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {matieres.map(subject => <button key={subject.id} type="button" onClick={() => setEditMatiereIds(ids => ids.includes(subject.id!) ? ids.filter(id => id !== subject.id) : [...ids, subject.id!])}
              style={{ padding: '8px 12px', borderRadius: 9, cursor: 'pointer', border: `1.5px solid ${editMatiereIds.includes(subject.id!) ? '#2563EB' : '#E2E8F0'}`, background: editMatiereIds.includes(subject.id!) ? '#EFF6FF' : '#fff' }}>
              {editMatiereIds.includes(subject.id!) ? '✓ ' : ''}{subject.nom}
            </button>)}
          </div>
          <h4 style={{ marginBottom: 8 }}>Classes</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {classes.map(classItem => <button key={classItem.id} type="button" onClick={() => setEditClasseIds(ids => ids.includes(classItem.id) ? ids.filter(id => id !== classItem.id) : [...ids, classItem.id])}
              style={{ padding: '8px 12px', borderRadius: 9, cursor: 'pointer', border: `1.5px solid ${editClasseIds.includes(classItem.id) ? '#7C3AED' : '#E2E8F0'}`, background: editClasseIds.includes(classItem.id) ? '#F5F3FF' : '#fff' }}>
              {editClasseIds.includes(classItem.id) ? '✓ ' : ''}{classItem.nom} {classItem.section ? `— ${classItem.section}` : ''}
            </button>)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={() => setEditingTeacher(null)} style={{ padding: '10px 18px' }}>Cancel</button>
            <button onClick={saveTeacherAssignments} disabled={saving} style={{ padding: '10px 18px', border: 0, borderRadius: 9, background: '#2563EB', color: '#fff', fontWeight: 700 }}>{saving ? 'Saving…' : 'Save assignments'}</button>
          </div>
        </Modal>
      )}

      {importModal && (
        <Modal title="Import Users from Excel" onClose={() => { setImportModal(false); setImportResult(null) }} width={600}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#64748B', fontSize: 14, marginBottom: 12 }}>
              Upload an Excel file (.xlsx or .xls) with columns: Prénom, Nom, Email, Rôle, Mot de passe.
              Teachers (ENSEIGNANT) will be created without subjects/classes — assign them later.
            </p>
            <button onClick={handleDownloadTemplate} style={{
              background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 9, padding: '9px 16px',
              color: '#475569', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              📥 Download Template
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={uploading}
              style={{ display: 'none' }}
              id="excel-upload"
            />
            <label htmlFor="excel-upload" style={{
              display: 'inline-block', background: uploading ? '#94A3B8' : 'linear-gradient(90deg,#2563EB,#1D4ED8)',
              color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontWeight: 700,
              fontSize: 14, cursor: uploading ? 'default' : 'pointer', fontFamily: 'Outfit, sans-serif',
            }}>
              {uploading ? 'Uploading…' : '📤 Select Excel File'}
            </label>
          </div>

          {importResult && (
            <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 10px', fontSize: 15, color: '#0F172A' }}>Import Results</h4>
              <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
                <div><span style={{ color: '#64748B', fontSize: 13 }}>Total rows:</span> <strong>{importResult.totalRows}</strong></div>
                <div><span style={{ color: '#16A34A', fontSize: 13 }}>✓ Created:</span> <strong style={{ color: '#16A34A' }}>{importResult.created}</strong></div>
                <div><span style={{ color: '#DC2626', fontSize: 13 }}>✗ Failed:</span> <strong style={{ color: '#DC2626' }}>{importResult.failed}</strong></div>
              </div>
              {importResult.errors.length > 0 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#DC2626', marginBottom: 6 }}>Errors:</div>
                  <div style={{ maxHeight: 200, overflowY: 'auto', background: '#fff', borderRadius: 6, padding: 10, border: '1px solid #FEE2E2' }}>
                    {importResult.errors.map((err, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#7F1D1D', marginBottom: 4 }}>
                        Row {err.row}: {err.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => { setImportModal(false); setImportResult(null) }} style={{
              padding: '10px 20px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff',
              color: '#64748B', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
