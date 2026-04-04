import { useEffect } from 'react';
import ChessScene from './components/ChessScene';
import Lobby from './components/Lobby';
import SettingsPanel from './components/SettingsPanel';
import { useGameStore } from './stores/useGameStore';
import { soundManager } from './lib/sounds';
import { useAudioResume } from './hooks/useAudioResume';

export default function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const setGamePhase = useGameStore((s) => s.setGamePhase);

  useEffect(() => {
    soundManager.init();
  }, []);

  useAudioResume();

  const handleCreateGame = () => {
    setGamePhase('playing');
  };

  const handleJoinGame = (gameId: string) => {
    setGamePhase('playing');
  };

  return (
    <div data-testid="chess-app" className="relative min-h-screen bg-neutral-900 text-white">
      <h1 className="absolute top-0 left-0 right-0 text-2xl font-bold text-center py-4 z-20 pointer-events-none">
        Xadrez 3D
      </h1>

      {gamePhase === 'lobby' && (
        <Lobby onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
      )}

      {gamePhase !== 'lobby' && (
        <>
          <div className="absolute inset-0">
            <ChessScene />
          </div>
          <div className="absolute top-16 right-4 z-10 pointer-events-auto">
            <SettingsPanel />
          </div>
        </>
      )}
    </div>
  );
}
