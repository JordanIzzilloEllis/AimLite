import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Humanoid from './Humanoid.jsx'
import { RISE_TIME, HIDE_TIME, PEEK_DISTANCE, PLAYER_POS, TARGET_SCALE } from '../config.js'

// Animates a humanoid sliding out sideways from behind its cover pillar,
// holding for the exposure window, then ducking back. The timing is driven off
// the shared game clock (clockRef) so it pauses exactly when the game pauses.
export default function Target3D({ spot, exposure, accent, spawnAtClock, clockRef }) {
  const groupRef = useRef(null)

  const { hiddenX, exposedX, baseZ, baseY, faceY } = useMemo(() => {
    const hx = spot.pos[0]
    const ex = hx + spot.side * PEEK_DISTANCE
    const bz = spot.pos[1] - 0.2 // behind the pillar (pillar sits at pos + 0.2)
    const by = spot.elev || 0 // stand on the ledge/platform
    // Rotate to roughly face the player so the head/chest read correctly.
    const fy = Math.atan2(PLAYER_POS[0] - ex, PLAYER_POS[2] - bz)
    return { hiddenX: hx, exposedX: ex, baseZ: bz, baseY: by, faceY: fy }
  }, [spot])

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    const elapsed = clockRef.current - spawnAtClock
    let e // 0 = hidden behind cover, 1 = fully exposed
    if (elapsed < RISE_TIME) {
      e = elapsed / RISE_TIME
    } else if (elapsed < RISE_TIME + exposure) {
      e = 1
    } else if (elapsed < RISE_TIME + exposure + HIDE_TIME) {
      e = 1 - (elapsed - (RISE_TIME + exposure)) / HIDE_TIME
    } else {
      e = 0
    }
    e = Math.max(0, Math.min(1, e))
    g.position.x = hiddenX + (exposedX - hiddenX) * e
  })

  return (
    <group ref={groupRef} position={[hiddenX, baseY, baseZ]} rotation={[0, faceY, 0]} scale={TARGET_SCALE}>
      <Humanoid accent={accent} />
    </group>
  )
}
