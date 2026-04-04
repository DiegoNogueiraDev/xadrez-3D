import { useGameStore } from '../stores/useGameStore';
import { formatMovePairs } from '../lib/formatMovePairs';

export default function MoveHistory() {
  const moveHistory = useGameStore((s) => s.moveHistory);
  const pairs = formatMovePairs(moveHistory);

  return (
    <div
      data-testid="move-history"
      className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 w-64 max-h-80 overflow-y-auto"
    >
      <h3 className="text-sm font-semibold text-neutral-400 mb-2">Jogadas</h3>

      {pairs.length === 0 ? (
        <p className="text-sm text-neutral-500">Sem jogadas</p>
      ) : (
        <div className="space-y-1">
          {pairs.map((pair) => (
            <div
              key={pair.number}
              data-testid={`move-row-${pair.number}`}
              className="flex gap-2 text-sm text-white font-mono"
            >
              <span className="text-neutral-500 w-6">{pair.number}.</span>
              <span className="w-12">{pair.white}</span>
              {pair.black && <span className="w-12">{pair.black}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
