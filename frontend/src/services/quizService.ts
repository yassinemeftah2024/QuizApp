import api from './api'
import type { QCMDTO, CreateQCMRequest, QuestionDTO, CreateQuestionRequest } from '@/types'

// ──────────────────────────────────────────────────────────────────
// QCM (Quiz)
// ──────────────────────────────────────────────────────────────────

export const getMyQuizzes = (): Promise<QCMDTO[]> =>
  api.get('/teacher/quizzes').then(r => r.data)

export const getQuizById = (id: number): Promise<QCMDTO> =>
  api.get(`/teacher/quizzes/${id}`).then(r => r.data)

export const createQuiz = (data: CreateQCMRequest): Promise<QCMDTO> =>
  api.post('/teacher/quizzes', data).then(r => r.data)

export const updateQuiz = (id: number, data: Partial<CreateQCMRequest>): Promise<QCMDTO> =>
  api.put(`/teacher/quizzes/${id}`, data).then(r => r.data)

export const publishQuiz = (id: number): Promise<QCMDTO> =>
  api.patch(`/teacher/quizzes/${id}/publish`).then(r => r.data)

export const deleteQuiz = (id: number): Promise<void> =>
  api.delete(`/teacher/quizzes/${id}`)

// ──────────────────────────────────────────────────────────────────
// Questions
// ──────────────────────────────────────────────────────────────────

export const getQuestions = (quizId: number): Promise<QuestionDTO[]> =>
  api.get(`/teacher/quizzes/${quizId}/questions`).then(r => r.data)

export const addQuestion = (quizId: number, data: CreateQuestionRequest): Promise<QuestionDTO> =>
  api.post(`/teacher/quizzes/${quizId}/questions`, data).then(r => r.data)

export const updateQuestion = (quizId: number, questionId: number, data: Partial<CreateQuestionRequest>): Promise<QuestionDTO> =>
  api.put(`/teacher/quizzes/${quizId}/questions/${questionId}`, data).then(r => r.data)

export const deleteQuestion = (quizId: number, questionId: number): Promise<void> =>
  api.delete(`/teacher/quizzes/${quizId}/questions/${questionId}`)

export const replaceQuestions = (quizId: number, data: CreateQuestionRequest[]): Promise<QuestionDTO[]> =>
  api.put(`/teacher/quizzes/${quizId}/questions`, data).then(r => r.data)

export const uploadQuestionMedia = (file: File): Promise<{url: string; type: string}> => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/teacher/question-media', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
}

// ──────────────────────────────────────────────────────────────────
// Teacher Dashboard Stats
// ──────────────────────────────────────────────────────────────────

export interface TeacherStatsDTO {
  activeQuizzes: number
  sessionsThisWeek: number
  avgStudentScore: number
  studentsReached: number
  sessionsPerDay: { day: string; sessions: number }[]
  recentQuizzes: {
    id: number
    titre: string
    matiere?: string
    nombreQuestions: number
    publie: boolean
    dateModification?: string
  }[]
}

export const getTeacherStats = (): Promise<TeacherStatsDTO> =>
  api.get('/teacher/stats').then(r => r.data)
