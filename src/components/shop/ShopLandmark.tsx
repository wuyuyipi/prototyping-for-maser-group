"use client";

import React from "react";
import { ShopItem } from "./types";
import { BOARD_WIDTH, BOARD_HEIGHT } from "./boardPathData";

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
  // Exact percentage coordinates mapped to the 1000x580 board
  const leftPercent = (x / BOARD_WIDTH) * 100;
  const topPercent = (y / BOARD_HEIGHT) * 100;

  if (isExit) {
    return (
      <div
        onClick={onSelect}
        className="absolute cursor-pointer z-20 group"
        style={{
          left: `${leftPercent}%`,
          top: `${topPercent}%`,
          transform: "translate(-50%, -50%)",
        }}
        title="Exit to Living Room (End of Path)"
      >
        {isPlayerHere && (
          <div className="absolute inset-0 -m-2 bg-emerald-500/40 rounded-lg blur-md animate-pulse pointer-events-none" />
        )}

        {/* Clean End-of-Path Exit Gate */}
        <div className="relative bg-neutral-950/95 border-2 border-emerald-500 rounded p-1.5 text-center min-w-[76px] shadow-xl flex flex-col items-center group-hover:border-emerald-400 transition-colors">
          <div className="bg-emerald-950 border border-emerald-400 px-2.5 py-1 rounded text-[8px] font-bold text-emerald-300 tracking-wider">
            EXIT
          </div>
          {isPlayerHere && (
            <div className="absolute -top-5 bg-emerald-400 text-neutral-950 text-[6px] font-bold px-1.5 py-0.5 rounded shadow animate-bounce whitespace-nowrap">
              LEAVE [E]
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div
      onClick={onSelect}
      className="absolute cursor-pointer z-20 group"
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
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
        className="relative bg-neutral-950/95 border rounded p-2 text-center w-32 shadow-xl flex flex-col items-center group-hover:brightness-110 transition-all"
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
