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
  cartridgeColor?: string; // Color of cartridge casing
  labelColor: string; // Main background color for cartridge label art
  accentColor: string; // Secondary accent color
  labelBadge: string; // Game code, e.g. "NES-SM-USA"
  pixelArtIcon: string; // Emoji or pixel icon representation for label
  status: GameStatus;
}

export interface GameComponentProps {
  onExit?: () => void;
  isMuted?: boolean;
  onEarnPoints?: (points: number) => void;
}

export interface GameDefinition extends GameMetadata {
  Component: React.ComponentType<GameComponentProps>;
}
