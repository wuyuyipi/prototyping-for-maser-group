"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { GameComponentProps } from "../types";
import { playSound } from "@/components/AudioEffects";

interface Enemy {
  x: number;
  y: number;
  vx: number;
  minX: number;
  maxX: number;
  alive: boolean;
  squashedTimer: number;
}

interface Block {
  x: number;
  y: number;
  type: "brick" | "question" | "empty";
  bumpOffset: number;
}

interface SolidStructure {
  x: number;
  y: number; // top Y coordinate
  width: number;
  height: number;
  kind: "pipe" | "stone" | "platform";
}

interface FloatingEffect {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  hasCoinIcon?: boolean;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

function createInitialEnemies(): Enemy[] {
  return [
    { x: 220, y: 192, vx: -0.6, minX: 110, maxX: 262, alive: true, squashedTimer: 0 },
    { x: 350, y: 192, vx: 0.65, minX: 314, maxX: 378, alive: true, squashedTimer: 0 },
    { x: 470, y: 192, vx: -0.65, minX: 430, maxX: 518, alive: true, squashedTimer: 0 },
    { x: 695, y: 192, vx: -0.7, minX: 658, maxX: 816, alive: true, squashedTimer: 0 },
    { x: 765, y: 192, vx: 0.7, minX: 658, maxX: 816, alive: true, squashedTimer: 0 },
    { x: 750, y: 104, vx: -0.55, minX: 736, maxX: 786, alive: true, squashedTimer: 0 },
  ];
}

function createInitialBlocks(): Block[] {
  return [
    // Opening section
    { x: 144, y: 144, type: "question", bumpOffset: 0 },
    { x: 176, y: 144, type: "brick", bumpOffset: 0 },
    { x: 192, y: 144, type: "question", bumpOffset: 0 },
    { x: 208, y: 144, type: "brick", bumpOffset: 0 },
    { x: 224, y: 144, type: "question", bumpOffset: 0 },
    { x: 192, y: 92, type: "question", bumpOffset: 0 },

    // Above Sky Bridge
    { x: 336, y: 84, type: "question", bumpOffset: 0 },
    { x: 352, y: 84, type: "question", bumpOffset: 0 },

    // Mid section before twin pyramids
    { x: 448, y: 144, type: "brick", bumpOffset: 0 },
    { x: 464, y: 144, type: "question", bumpOffset: 0 },
    { x: 480, y: 144, type: "brick", bumpOffset: 0 },

    // High block between Twin Stone Pyramids
    { x: 584, y: 88, type: "question", bumpOffset: 0 },

    // High blocks above Multi-Tier Terrace
    { x: 744, y: 68, type: "question", bumpOffset: 0 },
    { x: 760, y: 68, type: "brick", bumpOffset: 0 },
    { x: 776, y: 68, type: "question", bumpOffset: 0 },

    // Pre-flagpole bonus block before staircase
    { x: 860, y: 104, type: "question", bumpOffset: 0 },
  ];
}

// Rich terrain: Pipes, Floating Platforms, Twin Pyramids, Hurdles, and 6-Step Flagpole Staircase!
const SOLID_STRUCTURES: SolidStructure[] = [
  // Early Warp Pipes
  { x: 280, y: 176, width: 32, height: 32, kind: "pipe" },
  { x: 396, y: 160, width: 32, height: 48, kind: "pipe" },

  // Elevated Sky Platform between pipes
  { x: 324, y: 136, width: 56, height: 10, kind: "platform" },

  // Twin Stone Pyramids (Ascending & Descending stairs)
  { x: 536, y: 192, width: 16, height: 16, kind: "stone" },
  { x: 552, y: 176, width: 16, height: 32, kind: "stone" },
  { x: 568, y: 160, width: 16, height: 48, kind: "stone" },
  { x: 608, y: 160, width: 16, height: 48, kind: "stone" },
  { x: 624, y: 176, width: 16, height: 32, kind: "stone" },
  { x: 640, y: 192, width: 16, height: 16, kind: "stone" },

  // Multi-Tier Floating Terraces
  { x: 684, y: 156, width: 56, height: 10, kind: "platform" },
  { x: 736, y: 120, width: 68, height: 10, kind: "platform" },

  // Pre-Staircase Stone Hurdles
  { x: 832, y: 176, width: 16, height: 32, kind: "stone" },
  { x: 864, y: 160, width: 16, height: 48, kind: "stone" },

  // Iconic 6-Step Flagpole Staircase right before the Flagpole!
  { x: 904, y: 192, width: 16, height: 16, kind: "stone" },
  { x: 920, y: 176, width: 16, height: 32, kind: "stone" },
  { x: 936, y: 160, width: 16, height: 48, kind: "stone" },
  { x: 952, y: 144, width: 16, height: 64, kind: "stone" },
  { x: 968, y: 128, width: 16, height: 80, kind: "stone" },
  { x: 984, y: 112, width: 24, height: 96, kind: "stone" },
];

export default function SuperPixelBrosGame({
  onEarnPoints,
}: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [earnedPts, setEarnedPts] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const gameStateRef = useRef({
    score: 0,
    earnedPts: 0,
    coins: 0,
    time: 392,
    cameraX: 0,
    hudFlashTimer: 0,
    player: {
      x: 40,
      y: 160,
      vx: 0,
      vy: 0,
      width: 14,
      height: 16,
      grounded: true,
      facingRight: true,
      animFrame: 0,
      alive: true,
    },
    keys: {
      left: false,
      right: false,
      jump: false,
    },
    enemies: createInitialEnemies(),
    blocks: createInitialBlocks(),
    effects: [] as FloatingEffect[],
    particles: [] as SparkParticle[],
    flagpoleX: 1045,
  });

  const restartGame = useCallback(() => {
    const state = gameStateRef.current;
    state.score = 0;
    state.earnedPts = 0;
    state.coins = 0;
    state.cameraX = 0;
    state.hudFlashTimer = 0;
    state.player = {
      x: 40,
      y: 160,
      vx: 0,
      vy: 0,
      width: 14,
      height: 16,
      grounded: true,
      facingRight: true,
      animFrame: 0,
      alive: true,
    };
    state.enemies = createInitialEnemies();
    state.blocks = createInitialBlocks();
    state.effects = [];
    state.particles = [];
    setScore(0);
    setEarnedPts(0);
    setCoins(0);
    setGameOver(false);
    setWon(false);
    playSound("coin");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "KeyA"].includes(e.code)) {
        gameStateRef.current.keys.left = true;
      }
      if (["ArrowRight", "KeyD"].includes(e.code)) {
        gameStateRef.current.keys.right = true;
      }
      if (["ArrowUp", "KeyW", "Space"].includes(e.code)) {
        e.preventDefault();
        if (!gameStateRef.current.keys.jump && gameStateRef.current.player.grounded) {
          gameStateRef.current.player.vy = -6.6;
          gameStateRef.current.player.grounded = false;
          playSound("jump");
        }
        gameStateRef.current.keys.jump = true;
      }
      if (e.code === "KeyR") {
        restartGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["ArrowLeft", "KeyA"].includes(e.code)) {
        gameStateRef.current.keys.left = false;
      }
      if (["ArrowRight", "KeyD"].includes(e.code)) {
        gameStateRef.current.keys.right = false;
      }
      if (["ArrowUp", "KeyW", "Space"].includes(e.code)) {
        gameStateRef.current.keys.jump = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [restartGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const spawnBurst = (x: number, y: number, color1: string, color2: string) => {
      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
        const speed = 0.8 + Math.random() * 2.4;
        gameStateRef.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          color: i % 2 === 0 ? color1 : color2,
          life: 24,
        });
      }
    };

