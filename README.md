# AimLite 🎯

A lightweight **Counter-Strike-style 3D aim trainer** in the browser, built with
React + Vite + Three.js. Lock your aim, flick onto humanoid targets peeking from
behind cover, and go for the headshots before the clock runs out.

**▶️ Play it: https://jordanizzilloellis.github.io/AimLite/**

## Game mode

**Peek & Hide** (default): humanoid targets pop out from behind pillars and
corners, hold for a short exposure window, then duck back. Tag **20 targets**
before the countdown reaches zero.

| Difficulty | Time | Exposure window |
| ---------- | ---- | --------------- |
| Easy       | 45s  | 1.50s           |
| Medium     | 35s  | 1.05s           |
| Hard       | 25s  | 0.75s           |

Features:

- 🖱️ **FPS mouse-look** with pointer lock and a fixed center crosshair (aim_botz feel)
- 🧍 **Humanoid targets** with a real **head hitbox** — headshots score 2.5× a body shot
- 📦 **3D cover**: crates, pillars, and corners physically block your shots (raycast occlusion)
- 🫣 **Peek-and-hide AI**: targets expose briefly then retreat — miss the window and they escape
- 🔊 Synthesized gunshots, combo-scaling body pops, and a bright headshot "ding"
- 🎚️ Adjustable **mouse sensitivity**
- 📊 Live HUD: score, targets, headshots, combo, countdown bar
- 🏆 Per-difficulty best scores saved in your browser
- 🎖️ End-of-run grade (S / A / B / C / D) with headshot % and accuracy

## Controls

- **Click** the scene to lock your aim and start (also resumes after a pause)
- **Move the mouse** to look around · **Left-click** to fire
- **Esc** releases the mouse (pauses the round)

## Getting started

Requires [Node.js](https://nodejs.org/) (this project is pinned to Vite 4 /
React 18 so it runs on Node 16+).

```bash
npm install      # install dependencies
npm run dev      # start the dev server (opens the browser)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Deployment

Every push to `main` is built and published to **GitHub Pages** by the workflow
in [.github/workflows/deploy.yml](.github/workflows/deploy.yml). The production
build uses a `/AimLite/` base path (see [vite.config.js](vite.config.js)) to
match the Pages subpath — keep that in sync if the repo is ever renamed.

## Project structure

```
src/
  main.jsx           # React entry point
  App.jsx            # top-level screen state machine (menu / playing / over)
  config.js          # difficulty, scoring, cover layout, camera settings
  sound.js           # synthesized Web Audio sound engine
  index.css          # global reset + neon theme
  App.css            # component + HUD + crosshair styles
  components/
    Menu.jsx         # start screen: difficulty + sensitivity
    Game3D.jsx       # game loop, scoring, HUD overlay, crosshair, Canvas
    Hud.jsx          # in-game heads-up display
    GameOver.jsx     # results + grade screen
  three/
    GameScene.jsx    # first-person controls (pointer lock) + fire raycast
    Environment.jsx  # arena: floor, walls, cover pillars, crates
    Target3D.jsx     # peek-and-hide animation wrapper
    Humanoid.jsx     # low-poly figure with head/body hitboxes
```

## Roadmap ideas

- More modes (endless, precision/one-tap, spray control, moving targets)
- Strafing targets that peek *and* reposition
- Global/online leaderboards
- Loadout of crosshair styles, recoil, and reload feel
