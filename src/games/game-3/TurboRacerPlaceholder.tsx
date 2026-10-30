"use client";

import React, { useState } from "react";
import { GameComponentProps } from "../types";

export default function TurboRacerPlaceholder({ onExit }: GameComponentProps) {
  const [mph, setMph] = useState(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-zinc-950 text-orange-400 font-pixel relative select-none">
      <header className="w-full flex justify-between items-center text-xs border-b border-orange-800 pb-2">
        <span>TIME: 01:24.08</span>
        <span className="text-yellow-300">TURBO RACER '86</span>
        <span>SPEED: {mph} MPH</span>
      </header>

      <main className="flex flex-col items-center justify-center text-center space-y-4 my-auto">
        <div className="text-4xl animate-pulse">🏎️ 🏁</div>
        <h1 className="text-xl md:text-2xl text-orange-400 font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(249,115,22,0.4)]">
          TURBO RACER '86
        </h1>
        <p className="text-[10px] text-orange-600 uppercase tracking-widest">
          HIGH-OCTANE 8-BIT HIGHWAY
        </p>

        <div className="bg-zinc-900 border-2 border-orange-500/60 p-3 max-w-sm rounded">
          <p className="text-[11px] text-orange-300">
            [Reserved for Teammate 3]
          </p>
          <p className="text-[9px] text-zinc-400 mt-1">
            File: src/games/game-3/TurboRacerPlaceholder.tsx
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMph((m) => Math.min(220, m + 25))}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs uppercase tracking-wider border-2 border-white shadow-[0_4px_0_0_#c2410c] active:translate-y-1"
          >
            ACCELERATE!
          </button>
          <button
            type="button"
            onClick={() => setMph((m) => Math.max(0, m - 30))}
            className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-orange-200 text-xs border border-orange-600"
          >
            BRAKE
          </button>
        </div>
      </main>

      <footer className="w-full flex justify-between items-center text-[10px] text-zinc-500 border-t border-orange-800 pt-2">
        <span>BRANCH: feat/game-turbo-racer</span>
        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="text-red-400 hover:text-red-300 underline"
          >
            EJECT
          </button>
        )}
      </footer>
    </div>
  );
}
