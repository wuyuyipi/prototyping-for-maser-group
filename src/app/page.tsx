"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GAMES_REGISTRY } from "@/games/registry";
import { GameDefinition } from "@/games/types";
import CrtMonitor from "@/components/CrtMonitor";
import NesConsole from "@/components/NesConsole";
import NesController from "@/components/NesController";
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
  // Default to first game or null
  const [activeGame, setActiveGame] = useState<GameDefinition | null>(games[0]);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  // Initial points set to 0!
  const [playerPoints, setPlayerPoints] = useState<number>(0);
  const [recentPointsGain, setRecentPointsGain] = useState<{
    amount: number;
    id: number;
  } | null>(null);
  const [pointsHighlight, setPointsHighlight] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

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
          Cozy Room Background (Pixel art dark brick, magenta GAME OVER neon sign)
          ====================================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/retro_room_bg.jpg"
          alt="Cozy retro living room pixel art background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        {/* Soft vignette & ambient neon lighting overlay */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/30 to-black/85" />
      </div>

      {/* ======================================================================
          Top Floating Header: Arcade Marquee, Points, and Shop Button
          ====================================================================== */}
      <header className="relative z-20 w-full px-4 sm:px-6 py-2.5 flex justify-between items-center text-[8px] sm:text-[9px]">
        {/* Arcade Status Badge */}
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2.5 py-1.5 rounded border border-neutral-800">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-yellow-400 font-bold tracking-wider">
            RETRO ARCADE SETUP
          </span>
          {activeGame && (
            <span className="text-neutral-400 border-l border-neutral-700 pl-2 hidden sm:inline">
              LOADED: {activeGame.title}
            </span>
          )}
        </div>

        {/* Action Controls: Shop Button & Team Guide */}
        <div className="relative flex items-center gap-2 sm:gap-3">
          {/* Shop Feature Button */}
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

          {/* Team Collaboration Guide */}
          <button
            type="button"
            onClick={() => setShowGuide((v) => !v)}
            className="bg-black/60 hover:bg-black/80 text-cyan-400 hover:text-cyan-300 px-2.5 py-1.5 rounded border border-cyan-900 cursor-pointer transition-colors"
          >
            {showGuide ? "✕ HIDE" : "ℹ DEV GUIDE"}
          </button>
        </div>
      </header>

      {/* Teammate Guide Modal / Overlay */}
      {showGuide && (
        <div className="absolute top-12 right-4 z-40 max-w-sm bg-neutral-950/95 border-2 border-cyan-600 p-3 rounded font-pixel text-[8px] text-neutral-300 space-y-1.5 shadow-2xl backdrop-blur-sm">
          <div className="text-yellow-300 font-bold border-b border-neutral-800 pb-1">
            TEAMMATE SETUP INFO
          </div>
          <p>
            • <strong>Branching</strong>: Create branch <code className="text-green-400">feat/game-name</code>
          </p>
          <p>
            • <strong>Your Game Code</strong>: Build inside <code className="text-cyan-400">src/games/your-game/</code> (no games built yet, all blank placeholders).
          </p>
          <p>
            • <strong>Registry</strong>: Register in <code className="text-yellow-400">src/games/registry.ts</code>.
          </p>
          <p>
            • <strong>Shop Feature</strong>: Collaborator builds inside <code className="text-amber-400">src/components/shop/</code>.
          </p>
          <p className="text-neutral-500 pt-1">
            Click anywhere on the background to close this guide.
          </p>
          <button
            type="button"
            onClick={() => setShowGuide(false)}
            className="w-full text-center py-1 mt-1 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* ======================================================================
          FRONT AND CENTER: The Retro CRT Monitor
          ====================================================================== */}
      <section className="relative z-10 w-full flex-1 flex items-center justify-center px-4 -mt-2 sm:mt-0">
        <CrtMonitor
          activeGame={activeGame}
          onEjectGame={handleEjectGame}
          onOpenCartridgeSlot={handleOpenSlot}
          onEarnPoints={handleEarnPoints}
        />
      </section>

      {/* ======================================================================
          THE WOODEN DESK SURFACE (BOTTOM OF SCREEN)
          - Bottom Left: NES Console with interactive Cartridge Slot & Controller
          - Next to NES: Pile of owned cartridges (not blocking the CRT)
          ====================================================================== */}
      <footer className="relative z-20 w-full desk-surface desk-wood-grain px-4 sm:px-8 py-3 pt-4">
        {/* Soft amber lamp lighting sheen across the desk */}
        <div className="absolute inset-x-0 top-0 h-1 bg-amber-500/25 pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-row items-end justify-between gap-4">
          {/* Bottom Left: NES Console + Controller */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-6">
            <NesConsole
              activeGame={activeGame}
              isSlotOpen={isSlotModalOpen}
              onOpenCartridgeSlot={handleOpenSlot}
            />

            {/* NES Controller resting on the desk */}
            <div className="hidden md:block">
              <NesController />
            </div>
          </div>

          {/* Next to the NES: Pile of Owned Cartridges */}
          <div className="flex flex-col items-end sm:items-start">
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
      </footer>

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
        games={games}
        unlockedGameIds={unlockedGameIds}
        onUnlockGame={handleUnlockGame}
        onSelectGame={handleSelectGame}
        onClose={() => setIsShopModalOpen(false)}
        onPurchaseGame={handlePurchaseGame}
      />
    </main>
  );
}
