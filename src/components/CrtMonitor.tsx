"use client";

import React, { useState } from "react";
import { GameDefinition } from "../games/types";
import { playSound } from "./AudioEffects";

interface CrtMonitorProps {
  activeGame: GameDefinition | null;
  onEjectGame: () => void;
  onOpenCartridgeSlot: () => void;
}

export default function CrtMonitor({
  activeGame,
  onEjectGame,
  onOpenCartridgeSlot,
}: CrtMonitorProps) {
  const [powerOn, setPowerOn] = useState(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);

  const togglePower = () => {
    playSound("powerSwitch");
    setPowerOn((prev) => !prev);
  };

  return (
    <section 
      aria-label="CRT Gaming Monitor"
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center"
    >
      {/* Outer CRT Casing */}
      <div className="w-full bg-neutral-800 p-4 sm:p-6 md:p-8 rounded-3xl border-4 border-neutral-900 shadow-2xl relative">
        {/* Subtle top vents & bevel */}
        <div className="w-full flex justify-between items-center mb-3 px-2 border-b-2 border-neutral-700/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest text-neutral-400 font-bold">
              RETRO-VISION
            </span>
            <span className="text-[8px] bg-red-800 text-white px-1.5 py-0.5 rounded-xs font-mono">
              COLOR CRT
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick status badge */}
            <span className="text-[9px] text-neutral-400 hidden sm:inline">
              CH: 03 (GAME)
            </span>
            {/* Power LED */}
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] text-neutral-400">PWR</span>
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  powerOn
                    ? "bg-green-500 shadow-[0_0_8px_#22c55e]"
                    : "bg-red-600 shadow-[0_0_4px_#ef4444]"
                }`}
              />
            </div>
          </div>
        </div>

        {/* CRT Inner Screen Bezel */}
        <div className="relative w-full bg-neutral-950 p-2 sm:p-4 rounded-2xl border-4 border-neutral-900 shadow-inner">
          {/* 4:3 Aspect Ratio CRT Display Container */}
          <div className="crt-screen-container relative w-full aspect-[4/3] max-h-[55vh] min-h-[280px] flex items-center justify-center">
            {powerOn ? (
              activeGame ? (
                /* Active Game Display */
                <div className="w-full h-full relative z-10 crt-flicker">
                  <activeGame.Component onExit={onEjectGame} />
                </div>
              ) : (
                /* No Game Inserted - Retro Standby Screen */
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-emerald-400 font-pixel z-10 crt-flicker">
                  <div className="text-4xl animate-pulse">📺</div>
                  <div className="text-sm md:text-base font-bold tracking-widest text-emerald-300">
                    NO CARTRIDGE LOADED
                  </div>
                  <p className="text-[10px] md:text-xs text-neutral-400 max-w-md leading-relaxed">
                    Insert an 8-bit cartridge into the NES console below or pick one from the pile to start playing.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenCartridgeSlot}
                    className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold uppercase tracking-wider pixel-border cursor-pointer active:translate-y-1"
                  >
                    📂 OPEN CARTRIDGE SLOT
                  </button>
                </div>
              )
            ) : (
              /* TV is Powered Off */
              <div className="w-full h-full flex items-center justify-center text-neutral-700 font-pixel text-xs">
                [ TV POWER OFF ]
              </div>
            )}

            {/* CRT Scanline Overlay (Toggled via TV Controls) */}
            {powerOn && scanlinesEnabled && (
              <div className="crt-scanlines absolute inset-0 z-20 pointer-events-none" />
            )}

            {/* CRT Curved Glass Glare & Reflection Overlay */}
            <div className="crt-curvature absolute inset-0 z-30 pointer-events-none" />
          </div>
        </div>

        {/* CRT Bottom TV Control Panel */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 pt-2 text-[9px] text-neutral-400 border-t border-neutral-700/60">
          {/* Speaker Grille */}
          <div className="flex gap-1 items-center">
            <span className="text-[8px] mr-1 hidden sm:inline">SPEAKER</span>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1 h-3 bg-neutral-900 rounded-full" />
            ))}
          </div>

          {/* Physical TV Hardware Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={togglePower}
              className={`px-3 py-1.5 text-xs font-bold pixel-border-sm transition-transform active:translate-y-0.5 cursor-pointer ${
                powerOn
                  ? "bg-neutral-700 text-green-300 hover:bg-neutral-600"
                  : "bg-red-900 text-red-200 hover:bg-red-800"
              }`}
            >
              {powerOn ? "POWER: ON" : "POWER: OFF"}
            </button>

            <button
              type="button"
              onClick={() => {
                playSound("blip");
                setScanlinesEnabled((s) => !s);
              }}
              className="px-2.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-xs pixel-border-sm cursor-pointer active:translate-y-0.5"
            >
              SCANLINES: {scanlinesEnabled ? "ON" : "OFF"}
            </button>

            {activeGame && (
              <button
                type="button"
                onClick={onEjectGame}
                className="px-2.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-amber-300 text-xs pixel-border-sm cursor-pointer active:translate-y-0.5"
                title="Eject currently loaded game"
              >
                ⏏ EJECT
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