    const gameLoop = () => {
      const state = gameStateRef.current;
      const { player, keys, enemies, blocks, flagpoleX } = state;

      const speed = 1.9;
      if (player.alive && !won && !gameOver) {
        if (keys.left) {
          player.vx = -speed;
          player.facingRight = false;
          player.animFrame += 0.2;
        } else if (keys.right) {
          player.vx = speed;
          player.facingRight = true;
          player.animFrame += 0.2;
        } else {
          player.vx *= 0.6;
          if (Math.abs(player.vx) < 0.1) player.vx = 0;
        }

        // Apply Gravity
        player.vy += 0.34;
        if (player.vy > 7) player.vy = 7;

        const prevY = player.y;
        player.x += player.vx;
        if (player.x < 0) player.x = 0;
        player.y += player.vy;
        player.grounded = false;

        // Ground collision (y = 192 is top of ground for 16px tall Mario)
        const groundY = 192;
        if (player.y >= groundY) {
          player.y = groundY;
          player.vy = 0;
          player.grounded = true;
        }

        // Solid structures collision (Pipes, Stone Steps, Floating Platforms)
        SOLID_STRUCTURES.forEach((st) => {
          if (
            player.x + player.width > st.x &&
            player.x < st.x + st.width &&
            player.y + player.height > st.y &&
            player.y < st.y + st.height
          ) {
            // Land on top
            if (player.vy >= 0 && prevY + player.height <= st.y + 7) {
              player.y = st.y - player.height;
              player.vy = 0;
              player.grounded = true;
            } else if (st.kind !== "platform") {
              // Side collision for solid pipes and stone steps
              if (player.vx > 0 && player.x + player.width - player.vx <= st.x + 4) {
                player.x = st.x - player.width;
              } else if (player.vx < 0 && player.x - player.vx >= st.x + st.width - 4) {
                player.x = st.x + st.width;
              }
            }
          }
        });

        // Block collisions (Headbutt from below or land on top)
        blocks.forEach((block) => {
          if (
            player.x + player.width > block.x &&
            player.x < block.x + 16 &&
            player.y < block.y + 16 &&
            player.y + player.height > block.y
          ) {
            // Hit from below!
            if (player.vy < 0 && prevY >= block.y + 10) {
              player.y = block.y + 16;
              player.vy = 0.5;
              if (block.type === "question") {
                block.type = "empty";
                block.bumpOffset = -6;
                playSound("coin");
                const pts = 200;
                state.score += pts;
                state.earnedPts += pts;
                state.coins += 1;
                state.hudFlashTimer = 22;
                setScore(state.score);
                setEarnedPts(state.earnedPts);
                setCoins(state.coins);
                onEarnPoints?.(pts);

                spawnBurst(block.x + 8, block.y, "#facc15", "#ffffff");
                state.effects.push({
                  x: block.x - 10,
                  y: block.y - 6,
                  text: `+${pts} PTS!`,
                  color: "#facc15",
                  life: 40,
                  hasCoinIcon: true,
                });
              } else if (block.type === "brick") {
                block.bumpOffset = -5;
                playSound("blockHit");
                const pts = 50;
                state.score += pts;
                state.earnedPts += pts;
                state.hudFlashTimer = 14;
                setScore(state.score);
                setEarnedPts(state.earnedPts);
                onEarnPoints?.(pts);

                spawnBurst(block.x + 8, block.y + 4, "#fb923c", "#fde047");
                state.effects.push({
                  x: block.x - 6,
                  y: block.y - 4,
                  text: `+${pts} PTS`,
                  color: "#4ade80",
                  life: 32,
                });
              } else {
                block.bumpOffset = -2;
                playSound("blockHit");
              }
            }
            // Land on top
            else if (player.vy >= 0 && prevY + player.height <= block.y + 6) {
              player.y = block.y - player.height;
              player.vy = 0;
              player.grounded = true;
            }
          }

          if (block.bumpOffset < 0) {
            block.bumpOffset += 0.6;
            if (block.bumpOffset > 0) block.bumpOffset = 0;
          }
        });

        // Flagpole victory (higher jump on flagpole = bigger bonus!)
        if (player.x + player.width >= flagpoleX) {
          const heightBonus = player.y < 130 ? 800 : 500;
          state.score += heightBonus;
          state.earnedPts += heightBonus;
          setScore(state.score);
          setEarnedPts(state.earnedPts);
          setWon(true);
          playSound("tetrisClear");
          onEarnPoints?.(heightBonus);
        }

        // Enemy collision & updates
        enemies.forEach((enemy) => {
          if (!enemy.alive) {
            enemy.squashedTimer += 1;
            return;
          }

          enemy.x += enemy.vx;
          if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
            enemy.vx *= -1;
          }

          if (
            player.x + player.width > enemy.x &&
            player.x < enemy.x + 16 &&
            player.y + player.height > enemy.y &&
            player.y < enemy.y + 16
          ) {
            // Stomp on top!
            if (player.vy > 0 && prevY + player.height <= enemy.y + 10) {
              enemy.alive = false;
              player.vy = -5.2;
              playSound("stomp");
              playSound("coin");
              const pts = 300;
              state.score += pts;
              state.earnedPts += pts;
              state.hudFlashTimer = 25;
              setScore(state.score);
              setEarnedPts(state.earnedPts);
              onEarnPoints?.(pts);

              spawnBurst(enemy.x + 8, enemy.y + 8, "#4ade80", "#facc15");
              state.effects.push({
                x: enemy.x - 16,
                y: enemy.y - 6,
                text: `STOMP +${pts}PTS!`,
                color: "#4ade80",
                life: 44,
              });
            } else {
              player.alive = false;
              playSound("stomp");
              setScore(state.score);
              setEarnedPts(state.earnedPts);
              setGameOver(true);
            }
          }
        });

        // Smooth camera scroll
        if (player.x - state.cameraX > 110) {
          state.cameraX = player.x - 110;
        } else if (player.x - state.cameraX < 40 && state.cameraX > 0) {
          state.cameraX = Math.max(0, player.x - 40);
        }
      }

