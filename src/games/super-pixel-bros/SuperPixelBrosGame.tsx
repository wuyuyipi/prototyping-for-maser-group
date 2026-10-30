"use client";

import React, { useEffect, useRef, useState } from "react";
import { GameComponentProps } from "../types";
import { playSound } from "@/components/AudioEffects";

interface Enemy {
  x: number;
  y: number;
  vx: number;
  alive: boolean;
  squashedTimer: number;
}

interface Block {
  x: number;
  y: number;
  type: "brick" | "question" | "empty";
  bumpOffset: number;
}

export default function SuperPixelBrosGame({
  onExit,
  onEarnPoints,
}: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(200);
  const [coins, setCoins] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Use refs for the animation loop
  const gameStateRef = useRef({
    score: 200,
    coins: 1,
    time: 392,
    cameraX: 0,
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
    enemies: [
      { x: 220, y: 192, vx: -0.6, alive: true, squashedTimer: 0 },
      { x: 380, y: 192, vx: -0.6, alive: true, squashedTimer: 0 },
      { x: 580, y: 192, vx: -0.6, alive: true, squashedTimer: 0 },
      { x: 740, y: 192, vx: -0.6, alive: true, squashedTimer: 0 },
    ] as Enemy[],
    blocks: [
      { x: 160, y: 144, type: "question", bumpOffset: 0 },
      { x: 192, y: 144, type: "brick", bumpOffset: 0 },
      { x: 208, y: 144, type: "question", bumpOffset: 0 },
      { x: 224, y: 144, type: "brick", bumpOffset: 0 },
      { x: 240, y: 144, type: "question", bumpOffset: 0 },
      { x: 208, y: 80, type: "question", bumpOffset: 0 },
      { x: 440, y: 144, type: "brick", bumpOffset: 0 },
      { x: 456, y: 144, type: "question", bumpOffset: 0 },
      { x: 472, y: 144, type: "brick", bumpOffset: 0 },
      { x: 620, y: 144, type: "question", bumpOffset: 0 },
      { x: 636, y: 144, type: "question", bumpOffset: 0 },
    ] as Block[],
    pipes: [
      { x: 280, y: 176, height: 32 },
      { x: 360, y: 160, height: 48 },
      { x: 500, y: 144, height: 64 },
    ],
    flagpoleX: 860,
  });

  const restartGame = () => {
    gameStateRef.current.player = {
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
    gameStateRef.current.cameraX = 0;
    gameStateRef.current.enemies = [
      { x: 220, y: 192, vx: -0.6, alive: true, squashedTimer: 0 },
      { x: 380, y: 192, vx: -0.6, alive: true, squashedTimer: 0 },
      { x: 580, y: 192, vx: -0.6, alive: true, squashedTimer: 0 },
      { x: 740, y: 192, vx: -0.6, alive: true, squashedTimer: 0 },
    ];
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "KeyA"].includes(e.code)) {
        gameStateRef.current.keys.left = true;
      }
      if (["ArrowRight", "KeyD"].includes(e.code)) {
        gameStateRef.current.keys.right = true;
      }
      if (["ArrowUp", "KeyW", "Space"].includes(e.code)) {
        if (!gameStateRef.current.keys.jump && gameStateRef.current.player.grounded) {
          gameStateRef.current.player.vy = -6.4;
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
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const state = gameStateRef.current;
      const { player, keys, enemies, blocks, pipes, flagpoleX } = state;

      // Update Player Horizontal
      const speed = 1.8;
      if (player.alive && !won) {
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
        player.vy += 0.35;
        if (player.vy > 7) player.vy = 7;

        player.x += player.vx;
        player.y += player.vy;

        // Ground collision (y = 192 is top of ground)
        const groundY = 192;
        if (player.y >= groundY) {
          player.y = groundY;
          player.vy = 0;
          player.grounded = true;
        }

        // Pipe collisions
        pipes.forEach((pipe) => {
          if (
            player.x + player.width > pipe.x &&
            player.x < pipe.x + 32 &&
            player.y + player.height > groundY + 16 - pipe.height
          ) {
            // Check top landing
            if (player.vy > 0 && player.y + player.height - player.vy <= groundY + 16 - pipe.height + 6) {
              player.y = groundY + 16 - pipe.height - player.height;
              player.vy = 0;
              player.grounded = true;
            } else {
              // Side push
              if (player.vx > 0) player.x = pipe.x - player.width;
              else if (player.vx < 0) player.x = pipe.x + 32;
            }
          }
        });

        // Block collisions
        blocks.forEach((block) => {
          if (
            player.x + player.width > block.x &&
            player.x < block.x + 16 &&
            player.y < block.y + 16 &&
            player.y + player.height > block.y
          ) {
            // Hit from below
            if (player.vy < 0 && player.y - player.vy >= block.y + 12) {
              player.y = block.y + 16;
              player.vy = 0;
              if (block.type === "question") {
                block.type = "empty";
                block.bumpOffset = -4;
                playSound("coin");
                state.score += 200;
                state.coins += 1;
                setScore(state.score);
                setCoins(state.coins);
                onEarnPoints?.(200);
              } else if (block.type === "brick") {
                block.bumpOffset = -3;
                playSound("blockHit");
              }
            }
            // Land on top
            else if (player.vy > 0 && player.y + player.height - player.vy <= block.y + 4) {
              player.y = block.y - player.height;
              player.vy = 0;
              player.grounded = true;
            }
          }

          if (block.bumpOffset < 0) {
            block.bumpOffset += 0.5;
            if (block.bumpOffset > 0) block.bumpOffset = 0;
          }
        });

        // Flagpole victory
        if (player.x >= flagpoleX) {
          setWon(true);
          playSound("coin");
          onEarnPoints?.(500);
        }

        // Enemy collision & updates
        enemies.forEach((enemy) => {
          if (!enemy.alive) {
            enemy.squashedTimer += 1;
            return;
          }

          enemy.x += enemy.vx;
          // Reverse at bounds/pipes
          if (enemy.x < 100 || enemy.x > 820) enemy.vx *= -1;

          // Player overlap
          if (
            player.x + player.width > enemy.x &&
            player.x < enemy.x + 16 &&
            player.y + player.height > enemy.y &&
            player.y < enemy.y + 16
          ) {
            // Stomp on top
            if (player.vy > 0 && player.y + player.height - player.vy <= enemy.y + 8) {
              enemy.alive = false;
              player.vy = -4.5; // Bounce off enemy
              playSound("stomp");
              state.score += 100;
              setScore(state.score);
              onEarnPoints?.(100);
            } else {
              // Hit from side -> game over
              player.alive = false;
              setGameOver(true);
            }
          }
        });

        // Camera scroll
        if (player.x - state.cameraX > 110) {
          state.cameraX = player.x - 110;
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
      ctx.translate(-state.cameraX, 0);

      // Background Hills & Bushes
      ctx.fillStyle = "#00a800";
      // Hill 1
      ctx.beginPath();
      ctx.arc(80, 208, 40, Math.PI, 0);
      ctx.fill();
      // Hill 2
      ctx.beginPath();
      ctx.arc(420, 208, 50, Math.PI, 0);
      ctx.fill();

      // Clouds
      ctx.fillStyle = "#ffffff";
      [140, 320, 560, 780].forEach((cx) => {
        ctx.fillRect(cx, 40, 36, 12);
        ctx.fillRect(cx + 8, 32, 20, 10);
      });

      // Ground (brown checkered brick layer)
      ctx.fillStyle = "#c84c0c";
      ctx.fillRect(0, 208, 1000, 16);
      ctx.fillStyle = "#000000";
      for (let gx = 0; gx < 1000; gx += 16) {
        ctx.strokeRect(gx, 208, 16, 16);
      }

      // Pipes
      pipes.forEach((p) => {
        ctx.fillStyle = "#00a800";
        ctx.fillRect(p.x, 208 - p.height, 32, p.height);
        ctx.fillStyle = "#008000";
        ctx.fillRect(p.x + 24, 208 - p.height, 8, p.height);
        // Pipe Rim
        ctx.fillStyle = "#00a800";
        ctx.fillRect(p.x - 2, 208 - p.height, 36, 12);
        ctx.strokeRect(p.x - 2, 208 - p.height, 36, 12);
      });

      // Blocks
      blocks.forEach((b) => {
        const by = b.y + b.bumpOffset;
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
          // Empty block
          ctx.fillStyle = "#8c5b3e";
          ctx.fillRect(b.x, by, 16, 16);
          ctx.strokeRect(b.x, by, 16, 16);
        }
      });

      // Flagpole
      ctx.fillStyle = "#00a800";
      ctx.fillRect(flagpoleX, 60, 4, 148);
      ctx.fillStyle = "#fcbc3c";
      ctx.fillRect(flagpoleX - 2, 54, 8, 8); // Ball on top
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(flagpoleX - 16, 68, 16, 12); // Flag

      // Enemies (Goomba mushrooms)
      enemies.forEach((e) => {
        if (!e.alive) {
          if (e.squashedTimer < 30) {
            // Squashed flat
            ctx.fillStyle = "#a83800";
            ctx.fillRect(e.x, 202, 16, 6);
          }
          return;
        }

        // Goomba Head
        ctx.fillStyle = "#a83800";
        ctx.fillRect(e.x + 2, e.y, 12, 10);
        ctx.fillRect(e.x, e.y + 4, 16, 6);
        // Eyes
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(e.x + 4, e.y + 6, 2, 4);
        ctx.fillRect(e.x + 10, e.y + 6, 2, 4);
        ctx.fillStyle = "#000000";
        ctx.fillRect(e.x + 5, e.y + 8, 1, 2);
        ctx.fillRect(e.x + 11, e.y + 8, 1, 2);
        // Feet
        ctx.fillStyle = "#000000";
        ctx.fillRect(e.x + 1, e.y + 12, 5, 4);
        ctx.fillRect(e.x + 10, e.y + 12, 5, 4);
      });

      // Player (Mario sprite representation)
      if (player.alive) {
        ctx.save();
        ctx.translate(player.x, player.y);
        if (!player.facingRight) {
          ctx.scale(-1, 1);
          ctx.translate(-player.width, 0);
        }

        // Red Cap
        ctx.fillStyle = "#f83800";
        ctx.fillRect(3, 0, 9, 3);
        ctx.fillRect(3, 3, 11, 2);
        // Face / Skin
        ctx.fillStyle = "#fcb438";
        ctx.fillRect(2, 5, 8, 4);
        // Hair / Mustache
        ctx.fillStyle = "#6b3c00";
        ctx.fillRect(1, 5, 2, 3);
        ctx.fillRect(5, 7, 5, 2);
        // Blue Overalls
        ctx.fillStyle = "#0028a0";
        ctx.fillRect(3, 9, 8, 5);
        // Red Shirt Arms
        ctx.fillStyle = "#f83800";
        ctx.fillRect(1, 9, 2, 4);
        ctx.fillRect(11, 9, 2, 4);
        // Shoes
        ctx.fillStyle = "#6b3c00";
        ctx.fillRect(2, 14, 4, 2);
        ctx.fillRect(8, 14, 4, 2);

        ctx.restore();
      }

      ctx.restore();

      // Top HUD Overlay (Matches reference photo!)
      ctx.fillStyle = "#ffffff";
      ctx.font = "8px 'Press Start 2P', monospace";
      ctx.fillText("MARIO", 16, 16);
      ctx.fillText(state.score.toString().padStart(6, "0"), 16, 26);

      ctx.fillText("🪙x" + state.coins.toString().padStart(2, "0"), 96, 26);

      ctx.fillText("WORLD", 152, 16);
      ctx.fillText("1-1", 160, 26);

      ctx.fillText("TIME", 212, 16);
      ctx.fillText(state.time.toString(), 216, 26);

      // Game Over / Win overlays
      if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(40, 70, 176, 60);
        ctx.fillStyle = "#f83800";
        ctx.font = "10px 'Press Start 2P', monospace";
        ctx.fillText("GAME OVER", 78, 96);
        ctx.fillStyle = "#ffffff";
        ctx.font = "6px 'Press Start 2P', monospace";
        ctx.fillText("PRESS 'R' TO RETRY", 66, 114);
      } else if (won) {
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(36, 60, 184, 80);
        ctx.fillStyle = "#fcb438";
        ctx.font = "10px 'Press Start 2P', monospace";
        ctx.fillText("COURSE CLEAR!", 60, 88);
        ctx.fillStyle = "#34d399";
        ctx.font = "7px 'Press Start 2P', monospace";
        ctx.fillText("+500 PTS EARNED!", 68, 106);
        ctx.fillStyle = "#ffffff";
        ctx.font = "6px 'Press Start 2P', monospace";
        ctx.fillText("PRESS 'R' TO PLAY AGAIN", 54, 124);
      }

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

      {/* On-Screen Mobile/Keyboard Control Hint */}
      <div className="absolute bottom-1 right-2 text-[7px] text-white/70 bg-black/60 px-1.5 py-0.5 rounded pointer-events-none">
        [◀ ▶ MOVE | ▲/SPACE JUMP | R RETRY]
      </div>
    </div>
  );
}
