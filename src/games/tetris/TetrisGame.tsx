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

export default function TetrisGame({
  onExit,
  onEarnPoints,
}: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [nextPiece, setNextPiece] = useState<ShapeKey>(getRandomShape);

  const gameState = useRef({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(0 as string | 0)),
    currentPiece: {
      shapeKey: getRandomShape(),
      matrix: [] as number[][],
      x: 3,
      y: 0,
      color: "#00f0f0",
    },
    nextPieceKey: getRandomShape(),
    score: 0,
    lines: 0,
    level: 1,
    dropCounter: 0,
    dropInterval: 45, // frames per drop
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
      setGameOver(true);
    }
  }, []);

  const resetGame = useCallback(() => {
    const state = gameState.current;
    state.board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    state.score = 0;
    state.lines = 0;
    state.level = 1;
    state.gameOver = false;
    state.dropInterval = 45;
    state.nextPieceKey = getRandomShape();
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    spawnPiece();
  }, [spawnPiece]);

  // Handle controls
  useEffect(() => {
    const state = gameState.current;
    state.currentPiece.matrix = SHAPES[state.currentPiece.shapeKey];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameOver) {
        if (["Space", "KeyR", "Enter"].includes(e.code)) {
          resetGame();
        }
        return;
      }

      const { currentPiece, board } = state;

      if (["ArrowLeft", "KeyA"].includes(e.code)) {
        if (!checkCollision(currentPiece.matrix, currentPiece.x - 1, currentPiece.y, board)) {
          currentPiece.x -= 1;
          playSound("tetrisMove");
        }
      } else if (["ArrowRight", "KeyD"].includes(e.code)) {
        if (!checkCollision(currentPiece.matrix, currentPiece.x + 1, currentPiece.y, board)) {
          currentPiece.x += 1;
          playSound("tetrisMove");
        }
      } else if (["ArrowUp", "KeyW", "KeyX"].includes(e.code)) {
        const rotated = rotateMatrix(currentPiece.matrix);
        if (!checkCollision(rotated, currentPiece.x, currentPiece.y, board)) {
          currentPiece.matrix = rotated;
          playSound("tetrisRotate");
        }
      } else if (["ArrowDown", "KeyS"].includes(e.code)) {
        if (!checkCollision(currentPiece.matrix, currentPiece.x, currentPiece.y + 1, board)) {
          currentPiece.y += 1;
          playSound("tetrisMove");
        }
      } else if (e.code === "Space") {
        // Hard drop
        while (!checkCollision(currentPiece.matrix, currentPiece.x, currentPiece.y + 1, board)) {
          currentPiece.y += 1;
        }
        playSound("tetrisDrop");
        state.dropCounter = state.dropInterval; // force lock next tick
      } else if (e.code === "KeyR") {
        resetGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetGame]);

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
            // Lock piece onto board
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

            // Check line clears
            let linesCleared = 0;
            for (let r = ROWS - 1; r >= 0; r--) {
              if (state.board[r].every((cell) => cell !== 0)) {
                state.board.splice(r, 1);
                state.board.unshift(Array(COLS).fill(0));
                linesCleared++;
                r++; // re-check row
              }
            }

            if (linesCleared > 0) {
              playSound("tetrisClear");
              const linePoints = [0, 100, 300, 500, 800][linesCleared] || 1000;
              state.score += linePoints * state.level;
              state.lines += linesCleared;
              state.level = Math.floor(state.lines / 10) + 1;
              state.dropInterval = Math.max(10, 45 - (state.level - 1) * 4);

              setScore(state.score);
              setLines(state.lines);
              setLevel(state.level);
              onEarnPoints?.(linePoints);
            }

            spawnPiece();
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

      // Left Playfield Area: (20, 12) with 10x20 cells of size 10x10 px
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
          } else {
            // Subtle grid dot
            ctx.fillStyle = "#111836";
            ctx.fillRect(boardX + c * cellSize + 4, boardY + r * cellSize + 4, 1, 1);
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
                // Highlight rim
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
      // RIGHT HUD PANELS (Score, Lines, Level, Next Piece)
      // -------------------------------------------------------------
      const hudX = 140;

      // Title Banner
      ctx.fillStyle = "#e03b24";
      ctx.font = "bold 14px 'Press Start 2P', monospace";
      ctx.fillText("TETRIS", hudX + 4, 28);

      // Stats Box
      ctx.fillStyle = "#111836";
      ctx.fillRect(hudX, 40, 100, 68);
      ctx.strokeStyle = "#384d9c";
      ctx.strokeRect(hudX, 40, 100, 68);

      ctx.fillStyle = "#ffffff";
      ctx.font = "7px 'Press Start 2P', monospace";
      ctx.fillText("SCORE", hudX + 8, 54);
      ctx.fillStyle = "#facc15";
      ctx.fillText(state.score.toString().padStart(6, "0"), hudX + 8, 66);

      ctx.fillStyle = "#ffffff";
      ctx.fillText("LINES", hudX + 8, 80);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(state.lines.toString().padStart(3, "0"), hudX + 8, 92);

      ctx.fillStyle = "#ffffff";
      ctx.fillText("LV: " + state.level, hudX + 60, 92);

      // Next Piece Box
      ctx.fillStyle = "#111836";
      ctx.fillRect(hudX, 118, 100, 56);
      ctx.strokeStyle = "#384d9c";
      ctx.strokeRect(hudX, 118, 100, 56);

      ctx.fillStyle = "#ffffff";
      ctx.font = "7px 'Press Start 2P', monospace";
      ctx.fillText("NEXT", hudX + 32, 132);

      // Render Next Piece Preview
      const nextMatrix = SHAPES[state.nextPieceKey];
      const nextColor = COLORS[state.nextPieceKey];
      ctx.fillStyle = nextColor;
      const previewStartX = hudX + 50 - (nextMatrix[0].length * cellSize) / 2;
      const previewStartY = 140;
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
      ctx.fillStyle = "#64748b";
      ctx.font = "5px 'Press Start 2P', monospace";
      ctx.fillText("◀ ▶: MOVE", hudX + 8, 192);
      ctx.fillText("▲ / X: ROTATE", hudX + 8, 202);
      ctx.fillText("SPACE: HARD DROP", hudX + 8, 212);

      // Game Over Screen
      if (state.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(20, 60, 216, 80);
        ctx.fillStyle = "#ef4444";
        ctx.font = "12px 'Press Start 2P', monospace";
        ctx.fillText("GAME OVER", 64, 96);
        ctx.fillStyle = "#ffffff";
        ctx.font = "7px 'Press Start 2P', monospace";
        ctx.fillText("PRESS 'R' TO RETRY", 52, 118);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [spawnPiece, onEarnPoints]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative select-none font-pixel bg-black">
      <canvas
        ref={canvasRef}
        width={256}
        height={224}
        className="w-full h-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
