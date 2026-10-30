"use client";

import React, { useEffect, useRef } from "react";
import { GameComponentProps } from "../types";

// Standard Retro NES / Arcade Color Palette
const PALETTE: Record<string, string | null> = {
  '.': null,
  'K': '#111827',
  'W': '#ffffff',
  'R': '#e52521',
  'D': '#991b1b',
  'Y': '#facc15',
  'y': '#ca8a04',
  'B': '#2563eb',
  'S': '#fed7aa',
  'b': '#78350f',
  'O': '#d97706',
  'o': '#92400e',
  'G': '#16a34a',
  'g': '#15803d',
  'C': '#38bdf8',
  'c': '#0284c7',
  'L': '#9ca3af',
  'M': '#4b5563',
  'P': '#f472b6',
};

// ASCII Sprite Matrices
const SPRITE_PLAYER_FRAME_0 = [
  "..........YY............",
  "..........RRRR..........",
  ".........RRRRRR.........",
  ".........KKbSSSS........",
  ".........KbbSSSS........",
  "........Kbbbbbb.........",
  "LL....RRRRRRRRRRRR....LL",
  ".LL..RRDDCCCCDDRRRR..LL.",
  "..L.RRDDCCCCCDDRRRRR.L..",
  "YYYYRRDDDDDDDDDRRRRRYYYY",
  "....RRRRRRRRRRRRRRRR....",
  ".....RRRRRRRRRRRRRR.....",
  "......RRRRRRRRRRRR......",
  "........DDRRDDRR........",
  ".........DDRRDD.........",
  "........YYRRRRYY........",
  ".......YYYY..YYYY.......",
  "........YY....YY........",
];

const SPRITE_PLAYER_FRAME_1 = [
  "..........YY............",
  "..........RRRR..........",
  ".........RRRRRR.........",
  ".........KKbSSSS........",
  ".........KbbSSSS........",
  "........Kbbbbbb.........",
  ".....YRRRRRRRRRRRRY.....",
  "....YYRRDDCCCCDDRRYY....",
  "...YYYRRDDCCCCCDDRYYY...",
  "..YYYYRRDDDDDDDDDRYYYY..",
  "....RRRRRRRRRRRRRRRR....",
  ".....RRRRRRRRRRRRRR.....",
  "......RRRRRRRRRRRR......",
  "........DDRRDDRR........",
  ".........DDRRDD.........",
  "........YYRRRRYY........",
  ".......YYYY..YYYY.......",
  "........YY....YY........",
];

const SPRITE_PLAYER_MINI = [
  "...RRRR.....",
  "...bbSS.....",
  "LLRRCCRRRLL.",
  "YYRDDDDDDRYY",
  "..RRRRRRR...",
  "...DDRRDD...",
  "..YYRRRRYY..",
  ".YYYY..YYYY.",
  "..YY....YY..",
];

const SPRITE_GOOMBA_FRAME_0 = [
  "......OOOO......",
  "....OOOOOOOO....",
  "...OOOOOOOOOO...",
  "..OOOOOOOOOOOO..",
  ".OOOOOOOOOOOOOO.",
  "OOOOOOKKKKOOOOOO",
  "OOOOOKWKKWKOOOOO",
  "OOOOOKWKKWKOOOOO",
  ".OOOOKKKKKKOOOO.",
  "..OOSSSSSSSSOO..",
  "...SSSSSSSSSS...",
  "...SSSSSSSSSS...",
  "..bbbb....bbbb..",
  ".bbbbbb..bbbbbb.",
  ".bbbbbb..bbbbbb.",
  "..bbbb....bbbb..",
];

const SPRITE_GOOMBA_FRAME_1 = [
  "......OOOO......",
  "....OOOOOOOO....",
  "...OOOOOOOOOO...",
  "..OOOOOOOOOOOO..",
  ".OOOOOOOOOOOOOO.",
  "OOOOOOKKKKOOOOOO",
  "OOOOOKWKKWKOOOOO",
  "OOOOOKWKKWKOOOOO",
  ".OOOOKKKKKKOOOO.",
  "..OOSSSSSSSSOO..",
  "...SSSSSSSSSS...",
  "...SSSSSSSSSS...",
  "....bbbbbbbb....",
  "...bbbbbbbbbb...",
  "..bbbb....bbbb..",
  "...bbb....bbb...",
];

