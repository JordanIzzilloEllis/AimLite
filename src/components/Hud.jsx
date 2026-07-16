import { TARGET_COUNT } from '../config.js'

export default function Hud({ timeLeft, totalTime, score, resolved, headshots, combo, accent, onQuit }) {
  const timeDisplay = timeLeft.toFixed(1)
  const lowTime = timeLeft <= 5
  const progress = Math.min(1, Math.max(0, timeLeft / totalTime))

  return (
    <div className="hud" style={{ '--accent': accent }}>
      <div className="hud-stat">
        <span className="hud-label">SCORE</span>
        <span className="hud-value">{score}</span>
      </div>

      <div className="hud-stat">
        <span className="hud-label">TARGETS</span>
        <span className="hud-value">
          {resolved}<span className="hud-sub">/{TARGET_COUNT}</span>
        </span>
      </div>

      <div className="hud-stat">
        <span className="hud-label">HEADSHOTS</span>
        <span className="hud-value hud-hs">{headshots}</span>
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
