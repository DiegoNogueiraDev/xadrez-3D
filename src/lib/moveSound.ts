import type { SoundId } from './sounds';

interface MoveInfo {
  captured?: string;
  san: string;
  flags: string;
}

export function getMoveSound(move: MoveInfo, isCheck: boolean): SoundId {
  // Check overrides everything
  if (isCheck) return 'check';

  // Promotion (flags contain 'p')
  if (move.flags.includes('p')) return 'promote';

  // Castling (flags contain 'k' for kingside or 'q' for queenside)
  if (move.flags.includes('k') || move.flags.includes('q')) return 'castle';

  // Capture
  if (move.captured) return 'capture';

  // Normal move
  return 'move';
}
