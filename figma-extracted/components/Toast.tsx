import { useEffect } from 'react'

export interface ToastData {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const colors = {
  success: { bg: '#F0FDF4', border: '#16A34A', icon: '#16A34A', text: '#166534' },
  error: { bg: '#FFF5F5', border: '#DC2626', icon: '#DC2626', text: '#991B1B' },
  info: { bg: '#EFF6FF', border: '#2563EB', icon: '#2563EB', text: '#1E40AF' },
  warning: { bg: '#FFFBEB', border: '#D97706', icon: '#D97706', text: '#92400E' },
}

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
}

interface ToastProps {
  toasts: ToastData[]
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: () => void }) {
  useEffect(() => {
    const t = setTimeout(onRemove, 3500)
    return () => clearTimeout(t)
  }, [])

  const c = colors[toast.type]

  return (
    <div className="animate-slide-in" style={{
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10,
      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: 280, maxWidth: 360,
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%', background: c.icon,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
      }}>{icons[toast.type]}</span>
      <span style={{ fontSize: 14, fontWeight: 500, color: c.text, flex: 1 }}>{toast.message}</span>
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text, fontSize: 16, padding: 2, opacity: 0.6 }}>×</button>
    </div>
  )
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  if (!toasts.length) return null
  return (
    <div style={{
      position: 'fixed', bottom: 80, right: 24, display: 'flex',
      flexDirection: 'column', gap: 8, zIndex: 9999,
    }}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={() => onRemove(t.id)} />
      ))}
    </div>
  )
}
