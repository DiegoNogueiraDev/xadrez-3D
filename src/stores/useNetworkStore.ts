import { create } from 'zustand';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface NetworkState {
  peerId: string | null;
  connectionStatus: ConnectionStatus;
  opponentId: string | null;
  gameId: string | null;
  spectatorCount: number;
  playerCountry: string | null;
  opponentCountry: string | null;

  setPeerId: (id: string | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setOpponentId: (id: string | null) => void;
  setGameId: (id: string | null) => void;
  setSpectatorCount: (n: number) => void;
  setPlayerCountry: (code: string | null) => void;
  setOpponentCountry: (code: string | null) => void;
  resetNetwork: () => void;
}

const initialState = {
  peerId: null as string | null,
  connectionStatus: 'disconnected' as ConnectionStatus,
  opponentId: null as string | null,
  gameId: null as string | null,
  spectatorCount: 0,
  playerCountry: null as string | null,
  opponentCountry: null as string | null,
};

export const useNetworkStore = create<NetworkState>((set) => ({
  ...initialState,

  setPeerId: (id) => set({ peerId: id }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setOpponentId: (id) => set({ opponentId: id }),
  setGameId: (id) => set({ gameId: id }),
  setSpectatorCount: (n) => set({ spectatorCount: n }),
  setPlayerCountry: (code) => set({ playerCountry: code }),
  setOpponentCountry: (code) => set({ opponentCountry: code }),
  resetNetwork: () => set(initialState),
}));
