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
          Top Bar: Shop Button
          ====================================================================== */}
      <header className="relative z-20 w-full px-4 sm:px-6 py-2.5 flex justify-end items-center text-[8px] sm:text-[9px]">
        {/* Shop Feature Button */}
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
          - Bottom Left: NES Console with interactive Cartridge Slot
          - Next to NES: Pile of owned cartridges (not blocking the CRT)
          ====================================================================== */}
      <footer className="relative z-20 w-full desk-surface desk-wood-grain px-4 sm:px-8 py-3 pt-4">
        {/* Soft amber lamp lighting sheen across the desk */}
        <div className="absolute inset-x-0 top-0 h-1 bg-amber-500/25 pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-row items-end justify-between gap-4">
          {/* Bottom Left: NES Console */}
          <div className="flex items-end">
            <NesConsole
              activeGame={activeGame}
              isSlotOpen={isSlotModalOpen}
              onOpenCartridgeSlot={handleOpenSlot}
            />
          </div>

          {/* Next to the NES: Pile of Owned Cartridges */}
          <div className="flex flex-col items-end sm:items-start">
            <CartridgePile
              games={games}
              activeGame={activeGame}
              onSelectGame={handleSelectGame}
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
