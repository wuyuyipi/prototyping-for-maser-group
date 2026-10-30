"use client";

import React from "react";
import { ShopItem } from "./types";
import { playSound } from "../AudioEffects";
import CartridgeArt from "../CartridgeArt";

interface StoreDialogProps {
  item: ShopItem;
  playerPoints: number;
  onBuy: (item: ShopItem) => void;
  onClose: () => void;
}

function PixelCoin({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      className={`${className} inline-block shrink-0`}
      shapeRendering="crispEdges"
    >
      <rect x="4" y="1" width="6" height="12" fill="#475569" />
      <rect x="2" y="2" width="10" height="10" fill="#475569" />
      <rect x="1" y="4" width="12" height="6" fill="#475569" />
      <rect x="4" y="2" width="6" height="10" fill="#94a3b8" />
      <rect x="2" y="4" width="10" height="6" fill="#94a3b8" />
      <rect x="3" y="3" width="8" height="8" fill="#94a3b8" />
      <rect x="4" y="3" width="4" height="2" fill="#f8fafc" />
      <rect x="3" y="4" width="2" height="4" fill="#f8fafc" />
      <rect x="5" y="5" width="4" height="4" fill="#cbd5e1" />
      <rect x="6" y="6" width="2" height="2" fill="#64748b" />
    </svg>
  );
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

  const hasCustomArt =
    item.id === "fruit-ninja" ||
    item.id === "super-pixel-bros" ||
    item.id === "tetris" ||
    item.id === "pixel-pinball-88";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
      <div
        className="relative w-full max-w-md bg-neutral-900 border-2 rounded-lg p-5 shadow-2xl font-pixel text-neutral-100 flex flex-col gap-4"
        style={{ borderColor: item.accentColor }}
      >
        {/* Game Name Header */}
        <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-yellow-300 tracking-wider">
            {item.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[8px] rounded cursor-pointer"
          >
            [ESC]
          </button>
        </div>

        {/* Game Preview */}
        <div className="w-full flex justify-center">
          <div className="w-full h-36 rounded-lg border border-neutral-800 overflow-hidden shadow-xl flex items-center justify-center relative bg-black">
            {hasCustomArt ? (
              <div className="w-full h-full relative flex items-center justify-center">
                <CartridgeArt gameId={item.id} />
                <div className="absolute top-1.5 left-2 text-[6px] font-bold text-yellow-300 bg-black/60 px-1 py-0.5 rounded">
                  {item.labelBadge}
                </div>
              </div>
            ) : (
              <div
                className="w-full h-full p-3 flex flex-col justify-between text-white relative"
                style={{
                  background: `linear-gradient(135deg, ${item.labelColor} 0%, #050505 100%)`,
                }}
              >
                <div className="flex justify-between text-[7px] tracking-wider text-neutral-300">
                  <span className="font-bold text-yellow-300">CARTRIDGE PREVIEW</span>
                  <span>{item.labelBadge}</span>
                </div>

                <div className="flex flex-col items-center justify-center my-auto text-center">
                  <div className="text-sm font-bold text-yellow-300 max-w-[260px] drop-shadow">
                    {item.title}
                  </div>
                </div>

                <div className="text-[6px] text-neutral-400 font-mono text-center">
                  OFFICIAL RETRO ARCADE RELEASE
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coins Info */}
        <div className="bg-neutral-950 border border-neutral-800 p-3 rounded text-[8px] space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Cartridge Price:</span>
            <span className="text-yellow-400 font-bold flex items-center gap-1.5">
              <PixelCoin className="w-3.5 h-3.5" />
              <span>{item.price.toLocaleString()} PTS</span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Your Current Points:</span>
            <span className="text-neutral-200 font-bold">
              {playerPoints.toLocaleString()} PTS
            </span>
          </div>
          {!item.isUnlocked && (
            <div className="flex justify-between items-center border-t border-neutral-800 pt-2">
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

        {/* Buy Action */}
        <div className="pt-1">
          {item.isUnlocked ? (
            <button
              type="button"
              disabled
              className="w-full py-2.5 bg-green-950 border border-green-600 text-green-300 text-[8px] font-bold rounded cursor-default flex items-center justify-center shadow"
            >
              UNLOCKED
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePurchase}
              disabled={!canAfford}
              className={`w-full py-2.5 px-4 text-[9px] font-bold rounded transition-all flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 ${
                canAfford
                  ? "bg-amber-600 hover:bg-amber-500 text-neutral-950 shadow-[0_2px_0_0_#78350f]"
                  : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed opacity-80"
              }`}
            >
              <PixelCoin className="w-3.5 h-3.5" />
              <span>BUY FOR {item.price.toLocaleString()} PTS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