const SPRITE_KOOPA_FRAME_0 = [
  "......YYYYK.....",
  ".....YYYYYYK....",
  ".....YYKWYYK....",
  ".....YYYYYYK....",
  ".....YYYYYY.....",
  "....GGGGGGGG....",
  "...GGWWGGWWGG...",
  "..GGWWWWGWWWWG..",
  "..GGWWWWGWWWWG..",
  "..GGGGGGGGGGGG..",
  "..GGGGGGGGGGGG..",
  "...GGGGGGGGGG...",
  "....GG....GG....",
  "...YYY....YYY...",
  "..RRRR....RRRR..",
  "..RRRR....RRRR..",
];

const SPRITE_KOOPA_FRAME_1 = [
  "......YYYYK.....",
  ".....YYYYYYK....",
  ".....YYKWYYK....",
  ".....YYYYYYK....",
  ".....YYYYYY.....",
  "...WWGGGGGGGG...",
  "..WWGGWWGGWWGG..",
  "..WWGGWWWWGWWWG.",
  "...WGGWWWWGWWWG.",
  "....GGGGGGGGGG..",
  "....GGGGGGGGGG..",
  ".....GGGGGGGG...",
  "......GG..GG....",
  ".....YYY..YYY...",
  "....RRRR..RRRR..",
  "....RRRR..RRRR..",
];

const SPRITE_PIRANHA_FRAME_0 = [
  "....RRRRRRRR....",
  "...RRWWRRRRWWR..",
  "..RRWWWWKKWWWW..",
  "..RRWWWWKKWWWW..",
  "..RRRRRRKKRRRR..",
  "...RRRRKKKKRR...",
  "....RRKKKKRR....",
  ".....KK..KK.....",
  ".....GGGGGG.....",
  "....GGGGGGGG....",
  "...GGG.GG.GGG...",
  "..GGG..GG..GGG..",
  ".......GG.......",
  ".......GG.......",
  ".......GG.......",
  "......GGGG......",
];

const SPRITE_PIRANHA_FRAME_1 = [
  "....RRRRRRRR....",
  "...RRWWRRRRWWR..",
  "..RRWWWWKKWWWW..",
  "..RRWWWWKKWWWW..",
  "...RRRRRRRRRR...",
  "....RRRRRRRR....",
  ".....RRRRRR.....",
  "......KKKK......",
  ".....GGGGGG.....",
  "....GGGGGGGG....",
  "...GGG.GG.GGG...",
  "..GGG..GG..GGG..",
  ".......GG.......",
  ".......GG.......",
  ".......GG.......",
  "......GGGG......",
];

const SPRITE_FIREBALL_FRAME_0 = [
  "..RRRR..",
  ".RYYYYR.",
  "RYYWWYYR",
  "RYYWWYYR",
  "RYYYYYYR",
  ".RYYYYR.",
  "..RRRR..",
  "...RR...",
];

const SPRITE_FIREBALL_FRAME_1 = [
  "...RR...",
  "..RYYR..",
  ".RYWWYR.",
  "RYYYYYYR",
  "RYYYYYYR",
  ".RYWWYR.",
  "..RYYR..",
  "...RR...",
];

const SPRITE_ENEMY_BULLET_0 = [
  "..WWWW..",
  ".WWLLWW.",
  "WWLKKLLW",
  "WLLKKLLW",
  "WLLKKLLW",
  "WWLKKLLW",
  ".WWLLWW.",
  "..WWWW..",
];

const SPRITE_ENEMY_BULLET_1 = [
  "...WW...",
  "..WWWW..",
  ".WWLLWW.",
  "WWLKKLLW",
  "WWLKKLLW",
  ".WWLLWW.",
  "..WWWW..",
  "...WW...",
];

const SPRITE_SPARKLE = [
  "...YY...",
  "..YYYY..",
  ".YYWWYY.",
  "YYWWWWYY",
  "YYWWWWYY",
  ".YYWWYY.",
  "..YYYY..",
  "...YY...",
];

