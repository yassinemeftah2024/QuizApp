import { Navigate } from 'react-router-dom'
import type { RoleEnum } from '@/types'
import { useAuth } from '@/context/AuthContext'

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
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  // Non authentifié
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Rôle non autorisé
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
