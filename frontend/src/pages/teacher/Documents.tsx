import { useState } from 'react'

interface GenQuestion {
  id: number; text: string; options: string[]; correct: number;
  difficulty: number; tag: string; status: 'pending' | 'accepted' | 'discarded'
}

const generated: GenQuestion[] = [
  { id: 1, text: 'Quelle est la définition de la dérivée d\'une fonction en un point x₀?', options: ['La pente de la tangente', 'L\'intégrale de f', 'La valeur en x₀', 'Le domaine de f'], correct: 0, difficulty: 2, tag: 'Calcul Différentiel', status: 'pending' },
  { id: 2, text: 'Le théorème des valeurs intermédiaires s\'applique à des fonctions:', options: ['Continues sur [a,b]', 'Dérivables en tout point', 'Croissantes sur [a,b]', 'Bornées sur ℝ'], correct: 0, difficulty: 3, tag: 'Analyse', status: 'pending' },
  { id: 3, text: 'La règle de l\'Hôpital s\'applique quand la limite présente une forme:', options: ['Indéterminée 0/0 ou ∞/∞', 'Définie non nulle', 'Infinie pure', 'Nulle absolue'], correct: 0, difficulty: 4, tag: 'Limites', status: 'accepted' },
  { id: 4, text: 'Intégrer par parties utilise la formule:', options: ['∫uv\'=uv-∫u\'v', '∫u+v=∫u+∫v', '∫f(g(x))=F(g(x))', '∫f=F(b)-F(a)'], correct: 0, difficulty: 3, tag: 'Calcul Intégral', status: 'pending' },
  { id: 5, text: 'Une suite converge si et seulement si elle est:', options: ['De Cauchy', 'Croissante', 'Bornée', 'Positive'], correct: 0, difficulty: 4, tag: 'Suites', status: 'discarded' },
  { id: 6, text: 'La norme d\'un espace vectoriel doit satisfaire:', options: ['Positivité, homogénéité, inégalité triangulaire', 'Seulement la positivité', 'Commutativité et associativité', 'Inversibilité'], correct: 0, difficulty: 3, tag: 'Algèbre Linéaire', status: 'pending' },
]

