"use client";

import React from "react";
import { GameComponentProps } from "../types";

export default function TurboRacerPlaceholder({ onExit }: GameComponentProps) {
  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4 select-none">
      {/* Blank space for Teammate 3 - Game 3 */}
    </div>
  );
}