      // -------------------------------------------------------------
      // RENDERING (256 x 224 Retro Canvas)
      // -------------------------------------------------------------
      ctx.clearRect(0, 0, 256, 224);

      // Sky Background
      ctx.fillStyle = "#5c94fc";
      ctx.fillRect(0, 0, 256, 224);

      ctx.save();
      ctx.translate(-Math.round(state.cameraX), 0);

      // Background Hills & Bushes
      ctx.fillStyle = "#00a800";
      [80, 420, 760, 1020].forEach((hx, idx) => {
        ctx.beginPath();
        ctx.arc(hx, 208, idx % 2 === 0 ? 40 : 52, Math.PI, 0);
        ctx.fill();
      });

      // Clouds
      ctx.fillStyle = "#ffffff";
      [120, 300, 520, 720, 940].forEach((cx) => {
        ctx.fillRect(cx, 38, 36, 12);
        ctx.fillRect(cx + 8, 30, 20, 10);
      });

      // Ground (brown checkered brick layer)
      ctx.fillStyle = "#c84c0c";
      ctx.fillRect(0, 208, 1250, 16);
      ctx.fillStyle = "#000000";
      for (let gx = 0; gx < 1250; gx += 16) {
        ctx.strokeRect(gx, 208, 16, 16);
      }

