import React from "react";

export type GameStatus = "placeholder" | "in-development" | "ready";

export interface GameMetadata {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
  instructions: string;
  cartridgeColor?: string; // Color of cartridge casing (default classic NES grey #6b7280)
  labelColor: string; // Main background color for cartridge label art
  accentColor: string; // Secondary accent color
  labelBadge: string; // 2-4 letter game code, e.g. "NES-SD-USA"
  pixelArtIcon: string; // Emoji or pixel icon representation for label
  status: GameStatus;
}

export interface GameComponentProps {
  onExit?: () => void;
  isMuted?: boolean;
}

export interface GameDefinition extends GameMetadata {
  Component: React.ComponentType<GameComponentProps>;
}
