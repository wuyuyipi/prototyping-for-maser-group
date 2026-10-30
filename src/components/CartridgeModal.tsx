"use client";

import React, { useEffect, useRef } from "react";
import { GameDefinition } from "../games/types";
import CartridgeItem from "./CartridgeItem";
import { playSound } from "./AudioEffects";

interface CartridgeModalProps {
  isOpen: boolean;
  games: GameDefinition[];
  activeGame: GameDefinition | null;
  onClose: () => void;
  onSelectGame: (game: GameDefinition) => void;
}

export default function CartridgeModal({
  isOpen,
  games,
  activeGame,
  onClose,
  onSelectGame,
}: CartridgeModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Sync native <dialog> state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle native close events (e.g. Escape key)
  const handleClose = () => {
    playSound("eject");
    onClose();
  };

  const handleGameSelect = (game: GameDefinition) => {
    playSound("insertCartridge");
    onSelectGame(game);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-labelledby="cartridge-modal-title"
      className="bg-neutral-900 text-neutral-100 border-4 border-neutral-700 p-4 sm:p-6 rounded-lg max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto pixel-border shadow-2xl m-auto"
    >
      {/* Modal Header */}
      <div className="flex justify-between items-start border-b-2 border-neutral-700 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📂</span>
            <h2
              id="cartridge-modal-title"
              className="text-xs sm:text-sm font-bold text-yellow-300 font-pixel tracking-wider"
            >
              NES CARTRIDGE SLOT - CHOOSE GAME
            </h2>
          </div>
          <p className="text-[9px] sm:text-[10px] text-neutral-400 font-pixel mt-1">
            Select a front-facing game cartridge to load into the console.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          autoFocus
          aria-label="Close cartridge slot"
          className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-red-400 hover:text-red-300 font-pixel text-xs pixel-border-sm cursor-pointer"
        >
          ✕ CLOSE [ESC]
        </button>
      </div>

      {/* Front-Facing Cartridge Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center py-2">
        {games.map((game) => {
          const isSelected = activeGame?.id === game.id;
          return (
            <div key={game.id} className="flex flex-col items-center">
              <CartridgeItem
                game={game}
                view="front"
                isSelected={isSelected}
                onSelect={handleGameSelect}
              />
              <div className="mt-2 text-center max-w-[200px]">
                <div className="text-[10px] font-pixel text-neutral-300 font-bold truncate">
                  {game.title}
                </div>
                <div className="text-[8px] font-pixel text-neutral-500">
                  By {game.author} ({game.year})
                </div>
                {isSelected ? (
                  <span className="inline-block mt-1 text-[8px] bg-red-900/80 text-yellow-300 px-2 py-0.5 rounded font-pixel">
                    ● INSERTED
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleGameSelect(game)}
                    className="inline-block mt-1 text-[8px] bg-neutral-800 hover:bg-yellow-500 hover:text-black text-neutral-300 px-2 py-1 rounded font-pixel transition-colors border border-neutral-700 cursor-pointer"
                  >
                    INSERT GAME
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Footer / Teammate Instructions */}
      <div className="mt-6 pt-3 border-t-2 border-neutral-700 flex flex-col sm:flex-row justify-between items-center text-[9px] text-neutral-400 font-pixel gap-2">
        <span>🎮 TEAM COLLABORATION: Add new games in `src/games/`</span>
        <button
          type="button"
          onClick={handleClose}
          className="text-yellow-400 hover:underline cursor-pointer"
        >
          Back to NES Console
        </button>
      </div>
    </dialog>
  );
}