      // Render Solid Structures (Pipes, Stone Steps, Floating Platforms)
      SOLID_STRUCTURES.forEach((st) => {
        if (st.kind === "pipe") {
          ctx.fillStyle = "#00a800";
          ctx.fillRect(st.x, st.y, st.width, st.height);
          ctx.fillStyle = "#008000";
          ctx.fillRect(st.x + st.width - 8, st.y, 8, st.height);
          ctx.fillStyle = "#00a800";
          ctx.fillRect(st.x - 2, st.y, st.width + 4, 12);
          ctx.strokeStyle = "#000000";
          ctx.strokeRect(st.x - 2, st.y, st.width + 4, 12);
        } else if (st.kind === "stone") {
          // Draw 16x16 beveled NES Staircase Stone Blocks
          for (let bx = st.x; bx < st.x + st.width; bx += 16) {
            for (let by = st.y; by < st.y + st.height; by += 16) {
              const bw = Math.min(16, st.x + st.width - bx);
              const bh = Math.min(16, st.y + st.height - by);
              ctx.fillStyle = "#d97706";
              ctx.fillRect(bx, by, bw, bh);
              ctx.fillStyle = "#fef08a";
              ctx.fillRect(bx + 1, by + 1, bw - 2, 2);
              ctx.fillRect(bx + 1, by + 1, 2, bh - 2);
              ctx.strokeStyle = "#451a03";
              ctx.strokeRect(bx, by, bw, bh);
            }
          }
        } else if (st.kind === "platform") {
          // Floating Grass-Topped Ledge Platform
          ctx.fillStyle = "#92400e";
          ctx.fillRect(st.x, st.y, st.width, st.height);
          ctx.fillStyle = "#22c55e";
          ctx.fillRect(st.x, st.y, st.width, 4);
          ctx.strokeStyle = "#000000";
          ctx.strokeRect(st.x, st.y, st.width, st.height);
        }
      });

      // Blocks
      blocks.forEach((b) => {
        const by = Math.round(b.y + b.bumpOffset);
        if (b.type === "question") {
          ctx.fillStyle = "#fc9838";
          ctx.fillRect(b.x, by, 16, 16);
          ctx.fillStyle = "#000000";
          ctx.strokeRect(b.x, by, 16, 16);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 10px monospace";
          ctx.fillText("?", b.x + 4, by + 12);
        } else if (b.type === "brick") {
          ctx.fillStyle = "#c84c0c";
          ctx.fillRect(b.x, by, 16, 16);
          ctx.strokeStyle = "#000000";
          ctx.strokeRect(b.x, by, 16, 16);
          ctx.strokeRect(b.x, by + 8, 8, 8);
          ctx.strokeRect(b.x + 8, by + 8, 8, 8);
        } else {
          ctx.fillStyle = "#8c5b3e";
          ctx.fillRect(b.x, by, 16, 16);
          ctx.strokeRect(b.x, by, 16, 16);
        }
      });

