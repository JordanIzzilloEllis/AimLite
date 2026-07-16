// Central game configuration for the CS-style 3D aim trainer.
// Default mode: peek-and-hide — targets pop out from behind cover; you flick
// onto them and fire before they duck back. Hit 20 before the clock runs out.

export const TARGET_COUNT = 20

// Scoring
export const BODY_POINTS = 100
export const HEAD_POINTS = 250
// Each consecutive hit adds 10% up to a cap, rewarding streaks.
export const COMBO_STEP = 0.1
export const COMBO_MAX_MULT = 2.5

// Peek animation timing (seconds).
export const RISE_TIME = 0.16 // sliding out from cover
export const HIDE_TIME = 0.16 // ducking back
export const SPAWN_GAP = 0.28 // pause between one target resolving and the next

// Difficulty sets the countdown length and how long a target stays exposed.
export const DIFFICULTIES = {
  easy: { key: 'easy', label: 'Easy', time: 45, exposure: 1.5, accent: '#22ffa7' },
  medium: { key: 'medium', label: 'Medium', time: 35, exposure: 1.05, accent: '#22d3ff' },
  hard: { key: 'hard', label: 'Hard', time: 25, exposure: 0.75, accent: '#ff3ea5' },
}

export const DEFAULT_DIFFICULTY = 'medium'

// Mouse-look sensitivity. The slider picks a multiplier; this is the base
// radians-per-pixel applied to raw mouse movement.
export const BASE_SENSITIVITY = 0.0022
export const DEFAULT_SENS_MULT = 1.0
export const SENS_MIN = 0.3
export const SENS_MAX = 2.5

// Camera / player
export const PLAYER_POS = [0, 1.65, 8.5]
export const CAMERA_FOV = 75
export const MAX_YAW = 1.15 // ~66° left/right
export const MAX_PITCH = 0.6 // ~34° up/down

// Peek distance a target slides out sideways from behind its cover.
export const PEEK_DISTANCE = 1.05

// Cover spots: each is a corner/pillar a target peeks around.
// pos = [x, z] of the cover; side = which way (+1 right / -1 left) it peeks.
export const COVER_SPOTS = [
  { pos: [-6, -2], side: 1 },
  { pos: [-3.2, -5], side: -1 },
  { pos: [0, -7.5], side: 1 },
  { pos: [3.2, -4.5], side: -1 },
  { pos: [6, -1.5], side: -1 },
  { pos: [-5, -6.5], side: 1 },
  { pos: [1.8, -8.5], side: 1 },
  { pos: [5, -7], side: -1 },
  { pos: [-1.5, -3.5], side: -1 },
  { pos: [4.2, -2], side: 1 },
]

// Free-standing crates (pure obstacles that can block your shots).
// [x, y, z, size]
export const CRATES = [
  [-2.2, 0.6, 0.5, 1.2],
  [2.6, 0.55, -1.5, 1.1],
  [-4.6, 0.5, -3.2, 1.0],
  [3.8, 0.7, -3.5, 1.4],
  [0.4, 0.5, -2.2, 1.0],
  [-0.5, 1.5, -2.2, 0.9], // stacked
]
