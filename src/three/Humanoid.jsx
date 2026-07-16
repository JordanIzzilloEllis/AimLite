// A slim, rounded humanoid target built from capsules/cylinders (not boxes, so
// it doesn't read as blocky/Minecraft). The head mesh is tagged kind:'head'
// (bonus points); everything else is kind:'body'. userData.kind is what the
// fire raycast reads to score a shot. Total height stays ~1.66 so the
// elevation and line-of-sight math elsewhere holds.

const BODY = { kind: 'body' }
const HEAD = { kind: 'head' }

export default function Humanoid({ accent = '#ff3ea5' }) {
  return (
    <group>
      {/* Legs — thin rounded capsules, close together */}
      <mesh position={[-0.1, 0.46, 0]} castShadow userData={BODY}>
        <capsuleGeometry args={[0.088, 0.7, 4, 10]} />
        <meshStandardMaterial color="#1c2230" roughness={0.85} />
      </mesh>
      <mesh position={[0.1, 0.46, 0]} castShadow userData={BODY}>
        <capsuleGeometry args={[0.088, 0.7, 4, 10]} />
        <meshStandardMaterial color="#1c2230" roughness={0.85} />
      </mesh>

      {/* Torso — capsule flattened front-to-back and widened at the shoulders
          so it tapers like a human chest, not a slab */}
      <mesh position={[0, 1.18, 0]} scale={[1.28, 1, 0.78]} castShadow userData={BODY}>
        <capsuleGeometry args={[0.17, 0.42, 4, 12]} />
        <meshStandardMaterial color="#2a3346" roughness={0.75} />
      </mesh>

      {/* Slim chest accent (team colour / front indicator) */}
      <mesh position={[0, 1.24, 0.125]} userData={BODY}>
        <boxGeometry args={[0.24, 0.3, 0.05]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.12} roughness={0.5} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[-0.235, 1.4, 0]} castShadow userData={BODY}>
        <sphereGeometry args={[0.085, 12, 10]} />
        <meshStandardMaterial color="#232a3a" roughness={0.8} />
      </mesh>
      <mesh position={[0.235, 1.4, 0]} castShadow userData={BODY}>
        <sphereGeometry args={[0.085, 12, 10]} />
        <meshStandardMaterial color="#232a3a" roughness={0.8} />
      </mesh>

      {/* Arms — thin capsules angled slightly outward */}
      <mesh position={[-0.255, 1.13, 0]} rotation={[0, 0, 0.13]} castShadow userData={BODY}>
        <capsuleGeometry args={[0.058, 0.5, 4, 10]} />
        <meshStandardMaterial color="#232a3a" roughness={0.8} />
      </mesh>
      <mesh position={[0.255, 1.13, 0]} rotation={[0, 0, -0.13]} castShadow userData={BODY}>
        <capsuleGeometry args={[0.058, 0.5, 4, 10]} />
        <meshStandardMaterial color="#232a3a" roughness={0.8} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.48, 0]} userData={BODY}>
        <cylinderGeometry args={[0.055, 0.065, 0.12, 10]} />
        <meshStandardMaterial color="#c99a76" roughness={0.7} />
      </mesh>

      {/* Head — the bonus hitbox */}
      <mesh position={[0, 1.62, 0]} castShadow userData={HEAD}>
        <sphereGeometry args={[0.15, 20, 16]} />
        <meshStandardMaterial color="#d9a983" roughness={0.6} />
      </mesh>
      {/* Visor stripe so the head reads as facing you */}
      <mesh position={[0, 1.63, 0.115]} userData={HEAD}>
        <boxGeometry args={[0.17, 0.05, 0.05]} />
        <meshStandardMaterial color="#0d0d16" roughness={0.4} />
      </mesh>
    </group>
  )
}
