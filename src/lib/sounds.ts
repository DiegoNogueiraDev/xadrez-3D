import { Howl, Howler } from 'howler';

export type SoundId =
  | 'move'
  | 'capture'
  | 'check'
  | 'castle'
  | 'promote'
  | 'ambient'
  | 'game_start'
  | 'game_over'
  | 'piece_pickup';

const SOUND_PATHS: Record<SoundId, string> = {
  move: '/sounds/move.mp3',
  capture: '/sounds/capture.mp3',
  check: '/sounds/check.mp3',
  castle: '/sounds/castle.mp3',
  promote: '/sounds/promote.mp3',
  ambient: '/sounds/ambient.mp3',
  game_start: '/sounds/game_start.mp3',
  game_over: '/sounds/game_over.mp3',
  piece_pickup: '/sounds/piece_pickup.mp3',
};

export interface PlayOptions {
  volume?: number;
  rate?: number;
}

export class SoundManager {
  private sounds: Map<SoundId, Howl> = new Map();
  private _muted = false;

  init(): void {
    for (const [id, path] of Object.entries(SOUND_PATHS)) {
      const howl = new Howl({
        src: [path],
        preload: true,
        loop: id === 'ambient',
      });
      this.sounds.set(id as SoundId, howl);
    }
  }

  play(soundId: SoundId, options?: PlayOptions): void {
    const howl = this.sounds.get(soundId);
    if (!howl) return;

    if (options?.volume !== undefined) {
      howl.volume(options.volume);
    }
    if (options?.rate !== undefined) {
      howl.rate(options.rate);
    }

    howl.play();
  }

  setMasterVolume(v: number): void {
    const clamped = Math.max(0, Math.min(1, v));
    Howler.volume(clamped);
  }

  mute(): void {
    this._muted = true;
    Howler.mute(true);
  }

  unmute(): void {
    this._muted = false;
    Howler.mute(false);
  }

  isMuted(): boolean {
    return this._muted;
  }

  playAmbient(): void {
    this.play('ambient');
  }

  stopAmbient(): void {
    const howl = this.sounds.get('ambient');
    if (howl) {
      howl.stop();
    }
  }
}

export const soundManager = new SoundManager();
