export default function Logo({ size = 32, showText = true }: { size?: number; showText?: boolean }) {
  const id = `lg${size}`
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.28 }}>
      {/* Hexagonal burst logo mark */}
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${id}a`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00E5FF" />
            <stop offset="0.5" stopColor="#9D00FF" />
            <stop offset="1" stopColor="#FF006E" />
          </linearGradient>
          <linearGradient id={`${id}b`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AAFF00" />
            <stop offset="1" stopColor="#00E5FF" />
          </linearGradient>
          <filter id={`${id}glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Outer star burst ring */}
        <path
          d="M24 2L27.5 9.5L35.5 7L33 15L41 18.5L34.5 23.5L38 32L30 29.5L27.5 38L22 31L15 34L16 26L8 24L14.5 18.5L10 11L18.5 12.5L24 2Z"
          fill={`url(#${id}a)`}
          filter={`url(#${id}glow)`}
          opacity="0.9"
        />

        {/* Inner polygon */}
        <path
          d="M24 10L26.5 16L33 14.5L30.5 20.5L36 24L30 27.5L32 34L26 31L24 37L22 31L16 34L18 27.5L12 24L17.5 20.5L15 14.5L21.5 16L24 10Z"
          fill="#0D0221"
          opacity="0.85"
        />

        {/* Lightning bolt Q */}
        <path
          d="M21 17L18 24H22.5L19.5 31L29 22H24.5L27.5 17H21Z"
          fill={`url(#${id}b)`}
          filter={`url(#${id}glow)`}
        />

        {/* Dot accent */}
        <circle cx="30" cy="30" r="2.5" fill="#AAFF00" opacity="0.9" />
        <circle cx="18" cy="18" r="1.5" fill="#00E5FF" opacity="0.7" />
      </svg>

      {showText && (
        <span style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: size * 0.6,
          lineHeight: 1,
          letterSpacing: '0.02em',
        }}>
          <span style={{
            background: 'linear-gradient(90deg, #00E5FF, #9D00FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Quiz</span>
          <span style={{
            background: 'linear-gradient(90deg, #FF006E, #AAFF00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Pulse</span>
        </span>
      )}
    </div>
  )
}
