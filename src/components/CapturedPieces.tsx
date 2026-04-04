import { useGameStore } from '../stores/useGameStore';
import { getPieceUnicode } from '../lib/pieceUnicode';
import type { Color } from 'chess.js';

function CaptureRow({ color, label }: { color: Color; label: string }) {
  const captures = useGameStore((s) => s.capturedPieces[color]);

  return (
    <div data-testid={`captures-${color === 'w' ? 'white' : 'black'}`} className="flex flex-wrap gap-1">
      <span className="text-xs text-neutral-500 w-full">{label}</span>
      {captures.map((piece, i) => (
        <span key={i} className="text-lg">
          {getPieceUnicode(piece.type, piece.color)}
        </span>
      ))}
    </div>
  );
}

export default function CapturedPieces() {
  return (
    <div
      data-testid="captured-pieces"
      className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 w-64 space-y-2"
    >
      <CaptureRow color="w" label="Brancas capturaram" />
      <CaptureRow color="b" label="Pretas capturaram" />
    </div>
  );
}