const SPRITE_QUESTION_BLOCK = [
  "KKKKKKKKKKKKKKKK",
  "KYYYYYYYYYYYYYYK",
  "KYWWWWWWWWWWWWyK",
  "KYWYYYYYYYYYYyyK",
  "KYWY..YYYY.YYyyK",
  "KYWY.YYYYYY.YyyK",
  "KYWY.YYYYYY.YyyK",
  "KYWY.....YY.YyyK",
  "KYWYYYY..YY.YyyK",
  "KYWYYYY..YY.YyyK",
  "KYWYYYYYYYY.YyyK",
  "KYWYYYY..YY.YyyK",
  "KYWYYYY..YY.YyyK",
  "KYWYYYYYYYYYYyyK",
  "KyyyyyyyyyyyyyyK",
  "KKKKKKKKKKKKKKKK",
];

const SPRITE_BRICK_BLOCK = [
  "KKKKKKKKKKKKKKKK",
  "KOOOOOOKKOOOOOOK",
  "KOOOOOOKKOOOOOOK",
  "KOOOOOOKKOOOOOOK",
  "KKKKKKKKKKKKKKKK",
  "KOOOKKOOOOOOKKOO",
  "KOOOKKOOOOOOKKOO",
  "KOOOKKOOOOOOKKOO",
  "KKKKKKKKKKKKKKKK",
  "KOOOOOOKKOOOOOOK",
  "KOOOOOOKKOOOOOOK",
  "KOOOOOOKKOOOOOOK",
  "KKKKKKKKKKKKKKKK",
  "KOOOKKOOOOOOKKOO",
  "KOOOKKOOOOOOKKOO",
  "KKKKKKKKKKKKKKKK",
];

const SPRITE_PIPE_TOP = [
  "KKKKKKKKKKKKKKKKKKKKKKKK",
  "KGGGGGGGGGGGGGGGGGGGGGGK",
  "KGWWWWGGGGGGGGGGGGGGGGgK",
  "KGW..WGGGGGGGGGGGGGGGGgK",
  "KGWWWWGGGGGGGGGGGGGGGGgK",
  "KGGGGGGGGGGGGGGGGGGGGGGK",
  "KGGGGGGGGGGGGGGGGGGGGGGK",
  "KGGGGGGGGGGGGGGGGGGGGGGK",
  "KGGGGGGGGGGGGGGGGGGGGGGK",
  "KGGGGGGGGGGGGGGGGGGGGGGK",
  "KGGGGGGGGGGGGGGGGGGGGGGK",
  "KGGGGGGGGGGGGGGGGGGGGGGK",
  "KGGGGGGGGGGGGGGGGGGGGGGK",
  "KggggggggggggggggggggggK",
  "KKKKKKKKKKKKKKKKKKKKKKKK",
  "....KKKKKKKKKKKKKKKK....",
];

const SPRITE_PIPE_BODY = [
  "....KGGGGGGGGGGGGGGK....",
  "....KGW..WGGGGGGGGgK....",
  "....KGW..WGGGGGGGGgK....",
  "....KGGGGGGGGGGGGGGK....",
  "....KGGGGGGGGGGGGGGK....",
  "....KGGGGGGGGGGGGGGK....",
  "....KGGGGGGGGGGGGGGK....",
  "....KGGGGGGGGGGGGGGK....",
  "....KGGGGGGGGGGGGGGK....",
  "....KGGGGGGGGGGGGGGK....",
  "....KGGGGGGGGGGGGGGK....",
  "....KGGGGGGGGGGGGGGK....",
  "....KGGGGGGGGGGGGGGK....",
  "....KGGGGGGGGGGGGGGK....",
  "....KggggggggggggggK....",
  "....KKKKKKKKKKKKKKKK....",
];

