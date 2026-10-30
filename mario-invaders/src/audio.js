// ============================================================================
// audio.js - Web Audio API Chiptune Sound Synthesizer
// Mario Invaders - 16-Bit Retro Arcade
// All sound effects are generated via mathematical oscillators & noise nodes.
// ============================================================================

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.marchFrequencies = [110, 98, 87, 73.4]; // A2, G2, F2, D2 (Space Invaders iconic bass tones)
  }

  // Ensure AudioContext is created/resumed upon first user gesture
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Helper: Play a tone with frequency sweep and volume envelope
  playTone({ freqStart, freqEnd, type = 'square', duration = 0.1, gainStart = 0.2, gainEnd = 0.001 }) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, now);
      if (freqEnd !== undefined && freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 10), now + duration);
      }

      gain.gain.setValueAtTime(gainStart, now);
      gain.gain.exponentialRampToValueAtTime(gainEnd, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio playback fails gracefully if context blocked
    }
  }

  // Helper: Synthesize short 8-bit noise burst
  playNoise({ duration = 0.15, gainStart = 0.25 }) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(gainStart, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {
      // Silently catch audio buffer restrictions
    }
  }

  // Fireball shoot sound: high-speed pitch sweep
  playShoot() {
    this.playTone({
      freqStart: 880,
      freqEnd: 220,
      type: 'triangle',
      duration: 0.12,
      gainStart: 0.18,
    });
  }

  // Enemy destroyed: crunchy 8-bit noise + Mario coin chime
  playEnemyDestroyed() {
    this.playNoise({ duration: 0.18, gainStart: 0.25 });
    setTimeout(() => {
      this.playTone({
        freqStart: 987.77, // B5
        freqEnd: 1318.51, // E6
        type: 'sine',
        duration: 0.18,
        gainStart: 0.15,
      });
    }, 40);
  }

  // Player hit: heavy low-end impact crunch
  playPlayerHit() {
    this.playNoise({ duration: 0.35, gainStart: 0.4 });
    this.playTone({
      freqStart: 180,
      freqEnd: 40,
      type: 'sawtooth',
      duration: 0.35,
      gainStart: 0.3,
    });
  }

  // Enemy fleet step: 4-step rhythmic pulse
  playFleetStep(stepIndex = 0) {
    const freq = this.marchFrequencies[stepIndex % this.marchFrequencies.length];
    this.playTone({
      freqStart: freq,
      freqEnd: freq * 0.85,
      type: 'triangle',
      duration: 0.08,
      gainStart: 0.22,
    });
  }

  // Wave victory fanfare
  playWaveClear() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone({
          freqStart: freq,
          freqEnd: freq,
          type: 'square',
          duration: 0.15,
          gainStart: 0.2,
        });
      }, idx * 110);
    });
  }

  // Game over melody
  playGameOver() {
    const notes = [392.00, 349.23, 329.63, 261.63]; // G4, F4, E4, C4
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone({
          freqStart: freq,
          freqEnd: freq * 0.95,
          type: 'sawtooth',
          duration: 0.3,
          gainStart: 0.25,
        });
      }, idx * 220);
    });
  }
}

export const audio = new SoundSystem();
