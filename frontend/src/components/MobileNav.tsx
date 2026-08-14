interface MobileNavProps {
  current: string
  onNav: (page: string) => void
}

const tabs = [
  {
    key: 'student-home',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: 'student-join',
    label: 'Join Quiz',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="10 8 16 12 10 16 10 8"/>
      </svg>
    ),
  },
  {
    key: 'student-history',
    label: 'History',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12 8 12 12 14 14"/>
        <path d="M3.05 11a9 9 0 1 0 .5-4.5"/>
        <polyline points="3 3 3 11 11 11"/>
      </svg>
    ),
  },
  {
    key: 'student-profile',
    label: 'Profile',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export default function MobileNav({ current, onNav }: MobileNavProps) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: '1px solid #E2E8F0',
      display: 'flex', height: 64, zIndex: 100,
      boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
    }}>
      {tabs.map(tab => {
        const active = current === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onNav(tab.key)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, background: 'none', border: 'none',
              cursor: 'pointer', color: active ? '#2563EB' : '#94A3B8',
              transition: 'color 0.15s',
            }}
          >
            {tab.icon}
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 500, fontFamily: 'Inter, sans-serif' }}>
              {tab.label}
            </span>
            {active && (
              <span style={{
                position: 'absolute', bottom: 0,
                width: 24, height: 3, background: '#2563EB', borderRadius: '3px 3px 0 0',
              }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
