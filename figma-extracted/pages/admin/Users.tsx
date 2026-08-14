import { useState } from 'react'
import Modal from '../../components/Modal'

const allUsers = [
  { id: 1, name: 'Dr. Karim Mansouri', email: 'k.mansouri@school.edu', role: 'Admin', class: '—', status: 'active', joined: 'Sep 2023' },
  { id: 2, name: 'Prof. Sarah Benali', email: 's.benali@school.edu', role: 'Teacher', class: '—', status: 'active', joined: 'Sep 2023' },
  { id: 3, name: 'Dr. Meziane Fouad', email: 'f.meziane@school.edu', role: 'Teacher', class: '—', status: 'active', joined: 'Jan 2024' },
  { id: 4, name: 'Amira Khaldi', email: 'a.khaldi@etud.edu', role: 'Student', class: '2A Info', status: 'active', joined: 'Sep 2024' },
  { id: 5, name: 'Youssef Bensaid', email: 'y.bensaid@etud.edu', role: 'Student', class: '1B Maths', status: 'active', joined: 'Sep 2024' },
  { id: 6, name: 'Lina Ramdane', email: 'l.ramdane@etud.edu', role: 'Student', class: '3A Info', status: 'inactive', joined: 'Sep 2023' },
  { id: 7, name: 'Omar Berkane', email: 'o.berkane@etud.edu', role: 'Student', class: '2B Physique', status: 'active', joined: 'Oct 2024' },
  { id: 8, name: 'Mme. Oukil Fatima', email: 'f.oukil@school.edu', role: 'Teacher', class: '—', status: 'active', joined: 'Mar 2023' },
  { id: 9, name: 'Rania Seghiri', email: 'r.seghiri@etud.edu', role: 'Student', class: '1A Info', status: 'active', joined: 'Sep 2024' },
  { id: 10, name: 'Nassim Aouadi', email: 'n.aouadi@etud.edu', role: 'Student', class: '2A Info', status: 'inactive', joined: 'Sep 2023' },
]

const roleColors: Record<string, { bg: string; color: string }> = {
  Admin: { bg: '#0F172A', color: '#fff' },
  Teacher: { bg: '#EFF6FF', color: '#2563EB' },
  Student: { bg: '#F5F3FF', color: '#7C3AED' },
}

