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
  const [confirmGame, setConfirmGame] = useState<GameDefinition | null>(null);

  const handleCartridgeClick = (game: GameDefinition) => {
    const isUnlocked = unlockedGameIds.includes(game.id);
    if (isUnlocked) {
      playSound("insertCartridge");
      onSelectGame(game);
      return;
    }

    // Open purchase confirmation dialog for locked cartridge
    playSound("blip");
    setConfirmGame(game);
  };

  const handleConfirmPurchase = () => {
    if (!confirmGame) return;
    const price = confirmGame.price || 0;
    if (playerPoints < price) {
      playSound("blockHit");
      return;
    }
    const success = onUnlockGame(confirmGame);
    if (success) {
      playSound("coin");
      const unlocked = confirmGame;
      setConfirmGame(null);
      onSelectGame(unlocked);
    }
  };

  return (
    <div className="relative flex flex-col justify-end select-none font-pixel pointer-events-auto">
      {/* Soft table contact shadow beneath the cartridges on the purple cutting mat */}
      <div className="absolute -bottom-2 inset-x-2 h-4 bg-black/60 rounded-full filter blur-xs pointer-events-none" />

      {/* Title Tag */}
      <div className="flex items-center justify-between mb-1.5 text-[7px] text-amber-200/90 px-1 font-bold relative z-10">
        <span>
          CARTRIDGES ({unlockedGameIds.length}/{games.length} UNLOCKED)
        </span>
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
          // Locked cartridges are grey!
          const shellColor = isUnlocked
            ? game.cartridgeColor || "#374151"
            : "#52525b";

          return (
            <button
              key={game.id}
              type="button"
              onClick={() => handleCartridgeClick(game)}
              title={
                isUnlocked
                  ? `Load ${game.title} into NES`
                  : `Purchase required: ${game.title} (${price} PTS)`
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
                  style={{
                    backgroundColor: isUnlocked ? game.accentColor : "#a1a1aa",
                  }}
                >
                  {game.pixelArtIcon}
                </span>
              </div>

              {/* Custom Pixel-Art Game Illustration Cover (Greyscale if locked) */}
              <div className="relative w-full">
                <div className={!isUnlocked ? "grayscale opacity-65" : ""}>
                  <CartridgeArt gameId={game.id} compact />
                </div>

                {/* Grey Locked Overlay with "PURCHASE REQUIRED" Badge */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-neutral-900/65 flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-[5px] sm:text-[6px] font-bold px-1.5 py-0.5 rounded bg-neutral-950/95 text-neutral-200 border border-neutral-400 leading-tight">
                      🔒 PURCHASE
                      <br />
                      <span className="text-amber-300">🪙 {price} PTS</span>
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
                style={{
                  backgroundColor: isUnlocked ? game.labelColor : "#3f3f46",
                }}
              >
                <span className="text-[6px] sm:text-[7px] font-bold text-white truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                  {game.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Purchase Confirmation Dialog Box */}
      {confirmGame && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border-4 border-amber-400 p-4 sm:p-5 rounded-md max-w-xs w-full text-center shadow-[0_0_30px_rgba(251,191,36,0.45)] space-y-3">
            <div className="text-amber-300 text-[10px] sm:text-xs font-bold tracking-wider border-b border-neutral-700 pb-2">
              🔒 PURCHASE CARTRIDGE?
            </div>

            <div className="text-white text-[10px] sm:text-xs font-bold">
              {confirmGame.pixelArtIcon} {confirmGame.title}
            </div>

            <div className="bg-neutral-950 border-2 border-neutral-700 p-2.5 rounded text-[8px] sm:text-[9px] space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">COST TO UNLOCK:</span>
                <span className="text-amber-300 font-bold">
                  🪙 {confirmGame.price || 0} PTS
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">CURRENT POINTS:</span>
                <span className="text-emerald-300 font-bold">
                  🪙 {playerPoints} PTS
                </span>
              </div>
              <div className="border-t border-neutral-800 pt-1.5 flex justify-between items-center">
                <span className="text-neutral-400">STATUS:</span>
                {playerPoints >= (confirmGame.price || 0) ? (
                  <span className="text-emerald-400 font-bold">
                    READY TO BUY
                  </span>
                ) : (
                  <span className="text-red-400 font-bold">
                    NEED {(confirmGame.price || 0) - playerPoints} MORE PTS
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={playerPoints < (confirmGame.price || 0)}
                className={`flex-1 py-2 px-2 rounded text-[8px] sm:text-[9px] font-bold border-2 transition-all ${
                  playerPoints >= (confirmGame.price || 0)
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300 cursor-pointer active:translate-y-0.5"
                    : "bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed"
                }`}
              >
                ✓ CONFIRM BUY
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound("blip");
                  setConfirmGame(null);
                }}
                className="flex-1 py-2 px-2 bg-neutral-800 hover:bg-neutral-700 text-red-300 border-2 border-neutral-600 rounded text-[8px] sm:text-[9px] font-bold cursor-pointer active:translate-y-0.5"
              >
                ✕ CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
