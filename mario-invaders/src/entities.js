// ============================================================================
// entities.js - Game Entities (Player, Enemies, Projectiles, Particles)
// Mario Invaders - 16-Bit Retro Arcade
// All tunable gameplay constants and entity logic are encapsulated here.
// ============================================================================

import { SPRITES } from './sprites.js';
import { audio } from './audio.js';

// Central Tunable Constants
export const CONSTANTS = {
  CANVAS_WIDTH: 480,
  CANVAS_HEIGHT: 360,

  // Player Configuration
  PLAYER_SPEED: 220,
  PLAYER_WIDTH: 24,
  PLAYER_HEIGHT: 18,
  PLAYER_START_LIVES: 3,
  PLAYER_INVINCIBLE_DURATION: 2.2,
  PLAYER_BLINK_RATE: 12,
  PLAYER_MARGIN_X: 36,

  // Fireball (Player Bullet)
  MAX_PLAYER_BULLETS: 3,
  FIREBALL_SPEED: 320,
  FIREBALL_WIDTH: 8,
  FIREBALL_HEIGHT: 8,
  FIRE_COOLDOWN: 0.18,

  // Enemy Grid Configuration
  FLEET_ROWS: 5,
  FLEET_COLS: 8,
  ENEMY_WIDTH: 16,
  ENEMY_HEIGHT: 16,
  ENEMY_SPACING_X: 38,
  ENEMY_SPACING_Y: 24,
  FLEET_START_X: 52,
  FLEET_START_Y: 42,
  FLEET_STEP_X: 9,
  FLEET_STEP_Y: 10,
  FLEET_BASE_INTERVAL: 0.65,
  FLEET_MIN_INTERVAL: 0.06,

  // Enemy Projectiles
  ENEMY_DROP_MIN_INTERVAL: 0.7,
  ENEMY_DROP_MAX_INTERVAL: 1.8,
  ENEMY_BULLET_SPEED: 160,
  ENEMY_BULLET_WIDTH: 8,
  ENEMY_BULLET_HEIGHT: 8,
  MAX_ENEMY_BULLETS: 5,

  // Scoring
  POINTS_PIRANHA: 30, // Row 0
  POINTS_KOOPA: 20,   // Rows 1 & 2
  POINTS_GOOMBA: 10,  // Rows 3 & 4

  // Particles
  PARTICLE_GRAVITY: 200,
};

// ----------------------------------------------------------------------------
// Player Entity
// ----------------------------------------------------------------------------
export class Player {
  constructor() {
    this.width = CONSTANTS.PLAYER_WIDTH;
    this.height = CONSTANTS.PLAYER_HEIGHT;
    this.reset();
  }

  reset() {
    this.x = (CONSTANTS.CANVAS_WIDTH - this.width) / 2;
    this.y = CONSTANTS.CANVAS_HEIGHT - 36;
    this.lives = CONSTANTS.PLAYER_START_LIVES;
    this.invincibleTimer = 0;
    this.shootCooldown = 0;
    this.animTimer = 0;
    this.frame = 0;
  }

  update(dt, input, bullets) {
    // Propeller animation (15 FPS)
    this.animTimer += dt;
    if (this.animTimer >= 0.06) {
      this.animTimer = 0;
      this.frame = (this.frame + 1) % 2;
    }

    // Invincibility countdown
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= dt;
    }

    // Cooldown countdown
    if (this.shootCooldown > 0) {
      this.shootCooldown -= dt;
    }

    // Horizontal Movement
    let dx = 0;
    if (input.isLeft()) dx -= 1;
    if (input.isRight()) dx += 1;

    this.x += dx * CONSTANTS.PLAYER_SPEED * dt;

    // Constrain within playable screen channel
    const minX = CONSTANTS.PLAYER_MARGIN_X;
    const maxX = CONSTANTS.CANVAS_WIDTH - CONSTANTS.PLAYER_MARGIN_X - this.width;
    this.x = Math.max(minX, Math.min(maxX, this.x));

    // Fireball shooting (continuous or tap, up to max 3 on screen)
    if ((input.isFireHeld() || input.consumeFire()) && this.shootCooldown <= 0) {
      this.shoot(bullets);
    }
  }

  shoot(bullets) {
    if (bullets.length >= CONSTANTS.MAX_PLAYER_BULLETS) return;

    // Spawn fireball at nose of the plane
    const spawnX = this.x + (this.width - CONSTANTS.FIREBALL_WIDTH) / 2;
    const spawnY = this.y - 4;
    bullets.push(new Fireball(spawnX, spawnY));

    audio.playShoot();
    this.shootCooldown = CONSTANTS.FIRE_COOLDOWN;
  }

  hit() {
    if (this.invincibleTimer > 0) return false;

    this.lives -= 1;
    this.invincibleTimer = CONSTANTS.PLAYER_INVINCIBLE_DURATION;
    audio.playPlayerHit();
    return true;
  }

  render(ctx) {
    // Blinking effect during invincibility
    if (this.invincibleTimer > 0) {
      const blink = Math.floor(this.invincibleTimer * CONSTANTS.PLAYER_BLINK_RATE) % 2 === 0;
      if (blink) return;
    }

    const sprite = SPRITES.player[this.frame];
    ctx.drawImage(sprite, Math.round(this.x), Math.round(this.y));
  }
}

