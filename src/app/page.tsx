"use client";

import React, { useState } from "react";
import { GAMES_REGISTRY } from "@/games/registry";
import { GameDefinition } from "@/games/types";
import CrtMonitor from "@/components/CrtMonitor";
import NesConsole from "@/components/NesConsole";
import CartridgePile from "@/components/CartridgePile";
import CartridgeModal from "@/components/CartridgeModal";
import { playSound } from "@/components/AudioEffects";

export default function RetroArcadePage() {
  const [games] = useState<GameDefinition[]>(GAMES_REGISTRY);
  // Default to the first game or null
  const [activeGame, setActiveGame] = useState<GameDefinition | null>(games[0]);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [showTeammateInfo, setShowTeammateInfo] = useState(false);

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

  const handleResetGame = () => {
    if (activeGame) {
      // Re-trigger game component reload
      const current = activeGame;
      setActiveGame(null);
      setTimeout(() => setActiveGame(current), 50);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between p-3 sm:p-6 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black">
      {/* Top Header / Arcade Marquee */}
      <header className="w-full max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-3 mb-4 pb-3 border-b-2 border-neutral-800 font-pixel">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-red-600 rounded-xs animate-pulse" />
          <h1 className="text-sm sm:text-base font-bold text-yellow-400 tracking-wider">
            8-BIT RETRO ARCADE
          </h1>
          <span className="text-[9px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
            NES LIVING ROOM SETUP
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowTeammateInfo((v) => !v)}
            className="text-[9px] text-cyan-400 hover:text-cyan-300 bg-neutral-900 border border-cyan-800 px-2.5 py-1.5 rounded cursor-pointer active:translate-y-0.5"
          >
            {showTeammateInfo ? "HIDE DEV GUIDE ▲" : "TEAMMATE DEV GUIDE ▼"}
          </button>
        </div>
      </header>

      {/* Teammate Guide Drawer (Collapsible) */}
      {showTeammateInfo && (
        <section
          aria-label="Teammate development instructions"
          className="w-full max-w-6xl mx-auto mb-4 p-4 bg-neutral-900/95 border-2 border-cyan-700/80 rounded font-pixel text-neutral-300 text-[10px] space-y-2 shadow-xl"
        >
          <div className="text-yellow-300 text-xs font-bold border-b border-neutral-700 pb-1">
            🛠️ TEAMMATE COLLABORATION WORKFLOW (BRANCHING & GITHUB)
          </div>
          <p>
            1. <strong>Create your feature branch</strong>: <code className="text-green-400">git checkout -b feat/game-yourname</code>
          </p>
          <p>
            2. <strong>Build your game</strong> inside <code className="text-cyan-400">src/games/your-game-name/</code> (feel free to duplicate <code className="text-cyan-400">src/games/placeholder-template/</code>).
          </p>
          <p>
            3. <strong>Register your game</strong> in <code className="text-yellow-400">src/games/registry.ts</code> so it appears on the cartridge stack and CRT!
          </p>
          <p className="text-neutral-400 text-[9px]">
            Keep your changes isolated to your game folder to avoid Git merge conflicts.
          </p>
        </section>
      )}

      {/* Main Arcade Stage */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between gap-6">
        {/* UPPER PORTION: The Retro CRT Gaming Monitor (Takes up the majority of the screen) */}
        <section className="w-full flex-1 flex items-center justify-center">
          <CrtMonitor
            activeGame={activeGame}
            onEjectGame={handleEjectGame}
            onOpenCartridgeSlot={handleOpenSlot}
          />
        </section>

        {/* LOWER PORTION: The Desk Surface Setup */}
        {/* NES on the bottom-left, Cartridge Pile next to it (not blocking the CRT) */}
        <section
          aria-label="NES Console and Cartridge Setup"
          className="w-full bg-[#1e1511] border-t-4 border-[#3a2820] p-4 sm:p-6 rounded-t-xl shadow-[0_-10px_25px_rgba(0,0,0,0.8)] relative"
        >
          {/* Desk Surface Woodgrain / Texture Accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-amber-700/20" />

          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            {/* Bottom-Left: NES Console */}
            <div className="w-full md:w-auto flex flex-col items-center md:items-start">
              <div className="text-[9px] text-amber-300/80 font-pixel mb-1.5 flex items-center gap-1.5">
                <span>🎮</span>
                <span>NES CONSOLE (BOTTOM-LEFT)</span>
              </div>
              <NesConsole
                activeGame={activeGame}
                isSlotOpen={isSlotModalOpen}
                onOpenCartridgeSlot={handleOpenSlot}
                onResetGame={handleResetGame}
              />
            </div>

            {/* Next to NES (Not blocking CRT): Stacked Owned Cartridges */}
            <div className="w-full md:w-auto flex flex-col items-center md:items-start flex-1 max-w-md">
              <div className="text-[9px] text-amber-300/80 font-pixel mb-1.5 flex items-center gap-1.5">
                <span>📚</span>
                <span>OWNED GAMES PILE (CLICK TO LOAD)</span>
              </div>
              <CartridgePile
                games={games}
                activeGame={activeGame}
                onSelectGame={handleSelectGame}
                onOpenCartridgeSlot={handleOpenSlot}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Cartridge Slot Modal Dialog (Shows all owned games front-facing) */}
      <CartridgeModal
        isOpen={isSlotModalOpen}
        games={games}
        activeGame={activeGame}
        onClose={handleCloseSlot}
        onSelectGame={handleSelectGame}
      />

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto mt-4 pt-2 border-t border-neutral-900 flex justify-between items-center text-[8px] sm:text-[9px] text-neutral-400 font-pixel">
        <span>PROTOTYPING FOR MASTER - ARCADE TEAM</span>
        <span>NEXT.JS + TAILWIND CSS + PIXEL ART</span>
      </footer>
    </main>
  );
}
