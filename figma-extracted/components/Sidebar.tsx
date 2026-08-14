import Logo from './Logo'

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  quiz: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
    </svg>
  ),
  live: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M5.64 5.64a9 9 0 000 12.72M18.36 5.64a9 9 0 010 12.72"/>
      <path d="M8.46 8.46a5 5 0 000 7.08M15.54 8.46a5 5 0 010 7.08"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  classes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M22 12l-5 5-2-2"/>
    </svg>
  ),
  ai: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 015 5v1a5 5 0 01-10 0V7a5 5 0 015-5z"/>
      <path d="M8 13a8 8 0 0016 0M0 13a8 8 0 0016 0" opacity="0"/>
      <circle cx="12" cy="8" r="2"/><path d="M6 20h12M9 17v3M15 17v3"/>
      <path d="M4 14c0 4 3.6 7 8 7s8-3 8-7"/>
    </svg>
  ),
  stats: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  documents: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
}

type AdminPage = 'admin-dashboard' | 'admin-users' | 'admin-classes' | 'admin-settings'
type TeacherPage = 'teacher-dashboard' | 'teacher-quizzes' | 'teacher-live' | 'teacher-documents' | 'teacher-stats' | 'teacher-settings'

interface SidebarProps {
  role: 'admin' | 'teacher'
  current: string
  onNav: (page: string) => void
  onLogout: () => void
}

const adminNav = [
  { key: 'admin-dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'admin-users', label: 'Users & Roles', icon: 'users' },
  { key: 'admin-classes', label: 'Classes', icon: 'classes' },
  { key: 'admin-settings', label: 'Settings', icon: 'settings' },
]

const teacherNav = [
  { key: 'teacher-dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'teacher-quizzes', label: 'Quizzes', icon: 'quiz' },
  { key: 'teacher-live', label: 'Live Session', icon: 'live' },
  { key: 'teacher-documents', label: 'Docs & AI', icon: 'documents' },
  { key: 'teacher-stats', label: 'Statistics', icon: 'stats' },
  { key: 'teacher-settings', label: 'Settings', icon: 'settings' },
]

export default function Sidebar({ role, current, onNav, onLogout }: SidebarProps) {
  const nav = role === 'admin' ? adminNav : teacherNav

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#0F172A',
      display: 'flex', flexDirection: 'column', padding: '20px 12px',
      borderRight: '1px solid #1E293B', flexShrink: 0,
    }}>
      <div style={{ padding: '4px 8px 20px' }}>
        <Logo size={32} showText />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map(item => (
          <div
            key={item.key}
            className={`sidebar-item${current === item.key ? ' active' : ''}`}
            onClick={() => onNav(item.key)}
          >
            {icons[item.icon as keyof typeof icons]}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #1E293B', paddingTop: 12 }}>
        <div className="sidebar-item" onClick={onLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  )
}
