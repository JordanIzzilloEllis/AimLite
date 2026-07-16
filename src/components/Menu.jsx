import { useState } from 'react'
import { DIFFICULTIES, DEFAULT_DIFFICULTY, TARGET_COUNT } from '../config.js'

export default function Menu({ onStart, highScores }) {
  const [selected, setSelected] = useState(DEFAULT_DIFFICULTY)
  const diff = DIFFICULTIES[selected]

  return (
    <div className="screen menu">
      <h1 className="title">
        <span className="title-web">WEB</span>
        <span className="title-aim">AIM</span>
      </h1>
      <p className="tagline">Hit {TARGET_COUNT} targets before the clock hits zero.</p>

      <div className="difficulty-picker">
        {Object.values(DIFFICULTIES).map((d) => {
          const best = highScores[d.key]
          return (
            <button
              key={d.key}
              className={`diff-card ${selected === d.key ? 'selected' : ''}`}
              style={{ '--accent': d.accent }}
              onClick={() => setSelected(d.key)}
            >
              <span className="diff-label">{d.label}</span>
              <span className="diff-time">{d.time}s</span>
              <span className="diff-meta">{TARGET_COUNT} targets</span>
              {best && (
                <span className="diff-best">
                  Best: {best.hits}/{TARGET_COUNT} · {Math.round(best.accuracy * 100)}%
                </span>
              )}
            </button>
          )
        })}
      </div>

      <button
        className="btn-primary"
        style={{ '--accent': diff.accent }}
        onClick={() => onStart(selected)}
      >
        ▶ START
      </button>

      <p className="hint">Click the glowing targets as fast as you can. Missed clicks hurt your accuracy.</p>
    </div>
  )
}
