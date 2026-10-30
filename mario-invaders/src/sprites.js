// ============================================================================
// sprites.js - Pixel-Art Sprite Data & Drawing Engine
// Mario Invaders - 16-Bit Retro Arcade
// All sprites are defined as ascii-pixel matrices and pre-rendered to offscreen
// canvases with imageSmoothingEnabled = false for maximum retro crispness.
// ============================================================================

// Standard NES / Arcade Retro Palette
export const PALETTE = {
  '.': null, // Transparent
  'K': '#111827', // Black / Outline
  'W': '#ffffff', // Pure White
  'R': '#e52521', // Mario Red
  'D': '#991b1b', // Deep Dark Red
  'Y': '#facc15', // Bright Yellow / Coin Gold
  'y': '#ca8a04', // Dark Gold
  'B': '#2563eb', // Mario Blue
  'S': '#fed7aa', // Peach / Skin Tone
  'b': '#78350f', // Dark Brown (hair/mustache)
  'O': '#d97706', // Goomba Tan / Chestnut
  'o': '#92400e', // Goomba Shadow Brown
  'G': '#16a34a', // Pipe / Koopa Green
  'g': '#15803d', // Dark Green
  'C': '#38bdf8', // Cockpit Glass Sky Blue
  'c': '#0284c7', // Deep Cyan Glass
  'L': '#9ca3af', // Light Metal / Silver
  'M': '#4b5563', // Dark Metal / Slate
  'P': '#f472b6', // Pink highlight
};

// ----------------------------------------------------------------------------
// Sprite Definitions (ASCII matrices)
// ----------------------------------------------------------------------------

// 1. Player: Mario piloting small Red Airplane (24x18)
// Frame 0: Propeller tilted / Frame 1: Propeller straight
export const SPRITE_PLAYER_FRAME_0 = [
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

export const SPRITE_PLAYER_FRAME_1 = [
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

// Mini Life Icon (12x9)
export const SPRITE_PLAYER_MINI = [
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

// 2. Goomba (16x16) - 10 Points
export const SPRITE_GOOMBA_FRAME_0 = [
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

export const SPRITE_GOOMBA_FRAME_1 = [
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

// 3. Koopa Troopa (16x16) - 20 Points
export const SPRITE_KOOPA_FRAME_0 = [
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

export const SPRITE_KOOPA_FRAME_1 = [
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

// 4. Piranha Plant (16x16) - 30 Points
export const SPRITE_PIRANHA_FRAME_0 = [
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

export const SPRITE_PIRANHA_FRAME_1 = [
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

// 5. Fireball (Player Bullet, 8x8)
export const SPRITE_FIREBALL_FRAME_0 = [
  "..RRRR..",
  ".RYYYYR.",
  "RYYWWYYR",
  "RYYWWYYR",
  "RYYYYYYR",
  ".RYYYYR.",
  "..RRRR..",
  "...RR...",
];

export const SPRITE_FIREBALL_FRAME_1 = [
  "...RR...",
  "..RYYR..",
  ".RYWWYR.",
  "RYYYYYYR",
  "RYYYYYYR",
  ".RYWWYR.",
  "..RYYR..",
  "...RR...",
];

// 6. Enemy Bullet (Bone / Spiny Projectile, 8x8)
export const SPRITE_ENEMY_BULLET_0 = [
  "..WWWW..",
  ".WWLLWW.",
  "WWLKKLLW",
  "WLLKKLLW",
  "WLLKKLLW",
  "WWLKKLLW",
  ".WWLLWW.",
  "..WWWW..",
];

export const SPRITE_ENEMY_BULLET_1 = [
  "...WW...",
  "..WWWW..",
  ".WWLLWW.",
  "WWLKKLLW",
  "WWLKKLLW",
  ".WWLLWW.",
  "..WWWW..",
  "...WW...",
];

// 7. Sparkle / Coin Particle (8x8)
export const SPRITE_SPARKLE = [
  "...YY...",
  "..YYYY..",
  ".YYWWYY.",
  "YYWWWWYY",
  "YYWWWWYY",
  ".YYWWYY.",
  "..YYYY..",
  "...YY...",
];

// 8. Question Block [?] (16x16)
export const SPRITE_QUESTION_BLOCK = [
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

// 9. Brick Block (16x16)
export const SPRITE_BRICK_BLOCK = [
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

// 10. Warp Pipe Top (24x16)
export const SPRITE_PIPE_TOP = [
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

// 11. Warp Pipe Body (24x16)
export const SPRITE_PIPE_BODY = [
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

// ----------------------------------------------------------------------------
// Sprite Offscreen Canvas Pre-Renderer
// ----------------------------------------------------------------------------

/**
 * Creates an offscreen canvas containing the rendered pixel art.
 * @param {string[]} matrix Array of strings representing pixel rows
 * @param {Object} palette Color mapping
 * @param {number} scale Pixel scale multiplier
 * @returns {HTMLCanvasElement}
 */
export function createPixelCanvas(matrix, palette = PALETTE, scale = 1) {
  const height = matrix.length;
  const width = matrix[0].length;
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < height; y++) {
    const row = matrix[y];
    for (let x = 0; x < width; x++) {
      const char = row[x];
      const color = palette[char];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  return canvas;
}

// Pre-render and export all game sprites for instant GPU blitting
export const SPRITES = {
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
