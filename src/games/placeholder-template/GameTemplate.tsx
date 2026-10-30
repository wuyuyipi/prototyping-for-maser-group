"use client";

import React from "react";
import { GameComponentProps } from "../types";

/**
 * Blank Game Canvas Placeholder:
 * Teammates build their game inside this component.
 * Leave it blank until your team implements the game.
 */
export default function GameTemplate({ onExit }: GameComponentProps) {
  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4 select-none">
      {/* Blank game canvas ready for implementation */}
    </div>
  );
}