export default function TeacherDocuments({ onToast }: { onToast: (msg: string, type?: string) => void }) {
  const [phase, setPhase] = useState<'upload' | 'generating' | 'review'>('upload')
  const [progress, setProgress] = useState(0)
  const [questions, setQuestions] = useState<GenQuestion[]>(generated)
  const [selected, setSelected] = useState<GenQuestion>(generated[0])
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleUpload = (name: string) => {
    setFileName(name); setPhase('generating'); setProgress(0)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setPhase('review'); return 100 }
        return p + 8
      })
    }, 200)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file.name)
  }

  const accept = (id: number) => { setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: 'accepted' } : q)); onToast('Question accepted!', 'success') }
  const discard = (id: number) => { setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: 'discarded' } : q)); onToast('Question discarded', 'info') }

  const accepted = questions.filter(q => q.status === 'accepted').length
  const pending = questions.filter(q => q.status === 'pending').length

  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      {phase === 'upload' && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, margin: '0 0 8px', color: '#0F172A' }}>Import Document & Generate with AI</h2>
          <p style={{ color: '#64748B', margin: '0 0 32px', fontSize: 15 }}>Upload a PDF, Word, or PowerPoint file. Our AI will extract key concepts and generate quiz questions automatically.</p>

          {/* Upload zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? '#2563EB' : '#CBD5E1'}`,
              borderRadius: 16, padding: '48px 32px', textAlign: 'center',
              background: dragActive ? '#EFF6FF' : '#FAFBFF',
              transition: 'all 0.2s', cursor: 'pointer',
            }}
            onClick={() => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.pdf,.doc,.docx,.ppt,.pptx'; inp.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) handleUpload(f.name) }; inp.click() }}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>📄</div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, margin: '0 0 8px', color: '#0F172A' }}>Drop your document here</h3>
            <p style={{ color: '#64748B', margin: '0 0 20px', fontSize: 14 }}>or click to browse files</p>
            <p style={{ color: '#94A3B8', fontSize: 12, margin: 0 }}>Supports PDF, Word (.docx), PowerPoint (.pptx) — max 50MB</p>
          </div>

          {/* Supported formats */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center' }}>
            {[{ fmt: 'PDF', icon: '🔴', ext: '.pdf' }, { fmt: 'Word', icon: '🔵', ext: '.docx' }, { fmt: 'PowerPoint', icon: '🟠', ext: '.pptx' }].map(f => (
              <div key={f.fmt} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#64748B' }}>
                <span>{f.icon}</span> {f.fmt} <span style={{ color: '#94A3B8' }}>{f.ext}</span>
              </div>
            ))}
          </div>

          {/* Demo button */}
          <button onClick={() => handleUpload('Analyse_Mathematique_Ch4.pdf')} style={{
            width: '100%', marginTop: 20, padding: '12px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(90deg,#7C3AED,#6D28D9)', color: '#fff',
            fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          }}>
            🤖 Try Demo: Generate from sample document
          </button>
        </div>
      )}

      {phase === 'generating' && (
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: 52, marginBottom: 16, animation: 'pulse 1.5s infinite' }}>🤖</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 24, margin: '0 0 8px', color: '#0F172A' }}>Analyzing your document…</h2>
          <p style={{ color: '#64748B', margin: '0 0 8px' }}>{fileName}</p>
          <p style={{ color: '#7C3AED', fontWeight: 600, margin: '0 0 28px', fontSize: 14 }}>AI is extracting concepts and generating questions</p>

          <div style={{ background: '#F1F5F9', borderRadius: 50, height: 10, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#2563EB,#7C3AED)', borderRadius: 50, transition: 'width 0.2s' }} />
          </div>
          <p style={{ fontSize: 14, color: '#94A3B8' }}>{progress}% — {progress < 30 ? 'Parsing document…' : progress < 60 ? 'Identifying key concepts…' : progress < 85 ? 'Generating questions…' : 'Finalizing…'}</p>
        </div>
      )}

      {phase === 'review' && (
        <div>
          {/* Summary bar */}
          <div style={{ background: '#0F172A', borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>📄 {fileName}</div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { label: 'Generated', val: questions.length, color: '#60A5FA' },
                { label: 'Accepted', val: accepted, color: '#4ADE80' },
                { label: 'Pending', val: pending, color: '#FCD34D' },
                { label: 'Discarded', val: questions.filter(q => q.status === 'discarded').length, color: '#F87171' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => onToast('Quiz created from accepted questions!', 'success')} style={{
              background: 'linear-gradient(90deg,#2563EB,#7C3AED)', color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            }}>
              Create Quiz from Accepted ({accepted})
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
            {/* Question list */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, margin: 0, color: '#0F172A' }}>Generated Questions</h4>
              </div>
              <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                {questions.map((q, i) => (
                  <div key={q.id} onClick={() => setSelected(q)} style={{
                    padding: '12px 16px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer',
                    background: selected.id === q.id ? '#EFF6FF' : 'transparent',
                    borderLeft: `3px solid ${q.status === 'accepted' ? '#16A34A' : q.status === 'discarded' ? '#DC2626' : 'transparent'}`,
                    transition: 'background 0.15s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{q.text}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Q{i + 1} · {q.tag}</div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 20, flexShrink: 0,
                        background: q.status === 'accepted' ? '#F0FDF4' : q.status === 'discarded' ? '#FEE2E2' : '#FEF3C7',
                        color: q.status === 'accepted' ? '#16A34A' : q.status === 'discarded' ? '#DC2626' : '#D97706',
                      }}>{q.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question detail */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <span style={{ background: '#EDE9FE', color: '#7C3AED', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>{selected.tag}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Difficulty:</span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[1, 2, 3, 4, 5].map(d => (
                      <div key={d} style={{ width: 20, height: 6, borderRadius: 3, background: d <= selected.difficulty ? '#7C3AED' : '#E2E8F0' }} />
                    ))}
                  </div>
                </div>
              </div>

              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17, margin: '0 0 20px', color: '#0F172A', lineHeight: 1.4 }}>{selected.text}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {selected.options.map((opt, i) => (
                  <div key={i} style={{
                    padding: '12px 16px', borderRadius: 10,
                    border: `2px solid ${i === selected.correct ? '#16A34A' : '#E2E8F0'}`,
                    background: i === selected.correct ? '#F0FDF4' : '#FAFBFC',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: i === selected.correct ? '#16A34A' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i === selected.correct ? '#fff' : '#94A3B8', flexShrink: 0 }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ fontSize: 14, color: '#0F172A' }}>{opt}</span>
                    {i === selected.correct && <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#16A34A' }}>✓ Correct</span>}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => accept(selected.id)} disabled={selected.status === 'accepted'} style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                  background: selected.status === 'accepted' ? '#F0FDF4' : 'linear-gradient(90deg,#16A34A,#15803D)',
                  color: selected.status === 'accepted' ? '#16A34A' : '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                }}>
                  {selected.status === 'accepted' ? '✓ Accepted' : '✓ Accept'}
                </button>
                <button style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                  ✏️ Edit
                </button>
                <button onClick={() => discard(selected.id)} style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #FCA5A5',
                  background: '#FFF5F5', color: '#DC2626', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                }}>
                  ✕ Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
