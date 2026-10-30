"use client";

import React, { useState } from "react";
import { GameComponentProps } from "../types";

/**
 * GameTemplate:
 * Clone this file or folder into `src/games/<your-game-name>/` to build your game.
 * 
 * Target display area:
 * CRT monitor container is responsive with retro 4:3 / 16:9 ratio.
 * Pixel art works best with crisp scaling (image-rendering: pixelated).
 */
export default function GameTemplate({ onExit }: GameComponentProps) {
  const [gameState, setGameState] = useState<"title" | "playing">("title");
  const [score, setScore] = useState<number>(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-neutral-900 text-green-400 font-pixel selection:bg-green-500 selection:text-black">
      {/* Top HUD */}
      <header className="w-full flex justify-between items-center text-xs border-b-2 border-green-500/40 pb-2">
        <div>1UP: {score.toString().padStart(6, "0")}</div>
        <div className="text-yellow-400 animate-pulse">ARCADE PROTOTYPE</div>
        <div>HIGH: 050000</div>
      </header>

      {/* Main Screen Content */}
      {gameState === "title" ? (
        <main className="flex flex-col items-center justify-center text-center space-y-4 my-auto">
          <div className="p-3 border-4 border-dashed border-green-500 rounded bg-black/60 max-w-md">
            <h1 className="text-xl md:text-2xl text-green-300 font-bold tracking-wider mb-2">
              GAME TITLE
            </h1>
            <p className="text-[10px] md:text-xs text-neutral-400">
              Template by Teammate Name
            </p>
          </div>

          <p className="text-xs text-neutral-300 max-w-sm leading-relaxed mt-2">
            This is a placeholder space ready for your game implementation!
          </p>

          <button
            type="button"
            onClick={() => setGameState("playing")}
            className="mt-4 px-4 py-2 bg-green-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-green-400 active:translate-y-1 transition-transform border-2 border-green-300 shadow-[0_4px_0_0_#15803d]"
          >
            ▶ Press Start
          </button>
        </main>
      ) : (
        <main className="flex flex-col items-center justify-center text-center space-y-4 my-auto">
          <div className="text-sm text-green-300">
            [ GAMEPLAY CANVAS / LOGIC GOES HERE ]
          </div>
          <p className="text-[11px] text-neutral-400 max-w-xs">
            Build your HTML5 Canvas, Phaser, Kaboom, or React pixel game inside this component.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setScore((s) => s + 100)}
              className="px-3 py-2 bg-neutral-800 text-green-400 border-2 border-green-500 text-xs hover:bg-neutral-700"
            >
              +100 Points Test
            </button>
            <button
              type="button"
              onClick={() => setGameState("title")}
              className="px-3 py-2 bg-neutral-800 text-neutral-300 border-2 border-neutral-600 text-xs hover:bg-neutral-700"
            >
              Back to Title
            </button>
          </div>
        </main>
      )}

      {/* Bottom Footer Info */}
      <footer className="w-full flex justify-between items-center text-[10px] text-neutral-500 border-t-2 border-green-500/40 pt-2">
        <span>EDIT: src/games/your-game/</span>
        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="text-red-400 hover:text-red-300 underline"
          >
            [EXIT GAME]
          </button>
        )}
      </footer>
    </div>
  );
}
