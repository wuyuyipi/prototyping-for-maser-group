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
  playerPoints,
  onSelectGame,
  onUnlockGame,
  onOpenCartridgeSlot,
}: CartridgePileProps) {
  const [lockNotice, setLockNotice] = useState<string | null>(null);

  const handleCartridgeClick = (game: GameDefinition) => {
    const isUnlocked = unlockedGameIds.includes(game.id);
    if (isUnlocked) {
      playSound("insertCartridge");
      onSelectGame(game);
      return;
    }

    const price = game.price || 0;
    if (playerPoints >= price) {
      const success = onUnlockGame(game);
      if (success) {
        playSound("coin");
        setLockNotice(`🎉 UNLOCKED ${game.title.toUpperCase()}!`);
        setTimeout(() => setLockNotice(null), 2200);
        onSelectGame(game);
      }
    } else {
      playSound("blockHit");
      setLockNotice(
        `🔒 NEED ${price} PTS TO UNLOCK ${game.title.toUpperCase()}! (HAVE ${playerPoints} PTS)`
      );
      setTimeout(() => setLockNotice(null), 2500);
    }
  };

  return (
    <div className="relative flex flex-col justify-end select-none font-pixel pointer-events-auto">
      {/* Soft table contact shadow beneath the cartridges on the purple cutting mat */}
      <div className="absolute -bottom-2 inset-x-2 h-4 bg-black/60 rounded-full filter blur-xs pointer-events-none" />

      {/* Floating Notice when clicking a locked cartridge */}
      {lockNotice && (
        <div className="absolute -top-9 right-0 bg-neutral-950/95 border-2 border-amber-400 text-amber-300 px-2.5 py-1 rounded text-[7px] sm:text-[8px] font-bold whitespace-nowrap shadow-[0_0_15px_rgba(251,191,36,0.6)] z-50 animate-bounce">
          {lockNotice}
        </div>
      )}

      {/* Cartridge Stack: Horizontally-oriented cartridges stacked vertically on the right desk surface */}
      <div className="flex flex-col space-y-1.5 sm:space-y-2 relative z-10">
        {games.map((game, idx) => {
          const isCurrent = activeGame?.id === game.id;
          const isUnlocked = unlockedGameIds.includes(game.id);
          const price = game.price || 0;
          const canAfford = playerPoints >= price;
          const shellColor = game.cartridgeColor || "#4b4e54";

          return (
            <button
              key={game.id}
              type="button"
              onClick={() => handleCartridgeClick(game)}
              title={
                isUnlocked
                  ? `Load ${game.title} into NES`
                  : `Unlock ${game.title} for ${price} PTS`
              }
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

                {/* Status Badges */}
                {isCurrent && isUnlocked && (
                  <span className="text-[6px] text-yellow-300 ml-1.5 shrink-0 bg-black/80 px-1 py-0.5 rounded-xs font-bold border border-yellow-500/50">
                    IN NES
                  </span>
                )}

                {!isUnlocked && (
                  <span
                    className={`text-[6px] ml-1.5 shrink-0 px-1 py-0.5 rounded-xs font-bold border ${
                      canAfford
                        ? "bg-emerald-600 text-white border-emerald-300 animate-pulse"
                        : "bg-black/85 text-amber-300 border-amber-500/80"
                    }`}
                  >
                    {canAfford ? `🔓 BUY ${price}P` : `🔒 ${price}P`}
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
