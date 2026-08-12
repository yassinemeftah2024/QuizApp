import api from './api'
export const searchBankQuestions = (params?: {search?: string; subjectId?: number; categoryId?: number}) => api.get('/teacher/question-bank', { params }).then(r => r.data)
export const getQuestionCategories = () => api.get('/teacher/question-bank/categories').then(r => r.data)
export const importQuestionFile = (file: File) => { const form = new FormData(); form.append('file', file); return api.post('/teacher/question-bank/import', form, { headers: {'Content-Type':'multipart/form-data'} }).then(r => r.data) }
export const downloadQuestionTemplate = () => api.get('/teacher/question-bank/import/template', { responseType: 'blob' }).then(r => { const url=URL.createObjectURL(r.data); const a=document.createElement('a'); a.href=url; a.download='question-import-template.xlsx'; a.click(); URL.revokeObjectURL(url) })
export const addBankQuestionToQuiz = (questionId: number, quizId: number) => api.post(`/teacher/question-bank/${questionId}/add-to-quiz/${quizId}`).then(r => r.data)
export const createBankQuestion = (data: any) => api.post('/teacher/question-bank', data).then(r => r.data)
