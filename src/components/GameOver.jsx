import { DIFFICULTIES, TARGET_COUNT } from '../config.js'

export default function GameOver({ results, highScore, onPlayAgain, onMenu }) {
  const diff = DIFFICULTIES[results.difficulty]
  const accuracyPct = Math.round(results.accuracy * 100)
  const isRecord =
    highScore &&
    highScore.hits === results.hits &&
    Math.abs(highScore.accuracy - results.accuracy) < 1e-9

  const headline = results.completed ? 'ALL TARGETS DOWN!' : "TIME'S UP"

  // Simple grade based on hits and accuracy.
  const grade = (() => {
    const ratio = results.hits / TARGET_COUNT
    if (results.completed && accuracyPct >= 95) return 'S'
    if (ratio >= 0.9 && accuracyPct >= 85) return 'A'
    if (ratio >= 0.7) return 'B'
    if (ratio >= 0.5) return 'C'
    return 'D'
  })()

  return (
    <div className="screen gameover" style={{ '--accent': diff.accent }}>
      <h2 className={`gameover-title ${results.completed ? 'win' : ''}`}>{headline}</h2>

      <div className="grade" data-grade={grade}>{grade}</div>
      {isRecord && <div className="new-record">★ NEW BEST ★</div>}

      <div className="results-grid">
        <Stat label="Targets Hit" value={`${results.hits}/${TARGET_COUNT}`} />
        <Stat label="Accuracy" value={`${accuracyPct}%`} />
        <Stat label="Best Combo" value={`×${results.bestCombo}`} />
        <Stat label="Misses" value={results.misses} />
        <Stat label="Time Used" value={`${results.timeUsed}s`} />
        <Stat label="Difficulty" value={diff.label} />
      </div>

      <div className="gameover-actions">
        <button className="btn-primary" style={{ '--accent': diff.accent }} onClick={onPlayAgain}>
          ↻ PLAY AGAIN
        </button>
        <button className="btn-ghost" onClick={onMenu}>
          MENU
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="result-stat">
      <span className="result-label">{label}</span>
      <span className="result-value">{value}</span>
    </div>
  )
}
