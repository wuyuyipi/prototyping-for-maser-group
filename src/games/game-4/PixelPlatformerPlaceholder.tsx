"use client";

import React, { useState } from "react";
import { GameComponentProps } from "../types";

export default function PixelPlatformerPlaceholder({ onExit }: GameComponentProps) {
  const [coins, setCoins] = useState(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-emerald-950 text-emerald-300 font-pixel relative select-none">
      <header className="w-full flex justify-between items-center text-xs border-b border-emerald-800 pb-2">
        <span>WORLD: 1-1</span>
        <span className="text-yellow-400">PIXEL PLATFORMER</span>
        <span>🪙 x{coins.toString().padStart(2, "0")}</span>
      </header>

      <main className="flex flex-col items-center justify-center text-center space-y-4 my-auto">
        <div className="text-4xl animate-bounce">🍄 🧱</div>
        <h1 className="text-xl md:text-2xl text-emerald-300 font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(16,185,129,0.4)]">
          PIXEL HERO
        </h1>
        <p className="text-[10px] text-emerald-600 uppercase tracking-widest">
          JUMP & RUN CLASSIC
        </p>

        <div className="bg-emerald-900/60 border-2 border-emerald-500/60 p-3 max-w-sm rounded">
          <p className="text-[11px] text-emerald-200">
            [Reserved for Teammate 4]
          </p>
          <p className="text-[9px] text-emerald-400 mt-1">
            File: src/games/game-4/PixelPlatformerPlaceholder.tsx
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCoins((c) => c + 1)}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider border-2 border-white shadow-[0_4px_0_0_#047857] active:translate-y-1"
        >
          🪙 HIT ? BLOCK
        </button>
      </main>

      <footer className="w-full flex justify-between items-center text-[10px] text-emerald-600 border-t border-emerald-800 pt-2">
        <span>BRANCH: feat/game-pixel-platformer</span>
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
