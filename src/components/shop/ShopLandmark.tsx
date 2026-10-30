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
        title="Exit to Living Room"
      >
        {isPlayerHere && (
          <div className="absolute inset-0 -m-2 bg-emerald-500/30 rounded-lg blur-md animate-pulse pointer-events-none" />
        )}

        <div className="relative bg-neutral-950/90 border border-emerald-500/80 rounded p-2 text-center w-24 shadow-xl flex flex-col items-center">
          <div className="bg-emerald-950/80 border border-emerald-500/60 px-2 py-0.5 rounded text-[8px] font-bold text-emerald-300 tracking-wider">
            EXIT
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
      title={`Visit ${item.title}`}
    >
      {isPlayerHere && (
        <div
          className="absolute inset-0 -m-2 rounded-lg blur-md animate-pulse pointer-events-none"
          style={{ backgroundColor: `${item.accentColor}35` }}
        />
      )}

      {/* Clean Landmark Card Representing Game Purely by Name */}
      <div
        className="relative bg-neutral-950/90 border rounded p-2 text-center w-32 shadow-xl flex flex-col items-center"
        style={{ borderColor: item.accentColor }}
      >
        {/* Game Title Header */}
        <div
          className="w-full py-1 px-1.5 rounded -mt-0.5 mb-1.5 text-center text-[8px] font-bold tracking-wider text-white shadow truncate"
          style={{
            background: `linear-gradient(90deg, ${item.accentColor} 0%, #171717 100%)`,
          }}
        >
          {item.title}
        </div>

        {/* Status / Price Tag */}
        <div className="w-full flex items-center justify-center">
          {item.isUnlocked ? (
            <div className="w-full py-0.5 bg-green-950 border border-green-600 rounded text-[7px] font-bold text-green-300 text-center shadow-sm">
              UNLOCKED
            </div>
          ) : (
            <div className="w-full py-0.5 bg-amber-950/80 border border-amber-500/80 rounded text-[7px] font-bold text-amber-300 text-center shadow-sm group-hover:bg-amber-900">
              {item.price} PTS
            </div>
          )}
        </div>

        {/* Proximity Prompt */}
        {isPlayerHere && (
          <div className="absolute -top-5 bg-yellow-400 text-neutral-950 text-[6px] font-bold px-1.5 py-0.5 rounded shadow animate-bounce whitespace-nowrap">
            ENTER [E]
          </div>
        )}
      </div>
    </div>
  );
}