export default function AdminUsers({ onToast }: { onToast: (msg: string, type?: string) => void }) {
  const [users, setUsers] = useState(allUsers)
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState(1)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Student', class: '' })
  const [search, setSearch] = useState('')

  const roles = ['All', 'Admin', 'Teacher', 'Student']

  const filtered = users.filter(u => {
    const matchRole = filter === 'All' || u.role === filter
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const toggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
    onToast('User status updated', 'success')
  }

  const handleAddUser = () => {
    if (step < 3) { setStep(step + 1); return }
    setUsers(prev => [...prev, { id: Date.now(), ...newUser, status: 'active', joined: 'Jul 2025' }])
    setShowModal(false); setStep(1); setNewUser({ name: '', email: '', role: 'Student', class: '' })
    onToast('User created successfully!', 'success')
  }

  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>{users.length} total users registered</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff',
          border: 'none', borderRadius: 10, padding: '10px 20px',
          fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'Outfit, sans-serif',
        }}>
          <span style={{ fontSize: 18 }}>+</span> Add New User
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {roles.map(r => (
          <button key={r} onClick={() => setFilter(r)} style={{
            padding: '7px 16px', borderRadius: 20, border: 'none',
            background: filter === r ? '#0F172A' : '#F1F5F9',
            color: filter === r ? '#fff' : '#64748B',
            fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
          }}>{r}</button>
        ))}
        <div style={{ flex: 1, minWidth: 200 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…"
            style={{
              width: '100%', padding: '8px 14px', border: '1px solid #E2E8F0', borderRadius: 10,
              fontSize: 13, outline: 'none', background: '#F8FAFC', boxSizing: 'border-box',
            }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Name', 'Email', 'Role', 'Class', 'Status', 'Joined', 'Actions'].map(h => (
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
                      background: `linear-gradient(135deg, ${u.role === 'Admin' ? '#1E293B,#334155' : u.role === 'Teacher' ? '#2563EB,#1D4ED8' : '#7C3AED,#6D28D9'})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 13, fontWeight: 700,
                    }}>
                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500, fontSize: 14, color: '#0F172A' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748B' }}>{u.email}</td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{ ...roleColors[u.role], borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{u.role}</span>
                </td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748B' }}>{u.class}</td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{
                    background: u.status === 'active' ? '#F0FDF4' : '#F8FAFC',
                    color: u.status === 'active' ? '#16A34A' : '#94A3B8',
                    borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600,
                  }}>{u.status === 'active' ? '● Active' : '○ Inactive'}</span>
                </td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: '#94A3B8' }}>{u.joined}</td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => toggleStatus(u.id)} title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                      style={{ background: '#F1F5F9', border: 'none', borderRadius: 7, padding: '6px', cursor: 'pointer', fontSize: 14 }}>
                      {u.status === 'active' ? '🔒' : '🔓'}
                    </button>
                    <button title="Edit" style={{ background: '#EFF6FF', border: 'none', borderRadius: 7, padding: '6px', cursor: 'pointer', fontSize: 14 }}>✏️</button>
                    <button title="Reset password" style={{ background: '#F5F3FF', border: 'none', borderRadius: 7, padding: '6px', cursor: 'pointer', fontSize: 14 }}>🔑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <Modal title="Add New User" onClose={() => { setShowModal(false); setStep(1) }} width={520}>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {['Basic Info', 'Role', 'Class'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i + 1 <= step ? '#2563EB' : '#E2E8F0',
                  color: i + 1 <= step ? '#fff' : '#94A3B8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</div>
                <span style={{ fontSize: 12, color: i + 1 <= step ? '#2563EB' : '#94A3B8', fontWeight: i + 1 === step ? 600 : 400 }}>{s}</span>
                {i < 2 && <div style={{ flex: 1, height: 1, background: i + 1 < step ? '#2563EB' : '#E2E8F0' }} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="e.g. Amira Khaldi"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address</label>
                <input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="user@school.edu"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 8px' }}>Select the user's role in the platform:</p>
              {['Admin', 'Teacher', 'Student'].map(r => (
                <div key={r} onClick={() => setNewUser({ ...newUser, role: r })} style={{
                  padding: '14px 18px', borderRadius: 12, border: `2px solid ${newUser.role === r ? '#2563EB' : '#E2E8F0'}`,
                  background: newUser.role === r ? '#EFF6FF' : '#fff', cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>{r}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>
                      {r === 'Admin' ? 'Full platform management access' : r === 'Teacher' ? 'Create and manage quizzes' : 'Join sessions and track progress'}
                    </div>
                  </div>
                  {newUser.role === r && <span style={{ color: '#2563EB', fontSize: 20 }}>✓</span>}
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div>
              <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 16px' }}>
                {newUser.role === 'Student' ? 'Assign the student to a class:' : 'No class assignment needed for this role.'}
              </p>
              {newUser.role === 'Student' && (
                <select value={newUser.class} onChange={e => setNewUser({ ...newUser, class: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none' }}>
                  <option value="">Select class</option>
                  {['1ère A Info', '1ère B Info', '2ème A Maths', '2ème B Physique', '3ème Génie Civil'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
            <button onClick={() => step > 1 ? setStep(step - 1) : setShowModal(false)} style={{
              padding: '10px 20px', borderRadius: 10, border: '1px solid #E2E8F0',
              background: '#fff', color: '#64748B', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>
              {step === 1 ? 'Cancel' : '← Back'}
            </button>
            <button onClick={handleAddUser} style={{
              padding: '10px 24px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            }}>
              {step < 3 ? 'Next →' : 'Create User'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
