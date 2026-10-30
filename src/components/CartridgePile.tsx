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
        <div className="absolute -top-9 left-0 bg-neutral-950/95 border-2 border-amber-400 text-amber-300 px-2.5 py-1 rounded text-[7px] sm:text-[8px] font-bold whitespace-nowrap shadow-[0_0_15px_rgba(251,191,36,0.6)] z-50 animate-bounce">
          {lockNotice}
        </div>
      )}

      {/* Title Tag */}
      <div className="flex items-center justify-between mb-1.5 text-[7px] text-amber-200/90 px-1 font-bold relative z-10">
        <span>CARTRIDGES ({unlockedGameIds.length}/{games.length} UNLOCKED)</span>
        <button
          type="button"
          onClick={onOpenCartridgeSlot}
          className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer text-[6px] ml-2"
        >
          [ALL DETAILS]
        </button>
      </div>

      {/* Standing Illustrated Mini-Cartridges on the Desk */}
      <div className="flex flex-row items-end gap-2 sm:gap-3 relative z-10">
        {games.map((game) => {
          const isCurrent = activeGame?.id === game.id;
          const isUnlocked = unlockedGameIds.includes(game.id);
          const price = game.price || 0;
          const canAfford = playerPoints >= price;
          const shellColor = game.cartridgeColor || "#374151";

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
                backgroundColor: shellColor,
                clipPath:
                  "polygon(0 0, 100% 0, 100% 95%, 93% 100%, 7% 100%, 0 95%)",
              }}
              className={`group relative w-28 sm:w-34 p-1.5 flex flex-col justify-between text-left cursor-pointer transition-all duration-150 pixel-border-sm shadow-[0_10px_18px_rgba(0,0,0,0.85)] ${
                isCurrent
                  ? "ring-2 ring-yellow-400 -translate-y-2 scale-[1.04]"
                  : "hover:-translate-y-2 hover:scale-[1.03]"
              }`}
            >
              {/* Top Cartridge Grip Ridges & Badge */}
              <div className="w-full h-3.5 bg-black/50 flex items-center justify-between px-1 mb-1 border-b border-black/80">
                <div className="flex gap-[2px]">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-[2px] h-2 bg-white/25" />
                  ))}
                </div>
                <span
                  className="text-[5px] font-bold px-1 rounded-xs text-black"
                  style={{ backgroundColor: game.accentColor }}
                >
                  {game.pixelArtIcon}
                </span>
              </div>

              {/* Custom Pixel-Art Game Illustration Cover */}
              <div className="relative w-full">
                <CartridgeArt gameId={game.id} compact />

                {/* Lock / Unlock Badge Overlay on Art if Locked */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-1 text-center">
                    <span
                      className={`text-[6px] sm:text-[7px] font-bold px-1.5 py-0.5 rounded border ${
                        canAfford
                          ? "bg-emerald-600 text-white border-emerald-300 animate-pulse"
                          : "bg-neutral-950/95 text-amber-300 border-amber-500"
                      }`}
                    >
                      {canAfford ? `🔓 BUY ${price}P` : `🔒 ${price} PTS`}
                    </span>
                  </div>
                )}

                {/* Active Indicator Badge */}
                {isCurrent && isUnlocked && (
                  <div className="absolute top-0.5 right-0.5 bg-yellow-400 text-black text-[5px] font-bold px-1 py-0.2 rounded-xs shadow">
                    IN TV
                  </div>
                )}
              </div>

              {/* Game Title Banner at Bottom of Cartridge */}
              <div
                className="w-full mt-1 px-1.5 py-1 border border-black flex items-center justify-between"
                style={{ backgroundColor: game.labelColor }}
              >
                <span className="text-[6px] sm:text-[7px] font-bold text-white truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                  {game.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
