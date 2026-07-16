import { TARGET_COUNT } from '../config.js'

export default function Hud({ timeLeft, totalTime, hits, misses, combo, accent, onQuit }) {
  const shots = hits + misses
  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 100
  const timeDisplay = timeLeft.toFixed(1)
  const lowTime = timeLeft <= 5
  const progress = Math.min(1, timeLeft / totalTime)

  return (
    <div className="hud" style={{ '--accent': accent }} onPointerDown={(e) => e.stopPropagation()}>
      <div className="hud-stat">
        <span className="hud-label">SCORE</span>
        <span className="hud-value">{hits}<span className="hud-sub">/{TARGET_COUNT}</span></span>
      </div>

      <div className="hud-stat">
        <span className="hud-label">ACCURACY</span>
        <span className="hud-value">{accuracy}%</span>
      </div>

      <div className={`hud-stat hud-timer ${lowTime ? 'low' : ''}`}>
        <span className="hud-label">TIME</span>
        <span className="hud-value">{timeDisplay}</span>
        <span className="timer-bar">
          <span className="timer-fill" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>

      <div className={`hud-stat hud-combo ${combo > 1 ? 'active' : ''}`}>
        <span className="hud-label">COMBO</span>
        <span className="hud-value">{combo > 0 ? `×${combo}` : '—'}</span>
      </div>

      <button className="quit-btn" onClick={onQuit} onPointerDown={(e) => e.stopPropagation()}>
        ✕ Quit
      </button>
    </div>
  )
}
