import api from './api'
import type { ClasseDTO, UtilisateurDTO } from '@/types'

export const getTeacherClasses = (): Promise<ClasseDTO[]> => api.get('/teacher/classes').then(r => r.data)
export const getClassStudents = (classId: number): Promise<UtilisateurDTO[]> => api.get(`/teacher/classes/${classId}/students`).then(r => r.data)
export const getAvailableStudents = (): Promise<UtilisateurDTO[]> => api.get('/teacher/students/available').then(r => r.data)
export const assignStudent = (classId: number, studentId: number): Promise<UtilisateurDTO> => api.patch(`/teacher/classes/${classId}/students/${studentId}`).then(r => r.data)
export const removeStudent = (classId: number, studentId: number): Promise<UtilisateurDTO> => api.delete(`/teacher/classes/${classId}/students/${studentId}`).then(r => r.data)
