# Retro Arcade - Teammate Collaboration Guide 🕹️

Welcome team! This repository is configured so each team member can build and test their own retro arcade game on an isolated Git branch without stepping on each other's toes or causing merge conflicts.

---

## 📁 Shared Foundation Architecture

Here is where each shared piece lives:

| Component / File | Purpose | What It Does |
| :--- | :--- | :--- |
| **`src/app/page.tsx`** | Main Arcade Stage | Arranges the CRT monitor on top and the NES + Cartridge pile on the desk surface below. |
| **`src/components/CrtMonitor.tsx`** | Retro CRT Display | Takes up the upper portion of the screen. Features CRT curvature, scanlines toggle, power LED, and mounts the active game. |
| **`src/components/NesConsole.tsx`** | NES Console | Located at the bottom left. Has an interactive cartridge door, Power/Reset buttons, and controller ports. Clicking the door opens the game switcher. |
| **`src/components/CartridgePile.tsx`** | Cartridge Stack | Stacked beside the NES. Shows all owned cartridges by spine. Clicking any cartridge immediately loads it into the NES. |
| **`src/components/CartridgeModal.tsx`** | Front-Facing Switcher | Modal dialog triggered by clicking the NES cartridge chamber. Shows all owned games front-facing. |
| **`src/components/CartridgeItem.tsx`** | NES Cartridge | Pixel art NES cartridge component supporting both spine and front box-art views. |
| **`src/games/registry.ts`** | Central Game Registry | The single array where all games are plugged into the system. |
| **`src/games/types.ts`** | Game Types | Standard TypeScript interface (`GameDefinition`, `GameMetadata`, `GameComponentProps`). |
| **`src/games/placeholder-template/`** | Game Starter Template | Cloneable starter component (`GameTemplate.tsx`) to build your game. |
| **`src/components/shop/`** | Game Shop Feature | Dedicated folder (`ShopModal.tsx`, `shopCatalog.ts`, `types.ts`) for the collaborator building the game purchase system. |

---

## 🏪 Shop Feature Development (For Shop Collaborator)

The shop button on the main screen opens the shelf modal where players spend points to buy new cartridges.
- **Shop Files**: [`src/components/shop/`](file:///Users/yipin/Desktop/SVA%20School%20Work/Fall%202026/Prototyping%20for%20Master/prototyping-for-maser-arcade/src/components/shop/)
- **Catalog**: Edit available cartridges and prices in [`src/components/shop/shopCatalog.ts`](file:///Users/yipin/Desktop/SVA%20School%20Work/Fall%202026/Prototyping%20for%20Master/prototyping-for-maser-arcade/src/components/shop/shopCatalog.ts).
- **Branch**: Create branch `feat/shop-feature` to keep your work isolated.
- **Props**: `ShopModal` receives `playerPoints`, `onPurchaseGame`, and `onClose`. Add your custom shelf layout, filter tags, or point rewarding logic here.

---

## 🌿 GitHub Branching Workflow

Follow this workflow whenever building or updating your game:

### 1. Create a Feature Branch
Always branch off `main`:
```bash
git checkout main
git pull origin main
git checkout -b feat/game-<your-game-name>
# Example: git checkout -b feat/game-tank-battle
```

### 2. Add Your Game in Its Own Folder
Keep all your game code inside an isolated folder:
```
src/games/<your-game-name>/
├── <YourGameComponent>.tsx
└── ... (any helper logic, sprites, or components)
```
> 💡 **Tip**: You can copy `src/games/placeholder-template/GameTemplate.tsx` into your folder as a starting point.

### 3. Register Your Game
Open `src/games/registry.ts` and add your game to `GAMES_REGISTRY`:
```typescript
import TankBattleGame from "./tank-battle/TankBattleGame";

export const GAMES_REGISTRY: GameDefinition[] = [
  // ... existing games
  {
    id: "tank-battle",
    title: "Tank Battle 1985",
    author: "Your Name",
    year: 1985,
    genre: "Action / Strategy",
    description: "Defend your base from enemy tanks in a destructible maze.",
    instructions: "WASD to move, Space to fire cannon.",
    labelColor: "#065f46",
    accentColor: "#34d399",
    labelBadge: "NES-TB-USA",
    pixelArtIcon: "🛡️",
    status: "in-development",
    Component: TankBattleGame,
  },
];
```

### 4. Test Locally & Commit
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your cartridge appear in the stack and load onto the CRT!

Commit only your folder and `registry.ts`:
```bash
git add src/games/<your-game-name>/ src/games/registry.ts
git commit -m "feat: add Tank Battle game prototype"
git push origin feat/game-<your-game-name>
```

### 5. Open a Pull Request
Open a PR to `main`. Because your game is contained in its own folder under `src/games/`, merges will be clean and conflict-free!

---

## 🎮 Game Component Specifications
Your game component receives these standard props:
```typescript
interface GameComponentProps {
  onExit?: () => void;   // Callback if your game provides an in-game quit/eject button
  isMuted?: boolean;      // Arcade sound state
}
```
- **Display Target**: The CRT container maintains a retro 4:3 aspect ratio.
- **Styling**: Tailwind CSS and `.font-pixel` are available globally.
- **Rendering**: You can build with React state, HTML5 `<canvas>`, or embed any 2D canvas/library.
