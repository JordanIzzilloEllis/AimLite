// Central game configuration.
// The default game mode: hit a set number of targets before the clock runs out.

export const TARGET_COUNT = 20

// Difficulty is primarily the countdown length. Harder difficulties also shrink
// the targets a little so there's a real skill gradient, not just less time.
export const DIFFICULTIES = {
  easy: { key: 'easy', label: 'Easy', time: 40, targetSize: 74, accent: '#22ffa7' },
  medium: { key: 'medium', label: 'Medium', time: 30, targetSize: 58, accent: '#22d3ff' },
  hard: { key: 'hard', label: 'Hard', time: 20, targetSize: 46, accent: '#ff3ea5' },
}

export const DEFAULT_DIFFICULTY = 'medium'
