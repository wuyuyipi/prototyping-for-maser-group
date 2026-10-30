import { ShopItem } from "./types";

/**
 * SHOP CATALOG
 * Collaborator: Add or modify available shop games and prices here.
 */
export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  {
    id: "shop-game-1",
    title: "Cyber Samurai",
    genre: "Slash & Run",
    description: "Battle through neon Tokyo rooftops with your energy katana.",
    price: 300,
    author: "Future Collaborator",
    labelColor: "#be185d",
    pixelArtIcon: "⚔️",
    labelBadge: "NES-CS-USA",
    isUnlocked: false,
  },
  {
    id: "shop-game-2",
    title: "Galactic Mining",
    genre: "Puzzle Strategy",
    description: "Excavate rare space crystals while avoiding asteroid collapses.",
    price: 500,
    author: "Future Collaborator",
    labelColor: "#0284c7",
    pixelArtIcon: "💎",
    labelBadge: "NES-GM-USA",
    isUnlocked: false,
  },
  {
    id: "shop-game-3",
    title: "Chrono Wizard",
    genre: "Time Travel RPG",
    description: "Manipulate timeline clocks to cast ancient 8-bit spells.",
    price: 850,
    author: "Future Collaborator",
    labelColor: "#7c3aed",
    pixelArtIcon: "⏳",
    labelBadge: "NES-CW-USA",
    isUnlocked: false,
  },
  {
    id: "shop-game-4",
    title: "Pixel Pinball 88",
    genre: "Arcade Tables",
    description: "Multiball madness on 3 retro pixelated pinball tables.",
    price: 1200,
    author: "Future Collaborator",
    labelColor: "#ea580c",
    pixelArtIcon: "🕹️",
    labelBadge: "NES-PP-USA",
    isUnlocked: false,
  },
];
