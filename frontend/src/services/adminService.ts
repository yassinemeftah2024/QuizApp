import api from './api'
import type { UtilisateurDTO, ClasseDTO, RegisterRequest } from '@/types'

export interface AdminCreateUserRequest extends RegisterRequest {
  classeId?: number
  matiereIds?: number[]
  classeIds?: number[]
  etablissement?: string
  departement?: string
}

// ──────────────────────────────────────────────────────────────────
// Admin — Gestion des Utilisateurs
// ──────────────────────────────────────────────────────────────────

export interface AdminStatsDTO {
  totalTeachers: number
  totalStudents: number
  totalAdmins: number
  totalUsers: number
  activeSessToday: number
  totalQuizzes: number
}

export const getAdminStats = (): Promise<AdminStatsDTO> =>
  api.get('/admin/stats').then(r => r.data)

export const getAllUsers = (): Promise<UtilisateurDTO[]> =>
  api.get('/admin/users').then(r => r.data)

export const createUser = (data: AdminCreateUserRequest): Promise<UtilisateurDTO> =>
  api.post('/admin/users', data).then(r => r.data)

export const toggleUserStatus = (id: number): Promise<UtilisateurDTO> =>
  api.patch(`/admin/users/${id}/toggle-status`).then(r => r.data)

export const deleteUser = (id: number): Promise<void> =>
  api.delete(`/admin/users/${id}`).then(r => r.data)

export const updateTeacherAssignments = (id: number, data: { matiereIds: number[]; classeIds: number[] }): Promise<UtilisateurDTO> =>
  api.put(`/admin/users/${id}/teacher-assignments`, data).then(r => r.data)

// ──────────────────────────────────────────────────────────────────
// Classes
// ──────────────────────────────────────────────────────────────────

export interface ClasseWithStats {
  id: number
  nom: string
  niveau?: string
  section?: string
  anneeAcademique?: string
  nombreEtudiants: number
}

export const getClasses = (): Promise<ClasseWithStats[]> =>
  api.get('/classes').then(r => r.data)

export const createClasse = (data: Omit<ClasseDTO, 'id'>): Promise<ClasseWithStats> =>
  api.post('/classes', data).then(r => r.data)

export const updateClasse = (id: number, data: Omit<ClasseDTO, 'id'>): Promise<ClasseWithStats> =>
  api.put(`/classes/${id}`, data).then(r => r.data)

export const deleteClasse = (id: number): Promise<void> =>
  api.delete(`/classes/${id}`)

// ──────────────────────────────────────────────────────────────────
// Matieres (subjects)
// ──────────────────────────────────────────────────────────────────

export interface MatiereDTO {
  id?: number
  nom: string
  code?: string
  description?: string
}

export const getMatieres = (): Promise<MatiereDTO[]> =>
  api.get('/matieres').then(r => r.data)

export const createMatiere = (data: Omit<MatiereDTO, 'id'>): Promise<MatiereDTO> =>
  api.post('/matieres', data).then(r => r.data)

export const deleteMatiere = (id: number): Promise<void> =>
  api.delete(`/matieres/${id}`)

// ──────────────────────────────────────────────────────────────────
// Excel Import
// ──────────────────────────────────────────────────────────────────

export interface RowError {
  row: number
  message: string
}

export interface UserImportResultDTO {
  totalRows: number
  created: number
  failed: number
  errors: RowError[]
}

export const importUsers = (file: File): Promise<UserImportResultDTO> => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/admin/users/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data)
}

export const downloadImportTemplate = (): Promise<Blob> =>
  api.get('/admin/users/import/template', { responseType: 'blob' }).then(r => r.data)
