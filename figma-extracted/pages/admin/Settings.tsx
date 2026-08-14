import { useState } from 'react'

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <div onClick={() => onChange(!value)} style={{
    width: 44, height: 24, borderRadius: 12, background: value ? '#2563EB' : '#CBD5E1',
    cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
  }}>
    <div style={{
      width: 18, height: 18, borderRadius: '50%', background: '#fff',
      position: 'absolute', top: 3, left: value ? 23 : 3,
      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    }} />
  </div>
)

export default function AdminSettings({ onToast }: { onToast: (msg: string, type?: string) => void }) {
  const [tab, setTab] = useState('General')
  const [settings, setSettings] = useState({
    guestParticipation: true, aiGeneration: true, darkMode: false,
    emailNotifs: true, sessionAlerts: true, maintenanceMode: false,
    twoFactor: false, passwordExpiry: true, autoLogout: true,
    defaultDuration: 15, maxStudents: 60,
  })

  const set = (k: string, v: boolean | number) => setSettings(prev => ({ ...prev, [k]: v }))
  const save = () => onToast('Settings saved successfully!', 'success')

  const tabs = ['General', 'Security', 'Notifications', 'Integrations']

  return (
    <div style={{ padding: 28 }} className="animate-fade-in">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: 9, border: 'none',
            background: tab === t ? '#fff' : 'transparent',
            color: tab === t ? '#0F172A' : '#64748B',
            fontWeight: tab === t ? 600 : 500, fontSize: 14, cursor: 'pointer',
            transition: 'all 0.15s', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden', maxWidth: 720 }}>

        {tab === 'General' && (
          <div style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, margin: '0 0 6px' }}>General Settings</h3>
            <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 28px' }}>Configure platform-wide behavior and defaults</p>
            {[
              { key: 'guestParticipation', label: 'Allow Guest Participation', desc: 'Let users join sessions without an account using a nickname' },
              { key: 'aiGeneration', label: 'Enable AI Question Generation', desc: 'Teachers can generate quiz questions from uploaded documents' },
              { key: 'darkMode', label: 'Default Dark Mode', desc: 'Apply dark theme by default for all new users' },
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Temporarily disable the platform for all non-admin users' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: '#64748B' }}>{item.desc}</div>
                </div>
                <Toggle value={settings[item.key as keyof typeof settings] as boolean} onChange={v => set(item.key, v)} />
              </div>
            ))}

            <div style={{ padding: '16px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A', marginBottom: 6 }}>Default Quiz Duration (minutes)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="range" min={5} max={60} step={5} value={settings.defaultDuration}
                  onChange={e => set('defaultDuration', Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#2563EB' }} />
                <span style={{ fontWeight: 700, color: '#2563EB', width: 36 }}>{settings.defaultDuration}m</span>
              </div>
            </div>

            <div style={{ padding: '16px 0' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A', marginBottom: 6 }}>Max Students Per Session</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="range" min={10} max={200} step={10} value={settings.maxStudents}
                  onChange={e => set('maxStudents', Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#2563EB' }} />
                <span style={{ fontWeight: 700, color: '#2563EB', width: 36 }}>{settings.maxStudents}</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'Security' && (
          <div style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, margin: '0 0 6px' }}>Security Settings</h3>
            <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 28px' }}>Manage authentication and access policies</p>
            {[
              { key: 'twoFactor', label: 'Require Two-Factor Authentication', desc: 'Mandatory 2FA for all admin and teacher accounts' },
              { key: 'passwordExpiry', label: 'Password Expiry (90 days)', desc: 'Force password reset every 90 days for all users' },
              { key: 'autoLogout', label: 'Auto-logout After Inactivity', desc: 'Automatically log out sessions after 30 minutes of inactivity' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: '#64748B' }}>{item.desc}</div>
                </div>
                <Toggle value={settings[item.key as keyof typeof settings] as boolean} onChange={v => set(item.key, v)} />
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <button style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #FCA5A5', background: '#FFF5F5', color: '#DC2626', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                🔴 Revoke All Active Sessions
              </button>
            </div>
          </div>
        )}

        {tab === 'Notifications' && (
          <div style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, margin: '0 0 6px' }}>Notification Settings</h3>
            <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 28px' }}>Control how and when notifications are sent</p>
            {[
              { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive email alerts for important platform events' },
              { key: 'sessionAlerts', label: 'Live Session Alerts', desc: 'Notify teachers when a scheduled session is about to start' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: '#64748B' }}>{item.desc}</div>
                </div>
                <Toggle value={settings[item.key as keyof typeof settings] as boolean} onChange={v => set(item.key, v)} />
              </div>
            ))}
          </div>
        )}

        {tab === 'Integrations' && (
          <div style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, margin: '0 0 6px' }}>Integrations</h3>
            <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 28px' }}>Connect QuizPulse with external tools and services</p>
            {[
              { name: 'Google Classroom', icon: '🎓', status: 'connected', color: '#16A34A' },
              { name: 'Microsoft Teams', icon: '💼', status: 'disconnected', color: '#94A3B8' },
              { name: 'Moodle LMS', icon: '📘', status: 'connected', color: '#16A34A' },
              { name: 'Canvas LMS', icon: '🖌️', status: 'disconnected', color: '#94A3B8' },
            ].map(int => (
              <div key={int.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{int.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{int.name}</div>
                    <div style={{ fontSize: 12, color: int.color, fontWeight: 500 }}>{int.status === 'connected' ? '● Connected' : '○ Not connected'}</div>
                  </div>
                </div>
                <button style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${int.status === 'connected' ? '#FCA5A5' : '#2563EB'}`,
                  background: 'transparent',
                  color: int.status === 'connected' ? '#DC2626' : '#2563EB',
                }}>
                  {int.status === 'connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: '16px 28px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={save} style={{
            padding: '10px 28px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(90deg,#2563EB,#1D4ED8)', color: '#fff',
            fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          }}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}
