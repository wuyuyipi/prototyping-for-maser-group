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
    <div className="relative w-64 sm:w-72 select-none font-pixel pointer-events-auto flex flex-col items-center">
      {/* ======================================================================
          Inserted Cartridge Sticking Out of Top Slot (like in reference photo)
          ====================================================================== */}
      <div
        onClick={handleDoorClick}
        title="Click to open cartridge slot and switch games"
        className="w-40 sm:w-44 -mb-1 z-20 cursor-pointer group transition-transform hover:-translate-y-1"
      >
        {activeGame ? (
          /* Actual NES Cartridge Sticking Out of Top Slot */
          <div className="relative w-full h-20 sm:h-24 bg-[#54585e] border-2 border-[#1c1e22] rounded-t-xs p-1.5 flex flex-col justify-between shadow-[0_-8px_16px_rgba(0,0,0,0.8)]">
            {/* Top Grip Grooves */}
            <div className="w-full h-3 bg-[#383a3f] flex items-center justify-around px-2 border-b border-[#232529]">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1.5 h-2 bg-[#202225] border-r border-[#4f5359]" />
              ))}
            </div>

            {/* Front Label on the visible sticking-out cartridge */}
            <div
              className="w-full flex-1 my-1 p-1.5 border border-black flex flex-col justify-between shadow-inner overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${activeGame.labelColor} 0%, #000 100%)`,
              }}
            >
              <div className="flex justify-between items-center text-[5px] text-neutral-300">
                <span className="font-bold text-yellow-300">ARCADE</span>
                <span>{activeGame.labelBadge}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center py-0.5">
                <span className="text-sm">{activeGame.pixelArtIcon}</span>
                <span className="text-[8px] font-bold text-yellow-300 truncate max-w-[100px]">
                  {activeGame.title}
                </span>
              </div>
              <div className="text-[5px] text-neutral-400 text-right">
                {activeGame.status === "ready" ? "● LOADED" : "SLOT"}
              </div>
            </div>

            {/* Lower Lip disappearing into console */}
            <div className="w-full h-1 bg-[#323438]" />
          </div>
        ) : (
          /* Empty Slot Guide */
          <div className="w-full h-6 bg-[#1a1b1e] border-2 border-[#2b2d32] border-b-0 rounded-t-xs flex items-center justify-center text-[7px] text-yellow-400/80 animate-pulse bg-black/60">
            ▲ [INSERT CARTRIDGE]
          </div>
        )}
      </div>

      {/* ======================================================================
          Authentic NES Console Body
          - Light grey top chassis (#cdd1d5)
          - Dark grey bottom base (#4b4f55)
          - Black horizontal stripe on the right with vertical vent ribs
          - Cartridge door on the left with red "Nintendo Entertainment System"
          - Power & Reset buttons + glowing red LED on lower left
          - Controller ports on lower right
          ====================================================================== */}
      <div className="w-full bg-[#cbd0d6] border-t-2 border-l-2 border-white/80 border-r-2 border-b-2 border-[#1c1e22] shadow-[0_20px_35px_rgba(0,0,0,0.9)] rounded-xs overflow-hidden">
        {/* UPPER SECTION (Light Grey with Cartridge Door & Black Ribbed Vents) */}
        <div className="flex w-full h-24 sm:h-28 border-b-4 border-[#18191c]">
          {/* Left: The Front Cartridge Flap Door (Clickable) */}
          <button
            type="button"
            onClick={handleDoorClick}
            aria-label="Open cartridge slot"
            title="Click to open cartridge slot"
            className="flex-1 bg-[#cbd0d6] hover:bg-[#d5d9de] border-r-4 border-[#18191c] p-2 sm:p-2.5 flex flex-col justify-between text-left cursor-pointer group active:brightness-95 transition-all relative"
          >
            {/* Top bevel groove */}
            <div className="w-full h-1 bg-[#9ea3aa] border-b border-white/50" />

            {/* Authentic Red NES Door Branding */}
            <div className="my-auto pl-1">
              <div className="text-[9px] sm:text-[10px] text-[#e01616] font-bold tracking-tight leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                Nintendo
              </div>
              <div className="text-[5px] sm:text-[6px] text-[#e01616] tracking-tight font-bold mt-0.5">
                ENTERTAINMENT SYSTEM™
              </div>
            </div>

            {/* Bottom finger lift notch / indicator */}
            <div className="flex justify-between items-center text-[6px] text-neutral-500 pt-1 border-t border-[#b0b5bc]">
              <span className="group-hover:text-red-600 font-bold">
                {isSlotOpen ? "▼ CHAMBER OPEN" : "▲ PUSH TO SWITCH"}
              </span>
              <span className="text-[5px] text-neutral-400">NES-001</span>
            </div>
          </button>

          {/* Right: Iconic Black Ribbed Vents Band */}
          <div className="w-24 sm:w-28 bg-[#18191c] p-2 flex flex-col justify-between border-l border-[#0d0e10]">
            {/* Vertical Ribbed Slats */}
            <div className="flex justify-around items-stretch h-14 sm:h-16 py-1">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-full bg-[#27292e] border-r border-[#0d0e10] shadow-inner"
                />
              ))}
            </div>
            <div className="w-full h-1 bg-[#0d0e10]" />
          </div>
        </div>

        {/* LOWER SECTION (Dark Grey Base with Buttons & Controller Ports) */}
        <div className="w-full bg-[#464a50] p-2 sm:p-2.5 flex items-center justify-between border-t-2 border-[#60656d]">
          {/* Lower Left: Power & Reset Switches + Red Power LED */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Power Switch */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleDoorClick}
                aria-label="Open cartridge slot"
                className="w-9 sm:w-10 h-4 sm:h-4.5 bg-[#cbd0d6] hover:bg-white text-neutral-900 text-[6px] font-bold border border-black pixel-outset active:scale-95 cursor-pointer flex items-center justify-center shadow"
              >
                GAMES
              </button>
              <span className="text-[5px] text-neutral-300 font-bold mt-0.5 tracking-tighter">
                POWER
              </span>
            </div>

            {/* Reset Switch */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset current game"
                className="w-9 sm:w-10 h-4 sm:h-4.5 bg-[#cbd0d6] hover:bg-white text-neutral-900 text-[6px] font-bold border border-black pixel-outset active:scale-95 cursor-pointer flex items-center justify-center shadow"
              >
                RESET
              </button>
              <span className="text-[5px] text-neutral-300 font-bold mt-0.5 tracking-tighter">
                RESET
              </span>
            </div>

            {/* Glowing Red LED */}
            <div className="flex flex-col items-center ml-0.5">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeGame
                    ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
                    : "bg-red-950"
                }`}
              />
              <span className="text-[4px] text-neutral-400 mt-1">LED</span>
            </div>
          </div>

          {/* Lower Right: Dual 7-Pin Controller Ports */}
          <div className="flex items-center gap-2 pr-1">
            {/* Port 1 */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-4 bg-[#121316] border border-[#2b2d32] rounded-xs flex items-center justify-center shadow-inner">
                <div className="flex justify-around items-center w-5 h-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-0.5 h-1 bg-[#50545c]" />
                  ))}
                </div>
              </div>
              <span className="text-[5px] text-neutral-400 mt-0.5">1</span>
            </div>

            {/* Port 2 */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-4 bg-[#121316] border border-[#2b2d32] rounded-xs flex items-center justify-center shadow-inner">
                <div className="flex justify-around items-center w-5 h-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-0.5 h-1 bg-[#50545c]" />
                  ))}
                </div>
              </div>
              <span className="text-[5px] text-neutral-400 mt-0.5">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
