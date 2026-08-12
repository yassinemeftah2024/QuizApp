import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import AdminLogin from './AdminLogin'
import TeacherLogin from './TeacherLogin'
import StudentLogin from './StudentLogin'

export const AdminLoginWrapper = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleLogin = async (email: string, pass: string) => {
    setError('')
    try {
      await login({ email, motDePasse: pass })
      navigate('/admin')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Unable to sign in. Check your credentials and try again.')
    }
  }

  return <AdminLogin onLogin={handleLogin} onBack={() => navigate('/')} onSwitchRole={(r) => navigate(`/login/${r}`)} authError={error} />
}

export const TeacherLoginWrapper = () => {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  
  const handleLogin = async (email: string, pass: string) => {
    setError('')
    try {
      await login({ email, motDePasse: pass })
      navigate('/teacher')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Unable to sign in. Check your credentials and try again.')
    }
  }

  const handleRegister = async (data: {
    nom: string
    prenom: string
    email: string
    motDePasse: string
    role: 'ENSEIGNANT'
    etablissement: string
    matiereIds: number[]
    classeIds: number[]
  }) => {
    setError('')
    try {
      await register(data)
      navigate('/teacher')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Unable to register. Please check your input.')
    }
  }

  return <TeacherLogin
    onLogin={handleLogin}
    onRegister={handleRegister}
    onBack={() => navigate('/')}
    onSwitchRole={(r) => navigate(`/login/${r}`)}
    authError={error}
  />
}

export const StudentLoginWrapper = () => {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  
  const handleLogin = async (email: string, pass: string, name?: string, classId?: number) => {
    try {
      if (name) {
        const prenom = name.split(' ')[0] || ''
        const nom = name.substring(prenom.length).trim() || ''
        await register({ email, motDePasse: pass, nom, prenom, role: 'ETUDIANT', classeId: classId })
      } else {
        await login({ email, motDePasse: pass })
      }
      navigate('/student')
    } catch (e: any) {
      console.error(e)
      throw e
    }
  }

  return <StudentLogin onLogin={handleLogin} onBack={() => navigate('/')} onSwitchRole={(r) => navigate(`/login/${r}`)} />
}
