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
    playSound("insertCartridge");
    onSelectGame(game);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-labelledby="cartridge-modal-title"
      className="bg-neutral-900/95 text-neutral-100 border-4 border-neutral-700 p-4 sm:p-6 rounded-lg max-w-4xl w-[92vw] max-h-[85vh] overflow-y-auto pixel-border shadow-2xl m-auto backdrop:bg-black/80"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-neutral-700 pb-3 mb-4">
        <div>
          <h2
            id="cartridge-modal-title"
            className="text-xs sm:text-sm font-bold text-yellow-300 font-pixel tracking-wider"
          >
            NES CARTRIDGE SLOT - SELECT GAME
          </h2>
          <p className="text-[8px] sm:text-[9px] text-neutral-400 font-pixel mt-1">
            Click any front-facing game to load it into the NES console.
          </p>
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

      {/* Front-facing Cartridges Showcase */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center py-2">
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
              <div className="mt-2 text-center max-w-[160px]">
                <div className="text-[9px] font-pixel text-neutral-200 font-bold truncate">
                  {game.title}
                </div>
                <div className="text-[7px] font-pixel text-neutral-400">
                  {game.author}
                </div>
                {isSelected ? (
                  <span className="inline-block mt-1 text-[7px] bg-red-900 text-yellow-300 px-2 py-0.5 rounded font-pixel">
                    ● INSERTED
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleGameSelect(game)}
                    className="inline-block mt-1 text-[7px] bg-neutral-800 hover:bg-yellow-500 hover:text-black text-neutral-300 px-2 py-0.5 rounded font-pixel border border-neutral-700 cursor-pointer"
                  >
                    INSERT
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
