"use client";

import React, { useState } from "react";
import { GameComponentProps } from "../types";

export default function SpaceDefenderPlaceholder({ onExit }: GameComponentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shotsFired, setShotsFired] = useState(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-slate-950 text-cyan-300 font-pixel relative overflow-hidden select-none">
      {/* Starfield background animation */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-4 left-10 text-xs text-white">.</div>
        <div className="absolute top-20 right-14 text-sm text-cyan-200">★</div>
        <div className="absolute top-44 left-1/3 text-xs text-white">.</div>
        <div className="absolute bottom-16 right-20 text-xs text-white">✦</div>
        <div className="absolute bottom-28 left-16 text-sm text-yellow-300">★</div>
      </div>

      {/* Header */}
      <header className="w-full flex justify-between items-center text-xs z-10 border-b border-cyan-800 pb-2">
        <span>SCORE: {(shotsFired * 150).toString().padStart(6, "0")}</span>
        <span className="text-yellow-400">DEFENDER 1985</span>
        <span>SHIPS: 3</span>
      </header>

      {/* Main Screen */}
      {!isPlaying ? (
        <main className="flex flex-col items-center justify-center text-center space-y-4 my-auto z-10">
          <div className="text-4xl animate-bounce">🚀</div>
          <h1 className="text-xl md:text-2xl text-cyan-400 font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(0,255,255,0.4)]">
            SPACE DEFENDER
          </h1>
          <p className="text-[10px] text-cyan-600 uppercase tracking-widest">
            © 1985 TEAM ARCADE CORP.
          </p>
          <div className="bg-slate-900/80 border-2 border-cyan-500/50 p-3 max-w-sm rounded">
            <p className="text-[11px] text-slate-300">
              [Reserved for Teammate 1]
            </p>
            <p className="text-[9px] text-slate-400 mt-1">
              File: src/games/game-1/SpaceDefenderPlaceholder.tsx
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-widest border-2 border-white shadow-[0_4px_0_0_#0891b2] active:translate-y-1"
          >
            ▶ START MISSION
          </button>
        </main>
      ) : (
        <main className="flex flex-col items-center justify-center text-center space-y-4 my-auto z-10">
          <div className="text-2xl">🛸  👾  👾</div>
          <div className="text-xs text-cyan-200">DEFEND THE SECTOR!</div>
          <button
            type="button"
            onClick={() => setShotsFired((c) => c + 1)}
            className="px-4 py-3 bg-red-600 hover:bg-red-500 text-white text-xs border-2 border-white shadow-[0_4px_0_0_#991b1b] active:translate-y-1"
          >
            🔥 FIRE LASER (Shots: {shotsFired})
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying(false)}
            className="text-[10px] text-neutral-400 hover:text-white underline mt-2"
          >
            Return to Title
          </button>
        </main>
      )}

      {/* Footer */}
      <footer className="w-full flex justify-between items-center text-[10px] text-slate-500 z-10 border-t border-cyan-800 pt-2">
        <span>BRANCH: feat/game-space-defender</span>
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
