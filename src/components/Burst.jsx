// A particle burst rendered at the hit location. Purely decorative CSS animation.
const PARTICLES = 8

export default function Burst({ x, y, color }) {
  return (
    <div className="burst" style={{ left: x, top: y }}>
      {Array.from({ length: PARTICLES }).map((_, i) => {
        const angle = (360 / PARTICLES) * i
        return (
          <span
            key={i}
            className="particle"
            style={{ '--angle': `${angle}deg`, '--color': color }}
          />
        )
      })}
      <span className="burst-ring" style={{ '--color': color }} />
    </div>
  )
}
