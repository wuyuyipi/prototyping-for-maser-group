"use client";

import React from "react";
import { GameDefinition } from "../games/types";
import { playSound } from "./AudioEffects";

interface NesConsoleProps {
  activeGame: GameDefinition | null;
  isSlotOpen: boolean;
  onOpenCartridgeSlot: () => void;
  onResetGame?: () => void;
}

export default function NesConsole({
  activeGame,
  isSlotOpen,
  onOpenCartridgeSlot,
  onResetGame,
}: NesConsoleProps) {
  const handleDoorClick = () => {
    playSound("slotOpen");
    onOpenCartridgeSlot();
  };

  const handleReset = () => {
    playSound("blip");
    onResetGame?.();
  };

  return (
    <div className="relative w-56 sm:w-64 bg-neutral-300 nes-bevel p-2 rounded-xs shadow-[0_15px_30px_rgba(0,0,0,0.9)] select-none font-pixel pointer-events-auto">
      {/* Upper Chassis */}
      <div className="bg-neutral-350 p-2 rounded-xs border border-neutral-400">
        <div className="flex gap-2 min-h-[75px] sm:min-h-[85px]">
          {/* Cartridge Door Section (Clickable) */}
          <button
            type="button"
            onClick={handleDoorClick}
            aria-label="Open cartridge slot"
            title="Click to open cartridge chamber and choose game"
            className="flex-1 bg-neutral-300 hover:bg-neutral-250 border-2 border-neutral-400 p-1.5 flex flex-col justify-between text-left cursor-pointer group active:scale-[0.99] transition-all relative overflow-hidden"
          >
            {/* Door Red Badge */}
            <div className="flex justify-between items-center text-[6px] sm:text-[7px] text-red-600 font-bold tracking-tight">
              <span>NINTENDO</span>
              <span className="text-[5px] text-neutral-500 font-mono">ENTERTAINMENT SYSTEM</span>
            </div>

            {/* Cartridge Door Interior / Slot */}
            <div className="w-full h-9 sm:h-11 bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center p-1 relative overflow-hidden">
              {activeGame ? (
                /* Inserted cartridge spine visible */
                <div
                  className="w-full h-full flex items-center justify-between px-1.5 text-[7px] text-white font-bold shadow-md"
                  style={{ backgroundColor: activeGame.labelColor }}
                >
                  <span className="truncate">{activeGame.pixelArtIcon} {activeGame.title}</span>
                  <span className="text-[6px] text-yellow-300 opacity-90">INSERTED</span>
                </div>
              ) : (
                /* Empty chamber */
                <div className="text-[6px] sm:text-[7px] text-neutral-400 text-center animate-pulse">
                  [ CLICK TO OPEN SLOT ]
                </div>
              )}

              {/* Open Flap Indicator */}
              {isSlotOpen && (
                <div className="absolute inset-0 bg-yellow-400/25 border-2 border-yellow-400 flex items-center justify-center">
                  <span className="text-[7px] text-yellow-300 bg-black/85 px-1.5 py-0.5 font-bold">
                    CHAMBER OPEN
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Flap Push Notch */}
            <div className="flex justify-between items-center text-[6px] text-neutral-500 pt-0.5">
              <span className="group-hover:text-red-600 font-bold flex items-center gap-0.5">
                ▲ CARTRIDGE SLOT
              </span>
              <span className="text-[5px] text-neutral-400">PUSH</span>
            </div>
          </button>

          {/* Right Vent Black Plastic */}
          <div className="w-16 sm:w-20 bg-neutral-900 border-2 border-neutral-950 p-1.5 flex flex-col justify-between">
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-1 bg-neutral-800" />
              ))}
            </div>
            <div className="text-[5px] text-neutral-500 text-center font-mono">
              VENT
            </div>
          </div>
        </div>

        {/* Lower Console Front: Power / Reset / Ports */}
        <div className="mt-2 bg-neutral-800 p-1.5 rounded-xs flex items-center justify-between border border-neutral-950 text-white">
          <div className="flex items-center gap-2">
            {/* Power Switch */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleDoorClick}
                className="w-10 sm:w-11 h-5 bg-neutral-300 hover:bg-neutral-200 text-neutral-900 text-[6px] font-bold border border-neutral-600 pixel-outset active:scale-95 cursor-pointer flex items-center justify-center"
              >
                GAMES
              </button>
              <span className="text-[5px] text-neutral-400 mt-0.5">SLOT</span>
            </div>

            {/* Reset Switch */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleReset}
                className="w-10 sm:w-11 h-5 bg-neutral-300 hover:bg-neutral-200 text-neutral-900 text-[6px] font-bold border border-neutral-600 pixel-outset active:scale-95 cursor-pointer flex items-center justify-center"
              >
                RESET
              </button>
              <span className="text-[5px] text-neutral-400 mt-0.5">RESET</span>
            </div>

            {/* Power Red LED */}
            <div className="flex flex-col items-center ml-0.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  activeGame
                    ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
                    : "bg-red-950"
                }`}
              />
              <span className="text-[5px] text-neutral-400 mt-0.5">PWR</span>
            </div>
          </div>

          {/* Controller 7-pin Ports */}
          <div className="flex items-center gap-1.5">
            <div className="flex flex-col items-center">
              <div className="w-6 h-3 bg-neutral-950 border border-neutral-700 rounded-xs flex items-center justify-center">
                <div className="w-4 h-1.5 bg-neutral-900 flex justify-around items-center px-0.5">
                  <div className="w-[1px] h-[1px] bg-neutral-600" />
                  <div className="w-[1px] h-[1px] bg-neutral-600" />
                  <div className="w-[1px] h-[1px] bg-neutral-600" />
                </div>
              </div>
              <span className="text-[5px] text-neutral-500 mt-0.5">1</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-6 h-3 bg-neutral-950 border border-neutral-700 rounded-xs flex items-center justify-center">
                <div className="w-4 h-1.5 bg-neutral-900 flex justify-around items-center px-0.5">
                  <div className="w-[1px] h-[1px] bg-neutral-600" />
                  <div className="w-[1px] h-[1px] bg-neutral-600" />
                  <div className="w-[1px] h-[1px] bg-neutral-600" />
                </div>
              </div>
              <span className="text-[5px] text-neutral-500 mt-0.5">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
