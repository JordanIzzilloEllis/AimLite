// The 3D arena: floor, boundary walls, cover pillars (corners targets peek
// around), and free-standing crates. Every solid surface is tagged
// kind:'obstacle' so the fire raycast treats it as cover — shots that hit a
// wall/crate/pillar are blocked, and a target tucked behind one can't be hit.
import { COVER_SPOTS, CRATES } from '../config.js'

const OBSTACLE = { kind: 'obstacle' }

export default function Environment() {
  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#8090ff', '#20140a', 0.5]} />
      <directionalLight
        position={[5, 12, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-6, 4, -6]} intensity={0.4} color="#22d3ff" />
      <pointLight position={[6, 4, -8]} intensity={0.4} color="#ff3ea5" />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow userData={OBSTACLE}>
        <planeGeometry args={[20, 22]} />
        <meshStandardMaterial color="#12161f" roughness={0.95} />
      </mesh>

      {/* Boundary walls */}
      <mesh position={[0, 3, -11]} userData={OBSTACLE}>
        <boxGeometry args={[20, 6, 0.4]} />
        <meshStandardMaterial color="#161a26" roughness={0.9} />
      </mesh>
      <mesh position={[-9.8, 3, -2]} userData={OBSTACLE}>
        <boxGeometry args={[0.4, 6, 22]} />
        <meshStandardMaterial color="#141824" roughness={0.9} />
      </mesh>
      <mesh position={[9.8, 3, -2]} userData={OBSTACLE}>
        <boxGeometry args={[0.4, 6, 22]} />
        <meshStandardMaterial color="#141824" roughness={0.9} />
      </mesh>
      {/* Ceiling (kept dark, not an obstacle you'd usually shoot) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, -2]} userData={OBSTACLE}>
        <planeGeometry args={[20, 22]} />
        <meshStandardMaterial color="#0c0e15" roughness={1} />
      </mesh>

      {/* Cover pillars / corners — one per spawn spot */}
      {COVER_SPOTS.map((spot, i) => (
        <mesh key={i} position={[spot.pos[0], 1.15, spot.pos[1] + 0.2]} castShadow userData={OBSTACLE}>
          <boxGeometry args={[1.3, 2.3, 0.42]} />
          <meshStandardMaterial color="#20252f" roughness={0.85} />
        </mesh>
      ))}

      {/* Free-standing crates */}
      {CRATES.map((c, i) => (
        <mesh key={`crate-${i}`} position={[c[0], c[1], c[2]]} castShadow receiveShadow userData={OBSTACLE}>
          <boxGeometry args={[c[3], c[3], c[3]]} />
          <meshStandardMaterial color="#3a3020" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
