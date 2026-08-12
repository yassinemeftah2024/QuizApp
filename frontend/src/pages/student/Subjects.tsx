import { useEffect, useState } from 'react'
import api from '@/services/api'

interface Subject { id: number; nom: string; code: string; description?: string }

export default function StudentSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [requests, setRequests] = useState<Record<number, string>>({})
  const load = () => Promise.all([api.get('/matieres'), api.get('/student/subjects/requests')]).then(([subjectResponse, requestResponse]) => {
    setSubjects(subjectResponse.data)
    setRequests(Object.fromEntries(requestResponse.data.map((request: any) => [request.matiereId, request.status])))
  })
  useEffect(() => { load() }, [])
  const requestJoin = async (subjectId: number) => { await api.post(`/student/subjects/${subjectId}/request`); await load() }
  return <div style={{ padding: 28, background: '#F8FAFC', minHeight: '100%' }}>
    <h1 style={{ marginTop: 0, color: '#0F172A' }}>My Subjects</h1>
    <p style={{ color: '#64748B' }}>Subjects available for your class and teacher requests.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
      {subjects.map(subject => <div key={subject.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20 }}>
        <div style={{ color: '#2563EB', fontWeight: 800 }}>{subject.code}</div><h3 style={{ color: '#0F172A' }}>{subject.nom}</h3>
        <p style={{ color: '#64748B', fontSize: 13 }}>{subject.description || 'Learn, practice, and join quizzes for this subject.'}</p>
        <button disabled={requests[subject.id] === 'PENDING' || requests[subject.id] === 'APPROVED'} onClick={() => requestJoin(subject.id)} style={{ padding: '9px 14px', border: 0, borderRadius: 8, background: requests[subject.id] === 'APPROVED' ? '#F0FDF4' : '#EFF6FF', color: requests[subject.id] === 'APPROVED' ? '#16A34A' : '#2563EB', fontWeight: 700 }}>
          {requests[subject.id] === 'APPROVED' ? 'Approved' : requests[subject.id] === 'PENDING' ? 'Pending teacher approval' : requests[subject.id] === 'REJECTED' ? 'Request again' : 'Request to join'}
        </button>
      </div>)}
      {subjects.length === 0 && <p style={{ color: '#94A3B8' }}>No subjects are available yet.</p>}
    </div>
  </div>
}
