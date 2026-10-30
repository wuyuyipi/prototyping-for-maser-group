"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { GameComponentProps } from "../types";
import { playSound } from "@/components/AudioEffects";

const COLS = 10;
const ROWS = 20;

// 7 Classic Tetromino shapes
const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

const COLORS: Record<string, string> = {
  I: "#00f0f0", // Cyan
  O: "#f0f000", // Yellow
  T: "#a000f0", // Purple
  S: "#00f000", // Green
  Z: "#f00000", // Red
  J: "#0000f0", // Blue
  L: "#f0a000", // Orange
};

type ShapeKey = keyof typeof SHAPES;
const SHAPE_KEYS: ShapeKey[] = ["I", "O", "T", "S", "Z", "J", "L"];

function getRandomShape(): ShapeKey {
  return SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
}

interface FloatingPopup {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

export default function TetrisGame({
  onEarnPoints,
}: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [earnedPts, setEarnedPts] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [, setNextPiece] = useState<ShapeKey>(getRandomShape);

  const gameState = useRef({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(0 as string | 0)),
    currentPiece: {
      shapeKey: getRandomShape(),
      matrix: SHAPES.T as number[][],
      x: 3,
      y: 0,
      color: "#a000f0",
    },
    nextPieceKey: getRandomShape(),
    score: 0,
    earnedPts: 0,
    lines: 0,
    level: 1,
    dropCounter: 0,
    dropInterval: 20,
    hudFlashTimer: 0,
    popups: [] as FloatingPopup[],
    gameOver: false,
  });

  const rotateMatrix = (matrix: number[][]): number[][] => {
    return matrix[0].map((_, index) => matrix.map((row) => row[index]).reverse());
  };

