import ChessScene from './components/ChessScene';

export default function App() {
  return (
    <div data-testid="chess-app" className="relative min-h-screen bg-neutral-900 text-white">
      {/* 3D Canvas (ADR-006: Canvas and UI as DOM siblings) */}
      <div className="absolute inset-0">
        <ChessScene />
      </div>
      {/* UI Overlay */}
      <div className="relative z-10 pointer-events-none">
        <h1 className="text-2xl font-bold text-center py-4 pointer-events-auto">Xadrez 3D</h1>
      </div>
    </div>
  );
}
