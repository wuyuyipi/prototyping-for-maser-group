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
}
