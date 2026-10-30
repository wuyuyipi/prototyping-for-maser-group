import { GameDefinition } from "./types";
import SpaceDefenderPlaceholder from "./game-1/SpaceDefenderPlaceholder";
import DungeonQuestPlaceholder from "./game-2/DungeonQuestPlaceholder";
import TurboRacerPlaceholder from "./game-3/TurboRacerPlaceholder";
import PixelPlatformerPlaceholder from "./game-4/PixelPlatformerPlaceholder";

/**
 * RETRO ARCADE GAME REGISTRY
 * Each teammate builds their game in their own folder under `src/games/`
 * and registers their game definition here.
 */
export const GAMES_REGISTRY: GameDefinition[] = [
  {
    id: "game-1",
    title: "Game 1 (Slot 1)",
    author: "Teammate 1",
    year: 1985,
    genre: "Retro Action",
    description: "Reserved space for Teammate 1's retro game.",
    instructions: "Pending implementation.",
    labelColor: "#1e3a8a", // Blue cartridge label
    accentColor: "#38bdf8",
    labelBadge: "NES-01-USA",
    pixelArtIcon: "🕹️",
    status: "placeholder",
    Component: SpaceDefenderPlaceholder,
  },
  {
    id: "game-2",
    title: "Game 2 (Slot 2)",
    author: "Teammate 2",
    year: 1986,
    genre: "Adventure",
    description: "Reserved space for Teammate 2's retro game.",
    instructions: "Pending implementation.",
    labelColor: "#78350f", // Amber/Gold cartridge label
    accentColor: "#fbbf24",
    labelBadge: "NES-02-USA",
    pixelArtIcon: "🗡️",
    status: "placeholder",
    Component: DungeonQuestPlaceholder,
  },
  {
    id: "game-3",
    title: "Game 3 (Slot 3)",
    author: "Teammate 3",
    year: 1987,
    genre: "Arcade Racing",
    description: "Reserved space for Teammate 3's retro game.",
    instructions: "Pending implementation.",
    labelColor: "#9a3412", // Orange cartridge label
    accentColor: "#f97316",
    labelBadge: "NES-03-USA",
    pixelArtIcon: "🏎️",
    status: "placeholder",
    Component: TurboRacerPlaceholder,
  },
  {
    id: "game-4",
    title: "Game 4 (Slot 4)",
    author: "Teammate 4",
    year: 1988,
    genre: "Platformer",
    description: "Reserved space for Teammate 4's retro game.",
    instructions: "Pending implementation.",
    labelColor: "#14532d", // Forest Green cartridge label
    accentColor: "#4ade80",
    labelBadge: "NES-04-USA",
    pixelArtIcon: "🍄",
    status: "placeholder",
    Component: PixelPlatformerPlaceholder,
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAMES_REGISTRY.find((game) => game.id === id);
}
