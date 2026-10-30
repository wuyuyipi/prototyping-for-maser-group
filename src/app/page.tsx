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
  // Default unlocked games: Super Pixel Bros. & Tetris. Pixel Fruits is bought from the Game Shop!
  const [unlockedGameIds, setUnlockedGameIds] = useState<string[]>(() =>
    GAMES_REGISTRY.filter((g) => g.initiallyUnlocked !== false).map((g) => g.id)
  );
  // Default to first game (Super Pixel Bros.)
  const [activeGame, setActiveGame] = useState<GameDefinition | null>(games[0]);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  // Initial points set to 400 so user can test buying Pixel Fruits (300 PTS) in the shop or earn more!
  const [playerPoints, setPlayerPoints] = useState<number>(400);
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
    // If purchasing Pixel Fruit Ninja in the shop, unlock it so it appears in the desk pile!
    if (item.id === "fruit-ninja" || item.title.toLowerCase().includes("fruit")) {
      setUnlockedGameIds((prev) =>
        prev.includes("fruit-ninja") ? prev : [...prev, "fruit-ninja"]
      );
    } else {
      const nextLocked = games.find((g) => !unlockedGameIds.includes(g.id));
      if (nextLocked) {
        setUnlockedGameIds((prev) => [...prev, nextLocked.id]);
      }
    }
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
          Arranged per user reference layout diagram:
          - CRT: Large, front and center on the desk
          - NES: Bottom-left, overlapping bottom-left corner of the CRT bezel
          - Cartridges: Bottom-right, stacked horizontally on the desk
          ====================================================================== */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-end items-center px-3 sm:px-6 md:px-8 pb-3 pt-0">
        <div className="relative w-full max-w-4xl lg:max-w-5xl flex flex-col items-center">
          {/* 1. CRT Monitor: Front and Center on the desk */}
          <div className="relative z-10 w-full flex justify-center">
            <CrtMonitor
              activeGame={activeGame}
              onEjectGame={handleEjectGame}
              onOpenCartridgeSlot={handleOpenSlot}
              onEarnPoints={handleEarnPoints}
            />
          </div>

          {/* 2. Desk Foreground Row: NES on Left (overlapping CRT bottom-left), Cartridges on Right */}
          <div className="w-full flex flex-row items-end justify-between relative z-20 -mt-8 sm:-mt-12 md:-mt-14 pointer-events-none px-1 sm:px-3">
            {/* Bottom-Left: NES Console overlapping bottom-left corner of the CRT */}
            <div className="pointer-events-auto flex items-end">
              <NesConsole
                activeGame={activeGame}
                isSlotOpen={isSlotModalOpen}
                onOpenCartridgeSlot={handleOpenSlot}
              />
            </div>

            {/* Bottom-Right: Stack of Cartridges in bottom-right corner of the desk */}
            <div className="pointer-events-auto flex items-end pb-1 sm:pb-2">
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
        onClose={() => setIsShopModalOpen(false)}
        onPurchaseGame={handlePurchaseGame}
      />
    </main>
  );
}
