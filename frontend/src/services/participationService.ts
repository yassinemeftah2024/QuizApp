import api from './api'

export interface JoinSessionPayload {
  sessionId: number
  pseudonyme: string
  utilisateurId?: number | null
}

export interface ParticipationResponse {
  id: number
  pseudonyme: string
  sessionId: number
  scoreTotal?: number
  tempsTotal?: number
  terminee?: boolean
}

export const participationService = {
  join: async (payload: JoinSessionPayload): Promise<ParticipationResponse> => {
    const { data } = await api.post<ParticipationResponse>('/api/participations/join', payload)
    return data
  },

  getBySession: async (sessionId: number) => {
    const { data } = await api.get(`/api/participations/session/${sessionId}`)
    return data
  },
}