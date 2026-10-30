"use client";

import React from "react";
import { AVATAR_LIST } from "./avatarCatalog";
import { BOARD_WIDTH, BOARD_HEIGHT } from "./boardPathData";

interface ShopAvatarProps {
  avatarId?: string;
  x: number;
  y: number;
  isMoving: boolean;
  name?: string;
  facingLeft?: boolean;
}

export default function ShopAvatar({
  avatarId = "dino",
  x,
  y,
  isMoving,
  name,
  facingLeft = false,
}: ShopAvatarProps) {
  const avatar = AVATAR_LIST.find((a) => a.id === avatarId) || AVATAR_LIST[0];
  const displayName = name || avatar.name;

  // Exact percentage coordinates mapped to the 1000x580 board
  const leftPercent = (x / BOARD_WIDTH) * 100;
  const topPercent = (y / BOARD_HEIGHT) * 100;

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        transform: "translate(-50%, -85%)",
        transition: "left 260ms ease-out, top 260ms ease-out",
      }}
    >
      {/* Nameplate */}
      <div className="flex flex-col items-center">
        <div
          className="text-neutral-950 text-[7px] font-bold px-1.5 py-0.5 rounded shadow mb-1 tracking-wider whitespace-nowrap"
          style={{ backgroundColor: avatar.themeColor }}
        >
          {displayName}
        </div>

        {/* Pixel Monster Pawn with smooth walking waddle */}
        <div
          className="relative w-9 h-9"
          style={{
            transform: `${facingLeft ? "scaleX(-1)" : "scaleX(1)"} ${
              isMoving ? "translateY(-4px)" : "translateY(0)"
            }`,
            transition: "transform 130ms ease-in-out",
          }}
        >
          {avatar.renderSvg({ isMoving, facingLeft })}
        </div>

        {/* Ground Spotlight Shadow */}
        <div
          className={`w-8 h-2 bg-black/60 rounded-full blur-[1px] transition-all duration-150 ${
            isMoving ? "scale-90 opacity-40" : "scale-100 opacity-60"
          }`}
        />
      </div>
    </div>
  );
}
