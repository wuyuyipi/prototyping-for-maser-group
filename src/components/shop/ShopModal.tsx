"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShopItem } from "./types";
import { INITIAL_SHOP_ITEMS } from "./shopCatalog";
import { playSound } from "../AudioEffects";

interface ShopModalProps {
  isOpen: boolean;
  playerPoints: number;
  onClose: () => void;
  onPurchaseGame?: (item: ShopItem) => void;
}

export default function ShopModal({
  isOpen,
  playerPoints,
  onClose,
  onPurchaseGame,
}: ShopModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>(INITIAL_SHOP_ITEMS);

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
    playSound("blip");
    onClose();
  };

  const handleBuy = (item: ShopItem) => {
    if (item.isUnlocked) return;

    if (playerPoints < item.price) {
      playSound("blip");
      alert(`Not enough points! You have ${playerPoints} PTS, but this game costs ${item.price} PTS.`);
      return;
    }

    playSound("coin");
    // Mark as unlocked locally and callback
    setShopItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isUnlocked: true } : i))
    );
    onPurchaseGame?.(item);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-labelledby="shop-modal-title"
      className="bg-neutral-900/95 text-neutral-100 border-4 border-amber-600/90 p-4 sm:p-6 rounded-lg max-w-4xl w-[94vw] max-h-[88vh] overflow-y-auto pixel-border shadow-2xl m-auto backdrop:bg-black/85 font-pixel select-none"
    >
      {/* Shop Header */}
      <div className="flex flex-wrap justify-between items-center border-b-2 border-neutral-700 pb-3 mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <h2
              id="shop-modal-title"
              className="text-xs sm:text-sm font-bold text-yellow-300 tracking-wider"
            >
              RETRO GAME SHOP
            </h2>
          </div>
          <p className="text-[8px] sm:text-[9px] text-neutral-400 mt-1">
            Exchange points earned from playing games to unlock new cartridges for your collection!
          </p>
        </div>

        {/* Current Balance & Close Button */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-950 border-2 border-yellow-500/80 px-3 py-1.5 rounded flex items-center gap-1.5 shadow-inner">
            <span className="text-yellow-400 text-xs">🪙</span>
            <span className="text-[10px] text-yellow-300 font-bold">
              {playerPoints.toLocaleString()} PTS
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            autoFocus
            aria-label="Close shop"
            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-red-400 hover:text-red-300 text-[10px] pixel-border-sm cursor-pointer"
          >
            ✕ [ESC]
          </button>
        </div>
      </div>

      {/* Developer Notice for Collaborator */}
      <div className="bg-amber-950/40 border border-amber-600/60 p-2.5 rounded mb-4 text-[8px] text-amber-200/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span>
          🛠️ <strong>SHOP COLLABORATOR PLACEHOLDER</strong>: Files live in{" "}
          <code className="text-yellow-300">src/components/shop/</code>. Ready for your custom shop UI & game unlocking logic!
        </span>
      </div>

      {/* Game Cartridges Shelf */}
      <div className="relative bg-neutral-950/70 p-3 sm:p-4 rounded border-2 border-neutral-800">
        {/* Wooden Shelf Graphic Top Lip */}
        <div className="w-full h-2 bg-[#452718] border-b border-[#2d180d] mb-4 shadow" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
          {shopItems.map((item) => {
            const canAfford = playerPoints >= item.price;
            return (
              <div
                key={item.id}
                className="w-48 sm:w-52 bg-neutral-800/90 border-2 border-neutral-700 rounded-xs p-3 flex flex-col justify-between shadow-lg relative group"
              >
                {/* Cartridge Preview Box Art */}
                <div
                  className="w-full h-28 rounded-xs border-2 border-neutral-900 p-2 flex flex-col justify-between text-white shadow-inner"
                  style={{
                    background: `linear-gradient(135deg, ${item.labelColor} 0%, #000 100%)`,
                  }}
                >
                  <div className="flex justify-between text-[6px] tracking-wider text-neutral-300">
                    <span className="font-bold text-yellow-300">SHOP EXCLUSIVE</span>
                    <span>{item.labelBadge}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center my-auto text-center">
                    <div className="text-3xl mb-1 filter drop-shadow">
                      {item.pixelArtIcon}
                    </div>
                    <div className="text-[10px] font-bold text-yellow-300 truncate max-w-[150px]">
                      {item.title}
                    </div>
                  </div>

                  <div className="text-[6px] text-neutral-300 truncate">
                    {item.genre}
                  </div>
                </div>

                {/* Details */}
                <div className="my-2 space-y-1 text-left">
                  <p className="text-[7px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="text-[6px] text-neutral-500">
                    By {item.author}
                  </div>
                </div>

                {/* Buy Button / Price Tag */}
                <div className="pt-2 border-t border-neutral-700/80">
                  {item.isUnlocked ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-1.5 bg-green-900/60 border border-green-600 text-green-300 text-[8px] font-bold text-center cursor-default"
                    >
                      ✓ UNLOCKED
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBuy(item)}
                      className={`w-full py-1.5 px-2 text-[8px] font-bold text-center pixel-border-sm transition-all active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1 ${
                        canAfford
                          ? "bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-[0_2px_0_0_#78350f]"
                          : "bg-neutral-800 text-neutral-500 border border-neutral-700 hover:bg-neutral-750"
                      }`}
                    >
                      <span>🪙 {item.price} PTS</span>
                      <span className="text-[7px] opacity-80">BUY</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Wooden Shelf Graphic Base */}
        <div className="w-full h-3 bg-[#3b2013] border-t-2 border-[#542f1d] mt-4 shadow-md" />
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-neutral-800 flex justify-between items-center text-[7px] text-neutral-500">
        <span>EARN POINTS BY PLAYING RETRO GAMES</span>
        <button
          type="button"
          onClick={handleClose}
          className="text-amber-400 hover:underline cursor-pointer"
        >
          Back to Living Room
        </button>
      </div>
    </dialog>
  );
}
