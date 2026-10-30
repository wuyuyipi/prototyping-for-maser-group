"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GAMES_REGISTRY } from "@/games/registry";
import { GameDefinition } from "@/games/types";
import CrtMonitor from "@/components/CrtMonitor";
import NesConsole from "@/components/NesConsole";
import CartridgePile from "@/components/CartridgePile";
import CartridgeModal from "@/components/CartridgeModal";
import ShopModal from "@/components/shop/ShopModal";
import { ShopItem } from "@/components/shop/types";
import { playSound } from "@/components/AudioEffects";

export default function RetroLivingRoomPage() {
  const [games] = useState<GameDefinition[]>(GAMES_REGISTRY);
  // Initially only the first game (Fruit Ninja) is unlocked; later 2 games require points!
  const [unlockedGameIds, setUnlockedGameIds] = useState<string[]>(() =>
    GAMES_REGISTRY.filter((g) => g.initiallyUnlocked !== false).map((g) => g.id)
  );
  // Default to first game (Pixel Fruit Ninja)
  const [activeGame, setActiveGame] = useState<GameDefinition | null>(games[0]);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  // Initial points set to 1,250 coins
  const [playerPoints, setPlayerPoints] = useState<number>(1250);
  const [recentPointsGain, setRecentPointsGain] = useState<{
    amount: number;
    id: number;
  } | null>(null);
  const [pointsHighlight, setPointsHighlight] = useState(false);

  const handleOpenSlot = () => {
    setIsSlotModalOpen(true);
  };

  const handleCloseSlot = () => {
    setIsSlotModalOpen(false);
  };

  const handleSelectGame = (game: GameDefinition) => {
    if (!unlockedGameIds.includes(game.id)) return;
    setActiveGame(game);
  };

  const handleUnlockGame = (game: GameDefinition): boolean => {
    if (unlockedGameIds.includes(game.id)) return true;
    const price = game.price || 0;
    if (playerPoints < price) return false;
    setPlayerPoints((prev) => Math.max(0, prev - price));
    setUnlockedGameIds((prev) => [...prev, game.id]);
    return true;
  };

  const handleEjectGame = () => {
    playSound("eject");
    setActiveGame(null);
  };

  const handlePurchaseGame = (item: ShopItem) => {
    setPlayerPoints((prev) => Math.max(0, prev - item.price));
    setUnlockedGameIds((prev) =>
      prev.includes(item.id) ? prev : [...prev, item.id]
    );
  };

  const handleEarnPoints = (pts: number) => {
    if (pts <= 0) return;
    setPlayerPoints((prev) => prev + pts);
    setRecentPointsGain({ amount: pts, id: Date.now() + Math.random() });
    setPointsHighlight(true);
    setTimeout(() => {
      setPointsHighlight(false);
    }, 650);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden select-none bg-neutral-950 flex flex-col justify-between font-pixel">
      {/* ======================================================================
          Cozy Room Background (Warm cream wall with art & doodles, purple cutting mat desk)
          ====================================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/retro_room_bg.jpg"
          alt="Cozy retro creative studio room with lilac cutting mat desk and warm doodle wall"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.95] contrast-[1.02]"
        />
        {/* Subtle warm ambient vignette */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/35" />
      </div>

      {/* ======================================================================
          Top Bar: Floating Game Shop Button & Animated Total Points
          ====================================================================== */}
      <header className="relative z-30 w-full px-4 sm:px-6 py-2 flex justify-end items-center text-[8px] sm:text-[9px]">
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => {
              playSound("coin");
              setIsShopModalOpen(true);
            }}
            aria-label="Open Game Shop"
            title="Open shop shelf to buy new games with points"
            className={`bg-neutral-900/90 hover:bg-neutral-800 text-yellow-300 px-3 py-1.5 rounded border-2 pixel-border-sm cursor-pointer transition-all duration-200 flex items-center gap-2 active:translate-y-0.5 ${
              pointsHighlight
                ? "border-emerald-400 scale-110 shadow-[0_0_24px_rgba(52,211,153,0.9)]"
                : "border-yellow-500/80 hover:border-yellow-400 shadow-[0_0_14px_rgba(234,179,8,0.35)]"
            }`}
          >
            <span className="text-xs">🏪</span>
            <span className="font-bold tracking-wider">GAME SHOP</span>
            <span
              className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold border transition-all duration-200 ${
                pointsHighlight
                  ? "bg-emerald-950 text-emerald-300 border-emerald-400 scale-110"
                  : "bg-neutral-950 text-amber-300 border-yellow-600/50"
              }`}
            >
              🪙 {playerPoints.toLocaleString()} PTS
            </span>
          </button>

          {/* Floating +PTS Notification in Top Right */}
          {recentPointsGain && (
            <div
              key={recentPointsGain.id}
              className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 bg-emerald-950/95 text-emerald-300 border-2 border-emerald-400 px-2.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold shadow-[0_0_14px_rgba(16,185,129,0.85)] animate-bounce whitespace-nowrap z-50"
            >
              +{recentPointsGain.amount} PTS! 🪙
            </div>
          )}
        </div>
      </header>

      {/* ======================================================================
          WORKSPACE SCENE: CRT MONITOR, NES CONSOLE, & CARTRIDGES
          All resting naturally on the lilac cutting mat desk surface
          ====================================================================== */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-between px-3 sm:px-8 pb-3 pt-0">
        {/* 1. CRT Monitor: Front and Center */}
        <div className="w-full flex-1 flex items-center justify-center my-auto min-h-0">
          <CrtMonitor
            activeGame={activeGame}
            onEjectGame={handleEjectGame}
            onOpenCartridgeSlot={handleOpenSlot}
            onEarnPoints={handleEarnPoints}
          />
        </div>

        {/* 2. Desk Gear: NES Console & Cartridge Pile resting on the cutting mat */}
        <div className="w-full max-w-5xl flex flex-row items-end justify-start gap-4 sm:gap-6 relative z-20 shrink-0 -mt-6 sm:-mt-8">
          {/* Bottom-Left: NES Console resting on the cutting mat */}
          <div className="flex items-end shrink-0">
            <NesConsole
              activeGame={activeGame}
              isSlotOpen={isSlotModalOpen}
              onOpenCartridgeSlot={handleOpenSlot}
            />
          </div>

          {/* Beside NES (Not blocking CRT): Illustrated Cartridges on the cutting mat */}
          <div className="flex items-end shrink-0 pb-1">
            <CartridgePile
              games={games}
              activeGame={activeGame}
              unlockedGameIds={unlockedGameIds}
              playerPoints={playerPoints}
              onSelectGame={handleSelectGame}
              onUnlockGame={handleUnlockGame}
              onOpenCartridgeSlot={handleOpenSlot}
            />
          </div>
        </div>
      </div>

      {/* Cartridge Selection Modal (Triggered by clicking the NES cartridge slot) */}
      <CartridgeModal
        isOpen={isSlotModalOpen}
        games={games}
        activeGame={activeGame}
        unlockedGameIds={unlockedGameIds}
        playerPoints={playerPoints}
        onClose={handleCloseSlot}
        onSelectGame={handleSelectGame}
        onUnlockGame={handleUnlockGame}
      />

      {/* Shop Feature Modal (Triggered by clicking the Game Shop button) */}
      <ShopModal
        isOpen={isShopModalOpen}
        playerPoints={playerPoints}
        unlockedGameIds={unlockedGameIds}
        onClose={() => setIsShopModalOpen(false)}
        onPurchaseGame={handlePurchaseGame}
      />
    </main>
  );
}
