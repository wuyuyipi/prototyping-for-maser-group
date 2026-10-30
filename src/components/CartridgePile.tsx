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
}: CartridgePileProps) {
  const handleSelect = (game: GameDefinition) => {
    playSound("insertCartridge");
    onSelectGame(game);
  };

  return (
    <div className="relative flex flex-col justify-end select-none font-pixel pointer-events-auto">
      {/* Soft table contact shadow beneath the cartridge stack on the purple mat */}
      <div className="absolute -bottom-2 inset-x-2 h-4 bg-black/60 rounded-full filter blur-xs pointer-events-none" />

      {/* Cartridge Stack: layered on top of each other on the cutting mat */}
      <div className="flex flex-col -space-y-3 sm:-space-y-3.5 max-w-xs sm:max-w-sm mb-1 relative z-10">
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
                className={`w-52 sm:w-60 h-9 sm:h-10 bg-[#54565c] hover:bg-[#62646c] rounded-xs border-t border-l border-[#787a82] border-b-2 border-r-2 border-[#2b2c30] flex items-center px-2 cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.85)] text-left select-none active:translate-x-1 ${
                  isCurrent ? "ring-2 ring-yellow-400 bg-[#62646c]" : ""
                }`}
              >
                {/* Left Grip Ridges */}
                <div className="flex gap-[2px] mr-2 shrink-0">
                  <div className="w-[2px] h-5 bg-[#323337]" />
                  <div className="w-[2px] h-5 bg-[#323337]" />
                  <div className="w-[2px] h-5 bg-[#323337]" />
                </div>

                {/* Spine Label with rich ambient-lit color */}
                <div
                  className="flex-1 h-6 flex items-center justify-between px-2 text-[8px] font-bold text-white shadow-inner border border-[#1a191d] overflow-hidden"
                  style={{ backgroundColor: game.labelColor }}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[10px]">{game.pixelArtIcon}</span>
                    <span className="truncate tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      {game.title}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="text-[6px] text-yellow-300 ml-1 shrink-0 bg-black/80 px-1 py-0.5 rounded-xs">
                      IN NES
                    </span>
                  )}
                </div>

                {/* Right Grip Ridges */}
                <div className="flex gap-[2px] ml-2 shrink-0">
                  <div className="w-[2px] h-5 bg-[#323337]" />
                  <div className="w-[2px] h-5 bg-[#323337]" />
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
