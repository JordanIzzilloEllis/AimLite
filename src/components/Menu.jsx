import { useState } from 'react'
import {
  DIFFICULTIES,
  DEFAULT_DIFFICULTY,
  TARGET_COUNT,
  SENS_MIN,
  SENS_MAX,
} from '../config.js'

export default function Menu({ onStart, highScores, sensMult, onSensChange }) {
  const [selected, setSelected] = useState(DEFAULT_DIFFICULTY)
  const diff = DIFFICULTIES[selected]

  return (
    <div className="screen menu">
      <h1 className="title">
        <span className="title-web">AIM</span>
        <span className="title-aim">LITE</span>
      </h1>
      <p className="tagline">Peek &amp; hide flick trainer — tag {TARGET_COUNT} targets before the clock dies.</p>

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
              <span className="diff-meta">{d.exposure}s exposure</span>
              {best && <span className="diff-best">Best: {best.score.toLocaleString()}</span>}
            </button>
          )
        })}
      </div>

      <div className="sens-row">
        <label className="sens-label" htmlFor="sens">Sensitivity</label>
        <input
          id="sens"
          className="sens-slider"
          type="range"
          min={SENS_MIN}
          max={SENS_MAX}
          step={0.05}
          value={sensMult}
          onChange={(e) => onSensChange(parseFloat(e.target.value))}
          style={{ '--accent': diff.accent }}
        />
        <span className="sens-value">{sensMult.toFixed(2)}×</span>
      </div>

      <button
        className="btn-primary"
        style={{ '--accent': diff.accent }}
        onClick={() => onStart(selected)}
      >
        ▶ START
      </button>

      <p className="hint">
        Click to lock your aim, move the mouse to look, left-click to fire. Headshots score big —
        but crates and corners will block your shots and hide the enemy.
      </p>
    </div>
  )
}
