import { useState } from 'react'

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? '#2563EB' : '#CBD5E1', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
  </div>
)

export default function TeacherSettings({ onToast }: { onToast: (msg: string, type?: string) => void }) {
  const [settings, setSettings] = useState({ showLeaderboard: true, allowGuests: true, autoPublish: false, soundEffects: true, emailRecap: true, showExplanations: true })
  const set = (k: string, v: boolean) => setSettings(p => ({ ...p, [k]: v }))

  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden', maxWidth: 640 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, margin: '0 0 4px' }}>Teacher Preferences</h3>
          <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Customize your teaching experience</p>
        </div>
        <div style={{ padding: '8px 24px 24px' }}>
          {[
            { key: 'showLeaderboard', label: 'Show Leaderboard During Sessions', desc: 'Display live rankings to students as they answer' },
            { key: 'allowGuests', label: 'Allow Guest Participation', desc: 'Let unregistered students join with a nickname' },
            { key: 'autoPublish', label: 'Auto-publish AI-generated Quizzes', desc: 'Skip review step and publish immediately after AI generation' },
            { key: 'soundEffects', label: 'Sound Effects', desc: 'Play audio cues during live sessions' },
            { key: 'emailRecap', label: 'Email Session Recap', desc: 'Receive a summary email after each session ends' },
            { key: 'showExplanations', label: 'Show Explanations After Each Question', desc: 'Display the explanation text after an answer is revealed' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F8FAFC' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: '#64748B' }}>{item.desc}</div>
              </div>
              <Toggle value={settings[item.key as keyof typeof settings]} onChange={v => set(item.key, v)} />
            </div>
          ))}
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => onToast('Settings saved!', 'success')} style={{ padding: '10px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
