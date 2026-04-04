import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../stores/useChatStore';
import { useGameStore } from '../stores/useGameStore';
import { networkManager } from '../network/NetworkManager';

export default function ChatPanel() {
  const messages = useChatStore((s) => s.messages);
  const isOpen = useChatStore((s) => s.isOpen);
  const unreadCount = useChatStore((s) => s.unreadCount);
  const toggleChat = useChatStore((s) => s.toggleChat);
  const addMessage = useChatStore((s) => s.addMessage);

  const playerColor = useGameStore((s) => s.playerColor);
  const turn = useGameStore((s) => s.turn);
  const isOnline = useGameStore((s) => s.isOnline);
  const playerRole = useGameStore((s) => s.playerRole);

  const isSpectator = playerRole === 'spectator';

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const sender = isOnline ? playerColor : turn;
    addMessage(sender, input);

    if (isOnline) {
      networkManager.send({
        type: 'chat',
        data: { sender, text: input.trim() },
      });
    }

    setInput('');
  };

  return (
    <div className="w-64">
      <button
        onClick={toggleChat}
        className="w-full flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-300 hover:bg-neutral-700 transition-colors"
      >
        <span>Chat</span>
        {unreadCount > 0 && (
          <span className="bg-emerald-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-1 bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto p-2 space-y-1">
            {messages.length === 0 && (
              <p className="text-xs text-neutral-500 text-center py-2">
                Sem mensagens
              </p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className="text-sm break-words">
                <span
                  className={
                    msg.sender === 'w'
                      ? 'font-semibold text-amber-200'
                      : 'font-semibold text-neutral-400'
                  }
                >
                  {msg.sender === 'w' ? 'Brancas' : 'Pretas'}:
                </span>
                <span className="text-white ml-1">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {!isSpectator && (
            <form
              onSubmit={handleSend}
              className="border-t border-neutral-700 p-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isOnline
                    ? 'Mensagem...'
                    : `${turn === 'w' ? 'Brancas' : 'Pretas'} diz...`
                }
                className="w-full bg-neutral-900 border border-neutral-600 rounded px-2 py-1.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </form>
          )}
        </div>
      )}
    </div>
  );
}
