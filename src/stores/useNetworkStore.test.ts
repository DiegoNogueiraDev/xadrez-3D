import { describe, it, expect, beforeEach } from 'vitest';
import { useNetworkStore } from './useNetworkStore';
import { generateGameId } from '../lib/networkUtils';

describe('useNetworkStore', () => {
  beforeEach(() => {
    useNetworkStore.getState().resetNetwork();
  });

  describe('initial state', () => {
    it('peerId is null', () => {
      expect(useNetworkStore.getState().peerId).toBeNull();
    });

    it('connectionStatus is disconnected', () => {
      expect(useNetworkStore.getState().connectionStatus).toBe('disconnected');
    });

    it('opponentId is null', () => {
      expect(useNetworkStore.getState().opponentId).toBeNull();
    });

    it('gameId is null', () => {
      expect(useNetworkStore.getState().gameId).toBeNull();
    });
  });

  describe('actions', () => {
    it('setPeerId updates peerId', () => {
      useNetworkStore.getState().setPeerId('peer-123');
      expect(useNetworkStore.getState().peerId).toBe('peer-123');
    });

    it('setConnectionStatus updates status', () => {
      useNetworkStore.getState().setConnectionStatus('connecting');
      expect(useNetworkStore.getState().connectionStatus).toBe('connecting');

      useNetworkStore.getState().setConnectionStatus('connected');
      expect(useNetworkStore.getState().connectionStatus).toBe('connected');
    });

    it('setOpponentId updates opponentId', () => {
      useNetworkStore.getState().setOpponentId('opponent-456');
      expect(useNetworkStore.getState().opponentId).toBe('opponent-456');
    });

    it('setGameId updates gameId', () => {
      useNetworkStore.getState().setGameId('abc123');
      expect(useNetworkStore.getState().gameId).toBe('abc123');
    });

    it('resetNetwork clears all state', () => {
      useNetworkStore.getState().setPeerId('peer-123');
      useNetworkStore.getState().setConnectionStatus('connected');
      useNetworkStore.getState().setOpponentId('opponent-456');
      useNetworkStore.getState().setGameId('abc123');

      useNetworkStore.getState().resetNetwork();

      expect(useNetworkStore.getState().peerId).toBeNull();
      expect(useNetworkStore.getState().connectionStatus).toBe('disconnected');
      expect(useNetworkStore.getState().opponentId).toBeNull();
      expect(useNetworkStore.getState().gameId).toBeNull();
    });
  });
});

describe('generateGameId', () => {
  it('returns a 6-character string', () => {
    const id = generateGameId();
    expect(id.length).toBe(6);
  });

  it('contains only alphanumeric characters', () => {
    const id = generateGameId();
    expect(id).toMatch(/^[a-z0-9]{6}$/);
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateGameId()));
    expect(ids.size).toBe(20);
  });
});
