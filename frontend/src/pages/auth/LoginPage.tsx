import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import './LoginPage.css'
import { 
  FiMail, FiLock, FiZap, FiCpu, FiBarChart2, FiAlertCircle 
} from 'react-icons/fi'

type ViewMode = 'TEACHER' | 'ADMIN'

export default function LoginPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('TEACHER')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, motDePasse })
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.role === 'ADMIN') navigate('/admin')
        else if (user.role === 'ENSEIGNANT') navigate('/teacher/quizzes')
        else if (user.role === 'ETUDIANT' || user.role === 'INVITE') navigate('/student')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleView = () => {
    setViewMode(viewMode === 'TEACHER' ? 'ADMIN' : 'TEACHER')
    setError('')
  }

  return (
    <div className="login-container">
      <div className="login-bg-decoration" />
      
      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="brand-logo-container">
          <div className="brand-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-text-quiz">Quiz</span><br />
            <span className="brand-text-brain">Brain</span>
          </div>
        </div>

        {viewMode === 'TEACHER' ? (
          <>
            <p className="login-slogan">
              Create engaging quizzes. Host live sessions.<br/>
              Analyze results in real-time.
            </p>
            <ul className="feature-list">
              <li className="feature-item">
                <FiZap className="feature-icon" />
                Instant session control
              </li>
              <li className="feature-item">
                <FiCpu className="feature-icon" />
                AI-powered question generation
              </li>
              <li className="feature-item">
                <FiBarChart2 className="feature-icon" />
                Live participant analytics
              </li>
            </ul>
          </>
        ) : (
          <>
            <p className="login-slogan">
              Manage schools, track progress, and empower<br/>
              educators with real-time assessment intelligence.
            </p>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">2,500+</span>
                <span className="stat-label">Schools</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">45K+</span>
                <span className="stat-label">Teachers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">1.2M+</span>
                <span className="stat-label">Students</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-form-container">
          <h1 className="login-title">
            {viewMode === 'TEACHER' ? 'Teacher Dashboard' : 'Admin Portal'}
          </h1>
          <p className="login-subtitle">
            {viewMode === 'TEACHER' ? 'Access your quizzes and live sessions' : 'Sign in to manage your QuizBrain platform'}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input 
                  type="email" 
                  className="login-input" 
                  placeholder={viewMode === 'TEACHER' ? 'teacher@school.edu' : 'admin@school.edu'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input 
                  type="password" 
                  className="login-input" 
                  placeholder="••••••••"
                  value={motDePasse}
                  onChange={e => setMotDePasse(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-login-primary" disabled={isLoading}>
              {isLoading ? 'Signing in...' : `Sign in as ${viewMode === 'TEACHER' ? 'Teacher' : 'Admin'} →`}
            </button>
            
            <button type="button" className="btn-login-secondary" onClick={toggleView}>
              Sign in as {viewMode === 'TEACHER' ? 'Admin' : 'Teacher'}
            </button>
            
            {error && (
              <div className="error-message">
                <FiAlertCircle />
                {error}
              </div>
            )}
          </form>

          <div className="login-footer">
            <p style={{marginBottom: '2rem'}}>
              Don't have an account? <a href="#">Contact your admin</a>
            </p>
            <p>
              Teaching with QuizBrain? <a href="#">View documentation</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
