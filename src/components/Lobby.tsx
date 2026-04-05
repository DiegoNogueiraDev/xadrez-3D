import { useState } from 'react';
import { motion } from 'framer-motion';
import { COUNTRIES } from '../lib/countries';
import { useNetworkStore } from '../stores/useNetworkStore';

interface LobbyProps {
  onCreateGame: () => Promise<string>;
  onJoinGame: (gameId: string) => Promise<void>;
  onSpectateGame: (gameId: string) => Promise<void>;
  onLocalGame: () => void;
  createdGameId: string | null;
  connectionStatus: string;
}

export default function Lobby({
  onCreateGame,
  onJoinGame,
  onSpectateGame,
  onLocalGame,
  createdGameId,
  connectionStatus,
}: LobbyProps) {
  const [gameId, setGameId] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isSpectating, setIsSpectating] = useState(false);
  const [copied, setCopied] = useState(false);

  const playerCountry = useNetworkStore((s) => s.playerCountry);
  const setPlayerCountry = useNetworkStore((s) => s.setPlayerCountry);

  const handleCreate = async () => {
    setError('');
    setIsCreating(true);
    try {
      await onCreateGame();
    } catch {
      setError('Erro ao criar jogo. Tente novamente.');
      setIsCreating(false);
    }
  };

  const handleJoin = async () => {
    if (!gameId.trim()) return;
    setError('');
    setIsJoining(true);
    try {
      await onJoinGame(gameId.trim());
    } catch {
      setError('Erro ao conectar. Verifique o ID e tente novamente.');
      setIsJoining(false);
    }
  };

  const handleSpectate = async () => {
    if (!gameId.trim()) return;
    setError('');
    setIsSpectating(true);
    try {
      await onSpectateGame(gameId.trim());
    } catch {
      setError('Erro ao conectar como espectador.');
      setIsSpectating(false);
    }
  };

  const handleCopy = () => {
    if (createdGameId) {
      navigator.clipboard.writeText(createdGameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isWaiting = createdGameId && connectionStatus !== 'connected';

  return (
    <div
      data-testid="lobby-dialog"
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 shadow-2xl w-full max-w-md mx-4"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Xadrez 3D
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {isWaiting ? (
          <div className="space-y-4 text-center">
            <div className="text-neutral-300 text-sm">
              Aguardando oponente...
            </div>

            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-600 rounded-lg p-3">
              <span className="flex-1 font-mono text-lg text-white tracking-wider text-center">
                {createdGameId}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-sm text-white rounded transition-colors"
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>

            <div className="text-neutral-500 text-xs">
              Compartilhe este ID com seu oponente
            </div>

            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Country selector */}
            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Seu país
              </label>
              <select
                value={playerCountry || ''}
                onChange={(e) => setPlayerCountry(e.target.value || null)}
                className="w-full py-2.5 px-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">Selecione...</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-wait text-white font-semibold rounded-lg transition-colors"
            >
              {isCreating ? 'Criando...' : 'Criar Jogo Online'}
            </button>

            <div className="flex items-center gap-2 text-neutral-400">
              <div className="flex-1 h-px bg-neutral-600" />
              <span className="text-sm">ou</span>
              <div className="flex-1 h-px bg-neutral-600" />
            </div>

            <input
              type="text"
              placeholder="Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              className="w-full py-3 px-4 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />

            <div className="flex gap-2">
              <button
                onClick={handleJoin}
                disabled={!gameId.trim() || isJoining}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {isJoining ? 'Conectando...' : 'Entrar'}
              </button>
              <button
                onClick={handleSpectate}
                disabled={!gameId.trim() || isSpectating}
                className="flex-1 py-3 px-4 bg-amber-700 hover:bg-amber-600 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {isSpectating ? 'Conectando...' : 'Assistir'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-neutral-400">
              <div className="flex-1 h-px bg-neutral-600" />
              <span className="text-sm">ou</span>
              <div className="flex-1 h-px bg-neutral-600" />
            </div>

            <button
              onClick={onLocalGame}
              className="w-full py-3 px-4 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition-colors"
            >
              Jogar Local
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