// ----------------------------------------------------------------------------
// Fireball (Player Bullet)
// ----------------------------------------------------------------------------
export class Fireball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = CONSTANTS.FIREBALL_WIDTH;
    this.height = CONSTANTS.FIREBALL_HEIGHT;
    this.speed = CONSTANTS.FIREBALL_SPEED;
    this.frame = 0;
    this.animTimer = 0;
    this.markedForDeletion = false;
  }

  update(dt) {
    this.y -= this.speed * dt;

    // Spin animation
    this.animTimer += dt;
    if (this.animTimer > 0.08) {
      this.animTimer = 0;
      this.frame = (this.frame + 1) % 2;
    }

    if (this.y < -10) {
      this.markedForDeletion = true;
    }
  }

  render(ctx) {
    const sprite = SPRITES.fireball[this.frame];
    ctx.drawImage(sprite, Math.round(this.x), Math.round(this.y));
  }
}

// ----------------------------------------------------------------------------
// Single Enemy
// ----------------------------------------------------------------------------
export class Enemy {
  constructor(type, row, col, x, y, points) {
    this.type = type; // 'piranha' | 'koopa' | 'goomba'
    this.row = row;
    this.col = col;
    this.x = x;
    this.y = y;
    this.width = CONSTANTS.ENEMY_WIDTH;
    this.height = CONSTANTS.ENEMY_HEIGHT;
    this.points = points;
    this.frame = 0;
    this.alive = true;
  }

  render(ctx) {
    if (!this.alive) return;
    const sprite = SPRITES[this.type][this.frame];
    ctx.drawImage(sprite, Math.round(this.x), Math.round(this.y));
  }
}

// ----------------------------------------------------------------------------
// Enemy Fleet (Grid of Goombas, Koopas, Piranhas)
// ----------------------------------------------------------------------------
export class EnemyFleet {
  constructor(level = 1) {
    this.level = level;
    this.enemies = [];
    this.direction = 1; // 1 = right, -1 = left
    this.stepTimer = 0;
    this.stepIndex = 0;
    this.dropTimer = 1.0;
    this.totalEnemies = CONSTANTS.FLEET_ROWS * CONSTANTS.FLEET_COLS;
    this.initFleet();
  }

  initFleet() {
    this.enemies = [];
    for (let r = 0; r < CONSTANTS.FLEET_ROWS; r++) {
      let type = 'goomba';
      let points = CONSTANTS.POINTS_GOOMBA;

      if (r === 0) {
        type = 'piranha';
        points = CONSTANTS.POINTS_PIRANHA;
      } else if (r === 1 || r === 2) {
        type = 'koopa';
        points = CONSTANTS.POINTS_KOOPA;
      }

      for (let c = 0; c < CONSTANTS.FLEET_COLS; c++) {
        const x = CONSTANTS.FLEET_START_X + c * CONSTANTS.ENEMY_SPACING_X;
        const y = CONSTANTS.FLEET_START_Y + r * CONSTANTS.ENEMY_SPACING_Y;
        this.enemies.push(new Enemy(type, r, c, x, y, points));
      }
    }
  }

  getAliveEnemies() {
    return this.enemies.filter(e => e.alive);
  }

  getCurrentStepInterval() {
    const aliveCount = this.getAliveEnemies().length;
    if (aliveCount === 0) return CONSTANTS.FLEET_MIN_INTERVAL;

    // Slight speed boost per cleared level
    const levelFactor = Math.max(0.7, 1 - (this.level - 1) * 0.08);
    const ratio = aliveCount / this.totalEnemies;
    const base = CONSTANTS.FLEET_MIN_INTERVAL +
      (CONSTANTS.FLEET_BASE_INTERVAL - CONSTANTS.FLEET_MIN_INTERVAL) * Math.pow(ratio, 0.7);

    return base * levelFactor;
  }

