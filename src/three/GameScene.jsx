import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector2, Vector3, Raycaster } from 'three'
import Environment from './Environment.jsx'
import Target3D from './Target3D.jsx'
import {
  BASE_SENSITIVITY,
  MAX_YAW,
  MAX_PITCH,
  CAMERA_FOV,
  PLAYER_POS,
  PEEK_DISTANCE,
  COVER_SPOTS,
  TARGET_HEAD_Y,
} from '../config.js'

// Lives inside <Canvas>. Owns the first-person camera (pointer-lock mouse-look),
// the fire raycast from the crosshair, and renders the arena + active target.
export default function GameScene({
  target,
  exposure,
  accent,
  sensMult,
  clockRef,
  onFire,
  onLockChange,
  spotPickerRef,
}) {
  const { camera, gl, scene, raycaster } = useThree()
  const yaw = useRef(0)
  const pitch = useRef(0)
  const locked = useRef(false)
  const losRay = useRef(new Raycaster())

  // Expose a spot picker to the game loop that only returns spawn spots the
  // player has a clear line of sight to the target's HEAD (so head-only peeks
  // are valid, but nothing spawns fully hidden behind cover and escapes unseen).
  spotPickerRef.current = (excludeIndex) => {
    const obstacles = []
    scene.traverse((o) => {
      if (o.isMesh && o.userData && o.userData.kind === 'obstacle') obstacles.push(o)
    })

    const hasLineOfSight = (point) => {
      const dir = point.clone().sub(camera.position)
      const dist = dir.length()
      dir.normalize()
      losRay.current.set(camera.position, dir)
      losRay.current.far = dist - 0.2 // stop just short of the target
      return losRay.current.intersectObjects(obstacles, false).length === 0
    }

    // Random order so visible spots still vary between rounds.
    const order = [...COVER_SPOTS.keys()]
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }

    let fallback = -1
    for (const i of order) {
      const spot = COVER_SPOTS[i]
      const ex = spot.pos[0] + spot.side * PEEK_DISTANCE
      const head = new Vector3(ex, (spot.elev || 0) + TARGET_HEAD_Y, spot.pos[1] - 0.2)
      if (hasLineOfSight(head)) {
        if (i !== excludeIndex) return i
        if (fallback === -1) fallback = i
      }
    }
    // Only the just-used spot is visible (or somehow none) — take what we can.
    return fallback !== -1 ? fallback : order[0]
  }

  // Keep the latest fire handler without re-binding listeners every render.
  const onFireRef = useRef(onFire)
  onFireRef.current = onFire
  const onLockRef = useRef(onLockChange)
  onLockRef.current = onLockChange

  // One-time camera setup.
  useEffect(() => {
    camera.position.set(...PLAYER_POS)
    camera.fov = CAMERA_FOV
    camera.rotation.order = 'YXZ'
    camera.updateProjectionMatrix()
  }, [camera])

  // Pointer lock + mouse-look + fire wiring.
  useEffect(() => {
    const canvas = gl.domElement
    const center = new Vector2(0, 0)

    const doFire = () => {
      raycaster.setFromCamera(center, camera)
      const hits = raycaster.intersectObjects(scene.children, true)
      let kind = 'none'
      for (const h of hits) {
        const k = h.object?.userData?.kind
        if (k) {
          kind = k
          break
        }
      }
      onFireRef.current(kind)
    }

    const onMouseDown = (e) => {
      if (e.button !== 0) return
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock()
      } else {
        doFire()
      }
    }

    const onMouseMove = (e) => {
      if (document.pointerLockElement !== canvas) return
      const sens = BASE_SENSITIVITY * sensMult
      yaw.current = clamp(yaw.current - e.movementX * sens, -MAX_YAW, MAX_YAW)
      pitch.current = clamp(pitch.current - e.movementY * sens, -MAX_PITCH, MAX_PITCH)
    }

    const onLockChange = () => {
      locked.current = document.pointerLockElement === canvas
      onLockRef.current(locked.current)
    }

    canvas.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerlockchange', onLockChange)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerlockchange', onLockChange)
      if (document.pointerLockElement === canvas) document.exitPointerLock()
    }
  }, [gl, camera, scene, raycaster, sensMult])

  useFrame(() => {
    camera.rotation.set(pitch.current, yaw.current, 0)
  })

  return (
    <>
      <Environment />
      {target && (
        <Target3D
          key={target.id}
          spot={target.spot}
          exposure={exposure}
          accent={accent}
          spawnAtClock={target.spawnAtClock}
          clockRef={clockRef}
        />
      )}
    </>
  )
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v))
}
