import React, { createContext, useContext, useState, useEffect } from 'react'
import { AuthResponse, LoginRequest, RegisterRequest, UtilisateurDTO } from '@/types'
import { loginApi, registerApi } from '@/services/authService'

interface AuthContextType {
  user: UtilisateurDTO | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UtilisateurDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('currentUser')
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user', e)
        localStorage.removeItem('currentUser')
      }
    }
    setLoading(false)
  }, [])

  const handleAuthResponse = (data: AuthResponse) => {
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    
    const userData: UtilisateurDTO = {
      id: data.id,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      role: data.role,
      actif: true,
      dateCreation: new Date().toISOString()
    }
    
    localStorage.setItem('currentUser', JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (data: LoginRequest) => {
    const response = await loginApi(data)
    handleAuthResponse(response)
  }

  const register = async (data: RegisterRequest) => {
    const response = await registerApi(data)
    handleAuthResponse(response)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('currentUser')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
