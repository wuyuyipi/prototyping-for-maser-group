"use client";

import React, { useState } from "react";
import { GameDefinition } from "../games/types";
import { playSound } from "./AudioEffects";
import CartridgeArt from "./CartridgeArt";

interface CartridgePileProps {
  games: GameDefinition[];
  activeGame: GameDefinition | null;
  unlockedGameIds: string[];
  playerPoints: number;
  onSelectGame: (game: GameDefinition) => void;
  onUnlockGame: (game: GameDefinition) => boolean;
  onOpenCartridgeSlot: () => void;
}

export default function CartridgePile({
  games,
  activeGame,
  unlockedGameIds,
  onSelectGame,
}: CartridgePileProps) {
  // Only show the cartridges the user owns in the desk pile.
  // When a new cartridge (like Pixel Fruits) is bought from the shop, it is added here!
  const ownedGames = games.filter((game) => unlockedGameIds.includes(game.id));

  const handleCartridgeClick = (game: GameDefinition) => {
    playSound("insertCartridge");
    onSelectGame(game);
  };

  return (
    <div className="relative flex flex-col justify-end select-none font-pixel pointer-events-auto">
      {/* Soft table contact shadow beneath the cartridges on the purple cutting mat */}
      <div className="absolute -bottom-2 inset-x-2 h-4 bg-black/60 rounded-full filter blur-xs pointer-events-none" />

      {/* Cartridge Stack: Horizontally-oriented cartridges stacked vertically on the right desk surface */}
      <div className="flex flex-col space-y-1.5 sm:space-y-2 relative z-10">
        {ownedGames.map((game, idx) => {
          const isCurrent = activeGame?.id === game.id;
          const shellColor = game.cartridgeColor || "#4b4e54";

          return (
            <button
              key={game.id}
              type="button"
              onClick={() => handleCartridgeClick(game)}
              title={`Load ${game.title} into NES`}
              style={{
                zIndex: 10 + idx,
                backgroundColor: shellColor,
              }}
              className={`w-52 sm:w-60 h-10 sm:h-11 rounded-xs border-t border-l border-[#787a82] border-b-2 border-r-2 border-[#222428] flex items-center px-2 cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.85)] text-left select-none transition-all duration-150 active:translate-x-1 ${
                isCurrent
                  ? "ring-2 ring-yellow-400 bg-[#5c5f66] -translate-x-1"
                  : "hover:-translate-y-0.5 hover:brightness-110"
              }`}
            >
              {/* Left Grip Ridges */}
              <div className="flex gap-[2px] mr-2 shrink-0">
                <div className="w-[2px] h-6 bg-[#25272c]" />
                <div className="w-[2px] h-6 bg-[#25272c]" />
                <div className="w-[2px] h-6 bg-[#25272c]" />
              </div>

              {/* Spine / Face Label */}
              <div
                className="flex-1 h-7 flex items-center justify-between px-2 text-[8px] font-bold text-white shadow-inner border border-[#1a191d] overflow-hidden rounded-xs"
                style={{ backgroundColor: game.labelColor }}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[11px] shrink-0">{game.pixelArtIcon}</span>
                  <span className="truncate tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] text-[7px] sm:text-[8px]">
                    {game.title}
                  </span>
                </div>

                {/* Current game inserted badge */}
                {isCurrent && (
                  <span className="text-[6px] text-yellow-300 ml-1.5 shrink-0 bg-black/80 px-1 py-0.5 rounded-xs font-bold border border-yellow-500/50">
                    IN NES
                  </span>
                )}
              </div>

              {/* Right Grip Ridges */}
              <div className="flex gap-[2px] ml-2 shrink-0">
                <div className="w-[2px] h-6 bg-[#25272c]" />
                <div className="w-[2px] h-6 bg-[#25272c]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
