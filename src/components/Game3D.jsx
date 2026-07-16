import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import GameScene from '../three/GameScene.jsx'
import Hud from './Hud.jsx'
import { sound } from '../sound.js'
import {
  DIFFICULTIES,
  TARGET_COUNT,
  BODY_POINTS,
  HEAD_POINTS,
  COMBO_STEP,
  COMBO_MAX_MULT,
  RISE_TIME,
  HIDE_TIME,
  SPAWN_GAP,
  CAMERA_FOV,
  PLAYER_POS,
  COVER_SPOTS,
} from '../config.js'

const INITIAL_DELAY = 0.35

export default function Game3D({ difficulty, sensMult, onEnd, onQuit }) {
  const diff = DIFFICULTIES[difficulty]
  const life = RISE_TIME + diff.exposure + HIDE_TIME // full peek lifetime

  const clockRef = useRef(0)
  const lockedRef = useRef(false)
  const rafRef = useRef(0)
  const lastSpotRef = useRef(-1)
  const targetSeq = useRef(0)
  const spotPickerRef = useRef(null)

  // Authoritative mutable game state (the rAF loop mutates this directly).
  const g = useRef(null)
  if (g.current === null) {
    g.current = {
      clock: 0,
      score: 0,
      hits: 0,
      headshots: 0,
      misses: 0,
      shots: 0,
      combo: 0,
      bestCombo: 0,
      resolved: 0,
      escaped: 0,
      target: null,
      nextSpawnAt: INITIAL_DELAY,
      ended: false,
    }
  }

  const [display, setDisplay] = useState({
    timeLeft: diff.time,
    score: 0,
    hits: 0,
    headshots: 0,
    combo: 0,
    resolved: 0,
  })
  const [target, setTarget] = useState(null)
  const [locked, setLocked] = useState(false)
  const [popups, setPopups] = useState([])

  const snapshot = useCallback(() => {
    const s = g.current
    setDisplay({
      timeLeft: Math.max(0, diff.time - s.clock),
      score: s.score,
      hits: s.hits,
      headshots: s.headshots,
      combo: s.combo,
      resolved: s.resolved,
    })
  }, [diff.time])

  const spawn = useCallback(() => {
    const s = g.current
    // Prefer the scene's line-of-sight-aware picker so targets are never fully
    // hidden behind cover; fall back to random if the scene isn't ready yet.
    let idx
    if (spotPickerRef.current) {
      idx = spotPickerRef.current(lastSpotRef.current)
    } else {
      idx = Math.floor(Math.random() * COVER_SPOTS.length)
      if (COVER_SPOTS.length > 1 && idx === lastSpotRef.current) {
        idx = (idx + 1 + Math.floor(Math.random() * (COVER_SPOTS.length - 1))) % COVER_SPOTS.length
      }
    }
    lastSpotRef.current = idx
    const t = {
      id: ++targetSeq.current,
      spot: COVER_SPOTS[idx],
      spawnAtClock: s.clock,
    }
    s.target = t
    setTarget(t)
  }, [])

  const endGame = useCallback(() => {
    const s = g.current
    if (s.ended) return
    s.ended = true
    cancelAnimationFrame(rafRef.current)
    if (document.pointerLockElement) document.exitPointerLock()
    const shots = s.shots
    onEnd({
      difficulty,
      completed: s.resolved >= TARGET_COUNT,
      score: s.score,
      hits: s.hits,
      headshots: s.headshots,
      misses: s.misses,
      shots,
      escaped: s.escaped,
      bestCombo: s.bestCombo,
      accuracy: shots > 0 ? s.hits / shots : 0,
      headshotRate: s.hits > 0 ? s.headshots / s.hits : 0,
      timeUsed: +Math.min(diff.time, s.clock).toFixed(1),
      totalTime: diff.time,
    })
  }, [difficulty, diff.time, onEnd])

  const addPopup = useCallback((text, color) => {
    const id = ++targetSeq.current + '-p'
    setPopups((p) => [...p.slice(-4), { id, text, color }])
    setTimeout(() => setPopups((p) => p.filter((it) => it.id !== id)), 700)
  }, [])

  // Fire handler — called by the scene's crosshair raycast.
  const handleFire = useCallback(
    (kind) => {
      const s = g.current
      if (s.ended) return
      sound.gunshot()
      s.shots += 1

      const t = s.target
      const hittable = t && s.clock - t.spawnAtClock < life
      if ((kind === 'head' || kind === 'body') && hittable) {
        s.combo += 1
        s.bestCombo = Math.max(s.bestCombo, s.combo)
        const mult = Math.min(COMBO_MAX_MULT, 1 + (s.combo - 1) * COMBO_STEP)
        const base = kind === 'head' ? HEAD_POINTS : BODY_POINTS
        const pts = Math.round(base * mult)
        s.score += pts
        s.hits += 1
        s.resolved += 1
        if (kind === 'head') {
          s.headshots += 1
          sound.headshot(s.combo)
          addPopup(`+${pts} HEADSHOT`, '#ffd93b')
        } else {
          sound.hit(s.combo)
          addPopup(`+${pts}`, diff.accent)
        }
        // Resolve this target; schedule the next.
        s.target = null
        setTarget(null)
        s.nextSpawnAt = s.clock + SPAWN_GAP
        if (s.resolved >= TARGET_COUNT) {
          snapshot()
          endGame()
          return
        }
      } else {
        // Whiff or blocked by cover.
        s.combo = 0
        s.misses += 1
        sound.miss()
      }
      snapshot()
    },
    [life, diff.accent, addPopup, snapshot, endGame],
  )

  const handleLockChange = useCallback((isLocked) => {
    lockedRef.current = isLocked
    setLocked(isLocked)
  }, [])

  // Main game loop.
  useEffect(() => {
    let last = performance.now()
    const frame = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const s = g.current
      if (s.ended) return

      // Only advance while the pointer is locked (i.e. actively playing).
      if (lockedRef.current) {
        s.clock += dt
        clockRef.current = s.clock

        if (s.target) {
          if (s.clock - s.target.spawnAtClock >= life) {
            // Target ducked back untouched.
            s.escaped += 1
            s.resolved += 1
            s.combo = 0
            s.target = null
            setTarget(null)
            s.nextSpawnAt = s.clock + SPAWN_GAP
            sound.escape()
          }
        } else if (s.clock >= s.nextSpawnAt && s.resolved < TARGET_COUNT) {
          spawn()
        }

        if (diff.time - s.clock <= 0 || s.resolved >= TARGET_COUNT) {
          snapshot()
          endGame()
          return
        }
        snapshot()
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [life, diff.time, spawn, snapshot, endGame])

  const handleQuit = useCallback(() => {
    g.current.ended = true
    cancelAnimationFrame(rafRef.current)
    if (document.pointerLockElement) document.exitPointerLock()
    onQuit()
  }, [onQuit])

  return (
    <div className="screen game3d">
      <Canvas
        shadows
        camera={{ position: PLAYER_POS, fov: CAMERA_FOV }}
        gl={{ antialias: true }}
        style={{ background: '#bcd9ec' }}
      >
        <color attach="background" args={['#bcd9ec']} />
        <fog attach="fog" args={['#cddfeb', 18, 42]} />
        <GameScene
          target={target}
          exposure={diff.exposure}
          accent={diff.accent}
          sensMult={sensMult}
          clockRef={clockRef}
          onFire={handleFire}
          onLockChange={handleLockChange}
          spotPickerRef={spotPickerRef}
        />
      </Canvas>

      {/* Crosshair */}
      <div className={`crosshair ${locked ? '' : 'idle'}`} style={{ '--accent': diff.accent }}>
        <span className="ch-dot" />
        <span className="ch-line ch-top" />
        <span className="ch-line ch-bottom" />
        <span className="ch-line ch-left" />
        <span className="ch-line ch-right" />
      </div>

      {/* Floating score popups */}
      <div className="popup-layer">
        {popups.map((p) => (
          <span key={p.id} className="score-popup" style={{ color: p.color }}>
            {p.text}
          </span>
        ))}
      </div>

      <Hud
        timeLeft={display.timeLeft}
        totalTime={diff.time}
        score={display.score}
        resolved={display.resolved}
        headshots={display.headshots}
        combo={display.combo}
        accent={diff.accent}
        onQuit={handleQuit}
      />

      {!locked && (
        <div className="lock-overlay" onClick={() => {}}>
          <div className="lock-card">
            <h2>{g.current.clock > 0 ? 'PAUSED' : 'READY'}</h2>
            <p>{g.current.clock > 0 ? 'Click to resume aiming' : 'Click to lock your aim and start'}</p>
            <div className="lock-hints">
              <span>🖱️ Move mouse to look · Left-click to fire</span>
              <span>⎋ Esc releases the mouse</span>
              <span>🎯 Headshots score big — mind the cover</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
