import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector2 } from 'three'
import Environment from './Environment.jsx'
import Target3D from './Target3D.jsx'
import {
  BASE_SENSITIVITY,
  MAX_YAW,
  MAX_PITCH,
  CAMERA_FOV,
  PLAYER_POS,
} from '../config.js'

// Lives inside <Canvas>. Owns the first-person camera (pointer-lock mouse-look),
// the fire raycast from the crosshair, and renders the arena + active target.
export default function GameScene({ target, exposure, accent, sensMult, clockRef, onFire, onLockChange }) {
  const { camera, gl, scene, raycaster } = useThree()
  const yaw = useRef(0)
  const pitch = useRef(0)
  const locked = useRef(false)

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
