"use client";

import React, { useState } from "react";
import { GameDefinition } from "../games/types";
import { playSound } from "./AudioEffects";

interface CrtMonitorProps {
  activeGame: GameDefinition | null;
  onEjectGame: () => void;
  onOpenCartridgeSlot: () => void;
  onEarnPoints?: (points: number) => void;
}

export default function CrtMonitor({
  activeGame,
  onEjectGame,
  onOpenCartridgeSlot,
  onEarnPoints,
}: CrtMonitorProps) {
  const [powerOn, setPowerOn] = useState(true);
  const [scanlines, setScanlines] = useState(true);

  const togglePower = () => {
    playSound("powerSwitch");
    setPowerOn((p) => !p);
  };

  return (
    <div className="relative w-full max-w-3xl md:max-w-4xl lg:max-w-[860px] flex flex-col items-center select-none font-pixel z-10">
      {/* Decorative Top Mushroom Figurine (matching reference photo) */}
      <div className="absolute -top-7 left-12 z-30 pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] animate-bounce duration-1000">
        <div className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,200,80,0.8)]">🍄</div>
      </div>

      {/* Main Vintage Cream-Beige CRT Television Chassis (matching reference photo) */}
      <div className="relative w-full bg-[#eae5d9] border-4 border-[#d5cfbf] rounded-2xl p-3 sm:p-4.5 shadow-[0_22px_55px_rgba(0,0,0,0.85)] ring-1 ring-black/10">
        {/* Retro Bezel Stickers & Badges */}
        {/* Top-Left: Vintage Script Brand Tag */}
        <div className="absolute top-2 left-4 text-[10px] text-amber-700 font-bold tracking-widest opacity-80 select-none italic">
          STÜSSY ★
        </div>

        {/* Top-Right: Cute Pixel Stickers (Heart, Coin, Mario) */}
        <div className="absolute top-1.5 right-4 flex items-center gap-1.5 z-20 pointer-events-none">
          {/* Heart Badge */}
          <div className="bg-white px-1.5 py-0.5 rounded border border-neutral-300 shadow-xs text-[9px] flex items-center">
            ❤️
          </div>
          {/* Smiley Coin Badge */}
          <div className="bg-white px-1.5 py-0.5 rounded border border-neutral-300 shadow-xs text-[9px] flex items-center">
            🪙
          </div>
          {/* Mini Mario Sticker */}
          <div className="text-sm drop-shadow-xs -ml-0.5">
            👨🏻‍🔧
          </div>
        </div>

        {/* Right Bezel: Yellow Question Mark Sticky Note */}
        <div className="absolute -right-3 top-20 bg-yellow-300 border border-yellow-500 shadow-md p-1.5 rotate-6 z-20 pointer-events-none flex items-center justify-center rounded-xs">
          <span className="text-neutral-900 font-bold text-xs">❓</span>
        </div>

        {/* CRT Screen Housing / Deep Inner Recess */}
        <div className="relative w-full bg-[#1b1c20] p-2 sm:p-3 rounded-xl border-4 border-[#cdc6b5] shadow-[inset_0_4px_12px_rgba(0,0,0,0.85)] mt-3">
          <div className="crt-screen-container relative w-full aspect-[4/3] max-h-[58vh] min-h-[300px] sm:min-h-[380px] md:min-h-[440px] flex items-center justify-center bg-black">
            {powerOn ? (
              activeGame ? (
                /* Active Game Display */
                <div className="w-full h-full relative z-10 crt-flicker bg-black flex flex-col items-center justify-between">
                  <activeGame.Component
                    onExit={onEjectGame}
                    onEarnPoints={onEarnPoints}
                  />
                </div>
              ) : (
                /* No Cartridge Inserted: Pure blank screen with subtle power standby glow */
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 text-emerald-400/60 font-pixel z-10 crt-flicker">
                  <div className="text-4xl mb-2 opacity-50">📺</div>
                  <div className="text-[11px] tracking-widest uppercase text-emerald-500/80">
                    NO CARTRIDGE LOADED
                  </div>
                  <p className="text-[9px] text-neutral-400 mt-2 max-w-sm">
                    Click the NES cartridge flap door or pick a cartridge from the stack to play
                  </p>
                </div>
              )
            ) : (
              /* Powered Off */
              <div className="w-full h-full bg-[#080808] flex items-center justify-center text-[9px] text-neutral-700 font-pixel">
                [ POWER OFF ]
              </div>
            )}

            {/* Scanlines & CRT curvature glass sheen */}
            {powerOn && scanlines && (
              <div className="crt-scanlines absolute inset-0 z-20 pointer-events-none" />
            )}
            <div className="crt-curvature absolute inset-0 z-30 pointer-events-none" />
          </div>
        </div>

        {/* Bottom TV Bezel: Minimal Icon Controls & Speaker Grill */}
        <div className="mt-2.5 pt-2 flex justify-between items-center px-3 text-neutral-700 border-t border-[#d8d2c2]">
          {/* Left: Molded Speaker Grill Slats */}
          <div className="flex gap-1.5 items-center">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-1.5 h-3 bg-[#c8c2b3] rounded-full shadow-inner" />
            ))}
          </div>

          {/* Center / Right: Icon-only Hardware Controls */}
          <div className="flex items-center gap-3">
            {/* Eject Icon Button (Only when cartridge is loaded) */}
            {activeGame && (
              <button
                type="button"
                onClick={onEjectGame}
                aria-label="Eject cartridge"
                title="Eject game cartridge"
                className="w-8 h-8 bg-[#ded8cb] hover:bg-[#d5cfbf] border border-[#beb8a8] hover:border-amber-600 text-amber-600 flex items-center justify-center rounded-xs transition-all active:scale-95 cursor-pointer shadow-xs text-xs font-bold"
              >
                ⏏
              </button>
            )}

            {/* Scanlines Toggle Icon Button */}
            <button
              type="button"
              onClick={() => {
                playSound("blip");
                setScanlines((s) => !s);
              }}
              aria-label="Toggle Scanlines"
              title={`Scanlines: ${scanlines ? "ON" : "OFF"}`}
              className={`w-8 h-8 flex items-center justify-center rounded-xs border transition-all active:scale-95 cursor-pointer text-xs ${
                scanlines
                  ? "bg-[#ded8cb] border-cyan-600/80 text-cyan-600 shadow-inner"
                  : "bg-[#ded8cb] border-[#beb8a8] text-neutral-500"
              }`}
            >
              📺
            </button>

            {/* Analog Rotary Dials (Molded) */}
            <div className="flex gap-1.5 items-center">
              <div
                title="Volume Dial"
                className="w-5.5 h-5.5 rounded-full bg-[#ded8cb] border border-[#beb8a8] shadow-inner flex items-center justify-center cursor-pointer hover:border-neutral-500"
              >
                <div className="w-0.5 h-2.5 bg-neutral-600 rotate-45 transform" />
              </div>
              <div
                title="Contrast Dial"
                className="w-5.5 h-5.5 rounded-full bg-[#ded8cb] border border-[#beb8a8] shadow-inner flex items-center justify-center cursor-pointer hover:border-neutral-500"
              >
                <div className="w-0.5 h-2.5 bg-neutral-600 -rotate-30 transform" />
              </div>
            </div>

            {/* Power Icon Button with LED */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#cdc6b5]">
              <button
                type="button"
                onClick={togglePower}
                aria-label="Power Button"
                title={powerOn ? "Turn TV Off" : "Turn TV On"}
                className={`w-8 h-8 rounded-xs border flex items-center justify-center text-xs transition-all active:scale-95 cursor-pointer ${
                  powerOn
                    ? "bg-[#ded8cb] border-emerald-600 text-emerald-600 shadow-inner"
                    : "bg-[#ded8cb] border-[#beb8a8] text-neutral-400"
                }`}
              >
                ⏻
              </button>
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  powerOn
                    ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                    : "bg-red-800"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TV Pedestal Base / Rubber Feet resting directly on the cutting mat */}
      <div className="w-56 sm:w-72 h-3 bg-[#ded9cb] border-x-2 border-b-2 border-[#b8b2a3] rounded-b-sm shadow-[0_12px_24px_rgba(0,0,0,0.65)] flex justify-between px-8">
        <div className="w-10 h-1 bg-[#1a1b20] rounded-full mt-1 opacity-70" />
        <div className="w-10 h-1 bg-[#1a1b20] rounded-full mt-1 opacity-70" />
      </div>
    </div>
  );
}
