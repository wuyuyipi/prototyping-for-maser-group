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
    <div className="relative w-full max-w-2xl lg:max-w-3xl flex flex-col items-center select-none font-pixel z-10">
      {/* Main CRT Television Chassis */}
      <div className="relative w-full bg-[#1c1d22] border-4 border-[#0e0f12] rounded-2xl p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
        {/* CRT Screen Area */}
        <div className="relative w-full bg-[#0a0c0e] p-2.5 sm:p-3 rounded-xl border-4 border-[#121418] shadow-inner">
          <div className="crt-screen-container relative w-full aspect-[4/3] max-h-[50vh] min-h-[240px] flex items-center justify-center bg-black">
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
                  <div className="text-3xl mb-2 opacity-50">📺</div>
                  <div className="text-[10px] tracking-widest uppercase text-emerald-500/80">
                    NO CARTRIDGE LOADED
                  </div>
                  <p className="text-[8px] text-neutral-500 mt-1">
                    Push the NES door or pick a cartridge from the pile
                  </p>
                </div>
              )
            ) : (
              /* Powered Off */
              <div className="w-full h-full bg-[#080808] flex items-center justify-center text-[8px] text-neutral-800 font-pixel">
                [ OFF ]
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
        <div className="mt-2.5 pt-1.5 flex justify-between items-center px-3 text-neutral-400 border-t border-neutral-800/80">
          {/* Left: Molded Speaker Grill Slats */}
          <div className="flex gap-1.5 items-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1 h-3 bg-neutral-900 rounded-full" />
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
                title="Eject game"
                className="w-7 h-7 bg-neutral-850 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-500 text-amber-400 flex items-center justify-center rounded-xs transition-all active:scale-95 cursor-pointer shadow-sm text-xs"
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
              className={`w-7 h-7 flex items-center justify-center rounded-xs border transition-all active:scale-95 cursor-pointer text-xs ${
                scanlines
                  ? "bg-neutral-800 border-cyan-500/80 text-cyan-300"
                  : "bg-neutral-850 border-neutral-700 text-neutral-500"
              }`}
            >
              📺
            </button>

            {/* Analog Rotary Dials (Molded) */}
            <div className="flex gap-1.5 items-center">
              <div
                title="Volume Dial"
                className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-950 flex items-center justify-center cursor-pointer hover:border-neutral-600"
              >
                <div className="w-0.5 h-2 bg-neutral-400 rotate-45 transform" />
              </div>
              <div
                title="Contrast Dial"
                className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-950 flex items-center justify-center cursor-pointer hover:border-neutral-600"
              >
                <div className="w-0.5 h-2 bg-neutral-400 -rotate-30 transform" />
              </div>
            </div>

            {/* Power Icon Button with LED */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-800">
              <button
                type="button"
                onClick={togglePower}
                aria-label="Power Button"
                title={powerOn ? "Turn TV Off" : "Turn TV On"}
                className={`w-7 h-7 rounded-xs border flex items-center justify-center text-xs transition-all active:scale-95 cursor-pointer ${
                  powerOn
                    ? "bg-neutral-800 border-emerald-500/80 text-emerald-400"
                    : "bg-neutral-850 border-neutral-700 text-red-500"
                }`}
              >
                ⏻
              </button>
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  powerOn
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    : "bg-red-800"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TV Pedestal Base / Rubber Feet resting on desk */}
      <div className="w-48 sm:w-64 h-2.5 bg-[#0e0f12] border-x-2 border-b-2 border-[#08090a] rounded-b-sm shadow-[0_12px_24px_rgba(0,0,0,0.95)] flex justify-between px-8">
        <div className="w-8 h-1 bg-[#1a1b20] rounded-full mt-0.5" />
        <div className="w-8 h-1 bg-[#1a1b20] rounded-full mt-0.5" />
      </div>
    </div>
  );
}
