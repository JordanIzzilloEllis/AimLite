import { useCallback } from 'react'

export default function Target({ data, accent, onHit }) {
  const handleDown = useCallback(
    (e) => {
      // Stop the field's miss handler from also firing on this click.
      e.stopPropagation()
      onHit(e.clientX, e.clientY)
    },
    [onHit],
  )

  return (
    <button
      className="target"
      onPointerDown={handleDown}
      style={{
        left: data.x,
        top: data.y,
        width: data.size,
        height: data.size,
        '--accent': accent,
      }}
      aria-label="target"
    >
      <span className="target-ring" />
      <span className="target-core" />
    </button>
  )
}
