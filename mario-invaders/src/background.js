// ============================================================================
// background.js - 4-Layer Parallax Vertically Scrolling Background
// Mario Invaders - 16-Bit Retro Arcade
// Simulates forward flight:
//   Layer 1: Sky gradient (light blue to pale blue, static)
//   Layer 2: Far clouds (slow)
//   Layer 3: Green hills and distant castle silhouettes (medium)
//   Layer 4: Floating question blocks, bricks, and green pipes at edges (fast)
// ============================================================================

import { SPRITES } from './sprites.js';

export class ParallaxBackground {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    // Layer 2: Far Clouds (slow: ~20 px/s)
    this.cloudSpeed = 22;
    this.clouds = [
      { x: 40,  y: -30, width: 64, height: 28, scale: 1.0 },
      { x: 260, y: 70,  width: 90, height: 34, scale: 1.2 },
      { x: 140, y: 190, width: 56, height: 24, scale: 0.9 },
      { x: 380, y: 280, width: 72, height: 30, scale: 1.1 },
    ];

    // Layer 3: Hills & Distant Castle Silhouettes (medium: ~45 px/s)
    this.hillSpeed = 48;
    this.hills = [
      { x: 30,  y: 0,   radius: 60, color: '#16a34a', darkColor: '#15803d' },
      { x: 200, y: 120, radius: 85, color: '#22c55e', darkColor: '#16a34a' },
      { x: 390, y: 40,  radius: 70, color: '#16a34a', darkColor: '#15803d' },
      { x: 110, y: 260, radius: 75, color: '#22c55e', darkColor: '#16a34a' },
      { x: 320, y: 320, radius: 65, color: '#16a34a', darkColor: '#15803d' },
    ];

    // Distant Castle Silhouettes drifting downwards
    this.castles = [
      { x: 210, y: -90, width: 60, height: 50 },
      { x: 340, y: 180, width: 50, height: 42 },
    ];

