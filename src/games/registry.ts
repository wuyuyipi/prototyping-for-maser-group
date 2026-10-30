import { GameDefinition } from "./types";
import SuperPixelBrosGame from "./super-pixel-bros/SuperPixelBrosGame";
import TetrisGame from "./tetris/TetrisGame";

/**
 * =======================================================================
 * RETRO ARCADE GAME REGISTRY
 * Only 2 initial games available in the collection:
 * 1. Super Pixel Bros. (Mario-style platformer)
 * 2. Tetris (Classic NES line-clearing puzzle)
 * =======================================================================
 */
export const GAMES_REGISTRY: GameDefinition[] = [
  {
    id: "super-pixel-bros",
    title: "Super Pixel Bros.",
    author: "Arcade Team",
    year: 1985,
    genre: "Platformer",
    description: "Run, jump, punch question blocks, and stomp goombas to reach the flagpole!",
    instructions: "Left/Right or A/D to run, Space or Up to jump, R to restart.",
    labelColor: "#b91c1c", // Classic Mario Red
    accentColor: "#facc15",
    labelBadge: "NES-SM-USA",
    pixelArtIcon: "🍄",
    status: "ready",
    Component: SuperPixelBrosGame,
  },
  {
    id: "tetris",
    title: "Tetris",
    author: "Arcade Team",
    year: 1989,
    genre: "Puzzle",
    description: "Rotate and fit falling tetrominoes to clear rows and score high points!",
    instructions: "Left/Right to move, Up/X to rotate, Down for soft drop, Space for hard drop.",
    labelColor: "#1e3a8a", // Classic Tetris Blue
    accentColor: "#38bdf8",
    labelBadge: "NES-EI-USA",
    pixelArtIcon: "🧱",
    status: "ready",
    Component: TetrisGame,
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAMES_REGISTRY.find((game) => game.id === id);
}

export function getDefaultGame(): GameDefinition {
  return GAMES_REGISTRY[0];
}
