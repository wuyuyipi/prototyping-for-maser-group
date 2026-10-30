import { ShopItem } from "./types";

/**
 * SHOP CATALOG
 * Directly integrated with the Retro Arcade games!
 */
export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  {
    id: "super-pixel-bros",
    title: "Super Pixel Bros.",
    genre: "Platformer",
    description:
      "Control Justin! Headbutt question blocks, stomp Goomba mushrooms, climb the stairs, and reach the flagpole!",
    price: 300,
    author: "Arcade Team",
    labelColor: "#b91c1c",
    labelBadge: "NES-SM-USA",
    isUnlocked: false,
    storeName: "Super Pixel Bros.",
    storeSubtitle: "Platformer",
    clerkName: "Justin",
    clerkGreeting: "Let's-a-go! Ready for mushroom stomping and flagpole sliding?",
    accentColor: "#ef4444",
    landmarkTileIndex: 5,
  },
  {
    id: "tetris",
    title: "Tetris",
    genre: "Block Puzzle",
    description:
      "Fast-paced NES block puzzle! Rotate falling tetrominoes and slam them down to clear lines!",
    price: 500,
    author: "Arcade Team",
    labelColor: "#1d4ed8",
    labelBadge: "NES-EI-USA",
    isUnlocked: false,
    storeName: "Tetris",
    storeSubtitle: "Block Puzzle",
    clerkName: "Alexey",
    clerkGreeting: "Lines falling, minds spinning! Can you survive the tetromino rush?",
    accentColor: "#38bdf8",
    landmarkTileIndex: 11,
  },
  {
    id: "fruit-ninja",
    title: "Pixel Fruit Ninja",
    genre: "Dojo Slasher",
    description:
      "Slash flying pixel watermelons & golden peaches with your katana, rack up combos, and dodge bombs!",
    price: 0,
    author: "Mingtai",
    labelColor: "#15803d",
    labelBadge: "NES-FN-USA",
    isUnlocked: true,
    storeName: "Pixel Fruit Ninja",
    storeSubtitle: "Dojo Slasher",
    clerkName: "Sensei",
    clerkGreeting: "Slice with precision, grasshopper! Avoid the bombs!",
    accentColor: "#22c55e",
    landmarkTileIndex: 21,
  },
  {
    id: "pixel-pinball-88",
    title: "Pixel Pinball 88",
    genre: "Arcade Tables",
    description: "Multiball madness on 3 retro pixelated pinball tables.",
    price: 1200,
    author: "Arcade Team",
    labelColor: "#ea580c",
    labelBadge: "NES-PP-USA",
    isUnlocked: false,
    storeName: "Pixel Pinball 88",
    storeSubtitle: "Arcade Tables",
    clerkName: "Flipper Frankie",
    clerkGreeting: "Three tables, multiball frenzy, and pure 1988 retro arcade bliss!",
    accentColor: "#f97316",
    landmarkTileIndex: 26,
  },
];
