import { useState, useEffect } from 'react'
import api from '@/services/api'
import './AdminDashboard.css'

// ─── Types ────────────────────────────────────────────────────────────
interface Matiere {
  id: number
  nom: string
  code: string
  couleur: string
  description: string
}

interface Classe {
  id: number
  nom: string
  niveau: string
  section: string
  anneeAcademique: string
}

interface Utilisateur {
  id: number
  nom: string
  prenom: string
  email: string
  typeUtilisateur: string
  actif: boolean
}

type Tab = 'matieres' | 'classes' | 'utilisateurs'

// ─── Modal Component ──────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

// ─── AdminDashboard ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('matieres')

  // Matières state
  const [matieres, setMatieres] = useState<Matiere[]>([])
  const [matiereForm, setMatiereForm] = useState({ nom: '', code: '', couleur: '#6366f1', description: '' })
  const [editingMatiere, setEditingMatiere] = useState<Matiere | null>(null)
  const [showMatiereModal, setShowMatiereModal] = useState(false)

  // Classes state
  const [classes, setClasses] = useState<Classe[]>([])
  const [classeForm, setClasseForm] = useState({ nom: '', niveau: '', section: '', anneeAcademique: '' })
  const [editingClasse, setEditingClasse] = useState<Classe | null>(null)
  const [showClasseModal, setShowClasseModal] = useState(false)

  // Utilisateurs state
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // ─── Fetch Data ──────────────────────────────────────────────────────
  const fetchMatieres = async () => {
    try {
      const res = await api.get('/matieres')
      setMatieres(res.data)
    } catch { setError('Erreur lors du chargement des matières') }
  }

  const fetchClasses = async () => {
    try {
      const res = await api.get('/classes')
      setClasses(res.data)
    } catch { setError('Erreur lors du chargement des classes') }
  }

  const fetchUtilisateurs = async () => {
    try {
      const res = await api.get('/utilisateurs')
      setUtilisateurs(res.data)
    } catch { /* liste vide si endpoint pas encore impl */ }
  }

  useEffect(() => {
    fetchMatieres()
    fetchClasses()
    fetchUtilisateurs()
  }, [])

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  // ─── Matières Handlers ───────────────────────────────────────────────
  const openAddMatiere = () => {
    setEditingMatiere(null)
    setMatiereForm({ nom: '', code: '', couleur: '#6366f1', description: '' })
    setShowMatiereModal(true)
  }

  const openEditMatiere = (m: Matiere) => {
    setEditingMatiere(m)
    setMatiereForm({ nom: m.nom, code: m.code, couleur: m.couleur, description: m.description || '' })
    setShowMatiereModal(true)
  }

  const saveMatiere = async () => {
    setLoading(true)
    try {
      if (editingMatiere) {
        await api.put(`/matieres/${editingMatiere.id}`, matiereForm)
        showSuccess('Matière modifiée avec succès !')
      } else {
        await api.post('/matieres', matiereForm)
        showSuccess('Matière ajoutée avec succès !')
      }
      setShowMatiereModal(false)
      fetchMatieres()
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur lors de la sauvegarde')
    } finally { setLoading(false) }
  }

  const deleteMatiere = async (id: number) => {
    if (!confirm('Supprimer cette matière ?')) return
    try {
      await api.delete(`/matieres/${id}`)
      showSuccess('Matière supprimée.')
      fetchMatieres()
    } catch { setError('Erreur lors de la suppression') }
  }

  // ─── Classes Handlers ────────────────────────────────────────────────
  const openAddClasse = () => {
    setEditingClasse(null)
    setClasseForm({ nom: '', niveau: '', section: '', anneeAcademique: '2025-2026' })
    setShowClasseModal(true)
  }

  const openEditClasse = (c: Classe) => {
    setEditingClasse(c)
    setClasseForm({ nom: c.nom, niveau: c.niveau || '', section: c.section || '', anneeAcademique: c.anneeAcademique || '' })
    setShowClasseModal(true)
  }

  const saveClasse = async () => {
    setLoading(true)
    try {
      if (editingClasse) {
        await api.put(`/classes/${editingClasse.id}`, classeForm)
        showSuccess('Classe modifiée avec succès !')
      } else {
        await api.post('/classes', classeForm)
        showSuccess('Classe ajoutée avec succès !')
      }
      setShowClasseModal(false)
      fetchClasses()
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur lors de la sauvegarde')
    } finally { setLoading(false) }
  }

  const deleteClasse = async (id: number) => {
    if (!confirm('Supprimer cette classe ?')) return
    try {
      await api.delete(`/classes/${id}`)
      showSuccess('Classe supprimée.')
      fetchClasses()
    } catch { setError('Erreur lors de la suppression') }
  }

  return (
    <div className="admin-dashboard">
      {/* ── Header ── */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">QB</div>
          <div>
            <h1 className="admin-title">QuizBrain Admin</h1>
            <p className="admin-subtitle">Panneau d'administration</p>
          </div>
        </div>
        <a href="/login" className="admin-logout-btn" onClick={() => {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
        }}>
          Déconnexion
        </a>
      </header>

      {/* ── Notifications ── */}
      {successMsg && <div className="admin-toast admin-toast--success">✓ {successMsg}</div>}
      {error && <div className="admin-toast admin-toast--error">✕ {error} <button onClick={() => setError(null)}>✕</button></div>}

      {/* ── Stats Cards ── */}
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <div>
            <p className="stat-value">{matieres.length}</p>
            <p className="stat-label">Matières</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏫</span>
          <div>
            <p className="stat-value">{classes.length}</p>
            <p className="stat-label">Classes</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div>
            <p className="stat-value">{utilisateurs.length}</p>
            <p className="stat-label">Utilisateurs</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="admin-tabs">
        {(['matieres', 'classes', 'utilisateurs'] as Tab[]).map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'matieres' ? '📚 Matières' : tab === 'classes' ? '🏫 Classes' : '👥 Utilisateurs'}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="admin-content">

        {/* ── Matières Tab ── */}
        {activeTab === 'matieres' && (
          <div>
            <div className="admin-section-header">
              <h2>Gestion des Matières</h2>
              <button className="btn-primary" onClick={openAddMatiere}>+ Ajouter une matière</button>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Couleur</th>
                    <th>Nom</th>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {matieres.length === 0 ? (
                    <tr><td colSpan={5} className="table-empty">Aucune matière. Cliquez sur "Ajouter" pour commencer.</td></tr>
                  ) : matieres.map(m => (
                    <tr key={m.id}>
                      <td><span className="color-badge" style={{ backgroundColor: m.couleur }} /></td>
                      <td className="td-bold">{m.nom}</td>
                      <td><span className="code-chip">{m.code}</span></td>
                      <td className="td-muted">{m.description || '—'}</td>
                      <td>
                        <button className="btn-icon btn-edit" onClick={() => openEditMatiere(m)}>✏️</button>
                        <button className="btn-icon btn-delete" onClick={() => deleteMatiere(m.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Classes Tab ── */}
        {activeTab === 'classes' && (
          <div>
            <div className="admin-section-header">
              <h2>Gestion des Classes</h2>
              <button className="btn-primary" onClick={openAddClasse}>+ Ajouter une classe</button>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nom de la classe</th>
                    <th>Niveau</th>
                    <th>Section</th>
                    <th>Année académique</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.length === 0 ? (
                    <tr><td colSpan={4} className="table-empty">Aucune classe enregistrée.</td></tr>
                  ) : classes.map(c => (
                    <tr key={c.id}>
                      <td className="td-bold">{c.nom}</td>
                      <td>{c.niveau || '—'}</td>
                      <td>{c.section || '—'}</td>
                      <td>{c.anneeAcademique || '—'}</td>
                      <td>
                        <button className="btn-icon btn-edit" onClick={() => openEditClasse(c)}>✏️</button>
                        <button className="btn-icon btn-delete" onClick={() => deleteClasse(c.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Utilisateurs Tab ── */}
        {activeTab === 'utilisateurs' && (
          <div>
            <div className="admin-section-header">
              <h2>Liste des Utilisateurs</h2>
              <span className="admin-badge">{utilisateurs.length} comptes</span>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nom complet</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {utilisateurs.length === 0 ? (
                    <tr><td colSpan={4} className="table-empty">L'API de gestion des utilisateurs sera disponible en US-1.3 complète.</td></tr>
                  ) : utilisateurs.map(u => (
                    <tr key={u.id}>
                      <td className="td-bold">{u.prenom} {u.nom}</td>
                      <td>{u.email}</td>
                      <td><span className={`role-chip role-chip--${u.typeUtilisateur?.toLowerCase()}`}>{u.typeUtilisateur}</span></td>
                      <td><span className={`status-dot ${u.actif ? 'status-dot--active' : 'status-dot--inactive'}`}>{u.actif ? 'Actif' : 'Inactif'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Matière ── */}
      {showMatiereModal && (
        <Modal title={editingMatiere ? 'Modifier la matière' : 'Nouvelle matière'} onClose={() => setShowMatiereModal(false)}>
          <div className="form-group">
            <label>Nom *</label>
            <input type="text" value={matiereForm.nom} onChange={e => setMatiereForm(f => ({ ...f, nom: e.target.value }))} placeholder="Ex: Mathématiques" />
          </div>
          <div className="form-group">
            <label>Code * (majuscules, sans espace)</label>
            <input type="text" value={matiereForm.code} onChange={e => setMatiereForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="Ex: MATH" />
          </div>
          <div className="form-group form-group--color">
            <label>Couleur</label>
            <input type="color" value={matiereForm.couleur} onChange={e => setMatiereForm(f => ({ ...f, couleur: e.target.value }))} />
            <span>{matiereForm.couleur}</span>
          </div>
          <div className="form-group">
            <label>Description (optionnel)</label>
            <input type="text" value={matiereForm.description} onChange={e => setMatiereForm(f => ({ ...f, description: e.target.value }))} placeholder="Ex: Analyse, Algèbre, Géométrie..." />
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setShowMatiereModal(false)}>Annuler</button>
            <button className="btn-primary" onClick={saveMatiere} disabled={loading}>
              {loading ? 'Sauvegarde...' : editingMatiere ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Modal Classe ── */}
      {showClasseModal && (
        <Modal title={editingClasse ? 'Modifier la classe' : 'Nouvelle classe'} onClose={() => setShowClasseModal(false)}>
          <div className="form-group">
            <label>Nom de la classe *</label>
            <input type="text" value={classeForm.nom} onChange={e => setClasseForm(f => ({ ...f, nom: e.target.value }))} placeholder="Ex: Terminale A" />
          </div>
          <div className="form-group">
            <label>Niveau</label>
            <input type="text" value={classeForm.niveau} onChange={e => setClasseForm(f => ({ ...f, niveau: e.target.value }))} placeholder="Ex: Terminale, 2ème année..." />
          </div>
          <div className="form-group">
            <label>Section</label>
            <input type="text" value={classeForm.section} onChange={e => setClasseForm(f => ({ ...f, section: e.target.value }))} placeholder="Ex: A, Sciences, Lettres..." />
          </div>
          <div className="form-group">
            <label>Année académique</label>
            <input type="text" value={classeForm.anneeAcademique} onChange={e => setClasseForm(f => ({ ...f, anneeAcademique: e.target.value }))} placeholder="Ex: 2025-2026" />
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setShowClasseModal(false)}>Annuler</button>
            <button className="btn-primary" onClick={saveClasse} disabled={loading}>
              {loading ? 'Sauvegarde...' : editingClasse ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
