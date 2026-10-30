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
      {/* Main Dark Retro CRT Television Chassis */}
      <div className="relative w-full bg-[#1c1d22] border-4 border-[#0e0f12] rounded-2xl p-3 sm:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.95)] ring-1 ring-white/5">
        {/* CRT Screen Housing / Deep Inner Recess */}
        <div className="relative w-full bg-[#0a0c0e] p-2.5 sm:p-3 rounded-xl border-4 border-[#121418] shadow-inner">
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
              <div className="w-full h-full bg-[#080808] flex items-center justify-center text-[9px] text-neutral-800 font-pixel">
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
        <div className="mt-2.5 pt-2 flex justify-between items-center px-3 text-neutral-400 border-t border-neutral-800/80">
          {/* Left: Molded Speaker Grill Slats */}
          <div className="flex gap-1.5 items-center">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-1.5 h-3 bg-neutral-900 rounded-full shadow-inner" />
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
                className="w-8 h-8 bg-neutral-850 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-500 text-amber-400 flex items-center justify-center rounded-xs transition-all active:scale-95 cursor-pointer shadow-xs text-xs font-bold"
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
                  ? "bg-neutral-800 border-cyan-500/80 text-cyan-300 shadow-inner"
                  : "bg-neutral-850 border-neutral-700 text-neutral-500"
              }`}
            >
              📺
            </button>

            {/* Analog Rotary Dials (Molded) */}
            <div className="flex gap-1.5 items-center">
              <div
                title="Volume Dial"
                className="w-5.5 h-5.5 rounded-full bg-neutral-800 border border-neutral-950 shadow-inner flex items-center justify-center cursor-pointer hover:border-neutral-600"
              >
                <div className="w-0.5 h-2.5 bg-neutral-400 rotate-45 transform" />
              </div>
              <div
                title="Contrast Dial"
                className="w-5.5 h-5.5 rounded-full bg-neutral-800 border border-neutral-950 shadow-inner flex items-center justify-center cursor-pointer hover:border-neutral-600"
              >
                <div className="w-0.5 h-2.5 bg-neutral-400 -rotate-30 transform" />
              </div>
            </div>

            {/* Power Icon Button with LED */}
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
              <button
                type="button"
                onClick={togglePower}
                aria-label="Power Button"
                title={powerOn ? "Turn TV Off" : "Turn TV On"}
                className={`w-8 h-8 rounded-xs border flex items-center justify-center text-xs transition-all active:scale-95 cursor-pointer ${
                  powerOn
                    ? "bg-neutral-800 border-emerald-500/80 text-emerald-400 shadow-inner"
                    : "bg-neutral-850 border-neutral-700 text-red-500"
                }`}
              >
                ⏻
              </button>
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  powerOn
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    : "bg-red-800"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TV Pedestal Base / Rubber Feet resting directly on the cutting mat */}
      <div className="w-56 sm:w-72 h-3 bg-[#0e0f12] border-x-2 border-b-2 border-[#08090a] rounded-b-sm shadow-[0_14px_28px_rgba(0,0,0,0.95)] flex justify-between px-8">
        <div className="w-10 h-1 bg-[#1a1b20] rounded-full mt-1 opacity-70" />
        <div className="w-10 h-1 bg-[#1a1b20] rounded-full mt-1 opacity-70" />
      </div>
    </div>
  );
}
