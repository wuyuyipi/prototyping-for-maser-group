"use client";

import React, { useEffect, useRef, useState } from "react";
import { GameDefinition } from "../games/types";
import CartridgeItem from "./CartridgeItem";
import { playSound } from "./AudioEffects";

interface CartridgeModalProps {
  isOpen: boolean;
  games: GameDefinition[];
  activeGame: GameDefinition | null;
  unlockedGameIds: string[];
  playerPoints: number;
  onClose: () => void;
  onSelectGame: (game: GameDefinition) => void;
  onUnlockGame: (game: GameDefinition) => boolean;
}

export default function CartridgeModal({
  isOpen,
  games,
  activeGame,
  unlockedGameIds,
  playerPoints,
  onClose,
  onSelectGame,
  onUnlockGame,
}: CartridgeModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    playSound("eject");
    onClose();
  };

  const handleGameSelect = (game: GameDefinition) => {
    const isUnlocked = unlockedGameIds.includes(game.id);
    if (isUnlocked) {
      playSound("insertCartridge");
      onSelectGame(game);
      onClose();
      return;
    }

    const price = game.price || 0;
    if (playerPoints >= price) {
      const ok = onUnlockGame(game);
      if (ok) {
        playSound("coin");
        setNotice(`🎉 UNLOCKED ${game.title.toUpperCase()}!`);
        setTimeout(() => setNotice(null), 2000);
        onSelectGame(game);
        onClose();
      }
    } else {
      playSound("blockHit");
      setNotice(
        `🔒 NOT ENOUGH POINTS! ${game.title} COSTS ${price} PTS (YOU HAVE ${playerPoints} PTS)`
      );
      setTimeout(() => setNotice(null), 2500);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-labelledby="cartridge-modal-title"
      className="bg-neutral-900/95 text-neutral-100 border-4 border-neutral-700 p-4 sm:p-6 rounded-lg max-w-4xl w-[92vw] max-h-[88vh] overflow-y-auto pixel-border shadow-2xl m-auto backdrop:bg-black/80"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center border-b-2 border-neutral-700 pb-3 mb-4 gap-2">
        <div>
          <h2
            id="cartridge-modal-title"
            className="text-xs sm:text-sm font-bold text-yellow-300 font-pixel tracking-wider"
          >
            NES CARTRIDGE SLOT - SELECT OR UNLOCK GAME
          </h2>
          <p className="text-[8px] sm:text-[9px] text-neutral-400 font-pixel mt-1">
            Play unlocked games to earn PTS and unlock new cartridges!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-neutral-950 border-2 border-yellow-500 px-3 py-1.5 rounded font-pixel text-[9px] text-yellow-300 font-bold">
            🪙 {playerPoints.toLocaleString()} PTS
          </div>

          <button
            type="button"
            onClick={handleClose}
            autoFocus
            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-red-400 hover:text-red-300 font-pixel text-[10px] pixel-border-sm cursor-pointer"
          >
            ✕ CLOSE [ESC]
          </button>
        </div>
      </div>

      {notice && (
        <div className="mb-4 p-2 bg-amber-950/90 border-2 border-amber-400 text-amber-200 text-center font-pixel text-[8px] sm:text-[9px] rounded animate-pulse">
          {notice}
        </div>
      )}

      {/* Front-facing Cartridges Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-3 max-w-3xl mx-auto gap-6 justify-items-center py-3">
        {games.map((game) => {
          const isSelected = activeGame?.id === game.id;
          const isUnlocked = unlockedGameIds.includes(game.id);
          const price = game.price || 0;
          const canAfford = playerPoints >= price;

          return (
            <div key={game.id} className="flex flex-col items-center">
              <CartridgeItem
                game={game}
                view="front"
                isSelected={isSelected}
                isLocked={!isUnlocked}
                canAfford={canAfford}
                onSelect={handleGameSelect}
              />
              <div className="mt-2.5 text-center max-w-[180px]">
                <div className="text-[9px] font-pixel text-neutral-200 font-bold truncate">
                  {game.title}
                </div>
                <div className="text-[7px] font-pixel text-neutral-400 mt-0.5">
                  {game.description}
                </div>
                {!isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => handleGameSelect(game)}
                    className={`inline-block mt-1.5 text-[8px] px-3 py-1 rounded font-pixel font-bold cursor-pointer border ${
                      canAfford
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300 animate-pulse"
                        : "bg-neutral-800 text-amber-400 border-amber-700"
                    }`}
                  >
                    {canAfford
                      ? `🔓 BUY & PLAY (${price} PTS)`
                      : `🔒 LOCKED (${price} PTS)`}
                  </button>
                ) : isSelected ? (
                  <span className="inline-block mt-1.5 text-[7px] bg-red-900 text-yellow-300 px-2.5 py-1 rounded font-pixel">
                    ● INSERTED IN TV
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleGameSelect(game)}
                    className="inline-block mt-1.5 text-[8px] bg-emerald-800 hover:bg-yellow-400 hover:text-black text-white px-3 py-1 rounded font-pixel border border-emerald-500 cursor-pointer font-bold"
                  >
                    INSERT CARTRIDGE ↵
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-2 border-t border-neutral-700 text-right">
        <button
          type="button"
          onClick={handleClose}
          className="text-[8px] font-pixel text-neutral-400 hover:text-white underline cursor-pointer"
        >
          Return to Living Room
        </button>
      </div>
    </dialog>
  );
}
