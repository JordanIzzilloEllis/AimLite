# WebAim 🎯

A gamified browser **aim trainer** built with React + Vite. Click glowing neon
targets as fast as you can before the clock runs out.

## Game mode

**Time Attack** (default): hit **20 targets** before the countdown reaches zero.
Choose your difficulty:

| Difficulty | Time | Target size |
| ---------- | ---- | ----------- |
| Easy       | 40s  | Large       |
| Medium     | 30s  | Medium      |
| Hard       | 20s  | Small       |

Features:

- 🔊 Synthesized "hit" sounds (Web Audio API) that rise in pitch with your combo
- 💥 Particle bursts and screen juice on every hit
- 📊 Live HUD: score, accuracy, combo, and a countdown bar
- 🏆 Per-difficulty best scores saved in your browser
- 🎖️ End-of-run grade (S / A / B / C / D)

## Getting started

Requires [Node.js](https://nodejs.org/) (this project is pinned to Vite 4 /
React 18 so it runs on Node 16+).

```bash
npm install      # install dependencies
npm run dev      # start the dev server (opens the browser)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
  main.jsx           # React entry point
  App.jsx            # top-level screen state machine (menu / playing / over)
  config.js          # difficulty + target-count settings
  sound.js           # synthesized Web Audio sound engine
  index.css          # global reset + neon theme
  App.css            # component styles
  components/
    Menu.jsx         # start screen + difficulty picker
    Game.jsx         # playfield, spawning, timer, scoring
    Target.jsx       # a single clickable target
    Burst.jsx        # hit particle effect
    Hud.jsx          # in-game heads-up display
    GameOver.jsx     # results + grade screen
```

## Roadmap ideas

- Additional modes (endless, precision, moving targets)
- Global/online leaderboards
- Sensitivity + crosshair customization
