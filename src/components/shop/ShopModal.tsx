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
  unlockedGameIds?: string[];
  onClose: () => void;
  onPurchaseGame?: (item: ShopItem) => void;
}

export default function ShopModal({
  isOpen,
  playerPoints,
  unlockedGameIds = [],
  onClose,
  onPurchaseGame,
}: ShopModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Locally purchased item IDs in addition to unlockedGameIds
  const [purchasedItemIds, setPurchasedItemIds] = useState<string[]>([]);

  // Shop items with dynamic isUnlocked status
  const shopItems: ShopItem[] = React.useMemo(() => {
    return INITIAL_SHOP_ITEMS.map((item) => ({
      ...item,
      isUnlocked: Boolean(
        item.isUnlocked ||
        unlockedGameIds.includes(item.id) ||
        purchasedItemIds.includes(item.id)
      ),
    }));
  }, [unlockedGameIds, purchasedItemIds]);

  // Avatar Selection state (defaults to Spike the Dino Kaiju)
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("dino");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

  // Board Pawn state
  const [currentTileIndex, setCurrentTileIndex] = useState<number>(0);
  const currentTileIndexRef = useRef<number>(0);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [facingLeft, setFacingLeft] = useState<boolean>(false);

  // Active Store / Exit dialogs
  const [inspectingItem, setInspectingItem] = useState<ShopItem | null>(null);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState<boolean>(false);

  // Active movement timer refs
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to stop all timers
  const stopAllTimers = useCallback(() => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  }, []);

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

  // Map stores to their landmark tiles dynamically
  const landmarkStoreMap = React.useMemo(() => {
    const map: Record<number, ShopItem> = {};
    for (const item of shopItems) {
      if (item.landmarkTileIndex !== undefined) {
        map[item.landmarkTileIndex] = item;
      }
    }
    return map;
  }, [shopItems]);

  // Close handler
  const handleClose = () => {
    playSound("blip");
    stopAllTimers();
    setIsMoving(false);
    setInspectingItem(null);
    setIsExitDialogOpen(false);
    setIsAvatarModalOpen(false);
    onClose();
  };

  // Cleanup movement timers on unmount
  useEffect(() => {
    return () => {
      stopAllTimers();
    };
  }, [stopAllTimers]);

  // Stop indices along the path: only Start, the 4 games, and Exit
  const GAME_STOP_INDICES = [0, 5, 11, 21, 26, 29];

  // Move avatar to a specific target tile step-by-step along the path
  const moveToTile = useCallback(
    (targetIndex: number) => {
      const clampedTarget = Math.max(0, Math.min(BOARD_TILES.length - 1, targetIndex));
      const startIdx = currentTileIndexRef.current;

      // Clear any running interval immediately
      stopAllTimers();

      // If user clicks on the tile they are ALREADY on:
      // Clicking the spot again explicitly re-opens the game purchasing page!
      if (clampedTarget === startIdx) {
        setIsMoving(false);
        if (landmarkStoreMap[clampedTarget]) {
          setInspectingItem(landmarkStoreMap[clampedTarget]);
        } else if (clampedTarget === BOARD_TILES.length - 1) {
          setIsExitDialogOpen(true);
        }
        return;
      }

      // Start stepping toward the target
      setIsMoving(true);
      setFacingLeft(clampedTarget < startIdx);

      const stepDirection = clampedTarget > startIdx ? 1 : -1;
      let currentStep = startIdx;

      moveIntervalRef.current = setInterval(() => {
        currentStep += stepDirection;

        const hasReachedTarget =
          stepDirection > 0
            ? currentStep >= clampedTarget
            : currentStep <= clampedTarget;

        if (hasReachedTarget) {
          // STOP IMMEDIATELY ON THE DESTINATION GAME SPOT!
          stopAllTimers();
          currentTileIndexRef.current = clampedTarget;
          setCurrentTileIndex(clampedTarget);
          setIsMoving(false);
          playSound("blip");

          // Open the game purchasing page ONCE upon arrival
          if (landmarkStoreMap[clampedTarget]) {
            setInspectingItem(landmarkStoreMap[clampedTarget]);
          } else if (clampedTarget === BOARD_TILES.length - 1) {
            setIsExitDialogOpen(true);
          }
        } else {
          currentTileIndexRef.current = currentStep;
          setCurrentTileIndex(currentStep);
          playSound("blip");
        }
      }, 160);
    },
    [landmarkStoreMap, stopAllTimers]
  );

  // Step Forward to next game stop
  const handleStepForward = () => {
    const nextStop = GAME_STOP_INDICES.find((idx) => idx > currentTileIndex);
    if (nextStop !== undefined) {
      moveToTile(nextStop);
    }
  };

  // Step Backward to previous game stop
  const handleStepBackward = () => {
    const prevStops = GAME_STOP_INDICES.filter((idx) => idx < currentTileIndex);
    if (prevStops.length > 0) {
      const prevStop = prevStops[prevStops.length - 1];
      moveToTile(prevStop);
    }
  };

  // Buy game from store
  const handleBuyGame = (item: ShopItem) => {
    playSound("coin");
    setPurchasedItemIds((prev) =>
      prev.includes(item.id) ? prev : [...prev, item.id]
    );
    onPurchaseGame?.(item);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (inspectingItem || isExitDialogOpen || isAvatarModalOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
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
  ]);

  const unlockedCount = shopItems.filter((i) => i.isUnlocked).length;
  const currentStore = landmarkStoreMap[currentTileIndex];

  const handleDialogCancel = (e: React.SyntheticEvent) => {
    if (inspectingItem || isExitDialogOpen || isAvatarModalOpen) {
      e.preventDefault();
      setInspectingItem(null);
      setIsExitDialogOpen(false);
      setIsAvatarModalOpen(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onCancel={handleDialogCancel}
      aria-labelledby="shop-board-title"
      className="bg-[#09070f] text-neutral-100 p-0 rounded-2xl max-w-6xl w-[96vw] max-h-[92vh] overflow-hidden shadow-2xl m-auto backdrop:bg-black/90 font-pixel select-none outline-none border-0"
    >
      {/* ======================================================================
          ONE SEAMLESS MAP VIEW
          - Avatar walks strictly on the path tiles
          - Click any spot to move directly there
          - Exit sits directly at the end of the path
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

          {/* ====================================================================
              ROAD STOPS (Only START, the 4 Games, and EXIT)
              All small colored filler stones are removed!
              ==================================================================== */}

          {/* 1. START Platform (Tile 0) */}
          <g
            className="cursor-pointer pointer-events-auto group"
            onClick={() => moveToTile(0)}
          >
            <circle cx={75} cy={510} r={28} fill="transparent" />
            <circle
              cx={75}
              cy={510}
              r={22}
              fill="#064e3b"
              stroke={currentTileIndex === 0 ? "#fde047" : "#10b981"}
              strokeWidth={currentTileIndex === 0 ? "3" : "2"}
              className={`transition-all ${
                currentTileIndex === 0
                  ? "filter drop-shadow-[0_0_12px_rgba(253,224,71,0.9)]"
                  : "group-hover:stroke-emerald-300"
              }`}
            />
            <circle cx={75} cy={510} r={16} fill="#022c22" stroke="#34d399" strokeWidth="1" />
            <text
              x={75}
              y={513}
              textAnchor="middle"
              fill="#6ee7b7"
              fontSize="7"
              fontWeight="bold"
              fontFamily="monospace"
              letterSpacing="0.5"
            >
              START
            </text>
          </g>

          {/* 2. GAME Stop Platforms on the road (Tiles 5, 11, 21, 26) */}
          {[5, 11, 21, 26].map((tileIdx) => {
            const tile = BOARD_TILES[tileIdx];
            const game = landmarkStoreMap[tileIdx];
            if (!tile || !game) return null;
            const isCurrent = currentTileIndex === tileIdx;
            return (
              <g
                key={tileIdx}
                className="cursor-pointer pointer-events-auto group"
                onClick={() => moveToTile(tileIdx)}
              >
                {/* Generous Hit Target */}
                <circle cx={tile.x} cy={tile.y} r={32} fill="transparent" />

                {/* Road Stop Pad */}
                <circle
                  cx={tile.x}
                  cy={tile.y}
                  r={24}
                  fill="#0c0915"
                  stroke={isCurrent ? "#fde047" : game.accentColor}
                  strokeWidth={isCurrent ? "3" : "2"}
                  className={`transition-all ${
                    isCurrent
                      ? "filter drop-shadow-[0_0_14px_rgba(253,224,71,0.95)]"
                      : "group-hover:stroke-yellow-300"
                  }`}
                />
                <circle
                  cx={tile.x}
                  cy={tile.y}
                  r={16}
                  fill={`${game.accentColor}25`}
                  stroke={game.accentColor}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={tile.x}
                  cy={tile.y}
                  r={5}
                  fill={isCurrent ? "#fde047" : game.accentColor}
                />
              </g>
            );
          })}

          {/* 3. EXIT Stop Platform (Tile 29) */}
          <g
            className="cursor-pointer pointer-events-auto group"
            onClick={() => moveToTile(29)}
          >
            <rect x={895} y={210} width={60} height={40} fill="transparent" />
            <rect
              x={899}
              y={215}
              width={52}
              height={30}
              rx={6}
              fill="#064e3b"
              stroke={currentTileIndex === 29 ? "#fde047" : "#10b981"}
              strokeWidth={currentTileIndex === 29 ? "2.5" : "2"}
              className={
                currentTileIndex === 29
                  ? "filter drop-shadow-[0_0_10px_rgba(253,224,71,0.9)]"
                  : "group-hover:stroke-emerald-400"
              }
            />
            <rect
              x={905}
              y={220}
              width={40}
              height={20}
              rx={4}
              fill="#022c22"
              stroke="#34d399"
              strokeWidth="1.5"
            />
            <text
              x={925}
              y={234}
              textAnchor="middle"
              fill="#6ee7b7"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
              letterSpacing="1"
            >
              EXIT
            </text>
          </g>
        </svg>

        {/* ====================================================================
            GAME STOPS WITH PREVIEW ON THE PATH & AVATAR LAYER
            ==================================================================== */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Game 1: Pixel Fruit Ninja (Tile 5, Stop Pad at x:135, y:205) */}
          <div className="pointer-events-auto">
            <ShopLandmark
              item={landmarkStoreMap[5]}
              x={95}
              y={155}
              isPlayerHere={currentTileIndex === 5}
              onSelect={() => moveToTile(5)}
            />
          </div>

          {/* Game 2: Mario Invaders (Tile 11, Stop Pad at x:495, y:155) */}
          <div className="pointer-events-auto">
            <ShopLandmark
              item={landmarkStoreMap[11]}
              x={495}
              y={85}
              isPlayerHere={currentTileIndex === 11}
              onSelect={() => moveToTile(11)}
            />
          </div>

          {/* Game 3: Super Pixel Bros. (Tile 21, Stop Pad at x:680, y:455) */}
          <div className="pointer-events-auto">
            <ShopLandmark
              item={landmarkStoreMap[21]}
              x={760}
              y={455}
              isPlayerHere={currentTileIndex === 21}
              onSelect={() => moveToTile(21)}
            />
          </div>

          {/* Game 4: Pixel Pinball 88 (Tile 26, Stop Pad at x:765, y:120) */}
          <div className="pointer-events-auto">
            <ShopLandmark
              item={landmarkStoreMap[26]}
              x={730}
              y={80}
              isPlayerHere={currentTileIndex === 26}
              onSelect={() => moveToTile(26)}
            />
          </div>

          {/* Player Monster Avatar Pawn (Locked directly onto the path via percentage coordinates) */}
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
            CONTEXTUAL BOTTOM ACTION
            Appears seamlessly when standing on a Game or the Exit
            ==================================================================== */}
        {(currentStore || currentTile.isExit) && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40">
            {currentStore && (
              <button
                type="button"
                onClick={() => setInspectingItem(currentStore)}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 text-[9px] font-bold rounded cursor-pointer shadow-lg animate-pulse"
              >
                ENTER {currentStore.title.toUpperCase()}
              </button>
            )}

            {currentTile.isExit && (
              <button
                type="button"
                onClick={() => setIsExitDialogOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 text-[9px] font-bold rounded cursor-pointer shadow-lg animate-pulse"
              >
                EXIT TO LIVING ROOM
              </button>
            )}
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
