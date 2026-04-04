interface LoadingScreenProps {
  progress: number;
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      data-testid="loading-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900"
    >
      <p data-testid="loading-text" className="mb-4 text-lg text-white">
        Carregando...
      </p>

      <div className="w-64 h-2 bg-neutral-700 rounded-full overflow-hidden">
        <div
          data-testid="progress-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={clampedProgress}
          className="h-full bg-amber-500 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-neutral-400">{clampedProgress}%</p>
    </div>
  );
}
