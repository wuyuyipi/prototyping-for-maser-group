"use client";

import React from "react";
import { AVATAR_LIST, AvatarDefinition } from "./avatarCatalog";
import { playSound } from "../AudioEffects";

interface AvatarSelectModalProps {
  selectedAvatarId: string;
  onSelectAvatar: (avatarId: string) => void;
  onClose: () => void;
}

export default function AvatarSelectModal({
  selectedAvatarId,
  onSelectAvatar,
  onClose,
}: AvatarSelectModalProps) {
  const handleSelect = (avatar: AvatarDefinition) => {
    playSound("coin");
    onSelectAvatar(avatar.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xl bg-neutral-900 border-2 border-yellow-500 rounded-lg p-5 shadow-2xl font-pixel text-neutral-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
          <div>
            <h3 className="text-xs font-bold text-yellow-300 tracking-wider">
              SELECT AVATAR
            </h3>
            <p className="text-[7px] text-neutral-400 mt-0.5">
              Choose your creature pawn for the map.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[8px] rounded cursor-pointer"
          >
            [ESC]
          </button>
        </div>

        {/* 6 Avatar Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AVATAR_LIST.map((avatar) => {
            const isSelected = avatar.id === selectedAvatarId;
            return (
              <div
                key={avatar.id}
                onClick={() => handleSelect(avatar)}
                className={`relative p-3 rounded-lg border flex flex-col items-center justify-between cursor-pointer transition-all duration-150 group active:translate-y-0.5 ${
                  isSelected
                    ? "bg-neutral-800 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.3)]"
                    : "bg-neutral-950/80 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900"
                }`}
              >
                {/* Equipped Badge */}
                {isSelected && (
                  <div className="absolute -top-2 bg-yellow-400 text-neutral-950 text-[6px] font-bold px-1.5 py-0.5 rounded shadow">
                    ACTIVE
                  </div>
                )}

                {/* Avatar Sprite Preview */}
                <div className="w-14 h-14 my-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {avatar.renderSvg()}
                </div>

                {/* Info */}
                <div className="text-center mt-1">
                  <div className="text-[8px] font-bold text-neutral-100 group-hover:text-yellow-300">
                    {avatar.name}
                  </div>
                  <div className="text-[6px] text-neutral-400">
                    {avatar.species}
                  </div>
                </div>

                {/* Select Button */}
                <div className="w-full mt-2 pt-1 border-t border-neutral-800">
                  <button
                    type="button"
                    className={`w-full py-1 text-[7px] font-bold rounded cursor-pointer ${
                      isSelected
                        ? "bg-yellow-500 text-neutral-950"
                        : "bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700"
                    }`}
                  >
                    {isSelected ? "ACTIVE" : "SELECT"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer / Done Button */}
        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 text-[8px] font-bold rounded cursor-pointer shadow active:translate-y-0.5 transition-all"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
}
