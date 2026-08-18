import api from './api'
import type { QuestionDTO } from '@/types'

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
    const { data } = await api.post<SessionResponse>('/sessions', payload)
    return data
  },

  /** Récupérer une session par ID */
  getById: async (id: number): Promise<SessionResponse> => {
    const { data } = await api.get<SessionResponse>(`/sessions/${id}`)
    return data
  },

  /** Récupérer par PIN */
  getByPin: async (pin: string): Promise<SessionResponse> => {
    const { data } = await api.get<SessionResponse>(`/sessions/pin/${pin}`)
    return data
  },

  /** Récupérer les questions de la session */
  getQuestions: async (sessionId: number): Promise<QuestionDTO[]> => {
    const { data } = await api.get<QuestionDTO[]>(`/sessions/${sessionId}/questions`)
    return data
  },

  /** Démarrer la session */
  start: async (id: number): Promise<SessionResponse> => {
    const { data } = await api.post<SessionResponse>(`/sessions/${id}/start`)
    return data
  },

  /** Terminer la session */
  finish: async (id: number): Promise<SessionResponse> => {
    const { data } = await api.post<SessionResponse>(`/sessions/${id}/finish`)
    return data
  },

  /** QR Code (base64) */
  getQrCode: async (id: number): Promise<string> => {
    const { data } = await api.get<{ qrCode: string }>(`/sessions/${id}/qrcode`)
    return data.qrCode
  },

  /** Liste des participants */
  getParticipants: async (sessionId: number) => {
    const { data } = await api.get(`/participations/session/${sessionId}`)
    return data
  },

  /** Classement */
  getLeaderboard: async (sessionId: number) => {
    const { data } = await api.get(`/participations/session/${sessionId}/leaderboard`)
    return data
  },

  nextQuestion: async (id: number): Promise<SessionResponse> => {
    const { data } = await api.post<SessionResponse>(`/sessions/${id}/next-question`)
    return data
  },
}