import type { SoundId } from './sounds';

export interface SoundAsset {
  path: string;
  label: string;
  format: 'mp3' | 'ogg' | 'wav';
}

export const SOUND_MANIFEST: Partial<Record<SoundId, SoundAsset>> = {
  move: { path: '/sounds/move.mp3', label: 'Piece Move', format: 'mp3' },
  capture: { path: '/sounds/capture.mp3', label: 'Piece Capture', format: 'mp3' },
  check: { path: '/sounds/check.mp3', label: 'Check', format: 'mp3' },
  castle: { path: '/sounds/castle.mp3', label: 'Castling', format: 'mp3' },
  promote: { path: '/sounds/promote.mp3', label: 'Pawn Promotion', format: 'mp3' },
  game_start: { path: '/sounds/game_start.mp3', label: 'Game Start', format: 'mp3' },
  game_over: { path: '/sounds/game_over.mp3', label: 'Game Over', format: 'mp3' },
  piece_pickup: { path: '/sounds/piece_pickup.mp3', label: 'Piece Pickup', format: 'mp3' },
};

export function getSoundPath(soundId: SoundId): string {
  return SOUND_MANIFEST[soundId]?.path ?? '';
}

export function getSoundPaths(): string[] {
  return Object.values(SOUND_MANIFEST).filter((a): a is SoundAsset => !!a).map((asset) => asset.path);
}
