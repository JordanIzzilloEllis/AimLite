import { useCallback, useEffect, useRef, useState } from 'react'
import Target from './Target.jsx'
import Burst from './Burst.jsx'
import Hud from './Hud.jsx'
import { DIFFICULTIES, TARGET_COUNT } from '../config.js'
import { sound } from '../sound.js'

// Padding so targets never spawn under the HUD or clipped at the edges.
const EDGE_PAD = 16
const HUD_HEIGHT = 96

function randomTarget(field, size) {
  const maxX = Math.max(EDGE_PAD, field.width - size - EDGE_PAD)
  const maxY = Math.max(HUD_HEIGHT, field.height - size - EDGE_PAD)
  const minX = EDGE_PAD
  const minY = HUD_HEIGHT
  const x = minX + Math.random() * Math.max(1, maxX - minX)
  const y = minY + Math.random() * Math.max(1, maxY - minY)
  return { x, y, size, id: Math.random().toString(36).slice(2) }
}

export default function Game({ difficulty, onEnd, onQuit }) {
  const diff = DIFFICULTIES[difficulty]
  const fieldRef = useRef(null)

  const [timeLeft, setTimeLeft] = useState(diff.time)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [target, setTarget] = useState(null)
  const [bursts, setBursts] = useState([])

  // Refs mirror the values the rAF/finish callbacks need without stale closures.
  const statsRef = useRef({ hits: 0, misses: 0, bestCombo: 0 })
  const finishedRef = useRef(false)
  const rafRef = useRef(0)
  const lastTickRef = useRef(diff.time)

  const spawnTarget = useCallback(() => {
    const field = fieldRef.current
    if (!field) return
    const rect = field.getBoundingClientRect()
    setTarget(randomTarget({ width: rect.width, height: rect.height }, diff.targetSize))
  }, [diff.targetSize])

  const finish = useCallback(
    (completed) => {
      if (finishedRef.current) return
      finishedRef.current = true
      cancelAnimationFrame(rafRef.current)
      const { hits: h, misses: m, bestCombo: bc } = statsRef.current
      const shots = h + m
      onEnd({
        difficulty,
        completed,
        hits: h,
        misses: m,
        bestCombo: bc,
        accuracy: shots > 0 ? h / shots : 0,
        timeUsed: +(diff.time - Math.max(0, lastTickRef.current)).toFixed(1),
        totalTime: diff.time,
      })
    },
    [difficulty, diff.time, onEnd],
  )

  // Countdown timer driven by requestAnimationFrame for a smooth clock.
  useEffect(() => {
    const start = performance.now()
    const durationMs = diff.time * 1000
    let lastTickSecond = Math.ceil(diff.time)

    const loop = (now) => {
      const remaining = Math.max(0, durationMs - (now - start))
      const secs = remaining / 1000
      lastTickRef.current = secs
      setTimeLeft(secs)

      // Audible tick for the final 3 seconds.
      const wholeSec = Math.ceil(secs)
      if (wholeSec !== lastTickSecond) {
        lastTickSecond = wholeSec
        if (wholeSec <= 3 && wholeSec > 0) sound.countdownTick()
      }

      if (remaining <= 0) {
        finish(false)
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [diff.time, finish])

  // First target appears once the field has a measured size.
  useEffect(() => {
    spawnTarget()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addBurst = useCallback((x, y) => {
    const id = Math.random().toString(36).slice(2)
    setBursts((b) => [...b, { id, x, y, color: diff.accent }])
    // Auto-remove after the animation finishes.
    setTimeout(() => {
      setBursts((b) => b.filter((it) => it.id !== id))
    }, 650)
  }, [diff.accent])

  const handleHit = useCallback(
    (t, clientX, clientY) => {
      if (finishedRef.current) return
      const field = fieldRef.current
      const rect = field.getBoundingClientRect()
      addBurst(clientX - rect.left, clientY - rect.top)

      const newCombo = combo + 1
      statsRef.current.hits += 1
      statsRef.current.bestCombo = Math.max(statsRef.current.bestCombo, newCombo)
      sound.hit(newCombo)

      const newHits = statsRef.current.hits
      setHits(newHits)
      setCombo(newCombo)
      setBestCombo(statsRef.current.bestCombo)

      if (newHits >= TARGET_COUNT) {
        setTarget(null)
        finish(true)
      } else {
        spawnTarget()
      }
    },
    [combo, addBurst, spawnTarget, finish],
  )

  // A pointer-down anywhere on the field that isn't a target counts as a miss.
  const handleFieldMiss = useCallback(() => {
    if (finishedRef.current) return
    statsRef.current.misses += 1
    setMisses(statsRef.current.misses)
    setCombo(0)
    sound.miss()
  }, [])

  return (
    <div className="screen game" ref={fieldRef} onPointerDown={handleFieldMiss}>
      <Hud
        timeLeft={timeLeft}
        totalTime={diff.time}
        hits={hits}
        misses={misses}
        combo={combo}
        accent={diff.accent}
        onQuit={onQuit}
      />

      {bursts.map((b) => (
        <Burst key={b.id} x={b.x} y={b.y} color={b.color} />
      ))}

      {target && (
        <Target
          key={target.id}
          data={target}
          accent={diff.accent}
          onHit={(cx, cy) => handleHit(target, cx, cy)}
        />
      )}
    </div>
  )
}