function createPixelCanvas(matrix: string[]): HTMLCanvasElement {
  const height = matrix.length;
  const width = matrix[0].length;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < height; y++) {
    const row = matrix[y];
    for (let x = 0; x < width; x++) {
      const char = row[x];
      const color = PALETTE[char];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  return canvas;
}

export default function MarioInvadersGame({
  onExit,
  isMuted = false,
  onEarnPoints,
}: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    // Pre-render sprite textures
    const sprites = {
      player: [
        createPixelCanvas(SPRITE_PLAYER_FRAME_0),
        createPixelCanvas(SPRITE_PLAYER_FRAME_1),
      ],
      playerMini: createPixelCanvas(SPRITE_PLAYER_MINI),
      goomba: [
        createPixelCanvas(SPRITE_GOOMBA_FRAME_0),
        createPixelCanvas(SPRITE_GOOMBA_FRAME_1),
      ],
      koopa: [
        createPixelCanvas(SPRITE_KOOPA_FRAME_0),
        createPixelCanvas(SPRITE_KOOPA_FRAME_1),
      ],
      piranha: [
        createPixelCanvas(SPRITE_PIRANHA_FRAME_0),
        createPixelCanvas(SPRITE_PIRANHA_FRAME_1),
      ],
      fireball: [
        createPixelCanvas(SPRITE_FIREBALL_FRAME_0),
        createPixelCanvas(SPRITE_FIREBALL_FRAME_1),
      ],
      enemyBullet: [
        createPixelCanvas(SPRITE_ENEMY_BULLET_0),
        createPixelCanvas(SPRITE_ENEMY_BULLET_1),
      ],
      sparkle: createPixelCanvas(SPRITE_SPARKLE),
      questionBlock: createPixelCanvas(SPRITE_QUESTION_BLOCK),
      brickBlock: createPixelCanvas(SPRITE_BRICK_BLOCK),
      pipeTop: createPixelCanvas(SPRITE_PIPE_TOP),
      pipeBody: createPixelCanvas(SPRITE_PIPE_BODY),
    };

    // Synthesizer
    let audioCtx: AudioContext | null = null;
    const marchFreqs = [110, 98, 87, 73.4];

    const initAudio = () => {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    };

    const playTone = (
      freqStart: number,
      freqEnd: number,
      type: OscillatorType,
      duration: number,
      gainStart: number
    ) => {
      if (isMuted) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freqStart, now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 10), now + duration);
        gain.gain.setValueAtTime(gainStart, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + duration);
      } catch {
        // silent fail
      }
    };

    const playNoise = (duration: number, gainStart: number) => {
      if (isMuted) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + duration);
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(gainStart, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
      } catch {
        // silent fail
      }
    };

    // Parallax background items
    const clouds = [
      { x: 40, y: -30, w: 64, h: 28 },
      { x: 260, y: 70, w: 90, h: 34 },
      { x: 140, y: 190, w: 56, h: 24 },
      { x: 380, y: 280, w: 72, h: 30 },
    ];
    const hills = [
      { x: 30, y: 0, r: 60, col: "#16a34a", dark: "#15803d" },
      { x: 200, y: 120, r: 85, col: "#22c55e", dark: "#16a34a" },
      { x: 390, y: 40, r: 70, col: "#16a34a", dark: "#15803d" },
      { x: 110, y: 260, r: 75, col: "#22c55e", dark: "#16a34a" },
      { x: 320, y: 320, r: 65, col: "#16a34a", dark: "#15803d" },
    ];
    const castles = [
      { x: 210, y: -90, w: 60, h: 50 },
      { x: 340, y: 180, w: 50, h: 42 },
    ];
    const edgeObjects: Array<{ side: string; type: string; x: number; y: number }> = [];
    for (let i = -2; i < 8; i++) {
      const y = i * 75;
      const lType = i % 3 === 0 ? "pipe" : i % 2 === 0 ? "question" : "brick";
      edgeObjects.push({ side: "left", type: lType, x: lType === "pipe" ? 6 : 14, y });
      const rType = (i + 1) % 3 === 0 ? "pipe" : (i + 1) % 2 === 0 ? "brick" : "question";
      edgeObjects.push({ side: "right", type: rType, x: 450, y: y + 35 });
    }

    // Input state
    const keysDown = new Set<string>();
    const justPressed = new Set<string>();

    const onKeyDown = (e: KeyboardEvent) => {
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }
      if (!keysDown.has(e.code)) justPressed.add(e.code);
      keysDown.add(e.code);
      initAudio();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysDown.delete(e.code);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Gameplay State
    let gameState: "TITLE" | "PLAYING" | "PAUSED" | "GAME_OVER" | "WAVE_CLEAR" = "TITLE";
    let score = 0;
    let highScore = 0;
    let level = 1;
    let lives = 3;
    let waveClearTimer = 0;
    let blinkTimer = 0;

    try {
      const saved = localStorage.getItem("mario_invaders_hi");
      if (saved) highScore = parseInt(saved, 10) || 0;
    } catch {
      // ignore
    }

    // Player
    const player = {
      x: 228,
      y: 324,
      w: 24,
      h: 18,
      frame: 0,
      animTimer: 0,
      invincibleTimer: 0,
      shootCooldown: 0,
    };

    // Bullets & Particles
    interface Bullet {
      x: number;
      y: number;
      w: number;
      h: number;
      frame: number;
      anim: number;
      dead: boolean;
    }
    let playerBullets: Bullet[] = [];
    let enemyBullets: Bullet[] = [];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }
    let particles: Particle[] = [];

    interface Popup {
      x: number;
      y: number;
      text: string;
      life: number;
    }
    let popups: Popup[] = [];

    // Enemy Fleet
    interface EnemyItem {
      type: "piranha" | "koopa" | "goomba";
      row: number;
      col: number;
      x: number;
      y: number;
      w: number;
      h: number;
      points: number;
      frame: number;
      alive: boolean;
    }

    let enemies: EnemyItem[] = [];
    let fleetDir = 1;
    let fleetStepTimer = 0;
    let fleetStepIndex = 0;
    let dropTimer = 1.0;

    const initFleet = () => {
      enemies = [];
      fleetDir = 1;
      fleetStepTimer = 0;
      fleetStepIndex = 0;
      dropTimer = 1.0;
      for (let r = 0; r < 5; r++) {
        const type = r === 0 ? "piranha" : r <= 2 ? "koopa" : "goomba";
        const points = r === 0 ? 30 : r <= 2 ? 20 : 10;
        for (let c = 0; c < 8; c++) {
          enemies.push({
            type,
            row: r,
            col: c,
            x: 52 + c * 38,
            y: 42 + r * 24,
            w: 16,
            h: 16,
            points,
            frame: 0,
            alive: true,
          });
        }
      }
    };

    const startNewGame = () => {
      score = 0;
      level = 1;
      lives = 3;
      player.x = 228;
      player.invincibleTimer = 0;
      player.shootCooldown = 0;
      playerBullets = [];
      enemyBullets = [];
      particles = [];
      popups = [];
      initFleet();
      gameState = "PLAYING";
    };

    const triggerExplosion = (x: number, y: number, count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 40 + Math.random() * 110;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 40,
          life: 0.6 + Math.random() * 0.3,
          maxLife: 0.8,
        });
      }
    };

    let lastTime = performance.now();
    let animFrameId: number;

    const gameLoop = (currTime: number) => {
      const dt = Math.min((currTime - lastTime) / 1000, 0.1);
      lastTime = currTime;

      // 1. UPDATE PARALLAX BACKGROUND
      for (const c of clouds) {
        c.y += 22 * dt;
        if (c.y > 400) {
          c.y = -50;
          c.x = Math.random() * 400;
        }
      }
      for (const h of hills) {
        h.y += 48 * dt;
        if (h.y - h.r > 360) {
          h.y = -h.r - 20;
          h.x = 20 + Math.random() * 440;
        }
      }
      for (const c of castles) {
        c.y += 48 * dt;
        if (c.y > 420) {
          c.y = -80;
          c.x = 80 + Math.random() * 320;
        }
      }
      for (const obj of edgeObjects) {
        obj.y += 95 * dt;
        if (obj.y > 400) obj.y -= 500;
      }

      // 2. STATE MACHINE
      if (gameState === "TITLE") {
        if (justPressed.has("Space") || justPressed.has("Enter")) {
          startNewGame();
        }
      } else if (gameState === "PAUSED") {
        if (justPressed.has("KeyP")) {
          gameState = "PLAYING";
        }
      } else if (gameState === "GAME_OVER") {
        if (justPressed.has("Space") || justPressed.has("Enter") || justPressed.has("KeyR")) {
          startNewGame();
        }
      } else if (gameState === "WAVE_CLEAR") {
        waveClearTimer -= dt;
        if (waveClearTimer <= 0) {
          level += 1;
          playerBullets = [];
          enemyBullets = [];
          initFleet();
          gameState = "PLAYING";
        }
      } else if (gameState === "PLAYING") {
        if (justPressed.has("KeyP")) {
          gameState = "PAUSED";
        } else {
          // Player Update
          player.animTimer += dt;
          if (player.animTimer >= 0.06) {
            player.animTimer = 0;
            player.frame = (player.frame + 1) % 2;
          }
          if (player.invincibleTimer > 0) player.invincibleTimer -= dt;
          if (player.shootCooldown > 0) player.shootCooldown -= dt;

          let dx = 0;
          if (keysDown.has("ArrowLeft") || keysDown.has("KeyA")) dx -= 1;
          if (keysDown.has("ArrowRight") || keysDown.has("KeyD")) dx += 1;
          player.x += dx * 220 * dt;
          player.x = Math.max(36, Math.min(480 - 36 - player.w, player.x));

          // Shoot
          if (keysDown.has("Space") && player.shootCooldown <= 0 && playerBullets.length < 3) {
            playerBullets.push({
              x: player.x + (player.w - 8) / 2,
              y: player.y - 4,
              w: 8,
              h: 8,
              frame: 0,
              anim: 0,
              dead: false,
            });
            playTone(880, 220, "triangle", 0.12, 0.18);
            player.shootCooldown = 0.2;
          }

          // Fireballs update
          for (const b of playerBullets) {
            b.y -= 320 * dt;
            b.anim += dt;
            if (b.anim > 0.08) {
              b.anim = 0;
              b.frame = (b.frame + 1) % 2;
            }
            if (b.y < -10) b.dead = true;
          }
          playerBullets = playerBullets.filter((b) => !b.dead);

          // Fleet update
          const alive = enemies.filter((e) => e.alive);
          if (alive.length === 0) {
            gameState = "WAVE_CLEAR";
            waveClearTimer = 1.6;
            playTone(523, 1046, "square", 0.4, 0.2);
          } else {
            // Stepped march
            fleetStepTimer += dt;
            const ratio = alive.length / 40;
            const stepInterval = 0.06 + (0.65 - 0.06) * Math.pow(ratio, 0.7);

            if (fleetStepTimer >= stepInterval) {
              fleetStepTimer = 0;
              fleetStepIndex++;
              let reachedEdge = false;
              for (const e of alive) {
                const nx = e.x + fleetDir * 9;
                if (nx < 36 || nx + e.w > 480 - 36) {
                  reachedEdge = true;
                  break;
                }
              }

              if (reachedEdge) {
                fleetDir *= -1;
                for (const e of alive) e.y += 10;
              } else {
                for (const e of alive) e.x += fleetDir * 9;
              }
              for (const e of alive) e.frame = (e.frame + 1) % 2;
              const f = marchFreqs[fleetStepIndex % marchFreqs.length];
              playTone(f, f * 0.85, "triangle", 0.08, 0.2);
            }

            // Invasion check
            for (const e of alive) {
              if (e.y + e.h >= player.y) {
                lives = 0;
                gameState = "GAME_OVER";
                playNoise(0.4, 0.3);
                triggerExplosion(player.x, player.y, 25);
              }
            }

            // Enemy projectile drops
            dropTimer -= dt;
            if (dropTimer <= 0) {
              dropTimer = 0.6 + Math.random() * 1.4;
              if (enemyBullets.length < 5 && alive.length > 0) {
                const shooter = alive[Math.floor(Math.random() * alive.length)];
                enemyBullets.push({
                  x: shooter.x + 4,
                  y: shooter.y + shooter.h,
                  w: 8,
                  h: 8,
                  frame: 0,
                  anim: 0,
                  dead: false,
                });
              }
            }
          }

          // Enemy bullets update
          for (const eb of enemyBullets) {
            eb.y += 160 * dt;
            eb.anim += dt;
            if (eb.anim > 0.1) {
              eb.anim = 0;
              eb.frame = (eb.frame + 1) % 2;
            }
            if (eb.y > 370) eb.dead = true;
          }
          enemyBullets = enemyBullets.filter((eb) => !eb.dead);

          // Collisions: Fireballs vs Enemies
          for (const b of playerBullets) {
            if (b.dead) continue;
            for (const e of alive) {
              if (!e.alive) continue;
              if (
                b.x < e.x + e.w &&
                b.x + b.w > e.x &&
                b.y < e.y + e.h &&
                b.y + b.h > e.y
              ) {
                b.dead = true;
                e.alive = false;
                score += e.points;
                if (score > highScore) {
                  highScore = score;
                  try {
                    localStorage.setItem("mario_invaders_hi", String(highScore));
                  } catch {
                    // ignore
                  }
                }
                // Reward player points in arcade
                if (onEarnPoints) {
                  onEarnPoints(e.points);
                }
                playNoise(0.18, 0.25);
                triggerExplosion(e.x + e.w / 2, e.y + e.h / 2, 14);
                popups.push({ x: e.x, y: e.y, text: `+${e.points}`, life: 0.7 });
                break;
              }
            }
          }

          // Collisions: Enemy bullets vs Player
          if (player.invincibleTimer <= 0) {
            for (const eb of enemyBullets) {
              if (eb.dead) continue;
              if (
                eb.x < player.x + player.w &&
                eb.x + eb.w > player.x &&
                eb.y < player.y + player.h &&
                eb.y + eb.h > player.y
              ) {
                eb.dead = true;
                lives -= 1;
                player.invincibleTimer = 2.2;
                playNoise(0.35, 0.4);
                triggerExplosion(player.x + player.w / 2, player.y + player.h / 2, 18);
                if (lives <= 0) {
                  gameState = "GAME_OVER";
                  playTone(392, 261, "sawtooth", 0.4, 0.3);
                }
                break;
              }
            }
          }
        }
      }

      // Particles & Popups update
      for (const p of particles) {
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 200 * dt;
      }
      particles = particles.filter((p) => p.life > 0);

      for (const pp of popups) {
        pp.life -= dt;
        pp.y -= 25 * dt;
      }
      popups = popups.filter((pp) => pp.life > 0);

      justPressed.clear();

      // 3. RENDER
      ctx.clearRect(0, 0, 480, 360);

      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 360);
      skyGrad.addColorStop(0, "#5c94fc");
      skyGrad.addColorStop(0.7, "#85b7fc");
      skyGrad.addColorStop(1, "#c6e2ff");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 480, 360);

      // Clouds
      for (const c of clouds) {
        ctx.fillStyle = "#b3d1ff";
        ctx.fillRect(Math.round(c.x + 4), Math.round(c.y + c.h * 0.4), Math.round(c.w - 8), Math.round(c.h * 0.6));
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(Math.round(c.x + c.w * 0.2), Math.round(c.y), Math.round(c.w * 0.6), Math.round(c.h * 0.5));
        ctx.fillRect(Math.round(c.x), Math.round(c.y + c.h * 0.25), Math.round(c.w), Math.round(c.h * 0.65));
      }

      // Hills
      for (const h of hills) {
        ctx.beginPath();
        ctx.arc(Math.round(h.x), Math.round(h.y), h.r, 0, Math.PI * 2);
        ctx.fillStyle = h.col;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = h.dark;
        ctx.stroke();
      }

      // Castles
      for (const cas of castles) {
        const rx = Math.round(cas.x);
        const ry = Math.round(cas.y);
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(rx + cas.w * 0.25, ry + cas.h * 0.3, cas.w * 0.5, cas.h * 0.7);
        ctx.fillRect(rx, ry + cas.h * 0.4, cas.w * 0.22, cas.h * 0.6);
        ctx.fillRect(rx + cas.w * 0.78, ry + cas.h * 0.4, cas.w * 0.22, cas.h * 0.6);
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.moveTo(rx + cas.w * 0.5, ry);
        ctx.lineTo(rx + cas.w * 0.25, ry + cas.h * 0.3);
        ctx.lineTo(rx + cas.w * 0.75, ry + cas.h * 0.3);
        ctx.fill();
        ctx.fillStyle = "#facc15";
        ctx.fillRect(rx + cas.w * 0.5, ry - 6, 8, 5);
      }

      // Edge Blocks
      for (const obj of edgeObjects) {
        if (obj.type === "question") ctx.drawImage(sprites.questionBlock, Math.round(obj.x), Math.round(obj.y));
        else if (obj.type === "brick") ctx.drawImage(sprites.brickBlock, Math.round(obj.x), Math.round(obj.y));
        else if (obj.type === "pipe") {
          ctx.drawImage(sprites.pipeTop, Math.round(obj.x), Math.round(obj.y));
          ctx.drawImage(sprites.pipeBody, Math.round(obj.x), Math.round(obj.y + 16));
        }
      }

      // Enemies
      for (const e of enemies) {
        if (!e.alive) continue;
        const sp = sprites[e.type][e.frame];
        ctx.drawImage(sp, Math.round(e.x), Math.round(e.y));
      }

      // Bullets
      for (const b of playerBullets) {
        ctx.drawImage(sprites.fireball[b.frame], Math.round(b.x), Math.round(b.y));
      }
      for (const eb of enemyBullets) {
        ctx.drawImage(sprites.enemyBullet[eb.frame], Math.round(eb.x), Math.round(eb.y));
      }

      // Player
      if (lives > 0 || gameState !== "GAME_OVER") {
        if (player.invincibleTimer <= 0 || Math.floor(player.invincibleTimer * 12) % 2 !== 0) {
          ctx.drawImage(sprites.player[player.frame], Math.round(player.x), Math.round(player.y));
        }
      }

      // Particles
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.drawImage(sprites.sparkle, Math.round(p.x), Math.round(p.y));
        ctx.restore();
      }

      // Popups
      for (const pp of popups) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pp.life / 0.7);
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = "#facc15";
        ctx.fillText(pp.text, Math.round(pp.x), Math.round(pp.y));
        ctx.restore();
      }

      // HUD
      ctx.save();
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#000000";
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(`SCORE:${String(score).padStart(5, "0")}`, 12, 16);
      ctx.fillText(`HI:${String(highScore).padStart(5, "0")}`, 160, 16);
      ctx.fillText(`LVL:${String(level).padStart(2, "0")}`, 290, 16);
      ctx.fillText("LIVES:", 366, 16);
      for (let i = 0; i < lives; i++) {
        ctx.drawImage(sprites.playerMini, 426 + i * 15, 8);
      }
      ctx.restore();

      // Overlays
      if (gameState === "TITLE") {
        ctx.save();
        ctx.textAlign = "center";
        ctx.font = '18px "Press Start 2P", monospace';
        ctx.fillStyle = "#e52521";
        ctx.shadowColor = "#000000";
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.fillText("MARIO INVADERS", 240, 70);

        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = "#facc15";
        ctx.fillText("RETRO 16-BIT SKY PATROL", 240, 95);
        ctx.drawImage(sprites.player[0], 228, 115);

        ctx.textAlign = "left";
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = "#ffffff";
        ctx.drawImage(sprites.piranha[0], 155, 160);
        ctx.fillText("= 30 PTS", 185, 172);
        ctx.drawImage(sprites.koopa[0], 155, 184);
        ctx.fillText("= 20 PTS", 185, 196);
        ctx.drawImage(sprites.goomba[0], 155, 208);
        ctx.fillText("= 10 PTS", 185, 220);

        blinkTimer += 0.04;
        if (Math.sin(blinkTimer * 4) > -0.2) {
          ctx.textAlign = "center";
          ctx.font = '9px "Press Start 2P", monospace';
          ctx.fillStyle = "#facc15";
          ctx.fillText("PRESS SPACE TO START", 240, 260);
        }
        ctx.restore();
      } else if (gameState === "PAUSED") {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, 480, 360);
        ctx.textAlign = "center";
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.fillStyle = "#facc15";
        ctx.fillText("PAUSED", 240, 170);
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = "#ffffff";
        ctx.fillText("PRESS P TO RESUME", 240, 198);
        ctx.restore();
      } else if (gameState === "WAVE_CLEAR") {
        ctx.save();
        ctx.textAlign = "center";
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.fillStyle = "#4ade80";
        ctx.fillText("WAVE CLEARED!", 240, 170);
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = "#facc15";
        ctx.fillText(`PREPARING LEVEL ${level + 1}...`, 240, 194);
        ctx.restore();
      } else if (gameState === "GAME_OVER") {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.72)";
        ctx.fillRect(0, 0, 480, 360);
        ctx.textAlign = "center";
        ctx.font = '18px "Press Start 2P", monospace';
        ctx.fillStyle = "#e52521";
        ctx.fillText("GAME OVER", 240, 120);
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`FINAL SCORE: ${score}`, 240, 160);
        ctx.fillText(`HI-SCORE: ${highScore}`, 240, 185);
        blinkTimer += 0.04;
        if (Math.sin(blinkTimer * 4) > -0.2) {
          ctx.font = '8px "Press Start 2P", monospace';
          ctx.fillStyle = "#facc15";
          ctx.fillText("PRESS SPACE TO RETRY", 240, 235);
        }
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(gameLoop);
    };

    animFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, [isMuted, onEarnPoints]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden select-none font-pixel">
      <canvas
        ref={canvasRef}
        width={480}
        height={360}
        className="w-full h-full object-contain"
        style={{
          imageRendering: "pixelated",
        }}
      />
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          className="absolute top-2 right-2 px-2 py-1 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 text-[8px] rounded border border-neutral-700 cursor-pointer z-30"
        >
          [EJECT]
        </button>
      )}
    </div>
  );
}
