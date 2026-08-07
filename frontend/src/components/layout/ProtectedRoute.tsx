import { Navigate } from 'react-router-dom'
import type { RoleEnum } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: RoleEnum[]
}

/**
 * ProtectedRoute — Guard de navigation basé sur le rôle JWT.
 * Redirige vers /login si non authentifié,
 * ou vers / si le rôle n'est pas autorisé.
 */
function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('accessToken')
  const userStr = localStorage.getItem('currentUser')

  // Non authentifié
  if (!token || !userStr) {
    return <Navigate to="/login" replace />
  }

  const user = JSON.parse(userStr)

  // Rôle non autorisé
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
