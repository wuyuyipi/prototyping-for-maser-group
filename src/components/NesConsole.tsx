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
  // Local door state allows flipping the door open/closed
  const [doorOpen, setDoorOpen] = useState(false);
  const isOpen = doorOpen || isModalOpen;

  const handleDoorClick = () => {
    playSound("slotOpen");
    const nextState = !isOpen;
    setDoorOpen(nextState);
    if (nextState) {
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
          SVG Pixel-Art NES-001 (Perspective Front-Loader matching real console)
          ====================================================================== */}
      <svg
        viewBox="0 0 320 180"
        className="w-72 sm:w-80 md:w-88 h-auto filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.9)] cursor-pointer"
        onClick={handleDoorClick}
        role="button"
        aria-label="NES Console - Click cartridge slot to open and switch games"
      >
        <defs>
          {/* LED Glow Filter */}
          <filter id="red-led-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients for authentic plastic shading */}
          <linearGradient id="topChassisGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e4e8eb" />
            <stop offset="100%" stopColor="#cbcfd4" />
          </linearGradient>

          <linearGradient id="baseChassisGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#676b74" />
            <stop offset="100%" stopColor="#464950" />
          </linearGradient>

          <linearGradient id="blackBandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#18191c" />
            <stop offset="100%" stopColor="#0c0d0f" />
          </linearGradient>
        </defs>

        {/* -------------------------------------------------------------
            1. CONSOLE BASE (Dark Charcoal Lower Section)
            ------------------------------------------------------------- */}
        {/* Slanted Lower Base */}
        <polygon
          points="20,95 300,95 292,170 28,170"
          fill="url(#baseChassisGrad)"
          stroke="#2d3035"
          strokeWidth="2"
        />
        {/* Base Bevel Bottom Trim */}
        <polygon
          points="28,170 292,170 288,176 32,176"
          fill="#31343a"
        />

        {/* -------------------------------------------------------------
            2. UPPER CHASSIS (Light Grey Top Section)
            ------------------------------------------------------------- */}
        {/* Top Cover Surface (Angled perspective top) */}
        <polygon
          points="45,15 275,15 300,50 20,50"
          fill="#dce0e4"
          stroke="#b0b5bb"
          strokeWidth="1.5"
        />

        {/* Top Right Ventilation Slats Grill */}
        <polygon points="195,18 270,18 290,48 205,48" fill="#c7ccd2" />
        {[...Array(14)].map((_, i) => (
          <line
            key={i}
            x1={197 + i * 5}
            y1={20}
            x2={207 + i * 5.8}
            y2={46}
            stroke="#9ba1aa"
            strokeWidth="2"
          />
        ))}

        {/* Front Upper Face (Light Grey) */}
        <rect
          x="20"
          y="50"
          width="280"
          height="48"
          fill="url(#topChassisGrad)"
          stroke="#9ba0a7"
          strokeWidth="1.5"
        />

        {/* -------------------------------------------------------------
            3. RIGHT BLACK RECESS BAND & CONTROLLER PORTS
            ------------------------------------------------------------- */}
        {/* Top Recessed Black Groove */}
        <polygon points="190,15 204,15 214,50 200,50" fill="#141518" />
        {/* Front Vertical Black Band */}
        <rect
          x="198"
          y="50"
          width="40"
          height="120"
          fill="url(#blackBandGrad)"
          stroke="#090a0c"
          strokeWidth="1.5"
        />

        {/* Controller Port 1 (Top) */}
        <g transform="translate(206, 102)">
          <rect x="0" y="0" width="24" height="15" rx="1" fill="#000" stroke="#25272c" strokeWidth="1" />
          <text x="3" y="-3" fill="#d82424" fontSize="6" fontFamily="monospace" fontWeight="bold">1</text>
          {/* 7 Pins */}
          {[2, 7, 12, 17, 22].map((px, i) => (
            <circle key={i} cx={px} cy={5} r="1" fill="#757982" />
          ))}
          <circle cx={5} cy={10} r="1" fill="#757982" />
          <circle cx={19} cy={10} r="1" fill="#757982" />
        </g>

        {/* Controller Port 2 (Bottom) */}
        <g transform="translate(206, 128)">
          <rect x="0" y="0" width="24" height="15" rx="1" fill="#000" stroke="#25272c" strokeWidth="1" />
          <text x="3" y="-3" fill="#d82424" fontSize="6" fontFamily="monospace" fontWeight="bold">2</text>
          {[2, 7, 12, 17, 22].map((px, i) => (
            <circle key={i} cx={px} cy={5} r="1" fill="#757982" />
          ))}
          <circle cx={5} cy={10} r="1" fill="#757982" />
          <circle cx={19} cy={10} r="1" fill="#757982" />
        </g>

        {/* -------------------------------------------------------------
            4. LOWER LEFT: POWER / RESET BUTTONS & RED LED
            ------------------------------------------------------------- */}
        {/* Red Power LED */}
        <circle
          cx="48"
          cy="126"
          r="3"
          fill={activeGame ? "#ff2a2a" : "#600"}
          filter={activeGame ? "url(#red-led-glow)" : "none"}
        />
        <circle cx="48" cy="126" r="1.5" fill={activeGame ? "#ff9999" : "#400"} />

        {/* POWER Button */}
        <g transform="translate(62, 114)">
          <rect
            x="0"
            y="0"
            width="38"
            height="22"
            rx="1"
            fill="#dce0e4"
            stroke="#1c1e22"
            strokeWidth="1.5"
            className="hover:fill-white"
          />
          {/* 3D Inset Bevel */}
          <rect x="2" y="2" width="34" height="18" fill="#cbcfd4" />
          <text
            x="7"
            y="13"
            fill="#d82424"
            fontSize="6"
            fontFamily="'Press Start 2P', monospace"
            fontWeight="bold"
            letterSpacing="-0.5"
          >
            POWER
          </text>
        </g>

        {/* RESET Button */}
        <g transform="translate(108, 114)" onClick={handleReset}>
          <rect
            x="0"
            y="0"
            width="38"
            height="22"
            rx="1"
            fill="#dce0e4"
            stroke="#1c1e22"
            strokeWidth="1.5"
            className="hover:fill-white"
          />
          <rect x="2" y="2" width="34" height="18" fill="#cbcfd4" />
          <text
            x="7"
            y="13"
            fill="#d82424"
            fontSize="6"
            fontFamily="'Press Start 2P', monospace"
            fontWeight="bold"
            letterSpacing="-0.5"
          >
            RESET
          </text>
        </g>

        {/* -------------------------------------------------------------
            5. THE CARTRIDGE CHAMBER & HINGED DOOR FLAP (THE MAIN ATTRACTION)
            ------------------------------------------------------------- */}
        {/* Deep Recessed Chamber Opening Behind Door */}
        <rect
          x="32"
          y="54"
          width="158"
          height="38"
          fill="#0c0d0f"
          stroke="#26282e"
          strokeWidth="1.5"
        />

        {/* Inner Cartridge Spring Tray Base */}
        <rect x="36" y="58" width="150" height="30" fill="#18191d" />

        {/* Horizontal Cartridge Loaded in Tray (when door is open or closed) */}
        {activeGame && (
          <g transform="translate(42, 64)">
            {/* Grey Cartridge Casing */}
            <rect
              x="0"
              y="0"
              width="138"
              height="20"
              rx="1"
              fill="#52565e"
              stroke="#2c2f35"
              strokeWidth="1"
            />
            {/* Cartridge Top Ridge Notches */}
            <line x1="8" y1="3" x2="130" y2="3" stroke="#3b3e44" strokeWidth="1" />
            {/* Horizontal Spine Label (Just like Super Mario Bros./Duck Hunt in photo) */}
            <rect
              x="14"
              y="6"
              width="110"
              height="10"
              fill={activeGame.labelColor}
              stroke="#1a1a1a"
              strokeWidth="0.5"
            />
            {/* Spine Label Text */}
            <text
              x="20"
              y="14"
              fill="#ffffff"
              fontSize="5.5"
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
            >
              {activeGame.title.toUpperCase()}
            </text>
            <text
              x="106"
              y="14"
              fill="#facc15"
              fontSize="4.5"
              fontFamily="'Press Start 2P', monospace"
            >
              {activeGame.labelBadge}
            </text>
          </g>
        )}

        {/* Inner Chamber Shadow Overlay */}
        <rect
          x="32"
          y="54"
          width="158"
          height="6"
          fill="black"
          opacity="0.6"
        />

        {/* =============================================================
            THE HINGED DOOR FLAP
            - When CLOSED: Lies flat on front, covering the chamber.
            - When OPEN: Swings UPWARD horizontally at an angle on its top hinge!
            ============================================================= */}
        {!isOpen ? (
          /* CLOSED DOOR: Flat on Front Face */
          <g className="transition-transform duration-200">
            {/* Door Panel Body */}
            <rect
              x="30"
              y="52"
              width="162"
              height="42"
              fill="url(#topChassisGrad)"
              stroke="#8c9199"
              strokeWidth="1"
            />
            {/* Top Inset Groove */}
            <line x1="32" y1="55" x2="190" y2="55" stroke="#ffffff" strokeWidth="1" />
            {/* Red Authentic NES Branding */}
            <text
              x="38"
              y="69"
              fill="#d82424"
              fontSize="8.5"
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
              letterSpacing="-0.5"
            >
              Nintendo
            </text>
            <text
              x="38"
              y="78"
              fill="#d82424"
              fontSize="5"
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
              letterSpacing="0"
            >
              ENTERTAINMENT SYSTEM™
            </text>
            {/* Bottom Finger Grip Ridge */}
            <line x1="38" y1="87" x2="184" y2="87" stroke="#b0b5bc" strokeWidth="1.5" />
          </g>
        ) : (
          /* OPEN DOOR: Hinged UPWARDS into 3D Space (Exactly as in photo!) */
          <g className="transition-all duration-300">
            {/* Door Shadow on chamber */}
            <polygon points="30,52 192,52 192,56 30,56" fill="black" opacity="0.7" />

            {/* Upward-Tilted Hinged Flap Face */}
            <polygon
              points="26,24 196,24 192,52 30,52"
              fill="#e6eaee"
              stroke="#858a92"
              strokeWidth="1.5"
            />
            {/* Top Lip of Open Flap */}
            <polygon points="26,24 196,24 194,20 28,20" fill="#d2d6dc" />

            {/* Red Branding visible on upward-angled face */}
            <text
              x="36"
              y="38"
              fill="#d82424"
              fontSize="7.5"
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
              letterSpacing="-0.5"
              transform="skewX(-4)"
            >
              Nintendo
            </text>
            <text
              x="36"
              y="46"
              fill="#d82424"
              fontSize="4.5"
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
              transform="skewX(-4)"
            >
              ENTERTAINMENT SYSTEM™
            </text>

            {/* Door Underside Dark Lip */}
            <line x1="30" y1="52" x2="192" y2="52" stroke="#50545a" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
}
