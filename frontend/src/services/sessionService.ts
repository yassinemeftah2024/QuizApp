import api from './api'
import type { SessionQuizDTO, ParticipationDTO } from '@/types'

// Adapter les noms backend → frontend
export interface CreateSessionPayload {
  qcmId: number
  createdBy: number
  mode: string
  nombreMaxParticipants?: number
}

export interface SessionResponse {
  id: number
  codePIN: string
  qrCodeToken: string
  statut: string
  mode: string
  qcmId: number
  createdBy: number
  nombreMaxParticipants?: number
  currentQuestionIndex: number
}

export const sessionService = {
  /** Créer une session live */
  create: async (payload: CreateSessionPayload): Promise<SessionResponse> => {
    const { data } = await api.post<SessionResponse>('/api/sessions', payload)
    return data
  },

  /** Récupérer une session par ID */
  getById: async (id: number): Promise<SessionResponse> => {
    const { data } = await api.get<SessionResponse>(`/api/sessions/${id}`)
    return data
  },

  /** Récupérer par PIN */
  getByPin: async (pin: string): Promise<SessionResponse> => {
    const { data } = await api.get<SessionResponse>(`/api/sessions/pin/${pin}`)
    return data
  },

  /** Démarrer la session */
  start: async (id: number): Promise<SessionResponse> => {
    const { data } = await api.post<SessionResponse>(`/api/sessions/${id}/start`)
    return data
  },

  /** Terminer la session */
  finish: async (id: number): Promise<SessionResponse> => {
    const { data } = await api.post<SessionResponse>(`/api/sessions/${id}/finish`)
    return data
  },

  /** QR Code (base64) */
  getQrCode: async (id: number): Promise<string> => {
    const { data } = await api.get<{ qrCode: string }>(`/api/sessions/${id}/qrcode`)
    return data.qrCode
  },

  /** Liste des participants */
  getParticipants: async (sessionId: number) => {
    const { data } = await api.get(`/api/participations/session/${sessionId}`)
    return data
  },

  /** Classement */
  getLeaderboard: async (sessionId: number) => {
    const { data } = await api.get(`/api/participations/session/${sessionId}/leaderboard`)
    return data
  },
}