"use client";

import React from "react";
import { AVATAR_LIST } from "./avatarCatalog";

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

  return (
    <div
      className="absolute pointer-events-none transition-all duration-300 ease-out z-30"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -85%)",
      }}
    >
      {/* Nameplate & Status Indicator */}
      <div className="flex flex-col items-center">
        <div
          className="text-neutral-950 text-[7px] font-bold px-1.5 py-0.5 rounded shadow pixel-border-sm mb-1 tracking-wider whitespace-nowrap animate-bounce"
          style={{ backgroundColor: avatar.themeColor }}
        >
          {displayName}
        </div>

        {/* Pixel Monster Pawn */}
        <div
          className={`relative w-9 h-9 transition-transform duration-150 ${
            facingLeft ? "scale-x-[-1]" : "scale-x-100"
          } ${isMoving ? "translate-y-[-10px] scale-110" : ""}`}
        >
          {avatar.renderSvg({ isMoving, facingLeft })}
        </div>

        {/* Ground Spotlight Shadow */}
        <div className="w-8 h-2.5 bg-black/60 rounded-full blur-[1px] -mt-1" />
      </div>
    </div>
  );
}
