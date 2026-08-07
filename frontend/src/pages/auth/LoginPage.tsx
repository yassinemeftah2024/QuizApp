/**
 * LoginPage — Authentification (Admin, Enseignant, Etudiant).
 * TODO dev-a: Implémenter le design (cf. design/AdminLoginAuth.png + design/TeacherLogin.png)
 */
function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
          Connexion
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Accédez à votre espace QuizMind
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          🚧 À implémenter — dev-a Sprint 1
        </p>
      </div>
    </div>
  )
}

export default LoginPage
