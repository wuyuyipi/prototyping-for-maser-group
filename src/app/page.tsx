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
import { playSound } from "@/components/AudioEffects";

export default function RetroLivingRoomPage() {
  const [games] = useState<GameDefinition[]>(GAMES_REGISTRY);
  // Default to first game or null
  const [activeGame, setActiveGame] = useState<GameDefinition | null>(games[0]);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

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

      {/* Top Floating Header & Info Toggle */}
      <header className="relative z-20 w-full px-4 sm:px-6 py-2.5 flex justify-between items-center text-[8px] sm:text-[9px]">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded border border-neutral-800">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-yellow-400 font-bold tracking-wider">
            RETRO ARCADE SETUP
          </span>
          {activeGame && (
            <span className="text-neutral-400 border-l border-neutral-700 pl-2">
              LOADED: {activeGame.title}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowGuide((v) => !v)}
          className="bg-black/60 hover:bg-black/80 text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded border border-cyan-900 cursor-pointer transition-colors"
        >
          {showGuide ? "✕ HIDE GUIDE" : "ℹ TEAM GUIDE"}
        </button>
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
    </main>
  );
}
