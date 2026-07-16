// The 3D arena: a compact sunlit "dust" range — sandy ground, tan stone walls,
// wooden crates, a couple of building facades (doorway + windows), open blue
// sky. Every solid surface is tagged kind:'obstacle' so the fire raycast treats
// it as cover: shots that hit it are blocked, and a target tucked behind one
// can't be hit.
import { COVER_SPOTS, CRATES, PEEK_DISTANCE } from '../config.js'

const OBSTACLE = { kind: 'obstacle' }

const SAND = '#c9b184'
const SAND_DARK = '#b89b6a'
const STONE = '#c8b795'
const STONE_DARK = '#b3a17d'
const WOOD = '#9c6b39'
const WOOD_TRIM = '#6f4a26'
const GLASS = '#1e2732'

// A simple building facade: two side panels + a lintel leave a see-through
// doorway, and each side gets a dark window pane. Reads as a building, blocks
// shots, and you can shoot through the doorway.
function Facade({ position, rotation = 0 }) {
  const W = 3.4
  const H = 3.0
  const T = 0.4
  const doorW = 0.95
  const doorH = 1.9
  const sideW = (W - doorW) / 2
  const sideX = doorW / 2 + sideW / 2
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[-sideX, H / 2, 0]} castShadow receiveShadow userData={OBSTACLE}>
        <boxGeometry args={[sideW, H, T]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>
      <mesh position={[sideX, H / 2, 0]} castShadow receiveShadow userData={OBSTACLE}>
        <boxGeometry args={[sideW, H, T]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>
      {/* Lintel above the doorway */}
      <mesh position={[0, doorH + (H - doorH) / 2, 0]} castShadow receiveShadow userData={OBSTACLE}>
        <boxGeometry args={[doorW, H - doorH, T]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      {/* Windows (dark panes set into each side panel) */}
      <mesh position={[-sideX, 1.9, T / 2 + 0.02]} userData={OBSTACLE}>
        <boxGeometry args={[0.72, 0.72, 0.06]} />
        <meshStandardMaterial color={GLASS} roughness={0.25} metalness={0.15} />
      </mesh>
      <mesh position={[sideX, 1.9, T / 2 + 0.02]} userData={OBSTACLE}>
        <boxGeometry args={[0.72, 0.72, 0.06]} />
        <meshStandardMaterial color={GLASS} roughness={0.25} metalness={0.15} />
      </mesh>
    </group>
  )
}

export default function Environment() {
  return (
    <group>
      {/* Lighting — bright, warm, sunlit */}
      <ambientLight intensity={0.75} color="#fff3e0" />
      <hemisphereLight args={['#bfe0f2', '#c2a878', 0.85]} />
      <directionalLight
        position={[7, 13, 6]}
        intensity={1.7}
        color="#fff2d2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-near={1}
        shadow-camera-far={36}
        shadow-bias={-0.0005}
      />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow userData={OBSTACLE}>
        <planeGeometry args={[32, 34]} />
        <meshStandardMaterial color={SAND} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -3.5]} receiveShadow userData={OBSTACLE}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color={SAND_DARK} roughness={1} />
      </mesh>

      {/* Boundary walls (tan stone) — no ceiling, open to the sky */}
      <mesh position={[0, 2.25, -9]} castShadow receiveShadow userData={OBSTACLE}>
        <boxGeometry args={[15, 4.5, 0.5]} />
        <meshStandardMaterial color={STONE} roughness={0.95} />
      </mesh>
      <mesh position={[-7.2, 2.25, -1]} castShadow receiveShadow userData={OBSTACLE}>
        <boxGeometry args={[0.5, 4.5, 18]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.95} />
      </mesh>
      <mesh position={[7.2, 2.25, -1]} castShadow receiveShadow userData={OBSTACLE}>
        <boxGeometry args={[0.5, 4.5, 18]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.95} />
      </mesh>
      {/* Low wall behind the player */}
      <mesh position={[0, 1.1, 7.4]} castShadow receiveShadow userData={OBSTACLE}>
        <boxGeometry args={[15, 2.2, 0.5]} />
        <meshStandardMaterial color={STONE} roughness={0.95} />
      </mesh>

      {/* Building facades as backdrop cover */}
      <Facade position={[-3.9, 0, -8.5]} rotation={0.12} />
      <Facade position={[3.9, 0, -8.5]} rotation={-0.12} />

      {/* Cover pillars / corners + raised ledges, one per spawn spot. Elevated
          spots get a stone platform for the target to stand on, and the pillar
          rides up with it so a hidden target stays occluded. */}
      {COVER_SPOTS.map((spot, i) => {
        const [x, z] = spot.pos
        const elev = spot.elev || 0
        const platCenterX = x + (spot.side * PEEK_DISTANCE) / 2
        const platWidth = PEEK_DISTANCE + 1.2
        return (
          <group key={i}>
            {elev > 0 && (
              <mesh position={[platCenterX, elev / 2, z]} castShadow receiveShadow userData={OBSTACLE}>
                <boxGeometry args={[platWidth, elev, 1.7]} />
                <meshStandardMaterial color={i % 2 ? STONE_DARK : SAND_DARK} roughness={0.95} />
              </mesh>
            )}
            <mesh position={[x, elev + 0.85, z + 0.18]} castShadow receiveShadow userData={OBSTACLE}>
              <boxGeometry args={[1.0, 1.7, 0.35]} />
              <meshStandardMaterial color={i % 2 ? STONE : STONE_DARK} roughness={0.9} />
            </mesh>
          </group>
        )
      })}

      {/* Free-standing wooden crates */}
      {CRATES.map((c, i) => (
        <group key={`crate-${i}`} position={[c[0], c[1], c[2]]}>
          <mesh castShadow receiveShadow userData={OBSTACLE}>
            <boxGeometry args={[c[3], c[3], c[3]]} />
            <meshStandardMaterial color={WOOD} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0, c[3] / 2 + 0.01]} userData={OBSTACLE}>
            <boxGeometry args={[c[3] * 0.98, c[3] * 0.16, 0.03]} />
            <meshStandardMaterial color={WOOD_TRIM} roughness={0.8} />
          </mesh>
          <mesh position={[c[3] / 2 + 0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]} userData={OBSTACLE}>
            <boxGeometry args={[c[3] * 0.98, c[3] * 0.16, 0.03]} />
            <meshStandardMaterial color={WOOD_TRIM} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
