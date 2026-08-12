import { useState } from 'react'

const pageTitles: Record<string, string> = {
  'admin-dashboard': 'Dashboard',
  'admin-users': 'Users & Roles',
  'admin-classes': 'Classes & Subjects',
  'admin-settings': 'Platform Settings',
  'teacher-dashboard': 'Dashboard',
  'teacher-quizzes': 'My Quizzes',
  'teacher-live': 'Live Session',
  'teacher-documents': 'Documents & AI',
  'teacher-stats': 'Statistics',
  'teacher-settings': 'Settings',
}

interface TopBarProps {
  current: string
  userName: string
  userRole: string
  onLogout: () => void
}

export default function TopBar({ current, userName, userRole, onLogout }: TopBarProps) {
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)

  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header style={{
      height: 60, background: '#fff', borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 20, color: '#0F172A', flex: 1, margin: 0 }}>
        {pageTitles[current] || 'QuizPulse'}
      </h1>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          placeholder="Search quizzes, users…"
          style={{
            paddingLeft: 34, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
            border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13,
            background: '#F8FAFC', color: '#0F172A', outline: 'none', width: 220,
            fontFamily: 'Inter, sans-serif',
          }}
        />
      </div>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, display: 'flex', position: 'relative' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: '#DC2626', borderRadius: '50%', border: '2px solid white' }} />
        </button>
        {showNotifs && (
          <div style={{
            position: 'absolute', right: 0, top: 40, width: 300, background: '#fff',
            borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0',
            padding: 8, zIndex: 200,
          }}>
            {[
              { t: 'Session ended', d: 'Maths QCM – 24 students participated', time: '2m ago', c: '#2563EB' },
              { t: 'AI generation done', d: 'Physics Ch.4 – 12 questions ready', time: '15m ago', c: '#7C3AED' },
              { t: 'New student joined', d: 'Youssef B. joined class 2A', time: '1h ago', c: '#16A34A' },
            ].map((n, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.c, marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>{n.t}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{n.d}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowProfile(!showProfile); setShowNotifs(false) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, background: 'none',
            border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 10,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13,
          }}>{initials}</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.2 }}>{userName}</div>
            <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.2 }}>{userRole}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        {showProfile && (
          <div style={{
            position: 'absolute', right: 0, top: 48, width: 200, background: '#fff',
            borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0',
            padding: 8, zIndex: 200,
          }}>
            {['Profile', 'Account Settings'].map(item => (
              <div key={item} style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#0F172A' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {item}
              </div>
            ))}
            <div style={{ borderTop: '1px solid #E2E8F0', margin: '4px 0' }} />
            <div style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#DC2626' }}
              onClick={onLogout}
              onMouseEnter={e => (e.currentTarget.style.background = '#FEE2E2')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
