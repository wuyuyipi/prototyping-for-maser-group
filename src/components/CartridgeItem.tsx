"use client";

import React from "react";
import { GameDefinition } from "../games/types";
import CartridgeArt from "./CartridgeArt";

interface CartridgeItemProps {
  game: GameDefinition;
  view?: "spine" | "front";
  isSelected?: boolean;
  isLocked?: boolean;
  canAfford?: boolean;
  onSelect?: (game: GameDefinition) => void;
}

export default function CartridgeItem({
  game,
  view = "front",
  isSelected = false,
  isLocked = false,
  canAfford = false,
  onSelect,
}: CartridgeItemProps) {
  const shellBg = game.cartridgeColor || "#374151";

  if (view === "spine") {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(game)}
        title={`Select ${game.title}`}
        style={{ backgroundColor: shellBg }}
        className={`group relative w-full h-10 md:h-12 hover:brightness-110 text-left transition-all duration-150 rounded-xs pixel-border-sm flex items-center px-3 cursor-pointer select-none active:translate-x-1 ${
          isSelected ? "ring-2 ring-yellow-400 -translate-x-2 shadow-md" : ""
        }`}
      >
        <div className="flex gap-[3px] mr-3 shrink-0">
          <div className="w-[3px] h-6 bg-black/50 border-r border-white/20" />
          <div className="w-[3px] h-6 bg-black/50 border-r border-white/20" />
          <div className="w-[3px] h-6 bg-black/50 border-r border-white/20" />
        </div>

        <div
          className="flex-1 h-7 md:h-8 flex items-center justify-between px-2 text-[10px] md:text-xs font-bold text-white shadow-inner overflow-hidden border border-neutral-900"
          style={{ backgroundColor: game.labelColor }}
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-sm shrink-0">{game.pixelArtIcon}</span>
            <span className="truncate tracking-wider drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              {game.title}
            </span>
          </div>
          <span className="text-[8px] opacity-90 shrink-0 ml-1 font-mono">
            {isLocked ? `🔒 ${game.price} PTS` : game.labelBadge}
          </span>
        </div>
      </button>
    );
  }

  // Front-facing full NES cartridge with custom Pixel-Art Scene
  return (
    <div
      onClick={() => onSelect?.(game)}
      style={{
        backgroundColor: shellBg,
        clipPath: "polygon(0 0, 100% 0, 100% 96%, 95% 100%, 5% 100%, 0 96%)",
      }}
      className={`relative w-52 sm:w-56 h-68 sm:h-74 cursor-pointer transition-all duration-150 p-2.5 flex flex-col justify-between pixel-border group ${
        isSelected
          ? "ring-4 ring-yellow-400 scale-[1.03]"
          : "hover:-translate-y-1.5 hover:brightness-105"
      }`}
    >
      {/* Top textured grip ridges + Gold Seal */}
      <div className="w-full h-6 bg-black/45 rounded-xs flex items-center justify-between px-2 border-b-2 border-black/70">
        <div className="flex items-center gap-1 flex-1 mr-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-1 h-3 bg-black/70 border-r border-white/20"
            />
          ))}
        </div>
        <span
          className="text-[6px] font-bold px-1.5 py-0.5 rounded-xs text-black"
          style={{ backgroundColor: game.accentColor }}
        >
          {game.labelBadge}
        </span>
      </div>

      {/* Front Label Sticker with Custom Pixel-Art Illustration */}
      <div
        className="flex-1 my-1.5 bg-neutral-950 border-3 border-black p-2 flex flex-col justify-between text-white relative shadow-inner overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${game.labelColor} 0%, #090d16 100%)`,
        }}
      >
        {/* Top Game Genre Banner */}
        <div className="flex justify-between items-center text-[6px] tracking-widest border-b border-white/25 pb-1">
          <span className="font-bold text-yellow-300 uppercase">
            {game.genre}
          </span>
          <span className="text-white/80">{game.year}</span>
        </div>

        {/* Custom Pixel-Art Illustration for this specific game! */}
        <div className="my-1 relative">
          <CartridgeArt gameId={game.id} />
        </div>

        {/* Prominent Game Title & Icon */}
        <div className="text-center space-y-0.5">
          <div className="text-[10px] sm:text-[11px] font-bold tracking-wider text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] truncate">
            {game.pixelArtIcon} {game.title}
          </div>
          <div className="text-[6px] text-neutral-300 line-clamp-1">
            BY {game.author.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Cartridge Bottom Connector Contacts & Lock/Status Badge */}
      <div className="w-full flex justify-between items-center px-2 pt-0.5 text-[7px] font-mono">
        <div className="w-7 h-2 bg-amber-400/80 border border-black" />
        {isLocked ? (
          <span className="text-[7px] font-bold text-amber-300 bg-black/80 px-1.5 py-0.5 rounded border border-amber-500">
            🔒 {game.price} PTS
          </span>
        ) : (
          <span className="text-[7px] font-bold text-emerald-300 bg-black/70 px-1.5 py-0.5 rounded">
            ✓ UNLOCKED
          </span>
        )}
        <div className="w-7 h-2 bg-amber-400/80 border border-black" />
      </div>

      {/* Locked Overlay / Hover Action */}
      {isLocked ? (
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center p-3 text-center transition-opacity">
          <div className="bg-neutral-950/95 border-2 border-amber-400 px-3 py-2 rounded shadow-[0_0_15px_rgba(251,191,36,0.5)] space-y-1">
            <div className="text-xs">🔒</div>
            <div className="text-[8px] text-amber-300 font-bold">
              LOCKED CARTRIDGE
            </div>
            <div
              className={`text-[9px] font-bold px-2 py-1 rounded ${
                canAfford
                  ? "bg-emerald-600 text-white animate-pulse"
                  : "bg-red-950 text-red-300 border border-red-700"
              }`}
            >
              {canAfford
                ? `🔓 UNLOCK (${game.price} PTS)`
                : `🪙 NEED ${game.price} PTS`}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-yellow-400/10 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none transition-opacity">
          <span className="bg-black/90 text-yellow-300 text-[9px] font-bold px-3 py-1.5 pixel-border">
            {isSelected ? "● PLAYING" : "INSERT ↵"}
          </span>
        </div>
      )}
    </div>
  );
}
