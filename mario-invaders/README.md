# ✈️ Mario Invaders

A 16-bit retro arcade Space Invaders-style shooter featuring a classic Super Mario theme, built entirely with **plain HTML5 Canvas** and **vanilla JavaScript (ES modules)**.

No external libraries, no frameworks, no asset downloads, and zero build step. All pixel art sprites are mathematically rendered from ASCII arrays directly in code, and all sound effects are synthesized dynamically using the Web Audio API.

---

## 🚀 How to Run

Because the project uses standard ES Modules (`import`/`export`), it must be served through a simple local static HTTP server (to prevent browser CORS restrictions on `file://` module imports).

You can run it with any of the following:

### Using Python 3
```bash
cd mario-invaders
python3 -m http.server 8080
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Using Node.js (`npx serve`)
```bash
cd mario-invaders
npx serve -l 8080 .
```

### Using PHP
```bash
cd mario-invaders
php -S localhost:8080
```

---

## 🎮 Controls

| Action | Keyboard Controls | Touch Controls |
| :--- | :--- | :--- |
| **Move Left** | `←` Left Arrow or `A` | `◀` On-screen D-Pad |
| **Move Right** | `→` Right Arrow or `D` | `▶` On-screen D-Pad |
| **Fire Fireball** | `Spacebar` (max 3 on screen) | `FIRE` Action Button |
| **Pause / Resume**| `P` | `⏸` Pause Button |
| **Mute / Unmute** | `M` | - |
| **Start / Restart**| `Spacebar` or `Enter` | `FIRE` Button |

---

## 🕹️ Game Features (Phase 1 Scope)

- **Player**: Mario piloting a small red airplane with animated spinning propellers.
- **Fireballs**: Upward-flying spinning fireballs (max 3 simultaneously on screen).
- **Enemy Fleet**: 5 rows × 8 columns of classic Mario enemies:
  - **Piranha Plants** (Top row, 30 pts each)
  - **Koopa Troopas** (Middle two rows, 20 pts each)
  - **Goombas** (Bottom two rows, 10 pts each)
- **Fleet Dynamics**: Classic Space Invaders stepped motion with speed increasing as enemies are defeated, synchronized with an authentic 4-step chiptune bassline.
- **Random Drops**: Enemies drop bone/spiny projectiles towards the player.
- **Lives & Invincibility**: 3 lives represented by mini airplane icons in the HUD; 2.2 seconds of invincibility blinking upon receiving damage.
- **Game States**: Title screen with enemy points table, active playing, pause overlay (`P`), wave cleared fanfare, and game over screen with in-memory & local high score tracking.
- **Parallax Background**: 4-layer vertical scrolling simulating forward flight (sky gradient, slow clouds, medium rolling hills & Peach's Castle silhouette, and fast edge-floating Question blocks, Brick blocks, and Warp pipes).
- **Visuals**: Pixelated crisp rendering (`imageSmoothingEnabled = false`), responsive 4:3 aspect ratio canvas, and subtle CRT scanlines.

---

## 📁 Project Structure

```
mario-invaders/
├── index.html        # Responsive 4:3 canvas container & touch HUD
├── README.md         # Documentation & quick start guide
├── .gitignore        # Standard ignore rules
└── src/
    ├── main.js       # Game loop (requestAnimationFrame), state machine, HUD
    ├── input.js      # Dual keyboard & touch input management
    ├── sprites.js    # ASCII pixel-art matrices and pre-rendered offscreen canvases
    ├── entities.js   # Player, EnemyFleet, Fireball, Projectile, Particle classes
    ├── background.js # 4-layer parallax scrolling background
    └── audio.js      # Web Audio API 8-bit chiptune sound generator
```

---

## 🛠️ Engineering Details

- **Centralized Constants**: All speeds, cooldowns, bounds, and point values are defined in `CONSTANTS` inside `src/entities.js`.
- **Pure Canvas Pixel Art**: Sprites are rendered onto offscreen canvases at startup and blitted via `ctx.drawImage` for optimal performance.
- **Sound Synthesis**: Uses square and triangle oscillators with exponential ramps, plus lowpass-filtered white noise bursts for 8-bit explosions.
