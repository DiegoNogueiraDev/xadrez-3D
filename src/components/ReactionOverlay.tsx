import { useReactionStore } from '../stores/useReactionStore';

export default function ReactionOverlay() {
  const reactions = useReactionStore((s) => s.reactions);

  if (reactions.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {reactions.map((reaction) => (
        <span
          key={reaction.id}
          className="absolute text-4xl animate-reaction-float"
          style={{
            left: `${30 + Math.random() * 40}%`,
            bottom: '20%',
          }}
        >
          {reaction.emoji}
        </span>
      ))}
    </div>
  );
}
