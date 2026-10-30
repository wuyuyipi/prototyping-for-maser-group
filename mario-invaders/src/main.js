// ============================================================================
// main.js - Mario Invaders: Core Game Loop & State Machine
// 16-Bit Retro Arcade Space Invaders with a Super Mario Theme
// ============================================================================

import { SPRITES } from './sprites.js';
import { audio } from './audio.js';
import { ParallaxBackground } from './background.js';
import { InputHandler } from './input.js';
import {
  CONSTANTS,
  Player,
  EnemyFleet,
  Particle,
  ScorePopup,
  checkCollision,
} from './entities.js';

// Game States
export const STATE = {
  TITLE: 'TITLE',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  WAVE_CLEAR: 'WAVE_CLEAR',
};

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.width = CONSTANTS.CANVAS_WIDTH;
    this.height = CONSTANTS.CANVAS_HEIGHT;

    // Components
    this.input = new InputHandler();
    this.background = new ParallaxBackground(this.width, this.height);

    // Game State
    this.state = STATE.TITLE;
    this.score = 0;
    this.highScore = 0;
    this.level = 1;

    // Load High Score from localStorage or memory
    try {
      const saved = localStorage.getItem('mario_invaders_hi');
      if (saved) this.highScore = parseInt(saved, 10) || 0;
    } catch {
      // Memory fallback
    }

    // Entities
    this.player = new Player();
    this.fleet = new EnemyFleet(this.level);
    this.playerBullets = [];
    this.enemyBullets = [];
    this.particles = [];
    this.scorePopups = [];

    // Wave transition timer
    this.waveClearTimer = 0;

    // Delta time management
    this.lastTime = performance.now();
    this.blinkTimer = 0;

    // Bind loop
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  startNewGame() {
    this.score = 0;
    this.level = 1;
    this.player.reset();
    this.playerBullets = [];
    this.enemyBullets = [];
    this.particles = [];
    this.scorePopups = [];
    this.fleet = new EnemyFleet(this.level);
    this.state = STATE.PLAYING;
    audio.init();
  }

  startNextLevel() {
    this.level += 1;
    this.playerBullets = [];
    this.enemyBullets = [];
    this.fleet = new EnemyFleet(this.level);
    this.state = STATE.PLAYING;
  }

  triggerExplosion(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y));
    }
  }

  // --------------------------------------------------------------------------
  // Update Loop (delta time)
  // --------------------------------------------------------------------------
  update(dt) {
    // Parallax background always scrolls to give flying sensation
    this.background.update(dt);

    // Audio mute toggle
    if (this.input.consumeMute()) {
      audio.toggleMute();
    }

    // State Machine
    switch (this.state) {
      case STATE.TITLE:
        if (this.input.consumeStart()) {
          this.startNewGame();
        }
        break;

      case STATE.PAUSED:
        if (this.input.consumePause()) {
          this.state = STATE.PLAYING;
        }
        break;

      case STATE.GAME_OVER:
        if (this.input.consumeStart()) {
          this.startNewGame();
        }
        break;

      case STATE.WAVE_CLEAR:
        this.waveClearTimer -= dt;
        this.updateParticles(dt);
        if (this.waveClearTimer <= 0) {
          this.startNextLevel();
        }
        break;

      case STATE.PLAYING:
        this.updatePlaying(dt);
        break;
    }

    // Clear single-frame triggers
    this.input.update();
  }

  updatePlaying(dt) {
    // Check pause request
    if (this.input.consumePause()) {
      this.state = STATE.PAUSED;
      return;
    }

    // Update Player
    this.player.update(dt, this.input, this.playerBullets);

    // Update Player Fireballs
    for (const b of this.playerBullets) {
      b.update(dt);
    }
    this.playerBullets = this.playerBullets.filter(b => !b.markedForDeletion);

    // Update Enemy Fleet
    const fleetStatus = this.fleet.update(dt, this.enemyBullets, this.player.y);

    // Check if wave cleared
    if (fleetStatus.cleared) {
      audio.playWaveClear();
      this.state = STATE.WAVE_CLEAR;
      this.waveClearTimer = 1.6;
      return;
    }

    // Check if enemies invaded player line
    if (fleetStatus.invaded) {
      this.handleGameOver();
      return;
    }

    // Update Enemy Projectiles
    for (const eb of this.enemyBullets) {
      eb.update(dt);
    }
    this.enemyBullets = this.enemyBullets.filter(eb => !eb.markedForDeletion);

    // Update Particles & Floating Popups
    this.updateParticles(dt);

    // --- Collisions ---
    this.handleCollisions();
  }

  updateParticles(dt) {
    for (const p of this.particles) {
      p.update(dt);
    }
    this.particles = this.particles.filter(p => !p.markedForDeletion);

    for (const sp of this.scorePopups) {
      sp.update(dt);
    }
    this.scorePopups = this.scorePopups.filter(sp => !sp.markedForDeletion);
  }

  handleCollisions() {
    const aliveEnemies = this.fleet.getAliveEnemies();

    // 1. Player Fireballs vs Enemies
    for (const bullet of this.playerBullets) {
      if (bullet.markedForDeletion) continue;

      for (const enemy of aliveEnemies) {
        if (!enemy.alive) continue;

        if (checkCollision(bullet, enemy)) {
          bullet.markedForDeletion = true;
          enemy.alive = false;

          // Points and coin particles
          this.score += enemy.points;
          if (this.score > this.highScore) {
            this.highScore = this.score;
            try {
              localStorage.setItem('mario_invaders_hi', String(this.highScore));
            } catch {
              // fallback
            }
          }

          audio.playEnemyDestroyed();
          this.triggerExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 14);
          this.scorePopups.push(new ScorePopup(enemy.x, enemy.y, `+${enemy.points}`));
          break;
        }
      }
    }

    // 2. Enemy Projectiles vs Player
    for (const eb of this.enemyBullets) {
      if (eb.markedForDeletion) continue;

      if (checkCollision(eb, this.player)) {
        eb.markedForDeletion = true;
        const wasHit = this.player.hit();
        if (wasHit) {
          this.triggerExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 18);
          if (this.player.lives <= 0) {
            this.handleGameOver();
            return;
          }
        }
      }
    }

    // 3. Enemies colliding directly with Player
    for (const enemy of aliveEnemies) {
      if (enemy.alive && checkCollision(enemy, this.player)) {
        this.handleGameOver();
        return;
      }
    }
  }

  handleGameOver() {
    this.state = STATE.GAME_OVER;
    audio.playGameOver();
    this.triggerExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 24);
  }

  // --------------------------------------------------------------------------
  // Render Loop
  // --------------------------------------------------------------------------
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.imageSmoothingEnabled = false;

    // 1. Parallax Background
    this.background.render(this.ctx);

    // 2. State-specific rendering
    switch (this.state) {
      case STATE.TITLE:
        this.renderTitleScreen();
        break;

      case STATE.PLAYING:
      case STATE.PAUSED:
      case STATE.WAVE_CLEAR:
      case STATE.GAME_OVER:
        this.renderGameplay();

        if (this.state === STATE.PAUSED) {
          this.renderPausedOverlay();
        } else if (this.state === STATE.WAVE_CLEAR) {
          this.renderWaveClearOverlay();
        } else if (this.state === STATE.GAME_OVER) {
          this.renderGameOverOverlay();
        }
        break;
    }

    // 3. Heads-Up Display (HUD)
    this.renderHUD();
  }

  renderGameplay() {
    // Enemy fleet
    this.fleet.render(this.ctx);

    // Bullets
    for (const b of this.playerBullets) {
      b.render(this.ctx);
    }
    for (const eb of this.enemyBullets) {
      eb.render(this.ctx);
    }

    // Player (unless game over and lives <= 0)
    if (this.player.lives > 0 || this.state !== STATE.GAME_OVER) {
      this.player.render(this.ctx);
    }

    // Particles & Popups
    for (const p of this.particles) {
      p.render(this.ctx);
    }
    for (const sp of this.scorePopups) {
      sp.render(this.ctx);
    }
  }

  // Heads-Up Display (HUD)
  renderHUD() {
    this.ctx.save();
    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowColor = '#000000';
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;

    // Score & High Score
    const scoreStr = `SCORE:${String(this.score).padStart(5, '0')}`;
    const hiStr = `HI:${String(this.highScore).padStart(5, '0')}`;
    this.ctx.fillText(scoreStr, 12, 16);
    this.ctx.fillText(hiStr, 160, 16);

    // Level
    const lvlStr = `LVL:${String(this.level).padStart(2, '0')}`;
    this.ctx.fillText(lvlStr, 290, 16);

    // Lives as mini airplane icons
    this.ctx.fillText('LIVES:', 366, 16);
    for (let i = 0; i < this.player.lives; i++) {
      this.ctx.drawImage(SPRITES.playerMini, 426 + i * 15, 8);
    }

    this.ctx.restore();
  }

  // Title Screen
  renderTitleScreen() {
    this.ctx.save();
    this.ctx.textAlign = 'center';

    // Title Logo
    this.ctx.font = '18px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#e52521';
    this.ctx.shadowColor = '#000000';
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    this.ctx.fillText('MARIO INVADERS', this.width / 2, 70);

    // Subtitle
    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#facc15';
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;
    this.ctx.fillText('RETRO 16-BIT SKY PATROL', this.width / 2, 95);

    // Showcase Mario in airplane
    this.ctx.drawImage(SPRITES.player[0], this.width / 2 - 12, 115);

    // Points Table
    const tableY = 160;
    this.ctx.textAlign = 'left';
    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#ffffff';

    // Piranha Plant
    this.ctx.drawImage(SPRITES.piranha[0], 155, tableY);
    this.ctx.fillText(`= ${CONSTANTS.POINTS_PIRANHA} PTS`, 185, tableY + 12);

    // Koopa
    this.ctx.drawImage(SPRITES.koopa[0], 155, tableY + 24);
    this.ctx.fillText(`= ${CONSTANTS.POINTS_KOOPA} PTS`, 185, tableY + 36);

    // Goomba
    this.ctx.drawImage(SPRITES.goomba[0], 155, tableY + 48);
    this.ctx.fillText(`= ${CONSTANTS.POINTS_GOOMBA} PTS`, 185, tableY + 60);

    // Pulsing prompt
    this.blinkTimer = (this.blinkTimer || 0) + 0.04;
    if (Math.sin(this.blinkTimer * 4) > -0.2) {
      this.ctx.textAlign = 'center';
      this.ctx.font = '9px "Press Start 2P", monospace';
      this.ctx.fillStyle = '#facc15';
      this.ctx.fillText('PRESS SPACE OR FIRE TO START', this.width / 2, 260);
    }

    // Controls reminder
    this.ctx.textAlign = 'center';
    this.ctx.font = '7px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#e2e8f0';
    this.ctx.fillText('ARROWS/A-D: MOVE | SPACE: FIRE | P: PAUSE', this.width / 2, 290);

    this.ctx.restore();
  }

  // Paused Overlay
  renderPausedOverlay() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.textAlign = 'center';
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#facc15';
    this.ctx.shadowColor = '#000000';
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;
    this.ctx.fillText('PAUSED', this.width / 2, this.height / 2 - 10);

    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText('PRESS P TO RESUME', this.width / 2, this.height / 2 + 18);
    this.ctx.restore();
  }

  // Wave Clear Overlay
  renderWaveClearOverlay() {
    this.ctx.save();
    this.ctx.textAlign = 'center';
    this.ctx.font = '14px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#4ade80';
    this.ctx.shadowColor = '#000000';
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;
    this.ctx.fillText('WAVE CLEARED!', this.width / 2, this.height / 2 - 12);

    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#facc15';
    this.ctx.fillText(`PREPARING LEVEL ${this.level + 1}...`, this.width / 2, this.height / 2 + 14);
    this.ctx.restore();
  }

  // Game Over Overlay
  renderGameOverOverlay() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.textAlign = 'center';
    this.ctx.font = '18px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#e52521';
    this.ctx.shadowColor = '#000000';
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    this.ctx.fillText('GAME OVER', this.width / 2, 120);

    this.ctx.font = '9px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
    this.ctx.fillText(`FINAL SCORE: ${this.score}`, this.width / 2, 160);
    this.ctx.fillText(`HI-SCORE: ${this.highScore}`, this.width / 2, 185);

    this.blinkTimer = (this.blinkTimer || 0) + 0.04;
    if (Math.sin(this.blinkTimer * 4) > -0.2) {
      this.ctx.font = '8px "Press Start 2P", monospace';
      this.ctx.fillStyle = '#facc15';
      this.ctx.fillText('PRESS SPACE TO PLAY AGAIN', this.width / 2, 235);
    }
    this.ctx.restore();
  }

  // Main Loop
  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1); // clamp to avoid huge jump on tab switch
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop);
  }
}

// Boot game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