  const checkCollision = (
    matrix: number[][],
    offsetX: number,
    offsetY: number,
    board: (string | 0)[][]
  ): boolean => {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 0) {
          const newX = c + offsetX;
          const newY = r + offsetY;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && board[newY][newX] !== 0) return true;
        }
      }
    }
    return false;
  };

  const spawnPiece = useCallback(() => {
    const state = gameState.current;
    const key = state.nextPieceKey;
    const shapeMatrix = SHAPES[key];
    const newNextKey = getRandomShape();

    state.currentPiece = {
      shapeKey: key,
      matrix: shapeMatrix,
      x: Math.floor((COLS - shapeMatrix[0].length) / 2),
      y: 0,
      color: COLORS[key],
    };
    state.nextPieceKey = newNextKey;
    setNextPiece(newNextKey);

    if (checkCollision(shapeMatrix, state.currentPiece.x, 0, state.board)) {
      state.gameOver = true;
      setScore(state.score);
      setEarnedPts(state.earnedPts);
      setLines(state.lines);
      setGameOver(true);
      playSound("stomp");
    }
  }, []);

  const lockPieceAndCheckLines = useCallback(
    (isHardDrop = false) => {
      const state = gameState.current;
      const pieceX = state.currentPiece.x;
      const pieceY = state.currentPiece.y;

      state.currentPiece.matrix.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell !== 0) {
            const by = state.currentPiece.y + r;
            const bx = state.currentPiece.x + c;
            if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
              state.board[by][bx] = state.currentPiece.color;
            }
          }
        });
      });

      if (isHardDrop) {
        const dropPts = 15;
        state.score += dropPts;
        state.earnedPts += dropPts;
        state.hudFlashTimer = 14;
        setScore(state.score);
        setEarnedPts(state.earnedPts);
        onEarnPoints?.(dropPts);
        state.popups.push({
          x: 24 + pieceX * 10,
          y: Math.max(24, 12 + pieceY * 10),
          text: `+${dropPts}PTS`,
          color: "#4ade80",
          life: 28,
        });
      }

      // Check line clears
      let linesCleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (state.board[r].every((cell) => cell !== 0)) {
          state.board.splice(r, 1);
          state.board.unshift(Array(COLS).fill(0));
          linesCleared++;
          r++;
        }
      }

      if (linesCleared > 0) {
        playSound("tetrisClear");
        const linePoints = [0, 150, 350, 600, 1000][linesCleared] || 1000;
        const totalGain = linePoints * state.level;
        state.score += totalGain;
        state.earnedPts += totalGain;
        state.lines += linesCleared;
        state.level = Math.floor(state.lines / 10) + 1;
        state.dropInterval = Math.max(5, 20 - (state.level - 1) * 3);
        state.hudFlashTimer = 25;

        setScore(state.score);
        setEarnedPts(state.earnedPts);
        setLines(state.lines);
        setLevel(state.level);
        onEarnPoints?.(totalGain);

        state.popups.push({
          x: 26,
          y: Math.max(36, 12 + pieceY * 10),
          text: `CLEAR x${linesCleared}! +${totalGain}PTS`,
          color: "#facc15",
          life: 45,
        });
      }

      spawnPiece();
    },
    [onEarnPoints, spawnPiece]
  );

  const resetGame = useCallback(() => {
    const state = gameState.current;
    state.board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    state.score = 0;
    state.earnedPts = 0;
    state.lines = 0;
    state.level = 1;
    state.gameOver = false;
    state.dropInterval = 20;
    state.dropCounter = 0;
    state.popups = [];
    state.nextPieceKey = getRandomShape();
    setScore(0);
    setEarnedPts(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    spawnPiece();
    playSound("coin");
  }, [spawnPiece]);

  // Handle controls: Pressing Down (ArrowDown / S) OR Space immediately drops to bottom!
  useEffect(() => {
    const state = gameState.current;
    state.currentPiece.matrix = SHAPES[state.currentPiece.shapeKey];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameOver) {
        if (["Space", "KeyR", "Enter"].includes(e.code)) {
          e.preventDefault();
          resetGame();
        }
        return;
      }

      const { currentPiece, board } = state;

      if (["ArrowLeft", "KeyA"].includes(e.code)) {
        e.preventDefault();
        if (!checkCollision(currentPiece.matrix, currentPiece.x - 1, currentPiece.y, board)) {
          currentPiece.x -= 1;
          playSound("tetrisMove");
        }
      } else if (["ArrowRight", "KeyD"].includes(e.code)) {
        e.preventDefault();
        if (!checkCollision(currentPiece.matrix, currentPiece.x + 1, currentPiece.y, board)) {
          currentPiece.x += 1;
          playSound("tetrisMove");
        }
      } else if (["ArrowUp", "KeyW", "KeyX"].includes(e.code)) {
        e.preventDefault();
        const rotated = rotateMatrix(currentPiece.matrix);
        if (!checkCollision(rotated, currentPiece.x, currentPiece.y, board)) {
          currentPiece.matrix = rotated;
          playSound("tetrisRotate");
        }
      } else if (["ArrowDown", "KeyS", "Space"].includes(e.code)) {
        e.preventDefault();
        // Directly drop all the way to the bottom and lock immediately!
        while (!checkCollision(currentPiece.matrix, currentPiece.x, currentPiece.y + 1, board)) {
          currentPiece.y += 1;
        }
        playSound("tetrisDrop");
        state.dropCounter = 0;
        lockPieceAndCheckLines(true);
      } else if (e.code === "KeyR") {
        e.preventDefault();
        resetGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lockPieceAndCheckLines, resetGame]);

  // Main Game Loop & Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const state = gameState.current;

      if (!state.gameOver) {
        state.dropCounter++;
        if (state.dropCounter >= state.dropInterval) {
          state.dropCounter = 0;
          if (
            !checkCollision(
              state.currentPiece.matrix,
              state.currentPiece.x,
              state.currentPiece.y + 1,
              state.board
            )
          ) {
            state.currentPiece.y += 1;
          } else {
            lockPieceAndCheckLines(false);
          }
        }
      }

      // -------------------------------------------------------------
      // RENDER (256 x 224 NES Resolution)
      // -------------------------------------------------------------
      ctx.clearRect(0, 0, 256, 224);

      // Deep NES Blue Background
      ctx.fillStyle = "#0c1538";
      ctx.fillRect(0, 0, 256, 224);

      const boardX = 24;
      const boardY = 12;
      const cellSize = 10;

      // Outer Board Border
      ctx.fillStyle = "#1e295d";
      ctx.fillRect(boardX - 4, boardY - 4, COLS * cellSize + 8, ROWS * cellSize + 8);
      ctx.fillStyle = "#000000";
      ctx.fillRect(boardX, boardY, COLS * cellSize, ROWS * cellSize);

      // Render Locked Blocks
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const color = state.board[r][c];
          if (color !== 0) {
            ctx.fillStyle = color;
            ctx.fillRect(boardX + c * cellSize, boardY + r * cellSize, cellSize - 1, cellSize - 1);
          }
        }
      }

      // Render Active Piece
      if (!state.gameOver) {
        ctx.fillStyle = state.currentPiece.color;
        state.currentPiece.matrix.forEach((row, r) => {
          row.forEach((cell, c) => {
            if (cell !== 0) {
              const px = boardX + (state.currentPiece.x + c) * cellSize;
              const py = boardY + (state.currentPiece.y + r) * cellSize;
              if (py >= boardY) {
                ctx.fillRect(px, py, cellSize - 1, cellSize - 1);
                ctx.fillStyle = "rgba(255,255,255,0.4)";
                ctx.fillRect(px, py, cellSize - 1, 2);
                ctx.fillRect(px, py, 2, cellSize - 1);
                ctx.fillStyle = state.currentPiece.color;
              }
            }
          });
        });
      }

      // -------------------------------------------------------------
      // RIGHT HUD PANELS (Score, Earned PTS, Lines, Level, Next Piece)
      // -------------------------------------------------------------
      const hudX = 140;

      // Title Banner
      ctx.fillStyle = "#e03b24";
      ctx.font = "bold 14px 'Press Start 2P', monospace";
      ctx.fillText("TETRIS", hudX + 4, 26);

      // Stats Box (flashes green when earning points)
      if (state.hudFlashTimer > 0) state.hudFlashTimer--;
      ctx.fillStyle = state.hudFlashTimer > 0 ? "#064e3b" : "#111836";
      ctx.fillRect(hudX, 34, 104, 80);
      ctx.strokeStyle = state.hudFlashTimer > 0 ? "#34d399" : "#384d9c";
      ctx.strokeRect(hudX, 34, 104, 80);

      ctx.fillStyle = "#ffffff";
      ctx.font = "6px 'Press Start 2P', monospace";
      ctx.fillText("SCORE", hudX + 6, 46);
      ctx.fillStyle = "#facc15";
      ctx.font = "7px 'Press Start 2P', monospace";
      ctx.fillText(state.score.toString().padStart(6, "0"), hudX + 6, 57);

      ctx.fillStyle = "#4ade80";
      ctx.font = "6px 'Press Start 2P', monospace";
      ctx.fillText(`PTS:+${state.earnedPts}`, hudX + 6, 71);

      ctx.fillStyle = "#ffffff";
      ctx.fillText("LINES:" + state.lines, hudX + 6, 85);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("LEVEL:" + state.level, hudX + 6, 98);

      // Next Piece Box
      ctx.fillStyle = "#111836";
      ctx.fillRect(hudX, 120, 104, 54);
      ctx.strokeStyle = "#384d9c";
      ctx.strokeRect(hudX, 120, 104, 54);

      ctx.fillStyle = "#ffffff";
      ctx.font = "7px 'Press Start 2P', monospace";
      ctx.fillText("NEXT", hudX + 34, 133);

      const nextMatrix = SHAPES[state.nextPieceKey];
      const nextColor = COLORS[state.nextPieceKey];
      ctx.fillStyle = nextColor;
      const previewStartX = hudX + 52 - (nextMatrix[0].length * cellSize) / 2;
      const previewStartY = 141;
      nextMatrix.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell !== 0) {
            ctx.fillRect(
              previewStartX + c * cellSize,
              previewStartY + r * cellSize,
              cellSize - 1,
              cellSize - 1
            );
          }
        });
      });

      // Controls Help
      ctx.fillStyle = "#94a3b8";
      ctx.font = "5px 'Press Start 2P', monospace";
      ctx.fillText("◀ ▶: MOVE", hudX + 6, 188);
      ctx.fillText("▲ / X: ROTATE", hudX + 6, 198);
      ctx.fillStyle = "#4ade80";
      ctx.fillText("▼ / SPACE: DROP!", hudX + 6, 208);

      // Floating Popups on Board
      for (let i = state.popups.length - 1; i >= 0; i--) {
        const p = state.popups[i];
        p.y -= 0.6;
        p.life--;
        if (p.life <= 0) {
          state.popups.splice(i, 1);
        } else {
          ctx.font = "bold 7px 'Press Start 2P', monospace";
          const rx = Math.round(p.x);
          const ry = Math.round(p.y);
          ctx.fillStyle = "#000000";
          ctx.fillText(p.text, rx - 1, ry);
          ctx.fillText(p.text, rx + 1, ry);
          ctx.fillText(p.text, rx, ry - 1);
          ctx.fillText(p.text, rx, ry + 1);
          ctx.fillStyle = p.color;
          ctx.fillText(p.text, rx, ry);
        }
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [lockPieceAndCheckLines]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative select-none font-pixel bg-black">
      <canvas
        ref={canvasRef}
        width={256}
        height={224}
        className="w-full h-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Interactive Game Over Modal Overlay with Prominent Points Feedback & Restart Button */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-3 z-20">
          <div className="bg-neutral-950 border-4 border-red-500 px-4 py-3 rounded flex flex-col items-center text-center max-w-[230px] w-full shadow-[0_0_25px_rgba(239,68,68,0.6)] space-y-2">
            <div className="text-red-500 text-xs sm:text-sm font-bold tracking-wider">
              GAME OVER
            </div>

            {/* Big Prominent Points Earned Banner */}
            <div className="w-full bg-emerald-950/90 border-2 border-emerald-400 py-1.5 px-2 rounded shadow-[0_0_12px_rgba(52,211,153,0.5)]">
              <div className="text-[7px] text-emerald-300 uppercase">
                TOTAL POINTS EARNED
              </div>
              <div className="text-xs sm:text-sm text-yellow-300 font-bold mt-0.5 animate-pulse">
                🪙 +{earnedPts} PTS!
              </div>
            </div>

            <div className="text-[8px] text-neutral-300 space-y-0.5">
              <div>FINAL SCORE: {score}</div>
              <div className="text-cyan-400">LINES CLEARED: {lines}</div>
            </div>

            <button
              type="button"
              onClick={resetGame}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 text-white font-bold text-[9px] sm:text-[10px] rounded border-2 border-emerald-300 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all"
            >
              🔄 重新开始 / PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
