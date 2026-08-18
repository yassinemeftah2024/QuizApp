import { useEffect, useState } from 'react'
import { createQuiz, getQuestions, getQuizById, publishQuiz, replaceQuestions, updateQuiz, uploadQuestionMedia } from '@/services/quizService'
import { sessionService } from '@/services/sessionService'
import { useNavigate, useParams } from 'react-router-dom'
import api from '@/services/api'
import type { ModeQuizEnum, CreateQuestionRequest } from '@/types'

interface Question {
  id: number
  text: string
  type: 'mcq' | 'multiple' | 'truefalse' | 'open'
  options: string[]
  correct: number[]
  explanation: string
  mediaUrl?: string
  mediaType?: string
  mediaAlt?: string
  expanded: boolean
}

const defaultQuestion = (): Question => ({
  id: Date.now(),
  text: '', type: 'mcq',
  options: ['', '', '', ''],
  correct: [0], explanation: '', expanded: true,
})

interface Props {
  onToast: (msg: string, type?: string) => void
  onBack: () => void
}

export default function QuizCreate({ onToast, onBack }: Props) {
  const navigate = useNavigate()
  const { quizId } = useParams()
  const editingId = quizId ? Number(quizId) : undefined
  const [meta, setMeta] = useState({
    title: '', subject: '', level: 'L1', duration: 15,
    mode: 'ENTRAINEMENT' as ModeQuizEnum, description: '', difficulty: 'MOYEN', training: true, subjectId: 0, classIds: [] as number[],
  })
  const [subjects, setSubjects] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [questions, setQuestions] = useState<Question[]>([defaultQuestion()])
  const [dragOver, setDragOver] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([api.get('/teacher/subjects'), api.get('/teacher/classes')]).then(([s, c]) => { setSubjects(s.data); setClasses(c.data) }).catch(() => {})
    if (!editingId) return
    Promise.all([getQuizById(editingId), getQuestions(editingId)]).then(([quiz, savedQuestions]) => {
      setMeta({ title: quiz.titre, subject: quiz.matiere || '', subjectId: quiz.matiereId || 0, level: quiz.niveau || 'L1', duration: quiz.dureeMinutes || 15, mode: quiz.mode, description: quiz.description || '', difficulty: quiz.difficulte || 'MOYEN', training: quiz.disponibleEntrainement, classIds: quiz.classeIds || [] })
      setQuestions(savedQuestions.map(q => ({ id: q.id, text: q.texte, type: q.type === 'VRAI_FAUX' ? 'truefalse' : q.type === 'TEXTE_LIBRE' ? 'open' : q.type === 'CHOIX_MULTIPLE' ? 'multiple' : 'mcq', options: q.reponses.map(a => a.texte).concat(['','','','']).slice(0,4), correct: q.reponses.map((a,i) => a.correcte ? i : -1).filter(i => i >= 0), explanation: q.explication || '', mediaUrl: q.mediaUrl, mediaType: q.mediaType, mediaAlt: q.mediaAlt, expanded: true })))
    }).catch((err: any) => onToast(err?.response?.data?.message || 'Unable to load quiz', 'error'))
  }, [editingId])

  const addQuestion = () => setQuestions(prev => [...prev, defaultQuestion()])

  const updateQ = (id: number, patch: Partial<Question>) =>
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q))

  const removeQ = (id: number) => {
    if (questions.length === 1) return
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const duplicateQ = (q: Question) =>
    setQuestions(prev => [...prev, { ...q, id: Date.now(), expanded: true }])

  const getApiErrorMessage = (err: any, fallback: string) => {
    const data = err?.response?.data
    if (data?.message) return data.message
    if (data?.errors && typeof data.errors === 'object') {
      const first = Object.values(data.errors)[0]
      if (typeof first === 'string') return first
    }
    return fallback
  }

  const validateQuiz = () => {
    if (!meta.title.trim()) return 'Please enter a quiz title'
    for (let index = 0; index < questions.length; index++) {
      const q = questions[index]
      const label = `Question ${index + 1}`
      if (!q.text.trim()) return `${label}: enter the question text`
      if (q.type === 'open') continue
      if (q.type === 'truefalse') {
        if (q.correct.length !== 1) return `${label}: choose True or False as the correct answer`
        continue
      }

      const filledAnswerIndexes = q.options
        .map((option, answerIndex) => option.trim() ? answerIndex : -1)
        .filter(answerIndex => answerIndex >= 0)

      if (filledAnswerIndexes.length < 2) return `${label}: add at least two answer options`
      if (!q.correct.some(answerIndex => filledAnswerIndexes.includes(answerIndex))) {
        return `${label}: select a correct answer that has text`
      }
      if (q.type === 'mcq' && q.correct.filter(answerIndex => filledAnswerIndexes.includes(answerIndex)).length !== 1) {
        return `${label}: select exactly one correct answer`
      }
    }
    return null
  }

  const buildQuestions = (): CreateQuestionRequest[] => questions.map((q, index) => ({
    texte: q.text.trim(),
    type: q.type === 'mcq' ? 'CHOIX_UNIQUE' : q.type === 'multiple' ? 'CHOIX_MULTIPLE' : q.type === 'truefalse' ? 'VRAI_FAUX' : 'TEXTE_LIBRE',
    ordre: index + 1,
    dureeSecondes: 30,
    points: 100,
    explication: q.explanation,
    mediaUrl: q.mediaUrl,
    mediaType: q.mediaType,
    mediaAlt: q.mediaAlt,
    reponses: q.type === 'open' ? [] : (q.type === 'truefalse' ? q.options.slice(0, 2) : q.options)
      .map((text, answerIndex) => ({
        texte: q.type === 'truefalse' ? (answerIndex === 0 ? 'True' : 'False') : text,
        correcte: q.correct.includes(answerIndex),
        option: String.fromCharCode(65 + answerIndex) as 'A' | 'B' | 'C' | 'D',
      }))
      .filter(answer => answer.texte.trim()),
  }))

  const handleMedia = async (id: number, file?: File) => {
    if (!file) return
    try {
      const uploaded = await uploadQuestionMedia(file)
      updateQ(id, { mediaUrl: uploaded.url, mediaType: uploaded.type })
      onToast('Media attached', 'success')
    } catch (err: any) {
      onToast(getApiErrorMessage(err, 'Media upload failed'), 'error')
    }
  }

  const handleSaveDraft = async () => {
    const validationError = validateQuiz()
    if (validationError) { onToast(validationError, 'error'); return }
    setSaving(true)
    try {
      const payload = {
        titre: meta.title.trim(), description: meta.description,
        matiere: meta.subject, niveau: meta.level,
        mode: meta.mode, dureeMinutes: meta.duration,
        matiereId: meta.subjectId || undefined, classeIds: meta.classIds,
        difficulte: meta.difficulty as any, disponibleEntrainement: meta.training,
      }
      const created = editingId ? await updateQuiz(editingId, payload) : await createQuiz(payload)
      await replaceQuestions(created.id, buildQuestions())
      onToast('Draft saved successfully! 💾', 'info')
      navigate('/teacher/quizzes')
    } catch (err: any) {
      onToast(getApiErrorMessage(err, 'Failed to save draft'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    const validationError = validateQuiz()
    if (validationError) { onToast(validationError, 'error'); return }
    setSaving(true)
    try {
      const payload = {
        titre: meta.title.trim(), description: meta.description,
        matiere: meta.subject, niveau: meta.level,
        mode: meta.mode, dureeMinutes: meta.duration,
        matiereId: meta.subjectId || undefined, classeIds: meta.classIds,
        difficulte: meta.difficulty as any, disponibleEntrainement: meta.training,
      }
      const created = editingId ? await updateQuiz(editingId, payload) : await createQuiz(payload)
      await replaceQuestions(created.id, buildQuestions())
      await publishQuiz(created.id)
      onToast('Quiz published successfully! 🎉', 'success')
      navigate('/teacher/quizzes')
    } catch (err: any) {
      onToast(getApiErrorMessage(err, 'Failed to publish quiz'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handlePublishAndLaunchLive = async () => {
    const validationError = validateQuiz()
    if (validationError) { onToast(validationError, 'error'); return }
    setSaving(true)
    try {
      const payload = {
        titre: meta.title.trim(), description: meta.description,
        matiere: meta.subject, niveau: meta.level,
        mode: 'LIVE' as ModeQuizEnum, dureeMinutes: meta.duration,
        matiereId: meta.subjectId || undefined, classeIds: meta.classIds,
        difficulte: meta.difficulty as any, disponibleEntrainement: meta.training,
      }
      const created = editingId ? await updateQuiz(editingId, payload) : await createQuiz(payload)
      await replaceQuestions(created.id, buildQuestions())
      await publishQuiz(created.id)
      onToast('Quiz publié ! Lancement de la session live… 🚀', 'success')
      const session = await sessionService.create({
        qcmId: created.id,
        createdBy: 1,
        mode: 'LIVE',
        nombreMaxParticipants: 30,
      })
      navigate(`/teacher/sessions/${session.id}/live`)
    } catch (err: any) {
      onToast(getApiErrorMessage(err, 'Failed to launch live session'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const modeOptions: { v: ModeQuizEnum; label: string; color: string }[] = [
    { v: 'ENTRAINEMENT', label: 'Training', color: '#16A34A' },
    { v: 'EXAMEN', label: 'Exam', color: '#DC2626' },
    { v: 'CHALLENGE', label: 'Challenge', color: '#7C3AED' },
    { v: 'LIVE', label: 'Live', color: '#2563EB' },
  ]

  return (
    <div style={{ padding: 28, display: 'flex', gap: 20, minHeight: '100%' }} className="animate-fade-in">
      {/* Sidebar: metadata */}
      <div style={{ width: 260, flexShrink: 0 }}>
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20, position: 'sticky', top: 20 }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, margin: '0 0 16px', color: '#0F172A' }}>Quiz Details</h3>

          {[
            { key: 'title', label: 'Title *', ph: 'Algèbre Linéaire Ch.3', type: 'text' },
            { key: 'description', label: 'Description', ph: 'Brief description…', type: 'textarea' },
            { key: 'subject', label: 'Subject / Matière', ph: 'Mathematics', type: 'text' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea value={(meta as any)[f.key]} onChange={e => setMeta({ ...meta, [f.key]: e.target.value })}
                  placeholder={f.ph} rows={2}
                  style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }} />
              ) : (
                <input value={(meta as any)[f.key]} onChange={e => setMeta({ ...meta, [f.key]: e.target.value })} placeholder={f.ph}
                  style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              )}
            </div>
          ))}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Official subject</label>
            <select value={meta.subjectId} onChange={e => { const id=Number(e.target.value); const subject=subjects.find(s=>s.id===id); setMeta({ ...meta, subjectId:id, subject:subject?.nom || '' }) }} style={{ width:'100%',padding:'8px 10px',border:'1.5px solid #E2E8F0',borderRadius:8 }}>
              <option value={0}>Select a subject</option>{subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.nom}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Target classes</label>
            <div style={{ display:'grid',gap:5,maxHeight:110,overflow:'auto' }}>{classes.map(classe => <label key={classe.id} style={{fontSize:12,color:'#475569'}}><input type="checkbox" checked={meta.classIds.includes(classe.id)} onChange={e=>setMeta({...meta,classIds:e.target.checked?[...meta.classIds,classe.id]:meta.classIds.filter(id=>id!==classe.id)})} /> {classe.nom} {classe.section ? `(${classe.section})` : ''}</label>)}</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Level / Niveau</label>
            <select value={meta.level} onChange={e => setMeta({ ...meta, level: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}>
              {['L1', 'L2', 'L3', 'M1', 'M2'].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Mode</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {modeOptions.map(m => (
                <button key={m.v} onClick={() => setMeta({ ...meta, mode: m.v })} style={{
                  padding: '5px 10px', borderRadius: 8, border: '1.5px solid',
                  borderColor: meta.mode === m.v ? m.color : '#E2E8F0',
                  background: meta.mode === m.v ? `${m.color}15` : '#fff',
                  color: meta.mode === m.v ? m.color : '#94A3B8',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}>{m.label}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Difficulty</label>
            <select value={meta.difficulty} onChange={e => setMeta({ ...meta, difficulty: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13 }}>
              <option value="FACILE">Easy</option><option value="MOYEN">Medium</option><option value="DIFFICILE">Hard</option>
            </select>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, fontSize: 12, color: '#475569' }}>
              <input type="checkbox" checked={meta.training} onChange={e => setMeta({ ...meta, training: e.target.checked })} /> Available in student Training
            </label>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Duration: {meta.duration}min</label>
            <input type="range" min={5} max={120} step={5} value={meta.duration}
              onChange={e => setMeta({ ...meta, duration: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#2563EB' }} />
          </div>

          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>Questions</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{questions.length}</span>
          </div>
        </div>
      </div>

      {/* Main canvas */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={onBack} style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#64748B', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>← Back</button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSaveDraft} disabled={saving} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '9px 18px', color: '#64748B', fontWeight: 600, fontSize: 14, cursor: saving ? 'default' : 'pointer' }}>
              {saving ? 'Saving…' : 'Save Draft 💾'}
            </button>
            <button onClick={handlePublish} disabled={saving} style={{ background: saving ? '#94A3B8' : 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 20px', fontWeight: 700, fontSize: 14, cursor: saving ? 'default' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              {saving ? 'Publishing…' : 'Publish Quiz ✓'}
            </button>
            <button onClick={handlePublishAndLaunchLive} disabled={saving} style={{ background: saving ? '#94A3B8' : 'linear-gradient(90deg,#16A34A,#15803D)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 20px', fontWeight: 700, fontSize: 14, cursor: saving ? 'default' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              {saving ? 'Lancement…' : 'Publier & Lancer Live ▶'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {questions.map((q, idx) => (
            <div key={q.id}
              style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${dragOver === idx ? '#2563EB' : '#E2E8F0'}`, overflow: 'hidden', transition: 'border-color 0.15s' }}
              draggable
              onDragOver={e => { e.preventDefault(); setDragOver(idx) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => setDragOver(null)}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: q.expanded ? '1px solid #F1F5F9' : 'none', cursor: 'pointer', background: '#FAFBFC' }}
                onClick={() => updateQ(q.id, { expanded: !q.expanded })}>
                <div style={{ cursor: 'grab', color: '#CBD5E1', fontSize: 16 }}>⠿</div>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: q.text ? 600 : 400, color: q.text ? '#0F172A' : '#94A3B8' }}>
                  {q.text || 'Click to add question text…'}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={e => { e.stopPropagation(); duplicateQ(q) }} style={{ background: 'none', border: 'none', padding: '4px 6px', cursor: 'pointer', color: '#94A3B8', fontSize: 14 }} title="Duplicate">⧉</button>
                  <button onClick={e => { e.stopPropagation(); removeQ(q.id) }} style={{ background: 'none', border: 'none', padding: '4px 6px', cursor: 'pointer', color: '#DC2626', fontSize: 14 }} title="Delete">✕</button>
                  <span style={{ fontSize: 14, color: '#94A3B8' }}>{q.expanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {q.expanded && (
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    {[{ key: 'mcq', label: 'Single choice' }, { key: 'multiple', label: 'Multiple choice' }, { key: 'truefalse', label: 'True / False' }, { key: 'open', label: 'Open' }].map(t => (
                      <button key={t.key} onClick={() => updateQ(q.id, { type: t.key as any })} style={{
                        padding: '5px 14px', borderRadius: 20, border: '1.5px solid',
                        borderColor: q.type === t.key ? '#2563EB' : '#E2E8F0',
                        background: q.type === t.key ? '#EFF6FF' : '#fff',
                        color: q.type === t.key ? '#2563EB' : '#64748B',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}>{t.label}</button>
                    ))}
                  </div>

                  <textarea value={q.text} onChange={e => updateQ(q.id, { text: e.target.value })}
                    placeholder="Enter your question here…" rows={2}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 12, fontFamily: 'Inter, sans-serif' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: 10, border: '1px dashed #CBD5E1', borderRadius: 10 }}>
                    <label style={{ color: '#2563EB', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      Add image/video
                      <input type="file" accept="image/*,video/mp4,video/webm" hidden onChange={e => handleMedia(q.id, e.target.files?.[0])} />
                    </label>
                    {q.mediaUrl && <span style={{ color: '#16A34A', fontSize: 12 }}>Media attached</span>}
                  </div>
                  {q.mediaUrl && (q.mediaType === 'VIDEO'
                    ? <video src={q.mediaUrl} controls style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 8, marginBottom: 12 }} />
                    : <img src={q.mediaUrl} alt={q.mediaAlt || 'Question media'} style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 8, marginBottom: 12 }} />)}

                  {(q.type === 'mcq' || q.type === 'multiple') && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                      {q.options.map((opt, oi) => (
                        <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, border: `2px solid ${q.correct.includes(oi) ? '#16A34A' : '#E2E8F0'}`, background: q.correct.includes(oi) ? '#F0FDF4' : '#FAFBFC' }}>
                          <button onClick={() => updateQ(q.id, { correct: q.type === 'multiple' ? (q.correct.includes(oi) ? q.correct.filter(i => i !== oi) : [...q.correct, oi]) : [oi] })} style={{ width: 22, height: 22, borderRadius: q.type === 'multiple' ? 5 : '50%', border: `2px solid ${q.correct.includes(oi) ? '#16A34A' : '#CBD5E1'}`, background: q.correct.includes(oi) ? '#16A34A' : 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11 }}>
                            {q.correct.includes(oi) ? '✓' : ''}
                          </button>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', width: 16, flexShrink: 0 }}>{String.fromCharCode(65 + oi)}</span>
                          <input value={opt} onChange={e => { const opts = [...q.options]; opts[oi] = e.target.value; updateQ(q.id, { options: opts }) }}
                            placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#0F172A' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'truefalse' && (
                    <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                      {[{ v: 0, label: '✓ True' }, { v: 1, label: '✕ False' }].map(btn => (
                        <button key={btn.v} onClick={() => updateQ(q.id, { correct: [btn.v] })} style={{ flex: 1, padding: '12px', borderRadius: 10, border: `2px solid ${q.correct.includes(btn.v) ? '#16A34A' : '#E2E8F0'}`, background: q.correct.includes(btn.v) ? '#F0FDF4' : '#FAFBFC', color: q.correct.includes(btn.v) ? '#16A34A' : '#64748B', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{btn.label}</button>
                      ))}
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Explanation (shown after answer)</label>
                    <input value={q.explanation} onChange={e => updateQ(q.id, { explanation: e.target.value })} placeholder="Why is this the correct answer?"
                      style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
              )}
            </div>
          ))}

          <button onClick={addQuestion} style={{
            width: '100%', padding: '14px', borderRadius: 14, border: '2px dashed #DBEAFE',
            background: '#F0F7FF', color: '#2563EB', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
          }}>
            + Add Question
          </button>
        </div>
      </div>
    </div>
  )
}
