"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { GameComponentProps } from "../types";
import { playSound } from "@/components/AudioEffects";

const CANVAS_W = 256;
const CANVAS_H = 224;
const GRAVITY = 0.115;
const MAX_MISSED = 5;

interface FruitType {
  name: string;
  outerColor: string;
  innerColor: string;
  seedColor: string;
  radius: number;
  points: number;
  isBomb?: boolean;
  isGolden?: boolean;
}

const FRUIT_TYPES: FruitType[] = [
  {
    name: "WATERMELON",
    outerColor: "#15803d",
    innerColor: "#ef4444",
    seedColor: "#111827",
    radius: 14,
    points: 30,
  },
  {
    name: "ORANGE",
    outerColor: "#ea580c",
    innerColor: "#fb923c",
    seedColor: "#fef08a",
    radius: 11,
    points: 25,
  },
  {
    name: "APPLE",
    outerColor: "#dc2626",
    innerColor: "#fef9c3",
    seedColor: "#451a03",
    radius: 11,
    points: 25,
  },
  {
    name: "BANANA",
    outerColor: "#eab308",
    innerColor: "#fef08a",
    seedColor: "#ca8a04",
    radius: 10,
    points: 35,
  },
  {
    name: "PLUM",
    outerColor: "#7e22ce",
    innerColor: "#c084fc",
    seedColor: "#3b0764",
    radius: 10,
    points: 35,
  },
  {
    name: "GOLDEN PEACH",
    outerColor: "#facc15",
    innerColor: "#fef08a",
    seedColor: "#ffffff",
    radius: 12,
    points: 100,
    isGolden: true,
  },
];

const BOMB_TYPE: FruitType = {
  name: "BOMB",
  outerColor: "#1f2937",
  innerColor: "#ef4444",
  seedColor: "#f97316",
  radius: 11,
  points: 0,
  isBomb: true,
};

interface ActiveFruit {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: FruitType;
  sliced: boolean;
  peaked: boolean;
}

interface SlicedHalf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: FruitType;
  side: -1 | 1;
  alpha: number;
}

interface JuiceParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  big?: boolean;
}

interface SlashBurst {
  x: number;
  y: number;
  radius: number;
  color: string;
  life: number;
}

interface BladePoint {
  x: number;
  y: number;
  life: number;
}

