import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'
import type { AvatarAnimal } from '@/types'
import { getMyProfile, updateMyProfile, uploadPhoto, deletePhoto, changePassword } from '@/services/profileService'
import './ProfilePage.css'

interface ProfileData {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
  avatarAnimal?: string
  photoBase64?: string
  dateCreation: string
}

const AVATAR_ANIMALS: AvatarAnimal[] = ['Lion', 'Tiger', 'Eagle', 'Dolphin', 'Fox', 'Panda', 'Dragon', 'Unicorn']

const AVATAR_EMOJIS: Record<AvatarAnimal, string> = {
  Lion: '🦁',
  Tiger: '🐯',
  Eagle: '🦅',
  Dolphin: '🐬',
  Fox: '🦊',
  Panda: '🐼',
  Dragon: '🐉',
  Unicorn: '🦄',
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [infoForm, setInfoForm] = useState({ nom: '', prenom: '', email: '', avatarAnimal: '' })
  const [pwdForm, setPwdForm] = useState({ ancienMotDePasse: '', nouveauMotDePasse: '' })
  const [loading, setLoading] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyProfile().then(res => {
      setProfile(res)
      setInfoForm({ nom: res.nom, prenom: res.prenom, email: res.email, avatarAnimal: res.avatarAnimal || '' })
    }).catch(() => navigate('/login'))
  }, [navigate])

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await updateMyProfile(infoForm)
      setProfile(res)
      showSuccess('Informations mises à jour avec succès !')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur lors de la mise à jour.')
    } finally { setLoading(false) }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await changePassword(pwdForm)
      setPwdForm({ ancienMotDePasse: '', nouveauMotDePasse: '' })
      showSuccess('Mot de passe modifié avec succès !')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur : ancien mot de passe incorrect.')
    } finally { setLoading(false) }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type and size (2MB max)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Format non supporté. Utilisez JPEG, PNG ou WebP.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Fichier trop volumineux (max 2 Mo).')
      return
    }

    setPhotoLoading(true)
    setError(null)
    try {
      const res = await uploadPhoto(file)
      setProfile(res)
      showSuccess('Photo de profil mise à jour !')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur lors de l\'upload.')
    } finally { setPhotoLoading(false) }
  }

  const handlePhotoDelete = async () => {
    if (!window.confirm('Supprimer votre photo de profil ?')) return
    setPhotoLoading(true)
    try {
      const res = await deletePhoto()
      setProfile(res)
      showSuccess('Photo supprimée.')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur lors de la suppression.')
    } finally { setPhotoLoading(false) }
  }

  const roleLabel: Record<string, string> = {
    ADMIN: '👑 Administrateur',
    ENSEIGNANT: '🍎 Enseignant',
    ETUDIANT: '🎓 Étudiant',
  }

  if (!profile) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner" />
        <p>Chargement du profil...</p>
      </div>
    )
  }

  const getDisplayImage = () => {
    if (profile.photoBase64) return profile.photoBase64
    // Fallback to avatar animal emoji or initials
    return null
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* ── Back button ── */}
        <button className="profile-back-btn" onClick={() => navigate(-1)}>← Retour</button>

        {/* ── Notifications ── */}
        {successMsg && <div className="profile-toast profile-toast--success">✓ {successMsg}</div>}
        {error && <div className="profile-toast profile-toast--error">✕ {error}</div>}

        {/* ── Avatar Card ── */}
        <div className="profile-card profile-card--identity">
          <div className="profile-avatar-wrapper">
            {profile.photoBase64 ? (
              <img
                src={profile.photoBase64}
                alt={`${profile.prenom} ${profile.nom}`}
                className="profile-photo"
              />
            ) : (
              <div className="profile-avatar">
                {profile.avatarAnimal ? AVATAR_EMOJIS[profile.avatarAnimal as AvatarAnimal] : `${profile.prenom[0]}${profile.nom[0]}`}
              </div>
            )}
            <label className="photo-upload-label" htmlFor="photo-upload">
              <span className="photo-upload-icon">📷</span>
              <span className="photo-upload-text">{profile.photoBase64 ? 'Changer' : 'Ajouter photo'}</span>
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                disabled={photoLoading}
                style={{ display: 'none' }}
              />
            </label>
            {profile.photoBase64 && (
              <button
                className="photo-delete-btn"
                onClick={handlePhotoDelete}
                disabled={photoLoading}
                title="Supprimer la photo"
              >
                ✕
              </button>
            )}
          </div>
          <div>
            <h1 className="profile-name">{profile.prenom} {profile.nom}</h1>
            <span className="profile-role-badge">{roleLabel[profile.role] || profile.role}</span>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-since">Membre depuis le {new Date(profile.dateCreation).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="profile-grid">
          {/* ── Informations personnelles ── */}
          <div className="profile-card">
            <h2 className="profile-section-title">✏️ Informations personnelles</h2>
            <form onSubmit={handleUpdateInfo}>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" value={infoForm.prenom} onChange={e => setInfoForm(f => ({ ...f, prenom: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" value={infoForm.nom} onChange={e => setInfoForm(f => ({ ...f, nom: e.target.value }))} required />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse email</label>
                <input type="email" value={infoForm.email} onChange={e => setInfoForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Avatar animal</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                  {AVATAR_ANIMALS.map(animal => (
                    <button
                      key={animal}
                      type="button"
                      onClick={() => setInfoForm(f => ({ ...f, avatarAnimal: animal }))}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 10,
                        border: `2px solid ${infoForm.avatarAnimal === animal ? '#2563EB' : '#E2E8F0'}`,
                        background: infoForm.avatarAnimal === animal ? '#EFF6FF' : '#fff',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600,
                        color: infoForm.avatarAnimal === animal ? '#1D4ED8' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{AVATAR_EMOJIS[animal]}</span>
                      {animal}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
            </form>
          </div>

          {/* ── Changer le mot de passe ── */}
          <div className="profile-card">
            <h2 className="profile-section-title">🔒 Sécurité</h2>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Ancien mot de passe</label>
                <input type="password" value={pwdForm.ancienMotDePasse} onChange={e => setPwdForm(f => ({ ...f, ancienMotDePasse: e.target.value }))} required placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label>Nouveau mot de passe (min. 6 caractères)</label>
                <input type="password" value={pwdForm.nouveauMotDePasse} onChange={e => setPwdForm(f => ({ ...f, nouveauMotDePasse: e.target.value }))} required placeholder="••••••••" minLength={6} />
              </div>
              <button type="submit" className="btn-danger" disabled={loading}>
                {loading ? 'Modification...' : 'Changer le mot de passe'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
