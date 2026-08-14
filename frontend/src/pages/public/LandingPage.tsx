import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
import { 
  FiPlay, FiFileText, FiBarChart2, FiUsers, FiAward, FiShield, FiUser,
  FiZap, FiCpu, FiCheckCircle, FiEye, FiThumbsUp, FiMaximize, FiCamera,
  FiArrowRight, FiBookOpen, FiCheck
} from 'react-icons/fi'

export default function LandingPage() {
  const navigate = useNavigate()
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const [nickname, setNickname] = useState('')

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)
  }

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    const pinCode = pin.join('')
    if (pinCode.length === 6 && nickname) {
      navigate(`/join/${pinCode}`)
    }
  }

  return (
    <div className="landing-container">
      {/* NAVBAR */}
      <nav className="landing-navbar">
        <div className="nav-brand">
          <div className="brand-icon-small">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span className="nav-brand-text">QuizBrain</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#schools">For Schools</a>
        </div>
        <div className="nav-actions">
          <button className="btn-nav-login" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn-nav-primary" onClick={() => navigate('/login')}>Start for free</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="live-badge">
          <span className="live-dot"></span>
          Now live — join 2,000+ schools worldwide
        </div>
        <h1 className="hero-title">
          The quiz platform<br />
          <span className="hero-title-highlight">your classroom deserves</span>
        </h1>
        <p className="hero-subtitle">
          Real-time quizzes, AI-generated questions, and data-driven<br />
          insights — built for teachers who want to make learning<br />
          unforgettable.
        </p>

        <div className="hero-tags">
          <span className="tag tag-blue"><FiZap className="tag-icon"/> Real-time</span>
          <span className="tag tag-purple"><FiCpu className="tag-icon"/> AI-powered</span>
          <span className="tag tag-cyan"><FiBarChart2 className="tag-icon"/> Data insights</span>
          <span className="tag tag-green"><FiCheckCircle className="tag-icon"/> Exam-ready</span>
        </div>

        <div className="hero-actions">
          <button className="btn-hero-primary" onClick={() => navigate('/login')}>
            <FiPlay /> Start hosting quizzes
          </button>
          <button className="btn-hero-secondary">
            <FiEye /> Watch demo
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-box">
            <div className="stat-icon-wrapper text-blue"><FiUsers className="stat-icon"/></div>
            <div className="stat-content">
              <span className="stat-number text-blue">50K+</span>
              <span className="stat-label">Students</span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon-wrapper text-purple"><FiAward className="stat-icon"/></div>
            <div className="stat-content">
              <span className="stat-number text-purple">3,200+</span>
              <span className="stat-label">Teachers</span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon-wrapper text-cyan"><FiPlay className="stat-icon"/></div>
            <div className="stat-content">
              <span className="stat-number text-cyan">180K+</span>
              <span className="stat-label">Quizzes played</span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon-wrapper text-green"><FiThumbsUp className="stat-icon"/></div>
            <div className="stat-content">
              <span className="stat-number text-green">98%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN WIDGET SECTION */}
      <section className="join-section">
        <div className="join-widget-container">
          <div className="join-left">
            <h3 className="join-title"><span className="text-blue">#</span> Join with a PIN</h3>
            <p className="join-subtitle">Enter the 6-digit code your teacher displayed</p>
            
            <form onSubmit={handleJoin} className="join-form">
              <div className="pin-inputs">
                {pin.map((digit, index) => (
                  <input 
                    key={index}
                    type="text" 
                    maxLength={1} 
                    className="pin-input"
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                  />
                ))}
              </div>
              <div className="join-input-group">
                <label className="join-label">Your nickname</label>
                <div className="nickname-input-container">
                  <FiUser className="input-icon" />
                  <input 
                    type="text" 
                    className="nickname-input"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn-join">
                <FiArrowRight /> Join the quiz!
              </button>
            </form>
          </div>
          
          <div className="join-divider">or</div>
          
          <div className="join-right">
            <h3 className="join-title"><FiMaximize /> Scan QR Code</h3>
            <p className="join-subtitle">Point your camera at the screen to join instantly</p>
            <div className="qr-placeholder">
              <div className="qr-grid"></div>
            </div>
            <button className="btn-scan">
              <FiCamera /> Open camera
            </button>
          </div>
        </div>

        <div className="login-as-section">
          <span className="login-as-label">Log in as:</span>
          <div className="role-cards-mini">
            <div className="role-card-mini" onClick={() => navigate('/login')}>
              <FiShield className="role-icon" />
              <div className="role-text">
                <span className="role-name">Admin</span>
                <span className="role-desc">Manage the platform</span>
              </div>
            </div>
            <div className="role-card-mini active" onClick={() => navigate('/login')}>
              <FiBookOpen className="role-icon" />
              <div className="role-text">
                <span className="role-name">Teacher</span>
                <span className="role-desc">Create & host quizzes</span>
              </div>
            </div>
            <div className="role-card-mini" onClick={() => navigate('/login')}>
              <FiUser className="role-icon" />
              <div className="role-text">
                <span className="role-name">Student</span>
                <span className="role-desc">Join live sessions</span>
              </div>
            </div>
            <div className="role-card-mini" onClick={() => navigate('/login')}>
              <FiZap className="role-icon" />
              <div className="role-text">
                <span className="role-name">Guest</span>
                <span className="role-desc">Play instantly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="how-it-works-section">
        <h4 className="section-pretitle">HOW IT WORKS</h4>
        <h2 className="section-title">From idea to live quiz in minutes</h2>
        <p className="section-subtitle">Three simple steps for teachers. One tap for students.</p>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon-wrapper"><FiFileText /></div>
            <h3 className="step-title">Create or import</h3>
            <p className="step-desc">Build your quiz from scratch or upload a PDF/Word document — our AI generates questions instantly.</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon-wrapper purple"><FiPlay /></div>
            <h3 className="step-title">Start a live session</h3>
            <p className="step-desc">Launch your quiz, share the PIN or QR code with your class. Students join on any device in seconds.</p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon-wrapper cyan"><FiBarChart2 /></div>
            <h3 className="step-title">Analyze results</h3>
            <p className="step-desc">Get instant insights: score distribution, difficult questions, individual progress, exportable reports.</p>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="roles-section">
        <h4 className="section-pretitle">BUILT FOR EVERYONE</h4>
        <h2 className="section-title">One platform, four roles</h2>

        <div className="roles-grid">
          <div className="role-card role-admin">
            <div className="role-icon-box"><FiShield /></div>
            <h3 className="role-title">Administrator</h3>
            <p className="role-desc">Full platform control, user management, analytics dashboards, and system configuration.</p>
            <ul className="role-features">
              <li><FiCheck /> User & role management</li>
              <li><FiCheck /> Platform-wide analytics</li>
              <li><FiCheck /> System settings</li>
            </ul>
          </div>
          <div className="role-card role-teacher">
            <div className="role-icon-box"><FiBookOpen /></div>
            <h3 className="role-title">Teacher</h3>
            <p className="role-desc">Create quizzes, import documents, launch live sessions, and track student performance.</p>
            <ul className="role-features">
              <li><FiCheck /> Quiz builder & AI import</li>
              <li><FiCheck /> Live session control</li>
              <li><FiCheck /> Results & reports</li>
            </ul>
          </div>
          <div className="role-card role-student">
            <div className="role-icon-box"><FiUser /></div>
            <h3 className="role-title">Student</h3>
            <p className="role-desc">Join live quizzes, track personal progress, earn badges, and review past performance.</p>
            <ul className="role-features">
              <li><FiCheck /> Live quiz participation</li>
              <li><FiCheck /> Progress & badges</li>
              <li><FiCheck /> History & stats</li>
            </ul>
          </div>
          <div className="role-card role-guest">
            <div className="role-icon-box"><FiZap /></div>
            <h3 className="role-title">Guest</h3>
            <p className="role-desc">Instant access with just a PIN — no account needed. Join, play, and see your score.</p>
            <ul className="role-features">
              <li><FiCheck /> No registration needed</li>
              <li><FiCheck /> PIN or QR join</li>
              <li><FiCheck /> Convert to account</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="cta-box">
          <h2 className="cta-title">Ready to transform your<br/>classroom?</h2>
          <p className="cta-subtitle">Join thousands of educators making assessments engaging, fast, and meaningful.</p>
          <div className="cta-actions">
            <button className="btn-cta-primary" onClick={() => navigate('/login')}>Get started free</button>
            <button className="btn-cta-secondary">Contact sales</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-icon-small">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span>QuizBrain</span>
          </div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Documentation</a>
            <a href="#">Support</a>
          </div>
          <div className="footer-copyright">
            © 2025 QuizBrain. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
