// A low-poly humanoid target assembled from primitives — no model files needed.
// The head mesh is tagged kind:'head' (bonus points); everything else is
// kind:'body'. userData.kind is what the fire raycast reads to score a shot.

const BODY = { kind: 'body' }
const HEAD = { kind: 'head' }

export default function Humanoid({ accent = '#ff3ea5' }) {
  // Materials: a dark tactical suit with an accent chest/legs, a lighter head.
  return (
    <group>
      {/* Legs */}
      <mesh position={[-0.13, 0.42, 0]} castShadow userData={BODY}>
        <boxGeometry args={[0.2, 0.85, 0.24]} />
        <meshStandardMaterial color="#1c2230" roughness={0.8} />
      </mesh>
      <mesh position={[0.13, 0.42, 0]} castShadow userData={BODY}>
        <boxGeometry args={[0.2, 0.85, 0.24]} />
        <meshStandardMaterial color="#1c2230" roughness={0.8} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.12, 0]} castShadow userData={BODY}>
        <boxGeometry args={[0.52, 0.62, 0.3]} />
        <meshStandardMaterial color="#2a3346" roughness={0.7} />
      </mesh>

      {/* Chest accent plate (identifies the front + adds the CS-vest look) */}
      <mesh position={[0, 1.16, 0.16]} userData={BODY}>
        <boxGeometry args={[0.42, 0.42, 0.06]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.4}
          roughness={0.5}
        />
      </mesh>

      {/* Shoulders / arms */}
      <mesh position={[-0.35, 1.12, 0]} castShadow userData={BODY}>
        <boxGeometry args={[0.16, 0.56, 0.22]} />
        <meshStandardMaterial color="#232a3a" roughness={0.8} />
      </mesh>
      <mesh position={[0.35, 1.12, 0]} castShadow userData={BODY}>
        <boxGeometry args={[0.16, 0.56, 0.22]} />
        <meshStandardMaterial color="#232a3a" roughness={0.8} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.5, 0]} userData={BODY}>
        <cylinderGeometry args={[0.07, 0.08, 0.12, 8]} />
        <meshStandardMaterial color="#c99a76" roughness={0.7} />
      </mesh>

      {/* Head — the bonus hitbox. Slightly forgiving radius so flicks feel good. */}
      <mesh position={[0, 1.66, 0]} castShadow userData={HEAD}>
        <sphereGeometry args={[0.17, 20, 16]} />
        <meshStandardMaterial color="#d9a983" roughness={0.6} />
      </mesh>
      {/* Visor stripe so the head reads as facing you */}
      <mesh position={[0, 1.68, 0.13]} userData={HEAD}>
        <boxGeometry args={[0.2, 0.06, 0.06]} />
        <meshStandardMaterial color="#0d0d16" roughness={0.4} />
      </mesh>
    </group>
  )
}
