import { BoardTile } from "./types";

export const BOARD_WIDTH = 1000;
export const BOARD_HEIGHT = 580;

const TILE_COLORS = [
  "#ef4444", // Red
  "#eab308", // Yellow
  "#06b6d4", // Cyan/Blue
  "#10b981", // Green
  "#f97316", // Orange
  "#a855f7", // Purple
];

/**
 * 30 Stepping Tiles forming a winding Candy-Land style path across the board
 */
export const BOARD_TILES: BoardTile[] = [
  { index: 0, x: 75, y: 510, color: "#10b981", label: "START", isStart: true },
  { index: 1, x: 120, y: 460, color: TILE_COLORS[0] },
  { index: 2, x: 155, y: 400, color: TILE_COLORS[1] },
  { index: 3, x: 175, y: 335, color: TILE_COLORS[2] },
  { index: 4, x: 165, y: 270, color: TILE_COLORS[3] },
  {
    index: 5,
    x: 135,
    y: 205,
    color: "#f43f5e",
    label: "⚔️ DOJO",
    storeId: "shop-game-1",
  },
  { index: 6, x: 175, y: 145, color: TILE_COLORS[5] },
  { index: 7, x: 235, y: 100, color: TILE_COLORS[0] },
  { index: 8, x: 305, y: 80, color: TILE_COLORS[1] },
  { index: 9, x: 375, y: 80, color: TILE_COLORS[2] },
  { index: 10, x: 440, y: 105, color: TILE_COLORS[3] },
  {
    index: 11,
    x: 495,
    y: 155,
    color: "#06b6d4",
    label: "💎 OUTPOST",
    storeId: "shop-game-2",
  },
  { index: 12, x: 510, y: 220, color: TILE_COLORS[5] },
  { index: 13, x: 485, y: 285, color: TILE_COLORS[0] },
  { index: 14, x: 435, y: 340, color: TILE_COLORS[1] },
  { index: 15, x: 385, y: 395, color: TILE_COLORS[2] },
  { index: 16, x: 360, y: 460, color: TILE_COLORS[3] },
  { index: 17, x: 385, y: 520, color: TILE_COLORS[4] },
  { index: 18, x: 455, y: 545, color: TILE_COLORS[5] },
  { index: 19, x: 535, y: 540, color: TILE_COLORS[0] },
  { index: 20, x: 615, y: 510, color: TILE_COLORS[1] },
  {
    index: 21,
    x: 680,
    y: 455,
    color: "#a855f7",
    label: "⏳ TOWER",
    storeId: "shop-game-3",
  },
  { index: 22, x: 720, y: 390, color: TILE_COLORS[3] },
  { index: 23, x: 715, y: 320, color: TILE_COLORS[4] },
  { index: 24, x: 690, y: 250, color: TILE_COLORS[5] },
  { index: 25, x: 705, y: 180, color: TILE_COLORS[0] },
  {
    index: 26,
    x: 765,
    y: 120,
    color: "#f97316",
    label: "🕹️ PINBALL",
    storeId: "shop-game-4",
  },
  { index: 27, x: 840, y: 105, color: TILE_COLORS[2] },
  { index: 28, x: 905, y: 150, color: TILE_COLORS[3] },
  {
    index: 29,
    x: 925,
    y: 230,
    color: "#10b981",
    label: "🚪 EXIT",
    isExit: true,
  },
];

/**
 * SVG Path definition that creates the smooth winding track under the tiles
 */
export function generateTrackSvgPath(): string {
  if (BOARD_TILES.length === 0) return "";
  let path = `M ${BOARD_TILES[0].x} ${BOARD_TILES[0].y}`;
  for (let i = 1; i < BOARD_TILES.length; i++) {
    const prev = BOARD_TILES[i - 1];
    const curr = BOARD_TILES[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    path += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`;
  }
  const last = BOARD_TILES[BOARD_TILES.length - 1];
  path += ` L ${last.x} ${last.y}`;
  return path;
}
