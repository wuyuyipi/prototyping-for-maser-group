import { GameDefinition } from "./types";
import SuperPixelBrosGame from "./super-pixel-bros/SuperPixelBrosGame";
import TetrisGame from "./tetris/TetrisGame";
import FruitNinjaGame from "./fruit-ninja/FruitNinjaGame";

/**
 * =======================================================================
 * RETRO ARCADE GAME REGISTRY
 * 1. Pixel Fruit Ninja (Unlocked by default - play to earn points!)
 * 2. Justin's Adventure (Requires 300 PTS to unlock)
 * 3. Tetris (Requires 500 PTS to unlock)
 * =======================================================================
 */
export const GAMES_REGISTRY: GameDefinition[] = [
  {
    id: "fruit-ninja",
    title: "Pixel Fruit Ninja",
    author: "Retro Arcade",
    year: 1987,
    genre: "Dojo Slasher",
    description:
      "Slash flying pixel watermelons & golden peaches with your katana, rack up combos, and dodge bombs!",
    instructions:
      "Swipe mouse across the CRT screen to slash fruits. Avoid bombs! R to restart.",
    cartridgeColor: "#14532d",
    labelColor: "#15803d",
    accentColor: "#ef4444",
    labelBadge: "NES-FN-USA",
    pixelArtIcon: "🍉",
    status: "ready",
    price: 0,
    initiallyUnlocked: true,
    Component: FruitNinjaGame,
  },
  {
    id: "super-pixel-bros",
    title: "Justin's Adventure",
    author: "Retro Arcade",
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
    price: 300,
    initiallyUnlocked: false,
    Component: SuperPixelBrosGame,
  },
  {
    id: "tetris",
    title: "Tetris",
    author: "Retro Arcade",
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
    price: 500,
    initiallyUnlocked: false,
    Component: TetrisGame,
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAMES_REGISTRY.find((game) => game.id === id);
}

export function getDefaultGame(): GameDefinition {
  return GAMES_REGISTRY[0];
}
