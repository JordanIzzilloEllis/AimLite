import { useCallback, useEffect, useState } from 'react'
import Menu from './components/Menu.jsx'
import Game from './components/Game.jsx'
import GameOver from './components/GameOver.jsx'
import { DEFAULT_DIFFICULTY } from './config.js'
import { sound } from './sound.js'
import './App.css'

const HIGH_SCORE_KEY = 'webaim.highscores'

function loadHighScores() {
  try {
    return JSON.parse(localStorage.getItem(HIGH_SCORE_KEY)) || {}
  } catch {
    return {}
  }
}

export default function App() {
  // 'menu' | 'playing' | 'over'
  const [screen, setScreen] = useState('menu')
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY)
  const [muted, setMuted] = useState(false)
  const [results, setResults] = useState(null)
  const [highScores, setHighScores] = useState(loadHighScores)

  useEffect(() => {
    sound.setEnabled(!muted)
  }, [muted])

  const startGame = useCallback((diffKey) => {
    sound.init()
    sound.start()
    setDifficulty(diffKey)
    setResults(null)
    setScreen('playing')
  }, [])

  const endGame = useCallback(
    (finalResults) => {
      sound.gameOver(finalResults.completed)
      setResults(finalResults)
      setScreen('over')

      // Persist a per-difficulty best score (targets hit, tie-broken by accuracy).
      setHighScores((prev) => {
        const best = prev[finalResults.difficulty]
        const isBetter =
          !best ||
          finalResults.hits > best.hits ||
          (finalResults.hits === best.hits && finalResults.accuracy > best.accuracy)
        if (!isBetter) return prev
        const next = { ...prev, [finalResults.difficulty]: finalResults }
        try {
          localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(next))
        } catch {
          /* ignore storage errors */
        }
        return next
      })
    },
    [],
  )

  const goToMenu = useCallback(() => setScreen('menu'), [])
  const playAgain = useCallback(() => startGame(difficulty), [difficulty, startGame])
  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  return (
    <div className="app">
      <button
        className="mute-btn"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {screen === 'menu' && (
        <Menu onStart={startGame} highScores={highScores} />
      )}

      {screen === 'playing' && (
        <Game difficulty={difficulty} onEnd={endGame} onQuit={goToMenu} />
      )}

      {screen === 'over' && results && (
        <GameOver
          results={results}
          highScore={highScores[results.difficulty]}
          onPlayAgain={playAgain}
          onMenu={goToMenu}
        />
      )}
    </div>
  )
}
