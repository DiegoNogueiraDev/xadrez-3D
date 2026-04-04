import { useGameStore } from '../stores/useGameStore';

function getGameStatus(isCheckmate: boolean, isStalemate: boolean, isCheck: boolean): string {
  if (isCheckmate) return 'Xeque-mate!';
  if (isStalemate) return 'Empate';
  if (isCheck) return 'Xeque!';
  return 'Jogando';
}

export default function GameHUD() {
  const turn = useGameStore((s) => s.turn);
  const playerColor = useGameStore((s) => s.playerColor);
  const isCheck = useGameStore((s) => s.isCheck);
  const isCheckmate = useGameStore((s) => s.isCheckmate);
  const isStalemate = useGameStore((s) => s.isStalemate);

  const turnLabel = turn === 'w' ? 'Brancas' : 'Pretas';
  const playerLabel = playerColor === 'w' ? 'Brancas' : 'Pretas';
  const status = getGameStatus(isCheckmate, isStalemate, isCheck);

  return (
    <div
      data-testid="game-hud"
      className="absolute top-4 left-4 flex flex-col gap-2 z-10"
    >
      <div
        data-testid="turn-indicator"
        className="bg-neutral-800/90 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white"
      >
        Turno: <span className="font-semibold">{turnLabel}</span>
      </div>

      <div
        data-testid="player-color"
        className="bg-neutral-800/90 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white"
      >
        Jogador: <span className="font-semibold">{playerLabel}</span>
      </div>

      <div
        data-testid="game-status"
        className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
          isCheckmate || isCheck
            ? 'bg-red-900/90 border border-red-700 text-red-200'
            : isStalemate
              ? 'bg-yellow-900/90 border border-yellow-700 text-yellow-200'
              : 'bg-neutral-800/90 border border-neutral-700 text-white'
        }`}
      >
        {status}
      </div>
    </div>
  );
}
