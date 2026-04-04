import type { PieceSymbol, Color } from 'chess.js';

export const PROMOTION_OPTIONS: { symbol: PieceSymbol; label: string }[] = [
  { symbol: 'q', label: 'Rainha' },
  { symbol: 'r', label: 'Torre' },
  { symbol: 'b', label: 'Bispo' },
  { symbol: 'n', label: 'Cavalo' },
];

interface PromotionDialogProps {
  onSelect: (piece: PieceSymbol) => void;
  playerColor: Color;
}

export default function PromotionDialog({ onSelect, playerColor }: PromotionDialogProps) {
  return (
    <div
      data-testid="promotion-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">
          Promover para:
        </h3>
        <div className="flex gap-3">
          {PROMOTION_OPTIONS.map((option) => (
            <button
              key={option.symbol}
              data-testid={`promote-${option.symbol}`}
              onClick={() => onSelect(option.symbol)}
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 border border-neutral-500 transition-colors cursor-pointer"
            >
              <span className="text-2xl">
                {playerColor === 'w' ? '♔' : '♚'}
              </span>
              <span className="text-sm text-neutral-200">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
