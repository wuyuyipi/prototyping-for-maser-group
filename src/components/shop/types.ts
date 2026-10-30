export interface ShopItem {
  id: string;
  title: string;
  genre: string;
  description: string;
  price: number; // points needed to buy
  author: string;
  labelColor: string;
  pixelArtIcon: string;
  labelBadge: string;
  isUnlocked?: boolean;

  // Retro Arcade Land Store Metadata
  storeName: string;
  storeSubtitle: string;
  clerkName: string;
  clerkGreeting: string;
  accentColor: string;
  storeSignIcon: string;
  landmarkTileIndex: number;
}

export interface BoardTile {
  index: number;
  x: number;
  y: number;
  color: string;
  label?: string;
  storeId?: string;
  isStart?: boolean;
  isExit?: boolean;
}