  update(dt, enemyBullets, playerY) {
    const aliveEnemies = this.getAliveEnemies();
    if (aliveEnemies.length === 0) return { cleared: true, invaded: false };

    // --- Stepped Fleet Movement ---
    this.stepTimer += dt;
    const interval = this.getCurrentStepInterval();

    if (this.stepTimer >= interval) {
      this.stepTimer = 0;
      this.stepIndex++;

      // Check if edge reached
      let reachedEdge = false;
      const margin = CONSTANTS.PLAYER_MARGIN_X;

      for (const enemy of aliveEnemies) {
        const nextX = enemy.x + this.direction * CONSTANTS.FLEET_STEP_X;
        if (nextX < margin || nextX + enemy.width > CONSTANTS.CANVAS_WIDTH - margin) {
          reachedEdge = true;
          break;
        }
      }

      if (reachedEdge) {
        // Step down & reverse direction
        this.direction *= -1;
        for (const enemy of aliveEnemies) {
          enemy.y += CONSTANTS.FLEET_STEP_Y;
        }
      } else {
        // Step horizontally
        for (const enemy of aliveEnemies) {
          enemy.x += this.direction * CONSTANTS.FLEET_STEP_X;
        }
      }

      // Alternate walk frames
      for (const enemy of aliveEnemies) {
        enemy.frame = (enemy.frame + 1) % 2;
      }

      // Rhythmic marching sound
      audio.playFleetStep(this.stepIndex);
    }

    // Check if enemies reached the player level (Invasion Loss)
    for (const enemy of aliveEnemies) {
      if (enemy.y + enemy.height >= playerY) {
        return { cleared: false, invaded: true };
      }
    }

    // --- Random Projectile Drops ---
    this.dropTimer -= dt;
    if (this.dropTimer <= 0) {
      this.resetDropTimer(aliveEnemies.length);
      this.dropProjectile(aliveEnemies, enemyBullets);
    }

    return { cleared: false, invaded: false };
  }

  resetDropTimer(aliveCount) {
    // Projectiles drop more frequently as fewer enemies remain
    const ratio = Math.max(0.2, aliveCount / this.totalEnemies);
    const minT = CONSTANTS.ENEMY_DROP_MIN_INTERVAL * ratio;
    const maxT = CONSTANTS.ENEMY_DROP_MAX_INTERVAL * ratio;
    this.dropTimer = minT + Math.random() * (maxT - minT);
  }

  dropProjectile(aliveEnemies, enemyBullets) {
    if (enemyBullets.length >= CONSTANTS.MAX_ENEMY_BULLETS || aliveEnemies.length === 0) return;

    // Pick random column's lowest active enemy
    const cols = {};
    for (const e of aliveEnemies) {
      if (!cols[e.col] || cols[e.col].y < e.y) {
        cols[e.col] = e;
      }
    }
    const lowestEnemies = Object.values(cols);
    if (lowestEnemies.length === 0) return;

    const shooter = lowestEnemies[Math.floor(Math.random() * lowestEnemies.length)];
    const spawnX = shooter.x + (shooter.width - CONSTANTS.ENEMY_BULLET_WIDTH) / 2;
    const spawnY = shooter.y + shooter.height;

    enemyBullets.push(new EnemyBullet(spawnX, spawnY));
  }

  render(ctx) {
    for (const enemy of this.enemies) {
      enemy.render(ctx);
    }
  }
}

// ----------------------------------------------------------------------------
// Enemy Projectile (Bone / Spiny Projectile)
// ----------------------------------------------------------------------------
export class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = CONSTANTS.ENEMY_BULLET_WIDTH;
    this.height = CONSTANTS.ENEMY_BULLET_HEIGHT;
    this.speed = CONSTANTS.ENEMY_BULLET_SPEED;
    this.frame = 0;
    this.animTimer = 0;
    this.markedForDeletion = false;
  }

  update(dt) {
    this.y += this.speed * dt;

    this.animTimer += dt;
    if (this.animTimer > 0.1) {
      this.animTimer = 0;
      this.frame = (this.frame + 1) % 2;
    }

    if (this.y > CONSTANTS.CANVAS_HEIGHT + 10) {
      this.markedForDeletion = true;
    }
  }

  render(ctx) {
    const sprite = SPRITES.enemyBullet[this.frame];
    ctx.drawImage(sprite, Math.round(this.x), Math.round(this.y));
  }
}

// ----------------------------------------------------------------------------
// Particle (Coin-like sparkles)
// ----------------------------------------------------------------------------
export class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 110;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 40;
    this.life = 0.6 + Math.random() * 0.3;
    this.maxLife = this.life;
    this.markedForDeletion = false;
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) {
      this.markedForDeletion = true;
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += CONSTANTS.PARTICLE_GRAVITY * dt;
  }

  render(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.drawImage(SPRITES.sparkle, Math.round(this.x), Math.round(this.y));
    ctx.restore();
  }
}

// ----------------------------------------------------------------------------
// Floating Score Indicator (+10, +20, +30)
// ----------------------------------------------------------------------------
export class ScorePopup {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.life = 0.7;
    this.maxLife = 0.7;
    this.markedForDeletion = false;
  }

  update(dt) {
    this.life -= dt;
    this.y -= 25 * dt;
    if (this.life <= 0) {
      this.markedForDeletion = true;
    }
  }

  render(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#facc15';
    ctx.fillText(this.text, Math.round(this.x), Math.round(this.y));
    ctx.restore();
  }
}

// ----------------------------------------------------------------------------
// Collision Detection Helper (AABB)
// ----------------------------------------------------------------------------
export function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
