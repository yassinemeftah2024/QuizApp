import api from './api'

export interface ProfileResponse {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
  avatarAnimal?: string
  photoBase64?: string
  actif: boolean
  dateCreation: string
  classeId?: number
  classeNom?: string
  classeNiveau?: string
  classeSection?: string
}

export interface UpdateProfileRequest {
  nom: string
  prenom: string
  email: string
  avatarAnimal?: string
}

export interface ChangePasswordRequest {
  ancienMotDePasse: string
  nouveauMotDePasse: string
}

export const getMyProfile = (): Promise<ProfileResponse> =>
  api.get('/profile/me').then(r => r.data)

export const updateMyProfile = (data: UpdateProfileRequest): Promise<ProfileResponse> =>
  api.put('/profile/me', data).then(r => r.data)

export const uploadPhoto = (file: File): Promise<ProfileResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/profile/me/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data)
}

export const deletePhoto = (): Promise<ProfileResponse> =>
  api.delete('/profile/me/photo').then(r => r.data)

export const changePassword = (data: ChangePasswordRequest): Promise<void> =>
  api.put('/profile/me/password', data)
