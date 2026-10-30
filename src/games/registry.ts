import { GameDefinition } from "./types";
import SuperPixelBrosGame from "./super-pixel-bros/SuperPixelBrosGame";
import TetrisGame from "./tetris/TetrisGame";
import FruitNinjaGame from "./fruit-ninja/FruitNinjaGame";

/**
 * =======================================================================
 * RETRO ARCADE GAME REGISTRY
 * 1. Super Pixel Bros. (Unlocked by default)
 * 2. Tetris (Unlocked by default)
 * 3. Pixel Fruit Ninja (Available to buy from the Game Shop for 300 PTS)
 * =======================================================================
 */
export const GAMES_REGISTRY: GameDefinition[] = [
  {
    id: "super-pixel-bros",
    title: "Super Pixel Bros.",
    author: "Arcade Team",
    year: 1985,
    genre: "Platformer",
    description:
      "Control Justin! Headbutt question blocks, stomp Goomba mushrooms, climb the stairs, and reach the flagpole!",
    instructions:
      "Left/Right or A/D to run, Space or Up to jump, R to restart.",
    cartridgeColor: "#991b1b",
    labelColor: "#b91c1c",
    accentColor: "#facc15",
    labelBadge: "NES-SM-USA",
    pixelArtIcon: "🍄",
    status: "ready",
    price: 0,
    initiallyUnlocked: true,
    Component: SuperPixelBrosGame,
  },
  {
    id: "tetris",
    title: "Tetris",
    author: "Arcade Team",
    year: 1989,
    genre: "Block Puzzle",
    description:
      "Fast-paced NES block puzzle! Rotate falling tetrominoes and slam them down to clear lines!",
    instructions:
      "Left/Right to move, Up/X to rotate, Down or Space to slam straight to the bottom!",
    cartridgeColor: "#1e3a8a",
    labelColor: "#1d4ed8",
    accentColor: "#38bdf8",
    labelBadge: "NES-EI-USA",
    pixelArtIcon: "🧱",
    status: "ready",
    price: 0,
    initiallyUnlocked: true,
    Component: TetrisGame,
  },
  {
    id: "fruit-ninja",
    title: "Pixel Fruit Ninja",
    author: "Mingtai",
    year: 1987,
    genre: "Dojo Slasher",
    description:
      "Slash flying pixel watermelons & golden peaches with your katana, rack up combos, and dodge bombs!",
    instructions:
      "Swipe mouse across the CRT screen (or press Space) to slash fruits. Avoid bombs! R to restart.",
    cartridgeColor: "#14532d",
    labelColor: "#15803d",
    accentColor: "#ef4444",
    labelBadge: "NES-FN-USA",
    pixelArtIcon: "🍉",
    status: "ready",
    price: 300,
    initiallyUnlocked: false,
    Component: FruitNinjaGame,
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAMES_REGISTRY.find((game) => game.id === id);
}

export function getDefaultGame(): GameDefinition {
  return GAMES_REGISTRY[0];
}
