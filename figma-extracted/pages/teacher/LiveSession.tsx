import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const questions = [
  { text: 'Quelle propriété définit une application linéaire entre deux espaces vectoriels?', options: ['f(u+v)=f(u)+f(v) et f(λu)=λf(u)', 'f(u·v)=f(u)·f(v)', 'f est bijective', 'f est croissante'] },
  { text: 'La dimension du noyau d\'une application linéaire est appelée:', options: ['Le rang', 'La nullité', 'Le corang', 'La trace'] },
  { text: 'Parmi les propositions suivantes, laquelle est VRAIE pour une matrice carrée?', options: ['det(AB)=det(A)·det(B)', 'det(A+B)=det(A)+det(B)', 'det(A^T)≠det(A)', 'det(2A)=2·det(A)'] },
]

const initialAnswerDist = [
  { option: 'A', count: 14 }, { option: 'B', count: 4 }, { option: 'C', count: 6 }, { option: 'D', count: 3 },
]

const leaderboard = [
  { rank: 1, name: 'Amira K.', score: 950, streak: 3 },
  { rank: 2, name: 'Youssef B.', score: 900, streak: 2 },
  { rank: 3, name: 'Rania S.', score: 850, streak: 2 },
  { rank: 4, name: 'Omar B.', score: 800, streak: 1 },
  { rank: 5, name: 'Lina R.', score: 750, streak: 1 },
]

interface Props {
  onToast: (msg: string, type?: string) => void
  onNav: (page: string) => void
}

export default function TeacherLiveSession({ onToast, onNav }: Props) {
  const [phase, setPhase] = useState<'lobby' | 'question' | 'results'>('lobby')
  const [qIdx, setQIdx] = useState(0)
  const [timer, setTimer] = useState(20)
  const [players, setPlayers] = useState(27)
  const [copied, setCopied] = useState(false)
  const PIN = '4729'

  useEffect(() => {
    if (phase !== 'question') return
    if (timer <= 0) return
    const t = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer, phase])

  useEffect(() => {
    if (phase === 'lobby') {
      const t = setInterval(() => setPlayers(p => p < 34 ? p + 1 : p), 2000)
      return () => clearInterval(t)
    }
  }, [phase])

  const startSession = () => { setPhase('question'); setTimer(20); onToast('Session started! Students can now answer.', 'success') }
  const nextQ = () => {
    if (qIdx < questions.length - 1) { setQIdx(q => q + 1); setTimer(20) }
    else { setPhase('results'); onNav('teacher-stats') }
  }
  const copyPin = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); onToast('PIN copied to clipboard!', 'info') }

  const progress = (timer / 20) * 100
  const circumference = 2 * Math.PI * 40
  const strokeDash = circumference * (progress / 100)

  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      {/* Session info bar */}
      <div style={{
        background: 'linear-gradient(135deg,#0F172A,#1E293B)', borderRadius: 14,
        padding: '16px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ color: '#94A3B8', fontSize: 12, marginBottom: 2 }}>Live Quiz Session</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>Algèbre Linéaire – Ch.3</div>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 24, color: '#60A5FA' }}>{players}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>players</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 24, color: '#4ADE80' }}>{qIdx + 1}/{questions.length}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>question</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {phase === 'lobby' && <button onClick={startSession} style={{ background: 'linear-gradient(90deg,#16A34A,#15803D)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>▶ Start Session</button>}
          {phase === 'question' && <button onClick={nextQ} style={{ background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>{qIdx < questions.length - 1 ? 'Next Question →' : 'End Session'}</button>}
          <button onClick={() => { onToast('Session ended', 'warning'); setPhase('lobby'); setQIdx(0) }} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>■ End</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Main area */}
        <div>
          {phase === 'lobby' && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 28, margin: '0 0 8px', color: '#0F172A' }}>Waiting for students…</h2>
              <p style={{ color: '#64748B', margin: '0 0 28px' }}>Share the PIN or QR Code. Click "Start Session" when ready.</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {Array.from({ length: Math.min(players, 20) }).map((_, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${i * 37 + 200},70%,55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    {['🦊', '🐼', '🦁', '🐨', '🦄', '🐺', '🦋', '🐸', '🐯', '🦅', '🐬', '🦉', '🐲', '🦌', '🦜', '🐙', '🦖', '🦑', '🐻', '⭐'][i % 20]}
                  </div>
                ))}
                {players > 20 && <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#64748B' }}>+{players - 20}</div>}
              </div>
            </div>
          )}

          {phase === 'question' && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ background: '#EFF6FF', color: '#2563EB', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
                  Question {qIdx + 1} / {questions.length}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="45" cy="45" r="40" fill="none" stroke="#F1F5F9" strokeWidth="6" />
                    <circle cx="45" cy="45" r="40" fill="none"
                      stroke={timer <= 5 ? '#DC2626' : timer <= 10 ? '#D97706' : '#2563EB'}
                      strokeWidth="6" strokeDasharray={`${strokeDash} ${circumference}`}
                      strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }} />
                  </svg>
                  <div style={{ position: 'absolute', marginLeft: 68, fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, color: timer <= 5 ? '#DC2626' : '#0F172A' }}>
                    {timer}
                  </div>
                </div>
              </div>

              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, color: '#0F172A', margin: '0 0 24px', lineHeight: 1.3 }}>
                {questions[qIdx].text}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {questions[qIdx].options.map((opt, i) => {
                  const colors = ['#EFF6FF', '#F0FDF4', '#FEF3C7', '#F5F3FF']
                  const borderColors = ['#2563EB', '#16A34A', '#D97706', '#7C3AED']
                  return (
                    <div key={i} style={{ padding: '16px 20px', borderRadius: 12, background: colors[i], border: `2px solid ${borderColors[i]}20`, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: borderColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span style={{ fontSize: 14, color: '#0F172A' }}>{opt}</span>
                    </div>
                  )
                })}
              </div>

              <div style={{ marginTop: 20, background: '#F8FAFC', borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>Responses received</span>
                  <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>21 / {players}</span>
                </div>
                <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(21 / players) * 100}%`, height: '100%', background: '#2563EB', borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>
          )}

          {/* Answer distribution chart */}
          {phase === 'question' && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20, marginTop: 16 }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 700, margin: '0 0 12px' }}>Live Answer Distribution</h3>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={initialAnswerDist} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="option" tick={{ fontSize: 14, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* PIN Card */}
          <div style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)', borderRadius: 14, padding: 20, color: '#fff', textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, opacity: 0.8 }}>Session PIN</p>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 42, letterSpacing: 8, marginBottom: 12 }}>{PIN}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={copyPin} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                {copied ? '✓ Copied!' : '📋 Copy PIN'}
              </button>
              <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>⬇ QR Code</button>
            </div>
          </div>

          {/* Leaderboard */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden', flex: 1 }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 700, margin: 0 }}>🏆 Live Leaderboard</h3>
            </div>
            <div>
              {leaderboard.map((p, i) => (
                <div key={i} style={{ padding: '11px 16px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    background: i === 0 ? '#FEF3C7' : i === 1 ? '#F1F5F9' : i === 2 ? '#FEF3C7' : '#F8FAFC',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: i < 3 ? 14 : 12, fontWeight: 700, color: i === 0 ? '#D97706' : i === 1 ? '#64748B' : '#D97706',
                  }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : p.rank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>{p.name}</div>
                    {p.streak > 1 && <div style={{ fontSize: 11, color: '#DC2626' }}>🔥 {p.streak} streak</div>}
                  </div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 15, color: '#2563EB' }}>{p.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
