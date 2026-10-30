import { GameDefinition } from "./types";
import SpaceDefenderPlaceholder from "./game-1/SpaceDefenderPlaceholder";
import DungeonQuestPlaceholder from "./game-2/DungeonQuestPlaceholder";
import TurboRacerPlaceholder from "./game-3/TurboRacerPlaceholder";
import PixelPlatformerPlaceholder from "./game-4/PixelPlatformerPlaceholder";

/**
 * =======================================================================
 * RETRO ARCADE GAME REGISTRY
 * =======================================================================
 * TEAMMATES: To register your game:
 * 1. Build your game component in `src/games/<your-game-name>/`
 * 2. Import it here
 * 3. Add an entry to the `GAMES_REGISTRY` array below
 * 
 * Each game will automatically:
 * - Appear as a cartridge in the desk stack
 * - Be available in the front-facing NES cartridge selector
 * - Load inside the retro CRT monitor when inserted!
 * =======================================================================
 */
export const GAMES_REGISTRY: GameDefinition[] = [
  {
    id: "space-defender",
    title: "Space Defender",
    author: "Teammate 1",
    year: 1985,
    genre: "Space Shooter",
    description: "Defend deep space from waves of 8-bit alien invaders.",
    instructions: "Arrows to navigate, Space to shoot lasers.",
    labelColor: "#1e3a8a", // Deep retro blue
    accentColor: "#38bdf8",
    labelBadge: "NES-SD-USA",
    pixelArtIcon: "🚀",
    status: "placeholder",
    Component: SpaceDefenderPlaceholder,
  },
  {
    id: "dungeon-quest",
    title: "Dungeon Quest",
    author: "Teammate 2",
    year: 1987,
    genre: "RPG / Adventure",
    description: "Explore dark labyrinths and conquer ancient dragons.",
    instructions: "D-pad to move, A to attack, B to use magic.",
    labelColor: "#78350f", // Earthy dungeon brown/gold
    accentColor: "#fbbf24",
    labelBadge: "NES-DQ-USA",
    pixelArtIcon: "🗡️",
    status: "placeholder",
    Component: DungeonQuestPlaceholder,
  },
  {
    id: "turbo-racer",
    title: "Turbo Racer '86",
    author: "Teammate 3",
    year: 1986,
    genre: "Arcade Racing",
    description: "Outspeed traffic and drift across neon highway turns.",
    instructions: "Left/Right to steer, Up for Nitro boost.",
    labelColor: "#9a3412", // Retro red-orange
    accentColor: "#f97316",
    labelBadge: "NES-TR-USA",
    pixelArtIcon: "🏎️",
    status: "placeholder",
    Component: TurboRacerPlaceholder,
  },
  {
    id: "pixel-platformer",
    title: "Pixel Hero",
    author: "Teammate 4",
    year: 1988,
    genre: "Platformer",
    description: "Leap over spikes and stomp obstacles across pixel worlds.",
    instructions: "Arrows to run, Space to jump, Z to sprint.",
    labelColor: "#14532d", // Vintage forest green
    accentColor: "#4ade80",
    labelBadge: "NES-PH-USA",
    pixelArtIcon: "🍄",
    status: "placeholder",
    Component: PixelPlatformerPlaceholder,
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAMES_REGISTRY.find((game) => game.id === id);
}

export function getDefaultGame(): GameDefinition {
  return GAMES_REGISTRY[0];
}
