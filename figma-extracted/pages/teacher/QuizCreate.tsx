import { useState } from 'react'

interface Question {
  id: number
  text: string
  type: 'mcq' | 'truefalse' | 'open'
  options: string[]
  correct: number
  explanation: string
  expanded: boolean
}

const defaultQuestion = (): Question => ({
  id: Date.now(),
  text: '',
  type: 'mcq',
  options: ['', '', '', ''],
  correct: 0,
  explanation: '',
  expanded: true,
})

interface Props {
  onToast: (msg: string, type?: string) => void
  onBack: () => void
}

export default function QuizCreate({ onToast, onBack }: Props) {
  const [meta, setMeta] = useState({ title: '', subject: '', level: 'L1', duration: 15, mode: 'Training', description: '' })
  const [questions, setQuestions] = useState<Question[]>([defaultQuestion()])
  const [dragOver, setDragOver] = useState<number | null>(null)

  const addQuestion = () => setQuestions(prev => [...prev, defaultQuestion()])

  const updateQ = (id: number, patch: Partial<Question>) =>
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q))

  const removeQ = (id: number) => {
    if (questions.length === 1) return
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const duplicateQ = (q: Question) =>
    setQuestions(prev => [...prev, { ...q, id: Date.now(), expanded: true }])

  const handleSaveDraft = () => { onToast('Draft saved successfully!', 'info'); onBack() }
  const handlePublish = () => {
    if (!meta.title) { onToast('Please enter a quiz title', 'error'); return }
    onToast('Quiz published successfully! 🎉', 'success'); onBack()
  }

  const modeColors: Record<string, string> = { Training: '#16A34A', Exam: '#DC2626', Challenge: '#7C3AED' }

  return (
    <div style={{ padding: 28, display: 'flex', gap: 20, minHeight: '100%' }} className="animate-fade-in">
      {/* Left sidebar: metadata */}
      <div style={{ width: 260, flexShrink: 0 }}>
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20, position: 'sticky', top: 20 }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, margin: '0 0 16px', color: '#0F172A' }}>Quiz Details</h3>

          {[
            { key: 'title', label: 'Title', placeholder: 'Algèbre Linéaire Ch.3', type: 'text' },
            { key: 'description', label: 'Description', placeholder: 'Brief description…', type: 'textarea' },
            { key: 'subject', label: 'Subject', placeholder: 'Mathematics', type: 'text' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  value={meta[f.key as keyof typeof meta] as string}
                  onChange={e => setMeta({ ...meta, [f.key]: e.target.value })}
                  placeholder={f.placeholder} rows={2}
                  style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
                  onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                />
              ) : (
                <input
                  value={meta[f.key as keyof typeof meta] as string}
                  onChange={e => setMeta({ ...meta, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                />
              )}
            </div>
          ))}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Level</label>
            <select value={meta.level} onChange={e => setMeta({ ...meta, level: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}>
              {['L1', 'L2', 'L3', 'M1', 'M2'].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Mode</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Training', 'Exam', 'Challenge'].map(m => (
                <button key={m} onClick={() => setMeta({ ...meta, mode: m })} style={{
                  flex: 1, padding: '7px 4px', borderRadius: 8, border: '1.5px solid',
                  borderColor: meta.mode === m ? modeColors[m] : '#E2E8F0',
                  background: meta.mode === m ? `${modeColors[m]}15` : '#fff',
                  color: meta.mode === m ? modeColors[m] : '#94A3B8',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}>{m}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Duration: {meta.duration}min</label>
            <input type="range" min={5} max={120} step={5} value={meta.duration}
              onChange={e => setMeta({ ...meta, duration: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#2563EB' }} />
          </div>

          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#64748B' }}>Questions</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{questions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main canvas */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={onBack} style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#64748B', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>← Back</button>
            <button style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#64748B', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>👁 Preview</button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSaveDraft} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '9px 18px', color: '#64748B', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Save Draft</button>
            <button onClick={handlePublish} style={{ background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Publish Quiz ✓</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {questions.map((q, idx) => (
            <div key={q.id}
              style={{
                background: '#fff', borderRadius: 14, border: `1.5px solid ${dragOver === idx ? '#2563EB' : '#E2E8F0'}`,
                overflow: 'hidden', transition: 'border-color 0.15s',
              }}
              draggable
              onDragOver={e => { e.preventDefault(); setDragOver(idx) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => setDragOver(null)}
            >
              {/* Question header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: q.expanded ? '1px solid #F1F5F9' : 'none', cursor: 'pointer', background: '#FAFBFC' }}
                onClick={() => updateQ(q.id, { expanded: !q.expanded })}>
                <div style={{ cursor: 'grab', color: '#CBD5E1', fontSize: 16 }}>⠿</div>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {idx + 1}
                </div>
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
                  {/* Type selector */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    {[{ key: 'mcq', label: 'MCQ' }, { key: 'truefalse', label: 'True / False' }, { key: 'open', label: 'Open' }].map(t => (
                      <button key={t.key} onClick={() => updateQ(q.id, { type: t.key as any })} style={{
                        padding: '5px 14px', borderRadius: 20, border: '1.5px solid',
                        borderColor: q.type === t.key ? '#2563EB' : '#E2E8F0',
                        background: q.type === t.key ? '#EFF6FF' : '#fff',
                        color: q.type === t.key ? '#2563EB' : '#64748B',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}>{t.label}</button>
                    ))}
                  </div>

                  {/* Question text */}
                  <textarea
                    value={q.text} onChange={e => updateQ(q.id, { text: e.target.value })}
                    placeholder="Enter your question here…" rows={2}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 12, fontFamily: 'Inter, sans-serif' }}
                    onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                  />

                  {/* Options */}
                  {q.type === 'mcq' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                      {q.options.map((opt, oi) => (
                        <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, border: `2px solid ${q.correct === oi ? '#16A34A' : '#E2E8F0'}`, background: q.correct === oi ? '#F0FDF4' : '#FAFBFC', transition: 'all 0.15s' }}>
                          <button onClick={() => updateQ(q.id, { correct: oi })} style={{
                            width: 22, height: 22, borderRadius: '50%', border: `2px solid ${q.correct === oi ? '#16A34A' : '#CBD5E1'}`,
                            background: q.correct === oi ? '#16A34A' : 'transparent', cursor: 'pointer', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11,
                          }}>{q.correct === oi ? '✓' : ''}</button>
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
                        <button key={btn.v} onClick={() => updateQ(q.id, { correct: btn.v })} style={{
                          flex: 1, padding: '12px', borderRadius: 10, border: `2px solid ${q.correct === btn.v ? '#16A34A' : '#E2E8F0'}`,
                          background: q.correct === btn.v ? '#F0FDF4' : '#FAFBFC',
                          color: q.correct === btn.v ? '#16A34A' : '#64748B', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                        }}>{btn.label}</button>
                      ))}
                    </div>
                  )}

                  {/* Explanation */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Explanation (shown after answer)</label>
                    <input value={q.explanation} onChange={e => updateQ(q.id, { explanation: e.target.value })}
                      placeholder="Why is this the correct answer?"
                      style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add question button */}
          <button onClick={addQuestion} style={{
            width: '100%', padding: '14px', borderRadius: 14, border: '2px dashed #DBEAFE',
            background: '#F0F7FF', color: '#2563EB', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            transition: 'all 0.15s', fontFamily: 'Outfit, sans-serif',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#EFF6FF'; (e.currentTarget as HTMLElement).style.borderColor = '#2563EB' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F0F7FF'; (e.currentTarget as HTMLElement).style.borderColor = '#DBEAFE' }}>
            + Add Question
          </button>
        </div>
      </div>
    </div>
  )
}
