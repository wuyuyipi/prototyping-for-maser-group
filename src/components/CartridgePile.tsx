"use client";

import React from "react";
import { GameDefinition } from "../games/types";
import { playSound } from "./AudioEffects";

interface CartridgePileProps {
  games: GameDefinition[];
  activeGame: GameDefinition | null;
  onSelectGame: (game: GameDefinition) => void;
  onOpenCartridgeSlot: () => void;
}

export default function CartridgePile({
  games,
  activeGame,
  onSelectGame,
  onOpenCartridgeSlot,
}: CartridgePileProps) {
  const handleSelect = (game: GameDefinition) => {
    playSound("insertCartridge");
    onSelectGame(game);
  };

  return (
    <div className="relative flex flex-col justify-end select-none font-pixel pointer-events-auto">
      {/* Title Tag */}
      <div className="flex items-center justify-between mb-1 text-[7px] text-amber-200/90 px-1 font-bold">
        <span>CARTRIDGE PILE ({games.length})</span>
        <button
          type="button"
          onClick={onOpenCartridgeSlot}
          className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer text-[6px]"
        >
          [FRONT VIEW]
        </button>
      </div>

      {/* Cartridge Stack: layered on top of each other */}
      <div className="flex flex-col -space-y-3 sm:-space-y-4 max-w-xs sm:max-w-sm">
        {games.map((game, idx) => {
          const isCurrent = activeGame?.id === game.id;
          return (
            <div
              key={game.id}
              style={{ zIndex: 10 + idx }}
              className="relative transition-transform duration-150 hover:-translate-y-2 hover:scale-[1.02]"
            >
              <button
                type="button"
                onClick={() => handleSelect(game)}
                title={`Load ${game.title} into NES`}
                className={`w-52 sm:w-60 h-9 sm:h-10 bg-neutral-600 hover:bg-neutral-500 rounded-xs pixel-border-sm flex items-center px-2 cursor-pointer shadow-[0_8px_12px_rgba(0,0,0,0.8)] text-left select-none active:translate-x-1 ${
                  isCurrent ? "ring-2 ring-yellow-400 bg-neutral-500" : ""
                }`}
              >
                {/* Left Grip Ridges */}
                <div className="flex gap-[2px] mr-2 shrink-0">
                  <div className="w-[2px] h-5 bg-neutral-800" />
                  <div className="w-[2px] h-5 bg-neutral-800" />
                  <div className="w-[2px] h-5 bg-neutral-800" />
                </div>

                {/* Spine Label */}
                <div
                  className="flex-1 h-6 flex items-center justify-between px-2 text-[8px] font-bold text-white shadow-inner border border-neutral-900 overflow-hidden"
                  style={{ backgroundColor: game.labelColor }}
                >
                  <div className="flex items-center gap-1 truncate">
                    <span className="text-[10px]">{game.pixelArtIcon}</span>
                    <span className="truncate tracking-wide">{game.title}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[6px] text-yellow-300 ml-1 shrink-0 bg-black/60 px-1 py-0.2">
                      IN NES
                    </span>
                  )}
                </div>

                {/* Right Grip Ridges */}
                <div className="flex gap-[2px] ml-2 shrink-0">
                  <div className="w-[2px] h-5 bg-neutral-800" />
                  <div className="w-[2px] h-5 bg-neutral-800" />
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
