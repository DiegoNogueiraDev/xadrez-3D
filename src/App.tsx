import { useEffect } from 'react';
import ChessScene from './components/ChessScene';
import Lobby from './components/Lobby';
import SettingsPanel from './components/SettingsPanel';
import GameHUD from './components/GameHUD';
import MoveHistory from './components/MoveHistory';
import CapturedPieces from './components/CapturedPieces';
import { useGameStore } from './stores/useGameStore';
import { soundManager } from './lib/sounds';
import { useAudioResume } from './hooks/useAudioResume';
import { useAudioSync } from './hooks/useAudioSync';

export default function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const setGamePhase = useGameStore((s) => s.setGamePhase);

  useEffect(() => {
    soundManager.init();
  }, []);

  useAudioResume();
  useAudioSync();

  const handleCreateGame = () => {
    setGamePhase('playing');
  };

  const handleJoinGame = (_gameId: string) => {
    setGamePhase('playing');
  };

  return (
    <div data-testid="chess-app" className="relative min-h-screen bg-[#0A0A0F] text-white">
      <h1 className="absolute top-0 left-0 right-0 text-2xl font-bold text-center py-4 z-20 pointer-events-none font-serif tracking-wider text-amber-100/80">
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
          <GameHUD />
          <div className="absolute top-16 right-4 z-10 pointer-events-auto">
            <SettingsPanel />
          </div>
          <div className="absolute bottom-4 right-4 z-10 pointer-events-auto">
            <MoveHistory />
          </div>
          <div className="absolute bottom-4 left-4 z-10 pointer-events-auto">
            <CapturedPieces />
          </div>
        </>
      )}
    </div>
  );
}
