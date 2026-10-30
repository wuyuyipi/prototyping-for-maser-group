"use client";

import React from "react";
import { GameDefinition } from "../games/types";

interface CartridgeItemProps {
  game: GameDefinition;
  view?: "spine" | "front";
  isSelected?: boolean;
  onSelect?: (game: GameDefinition) => void;
}

export default function CartridgeItem({
  game,
  view = "front",
  isSelected = false,
  onSelect,
}: CartridgeItemProps) {
  if (view === "spine") {
    // Stack / Pile view showing top spine of cartridge
    return (
      <button
        type="button"
        onClick={() => onSelect?.(game)}
        title={`Select ${game.title} (By ${game.author})`}
        className={`group relative w-full h-10 md:h-12 bg-neutral-600 hover:bg-neutral-500 text-left transition-all duration-150 rounded-xs pixel-border-sm flex items-center px-3 cursor-pointer select-none active:translate-x-1 ${
          isSelected ? "ring-2 ring-yellow-400 -translate-x-2 bg-neutral-500 shadow-md" : ""
        }`}
      >
        {/* Cartridge plastic ridges on left */}
        <div className="flex gap-[3px] mr-3 shrink-0">
          <div className="w-[3px] h-6 bg-neutral-800 border-r border-neutral-500" />
          <div className="w-[3px] h-6 bg-neutral-800 border-r border-neutral-500" />
          <div className="w-[3px] h-6 bg-neutral-800 border-r border-neutral-500" />
        </div>

        {/* Spine Label Sticker */}
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
          <span className="text-[8px] opacity-80 shrink-0 hidden sm:inline ml-1 font-mono">
            {game.labelBadge}
          </span>
        </div>

        {/* Cartridge plastic ridges on right */}
        <div className="flex gap-[3px] ml-3 shrink-0">
          <div className="w-[3px] h-6 bg-neutral-800 border-r border-neutral-500" />
          <div className="w-[3px] h-6 bg-neutral-800 border-r border-neutral-500" />
        </div>
      </button>
    );
  }

  // Front-facing full NES cartridge
  return (
    <div
      onClick={() => onSelect?.(game)}
      className={`relative w-48 sm:w-56 h-64 sm:h-72 bg-neutral-700 hover:bg-neutral-650 cursor-pointer transition-all duration-150 p-2.5 flex flex-col justify-between pixel-border group ${
        isSelected ? "ring-4 ring-yellow-400 scale-[1.03]" : "hover:-translate-y-1"
      }`}
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 96%, 95% 100%, 5% 100%, 0 96%)",
      }}
    >
      {/* Top textured grip ridges */}
      <div className="w-full h-7 bg-neutral-800/80 rounded-xs flex items-center justify-center gap-1.5 px-3 border-b-2 border-neutral-900">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex-1 h-3 bg-neutral-900 border-r border-neutral-600" />
        ))}
      </div>

      {/* Front Label Box */}
      <div
        className="flex-1 my-2 bg-neutral-900 border-4 border-neutral-950 p-2 flex flex-col justify-between text-white relative shadow-inner overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${game.labelColor} 0%, #000000 100%)`,
        }}
      >
        {/* Header strip */}
        <div className="flex justify-between items-center text-[7px] tracking-widest text-neutral-300 border-b border-white/20 pb-1">
          <span className="font-bold text-yellow-300">RETRO ARCADE</span>
          <span>{game.labelBadge}</span>
        </div>

        {/* Center Art */}
        <div className="flex flex-col items-center justify-center my-auto text-center space-y-1">
          <div className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform">
            {game.pixelArtIcon}
          </div>
          <div className="text-[11px] sm:text-xs font-bold tracking-wider text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] line-clamp-1">
            {game.title}
          </div>
          <div className="text-[8px] text-neutral-300 font-sans tracking-wide">
            {game.genre}
          </div>
        </div>

        {/* Bottom Seal & Author */}
        <div className="flex justify-between items-end text-[7px] pt-1 border-t border-white/20 text-neutral-300">
          <div>
            <div className="text-[6px] text-neutral-400">DEV:</div>
            <div className="font-bold text-white truncate max-w-[90px]">{game.author}</div>
          </div>
          <div className="w-7 h-7 rounded-full border border-yellow-400/80 bg-yellow-950/60 flex items-center justify-center text-[5px] text-center text-yellow-300 leading-none">
            SEAL OF QUALITY
          </div>
        </div>
      </div>

      {/* Cartridge Bottom Lip / Notch */}
      <div className="w-full flex justify-between items-center px-2 pt-1 text-[8px] text-neutral-400 font-mono">
        <div className="w-8 h-2 bg-neutral-900 border border-neutral-600" />
        <span className="text-[7px] text-neutral-400 uppercase tracking-tighter">
          {game.status}
        </span>
        <div className="w-8 h-2 bg-neutral-900 border border-neutral-600" />
      </div>

      {/* Insert Overlay on Hover */}
      <div className="absolute inset-0 bg-yellow-400/10 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none transition-opacity">
        <span className="bg-black/90 text-yellow-300 text-[10px] font-bold px-3 py-1.5 pixel-border">
          INSERT ↵
        </span>
      </div>
    </div>
  );
}