export default function FruitNinjaGame({ onEarnPoints }: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gamePhase, setGamePhase] = useState<"title" | "playing" | "gameover">(
    "title"
  );
  const [finalStats, setFinalStats] = useState({
    score: 0,
    highScore: 0,
    earnedPts: 0,
    reason: "",
  });

  const stateRef = useRef({
    phase: "title" as "title" as "title" | "playing" | "gameover",
    score: 0,
    earnedPts: 0,
    highScore: 0,
    missed: 0,
    elapsedFrames: 0,
    waveTimer: 0,
    waveInterval: 125,
    nextId: 1,
    fruits: [] as ActiveFruit[],
    halves: [] as SlicedHalf[],
    particles: [] as JuiceParticle[],
    bursts: [] as SlashBurst[],
    texts: [] as FloatingText[],
    blade: [] as BladePoint[],
    isPointerDown: false,
    lastPointer: null as { x: number; y: number } | null,
    comboCount: 0,
    comboTimer: 0,
    screenFlash: 0,
    shakeTimer: 0,
    hudFlashTimer: 0,
    gameOverReason: "" as "BOMB EXPLODED!" | "ALL 5 HEARTS LOST!" | "",
  });

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.phase = "playing";
    s.score = 0;
    s.earnedPts = 0;
    s.missed = 0;
    s.elapsedFrames = 0;
    s.waveTimer = 25;
    s.waveInterval = 125;
    s.fruits = [];
    s.halves = [];
    s.particles = [];
    s.bursts = [];
    s.texts = [];
    s.blade = [];
    s.comboCount = 0;
    s.comboTimer = 0;
    s.screenFlash = 0;
    s.shakeTimer = 0;
    s.hudFlashTimer = 0;
    s.gameOverReason = "";
    setGamePhase("playing");
    playSound("coin");
  }, []);

  const triggerGameOver = useCallback(
    (reason: "BOMB EXPLODED!" | "ALL 5 HEARTS LOST!") => {
      const s = stateRef.current;
      if (s.phase !== "playing") return;
      s.phase = "gameover";
      s.gameOverReason = reason;
      if (s.score > s.highScore) {
        s.highScore = s.score;
      }
      setFinalStats({
        score: s.score,
        highScore: s.highScore,
        earnedPts: s.earnedPts,
        reason,
      });
      setGamePhase("gameover");
      playSound("stomp");
    },
    []
  );

  const spawnWave = useCallback(() => {
    const s = stateRef.current;
    const elapsedSec = s.elapsedFrames / 60;

    // Start with only 1-2 fruits per wave, gradually increasing over time!
    let fruitCount: number;
    if (elapsedSec < 12) {
      fruitCount = 1 + Math.floor(Math.random() * 2); // 1 - 2 fruits
    } else if (elapsedSec < 25) {
      fruitCount = 2 + Math.floor(Math.random() * 2); // 2 - 3 fruits
    } else if (elapsedSec < 40) {
      fruitCount = 3 + Math.floor(Math.random() * 2); // 3 - 4 fruits
    } else if (elapsedSec < 60) {
      fruitCount = 4 + Math.floor(Math.random() * 3); // 4 - 6 fruits
    } else {
      fruitCount = 5 + Math.floor(Math.random() * 3); // 5 - 7 fruits
    }

    // Decide how many bombs accompany this wave (frequent bombs!)
    const bombChance = Math.min(0.75, 0.42 + elapsedSec * 0.006);
    const bombCount =
      Math.random() < bombChance
        ? elapsedSec > 25 && Math.random() < 0.35
          ? 2
          : 1
        : 0;

    const totalItems = fruitCount + bombCount;
    // Shuffle which indices are bombs
    const bombIndices = new Set<number>();
    while (bombIndices.size < bombCount) {
      bombIndices.add(Math.floor(Math.random() * totalItems));
    }

    for (let i = 0; i < totalItems; i++) {
      const isBomb = bombIndices.has(i);

      let type: FruitType;
      if (isBomb) {
        type = BOMB_TYPE;
      } else {
        const roll = Math.random();
        if (roll < 0.12) {
          type = FRUIT_TYPES[5]; // Golden Peach (+100 PTS)
        } else if (roll < 0.45) {
          type = FRUIT_TYPES[0]; // Watermelon (+30 PTS)
        } else {
          type = FRUIT_TYPES[1 + Math.floor(Math.random() * 4)];
        }
      }

      // Spread horizontal launch positions across the screen
      const slotWidth = (CANVAS_W - 56) / Math.max(1, totalItems);
      const x =
        28 +
        slotWidth * i +
        Math.random() * Math.max(8, slotWidth - 4);
      const startY = CANVAS_H + 6 + (i % 3) * 5;

      // Target peak high up in the upper half of the screen (y = 26 to 82)
      const peakY = 26 + Math.random() * 56;
      const riseHeight = startY - peakY;
      const vy = -Math.sqrt(2 * GRAVITY * riseHeight);

      // Arc toward the middle region so fruits don't fly off the sides
      const targetX = 44 + Math.random() * (CANVAS_W - 88);
      const flightFrames = Math.abs(vy / GRAVITY);
      const vx = (targetX - x) / flightFrames;

      s.fruits.push({
        id: s.nextId++,
        x,
        y: startY,
        vx,
        vy,
        type,
        sliced: false,
        peaked: false,
      });
    }
  }, []);

  const sliceFruit = useCallback(
    (fruit: ActiveFruit) => {
      const s = stateRef.current;
      if (fruit.sliced || s.phase !== "playing") return;
      fruit.sliced = true;

      if (fruit.type.isBomb) {
        s.screenFlash = 16;
        s.shakeTimer = 24;
        for (let i = 0; i < 32; i++) {
          const angle = (Math.PI * 2 * i) / 32 + Math.random() * 0.2;
          const speed = 1.2 + Math.random() * 3.8;
          s.particles.push({
            x: fruit.x,
            y: fruit.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: i % 2 === 0 ? "#ef4444" : "#facc15",
            size: 3,
            life: 30,
            maxLife: 30,
          });
        }
        s.texts.push({
          x: Math.max(16, Math.min(CANVAS_W - 64, fruit.x - 24)),
          y: fruit.y,
          text: "💥 BOOM!",
          color: "#ef4444",
          life: 45,
          big: true,
        });
        triggerGameOver("BOMB EXPLODED!");
        return;
      }

      // Fruit sliced: award points & trigger strong visual feedback!
      const pts = fruit.type.points;
      s.score += pts;
      s.earnedPts += pts;
      s.hudFlashTimer = 18;
      onEarnPoints?.(pts);

      // Combo tracking
      s.comboCount += 1;
      s.comboTimer = 20;

      playSound(fruit.type.isGolden ? "tetrisClear" : "coin");

      // Bright slash ring burst
      s.bursts.push({
        x: fruit.x,
        y: fruit.y,
        radius: 4,
        color: fruit.type.isGolden ? "#facc15" : fruit.type.innerColor,
        life: 12,
      });

      // Create two halves flying apart
      s.halves.push(
        {
          x: fruit.x - 4,
          y: fruit.y,
          vx: fruit.vx - 1.5,
          vy: Math.min(-1.2, fruit.vy * 0.4),
          type: fruit.type,
          side: -1,
          alpha: 1,
        },
        {
          x: fruit.x + 4,
          y: fruit.y,
          vx: fruit.vx + 1.5,
          vy: Math.min(-1.2, fruit.vy * 0.4),
          type: fruit.type,
          side: 1,
          alpha: 1,
        }
      );

      // Juicy pixel splatter particles
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 3.0;
        s.particles.push({
          x: fruit.x,
          y: fruit.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.6,
          color:
            i % 4 === 0
              ? "#ffffff"
              : i % 3 === 0
              ? fruit.type.outerColor
              : fruit.type.innerColor,
          size: i % 2 === 0 ? 3 : 2,
          life: 26 + Math.floor(Math.random() * 14),
          maxLife: 40,
        });
      }

      s.texts.push({
        x: Math.max(10, Math.min(CANVAS_W - 68, fruit.x - 22)),
        y: Math.max(30, fruit.y - 8),
        text: `+${pts} PTS!`,
        color: fruit.type.isGolden ? "#facc15" : "#4ade80",
        life: 36,
        big: true,
      });
    },
    [onEarnPoints, triggerGameOver]
  );

  // Check line-segment to circle intersection for smooth slicing
  const checkSliceSegment = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      const s = stateRef.current;
      if (s.phase !== "playing") return;

      for (const fruit of s.fruits) {
        if (fruit.sliced) continue;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lenSq = dx * dx + dy * dy;
        let t = 0;
        if (lenSq > 0) {
          t = Math.max(
            0,
            Math.min(1, ((fruit.x - x1) * dx + (fruit.y - y1) * dy) / lenSq)
          );
        }
        const closestX = x1 + t * dx;
        const closestY = y1 + t * dy;
        const distSq =
          (fruit.x - closestX) * (fruit.x - closestX) +
          (fruit.y - closestY) * (fruit.y - closestY);
        const hitRadius = fruit.type.radius + 6;
        if (distSq <= hitRadius * hitRadius) {
          sliceFruit(fruit);
        }
      }
    },
    [sliceFruit]
  );

  const getCanvasCoords = (
    e: React.PointerEvent<HTMLCanvasElement>
  ): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = stateRef.current;
    if (s.phase === "title") {
      startGame();
      return;
    }
    if (s.phase !== "playing") return;
    const pt = getCanvasCoords(e);
    s.isPointerDown = true;
    s.lastPointer = pt;
    s.blade.push({ x: pt.x, y: pt.y, life: 10 });
    checkSliceSegment(pt.x, pt.y, pt.x, pt.y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = stateRef.current;
    if (s.phase !== "playing") return;
    const pt = getCanvasCoords(e);
    const prev = s.lastPointer || pt;
    const dist = Math.hypot(pt.x - prev.x, pt.y - prev.y);

    if (dist > 1.5) {
      s.blade.push({ x: pt.x, y: pt.y, life: 10 });
      checkSliceSegment(prev.x, prev.y, pt.x, pt.y);
      s.lastPointer = pt;
    }
  };

  const handlePointerUp = () => {
    stateRef.current.isPointerDown = false;
    stateRef.current.lastPointer = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startGame]);

  useEffect(() => {
    let animId: number;

    const drawPixelFruit = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      type: FruitType,
      halfSide?: -1 | 1
    ) => {
      const r = Math.round(type.radius);
      const px = Math.round(x);
      const py = Math.round(y);

      ctx.save();
      if (halfSide) {
        ctx.beginPath();
        if (halfSide === -1) {
          ctx.rect(px - r - 4, py - r - 4, r + 3, r * 2 + 8);
        } else {
          ctx.rect(px + 1, py - r - 4, r + 3, r * 2 + 8);
        }
        ctx.clip();
      }

      if (type.isBomb) {
        // Flashing danger aura around bomb
        if (Math.floor(Date.now() / 120) % 2 === 0) {
          ctx.fillStyle = "rgba(239, 68, 68, 0.35)";
          ctx.fillRect(px - r - 2, py - r - 2, (r + 2) * 2, (r + 2) * 2);
        }
        // Pixel Bomb casing
        ctx.fillStyle = "#111827";
        ctx.fillRect(px - r + 2, py - r, (r - 2) * 2, r * 2);
        ctx.fillRect(px - r, py - r + 2, r * 2, (r - 2) * 2);
        ctx.fillStyle = "#9ca3af";
        ctx.fillRect(px - r + 4, py - r + 4, 3, 3);
        // Red danger X on bomb
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(px - 3, py - 1, 6, 2);
        ctx.fillRect(px - 1, py - 3, 2, 6);
        // Sparkling Fuse
        ctx.fillStyle = "#d97706";
        ctx.fillRect(px - 1, py - r - 4, 2, 4);
        ctx.fillStyle = Math.random() > 0.5 ? "#facc15" : "#ef4444";
        ctx.fillRect(px - 3, py - r - 8, 6, 4);
      } else {
        // Outer pixel rind
        ctx.fillStyle = type.outerColor;
        ctx.fillRect(px - r + 2, py - r, (r - 2) * 2, r * 2);
        ctx.fillRect(px - r, py - r + 2, r * 2, (r - 2) * 2);

        // Inner juicy flesh
        const ir = Math.max(3, r - 3);
        ctx.fillStyle = type.innerColor;
        ctx.fillRect(px - ir + 1, py - ir, (ir - 1) * 2, ir * 2);
        ctx.fillRect(px - ir, py - ir + 1, ir * 2, (ir - 1) * 2);

        // Pixel seeds / shine
        ctx.fillStyle = type.seedColor;
        ctx.fillRect(px - 3, py - 2, 2, 2);
        ctx.fillRect(px + 2, py - 2, 2, 2);
        ctx.fillRect(px, py + 2, 2, 2);

        // Small green leaf on top
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(px, py - r - 2, 3, 2);
      }
      ctx.restore();
    };

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const s = stateRef.current;

      ctx.save();
      if (s.shakeTimer > 0) {
        s.shakeTimer--;
        const sx = (Math.random() - 0.5) * 7;
        const sy = (Math.random() - 0.5) * 7;
        ctx.translate(sx, sy);
      }

      // 1. Retro Dojo Wood Wall Background
      ctx.fillStyle = "#1c110a";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.fillStyle = "#29180e";
      for (let y = 24; y < CANVAS_H; y += 28) {
        ctx.fillRect(0, y, CANVAS_W, 24);
      }
      ctx.fillStyle = "#3b2314";
      for (let x = 32; x < CANVAS_W; x += 64) {
        ctx.fillRect(x, 24, 2, CANVAS_H - 24);
      }

      // 2. Top Arcade HUD Bar with 5 Hearts in Top-Left & Score in Top-Right
      ctx.fillStyle = s.hudFlashTimer > 0 ? "#064e3b" : "#090d16";
      ctx.fillRect(0, 0, CANVAS_W, 22);
      ctx.fillStyle = s.hudFlashTimer > 0 ? "#34d399" : "#eab308";
      ctx.fillRect(0, 21, CANVAS_W, 2);
      if (s.hudFlashTimer > 0) s.hudFlashTimer--;

      // 5 Pixel Hearts in Top-Left Corner (lose 1 heart per missed fruit)
      const heartsRemaining = Math.max(0, MAX_MISSED - s.missed);
      for (let i = 0; i < MAX_MISSED; i++) {
        const hx = 6 + i * 13;
        const hy = 6;
        const alive = i < heartsRemaining;
        ctx.fillStyle = alive ? "#ef4444" : "#374151";
        // Top lobes of pixel heart
        ctx.fillRect(hx + 1, hy, 3, 2);
        ctx.fillRect(hx + 6, hy, 3, 2);
        // Middle body
        ctx.fillRect(hx, hy + 2, 10, 3);
        // Lower taper
        ctx.fillRect(hx + 1, hy + 5, 8, 2);
        ctx.fillRect(hx + 2, hy + 7, 6, 1);
        ctx.fillRect(hx + 4, hy + 8, 2, 1);
        if (alive) {
          ctx.fillStyle = "#fecaca";
          ctx.fillRect(hx + 1, hy + 1, 2, 2);
        }
      }

      ctx.font = "7px 'Press Start 2P', monospace";
      ctx.fillStyle = s.hudFlashTimer > 0 ? "#ffffff" : "#4ade80";
      ctx.fillText(`+${s.earnedPts}PTS`, 84, 14);

      ctx.fillStyle = "#facc15";
      ctx.fillText(`SCORE:${s.score}`, 168, 14);

      // 3. Game State Logic
      if (s.phase === "title") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
        ctx.fillRect(16, 36, CANVAS_W - 32, 156);
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;
        ctx.strokeRect(16, 36, CANVAS_W - 32, 156);

        drawPixelFruit(ctx, CANVAS_W / 2 - 40, 66, FRUIT_TYPES[0]);
        drawPixelFruit(ctx, CANVAS_W / 2, 66, FRUIT_TYPES[5]);
        drawPixelFruit(ctx, CANVAS_W / 2 + 40, 66, BOMB_TYPE);

        ctx.fillStyle = "#4ade80";
        ctx.font = "11px 'Press Start 2P', monospace";
        ctx.fillText("PIXEL NINJA", 66, 102);

        ctx.fillStyle = "#f97316";
        ctx.font = "7px 'Press Start 2P', monospace";
        ctx.fillText("FRUIT SLASHER", 82, 116);

        ctx.fillStyle = "#e5e7eb";
        ctx.font = "6px 'Press Start 2P', monospace";
        ctx.fillText("SWIPE MOUSE TO SLICE!", 64, 138);
        ctx.fillText("AVOID BOMBS! 5 HEARTS", 62, 152);

        if (Math.floor(Date.now() / 400) % 2 === 0) {
          ctx.fillStyle = "#facc15";
          ctx.font = "7px 'Press Start 2P', monospace";
          ctx.fillText("CLICK SCREEN TO START", 52, 176);
        }
      } else if (s.phase === "playing") {
        s.elapsedFrames++;
        s.waveTimer--;
        if (s.waveTimer <= 0) {
          spawnWave();
          const elapsedSec = s.elapsedFrames / 60;
          // Starts at 125 frames (~2.1s) and slowly shortens down to 48 frames as time passes
          s.waveInterval = Math.max(48, Math.round(125 - elapsedSec * 1.35));
          s.waveTimer = s.waveInterval;
        }

        // Multi-fruit combo bonus
        if (s.comboTimer > 0) {
          s.comboTimer--;
          if (s.comboTimer === 0) {
            if (s.comboCount >= 2) {
              const bonus = s.comboCount * 25;
              s.score += bonus;
              s.earnedPts += bonus;
              s.hudFlashTimer = 24;
              onEarnPoints?.(bonus);
              playSound("tetrisClear");
              s.texts.push({
                x: Math.max(12, CANVAS_W / 2 - 64),
                y: 62,
                text: `🔥COMBO x${s.comboCount}! +${bonus}PTS`,
                color: "#facc15",
                life: 48,
                big: true,
              });
            }
            s.comboCount = 0;
          }
        }

        // Update & draw active fruits
        for (let i = s.fruits.length - 1; i >= 0; i--) {
          const f = s.fruits[i];
          f.x += f.vx;
          f.y += f.vy;
          f.vy += GRAVITY;
          if (f.vy > 0) f.peaked = true;

          if (f.x < 18 || f.x > CANVAS_W - 18) {
            f.vx = -f.vx;
          }

          if (!f.sliced) {
            drawPixelFruit(ctx, f.x, f.y, f.type);
          }

          if (f.y > CANVAS_H + 24 && f.peaked) {
            if (!f.sliced && !f.type.isBomb) {
              s.missed += 1;
              playSound("blockHit");
              s.texts.push({
                x: Math.max(16, Math.min(CANVAS_W - 48, f.x - 12)),
                y: CANVAS_H - 14,
                text: "-1 ♥",
                color: "#ef4444",
                life: 32,
              });
              if (s.missed >= MAX_MISSED) {
                triggerGameOver("ALL 5 HEARTS LOST!");
              }
            }
            s.fruits.splice(i, 1);
          } else if (f.sliced) {
            s.fruits.splice(i, 1);
          }
        }
      }

      // 4. Slash ring bursts
      for (let i = s.bursts.length - 1; i >= 0; i--) {
        const b = s.bursts[i];
        b.radius += 2.2;
        b.life--;
        if (b.life <= 0) {
          s.bursts.splice(i, 1);
        } else {
          ctx.strokeStyle = b.color;
          ctx.lineWidth = 2;
          ctx.strokeRect(
            Math.round(b.x - b.radius),
            Math.round(b.y - b.radius),
            Math.round(b.radius * 2),
            Math.round(b.radius * 2)
          );
        }
      }

      // 5. Sliced halves
      for (let i = s.halves.length - 1; i >= 0; i--) {
        const h = s.halves[i];
        h.x += h.vx;
        h.y += h.vy;
        h.vy += GRAVITY * 1.15;
        h.alpha -= 0.02;
        if (h.y > CANVAS_H + 20 || h.alpha <= 0) {
          s.halves.splice(i, 1);
        } else {
          drawPixelFruit(ctx, h.x, h.y, h.type, h.side);
        }
      }

      // 6. Juice splatter particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += GRAVITY * 0.6;
        p.life--;
        if (p.life <= 0) {
          s.particles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        }
      }

      // 7. Katana Blade Trail
      if (s.blade.length > 1) {
        for (let i = 1; i < s.blade.length; i++) {
          const p1 = s.blade[i - 1];
          const p2 = s.blade[i];
          ctx.strokeStyle = p2.life > 5 ? "#ffffff" : "#38bdf8";
          ctx.lineWidth = Math.max(1.5, Math.floor(p2.life / 2));
          ctx.beginPath();
          ctx.moveTo(Math.round(p1.x), Math.round(p1.y));
          ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
          ctx.stroke();
        }
      }
      for (let i = s.blade.length - 1; i >= 0; i--) {
        s.blade[i].life--;
        if (s.blade[i].life <= 0) s.blade.splice(i, 1);
      }

      // 8. Bold Floating Score & Combo Popups with Black Outline
      for (let i = s.texts.length - 1; i >= 0; i--) {
        const t = s.texts[i];
        t.y -= 0.75;
        t.life--;
        if (t.life <= 0) {
          s.texts.splice(i, 1);
        } else {
          ctx.font = t.big
            ? "bold 8px 'Press Start 2P', monospace"
            : "7px 'Press Start 2P', monospace";
          const rx = Math.round(t.x);
          const ry = Math.round(t.y);
          // High-contrast dark outline
          ctx.fillStyle = "#000000";
          ctx.fillText(t.text, rx - 1, ry);
          ctx.fillText(t.text, rx + 1, ry);
          ctx.fillText(t.text, rx, ry - 1);
          ctx.fillText(t.text, rx, ry + 1);
          ctx.fillStyle = t.color;
          ctx.fillText(t.text, rx, ry);
        }
      }

      // 9. Screen flash on bomb explosion
      if (s.screenFlash > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.screenFlash / 16})`;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        s.screenFlash--;
      }

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [onEarnPoints, spawnWave, triggerGameOver]);

  return (
    <div
      data-game-phase={gamePhase}
      className="w-full h-full flex flex-col items-center justify-center relative select-none font-pixel bg-black cursor-crosshair"
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full object-contain touch-none"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Interactive Game Over Modal Overlay with Prominent Points Feedback & Restart Button */}
      {gamePhase === "gameover" && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-3 z-20 animate-fade-in">
          <div className="bg-neutral-950 border-4 border-red-500 px-4 py-3 rounded flex flex-col items-center text-center max-w-[230px] w-full shadow-[0_0_25px_rgba(239,68,68,0.6)] space-y-2">
            <div className="text-red-500 text-xs sm:text-sm font-bold tracking-wider">
              GAME OVER
            </div>
            <div className="text-[8px] text-orange-400">
              {finalStats.reason}
            </div>

            {/* Big Prominent Points Earned Banner */}
            <div className="w-full bg-emerald-950/90 border-2 border-emerald-400 py-1.5 px-2 rounded shadow-[0_0_12px_rgba(52,211,153,0.5)]">
              <div className="text-[7px] text-emerald-300 uppercase">
                TOTAL POINTS EARNED
              </div>
              <div className="text-xs sm:text-sm text-yellow-300 font-bold mt-0.5 animate-pulse">
                🪙 +{finalStats.earnedPts} PTS!
              </div>
            </div>

            <div className="text-[8px] text-neutral-300 space-y-0.5">
              <div>FINAL SCORE: {finalStats.score}</div>
              <div className="text-yellow-400">BEST SCORE: {finalStats.highScore}</div>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 text-white font-bold text-[9px] sm:text-[10px] rounded border-2 border-emerald-300 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all"
            >
              🔄 PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
