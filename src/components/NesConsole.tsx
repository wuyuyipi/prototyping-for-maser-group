"use client";

import React from "react";
import { GameDefinition } from "../games/types";
import { playSound } from "./AudioEffects";

interface NesConsoleProps {
  activeGame: GameDefinition | null;
  isSlotOpen: boolean;
  onOpenCartridgeSlot: () => void;
  onResetGame?: () => void;
  onTogglePower?: () => void;
}

export default function NesConsole({
  activeGame,
  isSlotOpen,
  onOpenCartridgeSlot,
  onResetGame,
}: NesConsoleProps) {
  const handleSlotClick = () => {
    playSound("slotOpen");
    onOpenCartridgeSlot();
  };

  const handleReset = () => {
    playSound("blip");
    onResetGame?.();
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-neutral-300 nes-bevel p-3 sm:p-4 rounded-xs shadow-2xl relative select-none font-pixel">
      {/* Top Console Surface */}
      <div className="w-full bg-neutral-400 p-2 sm:p-3 rounded-xs border-2 border-neutral-500 flex flex-col justify-between">
        {/* Upper Console Half: Cartridge Chamber & Black Accent Stripe */}
        <div className="flex w-full gap-2 items-stretch min-h-[90px] sm:min-h-[105px]">
          {/* Cartridge Door Section (Clickable) */}
          <button
            type="button"
            onClick={handleSlotClick}
            aria-label="Open NES Cartridge Door to switch games"
            className="flex-1 bg-neutral-300 border-2 border-neutral-500 p-2 relative group cursor-pointer text-left hover:brightness-105 active:scale-[0.99] transition-all flex flex-col justify-between"
          >
            {/* Door Status & Brand Label */}
            <div className="flex justify-between items-center text-[7px] sm:text-[8px] text-red-600 font-bold tracking-tight">
              <span>RETRO ENTERTAINMENT SYSTEM</span>
              <span className="text-neutral-500 font-mono text-[6px]">NES-001</span>
            </div>

            {/* Chamber Interior / Loaded Cartridge Indicator */}
            <div className="w-full h-10 sm:h-12 bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center p-1 relative overflow-hidden">
              {activeGame ? (
                /* Cartridge is currently inserted inside slot */
                <div
                  className="w-full h-full flex items-center justify-between px-2 text-[8px] sm:text-[9px] text-white font-bold shadow-md"
                  style={{ backgroundColor: activeGame.labelColor }}
                >
                  <span className="truncate">{activeGame.pixelArtIcon} {activeGame.title}</span>
                  <span className="text-[7px] text-yellow-300 opacity-90 hidden sm:inline">LOADED</span>
                </div>
              ) : (
                /* Slot is Empty */
                <div className="text-[8px] sm:text-[9px] text-neutral-400 text-center animate-pulse">
                  [ CLICK TO INSERT GAME ]
                </div>
              )}

              {/* Flap open visual overlay */}
              {isSlotOpen && (
                <div className="absolute inset-0 bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center">
                  <span className="text-[8px] text-yellow-300 bg-black/80 px-2 py-0.5 font-bold">
                    CHAMBER OPEN
                  </span>
                </div>
              )}
            </div>

            {/* Door push notch / instructional arrow */}
            <div className="flex justify-between items-center text-[7px] text-neutral-500">
              <span className="group-hover:text-red-700 flex items-center gap-1 font-bold">
                ▲ PUSH TO SWITCH GAMES
              </span>
              <span className="text-[6px] text-neutral-400">CHAMBER</span>
            </div>
          </button>

          {/* Right Top Black Vented Grille */}
          <div className="w-24 sm:w-28 bg-neutral-900 border-2 border-neutral-950 p-2 flex flex-col justify-between">
            <div className="space-y-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-full h-1 bg-neutral-800" />
              ))}
            </div>
            <div className="text-[6px] text-neutral-400 text-center tracking-widest font-mono">
              VENTILATION
            </div>
          </div>
        </div>

        {/* Lower Console Half: Power / Reset Buttons & Controller Ports */}
        <div className="mt-3 bg-neutral-800 p-2 sm:p-2.5 rounded-xs flex items-center justify-between border border-neutral-900 text-white">
          {/* Power & Reset Switch Area */}
          <div className="flex items-center gap-3">
            {/* Power Button */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleSlotClick}
                className="w-12 sm:w-14 h-6 sm:h-7 bg-neutral-350 hover:bg-neutral-300 text-neutral-900 text-[8px] font-bold border-2 border-neutral-600 pixel-outset active:scale-95 cursor-pointer flex items-center justify-center"
              >
                GAMES
              </button>
              <span className="text-[6px] text-neutral-400 mt-0.5 tracking-tighter">SELECT</span>
            </div>

            {/* Reset Button */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleReset}
                className="w-12 sm:w-14 h-6 sm:h-7 bg-neutral-350 hover:bg-neutral-300 text-neutral-900 text-[8px] font-bold border-2 border-neutral-600 pixel-outset active:scale-95 cursor-pointer flex items-center justify-center"
              >
                RESET
              </button>
              <span className="text-[6px] text-neutral-400 mt-0.5 tracking-tighter">RESET</span>
            </div>

            {/* Power LED Indicator */}
            <div className="flex flex-col items-center ml-1">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  activeGame
                    ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
                    : "bg-red-900"
                }`}
              />
              <span className="text-[6px] text-neutral-400 mt-0.5">POWER</span>
            </div>
          </div>

          {/* Controller Ports 1 & 2 */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-8 h-4 bg-neutral-950 border border-neutral-700 rounded-xs flex items-center justify-center">
                <div className="w-6 h-2 bg-neutral-900 flex justify-around items-center px-0.5">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-[1.5px] h-[1.5px] bg-neutral-600 rounded-full" />
                  ))}
                </div>
              </div>
              <span className="text-[6px] text-neutral-400 mt-0.5">PORT 1</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-4 bg-neutral-950 border border-neutral-700 rounded-xs flex items-center justify-center">
                <div className="w-6 h-2 bg-neutral-900 flex justify-around items-center px-0.5">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-[1.5px] h-[1.5px] bg-neutral-600 rounded-full" />
                  ))}
                </div>
              </div>
              <span className="text-[6px] text-neutral-400 mt-0.5">PORT 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
