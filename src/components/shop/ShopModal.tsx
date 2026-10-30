"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ShopItem, BoardTile } from "./types";
import { INITIAL_SHOP_ITEMS } from "./shopCatalog";
import { BOARD_WIDTH, BOARD_HEIGHT, BOARD_TILES, generateTrackSvgPath } from "./boardPathData";
import { AVATAR_LIST } from "./avatarCatalog";
import { playSound } from "../AudioEffects";
import ShopAvatar from "./ShopAvatar";
import ShopLandmark from "./ShopLandmark";
import StoreDialog from "./StoreDialog";
import ExitDialog from "./ExitDialog";
import AvatarSelectModal from "./AvatarSelectModal";

interface ShopModalProps {
  isOpen: boolean;
  playerPoints: number;
  onClose: () => void;
  onPurchaseGame?: (item: ShopItem) => void;
}

export default function ShopModal({
  isOpen,
  playerPoints,
  onClose,
  onPurchaseGame,
}: ShopModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Shop items state (tracks which are unlocked)
  const [shopItems, setShopItems] = useState<ShopItem[]>(INITIAL_SHOP_ITEMS);

  // Avatar Selection state (defaults to Spike the Dino Kaiju)
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("dino");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

  // Board Pawn state
  const [currentTileIndex, setCurrentTileIndex] = useState<number>(0);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [facingLeft, setFacingLeft] = useState<boolean>(false);

  // Active Store / Exit dialogs
  const [inspectingItem, setInspectingItem] = useState<ShopItem | null>(null);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState<boolean>(false);

  // Roll result banner
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  // Current avatar definition
  const activeAvatar =
    AVATAR_LIST.find((a) => a.id === selectedAvatarId) || AVATAR_LIST[0];

  // Sync modal state with native dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Current tile data
  const currentTile: BoardTile = BOARD_TILES[currentTileIndex] || BOARD_TILES[0];

  // Map stores to their landmark tiles
  const landmarkStoreMap: Record<number, ShopItem> = {
    5: shopItems.find((i) => i.id === "shop-game-1")!,
    11: shopItems.find((i) => i.id === "shop-game-2")!,
    21: shopItems.find((i) => i.id === "shop-game-3")!,
    26: shopItems.find((i) => i.id === "shop-game-4")!,
  };

  // Close handler
  const handleClose = () => {
    playSound("blip");
    setInspectingItem(null);
    setIsExitDialogOpen(false);
    setIsAvatarModalOpen(false);
    onClose();
  };

  // Move avatar to a specific target tile step-by-step
  const moveToTile = useCallback(
    (targetIndex: number) => {
      if (isMoving) return;
      const clampedTarget = Math.max(0, Math.min(BOARD_TILES.length - 1, targetIndex));
      if (clampedTarget === currentTileIndex) {
        // If already on this tile, check if it's a store or exit
        if (landmarkStoreMap[clampedTarget]) {
          setInspectingItem(landmarkStoreMap[clampedTarget]);
        } else if (clampedTarget === BOARD_TILES.length - 1) {
          setIsExitDialogOpen(true);
        }
        return;
      }

      setIsMoving(true);
      setFacingLeft(clampedTarget < currentTileIndex);

      // Sequential hop along the path
      const stepDirection = clampedTarget > currentTileIndex ? 1 : -1;
      let nextIndex = currentTileIndex;

      const intervalId = setInterval(() => {
        nextIndex += stepDirection;
        setCurrentTileIndex(nextIndex);
        playSound("blip");

        if (nextIndex === clampedTarget) {
          clearInterval(intervalId);
          setIsMoving(false);

          // Check if landed on a landmark store
          if (landmarkStoreMap[clampedTarget]) {
            setTimeout(() => {
              setInspectingItem(landmarkStoreMap[clampedTarget]);
            }, 250);
          } else if (clampedTarget === BOARD_TILES.length - 1) {
            setTimeout(() => {
              setIsExitDialogOpen(true);
            }, 250);
          }
        }
      }, 120);
    },
    [currentTileIndex, isMoving, landmarkStoreMap]
  );

  // Candy Land Style "Roll / Draw" Action
  const handleRollDice = () => {
    if (isMoving) return;
    const roll = Math.floor(Math.random() * 4) + 1; // 1 to 4 steps
    setLastRoll(roll);
    playSound("coin");
    moveToTile(currentTileIndex + roll);
  };

  // Step Forward
  const handleStepForward = () => {
    if (currentTileIndex < BOARD_TILES.length - 1) {
      moveToTile(currentTileIndex + 1);
    }
  };

  // Step Backward
  const handleStepBackward = () => {
    if (currentTileIndex > 0) {
      moveToTile(currentTileIndex - 1);
    }
  };

  // Buy game from store
  const handleBuyGame = (item: ShopItem) => {
    playSound("coin");
    setShopItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isUnlocked: true } : i))
    );
    onPurchaseGame?.(item);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (inspectingItem || isExitDialogOpen || isAvatarModalOpen) {
        if (e.key === "Escape") {
          setInspectingItem(null);
          setIsExitDialogOpen(false);
          setIsAvatarModalOpen(false);
        }
        return;
      }

      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        handleStepForward();
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        handleStepBackward();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleRollDice();
      } else if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        if (landmarkStoreMap[currentTileIndex]) {
          setInspectingItem(landmarkStoreMap[currentTileIndex]);
        } else if (currentTileIndex === BOARD_TILES.length - 1) {
          setIsExitDialogOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    inspectingItem,
    isExitDialogOpen,
    isAvatarModalOpen,
    currentTileIndex,
    landmarkStoreMap,
    handleStepForward,
    handleStepBackward,
    handleRollDice,
  ]);

  const unlockedCount = shopItems.filter((i) => i.isUnlocked).length;
  const currentStore = landmarkStoreMap[currentTileIndex];

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-labelledby="shop-board-title"
      className="bg-[#09070f] text-neutral-100 border-4 border-amber-600/90 p-3 sm:p-5 rounded-lg max-w-6xl w-[96vw] max-h-[92vh] overflow-y-auto pixel-border shadow-2xl m-auto backdrop:bg-black/90 font-pixel select-none"
    >
      {/* ======================================================================
          Board Header: Arcade Marquee, Avatar Selector, Points Balance, and Exit
          ====================================================================== */}
      <div className="flex flex-wrap justify-between items-center border-b-2 border-neutral-800 pb-2.5 mb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎲</span>
            <h2
              id="shop-board-title"
              className="text-xs sm:text-sm font-bold text-yellow-300 tracking-wider flex items-center gap-2"
            >
              RETRO ARCADE LAND
              <span className="text-[7px] text-amber-500 bg-amber-950/70 border border-amber-600/50 px-1.5 py-0.5 rounded font-normal">
                CARTRIDGE TRAIL
              </span>
            </h2>
          </div>
          <p className="text-[7px] sm:text-[8px] text-neutral-400 mt-0.5">
            Hop along the winding neon path, visit themed game stores, and unlock cartridges!
          </p>
        </div>

        {/* Action Bar: Avatar Switcher, Points Balance & Exit */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Avatar Switcher Button in Header */}
          <button
            type="button"
            onClick={() => {
              playSound("blip");
              setIsAvatarModalOpen(true);
            }}
            className="bg-neutral-950 border-2 border-neutral-700 hover:border-yellow-400 px-2 sm:px-2.5 py-1.5 rounded flex items-center gap-2 cursor-pointer transition-colors shadow-inner group"
            title="Choose your avatar monster"
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              {activeAvatar.renderSvg()}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[6px] text-neutral-400">AVATAR</span>
              <span className="text-[8px] font-bold text-yellow-300 flex items-center gap-1">
                {activeAvatar.name}
                <span className="text-[6px] text-neutral-400">▾</span>
              </span>
            </div>
          </button>

          {/* Current Points Balance */}
          <div className="bg-neutral-950 border-2 border-yellow-500/80 px-2.5 sm:px-3 py-1.5 rounded flex items-center gap-1.5 sm:gap-2 shadow-inner">
            <span className="text-yellow-400 text-xs animate-pulse">🪙</span>
            <span className="text-[9px] sm:text-[10px] text-yellow-300 font-bold">
              {playerPoints.toLocaleString()} PTS
            </span>
          </div>

          {/* Exit Button */}
          <button
            type="button"
            onClick={handleClose}
            autoFocus
            aria-label="Exit shop"
            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-red-400 hover:text-red-300 text-[9px] pixel-border-sm cursor-pointer transition-colors"
          >
            ✕ [ESC]
          </button>
        </div>
      </div>

      {/* ======================================================================
          Candy Land Board Canvas: Winding Stepping-Stone Path & Stores
          ====================================================================== */}
      <div className="relative w-full aspect-[1000/580] bg-[#0c0915] border-2 border-neutral-800 rounded-lg overflow-hidden shadow-2xl">
        {/* Ambient Retro Grid & Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e1533_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* SVG Ribbon Track Layer */}
        <svg
          viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Track Outer Glow */}
          <path
            d={generateTrackSvgPath()}
            fill="none"
            stroke="#2d1c4d"
            strokeWidth="50"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-70"
          />
          {/* Main Asphalt / Dark Floor Track */}
          <path
            d={generateTrackSvgPath()}
            fill="none"
            stroke="#150f24"
            strokeWidth="42"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Neon Center Runner */}
          <path
            d={generateTrackSvgPath()}
            fill="none"
            stroke="#3a2561"
            strokeWidth="6"
            strokeDasharray="6 8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80"
          />

          {/* Stepping Tiles on SVG */}
          {BOARD_TILES.map((tile) => {
            const isCurrent = tile.index === currentTileIndex;
            return (
              <g
                key={tile.index}
                className="cursor-pointer pointer-events-auto transition-transform hover:scale-110"
                onClick={() => moveToTile(tile.index)}
              >
                {/* Tile 3D Drop Shadow */}
                <rect
                  x={tile.x - 17}
                  y={tile.y - 12 + 3}
                  width="34"
                  height="24"
                  rx="4"
                  fill="#000000"
                  opacity="0.6"
                />

                {/* Tile Base */}
                <rect
                  x={tile.x - 17}
                  y={tile.y - 12}
                  width="34"
                  height="24"
                  rx="4"
                  fill={tile.color}
                  stroke={isCurrent ? "#fde047" : "#0f0b18"}
                  strokeWidth={isCurrent ? "2.5" : "1.5"}
                  className={isCurrent ? "filter drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" : ""}
                />

                {/* Tile Top Bevel Highlight */}
                <rect
                  x={tile.x - 15}
                  y={tile.y - 10}
                  width="30"
                  height="5"
                  rx="2"
                  fill="#ffffff"
                  opacity="0.35"
                />

                {/* Tile Number or Icon */}
                <text
                  x={tile.x}
                  y={tile.y + 4}
                  textAnchor="middle"
                  fill="#0f0b18"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="'Press Start 2P', monospace"
                  className="select-none"
                >
                  {tile.isStart
                    ? "GO"
                    : tile.isExit
                    ? "OUT"
                    : tile.label?.split(" ")[0] || tile.index}
                </text>
              </g>
            );
          })}
        </svg>

        {/* ====================================================================
            HTML Overlay Layer: Landmark Stores, Exit, and Avatar Pawn
            ==================================================================== */}
        <div className="absolute inset-0 w-full h-full">
          {/* Store 1: Cyber Samurai Dojo (Tile 5) */}
          <ShopLandmark
            item={landmarkStoreMap[5]}
            x={105}
            y={110}
            isPlayerHere={currentTileIndex === 5}
            onSelect={() => moveToTile(5)}
          />

          {/* Store 2: Galactic Mining Outpost (Tile 11) */}
          <ShopLandmark
            item={landmarkStoreMap[11]}
            x={590}
            y={95}
            isPlayerHere={currentTileIndex === 11}
            onSelect={() => moveToTile(11)}
          />

          {/* Store 3: Chrono Wizard Sanctum (Tile 21) */}
          <ShopLandmark
            item={landmarkStoreMap[21]}
            x={795}
            y={480}
            isPlayerHere={currentTileIndex === 21}
            onSelect={() => moveToTile(21)}
          />

          {/* Store 4: Pixel Pinball Palace (Tile 26) */}
          <ShopLandmark
            item={landmarkStoreMap[26]}
            x={775}
            y={40}
            isPlayerHere={currentTileIndex === 26}
            onSelect={() => moveToTile(26)}
          />

          {/* Exit Portal: Living Room Warp Gate (Tile 29) */}
          <ShopLandmark
            isExit
            x={920}
            y={325}
            isPlayerHere={currentTileIndex === 29}
            onSelect={() => moveToTile(29)}
          />

          {/* Player Monster Avatar Pawn */}
          <ShopAvatar
            avatarId={selectedAvatarId}
            x={currentTile.x}
            y={currentTile.y}
            isMoving={isMoving}
            facingLeft={facingLeft}
          />
        </div>

        {/* Dice Roll Popup Notification */}
        {lastRoll && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-neutral-950 font-bold px-3 py-1 rounded shadow-lg text-[8px] pixel-border-sm animate-bounce flex items-center gap-1.5 z-40">
            <span>🎲</span>
            <span>ROLLED A {lastRoll}! ADVANCING {lastRoll} TILES!</span>
          </div>
        )}
      </div>

      {/* ======================================================================
          Board Game Control Deck (Bottom Console Panel)
          ====================================================================== */}
      <div className="mt-3 bg-neutral-950 border-2 border-neutral-800 p-3 rounded-lg flex flex-col md:flex-row items-center justify-between gap-3 shadow-inner">
        {/* Location Status & Avatar Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 text-left w-full md:w-auto">
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded flex flex-col">
            <span className="text-[6px] text-neutral-500 uppercase tracking-wider">
              CURRENT LOCATION
            </span>
            <span className="text-[8px] font-bold text-yellow-300 flex items-center gap-1.5">
              <span>📍</span>
              {currentStore
                ? `${currentStore.storeName} (STORE #${currentStore.id.slice(-1)})`
                : currentTile.isStart
                ? "STARTING LINE"
                : currentTile.isExit
                ? "EXIT WARP GATE"
                : `TRAIL TILE #${currentTile.index}`}
            </span>
          </div>

          {/* Quick Change Avatar Button */}
          <button
            type="button"
            onClick={() => {
              playSound("blip");
              setIsAvatarModalOpen(true);
            }}
            className="bg-neutral-900 border border-neutral-800 hover:border-yellow-400 px-2.5 py-1.5 rounded flex items-center gap-2 cursor-pointer transition-colors shadow-inner"
            title="Switch Creature Figure"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              {activeAvatar.renderSvg()}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[6px] text-neutral-500">PAWN</span>
              <span className="text-[7px] font-bold text-yellow-400">CHANGE ▾</span>
            </div>
          </button>
        </div>

        {/* Interactive Controls: Step Back, Step Forward, Roll, and Action */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
          {/* Step Back Button */}
          <button
            type="button"
            onClick={handleStepBackward}
            disabled={isMoving || currentTileIndex === 0}
            className="px-2.5 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 text-[8px] font-bold rounded pixel-border-sm cursor-pointer transition-all active:translate-y-0.5"
            title="Step Back 1 Tile [← or A]"
          >
            ◀ BACK
          </button>

          {/* Roll & Hop Button */}
          <button
            type="button"
            onClick={handleRollDice}
            disabled={isMoving || currentTileIndex === BOARD_TILES.length - 1}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-neutral-950 text-[9px] font-bold rounded pixel-border-sm cursor-pointer shadow-[0_2px_0_0_#78350f] active:translate-y-0.5 transition-all flex items-center gap-1.5"
            title="Roll 1-4 and Hop Forward [SPACE]"
          >
            <span>🎲</span>
            <span>ROLL & HOP (1-4)</span>
          </button>

          {/* Step Forward Button */}
          <button
            type="button"
            onClick={handleStepForward}
            disabled={isMoving || currentTileIndex === BOARD_TILES.length - 1}
            className="px-2.5 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 text-[8px] font-bold rounded pixel-border-sm cursor-pointer transition-all active:translate-y-0.5"
            title="Step Forward 1 Tile [→ or D]"
          >
            FORWARD ▶
          </button>

          {/* Store / Exit Trigger Button */}
          {currentStore && (
            <button
              type="button"
              onClick={() => setInspectingItem(currentStore)}
              className="px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 text-[8px] font-bold rounded pixel-border-sm cursor-pointer animate-pulse"
              title="Inspect store cartridge [E]"
            >
              🏪 ENTER {currentStore.storeName}
            </button>
          )}

          {currentTile.isExit && (
            <button
              type="button"
              onClick={() => setIsExitDialogOpen(true)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 text-[8px] font-bold rounded pixel-border-sm cursor-pointer animate-pulse"
            >
              🚪 EXIT TO LIVING ROOM
            </button>
          )}
        </div>
      </div>

      {/* Footer Hints */}
      <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex flex-wrap justify-between items-center text-[7px] text-neutral-500 gap-2">
        <span>
          💡 <strong>CONTROLS:</strong> [A / D / ARROWS] Step • [SPACE] Roll &amp; Hop • [E / CLICK STORE] Shop • [ESC] Exit
        </span>
        <button
          type="button"
          onClick={handleClose}
          className="text-amber-400 hover:underline cursor-pointer"
        >
          Direct Exit to Living Room
        </button>
      </div>

      {/* ======================================================================
          Sub-Modals: Avatar Picker, Store Counter Dialogue & Exit Confirmation
          ====================================================================== */}
      {isAvatarModalOpen && (
        <AvatarSelectModal
          selectedAvatarId={selectedAvatarId}
          onSelectAvatar={(id) => {
            setSelectedAvatarId(id);
            setIsAvatarModalOpen(false);
          }}
          onClose={() => setIsAvatarModalOpen(false)}
        />
      )}

      {inspectingItem && (
        <StoreDialog
          item={inspectingItem}
          playerPoints={playerPoints}
          onBuy={handleBuyGame}
          onClose={() => setInspectingItem(null)}
        />
      )}

      {isExitDialogOpen && (
        <ExitDialog
          unlockedCount={unlockedCount}
          totalCount={shopItems.length}
          playerPoints={playerPoints}
          onExit={handleClose}
          onClose={() => setIsExitDialogOpen(false)}
        />
      )}
    </dialog>
  );
}
