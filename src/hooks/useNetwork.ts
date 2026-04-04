import { useEffect, useCallback, useRef } from 'react';
import { networkManager, type GameMessage } from '../network/NetworkManager';
import { useNetworkStore } from '../stores/useNetworkStore';
import { useGameStore } from '../stores/useGameStore';
import { useChatStore } from '../stores/useChatStore';
import { useReactionStore } from '../stores/useReactionStore';

export function useNetwork() {
  const setConnectionStatus = useNetworkStore((s) => s.setConnectionStatus);
  const setGameId = useNetworkStore((s) => s.setGameId);
  const setSpectatorCount = useNetworkStore((s) => s.setSpectatorCount);
  const setOpponentCountry = useNetworkStore((s) => s.setOpponentCountry);
  const connectionStatus = useNetworkStore((s) => s.connectionStatus);
  const gameId = useNetworkStore((s) => s.gameId);
  const playerCountry = useNetworkStore((s) => s.playerCountry);
  const resetNetwork = useNetworkStore((s) => s.resetNetwork);

  const handlerRef = useRef<((msg: GameMessage) => void) | null>(null);

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
          if (msg.data?.country) {
            useNetworkStore.getState().setOpponentCountry(msg.data.country);
          }
          useGameStore.getState().setGamePhase('playing');
          break;
        }
        case 'player-info': {
          if (msg.data?.country) {
            useNetworkStore.getState().setOpponentCountry(msg.data.country);
          }
          break;
        }
        case 'spectator-count': {
          useNetworkStore.getState().setSpectatorCount(msg.data.count);
          break;
        }
        case 'reaction': {
          const { emoji, sender } = msg.data;
          useReactionStore.getState().addReaction(emoji, sender);
          break;
        }
      }
    };

    handlerRef.current = handler;
    networkManager.onMessage(handler);

    networkManager.onConnectionChange = (connected) => {
      setConnectionStatus(connected ? 'connected' : 'disconnected');
    };

    networkManager.onPlayerJoined = () => {
      setConnectionStatus('connected');
      if (networkManager.isHost) {
        const country = useNetworkStore.getState().playerCountry;
        networkManager.send({ type: 'ready', data: { color: 'b', country } });
        useGameStore.getState().setGamePhase('playing');
      }
    };

    networkManager.onSpectatorCountChange = (count) => {
      setSpectatorCount(count);
    };

    return () => {
      if (handlerRef.current) {
        networkManager.offMessage(handlerRef.current);
      }
    };
  }, [setConnectionStatus, setSpectatorCount, setOpponentCountry]);

  const createGame = useCallback(async () => {
    setConnectionStatus('connecting');
    try {
      const id = await networkManager.createGame();
      setGameId(id);
      useGameStore.getState().setPlayerColor('w');
      useGameStore.getState().setIsOnline(true);
      useGameStore.getState().setPlayerRole('player');
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
      useGameStore.getState().setPlayerRole('player');
      useGameStore.getState().setGamePhase('playing');
      // Send country info to host
      const country = useNetworkStore.getState().playerCountry;
      if (country) {
        networkManager.send({ type: 'player-info', data: { country } });
      }
    } catch (err) {
      setConnectionStatus('disconnected');
      throw err;
    }
  }, [setConnectionStatus, setGameId]);

  const spectateGame = useCallback(async (id: string) => {
    setConnectionStatus('connecting');
    try {
      await networkManager.joinAsSpectator(id);
      setGameId(id);
      setConnectionStatus('connected');
      useGameStore.getState().setIsOnline(true);
      useGameStore.getState().setPlayerRole('spectator');
      useGameStore.getState().setGamePhase('playing');
    } catch (err) {
      setConnectionStatus('disconnected');
      throw err;
    }
  }, [setConnectionStatus, setGameId]);

  const startLocalGame = useCallback(() => {
    useGameStore.getState().setIsOnline(false);
    useGameStore.getState().setPlayerRole('player');
    useGameStore.getState().setGamePhase('playing');
  }, []);

  const disconnect = useCallback(() => {
    networkManager.disconnect();
    resetNetwork();
  }, [resetNetwork]);

  return {
    createGame,
    joinGame,
    spectateGame,
    startLocalGame,
    disconnect,
    connectionStatus,
    gameId,
    playerCountry,
  };
}
