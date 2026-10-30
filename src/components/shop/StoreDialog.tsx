"use client";

import React from "react";
import { ShopItem } from "./types";
import { playSound } from "../AudioEffects";

interface StoreDialogProps {
  item: ShopItem;
  playerPoints: number;
  onBuy: (item: ShopItem) => void;
  onClose: () => void;
}

export default function StoreDialog({
  item,
  playerPoints,
  onBuy,
  onClose,
}: StoreDialogProps) {
  const canAfford = playerPoints >= item.price;
  const remaining = playerPoints - item.price;

  const handlePurchase = () => {
    if (item.isUnlocked) return;
    if (!canAfford) {
      playSound("blip");
      alert(
        `Not enough points! You have ${playerPoints} PTS, but this cartridge costs ${item.price} PTS.`
      );
      return;
    }
    onBuy(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div
        className="relative w-full max-w-lg bg-neutral-900 border-4 rounded-lg p-5 shadow-2xl pixel-border font-pixel text-neutral-100 flex flex-col gap-4"
        style={{ borderColor: item.accentColor }}
      >
        {/* Top Header */}
        <div className="flex justify-between items-center border-b-2 border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.storeSignIcon}</span>
            <div>
              <h3 className="text-xs font-bold text-yellow-300 tracking-wider">
                {item.storeName}
              </h3>
              <p className="text-[7px] text-neutral-400">{item.storeSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-red-400 text-[8px] pixel-border-sm cursor-pointer"
          >
            ✕ [ESC]
          </button>
        </div>

        {/* Clerk Greeting Section */}
        <div className="bg-neutral-950 border border-neutral-800 rounded p-3 flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xl shrink-0 shadow-inner">
            🧑‍💼
          </div>
          <div className="space-y-1">
            <div className="text-[7px] font-bold text-amber-400">
              {item.clerkName} (Shopkeeper):
            </div>
            <p className="text-[8px] text-neutral-300 leading-relaxed italic">
              &quot;{item.clerkGreeting}&quot;
            </p>
          </div>
        </div>

        {/* Cartridge Showcase */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-neutral-950/60 border border-neutral-800 p-3 rounded">
          {/* Cartridge Box Art */}
          <div
            className="w-36 h-28 rounded border-2 border-neutral-800 p-2 flex flex-col justify-between text-white shadow-lg shrink-0 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${item.labelColor} 0%, #050505 100%)`,
            }}
          >
            <div className="flex justify-between text-[6px] tracking-wider text-neutral-300">
              <span className="font-bold text-yellow-300">RETRO CARTRIDGE</span>
              <span>{item.labelBadge}</span>
            </div>

            <div className="flex flex-col items-center justify-center my-auto text-center">
              <div className="text-2xl mb-1 filter drop-shadow">
                {item.pixelArtIcon}
              </div>
              <div className="text-[9px] font-bold text-yellow-300 truncate max-w-[120px]">
                {item.title}
              </div>
            </div>

            <div className="text-[6px] text-neutral-400 truncate">
              {item.genre}
            </div>
          </div>

          {/* Details & Specs */}
          <div className="flex flex-col justify-between flex-1 text-left space-y-2">
            <div>
              <div className="text-[9px] font-bold text-yellow-300">
                {item.title}
              </div>
              <div className="text-[7px] text-neutral-400 mb-1.5">
                Genre: <span className="text-neutral-200">{item.genre}</span> • By{" "}
                <span className="text-neutral-300">{item.author}</span>
              </div>
              <p className="text-[7px] text-neutral-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Price & Balance Economics */}
            <div className="bg-neutral-900 border border-neutral-800 p-2 rounded text-[7px] space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-400">Cartridge Price:</span>
                <span className="text-yellow-400 font-bold">
                  🪙 {item.price.toLocaleString()} PTS
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Your Current Points:</span>
                <span className="text-neutral-200">
                  {playerPoints.toLocaleString()} PTS
                </span>
              </div>
              {!item.isUnlocked && (
                <div className="flex justify-between border-t border-neutral-800 pt-1">
                  <span className="text-neutral-400">Remaining Balance:</span>
                  <span
                    className={
                      canAfford ? "text-green-400 font-bold" : "text-red-400 font-bold"
                    }
                  >
                    {canAfford
                      ? `${remaining.toLocaleString()} PTS`
                      : `Missing ${(item.price - playerPoints).toLocaleString()} PTS`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          {item.isUnlocked ? (
            <button
              type="button"
              disabled
              className="flex-1 py-2.5 bg-green-950 border border-green-600 text-green-300 text-[8px] font-bold rounded cursor-default flex items-center justify-center gap-1.5 shadow"
            >
              <span>✓</span>
              <span>CARTRIDGE UNLOCKED & IN YOUR COLLECTION</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePurchase}
              disabled={!canAfford}
              className={`flex-1 py-2.5 px-4 text-[9px] font-bold rounded pixel-border-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 ${
                canAfford
                  ? "bg-amber-600 hover:bg-amber-500 text-neutral-950 shadow-[0_2px_0_0_#78350f]"
                  : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed opacity-80"
              }`}
            >
              <span>🪙 BUY FOR {item.price} PTS</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[8px] font-bold rounded pixel-border-sm cursor-pointer transition-colors"
          >
            CONTINUE WALKING ➔
          </button>
        </div>
      </div>
    </div>
  );
}
