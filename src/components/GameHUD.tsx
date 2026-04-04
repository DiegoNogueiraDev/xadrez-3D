import { useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { useNetworkStore } from '../stores/useNetworkStore';
import { getCountryByCode } from '../lib/countries';

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
  const isOnline = useGameStore((s) => s.isOnline);
  const playerRole = useGameStore((s) => s.playerRole);

  const connectionStatus = useNetworkStore((s) => s.connectionStatus);
  const gameId = useNetworkStore((s) => s.gameId);
  const spectatorCount = useNetworkStore((s) => s.spectatorCount);
  const playerCountry = useNetworkStore((s) => s.playerCountry);
  const opponentCountry = useNetworkStore((s) => s.opponentCountry);

  const [copied, setCopied] = useState(false);

  const turnLabel = turn === 'w' ? 'Brancas' : 'Pretas';
  const playerLabel = playerColor === 'w' ? 'Brancas' : 'Pretas';
  const status = getGameStatus(isCheckmate, isStalemate, isCheck);

  const whiteCountry = playerColor === 'w' ? playerCountry : opponentCountry;
  const blackCountry = playerColor === 'b' ? playerCountry : opponentCountry;
  const whiteFlag = whiteCountry ? getCountryByCode(whiteCountry)?.flag : null;
  const blackFlag = blackCountry ? getCountryByCode(blackCountry)?.flag : null;

  const handleCopyId = () => {
    if (gameId) {
      navigator.clipboard.writeText(gameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

      {isOnline && (whiteFlag || blackFlag) && (
        <div className="bg-neutral-800/90 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white flex items-center gap-3">
          <span>{whiteFlag || '\u2659'} Brancas</span>
          <span className="text-neutral-500">vs</span>
          <span>{blackFlag || '\u265F'} Pretas</span>
        </div>
      )}

      <div
        data-testid="player-color"
        className="bg-neutral-800/90 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white"
      >
        {playerRole === 'spectator' ? (
          <span className="font-semibold text-amber-300">Modo Espectador</span>
        ) : (
          <>Jogador: <span className="font-semibold">{playerLabel}</span></>
        )}
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

      {isOnline && (
        <>
          <div className="bg-neutral-800/90 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-400'
                  : connectionStatus === 'connecting'
                    ? 'bg-yellow-400 animate-pulse'
                    : 'bg-red-400'
              }`}
            />
            <span>
              {connectionStatus === 'connected'
                ? 'Conectado'
                : connectionStatus === 'connecting'
                  ? 'Conectando...'
                  : 'Desconectado'}
            </span>
          </div>

          {spectatorCount > 0 && (
            <div className="bg-neutral-800/90 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-neutral-300 flex items-center gap-1.5">
              <span className="text-base leading-none">{'\uD83D\uDC41'}</span>
              <span>{spectatorCount} assistindo</span>
            </div>
          )}

          {gameId && (
            <button
              onClick={handleCopyId}
              className="bg-neutral-800/90 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-neutral-400 hover:text-white transition-colors text-left"
            >
              ID: <span className="font-mono text-white">{gameId}</span>
              <span className="ml-2 text-xs">
                {copied ? '(copiado!)' : '(copiar)'}
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
