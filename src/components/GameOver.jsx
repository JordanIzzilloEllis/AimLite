import { DIFFICULTIES, TARGET_COUNT } from '../config.js'

export default function GameOver({ results, highScore, onPlayAgain, onMenu }) {
  const diff = DIFFICULTIES[results.difficulty]
  const accuracyPct = Math.round(results.accuracy * 100)
  const hsRatePct = Math.round(results.headshotRate * 100)
  const isRecord = highScore && highScore.score === results.score

  const headline = results.completed ? 'ROUND CLEARED' : "TIME'S UP"

  const grade = (() => {
    const ratio = results.hits / TARGET_COUNT
    if (results.completed && accuracyPct >= 90 && results.headshotRate >= 0.5) return 'S'
    if (ratio >= 0.85 && accuracyPct >= 70) return 'A'
    if (ratio >= 0.65) return 'B'
    if (ratio >= 0.4) return 'C'
    return 'D'
  })()

  return (
    <div className="screen gameover" style={{ '--accent': diff.accent }}>
      <h2 className={`gameover-title ${results.completed ? 'win' : ''}`}>{headline}</h2>

      <div className="score-headline">
        <span className="score-headline-value">{results.score.toLocaleString()}</span>
        <span className="score-headline-label">POINTS</span>
      </div>

      <div className="grade" data-grade={grade}>{grade}</div>
      {isRecord && <div className="new-record">★ NEW BEST ★</div>}

      <div className="results-grid">
        <Stat label="Targets Hit" value={`${results.hits}/${TARGET_COUNT}`} />
        <Stat label="Headshots" value={`${results.headshots} (${hsRatePct}%)`} />
        <Stat label="Accuracy" value={`${accuracyPct}%`} />
        <Stat label="Best Combo" value={`×${results.bestCombo}`} />
        <Stat label="Escaped" value={results.escaped} />
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
