import { ShopItem } from "./types";

/**
 * SHOP CATALOG
 * Directly integrated with the Retro Arcade games!
 */
export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  {
    id: "fruit-ninja",
    title: "Pixel Fruit Ninja",
    genre: "Dojo Slasher",
    description:
      "Slash flying pixel watermelons & golden peaches with your katana! Dodge bombs & rack up combos!",
    price: 300,
    author: "Retro Arcade",
    labelColor: "#15803d",
    labelBadge: "NES-FN-USA",
    isUnlocked: false,
    storeName: "Pixel Fruit Ninja",
    storeSubtitle: "Dojo Slasher",
    clerkName: "Fruit Master",
    clerkGreeting:
      "Welcome to the Fruit Dojo! Master your katana, slice flying fruits, and earn glory!",
    accentColor: "#22c55e",
    landmarkTileIndex: 5,
  },
  {
    id: "mario-invaders",
    title: "Mario Invaders",
    genre: "Space Shooter",
    description:
      "Pilot Mario's red fighter plane, blast waves of Goombas, Koopas, and Piranha Plants in 16-bit retro sky patrol!",
    price: 300,
    author: "Zhongyue",
    labelColor: "#b91c1c",
    labelBadge: "NES-MI-USA",
    isUnlocked: false,
    storeName: "Mario Invaders",
    storeSubtitle: "Retro Sky Shooter",
    clerkName: "Captain Mario",
    clerkGreeting:
      "It's-a me! Ready to take to the skies and blast incoming Goombas and Koopas with fireballs?",
    accentColor: "#ef4444",
    landmarkTileIndex: 11,
  },
  {
    id: "super-pixel-bros",
    title: "Super Pixel Bros.",
    genre: "Platformer",
    description:
      "Control Justin! Headbutt question blocks, stomp Goomba mushrooms, climb the stairs, and reach the flagpole!",
    price: 300,
    author: "Retro Arcade",
    labelColor: "#b91c1c",
    labelBadge: "NES-SM-USA",
    isUnlocked: true,
    storeName: "Super Pixel Bros.",
    storeSubtitle: "Platformer",
    clerkName: "Justin",
    clerkGreeting:
      "Let's-a-go! Ready for mushroom stomping and flagpole sliding?",
    accentColor: "#f59e0b",
    landmarkTileIndex: 21,
  },
  {
    id: "pixel-pinball-88",
    title: "Pixel Pinball 88",
    genre: "Arcade Tables",
    description: "Multiball madness on 3 retro pixelated pinball tables.",
    price: 1200,
    author: "Retro Arcade",
    labelColor: "#ea580c",
    labelBadge: "NES-PP-USA",
    isUnlocked: false,
    storeName: "Pixel Pinball 88",
    storeSubtitle: "Arcade Tables",
    clerkName: "Flipper Frankie",
    clerkGreeting:
      "Three tables, multiball frenzy, and pure 1988 retro arcade bliss!",
    accentColor: "#f97316",
    landmarkTileIndex: 26,
  },
];