    // Layer 4: Edge Floating Blocks & Pipes (fast: ~95 px/s)
    this.edgeSpeed = 95;
    this.edgeObjects = [];
    this.initEdgeObjects();
  }

  // Populate floating blocks & pipes along left and right margins
  initEdgeObjects() {
    const spacing = 75;
    const total = Math.ceil(this.height / spacing) + 3;

    for (let i = -2; i < total; i++) {
      const y = i * spacing;

      // Left edge item (random question, brick, or pipe)
      const leftType = (i % 3 === 0) ? 'pipe' : (i % 2 === 0 ? 'question' : 'brick');
      this.edgeObjects.push({
        side: 'left',
        type: leftType,
        x: (leftType === 'pipe') ? 6 : 14,
        y: y,
      });

      // Right edge item (offset so they don't look completely symmetrical)
      const rightType = ((i + 1) % 3 === 0) ? 'pipe' : ((i + 1) % 2 === 0 ? 'brick' : 'question');
      this.edgeObjects.push({
        side: 'right',
        type: rightType,
        x: (rightType === 'pipe') ? this.width - 30 : this.width - 30,
        y: y + spacing * 0.5,
      });
    }
  }

  update(dt) {
    // 1. Update Clouds (Layer 2)
    for (const cloud of this.clouds) {
      cloud.y += this.cloudSpeed * dt;
      if (cloud.y > this.height + 40) {
        cloud.y = -50;
        cloud.x = Math.random() * (this.width - cloud.width);
      }
    }

    // 2. Update Hills & Castles (Layer 3)
    for (const hill of this.hills) {
      hill.y += this.hillSpeed * dt;
      if (hill.y - hill.radius > this.height) {
        hill.y = -hill.radius - 20;
        hill.x = 20 + Math.random() * (this.width - 40);
      }
    }

    for (const castle of this.castles) {
      castle.y += this.hillSpeed * dt;
      if (castle.y > this.height + 60) {
        castle.y = -80;
        castle.x = 80 + Math.random() * (this.width - 160);
      }
    }

    // 3. Update Edge Blocks & Pipes (Layer 4)
    for (const obj of this.edgeObjects) {
      obj.y += this.edgeSpeed * dt;
      if (obj.y > this.height + 40) {
        obj.y -= this.height + 150;
        // Re-randomize type slightly upon wrap
        if (Math.random() < 0.35) {
          obj.type = 'question';
        } else if (Math.random() < 0.65) {
          obj.type = 'brick';
        } else {
          obj.type = 'pipe';
        }
      }
    }
  }

  render(ctx) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // --- LAYER 1: Sky Gradient (Light Blue to Pale Blue) ---
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    skyGrad.addColorStop(0, '#5c94fc');   // Classic Mario Blue
    skyGrad.addColorStop(0.7, '#85b7fc');
    skyGrad.addColorStop(1, '#c6e2ff');   // Horizon Pale Blue
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // --- LAYER 2: Far Clouds (Slow) ---
    for (const cloud of this.clouds) {
      this.drawCloud(ctx, cloud.x, cloud.y, cloud.width, cloud.height);
    }

    // --- LAYER 3: Distant Castle Silhouettes & Hills (Medium) ---
    for (const castle of this.castles) {
      this.drawCastle(ctx, castle.x, castle.y, castle.width, castle.height);
    }

    for (const hill of this.hills) {
      this.drawHill(ctx, hill.x, hill.y, hill.radius, hill.color, hill.darkColor);
    }

    // --- LAYER 4: Floating Blocks & Pipes at Edges (Fast) ---
    for (const obj of this.edgeObjects) {
      if (obj.type === 'question') {
        ctx.drawImage(SPRITES.questionBlock, Math.round(obj.x), Math.round(obj.y));
      } else if (obj.type === 'brick') {
        ctx.drawImage(SPRITES.brickBlock, Math.round(obj.x), Math.round(obj.y));
      } else if (obj.type === 'pipe') {
        ctx.drawImage(SPRITES.pipeTop, Math.round(obj.x), Math.round(obj.y));
        ctx.drawImage(SPRITES.pipeBody, Math.round(obj.x), Math.round(obj.y + 16));
      }
    }

    ctx.restore();
  }

  // Draw 8-bit puffy Mario cloud
  drawCloud(ctx, x, y, w, h) {
    ctx.save();
    // Shadow base
    ctx.fillStyle = '#b3d1ff';
    ctx.fillRect(Math.round(x + 4), Math.round(y + h * 0.4), Math.round(w - 8), Math.round(h * 0.6));
    // White puffs
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.round(x + w * 0.2), Math.round(y), Math.round(w * 0.6), Math.round(h * 0.5));
    ctx.fillRect(Math.round(x), Math.round(y + h * 0.25), Math.round(w), Math.round(h * 0.65));
    ctx.restore();
  }

  // Draw retro Mario rolling hill
  drawHill(ctx, cx, cy, r, fill, stroke) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(Math.round(cx), Math.round(cy), r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = stroke;
    ctx.stroke();

    // Shrub / eye detail spots
    ctx.fillStyle = stroke;
    ctx.fillRect(Math.round(cx - r * 0.3), Math.round(cy - r * 0.2), 4, 8);
    ctx.fillRect(Math.round(cx + r * 0.2), Math.round(cy - r * 0.1), 4, 8);
    ctx.restore();
  }

  // Draw distant Peach's Castle silhouette
  drawCastle(ctx, x, y, w, h) {
    ctx.save();
    const rx = Math.round(x);
    const ry = Math.round(y);

    // Main central keep (ivory)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(rx + w * 0.25, ry + h * 0.3, w * 0.5, h * 0.7);

    // Left & right towers
    ctx.fillRect(rx, ry + h * 0.4, w * 0.22, h * 0.6);
    ctx.fillRect(rx + w * 0.78, ry + h * 0.4, w * 0.22, h * 0.6);

    // Red conical tower roofs
    ctx.fillStyle = '#dc2626';
    // Center spire
    ctx.beginPath();
    ctx.moveTo(rx + w * 0.5, ry);
    ctx.lineTo(rx + w * 0.25, ry + h * 0.3);
    ctx.lineTo(rx + w * 0.75, ry + h * 0.3);
    ctx.closePath();
    ctx.fill();

    // Left spire
    ctx.beginPath();
    ctx.moveTo(rx + w * 0.11, ry + h * 0.15);
    ctx.lineTo(rx, ry + h * 0.4);
    ctx.lineTo(rx + w * 0.22, ry + h * 0.4);
    ctx.closePath();
    ctx.fill();

    // Right spire
    ctx.beginPath();
    ctx.moveTo(rx + w * 0.89, ry + h * 0.15);
    ctx.lineTo(rx + w * 0.78, ry + h * 0.4);
    ctx.lineTo(rx + w, ry + h * 0.4);
    ctx.closePath();
    ctx.fill();

    // Yellow flag on center spire
    ctx.fillStyle = '#facc15';
    ctx.fillRect(rx + w * 0.5, ry - 6, 8, 5);

    // Arched gate / windows
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rx + w * 0.42, ry + h * 0.75, w * 0.16, h * 0.25);
    ctx.fillRect(rx + w * 0.44, ry + h * 0.45, w * 0.12, h * 0.15);

    ctx.restore();
  }
}
