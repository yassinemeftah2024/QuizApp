/**
 * LandingPage — Page d'accueil publique QuizMind.
 * Desktop + Mobile responsive.
 * TODO dev-a: Implémenter le design complet (cf. design/QuizMindHomeLanding.png)
 */
function LandingPage() {
  return (
    <div className="layout-mobile-gradient" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', marginBottom: '1rem' }}>
        <span className="text-gradient">QuizMind</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Plateforme de Quiz Interactifs en Temps Réel
      </p>
      <a href="/login" className="btn-primary">Commencer →</a>
    </div>
  )
}

export default LandingPage
