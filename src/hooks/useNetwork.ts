import { useEffect, useCallback, useRef } from 'react';
import { networkManager, type GameMessage } from '../network/NetworkManager';
import { useNetworkStore } from '../stores/useNetworkStore';
import { useGameStore } from '../stores/useGameStore';
import { useChatStore } from '../stores/useChatStore';

export function useNetwork() {
  const setConnectionStatus = useNetworkStore((s) => s.setConnectionStatus);
  const setGameId = useNetworkStore((s) => s.setGameId);
  const connectionStatus = useNetworkStore((s) => s.connectionStatus);
  const gameId = useNetworkStore((s) => s.gameId);
  const resetNetwork = useNetworkStore((s) => s.resetNetwork);

  const handlerRef = useRef<((msg: GameMessage) => void) | null>(null);

  // Register network message handler
  useEffect(() => {
    const handler = (msg: GameMessage) => {
      switch (msg.type) {
        case 'move': {
          const { from, to, promotion } = msg.data;
          useGameStore.getState().applyRemoteMove(from, to, promotion);
          break;
        }
        case 'chat': {
          const { sender, text } = msg.data;
          useChatStore.getState().addMessage(sender, text);
          break;
        }
        case 'ready': {
          useGameStore.getState().setGamePhase('playing');
          break;
        }
      }
    };

    handlerRef.current = handler;
    networkManager.onMessage(handler);

    networkManager.onConnectionChange = (connected) => {
      setConnectionStatus(connected ? 'connected' : 'disconnected');
      if (!connected) {
        // Opponent disconnected during game
        console.log('[Network] Connection lost');
      }
    };

    networkManager.onPlayerJoined = () => {
      setConnectionStatus('connected');
      // Host: start the game when opponent joins
      if (networkManager.isHost) {
        networkManager.send({ type: 'ready', data: { color: 'b' } });
        useGameStore.getState().setGamePhase('playing');
      }
    };

    return () => {
      if (handlerRef.current) {
        networkManager.offMessage(handlerRef.current);
      }
    };
  }, [setConnectionStatus]);

  const createGame = useCallback(async () => {
    setConnectionStatus('connecting');
    try {
      const id = await networkManager.createGame();
      setGameId(id);
      useGameStore.getState().setPlayerColor('w');
      useGameStore.getState().setIsOnline(true);
      useGameStore.getState().setGamePhase('waiting');
      return id;
    } catch (err) {
      setConnectionStatus('disconnected');
      throw err;
    }
  }, [setConnectionStatus, setGameId]);

  const joinGame = useCallback(async (id: string) => {
    setConnectionStatus('connecting');
    try {
      await networkManager.joinGame(id);
      setGameId(id);
      setConnectionStatus('connected');
      useGameStore.getState().setPlayerColor('b');
      useGameStore.getState().setIsOnline(true);
      useGameStore.getState().setGamePhase('playing');
    } catch (err) {
      setConnectionStatus('disconnected');
      throw err;
    }
  }, [setConnectionStatus, setGameId]);

  const startLocalGame = useCallback(() => {
    useGameStore.getState().setIsOnline(false);
    useGameStore.getState().setGamePhase('playing');
  }, []);

  const disconnect = useCallback(() => {
    networkManager.disconnect();
    resetNetwork();
  }, [resetNetwork]);

  return {
    createGame,
    joinGame,
    startLocalGame,
    disconnect,
    connectionStatus,
    gameId,
  };
}
