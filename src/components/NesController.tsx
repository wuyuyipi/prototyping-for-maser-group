"use client";

import React from "react";
import { playSound } from "./AudioEffects";

export default function NesController() {
  const handleButtonPress = () => {
    playSound("blip");
  };

  return (
    <div className="relative flex items-center select-none font-pixel pointer-events-auto">
      {/* Black controller cord snaking to console */}
      <svg
        className="absolute -top-10 -left-6 w-24 h-14 pointer-events-none z-0"
        viewBox="0 0 100 60"
        fill="none"
      >
        <path
          d="M 10 5 C 30 15, 60 40, 85 55"
          stroke="#111827"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 10 5 C 30 15, 60 40, 85 55"
          stroke="#374151"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Controller Body */}
      <div className="relative z-10 w-44 sm:w-52 h-20 sm:h-22 bg-neutral-300 nes-bevel rounded-xs p-1.5 shadow-[0_12px_20px_rgba(0,0,0,0.85)] flex flex-col justify-between transform -rotate-1 hover:rotate-0 transition-transform">
        {/* Recessed Center Black Faceplate */}
        <div className="w-full h-full bg-neutral-900 border-2 border-neutral-950 p-2 flex items-center justify-between">
          {/* Left: D-Pad */}
          <div className="relative w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center">
            {/* Cross Base */}
            <div className="absolute w-12 sm:w-14 h-4 bg-neutral-800 border border-neutral-950 rounded-xs shadow-inner" />
            <div className="absolute w-4 h-12 sm:h-14 bg-neutral-800 border border-neutral-950 rounded-xs shadow-inner" />
            {/* Center Indent */}
            <div className="absolute w-3 h-3 rounded-full bg-neutral-900 border border-neutral-700 z-10" />
            {/* Direction Arrows */}
            <span className="absolute top-0 text-[6px] text-neutral-500 font-bold z-10">▲</span>
            <span className="absolute bottom-0 text-[6px] text-neutral-500 font-bold z-10">▼</span>
            <span className="absolute left-0.5 text-[6px] text-neutral-500 font-bold z-10">◀</span>
            <span className="absolute right-0.5 text-[6px] text-neutral-500 font-bold z-10">▶</span>
          </div>

          {/* Center: Select & Start Buttons */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="text-[6px] sm:text-[7px] text-red-600 font-bold tracking-tight">
              Nintendo
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleButtonPress}
                  aria-label="Select button"
                  className="w-5 h-2 bg-neutral-700 hover:bg-neutral-600 border border-neutral-950 rounded-full active:scale-90 cursor-pointer"
                />
                <span className="text-[5px] text-red-600 tracking-tighter mt-0.5">SELECT</span>
              </div>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleButtonPress}
                  aria-label="Start button"
                  className="w-5 h-2 bg-neutral-700 hover:bg-neutral-600 border border-neutral-950 rounded-full active:scale-90 cursor-pointer"
                />
                <span className="text-[5px] text-red-600 tracking-tighter mt-0.5">START</span>
              </div>
            </div>
          </div>

          {/* Right: Round Red B and A Buttons */}
          <div className="flex items-end gap-2 pr-1">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleButtonPress}
                aria-label="B button"
                className="w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 border-2 border-neutral-950 shadow-[0_2px_0_0_#991b1b] active:translate-y-0.5 cursor-pointer flex items-center justify-center text-[7px] text-white font-bold"
              >
                B
              </button>
            </div>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleButtonPress}
                aria-label="A button"
                className="w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 border-2 border-neutral-950 shadow-[0_2px_0_0_#991b1b] active:translate-y-0.5 cursor-pointer flex items-center justify-center text-[7px] text-white font-bold"
              >
                A
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
