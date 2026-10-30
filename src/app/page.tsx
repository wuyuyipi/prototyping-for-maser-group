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
  // Default to first game (Super Pixel Bros.)
  const [activeGame, setActiveGame] = useState<GameDefinition | null>(games[0]);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [playerPoints, setPlayerPoints] = useState<number>(1250);

  const handleOpenSlot = () => {
    setIsSlotModalOpen(true);
  };

  const handleCloseSlot = () => {
    setIsSlotModalOpen(false);
  };

  const handleSelectGame = (game: GameDefinition) => {
    setActiveGame(game);
  };

  const handleEjectGame = () => {
    playSound("eject");
    setActiveGame(null);
  };

  const handlePurchaseGame = (item: ShopItem) => {
    setPlayerPoints((prev) => Math.max(0, prev - item.price));
  };

  const handleEarnPoints = (pts: number) => {
    setPlayerPoints((prev) => prev + pts);
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
          Top Bar: Floating Game Shop Button
          ====================================================================== */}
      <header className="relative z-30 w-full px-4 sm:px-6 py-2 flex justify-end items-center text-[8px] sm:text-[9px]">
        <button
          type="button"
          onClick={() => {
            playSound("coin");
            setIsShopModalOpen(true);
          }}
          aria-label="Open Game Shop"
          title="Open shop shelf to buy new games with points"
          className="bg-neutral-900/90 hover:bg-neutral-800 text-yellow-300 px-3 py-1.5 rounded border-2 border-yellow-500/80 hover:border-yellow-400 pixel-border-sm cursor-pointer transition-all flex items-center gap-2 shadow-[0_0_14px_rgba(234,179,8,0.35)] active:translate-y-0.5"
        >
          <span className="text-xs">🏪</span>
          <span className="font-bold tracking-wider">GAME SHOP</span>
          <span className="bg-neutral-950 px-1.5 py-0.5 rounded text-[8px] text-amber-400 border border-yellow-600/50">
            🪙 {playerPoints.toLocaleString()} PTS
          </span>
        </button>
      </header>

      {/* ======================================================================
          WORKSPACE SCENE: CRT MONITOR, NES CONSOLE, & CARTRIDGES
          All resting naturally on the lilac cutting mat desk surface
          ====================================================================== */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-between px-3 sm:px-8 pb-3 pt-0">
        {/* 1. CRT Monitor: Front and Center, vintage cream chassis resting on the cutting mat */}
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

          {/* Beside NES (Not blocking CRT): Stack of Owned Cartridges on the cutting mat */}
          <div className="flex items-end shrink-0 pb-1">
            <CartridgePile
              games={games}
              activeGame={activeGame}
              onSelectGame={handleSelectGame}
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
        onClose={handleCloseSlot}
        onSelectGame={handleSelectGame}
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
