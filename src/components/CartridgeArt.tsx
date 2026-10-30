"use client";

import React from "react";

interface CartridgeArtProps {
  gameId: string;
  compact?: boolean;
}

/**
 * Custom Pixel-Art Cover Illustrations for each cartridge
 * so players can immediately recognize the game just by looking at the cartridge!
 */
export default function CartridgeArt({
  gameId,
  compact = false,
}: CartridgeArtProps) {
  if (gameId === "fruit-ninja") {
    // 🍉 PIXEL FRUIT NINJA: Dojo wood wall, diagonal Katana slash, sliced Watermelon halves, juice drops, Bomb
    return (
      <div
        className={`relative w-full ${
          compact ? "h-14 sm:h-16" : "h-28 sm:h-32"
        } bg-[#1c110a] overflow-hidden border-2 border-[#451a03] flex items-center justify-center select-none`}
      >
        {/* Dojo wooden planks background */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-50 pointer-events-none">
          <div className="w-full h-1/3 bg-[#29180e] border-b border-[#3b2314]" />
          <div className="w-full h-1/3 bg-[#1c110a] border-b border-[#3b2314]" />
          <div className="w-full h-1/3 bg-[#29180e]" />
        </div>

        {/* Pixel SVG Scene: Sliced Watermelon + Katana Blade + Bomb + Juice */}
        <svg
          viewBox="0 0 80 48"
          className="w-full h-full relative z-10"
          shapeRendering="crispEdges"
        >
          {/* Juice splatter pixels */}
          <rect x="20" y="10" width="3" height="3" fill="#ef4444" />
          <rect x="44" y="8" width="2" height="2" fill="#ef4444" />
          <rect x="36" y="36" width="3" height="3" fill="#ef4444" />
          <rect x="14" y="28" width="2" height="2" fill="#4ade80" />
          <rect x="50" y="26" width="2" height="2" fill="#facc15" />

          {/* Left Watermelon Half (tilted top-left) */}
          <g transform="translate(15, 12)">
            {/* Green outer rind */}
            <rect x="0" y="4" width="16" height="10" fill="#15803d" />
            <rect x="2" y="2" width="12" height="12" fill="#16a34a" />
            {/* Red flesh */}
            <rect x="3" y="4" width="10" height="8" fill="#ef4444" />
            {/* Black seeds */}
            <rect x="5" y="6" width="2" height="2" fill="#111827" />
            <rect x="9" y="7" width="2" height="2" fill="#111827" />
          </g>

          {/* Right Watermelon Half (split bottom-right) */}
          <g transform="translate(29, 22)">
            <rect x="0" y="2" width="16" height="10" fill="#15803d" />
            <rect x="2" y="4" width="12" height="10" fill="#16a34a" />
            <rect x="3" y="2" width="10" height="8" fill="#ef4444" />
            <rect x="6" y="4" width="2" height="2" fill="#111827" />
            <rect x="10" y="5" width="2" height="2" fill="#111827" />
          </g>

          {/* Golden Peach on Left */}
          <g transform="translate(5, 29)">
            <rect x="1" y="0" width="6" height="8" fill="#facc15" />
            <rect x="0" y="1" width="8" height="6" fill="#fde047" />
            <rect x="3" y="-2" width="3" height="2" fill="#22c55e" />
          </g>

          {/* Pixel Bomb with sparkling fuse on Right */}
          <g transform="translate(55, 16)">
            <rect x="2" y="2" width="12" height="14" fill="#111827" />
            <rect x="0" y="4" width="16" height="10" fill="#1f2937" />
            {/* Bomb shine */}
            <rect x="3" y="5" width="3" height="3" fill="#9ca3af" />
            {/* Red danger X */}
            <rect x="6" y="8" width="4" height="2" fill="#ef4444" />
            <rect x="7" y="7" width="2" height="4" fill="#ef4444" />
            {/* Fuse & Spark */}
            <rect x="7" y="-2" width="2" height="4" fill="#d97706" />
            <rect x="5" y="-5" width="6" height="3" fill="#facc15" />
            <rect x="6" y="-6" width="4" height="2" fill="#ef4444" />
          </g>

          {/* Glowing Cyan/White Katana Slash Diagonal */}
          <polygon points="6,42 10,44 70,6 66,4" fill="#38bdf8" />
          <polygon points="8,41 11,42 68,6 66,5" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  if (gameId === "super-pixel-bros") {
    // 🍄 SUPER PIXEL BROS: Blue Sky, Question Block, Brick, Mario (justin), Goomba, Green Pipe & Flagpole
    return (
      <div
        className={`relative w-full ${
          compact ? "h-14 sm:h-16" : "h-28 sm:h-32"
        } bg-[#5c94fc] overflow-hidden border-2 border-[#1e3a8a] flex items-center justify-center select-none`}
      >
        <svg
          viewBox="0 0 80 48"
          className="w-full h-full relative z-10"
          shapeRendering="crispEdges"
        >
          {/* White Pixel Cloud */}
          <rect x="6" y="6" width="14" height="5" fill="#ffffff" />
          <rect x="9" y="3" width="8" height="4" fill="#ffffff" />

          {/* Green Bush / Hill */}
          <rect x="4" y="34" width="16" height="6" fill="#00a800" />
          <rect x="7" y="31" width="10" height="4" fill="#00a800" />

          {/* Brick & ? Question Blocks */}
          <g transform="translate(22, 8)">
            {/* Brick */}
            <rect x="0" y="0" width="10" height="10" fill="#c84c0c" />
            <rect x="1" y="1" width="8" height="8" fill="#ea580c" />
            {/* Golden ? Block */}
            <rect x="11" y="0" width="10" height="10" fill="#fc9838" />
            <rect x="12" y="1" width="8" height="8" fill="#facc15" />
            <rect x="15" y="3" width="3" height="2" fill="#000000" />
            <rect x="16" y="5" width="2" height="2" fill="#000000" />
            <rect x="16" y="8" width="2" height="1" fill="#000000" />
          </g>

          {/* Popping Coin above ? Block */}
          <rect x="36" y="2" width="4" height="5" fill="#fef08a" />

          {/* Mario ("justin") Jumping */}
          <g transform="translate(24, 21)">
            {/* Name tag "justin" */}
            <rect x="-2" y="-5" width="16" height="4" fill="#000000" />
            <rect x="0" y="-4" width="12" height="2" fill="#facc15" />
            {/* Red Cap & Shirt */}
            <rect x="2" y="0" width="7" height="3" fill="#f83800" />
            <rect x="1" y="3" width="7" height="3" fill="#fcb438" />
            {/* Blue Overalls */}
            <rect x="2" y="6" width="6" height="5" fill="#0028a0" />
            <rect x="0" y="6" width="2" height="3" fill="#f83800" />
            <rect x="8" y="6" width="2" height="3" fill="#f83800" />
            {/* Shoes */}
            <rect x="1" y="11" width="3" height="2" fill="#6b3c00" />
            <rect x="6" y="11" width="3" height="2" fill="#6b3c00" />
          </g>

          {/* Goomba Mushroom Enemy */}
          <g transform="translate(44, 30)">
            <rect x="1" y="0" width="8" height="6" fill="#a83800" />
            <rect x="0" y="2" width="10" height="5" fill="#a83800" />
            <rect x="2" y="3" width="2" height="2" fill="#ffffff" />
            <rect x="6" y="3" width="2" height="2" fill="#ffffff" />
            <rect x="1" y="7" width="3" height="3" fill="#000000" />
            <rect x="6" y="7" width="3" height="3" fill="#000000" />
          </g>

          {/* Green Warp Pipe on Right */}
          <g transform="translate(58, 22)">
            <rect x="0" y="0" width="16" height="5" fill="#22c55e" />
            <rect x="2" y="5" width="12" height="13" fill="#00a800" />
            <rect x="10" y="5" width="4" height="13" fill="#006400" />
          </g>

          {/* Brown Brick Ground */}
          <rect x="0" y="40" width="80" height="8" fill="#c84c0c" />
          <rect x="0" y="40" width="80" height="1" fill="#000000" />
        </svg>
      </div>
    );
  }

  if (gameId === "pixel-pinball-88" || gameId === "pinball") {
    // 🕹️ PIXEL PINBALL 88: Orange arcade cabinet glow, bumpers, flippers & silver pinball
    return (
      <div
        className={`relative w-full ${
          compact ? "h-14 sm:h-16" : "h-28 sm:h-32"
        } bg-[#1a0800] overflow-hidden border-2 border-[#ea580c] flex items-center justify-center select-none`}
      >
        <svg
          viewBox="0 0 80 48"
          className="w-full h-full relative z-10"
          shapeRendering="crispEdges"
        >
          {/* Table Outline & Guide Rails */}
          <polygon points="16,0 64,0 60,48 20,48" fill="#2d1204" />
          <line x1="20" y1="0" x2="23" y2="48" stroke="#7c2d12" strokeWidth="2" />
          <line x1="60" y1="0" x2="57" y2="48" stroke="#7c2d12" strokeWidth="2" />

          {/* Top Neon Bumpers */}
          <circle cx="32" cy="14" r="5" fill="#f97316" stroke="#fdba74" strokeWidth="1" />
          <circle cx="48" cy="14" r="5" fill="#f97316" stroke="#fdba74" strokeWidth="1" />
          <circle cx="40" cy="22" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />

          {/* Bumper Centers */}
          <rect x="31" y="13" width="2" height="2" fill="#ffffff" />
          <rect x="47" y="13" width="2" height="2" fill="#ffffff" />
          <rect x="39" y="21" width="2" height="2" fill="#ffffff" />

          {/* Left & Right Slingshots */}
          <polygon points="23,28 29,36 24,38" fill="#f59e0b" />
          <polygon points="57,28 51,36 56,38" fill="#f59e0b" />

          {/* Flippers at the Bottom */}
          <polygon points="26,42 37,45 36,47 25,44" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
          <polygon points="54,42 43,45 44,47 55,44" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />

          {/* Silver Pinball */}
          <circle cx="38" cy="33" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
          <rect x="37" y="32" width="1" height="1" fill="#ffffff" />

          {/* 88 Arcade Saloon Neon Header */}
          <text x="40" y="7" textAnchor="middle" fill="#facc15" fontSize="5" fontWeight="bold" fontFamily="monospace">PINBALL 88</text>
        </svg>
      </div>
    );
  }

  // 🧱 TETRIS: Deep Navy Matrix Grid + Falling & Stacked Colorful Tetromino Blocks
  return (
    <div
      className={`relative w-full ${
        compact ? "h-14 sm:h-16" : "h-28 sm:h-32"
      } bg-[#090d26] overflow-hidden border-2 border-[#38bdf8] flex items-center justify-center select-none`}
    >
      <svg
        viewBox="0 0 80 48"
        className="w-full h-full relative z-10"
        shapeRendering="crispEdges"
      >
        {/* Subtle Matrix Side Borders */}
        <rect x="14" y="0" width="2" height="48" fill="#1e3a8a" />
        <rect x="64" y="0" width="2" height="48" fill="#1e3a8a" />

        {/* Falling Purple T-Piece in Upper Center */}
        <g transform="translate(32, 4)">
          <rect x="6" y="0" width="6" height="6" fill="#a855f7" />
          <rect x="0" y="6" width="6" height="6" fill="#a855f7" />
          <rect x="6" y="6" width="6" height="6" fill="#a855f7" />
          <rect x="12" y="6" width="6" height="6" fill="#a855f7" />
        </g>

        {/* Falling Cyan I-Piece on Left */}
        <g transform="translate(18, 12)">
          <rect x="0" y="0" width="6" height="6" fill="#06b6d4" />
          <rect x="0" y="6" width="6" height="6" fill="#06b6d4" />
          <rect x="0" y="12" width="6" height="6" fill="#06b6d4" />
          <rect x="0" y="18" width="6" height="6" fill="#06b6d4" />
        </g>

        {/* Stacked Tetrominoes at Bottom */}
        {/* Yellow O-Piece */}
        <rect x="18" y="36" width="6" height="6" fill="#facc15" />
        <rect x="24" y="36" width="6" height="6" fill="#facc15" />
        <rect x="18" y="42" width="6" height="6" fill="#facc15" />
        <rect x="24" y="42" width="6" height="6" fill="#facc15" />

        {/* Red Z-Piece */}
        <rect x="30" y="30" width="6" height="6" fill="#ef4444" />
        <rect x="36" y="30" width="6" height="6" fill="#ef4444" />
        <rect x="36" y="36" width="6" height="6" fill="#ef4444" />
        <rect x="42" y="36" width="6" height="6" fill="#ef4444" />

        {/* Green S-Piece */}
        <rect x="30" y="42" width="6" height="6" fill="#22c55e" />
        <rect x="36" y="42" width="6" height="6" fill="#22c55e" />
        <rect x="42" y="42" width="6" height="6" fill="#22c55e" />

        {/* Orange L-Piece */}
        <rect x="54" y="24" width="6" height="6" fill="#f97316" />
        <rect x="54" y="30" width="6" height="6" fill="#f97316" />
        <rect x="48" y="36" width="6" height="6" fill="#f97316" />
        <rect x="54" y="36" width="6" height="6" fill="#f97316" />

        {/* Blue J-Piece */}
        <rect x="48" y="42" width="6" height="6" fill="#3b82f6" />
        <rect x="54" y="42" width="6" height="6" fill="#3b82f6" />
      </svg>
    </div>
  );
}
