import { useState } from 'react';
import { motion } from 'framer-motion';

interface LobbyProps {
  onCreateGame: () => void;
  onJoinGame: (gameId: string) => void;
}

export default function Lobby({ onCreateGame, onJoinGame }: LobbyProps) {
  const [gameId, setGameId] = useState('');

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

        <div className="space-y-4">
          <button
            onClick={onCreateGame}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            Criar Jogo
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
            className="w-full py-3 px-4 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />

          <button
            onClick={() => onJoinGame(gameId)}
            disabled={!gameId.trim()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            Entrar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
