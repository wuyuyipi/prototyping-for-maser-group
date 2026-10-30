"use client";

import React from "react";
import { GameDefinition } from "../games/types";
import CartridgeItem from "./CartridgeItem";
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
    <div className="flex-1 min-w-[280px] max-w-md bg-neutral-900/80 p-3 sm:p-4 rounded-xs border-2 border-neutral-700 shadow-xl font-pixel">
      {/* Shelf / Pile Header */}
      <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-neutral-800 text-neutral-300">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-xs">📼</span>
          <h2 className="text-[10px] sm:text-xs font-bold tracking-wider text-yellow-300">
            GAME CARTRIDGES ({games.length})
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenCartridgeSlot}
          className="text-[8px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
        >
          [FRONT VIEW]
        </button>
      </div>

      {/* Cartridge Stack List */}
      <div className="flex flex-col gap-2 relative">
        {games.map((game) => {
          const isCurrent = activeGame?.id === game.id;
          return (
            <div key={game.id} className="relative">
              <CartridgeItem
                game={game}
                view="spine"
                isSelected={isCurrent}
                onSelect={handleSelect}
              />
              {isCurrent && (
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 text-yellow-400 text-[10px] animate-pulse">
                  ▶
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Pile Base / Desk Shelf Accent */}
      <div className="mt-4 pt-2 border-t border-neutral-800 flex justify-between items-center text-[7px] text-neutral-500">
        <span>CLICK ANY TO INSERT INTO NES</span>
        <span className="text-yellow-500/80">STACK READY</span>
      </div>
    </div>
  );
}
