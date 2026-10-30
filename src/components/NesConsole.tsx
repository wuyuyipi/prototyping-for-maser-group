"use client";

import React, { useState } from "react";
import { GameDefinition } from "../games/types";
import { playSound } from "./AudioEffects";

interface NesConsoleProps {
  activeGame: GameDefinition | null;
  isSlotOpen: boolean;
  onOpenCartridgeSlot: () => void;
  onResetGame?: () => void;
}

export default function NesConsole({
  activeGame,
  isSlotOpen: isModalOpen,
  onOpenCartridgeSlot,
  onResetGame,
}: NesConsoleProps) {
  const [doorOpen, setDoorOpen] = useState(false);
  const isOpen = doorOpen || isModalOpen;

  const handleDoorClick = () => {
    playSound("slotOpen");
    const next = !isOpen;
    setDoorOpen(next);
    if (next) {
      onOpenCartridgeSlot();
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound("blip");
    onResetGame?.();
  };

  return (
    <div className="relative select-none font-pixel pointer-events-auto flex flex-col items-center">
      {/* ======================================================================
          Authentic Proportional NES Front-Loader
          Proportions: Wide, low-profile, boxy 80s console form factor.
          Color Palette: Muted warm room lighting (ambient dusk / warm incandescent room glow)
          ====================================================================== */}
      <svg
        viewBox="0 0 380 150"
        className="w-80 sm:w-96 md:w-[410px] h-auto filter drop-shadow-[0_15px_22px_rgba(0,0,0,0.95)] cursor-pointer"
        onClick={handleDoorClick}
        role="button"
        aria-label="NES Console - Click cartridge slot to open and switch games"
      >
        <defs>
          {/* Soft ambient table contact shadow */}
          <radialGradient id="tableShadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Warm studio room lighting gradients */}
          {/* Top cover: Authentic NES light grey with subtle warm ambient sheen */}
          <linearGradient id="nesTopLid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d5d2cc" />
            <stop offset="100%" stopColor="#bfbcb5" />
          </linearGradient>

          {/* Front upper face: Authentic NES soft light grey */}
          <linearGradient id="nesUpperFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cac6be" />
            <stop offset="100%" stopColor="#b4b0a8" />
          </linearGradient>

          {/* Lower chassis: Authentic NES dark slate grey */}
          <linearGradient id="nesLowerBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4c4e54" />
            <stop offset="100%" stopColor="#323438" />
          </linearGradient>

          {/* Recessed black grill band: Deep charcoal black */}
          <linearGradient id="nesBlackBand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1e20" />
            <stop offset="100%" stopColor="#111113" />
          </linearGradient>

          {/* Ambient red LED glow */}
          <radialGradient id="nesLedGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff3333" stopOpacity="1" />
            <stop offset="60%" stopColor="#cc1111" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#990000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* -------------------------------------------------------------
            0. DESK CONTACT SHADOW
            ------------------------------------------------------------- */}
        <ellipse cx="190" cy="144" rx="180" ry="6" fill="url(#tableShadowGrad)" />

        {/* -------------------------------------------------------------
            1. LOWER CHASSIS BASE (Dark Charcoal, beveled sides)
            ------------------------------------------------------------- */}
        <polygon
          points="15,86 365,86 354,142 26,142"
          fill="url(#nesLowerBase)"
          stroke="#1e1c1b"
          strokeWidth="1.5"
        />
        {/* Bottom rubber foot strip / lip */}
        <polygon points="26,142 354,142 350,146 30,146" fill="#141312" />

        {/* -------------------------------------------------------------
            2. UPPER TOP LID (Wide, low-profile perspective)
            ------------------------------------------------------------- */}
        <polygon
          points="42,16 338,16 365,52 15,52"
          fill="url(#nesTopLid)"
          stroke="#686560"
          strokeWidth="1.2"
        />
        {/* Soft edge highlight on top-front rim */}
        <line x1="16" y1="52" x2="364" y2="52" stroke="#b5b0a8" strokeWidth="1" />

        {/* Top-Right Ventilation Heat Grill */}
        <polygon points="230,18 332,18 356,50 244,50" fill="#75716b" />
        {[...Array(18)].map((_, i) => (
          <line
            key={i}
            x1={233 + i * 5.6}
            y1={19}
            x2={247 + i * 6.2}
            y2={49}
            stroke="#54514c"
            strokeWidth="1.8"
          />
        ))}

        {/* Front Upper Face (Wide & Slim) */}
        <rect
          x="15"
          y="52"
          width="350"
          height="34"
          fill="url(#nesUpperFace)"
          stroke="#5b5752"
          strokeWidth="1.2"
        />

        {/* -------------------------------------------------------------
            3. RIGHT BLACK RECESS BAND & CONTROLLER PORTS
            ------------------------------------------------------------- */}
        {/* Top Black Notch */}
        <polygon points="220,16 234,16 248,52 232,52" fill="#141314" />
        {/* Front Vertical Black Band (Iconic NES stripe) */}
        <rect
          x="232"
          y="52"
          width="50"
          height="90"
          fill="url(#nesBlackBand)"
          stroke="#0a0a0b"
          strokeWidth="1"
        />

        {/* Controller Port 1 */}
        <g transform="translate(242, 94)">
          <rect x="0" y="0" width="30" height="17" rx="1" fill="#080809" stroke="#1f1e20" strokeWidth="1" />
          <text x="3" y="-3" fill="#a82020" fontSize="6" fontFamily="monospace" fontWeight="bold">1</text>
          {/* Pins */}
          {[3, 9, 15, 21, 27].map((px, i) => (
            <circle key={i} cx={px} cy={6} r="1" fill="#4d4c50" />
          ))}
          <circle cx="7" cy="12" r="1" fill="#4d4c50" />
          <circle cx="23" cy="12" r="1" fill="#4d4c50" />
        </g>

        {/* Controller Port 2 */}
        <g transform="translate(242, 118)">
          <rect x="0" y="0" width="30" height="17" rx="1" fill="#080809" stroke="#1f1e20" strokeWidth="1" />
          <text x="3" y="-3" fill="#a82020" fontSize="6" fontFamily="monospace" fontWeight="bold">2</text>
          {[3, 9, 15, 21, 27].map((px, i) => (
            <circle key={i} cx={px} cy={6} r="1" fill="#4d4c50" />
          ))}
          <circle cx="7" cy="12" r="1" fill="#4d4c50" />
          <circle cx="23" cy="12" r="1" fill="#4d4c50" />
        </g>

        {/* -------------------------------------------------------------
            4. LOWER LEFT: POWER / RESET BUTTONS & RED LED
            ------------------------------------------------------------- */}
        {/* Power LED Indicator */}
        <g transform="translate(48, 114)">
          <rect x="-1" y="-1" width="8" height="8" rx="1" fill="#141312" />
          <rect
            x="0"
            y="0"
            width="6"
            height="6"
            fill={activeGame ? "url(#nesLedGlow)" : "#3a0a0a"}
          />
          {activeGame && (
            <rect x="1.5" y="1.5" width="3" height="3" fill="#ff7777" opacity="0.9" />
          )}
        </g>

        {/* POWER Button */}
        <g transform="translate(68, 102)">
          {/* Button Bezel Base */}
          <rect x="0" y="0" width="46" height="24" rx="1" fill="#1c1b1a" />
          {/* Button Surface (Warm, aged plastic) */}
          <rect x="2" y="2" width="42" height="20" rx="1" fill="#78746e" className="hover:fill-[#8c8881]" />
          <text
            x="9"
            y="14"
            fill="#a82020"
            fontSize="6"
            fontFamily="'Press Start 2P', monospace"
            fontWeight="bold"
            letterSpacing="-0.5"
          >
            POWER
          </text>
        </g>

        {/* RESET Button */}
        <g transform="translate(122, 102)" onClick={handleReset}>
          <rect x="0" y="0" width="46" height="24" rx="1" fill="#1c1b1a" />
          <rect x="2" y="2" width="42" height="20" rx="1" fill="#78746e" className="hover:fill-[#8c8881]" />
          <text
            x="9"
            y="14"
            fill="#a82020"
            fontSize="6"
            fontFamily="'Press Start 2P', monospace"
            fontWeight="bold"
            letterSpacing="-0.5"
          >
            RESET
          </text>
        </g>

        {/* -------------------------------------------------------------
            5. THE CARTRIDGE CHAMBER (Deep recess & Horizontal Tray)
            ------------------------------------------------------------- */}
        {/* Recessed Chamber Opening Behind Door */}
        <rect
          x="26"
          y="54"
          width="196"
          height="30"
          fill="#0a090b"
          stroke="#1c1a1c"
          strokeWidth="1.2"
        />

        {/* Spring Tray Interior */}
        <rect x="30" y="58" width="188" height="22" fill="#161517" />

        {/* Horizontal Cartridge Loaded in Tray */}
        {activeGame && (
          <g transform="translate(38, 62)">
            {/* Cartridge Dark Plastic Casing */}
            <rect
              x="0"
              y="0"
              width="172"
              height="16"
              rx="1"
              fill="#3a3c42"
              stroke="#1f2024"
              strokeWidth="0.8"
            />
            {/* Spine Label (Muted colors matching environment) */}
            <rect
              x="16"
              y="3"
              width="140"
              height="10"
              fill={activeGame.labelColor}
              stroke="#111"
              strokeWidth="0.5"
            />
            {/* Title Text on Cartridge Spine */}
            <text
              x="22"
              y="10.5"
              fill="#ffffff"
              fontSize="5.5"
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
            >
              {activeGame.title.toUpperCase()}
            </text>
            <text
              x="134"
              y="10.5"
              fill="#e2b43b"
              fontSize="4.5"
              fontFamily="'Press Start 2P', monospace"
            >
              {activeGame.labelBadge}
            </text>
          </g>
        )}

        {/* Deep Chamber Ambient Shadow */}
        <rect x="26" y="54" width="196" height="5" fill="#000000" opacity="0.75" />

        {/* =============================================================
            6. THE HINGED FLAP DOOR (CLOSED vs UPWARD-HINGED OPEN)
            ============================================================= */}
        {!isOpen ? (
          /* CLOSED DOOR: Lies flush on the front face */
          <g className="transition-all duration-200">
            {/* Door Panel */}
            <rect
              x="24"
              y="53"
              width="200"
              height="32"
              fill="url(#nesUpperFace)"
              stroke="#54514c"
              strokeWidth="1"
            />
            {/* Top seam highlight */}
            <line x1="25" y1="54" x2="223" y2="54" stroke="#ababa3" strokeWidth="0.8" />

            {/* Vintage Muted Crimson Red NES Branding */}
            <text
              x="34"
              y="68"
              fill="#a82020"
              fontSize="9"
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
              letterSpacing="-0.5"
            >
              Nintendo
            </text>
            <text
              x="34"
              y="77"
              fill="#a82020"
              fontSize="5"
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
              letterSpacing="0"
            >
              ENTERTAINMENT SYSTEM™
            </text>

            {/* Finger Grip Bottom Notch */}
            <line x1="34" y1="82" x2="216" y2="82" stroke="#5b5751" strokeWidth="1.2" />
          </g>
        ) : (
          /* OPEN DOOR: Hinges UPWARD at authentic angle into 3D space */
          <g className="transition-all duration-300">
            {/* Deep Drop Shadow Under Raised Door */}
            <polygon points="24,52 226,52 226,57 24,57" fill="#000000" opacity="0.8" />

            {/* The Upward-Swung Flap Door */}
            <polygon
              points="20,28 230,28 226,52 24,52"
              fill="url(#nesUpperFace)"
              stroke="#6b6760"
              strokeWidth="1.2"
            />
            {/* Top Edge Lip of Open Door */}
            <polygon points="20,28 230,28 228,24 22,24" fill="#a49f97" />

            {/* Muted Red Branding visible on upward-tilted face */}
            <text
              x="32"
              y="40"
              fill="#a82020"
              fontSize="7.5"
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
              letterSpacing="-0.5"
              transform="skewX(-5)"
            >
              Nintendo
            </text>
            <text
              x="32"
              y="48"
              fill="#a82020"
              fontSize="4.5"
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
              transform="skewX(-5)"
            >
              ENTERTAINMENT SYSTEM™
            </text>

            {/* Door Underside Shadow Ridge */}
            <line x1="24" y1="52" x2="226" y2="52" stroke="#2a2826" strokeWidth="1.8" />
          </g>
        )}
      </svg>
    </div>
  );
}
