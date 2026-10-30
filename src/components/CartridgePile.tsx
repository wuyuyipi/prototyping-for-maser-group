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
}: CartridgePileProps) {
  const [confirmGame, setConfirmGame] = useState<GameDefinition | null>(null);

  const handleCartridgeClick = (game: GameDefinition) => {
    const isUnlocked = unlockedGameIds.includes(game.id);
    if (isUnlocked) {
      playSound("insertCartridge");
      onSelectGame(game);
      return;
    }

    // Open confirmation modal for locked cartridge
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

      {/* Cartridge Stack on the right desk surface */}
      <div className="flex flex-col space-y-2 relative z-10">
        {games.map((game, idx) => {
          const isCurrent = activeGame?.id === game.id;
          const isUnlocked = unlockedGameIds.includes(game.id);
          const price = game.price || 0;
          // Locked cartridges are grey!
          const shellColor = isUnlocked
            ? game.cartridgeColor || "#4b4e54"
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
                zIndex: 10 + idx,
                backgroundColor: shellColor,
              }}
              className={`w-56 sm:w-64 h-12 sm:h-13 rounded-xs border-t border-l border-[#787a82] border-b-2 border-r-2 border-[#222428] flex items-center px-2 cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.85)] text-left select-none transition-all duration-150 active:translate-x-1 ${
                isCurrent && isUnlocked
                  ? "ring-2 ring-yellow-400 -translate-x-1"
                  : "hover:-translate-y-0.5 hover:brightness-110"
              } ${!isUnlocked ? "grayscale opacity-85" : ""}`}
            >
              {/* Left Grip Ridges */}
              <div className="flex gap-[2px] mr-2 shrink-0">
                <div className="w-[2px] h-7 bg-[#25272c]" />
                <div className="w-[2px] h-7 bg-[#25272c]" />
                <div className="w-[2px] h-7 bg-[#25272c]" />
              </div>

              {/* Mini Pixel-Art Thumbnail inside Cartridge */}
              <div className="w-12 h-8 mr-2 shrink-0 overflow-hidden rounded-xs border border-black">
                <CartridgeArt gameId={game.id} compact />
              </div>

              {/* Spine / Face Label */}
              <div
                className="flex-1 h-8 flex items-center justify-between px-2 text-[8px] font-bold text-white shadow-inner border border-[#1a191d] overflow-hidden rounded-xs"
                style={{
                  backgroundColor: isUnlocked ? game.labelColor : "#3f3f46",
                }}
              >
                <div className="flex flex-col truncate">
                  <span className="truncate tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] text-[7px] sm:text-[8px]">
                    {game.pixelArtIcon} {game.title}
                  </span>
                  {!isUnlocked && (
                    <span className="text-[5px] text-amber-300 tracking-wider">
                      🔒 PURCHASE REQUIRED ({price} PTS)
                    </span>
                  )}
                </div>

                {/* Status Badges */}
                {isCurrent && isUnlocked && (
                  <span className="text-[6px] text-yellow-300 ml-1 shrink-0 bg-black/80 px-1 py-0.5 rounded-xs font-bold border border-yellow-500/50">
                    IN NES
                  </span>
                )}

                {!isUnlocked && (
                  <span className="text-[6px] ml-1 shrink-0 px-1.5 py-0.5 rounded-xs font-bold bg-neutral-900 text-neutral-200 border border-neutral-500">
                    BUY
                  </span>
                )}
              </div>

              {/* Right Grip Ridges */}
              <div className="flex gap-[2px] ml-2 shrink-0">
                <div className="w-[2px] h-7 bg-[#25272c]" />
                <div className="w-[2px] h-7 bg-[#25272c]" />
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
