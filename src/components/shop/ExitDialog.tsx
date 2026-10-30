"use client";

import React from "react";
import { ShopItem } from "./types";

interface ExitDialogProps {
  unlockedCount: number;
  totalCount: number;
  playerPoints: number;
  onExit: () => void;
  onClose: () => void;
}

export default function ExitDialog({
  unlockedCount,
  totalCount,
  playerPoints,
  onExit,
  onClose,
}: ExitDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-neutral-900 border-4 border-emerald-500 rounded-lg p-5 shadow-2xl pixel-border font-pixel text-neutral-100 flex flex-col gap-4 text-center">
        {/* Header Icon */}
        <div className="w-16 h-16 mx-auto bg-emerald-950 border-2 border-emerald-400 rounded-full flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse">
          🚪
        </div>

        <div>
          <h3 className="text-xs font-bold text-emerald-300 tracking-wider mb-1">
            WARP GATE: BACK TO ARCADE
          </h3>
          <p className="text-[8px] text-neutral-400 leading-relaxed">
            You&apos;ve reached the end of the Candy Land path! Ready to return to
            your cozy living room and test out your games?
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-neutral-950 border border-neutral-800 p-3 rounded text-[8px] space-y-2 text-left">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Cartridges Unlocked:</span>
            <span className="text-yellow-300 font-bold">
              {unlockedCount} / {totalCount} Games
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Current Balance:</span>
            <span className="text-amber-400 font-bold">
              🪙 {playerPoints.toLocaleString()} PTS
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="button"
            onClick={onExit}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 text-[9px] font-bold rounded pixel-border-sm cursor-pointer shadow-[0_2px_0_0_#065f46] active:translate-y-0.5 transition-all"
          >
            🚪 EXIT TO LIVING ROOM
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[8px] font-bold rounded pixel-border-sm cursor-pointer transition-colors"
          >
            STAY & BROWSE MORE
          </button>
        </div>
      </div>
    </div>
  );
}
