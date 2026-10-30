"use client";

import React from "react";
import { ShopItem } from "./types";

interface ShopLandmarkProps {
  item?: ShopItem;
  isExit?: boolean;
  x: number;
  y: number;
  isPlayerHere: boolean;
  onSelect: () => void;
}

export default function ShopLandmark({
  item,
  isExit = false,
  x,
  y,
  isPlayerHere,
  onSelect,
}: ShopLandmarkProps) {
  if (isExit) {
    return (
      <div
        onClick={onSelect}
        className={`absolute cursor-pointer transition-all duration-200 z-20 group ${
          isPlayerHere ? "scale-105" : "hover:scale-102"
        }`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(-50%, -50%)",
        }}
        title="Exit to Retro Arcade Living Room"
      >
        {/* Glowing Aura if Player is here */}
        {isPlayerHere && (
          <div className="absolute inset-0 -m-3 bg-emerald-500/30 rounded-xl blur-md animate-pulse pointer-events-none" />
        )}

        {/* Exit Subway / Portal Structure */}
        <div className="relative bg-neutral-900 border-2 border-emerald-500 rounded p-2 text-center w-28 shadow-xl pixel-border-sm flex flex-col items-center">
          {/* Neon Sign */}
          <div className="bg-emerald-950/80 border border-emerald-400 px-1.5 py-0.5 rounded text-[7px] font-bold text-emerald-300 tracking-wider shadow-[0_0_8px_rgba(16,185,129,0.5)] mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>EXIT WARP</span>
          </div>

          {/* Pixel Subway / Living Room Door Graphic */}
          <div className="w-16 h-12 bg-neutral-950 border border-neutral-700 rounded-t flex flex-col justify-end items-center relative overflow-hidden">
            {/* Ambient Green Warp Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/40 via-transparent to-transparent" />
            <div className="text-xl mb-1 filter drop-shadow">🚪</div>
            <div className="w-full h-1.5 bg-emerald-800" />
          </div>

          {/* Subtitle */}
          <div className="mt-1 text-[6px] text-emerald-300 font-bold tracking-tight">
            BACK TO ARCADE
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div
      onClick={onSelect}
      className={`absolute cursor-pointer transition-all duration-200 z-20 group ${
        isPlayerHere ? "scale-105" : "hover:scale-102"
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
      title={`Visit ${item.storeName} - ${item.title}`}
    >
      {/* Glowing Selection Aura */}
      {isPlayerHere && (
        <div
          className="absolute inset-0 -m-3 rounded-xl blur-md animate-pulse pointer-events-none"
          style={{ backgroundColor: `${item.accentColor}40` }}
        />
      )}

      {/* Retro Arcade Storefront Building */}
      <div
        className="relative bg-neutral-900/95 border-2 rounded p-2 text-center w-32 shadow-2xl pixel-border-sm flex flex-col items-center"
        style={{ borderColor: item.accentColor }}
      >
        {/* Store Roof / Neon Awning */}
        <div
          className="w-full py-0.5 px-1 rounded-t -mt-2 -mx-2 mb-1.5 flex justify-between items-center text-[6px] font-bold tracking-wider text-white shadow"
          style={{
            background: `linear-gradient(90deg, ${item.accentColor} 0%, #000 100%)`,
          }}
        >
          <span className="truncate">{item.storeName}</span>
          <span>{item.storeSignIcon}</span>
        </div>

        {/* Store Display Window & Clerk */}
        <div className="w-full h-14 bg-neutral-950 border border-neutral-800 rounded p-1 flex items-center justify-between relative overflow-hidden">
          {/* Neon Backdrop Light */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${item.accentColor} 0%, transparent 70%)`,
            }}
          />

          {/* Game Pixel Icon */}
          <div className="text-2xl filter drop-shadow ml-1">
            {item.pixelArtIcon}
          </div>

          {/* Game Title & Badge */}
          <div className="flex flex-col text-left pl-1.5 flex-1 overflow-hidden">
            <span className="text-[7px] font-bold text-yellow-300 truncate">
              {item.title}
            </span>
            <span className="text-[6px] text-neutral-400 truncate">
              {item.genre}
            </span>
            <span className="text-[5px] text-neutral-500 font-mono mt-0.5">
              {item.labelBadge}
            </span>
          </div>
        </div>

        {/* Status / Price Tag Bar */}
        <div className="w-full mt-1.5 flex items-center justify-center">
          {item.isUnlocked ? (
            <div className="w-full py-0.5 bg-green-950 border border-green-600 rounded text-[6px] font-bold text-green-300 flex items-center justify-center gap-1 shadow-sm">
              <span>✓</span>
              <span>UNLOCKED</span>
            </div>
          ) : (
            <div className="w-full py-0.5 bg-amber-950/80 border border-amber-500/80 rounded text-[7px] font-bold text-amber-300 flex items-center justify-center gap-1 shadow-sm group-hover:bg-amber-900">
              <span>🪙</span>
              <span>{item.price} PTS</span>
            </div>
          )}
        </div>

        {/* Floating Proximity Tag if player is on this tile */}
        {isPlayerHere && (
          <div className="absolute -top-6 bg-yellow-400 text-neutral-950 text-[6px] font-bold px-1.5 py-0.5 rounded shadow-lg pixel-border-sm animate-bounce whitespace-nowrap">
            ENTER STORE [E]
          </div>
        )}
      </div>
    </div>
  );
}
