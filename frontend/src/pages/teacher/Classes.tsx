import { useEffect, useState } from 'react'
import type { ClasseDTO, UtilisateurDTO } from '@/types'
import { assignStudent, getAvailableStudents, getClassStudents, getTeacherClasses, removeStudent } from '@/services/teacherClassService'
import api from '@/services/api'

interface SubjectRequest {
  id: number
  studentName: string
  matiereNom: string
  status: string
}

export default function TeacherClasses() {
  const [classes, setClasses] = useState<ClasseDTO[]>([])
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [students, setStudents] = useState<UtilisateurDTO[]>([])
  const [available, setAvailable] = useState<UtilisateurDTO[]>([])
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [subjectRequests, setSubjectRequests] = useState<SubjectRequest[]>([])
  const [processing, setProcessing] = useState<number | null>(null)

  const loadRequests = () => api.get('/teacher/subject-requests').then(response => setSubjectRequests(response.data))

  const refreshStudents = async (classId: number) => {
    const [current, unassigned] = await Promise.all([getClassStudents(classId), getAvailableStudents()])
    setStudents(current)
    setAvailable(unassigned)
  }

  useEffect(() => {
    loadRequests()
    getTeacherClasses().then(data => {
      setClasses(data)
      if (data[0]) {
        setSelectedClass(data[0].id)
        refreshStudents(data[0].id)
      }
    })
  }, [])

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const decideRequest = async (id: number, approve: boolean) => {
    setProcessing(id)
    try {
      await api.patch(`/teacher/subject-requests/${id}?approve=${approve}`)
      await loadRequests()
      showMessage(approve ? 'Request approved' : 'Request rejected', 'success')
    } catch {
      showMessage('Failed to process request', 'error')
    } finally {
      setProcessing(null)
    }
  }

  const chooseClass = (id: number) => {
    setSelectedClass(id)
    refreshStudents(id)
  }

  const add = async (studentId: number) => {
    if (!selectedClass) return
    try {
      await assignStudent(selectedClass, studentId)
      await refreshStudents(selectedClass)
      showMessage('Student added to class', 'success')
    } catch {
      showMessage('Failed to add student', 'error')
    }
  }

  const remove = async (studentId: number) => {
    if (!selectedClass) return
    try {
      await removeStudent(selectedClass, studentId)
      await refreshStudents(selectedClass)
      showMessage('Student removed from class', 'success')
    } catch {
      showMessage('Failed to remove student', 'error')
    }
  }

  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      {/* Toast notification */}
      {message && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 1000,
          background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2',
          color: message.type === 'success' ? '#166534' : '#991B1B',
          border: `1px solid ${message.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
          borderRadius: 10, padding: '12px 18px', fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s ease-out',
        }}>
          {message.type === 'success' ? '✓' : '✕'} {message.text}
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>
          Manage student enrollment in your assigned classes and approve subject requests.
        </p>
      </div>

      {/* Subject requests card */}
      <div style={{
        background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
        padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <h3 style={{
          margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#0F172A',
          fontFamily: 'Outfit, sans-serif',
        }}>
          📬 Subject Enrollment Requests
        </h3>
        {subjectRequests.length === 0 ? (
          <p style={{ color: '#94A3B8', fontSize: 14, margin: 0 }}>No pending subject requests.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {subjectRequests.map(request => (
              <div key={request.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', background: '#F8FAFC', borderRadius: 10,
                border: '1px solid #E2E8F0',
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>
                    {request.studentName}
                  </span>
                  <span style={{ color: '#64748B', fontSize: 14 }}> wants to join </span>
                  <span style={{
                    background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px',
                    borderRadius: 6, fontSize: 13, fontWeight: 600,
                  }}>
                    {request.matiereNom}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => decideRequest(request.id, false)}
                    disabled={processing === request.id}
                    style={{
                      background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
                      borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600,
                      cursor: processing === request.id ? 'default' : 'pointer',
                      opacity: processing === request.id ? 0.6 : 1,
                    }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => decideRequest(request.id, true)}
                    disabled={processing === request.id}
                    style={{
                      background: 'linear-gradient(90deg,#16A34A,#15803D)', color: '#fff',
                      border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13,
                      fontWeight: 700, cursor: processing === request.id ? 'default' : 'pointer',
                      opacity: processing === request.id ? 0.6 : 1,
                      fontFamily: 'Outfit, sans-serif',
                    }}
                  >
                    {processing === request.id ? 'Processing…' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Class selector */}
      {classes.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
          padding: 40, textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏫</div>
          <p style={{ color: '#64748B', fontSize: 15, margin: 0 }}>
            No classes have been assigned to you yet. Contact an administrator.
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{
              margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#0F172A',
              fontFamily: 'Outfit, sans-serif',
            }}>
              Select a class
            </h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {classes.map(item => (
                <button
                  key={item.id}
                  onClick={() => chooseClass(item.id)}
                  style={{
                    padding: '12px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 14,
                    fontWeight: 600, transition: 'all 0.2s',
                    border: selectedClass === item.id ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    background: selectedClass === item.id
                      ? 'linear-gradient(135deg,#EFF6FF,#DBEAFE)'
                      : '#fff',
                    color: selectedClass === item.id ? '#1D4ED8' : '#475569',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  {item.niveau || item.nom}
                  {item.section && ` — ${item.section}`}
                  <span style={{
                    marginLeft: 6, background: selectedClass === item.id ? '#2563EB' : '#E2E8F0',
                    color: selectedClass === item.id ? '#fff' : '#64748B',
                    padding: '2px 6px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                  }}>
                    {item.nombreEtudiants || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {selectedClass && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Students in class */}
              <div style={{
                background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
                padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <h3 style={{
                  margin: '0 0 16px', fontSize: 17, fontWeight: 700, color: '#0F172A',
                  fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span>👥</span> Students in this class
                  <span style={{
                    marginLeft: 'auto', background: '#F0FDF4', color: '#166534',
                    padding: '3px 8px', borderRadius: 6, fontSize: 13, fontWeight: 700,
                  }}>
                    {students.length}
                  </span>
                </h3>
                {students.length === 0 ? (
                  <p style={{ color: '#94A3B8', fontSize: 14, margin: 0, textAlign: 'center', padding: '20px 0' }}>
                    No students in this class yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {students.map(student => (
                      <div key={student.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 14px', background: '#F8FAFC', borderRadius: 10,
                        border: '1px solid #E2E8F0', transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#EFF6FF'
                          e.currentTarget.style.borderColor = '#BFDBFE'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = '#F8FAFC'
                          e.currentTarget.style.borderColor = '#E2E8F0'
                        }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>
                            {student.prenom} {student.nom}
                          </div>
                          <div style={{ fontSize: 12, color: '#94A3B8' }}>{student.email}</div>
                        </div>
                        <button
                          onClick={() => remove(student.id)}
                          style={{
                            background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
                            borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#DC2626'
                            e.currentTarget.style.color = '#fff'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = '#FEF2F2'
                            e.currentTarget.style.color = '#DC2626'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available students */}
              <div style={{
                background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
                padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <h3 style={{
                  margin: '0 0 16px', fontSize: 17, fontWeight: 700, color: '#0F172A',
                  fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span>➕</span> Students without a class
                  <span style={{
                    marginLeft: 'auto', background: '#FEF3C7', color: '#92400E',
                    padding: '3px 8px', borderRadius: 6, fontSize: 13, fontWeight: 700,
                  }}>
                    {available.length}
                  </span>
                </h3>
                {available.length === 0 ? (
                  <p style={{ color: '#94A3B8', fontSize: 14, margin: 0, textAlign: 'center', padding: '20px 0' }}>
                    All students are assigned to a class.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {available.map(student => (
                      <div key={student.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 14px', background: '#F8FAFC', borderRadius: 10,
                        border: '1px solid #E2E8F0', transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#F0FDF4'
                          e.currentTarget.style.borderColor = '#BBF7D0'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = '#F8FAFC'
                          e.currentTarget.style.borderColor = '#E2E8F0'
                        }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>
                            {student.prenom} {student.nom}
                          </div>
                          <div style={{ fontSize: 12, color: '#94A3B8' }}>{student.email}</div>
                        </div>
                        <button
                          onClick={() => add(student.id)}
                          style={{
                            background: 'linear-gradient(90deg,#16A34A,#15803D)', color: '#fff',
                            border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12,
                            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                            fontFamily: 'Outfit, sans-serif',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
