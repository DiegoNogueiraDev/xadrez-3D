import Peer, { DataConnection } from 'peerjs';
import { generateGameId } from '../utils/helpers';
import { PieceColor } from '../utils/constants';

type MessageHandler = (msg: GameMessage) => void;

export interface GameMessage {
  type: 'move' | 'resign' | 'offer-draw' | 'accept-draw' | 'sync' | 'ready';
  data?: any;
}

const PEER_PREFIX = 'xadrez3d-';

export class NetworkManager {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private messageHandlers: MessageHandler[] = [];

  gameId: string = '';
  isHost: boolean = false;
  playerColor: PieceColor = 'w';
  connected: boolean = false;

  onConnectionChange: ((connected: boolean) => void) | null = null;
  onPlayerJoined: (() => void) | null = null;

  createGame(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.gameId = generateGameId();
      this.isHost = true;
      this.playerColor = 'w';

      const peerId = PEER_PREFIX + this.gameId;
      this.peer = new Peer(peerId);

      this.peer.on('open', () => {
        console.log('[Network] Hosting game:', this.gameId);
        resolve(this.gameId);
      });

      this.peer.on('connection', (conn: DataConnection) => {
        this.connection = conn;
        this.setupConnection(conn);
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
      this.playerColor = 'b';

      this.peer = new Peer();

      this.peer.on('open', () => {
        const remotePeerId = PEER_PREFIX + gameId;
        const conn = this.peer!.connect(remotePeerId, { reliable: true });
        this.connection = conn;
        this.setupConnection(conn);

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

  private setupConnection(conn: DataConnection): void {
    conn.on('open', () => {
      this.connected = true;
      console.log('[Network] Connection established');
      this.onConnectionChange?.(true);
      this.onPlayerJoined?.();
    });

    conn.on('data', (data: unknown) => {
      const msg = data as GameMessage;
      console.log('[Network] Received:', msg.type);
      for (const handler of this.messageHandlers) {
        handler(msg);
      }
    });

    conn.on('close', () => {
      this.connected = false;
      console.log('[Network] Connection closed');
      this.onConnectionChange?.(false);
    });

    conn.on('error', (err) => {
      console.error('[Network] Connection error:', err);
    });
  }

  send(msg: GameMessage): void {
    if (this.connection && this.connected) {
      this.connection.send(msg);
      console.log('[Network] Sent:', msg.type);
    } else {
      console.warn('[Network] Cannot send - not connected');
    }
  }

  onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  disconnect(): void {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.connected = false;
    this.messageHandlers = [];
    this.onConnectionChange?.(false);
    console.log('[Network] Disconnected');
  }
}
