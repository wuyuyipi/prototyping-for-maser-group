"use client";

import React, { useState } from "react";
import { GameComponentProps } from "../types";

export default function DungeonQuestPlaceholder({ onExit }: GameComponentProps) {
  const [inBattle, setInBattle] = useState(false);
  const [playerHp, setPlayerHp] = useState(25);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-stone-950 text-amber-200 font-pixel relative select-none">
      <header className="w-full flex justify-between items-center text-xs border-b border-amber-800 pb-2">
        <span>LV: 01</span>
        <span className="text-red-400">DUNGEON QUEST</span>
        <span>HP: {playerHp}/25</span>
      </header>

      {!inBattle ? (
        <main className="flex flex-col items-center justify-center text-center space-y-4 my-auto">
          <div className="text-4xl animate-bounce">🗡️ 🛡️</div>
          <h1 className="text-xl md:text-2xl text-amber-400 font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)]">
            DUNGEON QUEST
          </h1>
          <p className="text-[10px] text-amber-600 uppercase tracking-widest">
            AN 8-BIT FANTASY ADVENTURE
          </p>
          <div className="bg-stone-900 border-2 border-amber-600/60 p-3 max-w-sm rounded">
            <p className="text-[11px] text-amber-300">
              [Reserved for Teammate 2]
            </p>
            <p className="text-[9px] text-stone-400 mt-1">
              File: src/games/game-2/DungeonQuestPlaceholder.tsx
            </p>
          </div>
          <button
            type="button"
            onClick={() => setInBattle(true)}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-widest border-2 border-amber-200 shadow-[0_4px_0_0_#78350f] active:translate-y-1"
          >
            ▶ ENTER DUNGEON
          </button>
        </main>
      ) : (
        <main className="flex flex-col items-center justify-center text-center space-y-4 my-auto">
          <div className="text-3xl">🐉</div>
          <div className="text-xs text-amber-300">A WILD SLIME APPEARS!</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => alert("Hit for 12 DMG!")}
              className="px-3 py-2 bg-stone-800 border-2 border-amber-500 text-xs hover:bg-stone-700"
            >
              ATTACK
            </button>
            <button
              type="button"
              onClick={() => setPlayerHp((h) => Math.min(25, h + 5))}
              className="px-3 py-2 bg-stone-800 border-2 border-green-500 text-xs hover:bg-stone-700"
            >
              POTION
            </button>
          </div>
          <button
            type="button"
            onClick={() => setInBattle(false)}
            className="text-[10px] text-stone-400 hover:text-white underline mt-2"
          >
            Escape to Tavern
          </button>
        </main>
      )}

      <footer className="w-full flex justify-between items-center text-[10px] text-stone-500 border-t border-amber-800 pt-2">
        <span>BRANCH: feat/game-dungeon-quest</span>
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