      // Flagpole & Victory Castle at end of staircase
      ctx.fillStyle = "#d97706";
      ctx.fillRect(flagpoleX - 6, 192, 16, 16);
      ctx.strokeRect(flagpoleX - 6, 192, 16, 16);
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(flagpoleX, 48, 4, 144);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(flagpoleX - 2, 42, 8, 8);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(flagpoleX - 18, 54, 18, 12);
      ctx.fillStyle = "#ffffff";
      ctx.font = "5px 'Press Start 2P', monospace";
      ctx.fillText("★", flagpoleX - 12, 62);

      // End Castle behind Flagpole
      const castleX = flagpoleX + 28;
      ctx.fillStyle = "#9a3412";
      ctx.fillRect(castleX, 148, 48, 60);
      ctx.fillRect(castleX + 10, 128, 28, 20);
      ctx.fillStyle = "#000000";
      ctx.fillRect(castleX + 18, 178, 12, 30);
      // Battlements
      for (let cx = 0; cx < 48; cx += 10) {
        ctx.fillStyle = "#9a3412";
        ctx.fillRect(castleX + cx, 142, 6, 6);
      }

      // Enemies (Goomba mushrooms)
      enemies.forEach((e) => {
        if (!e.alive) {
          if (e.squashedTimer < 35) {
            ctx.fillStyle = "#a83800";
            ctx.fillRect(e.x, e.y + 10, 16, 6);
          }
          return;
        }

        ctx.fillStyle = "#a83800";
        ctx.fillRect(e.x + 2, e.y, 12, 10);
        ctx.fillRect(e.x, e.y + 4, 16, 6);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(e.x + 4, e.y + 6, 2, 4);
        ctx.fillRect(e.x + 10, e.y + 6, 2, 4);
        ctx.fillStyle = "#000000";
        ctx.fillRect(e.x + 5, e.y + 8, 1, 2);
        ctx.fillRect(e.x + 11, e.y + 8, 1, 2);
        ctx.fillStyle = "#000000";
        ctx.fillRect(e.x + 1, e.y + 12, 5, 4);
        ctx.fillRect(e.x + 10, e.y + 12, 5, 4);
      });

