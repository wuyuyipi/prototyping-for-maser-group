// ============================================================================
// input.js - Dual Keyboard & Responsive Touch Controller
// Mario Invaders - 16-Bit Retro Arcade
// Handles continuous movement and discrete single-press actions.
// ============================================================================

export class InputHandler {
  constructor() {
    this.keys = new Set();
    this.justPressedKeys = new Set();

    // Virtual touch control state
    this.touchLeft = false;
    this.touchRight = false;
    this.touchFire = false;
    this.touchPause = false;
    this.touchJustFired = false;

    this.setupKeyboard();
    this.setupTouchButtons();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Prevent browser scroll on space/arrows
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (!this.keys.has(e.code)) {
        this.justPressedKeys.add(e.code);
      }
      this.keys.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    // Handle losing window focus
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.justPressedKeys.clear();
      this.touchLeft = false;
      this.touchRight = false;
      this.touchFire = false;
    });
  }

  setupTouchButtons() {
    const bindBtn = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;

      const handleStart = (e) => {
        e.preventDefault();
        onDown();
      };
      const handleEnd = (e) => {
        e.preventDefault();
        onUp();
      };

      el.addEventListener('touchstart', handleStart, { passive: false });
      el.addEventListener('touchend', handleEnd, { passive: false });
      el.addEventListener('touchcancel', handleEnd, { passive: false });
      el.addEventListener('mousedown', handleStart);
      el.addEventListener('mouseup', handleEnd);
      el.addEventListener('mouseleave', handleEnd);
    };

    bindBtn('btnLeft', () => { this.touchLeft = true; }, () => { this.touchLeft = false; });
    bindBtn('btnRight', () => { this.touchRight = true; }, () => { this.touchRight = false; });
    bindBtn('btnFire', () => {
      this.touchFire = true;
      this.touchJustFired = true;
    }, () => {
      this.touchFire = false;
    });
    bindBtn('btnPause', () => { this.touchPause = true; }, () => {});
  }

  // Continuous movement
  isLeft() {
    return this.keys.has('ArrowLeft') || this.keys.has('KeyA') || this.touchLeft;
  }

  isRight() {
    return this.keys.has('ArrowRight') || this.keys.has('KeyD') || this.touchRight;
  }

  isFireHeld() {
    return this.keys.has('Space') || this.touchFire;
  }

  // Single-frame action triggers
  consumeFire() {
    if (this.justPressedKeys.has('Space') || this.touchJustFired) {
      this.justPressedKeys.delete('Space');
      this.touchJustFired = false;
      return true;
    }
    return false;
  }

  consumePause() {
    if (this.justPressedKeys.has('KeyP') || this.touchPause) {
      this.justPressedKeys.delete('KeyP');
      this.touchPause = false;
      return true;
    }
    return false;
  }

  consumeMute() {
    if (this.justPressedKeys.has('KeyM')) {
      this.justPressedKeys.delete('KeyM');
      return true;
    }
    return false;
  }

  consumeStart() {
    const pressed = this.justPressedKeys.has('Space') ||
                    this.justPressedKeys.has('Enter') ||
                    this.touchJustFired;
    if (pressed) {
      this.justPressedKeys.delete('Space');
      this.justPressedKeys.delete('Enter');
      this.touchJustFired = false;
      return true;
    }
    return false;
  }

  // Call at end of each frame to clear transient presses
  update() {
    this.justPressedKeys.clear();
    this.touchJustFired = false;
    this.touchPause = false;
  }
}
