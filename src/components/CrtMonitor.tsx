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
  const [scanlines, setScanlines] = useState(true);

  const togglePower = () => {
    playSound("powerSwitch");
    setPowerOn((p) => !p);
  };

  return (
    <div className="relative w-full max-w-2xl lg:max-w-3xl flex flex-col items-center select-none font-pixel z-10">
      {/* Vintage Dual Antenna on top */}
      <div className="flex items-end justify-center gap-12 w-full -mb-3 z-0 pointer-events-none opacity-80">
        <div className="w-1 h-12 bg-neutral-600 rotate-[-25deg] transform origin-bottom border-r border-neutral-400" />
        <div className="w-1.5 h-3 bg-neutral-800 rounded-t-xs" />
        <div className="w-1 h-14 bg-neutral-600 rotate-[22deg] transform origin-bottom border-l border-neutral-400" />
      </div>

      {/* Main CRT Television Chassis */}
      <div className="relative w-full bg-[#1c1d22] border-4 border-[#0e0f12] rounded-2xl p-3 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
        {/* Top Trim with Brand Badge */}
        <div className="flex justify-between items-center mb-2 px-1 border-b border-neutral-800 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] sm:text-[10px] tracking-widest text-neutral-400 font-bold">
              SONY TRINITRON
            </span>
            <span className="text-[7px] bg-red-950 text-red-400 border border-red-800 px-1 py-0.2 rounded-xs font-mono">
              COLOR VIDEO
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[8px] text-neutral-500 hidden sm:inline">CH 03</span>
            <div className="flex items-center gap-1">
              <span className="text-[7px] text-neutral-500">POWER</span>
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  powerOn
                    ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                    : "bg-red-800"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Screen Bezel & Display Area */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Recessed Curved CRT Screen (4:3 aspect ratio) */}
          <div className="relative flex-1 w-full bg-[#0a0c0e] p-2.5 sm:p-3 rounded-xl border-4 border-[#121418] shadow-inner">
            <div className="crt-screen-container relative w-full aspect-[4/3] max-h-[46vh] min-h-[220px] flex items-center justify-center bg-black">
              {powerOn ? (
                activeGame ? (
                  /* Active Game Interface: Blank placeholder for whoever builds it */
                  <div className="w-full h-full relative z-10 crt-flicker bg-black flex flex-col items-center justify-between p-3">
                    <activeGame.Component onExit={onEjectGame} />
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

          {/* CRT Hardware Controls Column on Right (Classic Analog TV Style) */}
          <div className="w-full sm:w-20 flex sm:flex-col justify-between items-center sm:items-stretch py-1 px-2 bg-neutral-900 border-2 border-neutral-950 rounded-lg gap-2 text-[7px] text-neutral-400">
            {/* Power Toggle Button */}
            <button
              type="button"
              onClick={togglePower}
              className={`py-1.5 px-2 text-center font-bold pixel-border-sm cursor-pointer transition-transform active:translate-y-0.5 ${
                powerOn
                  ? "bg-emerald-900/60 text-emerald-300 border border-emerald-600"
                  : "bg-red-950 text-red-400 border border-red-800"
              }`}
            >
              {powerOn ? "PWR ON" : "PWR OFF"}
            </button>

            {/* Scanlines Toggle */}
            <button
              type="button"
              onClick={() => {
                playSound("blip");
                setScanlines((s) => !s);
              }}
              className="py-1 px-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-center pixel-border-sm cursor-pointer active:translate-y-0.5"
            >
              SCAN: {scanlines ? "ON" : "OFF"}
            </button>

            {/* Eject Cartridge Button */}
            {activeGame && (
              <button
                type="button"
                onClick={onEjectGame}
                className="py-1 px-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 text-center pixel-border-sm cursor-pointer active:translate-y-0.5"
              >
                ⏏ EJECT
              </button>
            )}

            {/* Rotary Dials / Speaker Slats */}
            <div className="flex sm:flex-col items-center justify-center gap-1.5 pt-1 border-t border-neutral-800">
              <div className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-950 flex items-center justify-center">
                <div className="w-0.5 h-2 bg-neutral-400" />
              </div>
              <span className="text-[6px] text-neutral-500">VOL</span>
            </div>

            {/* Speaker slats */}
            <div className="hidden sm:flex flex-col gap-1 items-center pt-1 border-t border-neutral-800">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-1 bg-neutral-950 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