      // Spark Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.life--;
        if (p.life <= 0) {
          state.particles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), 3, 3);
        }
      }

      // Floating Popups & Rising Coin Effects
      for (let i = state.effects.length - 1; i >= 0; i--) {
        const ef = state.effects[i];
        ef.y -= 0.7;
        ef.life--;
        if (ef.life <= 0) {
          state.effects.splice(i, 1);
        } else {
          const rx = Math.round(ef.x);
          const ry = Math.round(ef.y);
          if (ef.hasCoinIcon) {
            ctx.fillStyle = "#facc15";
            ctx.fillRect(rx + 18, ry - 12, 6, 8);
            ctx.fillStyle = "#fef08a";
            ctx.fillRect(rx + 20, ry - 10, 2, 4);
          }
          ctx.font = "bold 7px 'Press Start 2P', monospace";
          ctx.fillStyle = "#000000";
          ctx.fillText(ef.text, rx - 1, ry);
          ctx.fillText(ef.text, rx + 1, ry);
          ctx.fillText(ef.text, rx, ry - 1);
          ctx.fillText(ef.text, rx, ry + 1);
          ctx.fillStyle = ef.color;
          ctx.fillText(ef.text, rx, ry);
        }
      }

      // Player (Mario sprite + "justin" overhead name tag)
      if (player.alive) {
        const px = Math.round(player.x);
        const py = Math.round(player.y);

        // Draw "justin" name tag above Mario's head!
        ctx.font = "bold 6px 'Press Start 2P', monospace";
        const nameX = px - 10;
        const nameY = py - 5;
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(nameX - 2, nameY - 7, 38, 9);
        ctx.fillStyle = "#000000";
        ctx.fillText("justin", nameX - 1, nameY);
        ctx.fillText("justin", nameX + 1, nameY);
        ctx.fillText("justin", nameX, nameY - 1);
        ctx.fillText("justin", nameX, nameY + 1);
        ctx.fillStyle = "#facc15";
        ctx.fillText("justin", nameX, nameY);

        ctx.save();
        ctx.translate(px, py);
        if (!player.facingRight) {
          ctx.scale(-1, 1);
          ctx.translate(-player.width, 0);
        }

        ctx.fillStyle = "#f83800";
        ctx.fillRect(3, 0, 9, 3);
        ctx.fillRect(3, 3, 11, 2);
        ctx.fillStyle = "#fcb438";
        ctx.fillRect(2, 5, 8, 4);
        ctx.fillStyle = "#6b3c00";
        ctx.fillRect(1, 5, 2, 3);
        ctx.fillRect(5, 7, 5, 2);
        ctx.fillStyle = "#0028a0";
        ctx.fillRect(3, 9, 8, 5);
        ctx.fillStyle = "#f83800";
        ctx.fillRect(1, 9, 2, 4);
        ctx.fillRect(11, 9, 2, 4);
        ctx.fillStyle = "#6b3c00";
        ctx.fillRect(2, 14, 4, 2);
        ctx.fillRect(8, 14, 4, 2);

        ctx.restore();
      }

      ctx.restore();

      // Top HUD Overlay
      if (state.hudFlashTimer > 0) {
        state.hudFlashTimer--;
        ctx.fillStyle = "rgba(6, 78, 59, 0.85)";
        ctx.fillRect(0, 0, 256, 30);
      } else {
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, 0, 256, 30);
      }

      // Small "JUSTIN'S ADVENTURE" title in Top-Left of TV screen
      ctx.fillStyle = "#ffffff";
      ctx.font = "5px 'Press Start 2P', monospace";
      ctx.fillText("JUSTIN'S ADVENTURE", 8, 10);

      ctx.font = "7px 'Press Start 2P', monospace";
      ctx.fillStyle = "#facc15";
      ctx.fillText(state.score.toString().padStart(6, "0"), 8, 23);

      ctx.fillStyle = "#fde047";
      ctx.fillText("🪙x" + state.coins.toString().padStart(2, "0"), 96, 23);

      ctx.fillStyle = state.hudFlashTimer > 0 ? "#ffffff" : "#4ade80";
      ctx.fillText(`+${state.earnedPts}PTS`, 148, 23);

      ctx.fillStyle = "#ffffff";
      ctx.fillText("1-1", 222, 16);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameOver, won, onEarnPoints]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative select-none font-pixel bg-black">
      <canvas
        ref={canvasRef}
        width={256}
        height={224}
        className="w-full h-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Interactive Game Over / Victory Overlay with 360-Spinning Justin Photo */}
      {(gameOver || won) && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-2 z-20">
          <div
            className={`bg-neutral-950 border-4 ${
              won ? "border-yellow-400" : "border-red-500"
            } px-3 py-2.5 rounded flex flex-col items-center text-center max-w-[240px] w-full shadow-[0_0_25px_rgba(0,0,0,0.85)] space-y-1.5`}
          >
            {won && (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-spin">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/justin_victory.png"
                  alt="Success Justin"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div
              className={`text-[11px] sm:text-xs font-bold tracking-wider ${
                won ? "text-yellow-300" : "text-red-500"
              }`}
            >
              {won ? "🏆 SUCCESS JUSTIN!" : "GAME OVER"}
            </div>

            {/* Big Prominent Points Earned Banner */}
            <div className="w-full bg-emerald-950/90 border-2 border-emerald-400 py-1 px-2 rounded shadow-[0_0_12px_rgba(52,211,153,0.5)]">
              <div className="text-[6px] text-emerald-300 uppercase">
                TOTAL POINTS EARNED
              </div>
              <div className="text-xs text-yellow-300 font-bold mt-0.5 animate-pulse">
                🪙 +{earnedPts} PTS!
              </div>
            </div>

            <div className="text-[7px] text-neutral-300 flex gap-3">
              <span>SCORE: {score}</span>
              <span className="text-yellow-400">COINS: 🪙x{coins}</span>
            </div>

            <button
              type="button"
              onClick={restartGame}
              className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 text-white font-bold text-[8px] sm:text-[9px] rounded border-2 border-emerald-300 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all"
            >
              🔄 PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* On-Screen Mobile/Keyboard Control Hint */}
      <div className="absolute bottom-1 right-2 text-[7px] text-white/70 bg-black/60 px-1.5 py-0.5 rounded pointer-events-none">
        [◀ ▶ MOVE | ▲/SPACE JUMP | R RETRY]
      </div>
    </div>
  );
}
