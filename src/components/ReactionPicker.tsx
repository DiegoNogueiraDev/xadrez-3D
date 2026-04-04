import { useReactionStore } from '../stores/useReactionStore';
import { useGameStore } from '../stores/useGameStore';
import { networkManager } from '../network/NetworkManager';

const REACTIONS = ['👏', '😮', '😂', '🔥', '👎', '💀'];

export default function ReactionPicker() {
  const addReaction = useReactionStore((s) => s.addReaction);
  const playerColor = useGameStore((s) => s.playerColor);
  const playerRole = useGameStore((s) => s.playerRole);
  const isOnline = useGameStore((s) => s.isOnline);

  const sender = playerRole === 'spectator' ? 'spectator' : playerColor;

  const handleReaction = (emoji: string) => {
    addReaction(emoji, sender);

    if (isOnline) {
      networkManager.send({
        type: 'reaction',
        data: { emoji, sender },
      });
    }
  };

  return (
    <div className="flex items-center gap-1">
      {REACTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-neutral-800 border border-neutral-700 hover:bg-neutral-600 hover:scale-110 transition-all text-base cursor-pointer"
          title={`Reagir com ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
