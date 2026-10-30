"use client";

import React, { useEffect, useRef, useState } from "react";
import { GameDefinition } from "@/games/types";
import { ShopItem } from "./types";
import { INITIAL_SHOP_ITEMS } from "./shopCatalog";
import { playSound } from "../AudioEffects";
import CartridgeArt from "../CartridgeArt";

interface ShopModalProps {
  isOpen: boolean;
  playerPoints: number;
  games: GameDefinition[];
  unlockedGameIds: string[];
  onUnlockGame: (game: GameDefinition) => boolean;
  onSelectGame: (game: GameDefinition) => void;
  onClose: () => void;
  onPurchaseGame?: (item: ShopItem) => void;
}

export default function ShopModal({
  isOpen,
  playerPoints,
  games,
  unlockedGameIds,
  onUnlockGame,
  onSelectGame,
  onClose,
  onPurchaseGame,
}: ShopModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>(INITIAL_SHOP_ITEMS);
  const [shopNotice, setShopNotice] = useState<string | null>(null);

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

  const handleUnlockPlayableGame = (game: GameDefinition) => {
    const isUnlocked = unlockedGameIds.includes(game.id);
    if (isUnlocked) {
      playSound("insertCartridge");
      onSelectGame(game);
      onClose();
      return;
    }

    const price = game.price || 0;
    if (playerPoints < price) {
      playSound("blockHit");
      setShopNotice(
        `🔒 NOT ENOUGH POINTS! YOU HAVE ${playerPoints} PTS, NEED ${price} PTS FOR ${game.title.toUpperCase()}.`
      );
      setTimeout(() => setShopNotice(null), 2600);
      return;
    }

    const ok = onUnlockGame(game);
    if (ok) {
      playSound("coin");
      setShopNotice(`🎉 PURCHASED & UNLOCKED ${game.title.toUpperCase()}!`);
      setTimeout(() => setShopNotice(null), 2400);
    }
  };

  const handleBuyBonusItem = (item: ShopItem) => {
    if (item.isUnlocked) return;

    if (playerPoints < item.price) {
      playSound("blockHit");
      setShopNotice(
        `🔒 NOT ENOUGH POINTS! YOU HAVE ${playerPoints} PTS, NEED ${item.price} PTS.`
      );
      setTimeout(() => setShopNotice(null), 2600);
      return;
    }

    playSound("coin");
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
              RETRO GAME CARTRIDGE SHOP
            </h2>
          </div>
          <p className="text-[8px] sm:text-[9px] text-neutral-400 mt-1">
            Play Pixel Fruit Ninja to earn PTS and unlock Super Pixel Bros. & Tetris!
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

      {shopNotice && (
        <div className="mb-4 p-2 bg-amber-950/90 border-2 border-amber-400 text-amber-200 text-center text-[8px] sm:text-[9px] rounded animate-pulse">
          {shopNotice}
        </div>
      )}

      {/* PLAYABLE CARTRIDGES SHELF */}
      <div className="relative bg-neutral-950/70 p-3 sm:p-4 rounded border-2 border-neutral-800 mb-4">
        <div className="text-[9px] text-yellow-300 font-bold mb-3 flex items-center justify-between">
          <span>🎮 PLAYABLE ARCADE CARTRIDGES</span>
          <span className="text-[7px] text-emerald-400">
            UNLOCKED: {unlockedGameIds.length} / {games.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
          {games.map((game) => {
            const isUnlocked = unlockedGameIds.includes(game.id);
            const price = game.price || 0;
            const canAfford = playerPoints >= price;

            return (
              <div
                key={game.id}
                style={{ backgroundColor: game.cartridgeColor || "#1f2937" }}
                className="w-52 sm:w-56 border-2 border-neutral-700 rounded-xs p-3 flex flex-col justify-between shadow-lg relative"
              >
                <div className="flex justify-between items-center text-[6px] text-white/80 mb-1.5">
                  <span className="font-bold text-yellow-300">{game.genre}</span>
                  <span>{game.labelBadge}</span>
                </div>

                <CartridgeArt gameId={game.id} />

                <div className="my-2 space-y-1 text-left">
                  <div className="text-[10px] font-bold text-yellow-300 truncate">
                    {game.pixelArtIcon} {game.title}
                  </div>
                  <p className="text-[7px] text-neutral-200 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/20">
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => handleUnlockPlayableGame(game)}
                      className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-600 border border-emerald-400 text-white text-[8px] font-bold text-center cursor-pointer"
                    >
                      ✓ UNLOCKED - PLAY NOW ↵
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUnlockPlayableGame(game)}
                      className={`w-full py-1.5 px-2 text-[8px] font-bold text-center pixel-border-sm transition-all active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1 ${
                        canAfford
                          ? "bg-amber-500 hover:bg-amber-400 text-black animate-pulse"
                          : "bg-neutral-900 text-amber-400 border border-amber-700"
                      }`}
                    >
                      <span>🪙 {price} PTS</span>
                      <span>{canAfford ? "🔓 UNLOCK NOW" : "🔒 LOCKED"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full h-3 bg-[#3b2013] border-t-2 border-[#542f1d] mt-4 shadow-md" />
      </div>

      {/* Upcoming Collector Shelf */}
      <div className="relative bg-neutral-950/50 p-3 sm:p-4 rounded border border-neutral-800">
        <div className="text-[8px] text-neutral-400 font-bold mb-3">
          📦 COLLECTOR EDITION CARTRIDGES
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
          {shopItems.map((item) => {
            const canAfford = playerPoints >= item.price;
            return (
              <div
                key={item.id}
                className="w-44 sm:w-48 bg-neutral-800/90 border border-neutral-700 rounded-xs p-2.5 flex flex-col justify-between shadow"
              >
                <div
                  className="w-full h-20 rounded-xs border border-neutral-900 p-2 flex flex-col justify-between text-white"
                  style={{
                    background: `linear-gradient(135deg, ${item.labelColor} 0%, #000 100%)`,
                  }}
                >
                  <div className="flex justify-between text-[5px] text-neutral-300">
                    <span>COLLECTOR</span>
                    <span>{item.labelBadge}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-xl">{item.pixelArtIcon}</div>
                    <div className="text-[8px] font-bold text-yellow-300 truncate">
                      {item.title}
                    </div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-neutral-700/80">
                  {item.isUnlocked ? (
                    <div className="w-full py-1 bg-green-900/60 border border-green-600 text-green-300 text-[7px] font-bold text-center">
                      ✓ OWNED
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBuyBonusItem(item)}
                      className={`w-full py-1 px-2 text-[7px] font-bold text-center cursor-pointer ${
                        canAfford
                          ? "bg-amber-600 hover:bg-amber-500 text-stone-950"
                          : "bg-neutral-900 text-neutral-500 border border-neutral-700"
                      }`}
                    >
                      🪙 {item.price} PTS BUY
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </dialog>
  );
}
