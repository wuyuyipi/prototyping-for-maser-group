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
    5: (shopItems.find((i) => i.id === "fruit-ninja") || shopItems.find((i) => i.id === "shop-game-1"))!,
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
        if (landmarkStoreMap[clampedTarget]) {
          setInspectingItem(landmarkStoreMap[clampedTarget]);
        } else if (clampedTarget === BOARD_TILES.length - 1) {
          setIsExitDialogOpen(true);
        }
        return;
      }

      setIsMoving(true);
      setFacingLeft(clampedTarget < currentTileIndex);

      const stepDirection = clampedTarget > currentTileIndex ? 1 : -1;
      let nextIndex = currentTileIndex;

      const intervalId = setInterval(() => {
        nextIndex += stepDirection;
        setCurrentTileIndex(nextIndex);
        playSound("blip");

        if (nextIndex === clampedTarget) {
          clearInterval(intervalId);
          setIsMoving(false);

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

  // Candy Land Style "Roll" Action
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
      className="bg-[#09070f] text-neutral-100 p-0 rounded-2xl max-w-6xl w-[96vw] max-h-[92vh] overflow-hidden shadow-2xl m-auto backdrop:bg-black/90 font-pixel select-none outline-none border-0"
    >
      {/* ======================================================================
          ONE SEAMLESS MAP VIEW
          No extra borders, no extra text, zero emojis.
          ====================================================================== */}
      <div className="relative w-full aspect-[1000/580] bg-[#0c0915] overflow-hidden">
        {/* Ambient Map Grid & Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e1533_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />
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
            stroke="#261642"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-70"
          />
          {/* Main Floor Track */}
          <path
            d={generateTrackSvgPath()}
            fill="none"
            stroke="#120c20"
            strokeWidth="40"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center Track Line */}
          <path
            d={generateTrackSvgPath()}
            fill="none"
            stroke="#342057"
            strokeWidth="4"
            strokeDasharray="6 8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-75"
          />

          {/* Stepping Tiles */}
          {BOARD_TILES.map((tile) => {
            const isCurrent = tile.index === currentTileIndex;
            return (
              <g
                key={tile.index}
                className="cursor-pointer pointer-events-auto transition-transform hover:scale-110"
                onClick={() => moveToTile(tile.index)}
              >
                {/* Tile Drop Shadow */}
                <rect
                  x={tile.x - 17}
                  y={tile.y - 12 + 3}
                  width="34"
                  height="24"
                  rx="4"
                  fill="#000000"
                  opacity="0.5"
                />

                {/* Tile Body */}
                <rect
                  x={tile.x - 17}
                  y={tile.y - 12}
                  width="34"
                  height="24"
                  rx="4"
                  fill={tile.color}
                  stroke={isCurrent ? "#fde047" : "#0d0916"}
                  strokeWidth={isCurrent ? "2.5" : "1"}
                  className={isCurrent ? "filter drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" : ""}
                />

                {/* Bevel Highlight */}
                <rect
                  x={tile.x - 15}
                  y={tile.y - 10}
                  width="30"
                  height="4"
                  rx="2"
                  fill="#ffffff"
                  opacity="0.3"
                />
              </g>
            );
          })}
        </svg>

        {/* HTML Landmark Stores & Avatar */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Store 1: Cyber Samurai (Tile 5) */}
          <div className="pointer-events-auto">
            <ShopLandmark
              item={landmarkStoreMap[5]}
              x={105}
              y={110}
              isPlayerHere={currentTileIndex === 5}
              onSelect={() => moveToTile(5)}
            />
          </div>

          {/* Store 2: Galactic Mining (Tile 11) */}
          <div className="pointer-events-auto">
            <ShopLandmark
              item={landmarkStoreMap[11]}
              x={590}
              y={95}
              isPlayerHere={currentTileIndex === 11}
              onSelect={() => moveToTile(11)}
            />
          </div>

          {/* Store 3: Chrono Wizard (Tile 21) */}
          <div className="pointer-events-auto">
            <ShopLandmark
              item={landmarkStoreMap[21]}
              x={795}
              y={480}
              isPlayerHere={currentTileIndex === 21}
              onSelect={() => moveToTile(21)}
            />
          </div>

          {/* Store 4: Pixel Pinball 88 (Tile 26) */}
          <div className="pointer-events-auto">
            <ShopLandmark
              item={landmarkStoreMap[26]}
              x={775}
              y={40}
              isPlayerHere={currentTileIndex === 26}
              onSelect={() => moveToTile(26)}
            />
          </div>

          {/* Exit Portal: Living Room (Tile 29) */}
          <div className="pointer-events-auto">
            <ShopLandmark
              isExit
              x={920}
              y={325}
              isPlayerHere={currentTileIndex === 29}
              onSelect={() => moveToTile(29)}
            />
          </div>

          {/* Player Monster Avatar Pawn */}
          <ShopAvatar
            avatarId={selectedAvatarId}
            x={currentTile.x}
            y={currentTile.y}
            isMoving={isMoving}
            facingLeft={facingLeft}
          />
        </div>

        {/* ====================================================================
            FLOATING MINIMAL HUD (Top Controls)
            No container borders or extra text
            ==================================================================== */}
        <div className="absolute top-3 left-4 right-4 flex justify-between items-center z-40 pointer-events-none">
          {/* Minimal Map Title */}
          <div className="pointer-events-auto">
            <h2
              id="shop-board-title"
              className="text-[10px] sm:text-xs font-bold text-yellow-300 tracking-wider"
            >
              GAME SHOP
            </h2>
          </div>

          {/* Controls: Avatar, Points, Close */}
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
            {/* Avatar Switcher */}
            <button
              type="button"
              onClick={() => {
                playSound("blip");
                setIsAvatarModalOpen(true);
              }}
              className="bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-700 hover:border-yellow-400 px-2 sm:px-2.5 py-1.5 rounded flex items-center gap-2 cursor-pointer transition-colors shadow"
              title="Change Avatar"
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {activeAvatar.renderSvg()}
              </div>
              <div className="text-left">
                <span className="text-[7px] font-bold text-yellow-300">
                  {activeAvatar.name}
                </span>
              </div>
            </button>

            {/* Current Points Balance */}
            <div className="bg-neutral-950/80 border border-neutral-700 px-2.5 sm:px-3 py-1.5 rounded text-[8px] sm:text-[9px] text-yellow-300 font-bold shadow">
              {playerPoints.toLocaleString()} PTS
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              autoFocus
              aria-label="Exit shop"
              className="px-2.5 py-1.5 bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white text-[8px] rounded cursor-pointer transition-colors shadow"
            >
              [ESC]
            </button>
          </div>
        </div>

        {/* ====================================================================
            FLOATING MINIMAL CONTROLS (Bottom Controls)
            Floating directly on map floor without boxed panels or helper texts
            ==================================================================== */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40">
          {/* Step Back */}
          <button
            type="button"
            onClick={handleStepBackward}
            disabled={isMoving || currentTileIndex === 0}
            className="px-3 py-1.5 bg-neutral-950/85 hover:bg-neutral-900 border border-neutral-700 disabled:opacity-30 text-neutral-300 text-[8px] font-bold rounded cursor-pointer transition-all active:translate-y-0.5 shadow"
          >
            BACK
          </button>

          {/* Roll & Hop */}
          <button
            type="button"
            onClick={handleRollDice}
            disabled={isMoving || currentTileIndex === BOARD_TILES.length - 1}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-neutral-950 text-[9px] font-bold rounded cursor-pointer shadow active:translate-y-0.5 transition-all"
          >
            ROLL (1-4)
          </button>

          {/* Step Forward */}
          <button
            type="button"
            onClick={handleStepForward}
            disabled={isMoving || currentTileIndex === BOARD_TILES.length - 1}
            className="px-3 py-1.5 bg-neutral-950/85 hover:bg-neutral-900 border border-neutral-700 disabled:opacity-30 text-neutral-300 text-[8px] font-bold rounded cursor-pointer transition-all active:translate-y-0.5 shadow"
          >
            FORWARD
          </button>

          {/* Context Action: Enter Store */}
          {currentStore && (
            <button
              type="button"
              onClick={() => setInspectingItem(currentStore)}
              className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 text-[8px] font-bold rounded cursor-pointer animate-pulse shadow ml-1"
            >
              ENTER {currentStore.title.toUpperCase()}
            </button>
          )}

          {/* Context Action: Exit */}
          {currentTile.isExit && (
            <button
              type="button"
              onClick={() => setIsExitDialogOpen(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 text-[8px] font-bold rounded cursor-pointer animate-pulse shadow ml-1"
            >
              EXIT
            </button>
          )}
        </div>

        {/* Minimal Roll Banner */}
        {lastRoll && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-yellow-400 text-neutral-950 font-bold px-2.5 py-1 rounded shadow text-[7px] animate-bounce z-40">
            ROLLED {lastRoll}
          </div>
        )}
      </div>

      {/* ======================================================================
          Sub-Modals: Avatar Picker, Store Dialogue & Exit Confirmation
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
