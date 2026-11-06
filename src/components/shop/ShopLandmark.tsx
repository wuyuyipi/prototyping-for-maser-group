"use client";

import React from "react";
import { ShopItem } from "./types";
import { BOARD_WIDTH, BOARD_HEIGHT } from "./boardPathData";
import CartridgeArt from "../CartridgeArt";

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
        className="absolute cursor-pointer z-20 group transition-transform duration-150 hover:scale-105"
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
      className="absolute cursor-pointer z-20 group transition-transform duration-200 hover:scale-105"
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        transform: "translate(-50%, -50%)",
      }}
      title={`Visit ${item.title}`}
    >
      {/* Player Proximity Halo */}
      {isPlayerHere && (
        <div
          className="absolute inset-0 -m-2.5 rounded-xl blur-md animate-pulse pointer-events-none"
          style={{ backgroundColor: `${item.accentColor}60` }}
        />
      )}

      {/* Game Stop Preview Card */}
      <div
        className="relative bg-neutral-950/95 border-2 rounded-lg p-1.5 text-center w-36 sm:w-40 shadow-2xl flex flex-col items-center group-hover:border-yellow-400 transition-colors font-pixel select-none"
        style={{ borderColor: isPlayerHere ? "#fde047" : item.accentColor }}
      >
        {/* Cartridge Art Preview on the Path */}
        <div className="w-full h-16 rounded overflow-hidden border border-neutral-800 bg-black flex items-center justify-center relative mb-1.5 shadow-inner">
          <CartridgeArt gameId={item.id} compact />
        </div>

        {/* Full Game Title */}
        <div className="w-full text-center text-[8px] sm:text-[9px] font-bold tracking-wider text-yellow-300 truncate mb-1">
          {item.title}
        </div>

        {/* Status / Price Pill */}
        <div className="w-full flex items-center justify-center">
          {item.isUnlocked ? (
            <div className="w-full py-0.5 bg-emerald-950 border border-emerald-500 rounded text-[7px] font-bold text-emerald-300 text-center shadow-xs">
              UNLOCKED
            </div>
          ) : (
            <div className="w-full py-0.5 bg-amber-950/90 border border-amber-500/90 rounded text-[7px] font-bold text-amber-300 text-center shadow-xs group-hover:bg-amber-900 flex items-center justify-center gap-1.5 transition-colors">
              <span className="inline-block w-2 h-2 rounded-full bg-slate-300 border border-slate-400 shrink-0" />
              <span>{item.price.toLocaleString()} PTS</span>
            </div>
          )}
        </div>

        {/* Proximity Action Prompt */}
        {isPlayerHere && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-neutral-950 text-[6px] sm:text-[7px] font-bold px-1.5 py-0.5 rounded shadow animate-bounce whitespace-nowrap">
            ENTER [E]
          </div>
        )}
      </div>
    </div>
  );
}
