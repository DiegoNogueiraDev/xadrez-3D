import Peer, { DataConnection } from 'peerjs';
import { generateGameId } from '../utils/helpers';
import { PieceColor } from '../utils/constants';

type MessageHandler = (msg: GameMessage) => void;

export interface GameMessage {
  type: 'move' | 'resign' | 'offer-draw' | 'accept-draw' | 'sync' | 'ready' | 'chat' | 'player-info' | 'spectator-count' | 'reaction';
  data?: any;
}

const PEER_PREFIX = 'xadrez3d-';

export class NetworkManager {
  private peer: Peer | null = null;
  private playerConnection: DataConnection | null = null;
  private spectatorConnections: DataConnection[] = [];
  private messageHandlers: MessageHandler[] = [];

  gameId: string = '';
  isHost: boolean = false;
  isSpectator: boolean = false;
  playerColor: PieceColor = 'w';
  connected: boolean = false;

  onConnectionChange: ((connected: boolean) => void) | null = null;
  onPlayerJoined: (() => void) | null = null;
  onSpectatorCountChange: ((count: number) => void) | null = null;

  createGame(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.gameId = generateGameId();
      this.isHost = true;
      this.isSpectator = false;
      this.playerColor = 'w';

      const peerId = PEER_PREFIX + this.gameId;
      this.peer = new Peer(peerId);

      this.peer.on('open', () => {
        console.log('[Network] Hosting game:', this.gameId);
        resolve(this.gameId);
      });

      this.peer.on('connection', (conn: DataConnection) => {
        if (!this.playerConnection) {
          // First connection = opponent player
          this.playerConnection = conn;
          this.setupPlayerConnection(conn);
        } else {
          // Subsequent connections = spectators
          this.setupSpectatorConnection(conn);
        }
      });

      this.peer.on('error', (err) => {
        console.error('[Network] Peer error:', err);
        reject(err);
      });
    });
  }

  joinGame(gameId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.gameId = gameId;
      this.isHost = false;
      this.isSpectator = false;
      this.playerColor = 'b';

      this.peer = new Peer();

      this.peer.on('open', () => {
        const remotePeerId = PEER_PREFIX + gameId;
        const conn = this.peer!.connect(remotePeerId, { reliable: true });
        this.playerConnection = conn;
        this.setupPlayerConnection(conn);

        conn.on('open', () => {
          resolve();
        });

        conn.on('error', (err) => {
          reject(err);
        });
      });

      this.peer.on('error', (err) => {
        console.error('[Network] Peer error:', err);
        reject(err);
      });
    });
  }

  joinAsSpectator(gameId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.gameId = gameId;
      this.isHost = false;
      this.isSpectator = true;

      this.peer = new Peer();

      this.peer.on('open', () => {
        const remotePeerId = PEER_PREFIX + gameId;
        const conn = this.peer!.connect(remotePeerId, { reliable: true });
        this.playerConnection = conn;

        conn.on('open', () => {
          this.connected = true;
          console.log('[Network] Spectator connected');
          this.onConnectionChange?.(true);
          // Identify as spectator
          conn.send({ type: 'player-info', data: { role: 'spectator' } });
          resolve();
        });

        conn.on('data', (data: unknown) => {
          const msg = data as GameMessage;
          for (const handler of this.messageHandlers) {
            handler(msg);
          }
        });

        conn.on('close', () => {
          this.connected = false;
          this.onConnectionChange?.(false);
        });

        conn.on('error', (err) => {
          reject(err);
        });
      });

      this.peer.on('error', (err) => {
        console.error('[Network] Peer error:', err);
        reject(err);
      });
    });
  }

  private setupPlayerConnection(conn: DataConnection): void {
    conn.on('open', () => {
      this.connected = true;
      console.log('[Network] Player connection established');
      this.onConnectionChange?.(true);
      this.onPlayerJoined?.();
    });

    conn.on('data', (data: unknown) => {
      const msg = data as GameMessage;
      console.log('[Network] Received:', msg.type);

      // Host: relay moves and chat to spectators
      if (this.isHost && (msg.type === 'move' || msg.type === 'chat' || msg.type === 'reaction')) {
        this.broadcastToSpectators(msg);
      }

      for (const handler of this.messageHandlers) {
        handler(msg);
      }
    });

    conn.on('close', () => {
      this.connected = false;
      console.log('[Network] Player connection closed');
      this.onConnectionChange?.(false);
    });

    conn.on('error', (err) => {
      console.error('[Network] Connection error:', err);
    });
  }

  private setupSpectatorConnection(conn: DataConnection): void {
    this.spectatorConnections.push(conn);
    const count = this.spectatorConnections.length;
    console.log(`[Network] Spectator joined (${count} total)`);
    this.onSpectatorCountChange?.(count);

    // Broadcast updated count to all
    this.broadcast({ type: 'spectator-count', data: { count } });

    // Listen for spectator messages (reactions)
    conn.on('data', (data: unknown) => {
      const msg = data as GameMessage;
      if (msg.type === 'reaction') {
        // Relay reaction to player and all other spectators
        if (this.playerConnection && this.playerConnection.open) {
          this.playerConnection.send(msg);
        }
        for (const sc of this.spectatorConnections) {
          if (sc !== conn && sc.open) {
            sc.send(msg);
          }
        }
        // Also notify host's own handlers
        for (const handler of this.messageHandlers) {
          handler(msg);
        }
      }
    });

    conn.on('close', () => {
      this.spectatorConnections = this.spectatorConnections.filter((c) => c !== conn);
      const newCount = this.spectatorConnections.length;
      console.log(`[Network] Spectator left (${newCount} total)`);
      this.onSpectatorCountChange?.(newCount);
      this.broadcast({ type: 'spectator-count', data: { count: newCount } });
    });

    conn.on('error', (err) => {
      console.error('[Network] Spectator connection error:', err);
    });
  }

  /** Send to the opponent player only */
  send(msg: GameMessage): void {
    if (this.playerConnection && this.connected) {
      this.playerConnection.send(msg);

      // Host: also relay to spectators for moves/chat
      if (this.isHost && (msg.type === 'move' || msg.type === 'chat' || msg.type === 'reaction')) {
        this.broadcastToSpectators(msg);
      }
    } else {
      console.warn('[Network] Cannot send - not connected');
    }
  }

  /** Send to all connections (player + spectators). Used by host. */
  broadcast(msg: GameMessage): void {
    if (this.playerConnection && this.connected) {
      this.playerConnection.send(msg);
    }
    this.broadcastToSpectators(msg);
  }

  private broadcastToSpectators(msg: GameMessage): void {
    for (const conn of this.spectatorConnections) {
      if (conn.open) {
        conn.send(msg);
      }
    }
  }

  onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  offMessage(handler: MessageHandler): void {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }

  getSpectatorCount(): number {
    return this.spectatorConnections.length;
  }

  disconnect(): void {
    if (this.playerConnection) {
      this.playerConnection.close();
      this.playerConnection = null;
    }
    for (const conn of this.spectatorConnections) {
      conn.close();
    }
    this.spectatorConnections = [];
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.connected = false;
    this.isSpectator = false;
    this.messageHandlers = [];
    this.onConnectionChange?.(false);
    console.log('[Network] Disconnected');
  }
}

export const networkManager = new NetworkManager();
