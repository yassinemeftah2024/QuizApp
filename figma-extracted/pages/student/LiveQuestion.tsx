import { useState, useEffect } from 'react'

const questions = [
  { text: 'Quelle propriété définit une application linéaire entre deux espaces vectoriels?', options: ['f(u+v)=f(u)+f(v) et f(λu)=λf(u)', 'f(u·v)=f(u)·f(v)', 'f est bijective', 'f est croissante'], correct: 0 },
  { text: 'La dimension du noyau d\'une application linéaire est appelée:', options: ['Le rang', 'La nullité', 'Le corang', 'La trace'], correct: 1 },
  { text: 'Parmi les propositions suivantes, laquelle est VRAIE pour une matrice carrée?', options: ['det(AB)=det(A)·det(B)', 'det(A+B)=det(A)+det(B)', 'det(A^T)≠det(A)', 'det(2A)=2·det(A)'], correct: 0 },
]

const optionColors = [
  { bg: '#EFF6FF', border: '#2563EB', selected: '#2563EB', text: '#1D4ED8' },
  { bg: '#F0FDF4', border: '#16A34A', selected: '#16A34A', text: '#166534' },
  { bg: '#FFFBEB', border: '#D97706', selected: '#D97706', text: '#92400E' },
  { bg: '#F5F3FF', border: '#7C3AED', selected: '#7C3AED', text: '#5B21B6' },
]

interface Props {
  avatar: { emoji: string; color: string; nickname: string }
  onFinish: () => void
}

export default function StudentLiveQuestion({ avatar, onFinish }: Props) {
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(20)

  const q = questions[qIdx]
  const progress = ((20 - timer) / 20) * 100

  useEffect(() => {
    if (submitted || timer <= 0) return
    const t = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer, submitted])

  useEffect(() => {
    if (timer === 0 && !submitted) {
      setSubmitted(true)
      setShowResult(true)
    }
  }, [timer])

  const handleSelect = (i: number) => {
    if (submitted) return
    setSelected(i)
  }

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    if (selected === q.correct) setScore(s => s + Math.max(100, 100 + timer * 10))
    setTimeout(() => setShowResult(true), 600)
  }

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(q => q + 1); setSelected(null); setSubmitted(false); setShowResult(false); setTimer(20)
    } else {
      onFinish()
    }
  }

  const isCorrect = submitted && selected === q.correct
  const isWrong = submitted && selected !== null && selected !== q.correct

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', padding: '16px', paddingBottom: 24 }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${avatar.color}20`, border: `2px solid ${avatar.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            {avatar.emoji}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>{avatar.nickname}</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>Score: {score}</div>
          </div>
        </div>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: '#64748B' }}>
          Q{qIdx + 1}/{questions.length}
        </div>
      </div>

      {/* Timer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="40" cy="40" r="34" fill="none" stroke="#F1F5F9" strokeWidth="6" />
            <circle cx="40" cy="40" r="34" fill="none"
              stroke={timer <= 5 ? '#DC2626' : timer <= 10 ? '#D97706' : '#7C3AED'}
              strokeWidth="6"
              strokeDasharray={`${(timer / 20) * 214} 214`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 24,
            color: timer <= 5 ? '#DC2626' : '#0F172A',
          }}>{timer}</div>
        </div>
      </div>

      {/* Question */}
      <div style={{ background: '#fff', borderRadius: 18, padding: '20px', marginBottom: 14, border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17, color: '#0F172A', margin: 0, lineHeight: 1.4 }}>
          {q.text}
        </p>
      </div>

      {/* Options */}
      {!showResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {q.options.map((opt, i) => {
            const col = optionColors[i]
            const isSelected = selected === i
            return (
              <button key={i} onClick={() => handleSelect(i)} style={{
                padding: '14px 18px', borderRadius: 14, border: `2.5px solid ${isSelected ? col.border : '#E2E8F0'}`,
                background: isSelected ? col.bg : '#fff', cursor: submitted ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                transition: 'all 0.15s', opacity: submitted && !isSelected ? 0.5 : 1,
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: isSelected ? col.border : '#F1F5F9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isSelected ? '#fff' : '#94A3B8', fontWeight: 700, fontSize: 14, flexShrink: 0,
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontSize: 14, fontWeight: isSelected ? 600 : 400, color: isSelected ? col.text : '#0F172A' }}>
                  {opt}
                </span>
              </button>
            )
          })}

          {selected !== null && !submitted && (
            <button onClick={handleSubmit} style={{
              marginTop: 8, padding: '15px', background: 'linear-gradient(90deg,#7C3AED,#6D28D9)',
              color: '#fff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 16,
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            }} className="animate-fade-in">
              Submit Answer ✓
            </button>
          )}
        </div>
      )}

      {/* Result overlay */}
      {showResult && (
        <div className="animate-bounce-in" style={{ flex: 1 }}>
          <div style={{
            background: isCorrect ? '#F0FDF4' : submitted && selected === null ? '#FFFBEB' : '#FFF5F5',
            borderRadius: 18, padding: '24px', textAlign: 'center', marginBottom: 16,
            border: `2px solid ${isCorrect ? '#16A34A' : submitted && selected === null ? '#D97706' : '#DC2626'}`,
          }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>
              {isCorrect ? '🎉' : submitted && selected === null ? '⏰' : '😬'}
            </div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, margin: '0 0 8px', color: isCorrect ? '#16A34A' : submitted && selected === null ? '#D97706' : '#DC2626' }}>
              {isCorrect ? 'Correct! Well done!' : submitted && selected === null ? "Time's up!" : 'Incorrect!'}
            </h2>
            <p style={{ color: '#64748B', margin: '0 0 16px', fontSize: 14 }}>
              The correct answer was: <strong style={{ color: '#0F172A' }}>{q.options[q.correct]}</strong>
            </p>
            {isCorrect && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '10px 16px', display: 'inline-block' }}>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, color: '#16A34A' }}>+{Math.max(100, 100 + timer * 10)} pts</span>
              </div>
            )}
          </div>

          <button onClick={handleNext} style={{
            width: '100%', padding: '15px', background: 'linear-gradient(90deg,#7C3AED,#6D28D9)',
            color: '#fff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 16,
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          }}>
            {qIdx < questions.length - 1 ? 'Next Question →' : 'See Results 🏆'}
          </button>
        </div>
      )}
    </div>
  )
}
